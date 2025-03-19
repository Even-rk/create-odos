# ODOS 模板

此目录包含 ODOS 脚手架使用的模板，用于生成不同框架和语言的项目。

## 目录结构

```
templates/
├── react/              # React 模板
│   ├── javascript/     # React JavaScript 模板
│   └── typescript/     # React TypeScript 模板
├── vue/                # Vue3 模板
│   ├── javascript/     # Vue3 JavaScript 模板
│   └── typescript/     # Vue3 TypeScript 模板
└── README.md           # 本文件
```

## 模板组织

每个模板都包含以下内容：

1. 基础项目结构
2. 打包配置文件 (`build/odos.config.js` 或 `build/odos.config.ts`)
3. 状态管理示例 (Redux/MobX 或 Vuex/Pinia)
4. 路由配置示例
5. 代码规范工具配置 (ESLint, Prettier)
6. 开发者工具

## 添加新模板

如果你想添加新的模板或修改现有模板，请遵循以下步骤：

1. 确保遵循 ODOS 的默认规范（不使用大驼峰文件名，不使用小驼峰变量名等）
2. 添加必要的示例代码
3. 确保所有配置文件放置在正确的位置
4. 更新此 README 文件以反映你的更改

## 模板规范

所有模板必须遵循 ODOS 的默认规范：

1. 所有文件名不使用大驼峰命名法
2. 所有变量不使用小驼峰命名法
3. 每个文件代码行数不超过 1000 行 