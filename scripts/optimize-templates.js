import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { promisify } from "util";
import pkg from "glob";
const { glob } = pkg;
import { exec } from "child_process";

const execPromise = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 定义要忽略的文件和目录模式
const ignoredPatterns = [
  "**/node_modules/**",
  "**/.git/**",
  "**/.DS_Store",
  "**/dist/**",
  "**/.cache/**",
  "**/.vscode/**",
  "**/.idea/**",
  "**/*.map",
  "**/coverage/**",
  "**/tests/**",
  "**/__tests__/**",
  "**/test/**",
  "**/docs/**",
  "**/examples/**",
  "**/README.md",
  "**/CHANGELOG.md",
  "**/LICENSE",
  "**/package-lock.json",
  "**/yarn.lock",
  "**/pnpm-lock.yaml",
  "**/thumbs.db",
  "**/ehthumbs.db",
  "**/*.log",
  "**/*.bak",
  "**/*.swp",
  "**/*.tmp",
];

// 简化处理：我们暂时不进行复杂的压缩，而是直接复制模板目录
async function compressTemplates() {
  try {
    // 创建输出目录
    const outputDir = path.resolve(rootDir, "dist/templates");
    await fs.ensureDir(outputDir);

    // 获取模板目录下的所有文件
    const templates = await fs.readdir(path.resolve(rootDir, "templates"));

    for (const template of templates) {
      const templatePath = path.resolve(rootDir, "templates", template);
      const isDirectory = (await fs.stat(templatePath)).isDirectory();

      if (isDirectory) {
        // 对于目录（如react, vue等），直接创建tar包
        const outputPath = path.resolve(outputDir, `${template}.tar.gz`);
        console.log(`将${template}模板压缩到${outputPath}...`);
        
        // 使用简单的tar命令压缩
        const tarCommand = `tar -czf "${outputPath}" -C "${rootDir}/templates" "${template}"`;
        await execPromise(tarCommand);
        
        console.log(`${template}模板压缩完成！`);
      } else {
        // 对于文件（如README.md），直接复制
        await fs.copy(templatePath, path.resolve(outputDir, template));
      }
    }

    console.log("所有模板压缩完成！");
  } catch (error) {
    console.error("压缩模板时出错:", error);
    process.exit(1);
  }
}

compressTemplates();
