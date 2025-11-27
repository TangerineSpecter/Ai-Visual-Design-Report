# AI 视觉设计报告

一个基于 React + Vite + Tailwind CSS 构建的可视化设计报告项目，展示 AI 辅助的视觉设计能力和交互效果。

## 技术栈

- **前端框架**: React 19.2.0
- **构建工具**: Vite 7.2.4
- **样式框架**: Tailwind CSS 3.4.18
- **CSS 后处理器**: PostCSS 8.5.6
- **代码规范**: ESLint 9.39.1

## 依赖组件与版本

### 核心依赖

- react: ^19.2.0
- react-dom: ^19.2.0

### 开发依赖

- @eslint/js: ^9.39.1
- @types/react: ^19.2.5
- @types/react-dom: ^19.2.3
- @vitejs/plugin-react: ^5.1.1
- autoprefixer: ^10.4.22
- eslint: ^9.39.1
- eslint-plugin-react-hooks: ^7.0.1
- eslint-plugin-react-refresh: ^0.4.24
- globals: ^16.5.0
- postcss: ^8.5.6
- tailwindcss: ^3.4.18
- vite: ^7.2.4

## 项目结构

```
Ai-Visual-Design-Report/
├── .gitignore             # Git忽略配置
├── LICENSE                # 许可证文件
├── README.md              # 项目说明文档
├── eslint.config.js       # ESLint配置
├── index.html             # HTML模板
├── package-lock.json      # npm依赖锁定文件
├── package.json           # 项目配置和依赖
├── postcss.config.js      # PostCSS配置
├── public/                # 静态资源目录
│   └── vite.svg           # Vite默认图标
├── src/                   # 源代码目录
│   ├── App.css            # App组件样式
│   ├── App.jsx            # 主应用组件
│   ├── assets/            # 资源文件
│   │   └── react.svg      # React图标
│   ├── components/        # 自定义组件
│   │   └── Icons.jsx      # 图标组件库
│   ├── index.css          # 全局样式和Tailwind指令
│   └── main.jsx           # 应用入口文件
├── tailwind.config.js     # Tailwind CSS配置
└── vite.config.js         # Vite配置
```

## 安装与运行

### 前置要求

- Node.js 版本 22.14.0（推荐使用此版本以获得最佳兼容性）
- npm 或 yarn

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式运行

```bash
npm run dev
# 或
yarn dev
```

开发服务器启动后，可通过以下地址访问应用：
- 本地地址: http://localhost:5173/
- 如果端口被占用，Vite 会自动使用其他可用端口

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建产物将生成在 `dist` 目录中。

### 预览生产构建

```bash
npm run preview
# 或
yarn preview
```

## 主要功能

- AI 辅助的视觉设计展示
- 响应式布局，适配各种设备
- 现代化 UI 组件和交互效果
- 可视化图表和数据展示

## 自定义配置

### Tailwind CSS 配置

项目在 `tailwind.config.js` 中包含了自定义颜色和动画配置，可以根据需要进行扩展。

### 图标组件

项目提供了自定义图标组件库，位于 `src/components/Icons.jsx`，包含多种常用图标。

## 项目特点

- **现代化开发体验**: 利用 Vite 提供的快速开发和构建能力
- **响应式设计**: 使用 Tailwind CSS 实现全响应式布局
- **组件化架构**: 采用 React 组件化思想，便于维护和扩展
- **优化的构建**: 生产构建经过优化，确保高性能

## 许可证

[MIT](LICENSE)
