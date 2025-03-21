import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from 'url';
import { extractTemplate } from './extract-template.js';

// 获取模板目录函数
const getTemplatesDir = () => {
  // 获取当前运行脚本的目录
  const currentDir = path.dirname(process.argv[1]);
  
  // 尝试多个可能的路径
  const possiblePaths = [
    // 1. 本地开发环境
    path.resolve(process.cwd(), "templates"),
    
    // 2. 全局安装环境 - 相对于当前脚本
    path.resolve(currentDir, "../templates"),
    
    // 3. 全局安装环境 - 相对于当前文件路径 (对打包后的代码)
    path.resolve(process.cwd(), "../templates"),
    
    // 4. 兜底使用process.env.PACKAGE_ROOT
    path.resolve(process.env.PACKAGE_ROOT || ".", "templates")
  ];
  
  // 查找第一个存在的路径
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        console.log(`找到模板目录: ${p}`);
        return p;
      }
    } catch (e) {
      // 忽略权限等错误，继续尝试下一个路径
    }
  }
  
  // 默认返回当前目录下的templates
  return path.resolve("templates");
};

/**
 * 创建项目
 * @param {Object} options - 项目配置选项
 */
export async function createProject(options) {
  const {
    name,
    framework,
    language,
    store,
    useRouter,
    useEslint,
    usePrettier,
    useJsx,
    useDevTools,
    templateDir,
    targetDir,
  } = options;

  // 确保目标目录存在
  await fs.ensureDir(targetDir);

  // 提取并复制基础模板
  const languageFolder = language === 'typescript' ? 'TypeScript' : 'JavaScript';
  await extractTemplate(framework, targetDir, languageFolder);

  // 根据用户选择添加功能
  await addFeatures({
    targetDir,
    framework,
    language,
    store,
    useRouter,
    useEslint,
    usePrettier,
    useJsx,
    useDevTools,
    projectName: name,
  });

  // 创建配置文件
  await createConfigFile(targetDir, language, {
    framework,
    language,
    store,
    useRouter,
    useEslint,
    usePrettier,
    useJsx,
    useDevTools,
  });
}

/**
 * 复制基础模板 - 这个函数保留仅用于向后兼容
 * @param {string} templateDir - 模板目录
 * @param {string} targetDir - 目标目录
 * @param {string} language - 开发语言 (javascript/typescript)
 */
async function copyBaseTemplate(templateDir, targetDir, language) {
  // 这个函数现在由extractTemplate替代了
  // 但我们保留它以确保现有代码不会中断
  console.warn('copyBaseTemplate已弃用，请使用extractTemplate');
}

/**
 * 根据用户选择添加功能
 * @param {Object} options - 选项
 */
async function addFeatures(options) {
  const {
    targetDir,
    framework,
    language,
    store,
    useRouter,
    useEslint,
    usePrettier,
    useJsx,
    useDevTools,
    projectName,
  } = options;

  // 根据用户选择删除不需要的功能文件和目录
  await removeUnwantedFeatures(targetDir, {
    framework,
    language,
    store,
    useRouter,
    useEslint,
    usePrettier,
    useJsx,
    useDevTools,
  });

  // 修改 package.json
  const packageJsonPath = path.join(targetDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);

  // 设置项目名称
  packageJson.name = projectName;

  // 添加依赖项
  const dependencies = {};
  const devDependencies = {};

  // 根据框架添加基本依赖
  if (framework === "react") {
    dependencies["react"] = "^18.2.0";
    dependencies["react-dom"] = "^18.2.0";
  } else if (framework === "vue") {
    dependencies["vue"] = "^3.3.4";
  }

  // 添加状态管理
  if (store) {
    if (framework === "react") {
      if (store === "redux") {
        dependencies["redux"] = "^4.2.1";
        dependencies["react-redux"] = "^8.1.3";
        dependencies["@reduxjs/toolkit"] = "^1.9.5";
      } else if (store === "mobx") {
        dependencies["mobx"] = "^6.10.2";
        dependencies["mobx-react-lite"] = "^4.0.5";
      }
    } else if (framework === "vue") {
      if (store === "vuex") {
        dependencies["vuex"] = "^4.1.0";
      } else if (store === "pinia") {
        dependencies["pinia"] = "^2.1.6";
      }
    }
  }

  // 添加路由
  if (useRouter) {
    if (framework === "react") {
      dependencies["react-router-dom"] = "^6.16.0";
    } else if (framework === "vue") {
      dependencies["vue-router"] = "^4.2.4";
    }
  }

  // 添加 ESLint
  if (useEslint) {
    devDependencies["eslint"] = "^8.50.0";

    if (framework === "react") {
      devDependencies["eslint-plugin-react"] = "^7.33.2";
      devDependencies["eslint-plugin-react-hooks"] = "^4.6.0";
    } else if (framework === "vue") {
      devDependencies["eslint-plugin-vue"] = "^9.17.0";
    }

    if (language === "typescript") {
      devDependencies["@typescript-eslint/eslint-plugin"] = "^6.7.4";
      devDependencies["@typescript-eslint/parser"] = "^6.7.4";
    }
  }

  // 添加 Prettier
  if (usePrettier) {
    devDependencies["prettier"] = "^3.0.3";
    if (useEslint) {
      devDependencies["eslint-config-prettier"] = "^9.0.0";
      devDependencies["eslint-plugin-prettier"] = "^5.0.0";
    }
  }

  // Vue JSX 支持
  if (framework === "vue" && useJsx) {
    devDependencies["@vitejs/plugin-vue-jsx"] = "^3.0.2";
  }

  // 添加 DevTools
  if (useDevTools) {
    if (framework === "react") {
      if (store === "redux") {
        devDependencies["redux-devtools-extension"] = "^2.13.9";
      }
    } else if (framework === "vue") {
      devDependencies["@vue/devtools"] = "^6.5.1";
    }
  }

  // 更新 package.json
  packageJson.dependencies = { ...packageJson.dependencies, ...dependencies };
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...devDependencies,
  };

  // 添加 ESLint 配置
  if (useEslint) {
    await createEslintConfig(targetDir, {
      framework,
      language,
      usePrettier,
    });
  }

  // 添加 Prettier 配置
  if (usePrettier) {
    await createPrettierConfig(targetDir);
  }

  // 保存 package.json
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
}

/**
 * 创建 ESLint 配置
 * @param {string} targetDir - 目标目录
 * @param {Object} options - 选项
 */
async function createEslintConfig(targetDir, options) {
  const { framework, language, usePrettier } = options;
  let eslintConfig = {
    root: true,
    env: {
      browser: true,
      node: true,
      es2022: true,
    },
    extends: [],
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      // 按照需求添加默认规则
      camelcase: ["error", { properties: "never" }], // 不允许使用小驼峰
      "max-lines": ["error", 1000], // 每个文件不超过1000行代码
      "semi": ["error", "never"], // 不需要分号
      "semi-spacing": ["error", { "before": false, "after": true }], // 分号前后的空格规则
    },
  };

  // 根据框架添加配置
  if (framework === "react") {
    eslintConfig.extends.push("plugin:react/recommended");
    eslintConfig.extends.push("plugin:react-hooks/recommended");
    eslintConfig.parserOptions = {
      ecmaFeatures: {
        jsx: true,
      },
    };
    // 添加React特有的规则
    eslintConfig.rules["react/react-in-jsx-scope"] = "off"; // 允许JSX中不导入React
  } else if (framework === "vue") {
    eslintConfig.extends.push("plugin:vue/vue-recommended");
  }

  // 根据语言添加配置
  if (language === "typescript") {
    eslintConfig.extends.push("plugin:@typescript-eslint/recommended");
    eslintConfig.parser = "@typescript-eslint/parser";
    // TypeScript特有的规则
    eslintConfig.rules["@typescript-eslint/semi"] = ["error", "never"]; // TS中也不需要分号
  }

  // 添加 Prettier 配置
  if (usePrettier) {
    eslintConfig.extends.push("plugin:prettier/recommended");
  }

  // 写入 .eslintrc.json 文件
  await fs.writeJson(path.join(targetDir, ".eslintrc.json"), eslintConfig, {
    spaces: 2,
  });
}

/**
 * 创建 Prettier 配置
 * @param {string} targetDir - 目标目录
 */
async function createPrettierConfig(targetDir) {
  const prettierConfig = {
    printWidth: 100,
    tabWidth: 2,
    semi: false,
    singleQuote: true,
    trailingComma: "es5",
    arrowParens: "avoid",
    endOfLine: "lf",
  };

  // 写入 .prettierrc 文件
  await fs.writeJson(path.join(targetDir, ".prettierrc"), prettierConfig, {
    spaces: 2,
  });
}

/**
 * 创建配置文件
 * @param {string} targetDir - 目标目录
 * @param {string} language - 语言
 * @param {Object} options - 选项
 */
async function createConfigFile(targetDir, language, options) {
  const { framework } = options;

  // 确保 build 目录存在
  const buildDir = path.join(targetDir, "build");
  await fs.ensureDir(buildDir);

  // 根据框架和语言选择正确的配置文件
  const configFilename =
    language === "typescript" ? "odos.config.ts" : "odos.config.js";
  const targetConfigPath = path.join(buildDir, configFilename);

  try {
    // 使用与extractTemplate相同的模板查找逻辑
    const templatesDir = getTemplatesDir();
    const templateConfigPath = path.resolve(
      templatesDir,
      framework,
      language === "typescript" ? "TypeScript" : "JavaScript",
      "build",
      configFilename
    );

    console.log("尝试从路径加载配置文件:", templateConfigPath);
    
    // 检查模板配置文件是否存在
    if (await fs.pathExists(templateConfigPath)) {
      await fs.copyFile(templateConfigPath, targetConfigPath);
      console.log("成功复制配置文件");
    } else {
      // 尝试从打包后的模板文件中解压配置文件
      const tempDir = path.join(targetDir, "_temp_config");
      await fs.ensureDir(tempDir);
      
      // 解压模板
      const archiveFile = path.resolve(templatesDir, `${framework}.tar.gz`);
      console.log("尝试从压缩包加载配置文件:", archiveFile);
      
      if (await fs.pathExists(archiveFile)) {
        // 使用命令行解压特定配置文件
        const extractPath = `${framework}/${language === "typescript" ? "TypeScript" : "JavaScript"}/build/${configFilename}`;
        const result = await new Promise((resolve) => {
          const tar = require('child_process').spawn("tar", [
            "-xzf",
            archiveFile,
            "-C", 
            tempDir,
            extractPath
          ]);
          
          tar.on("close", (code) => {
            resolve(code === 0);
          });
        });
        
        if (result) {
          // 复制解压后的文件
          const extractedPath = path.join(tempDir, extractPath);
          await fs.copyFile(extractedPath, targetConfigPath);
          await fs.remove(tempDir);
          console.log("成功从压缩包提取配置文件");
        } else {
          throw new Error(`无法从模板压缩包提取配置文件: ${archiveFile}`);
        }
      } else {
        throw new Error(`找不到模板压缩包: ${archiveFile}`);
      }
    }
  } catch (error) {
    throw new Error(`配置文件创建失败: ${error.message}`);
  }
}

/**
 * 根据用户选择删除不需要的功能文件和目录
 * @param {string} targetDir - 目标目录
 * @param {Object} options - 用户选择项
 */
async function removeUnwantedFeatures(targetDir, options) {
  const {
    framework,
    language,
    store,
    useRouter,
    useEslint,
    usePrettier,
    useJsx,
    useDevTools,
  } = options;

  const srcDir = path.join(targetDir, "src");

  // 处理状态管理相关文件
  if (!store) {
    // 如果用户没有选择状态管理，删除相关目录和文件
    const storeDir = path.join(srcDir, "store");
    if (await fs.pathExists(storeDir)) {
      await fs.remove(storeDir);
    }

    // 根据框架删除额外的状态管理相关导入和引用
    if (framework === "react") {
      // 在 React 项目中可能需要修改 app.jsx/app.tsx
      const appFile = path.join(
        srcDir,
        language === "typescript" ? "app.tsx" : "app.jsx"
      );
      if (await fs.pathExists(appFile)) {
        let content = await fs.readFile(appFile, "utf8");
        // 移除 Redux Provider 或 MobX 相关导入和包装
        content = content.replace(
          /import \{.*?(Provider|StoreProvider).*?\} from ['"].*?(redux|mobx).*?['"]/g,
          ""
        );
        content = content.replace(
          /<Provider.*?>|<\/Provider>|<StoreProvider.*?>|<\/StoreProvider>/g,
          ""
        );
        await fs.writeFile(appFile, content);
      }
    } else if (framework === "vue") {
      // 在 Vue 项目中可能需要修改 main.js/main.ts
      const mainFile = path.join(
        srcDir,
        language === "typescript" ? "main.ts" : "main.js"
      );
      if (await fs.pathExists(mainFile)) {
        let content = await fs.readFile(mainFile, "utf8");
        // 移除 Vuex 或 Pinia 相关导入和使用
        content = content.replace(
          /import .*?(store|createPinia).*? from ['"].*?(vuex|pinia).*?['"]/g,
          ""
        );
        content = content.replace(
          /import store from ['"]\.\/store.*?['"]/g,
          ""
        );
        content = content.replace(/app\.use\(store\)/g, "");
        content = content.replace(/app\.use\(createPinia\(\)\)/g, "");
        await fs.writeFile(mainFile, content);
      }
    }
  } else if (framework === "react" && store) {
    // 如果选择了特定的状态管理，删除其他状态管理选项
    if (store === "redux") {
      const mobxDir = path.join(srcDir, "store", "mobx");
      if (await fs.pathExists(mobxDir)) {
        await fs.remove(mobxDir);
      }
    } else if (store === "mobx") {
      const reduxDir = path.join(srcDir, "store", "redux");
      if (await fs.pathExists(reduxDir)) {
        await fs.remove(reduxDir);
      }
    }
  } else if (framework === "vue" && store) {
    // 如果选择了特定的状态管理，删除其他状态管理选项
    if (store === "vuex") {
      const piniaDir = path.join(srcDir, "store", "pinia");
      if (await fs.pathExists(piniaDir)) {
        await fs.remove(piniaDir);
      }
    } else if (store === "pinia") {
      const vuexDir = path.join(srcDir, "store", "vuex");
      if (await fs.pathExists(vuexDir)) {
        await fs.remove(vuexDir);
      }
    }
  }

  // 处理路由相关文件
  if (!useRouter) {
    // 如果用户没有选择路由，删除路由目录
    const routerDir = path.join(srcDir, "router");
    if (await fs.pathExists(routerDir)) {
      await fs.remove(routerDir);
    }

    // 删除页面目录，因为页面通常与路由配合使用
    const pagesDir = path.join(srcDir, "pages");
    if (await fs.pathExists(pagesDir)) {
      await fs.remove(pagesDir);
    }

    // 根据框架修改相关文件
    if (framework === "react") {
      // 在 React 项目中可能需要修改 app.jsx/app.tsx
      const appFile = path.join(
        srcDir,
        language === "typescript" ? "app.tsx" : "app.jsx"
      );
      if (await fs.pathExists(appFile)) {
        let content = await fs.readFile(appFile, "utf8");
        // 移除 React Router 相关导入和使用
        content = content.replace(
          /import \{.*?Routes.*?Route.*?\} from ['"]react-router-dom['"]/g,
          ""
        );
        content = content.replace(
          /import \{.*?BrowserRouter.*?\} from ['"]react-router-dom['"]/g,
          ""
        );
        content = content.replace(
          /<BrowserRouter>|<\/BrowserRouter>|<Routes>|<\/Routes>|<Route.*?\/>/g,
          ""
        );
        // 可能需要添加简单的默认内容替代路由
        content = content.replace(
          /<Routes>.*?<\/Routes>/s,
          "<div>欢迎使用 ODOS React 应用</div>"
        );
        await fs.writeFile(appFile, content);
      }
    } else if (framework === "vue") {
      // 在 Vue 项目中可能需要修改 main.js/main.ts
      const mainFile = path.join(
        srcDir,
        language === "typescript" ? "main.ts" : "main.js"
      );
      if (await fs.pathExists(mainFile)) {
        let content = await fs.readFile(mainFile, "utf8");
        // 移除 Vue Router 相关导入和使用
        content = content.replace(/import router from ['"]\.\/router['"]/g, "");
        content = content.replace(/app\.use\(router\)/g, "");
        await fs.writeFile(mainFile, content);
      }

      // 修改 app.vue
      const appFile = path.join(srcDir, "app.vue");
      if (await fs.pathExists(appFile)) {
        let content = await fs.readFile(appFile, "utf8");
        // 替换 router-view 为简单内容
        content = content.replace(
          /<router-view\s*\/>/g,
          '<div class="welcome">欢迎使用 ODOS Vue 应用</div>'
        );
        await fs.writeFile(appFile, content);
      }
    }
  }

  // 处理 ESLint 和 Prettier 配置
  if (!useEslint) {
    const eslintrcFile = path.join(targetDir, ".eslintrc.json");
    if (await fs.pathExists(eslintrcFile)) {
      await fs.remove(eslintrcFile);
    }
  }

  if (!usePrettier) {
    const prettierrcFile = path.join(targetDir, ".prettierrc");
    if (await fs.pathExists(prettierrcFile)) {
      await fs.remove(prettierrcFile);
    }
  }

  // 处理 Vue JSX 支持
  if (framework === "vue" && !useJsx) {
    // 可能需要修改 Vite 配置，移除 JSX 插件
    const configFile = path.join(
      targetDir,
      "build",
      language === "typescript" ? "odos.config.ts" : "odos.config.js"
    );
    if (await fs.pathExists(configFile)) {
      let content = await fs.readFile(configFile, "utf8");
      content = content.replace(/vueJsx\(\)/g, "");
      content = content.replace(
        /import vueJsx from ['"]@vitejs\/plugin-vue-jsx['"]/g,
        ""
      );
      await fs.writeFile(configFile, content);
    }
  }
}
