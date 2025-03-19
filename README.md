# ODOS 脚手架工具

一个用于快速创建前端项目的脚手架工具，支持 React 和 Vue3，提供多种开发选项和配置。

## 特性

- 支持 React 和 Vue3 框架
- JavaScript 和 TypeScript 语言支持
- 状态管理集成 (React: Redux/MobX, Vue3: Vuex/Pinia)
- 路由管理 (React Router, Vue Router)
- 代码规范工具 (ESLint, Prettier)
- Vue3 的 JSX 支持
- 开发工具集成

## 使用方法

```bash
# 推荐方式（使用pnpm）
pnpm create odos my-app

# 使用 npm
npm create odos my-app

# 使用 yarn
yarn create odos my-app
```

如果你想全局安装：

```bash
# 使用 npm
npm install -g create-odos

# 使用 yarn
yarn global add create-odos

# 使用 pnpm
pnpm add -g create-odos

# 然后可以这样使用
create-odos my-app
# 或
odos my-app
```

然后按照提示进行选择：

1. 选择框架 (React 或 Vue3)
2. 选择开发语言 (JavaScript 或 TypeScript)
3. 是否添加状态管理及选择哪种状态管理工具
4. 是否添加路由
5. 是否使用 ESLint
6. 是否使用 Prettier
7. 是否需要 JSX 支持 (仅 Vue3)
8. 是否添加开发工具

### 启动项目

```bash
cd my-app
pnpm install
pnpm dev
```

## 目录结构

生成的项目结构如下：

```
my-app/
├── build/                # 构建配置
│   └── odos.config.js    # 项目配置文件
├── public/               # 静态资源
├── src/                  # 源代码
│   ├── components/       # 组件
│   ├── pages/            # 页面 (使用路由时)
│   ├── router/           # 路由配置 (使用路由时)
│   ├── store/            # 状态管理 (使用状态管理时)
│   ├── styles/           # 样式文件
│   ├── app.[jsx|tsx|vue] # 应用组件
│   └── main.[js|ts]      # 入口文件
├── .eslintrc.json        # ESLint配置 (如果选择)
├── .prettierrc           # Prettier配置 (如果选择)
├── index.html            # HTML模板
├── package.json          # 依赖管理
└── [tsconfig.json]       # TypeScript配置 (如果使用TS)
```

## 环境要求

- Node.js v14.0.0 或更高版本
- npm, yarn 或 pnpm

## 贡献

欢迎提交 issue 或 pull request 来帮助改进这个项目。

## 许可证

[MIT](LICENSE)
