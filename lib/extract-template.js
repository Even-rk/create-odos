import path from "path";
import fs from "fs-extra";
import { spawn } from "child_process";
import { fileURLToPath } from 'url';

// 在ESM模块中处理__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 在打包后使用相对路径，处理全局安装的情况
const getTemplatesDir = () => {
  // 尝试多个可能的路径
  const possiblePaths = [
    // 1. 本地开发环境
    path.resolve(process.cwd(), "templates"),
    
    // 2. 相对于当前文件的路径 - 开发和生产都适用
    path.resolve(__dirname, "../templates"),
    
    // 3. 全局安装环境 - npm全局安装路径
    path.resolve(__dirname, "../../templates"),
    
    // 4. 使用 process.env.PACKAGE_ROOT（由webpack设置）
    path.resolve(process.env.PACKAGE_ROOT || '.', 'templates'),
    
    // 5. 相对于当前目录尝试node_modules路径
    path.resolve(process.cwd(), "node_modules/create-odos/templates"),
    
    // 6. 尝试相对于node执行路径查找
    path.resolve(path.dirname(process.execPath), "../lib/node_modules/create-odos/templates")
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
 * 解压缩模板文件到目标目录
 * @param {string} framework - 框架名称 (如 'react', 'vue')
 * @param {string} targetDir - 目标输出目录
 * @param {string} variant - 模板变体 (如 'TypeScript', 'JavaScript')
 * @returns {Promise<void>}
 */
export async function extractTemplate(framework, targetDir, variant) {
  console.log(`开始提取${framework}模板（${variant}）到${targetDir}...`);
  
  // 获取模板目录
  const templatesDir = getTemplatesDir();
  console.log(`使用模板目录: ${templatesDir}`);
  
  // 使用压缩包提取模板
  const templateFile = path.resolve(templatesDir, `${framework}.tar.gz`);
  console.log(`尝试从压缩包提取模板: ${templateFile}`);

  if (!(await fs.pathExists(templateFile))) {
    // 提供更详细的错误信息
    throw new Error(`找不到${framework}模板文件(${templateFile})，请确保安装了最新版本的包。
可用模板目录: ${templatesDir}
当前目录内容: ${await fs.readdir(templatesDir).catch(() => '无法读取')}`);
  }

  // 创建临时目录用于解压
  const tempDir = path.join(targetDir, "__temp__");
  await fs.ensureDir(tempDir);
  console.log(`创建临时目录: ${tempDir}`);

  return new Promise((resolve, reject) => {
    // 先将压缩包解压到临时目录
    console.log(`执行解压命令: tar -xzf ${templateFile} -C ${tempDir}`);
    const tar = spawn("tar", ["-xzf", templateFile, "-C", tempDir]);

    tar.on("close", (code) => {
      if (code === 0) {
        try {
          // 找到解压后的变体目录
          const variantPath = path.join(tempDir, framework, variant);
          console.log(`查找变体目录: ${variantPath}`);

          if (fs.existsSync(variantPath)) {
            console.log(`找到变体目录，开始复制内容到目标目录`);
            // 将变体目录内容复制到目标目录
            fs.copySync(variantPath, targetDir, { overwrite: true });
            // 清理临时目录
            fs.removeSync(tempDir);
            console.log(`模板解压和复制完成，已清理临时目录`);
            resolve();
          } else {
            reject(new Error(`找不到模板变体 ${variant}，路径: ${variantPath}。
临时目录结构: ${JSON.stringify(fs.readdirSync(tempDir).map(f => `${f}: ${fs.existsSync(path.join(tempDir, f)) ? '存在' : '不存在'}`))}`));
          }
        } catch (err) {
          reject(new Error(`处理解压文件时出错: ${err.message}`));
        }
      } else {
        reject(new Error(`解压模板失败，退出代码：${code}`));
      }
    });

    tar.stderr.on("data", (data) => {
      console.error(`解压错误: ${data.toString()}`);
    });
  });
}

export default extractTemplate;
