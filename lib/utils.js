import path from "path";
import fs from "fs-extra";
import { spawn } from "child_process";
import ejs from "ejs";

/**
 * 安装依赖项
 * @param {string} targetDir - 目标目录
 * @param {string} packageManager - 包管理器（默认为 pnpm）
 * @returns {Promise<void>}
 */
export function installDependencies(targetDir, packageManager = "pnpm") {
  return new Promise((resolve, reject) => {
    const command = packageManager;
    const args = ["install"];

    const child = spawn(command, args, {
      cwd: targetDir,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(" ")} 失败，退出码：${code}`));
        return;
      }
      resolve();
    });
  });
}

/**
 * 渲染模板文件
 * @param {string} templatePath - 模板文件路径
 * @param {string} targetPath - 目标文件路径
 * @param {Object} data - 模板数据
 */
export async function renderTemplate(templatePath, targetPath, data) {
  // 读取模板文件
  const template = await fs.readFile(templatePath, "utf8");

  // 渲染模板
  const rendered = ejs.render(template, data);

  // 写入目标文件
  await fs.writeFile(targetPath, rendered);
}

/**
 * 获取路径的相对路径
 * @param {string} from - 起始目录
 * @param {string} to - 目标目录
 * @returns {string} 相对路径
 */
export function getRelativePath(from, to) {
  return path.relative(from, to).replace(/\\/g, "/");
}

/**
 * 规范化文件名，确保不使用大驼峰
 * @param {string} filename - 文件名
 * @returns {string} 规范化后的文件名
 */
export function normalizeFilename(filename) {
  // 如果文件名是大驼峰（首字母大写），则将其转换为小写并用破折号连接
  if (/^[A-Z][a-zA-Z0-9]*$/.test(filename)) {
    return filename.replace(/([A-Z])/g, (match, p1, offset) => {
      return offset === 0 ? p1.toLowerCase() : "-" + p1.toLowerCase();
    });
  }
  return filename;
}

/**
 * 验证目录或文件名是否符合规范（不使用大驼峰）
 * @param {string} name - 名称
 * @returns {boolean} 是否符合规范
 */
export function validateName(name) {
  // 检查是否使用了大驼峰命名
  return !/^[A-Z][a-zA-Z0-9]*$/.test(name);
}

/**
 * 递归处理目录中的所有文件，应用转换函数
 * @param {string} dir - 目录路径
 * @param {Function} transform - 转换函数，接收文件内容和路径，返回处理后的内容
 */
export async function processDirectory(dir, transform) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      // 递归处理子目录
      await processDirectory(fullPath, transform);
    } else {
      // 处理文件
      const content = await fs.readFile(fullPath, "utf8");
      const newContent = await transform(content, fullPath);

      if (content !== newContent) {
        await fs.writeFile(fullPath, newContent);
      }
    }
  }
}
