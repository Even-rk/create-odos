import path from "path";
import fs from "fs-extra";
import { spawn } from "child_process";

// 在打包后使用相对路径
const getTemplatesDir = () => {
  // 尝试使用process.env.PACKAGE_ROOT（由webpack设置）
  const root = process.env.PACKAGE_ROOT || ".";
  return path.resolve(root, "templates");
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
    throw new Error(`找不到${framework}模板文件，请确保安装了最新版本的包`);
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
            reject(new Error(`找不到模板变体 ${variant}`));
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
