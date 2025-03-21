#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { fileURLToPath } from 'url';
import { createProject } from './lib/create.js';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取模板目录的函数，确保在打包环境中也能正确工作
const getTemplatesDir = () => {
  // 尝试多个可能的路径
  const possiblePaths = [
    // 1. 本地开发环境
    path.resolve(process.cwd(), "templates"),
    
    // 2. 相对于当前文件的路径
    path.resolve(__dirname, "templates"),
    
    // 3. 使用 process.env.PACKAGE_ROOT（由webpack设置）
    path.resolve(process.env.PACKAGE_ROOT || '.', 'templates')
  ];
  
  // 查找第一个存在的路径
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        console.log(`找到模板目录: ${p}`);
        return p;
      }
    } catch (e) {
      // 忽略错误，继续尝试下一个路径
    }
  }
  
  return path.resolve('.', 'templates');
};

// 设置版本号和描述
program
  .version('1.0.0')
  .description('ODOS 脚手架 - 快速创建前端项目');

// 主命令
program
  .argument('[name]', '项目名称')
  .action(async (name) => {
    // 如果没有提供项目名称，提示用户输入
    if (!name) {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'name',
          message: '请输入项目名称:',
          validate: (input) => {
            if (input.trim() === '') {
              return '项目名称不能为空';
            }
            return true;
          }
        }
      ]);
      name = answer.name;
    }

    // 检查项目目录是否已存在
    const projectPath = path.resolve(process.cwd(), name);
    if (fs.existsSync(projectPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `目录 ${name} 已存在。是否覆盖?`,
          default: false
        }
      ]);
      
      if (overwrite) {
        console.log(chalk.yellow(`\n正在删除 ${name}...`));
        await fs.remove(projectPath);
      } else {
        console.log(chalk.red('\n操作取消'));
        return;
      }
    }

    // 用户选择框架
    const { framework } = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: '请选择一个框架:',
        choices: ['react', 'vue']
      }
    ]);

    // 用户选择语言
    const { language } = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: '请选择开发语言:',
        choices: ['javascript', 'typescript']
      }
    ]);

    // 用户选择状态管理
    let store = null;
    if (framework === 'react') {
      const { useStore } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useStore',
          message: '是否添加全局状态管理?',
          default: false
        }
      ]);

      if (useStore) {
        const { storeType } = await inquirer.prompt([
          {
            type: 'list',
            name: 'storeType',
            message: '请选择状态管理工具:',
            choices: ['mobx', 'redux']
          }
        ]);
        store = storeType;
      }
    } else if (framework === 'vue') {
      const { useStore } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useStore',
          message: '是否添加全局状态管理?',
          default: false
        }
      ]);

      if (useStore) {
        const { storeType } = await inquirer.prompt([
          {
            type: 'list',
            name: 'storeType',
            message: '请选择状态管理工具:',
            choices: ['vuex', 'pinia']
          }
        ]);
        store = storeType;
      }
    }

    // 用户选择是否使用路由
    const { useRouter } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useRouter',
        message: `是否使用 ${framework === 'react' ? 'react-router' : 'vue-router'}?`,
        default: true
      }
    ]);

    // 用户选择是否使用 ESLint
    const { useEslint } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useEslint',
        message: '是否使用 ESLint?',
        default: true
      }
    ]);

    // 用户选择是否使用 Prettier
    const { usePrettier } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'usePrettier',
        message: '是否使用 Prettier?',
        default: true
      }
    ]);

    // Vue 特有选项 - jsx 支持
    let useJsx = false;
    if (framework === 'vue') {
      const { jsx } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'jsx',
          message: '是否使用 JSX 语法支持?',
          default: false
        }
      ]);
      useJsx = jsx;
    }

    // 是否添加 DevTools
    const { useDevTools } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'useDevTools',
        message: '是否添加 DevTools 工具?',
        default: true
      }
    ]);

    // 创建项目
    const spinner = ora('正在创建项目...').start();
    
    try {
      await createProject({
        name,
        framework,
        language,
        store,
        useRouter,
        useEslint,
        usePrettier,
        useJsx,
        useDevTools,
        templateDir: getTemplatesDir(),
        targetDir: projectPath
      });
      
      spinner.succeed(chalk.green(`项目 ${name} 创建成功！`));
      
      console.log('\n使用以下命令启动项目:');
      console.log(chalk.cyan(`  cd ${name}`));
      console.log(chalk.cyan('  pnpm install'));
      console.log(chalk.cyan('  pnpm dev'));
      
    } catch (error) {
      spinner.fail(chalk.red(`创建失败: ${error.message}`));
      console.error(error);
      // 清理创建的目录
      if (fs.existsSync(projectPath)) {
        await fs.remove(projectPath);
      }
    }
  });

// 解析命令行参数
program.parse(process.argv);
