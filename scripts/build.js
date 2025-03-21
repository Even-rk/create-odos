import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const rootDir = path.resolve(process.cwd());

async function build() {
  try {
    // 清理dist目录
    console.log("正在清理dist目录...");
    await fs.remove(path.resolve(rootDir, "dist"));
    await fs.ensureDir(path.resolve(rootDir, "dist"));

    // 创建directories目录结构
    await fs.ensureDir(path.resolve(rootDir, "dist/templates"));
    await fs.ensureDir(path.resolve(rootDir, "dist/lib"));

    // 运行webpack构建
    console.log("正在运行webpack打包...");
    execSync("pnpm exec webpack", { stdio: "inherit", cwd: rootDir });

    // 运行模板压缩脚本
    console.log("正在优化和压缩模板...");
    execSync("node ./scripts/optimize-templates.js", {
      stdio: "inherit",
      cwd: rootDir,
    });

    // 复制lib目录到dist
    console.log("正在复制lib文件...");
    await fs.copy(
      path.resolve(rootDir, "lib"),
      path.resolve(rootDir, "dist/lib"),
      { overwrite: true }
    );

    // 复制README和LICENSE
    console.log("正在复制项目文档...");
    await fs.copy(
      path.resolve(rootDir, "README.md"),
      path.resolve(rootDir, "dist/README.md")
    );
    await fs.copy(
      path.resolve(rootDir, "LICENSE"),
      path.resolve(rootDir, "dist/LICENSE")
    );

    // 复制并更新package.json
    console.log("正在准备package.json...");
    const packageJson = await fs.readJson(
      path.resolve(rootDir, "package.json")
    );

    // 更新package.json的主入口和文件列表
    packageJson.main = "index.js";
    delete packageJson.type;
    packageJson.files = [
      "index.js",
      "lib",
      "templates/**",
      "README.md",
      "LICENSE",
    ];

    await fs.writeJson(
      path.resolve(rootDir, "dist/package.json"),
      packageJson,
      { spaces: 2 }
    );

    console.log("构建完成！");

    // 计算并显示优化后的大小
    const distSize = calculateDirSize(path.resolve(rootDir, "dist"));
    const originalSize = calculateDirSize(rootDir, [
      "node_modules",
      ".git",
      "dist",
      ".idea",
    ]);

    console.log(`\n原始大小: ${formatSize(originalSize)}`);
    console.log(`优化后大小: ${formatSize(distSize)}`);
    console.log(
      `减少了: ${formatSize(originalSize - distSize)} (${Math.round(
        ((originalSize - distSize) / originalSize) * 100
      )}%)`
    );
  } catch (error) {
    console.error("构建过程中出错:", error);
    process.exit(1);
  }
}

function calculateDirSize(dirPath, excludes = []) {
  let size = 0;

  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (excludes.includes(file)) continue;

      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        size += calculateDirSize(filePath);
      } else {
        size += stats.size;
      }
    }
  } catch (error) {
    console.error(`计算 ${dirPath} 大小出错:`, error);
  }

  return size;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  else if (bytes < 1024 * 1024 * 1024)
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  else return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

build();
