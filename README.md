# Admin Dashboard

基于 React + TypeScript + Vite + Ant Design 构建的现代化后台管理系统。

## 功能特性

- 🔐 用户登录认证
- 📊 仪表盘数据展示
- 📝 文章管理 (CRUD) - 支持Markdown编辑器
- 🏷️ 分类管理 (CRUD)
- 👥 用户管理 (CRUD)
- 🌙 暗黑模式切换
- 🌍 国际化支持 (中文/英文)
- 📱 响应式设计 - 完整移动端适配
- 🔄 数据状态管理

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design 5
- **状态管理**: Zustand
- **数据请求**: TanStack Query + Axios
- **路由**: React Router DOM
- **国际化**: react-i18next + i18next
- **Markdown编辑器**: @uiw/react-md-editor
- **包管理器**: pnpm

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

### 代码检查

```bash
pnpm lint
```

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── Layout.tsx      # 布局组件 (支持移动端抽屉导航)
│   └── Root.tsx        # 根组件
├── pages/              # 页面组件
│   ├── Login.tsx       # 登录页
│   ├── Dashboard.tsx   # 仪表盘
│   ├── Articles.tsx    # 文章管理 (集成Markdown编辑器)
│   ├── Categories.tsx  # 分类管理
│   └── Users.tsx       # 用户管理
├── services/           # API 服务
│   ├── api.ts         # API 基础配置
│   ├── auth.ts        # 认证相关
│   ├── articles.ts    # 文章相关
│   ├── categories.ts  # 分类相关
│   └── users.ts       # 用户相关
├── stores/             # 状态管理
│   ├── auth.ts        # 认证状态
│   ├── theme.ts       # 主题状态
│   └── language.ts    # 语言状态
├── i18n/               # 国际化
│   ├── index.ts       # i18n配置
│   └── locales/       # 语言包
│       ├── zh-CN.json # 中文语言包
│       └── en-US.json # 英文语言包
├── App.tsx            # 应用入口
└── main.tsx           # 主入口文件
```

## 新增功能

### 🌍 国际化支持
- **双语支持** - 完整的中文和英文界面
- **自动检测** - 根据浏览器语言自动选择
- **动态切换** - 实时切换语言无需刷新
- **持久化存储** - 语言选择自动保存
- **Ant Design适配** - UI组件语言包同步切换

### Markdown编辑器
- 文章内容支持Markdown格式编写
- 实时预览功能
- 工具栏支持常用Markdown语法
- 响应式设计，移动端友好
- 暗黑模式支持

### 移动端适配
- 响应式布局设计
- 移动端使用抽屉式导航
- 表格支持水平滚动
- 模态框自适应屏幕尺寸
- 优化的触摸交互体验

## API 接口

系统基于提供的 API 文档实现，支持以下功能：

- 用户登录认证
- 文章的增删改查和搜索 (支持Markdown内容)
- 分类的增删改查
- 用户的增删改查

## 默认登录信息

- 邮箱: admin@example.com
- 密码: admin123

## 国际化配置

### 支持语言
- 简体中文 (zh-CN) - 默认语言
- 英文 (en-US)

### 语言切换
- 顶部导航栏语言选择器
- 支持实时切换，无需刷新页面
- 自动保存用户语言偏好

### 添加新语言
1. 在 `src/i18n/locales/` 目录下添加新的语言包文件
2. 在 `src/i18n/index.ts` 中注册新语言
3. 在 `src/components/Layout.tsx` 中添加语言选项

## 开发说明

1. 项目使用 TypeScript 进行类型检查
2. 使用 ESLint 9 + 扁平配置进行代码规范检查
3. API 请求通过 Vite 代理转发到后端服务
4. 支持暗黑模式，状态持久化存储
5. 完整的移动端响应式设计
6. Markdown编辑器集成，支持实时预览
7. 国际化支持，易于扩展新语言

## 浏览器支持

- Chrome >= 87
- Firefox >= 78
- Safari >= 14
- Edge >= 88

## 移动端支持

- iOS Safari >= 14
- Android Chrome >= 87
- 响应式断点: 768px