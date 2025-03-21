import path from "path";
import fs from "fs-extra";
import { spawn } from "child_process";
import { fileURLToPath } from 'url';

// 在ESM模块中处理__dirname
const __filename = fileURLToPath(import.meta.url);

// 在打包后使用相对路径，处理全局安装的情况
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
 * 解压缩模板文件到目标目录
 * @param {string} framework - 框架名称 (如 'react', 'vue')
 * @param {string} targetDir - 目标输出目录
 * @param {string} variant - 模板变体 (如 'TypeScript', 'JavaScript')
 * @returns {Promise<void>}
 */
export async function extractTemplate(framework, targetDir, variant) {
  const templatesDir = getTemplatesDir();
  const templateFile = path.resolve(templatesDir, `${framework}.tar.gz`);

  if (!(await fs.pathExists(templateFile))) {
    // 提供更详细的错误信息
    throw new Error(`找不到${framework}模板文件(${templateFile})，请确保安装了最新版本的包`);
  }

  // 创建临时目录用于解压
  const tempDir = path.join(targetDir, "__temp__");
  await fs.ensureDir(tempDir);

  return new Promise((resolve, reject) => {
    // 先将压缩包解压到临时目录
    const tar = spawn("tar", ["-xzf", templateFile, "-C", tempDir]);

    tar.on("close", (code) => {
      if (code === 0) {
        try {
          // 找到解压后的变体目录
          const variantPath = path.join(tempDir, framework, variant);

          if (fs.existsSync(variantPath)) {
            // 将变体目录内容复制到目标目录
            fs.copySync(variantPath, targetDir, { overwrite: true });
            // 清理临时目录
            fs.removeSync(tempDir);
            resolve();
          } else {
            reject(new Error(`找不到模板变体 ${variant}，路径: ${variantPath}`));
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
