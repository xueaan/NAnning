# NAnning - Knowledge Management Platform

基于 Electron + Next.js 14 构建的新一代桌面知识管理平台

## 🚀 技术栈

- **Electron 38** - 桌面应用框架
- **Next.js 15** - React 框架
- **TypeScript 5** - 类型安全
- **Tailwind CSS 4** - 原子化 CSS
- **CodeMirror 6** - 代码编辑器
- **Tiptap 3** - 富文本编辑器
- **Zustand** - 状态管理
- **Framer Motion** - 动画库

## 📁 项目结构

```
NAnning-App/
├── electron/          # Electron 主进程
│   ├── main.js       # 主进程入口
│   └── preload.js    # 预加载脚本
├── src/
│   ├── app/          # Next.js App Router
│   │   ├── layout.tsx # 根布局
│   │   ├── page.tsx  # 首页
│   │   └── globals.css # 全局样式
│   ├── modules/      # 功能模块
│   │   └── editor/   # 编辑器模块
│   ├── shared/       # 共享组件
│   │   └── components/
│   └── stores/       # 状态管理
│       └── appStore.ts
├── public/           # 静态资源
├── next.config.js    # Next.js 配置
├── tailwind.config.js # Tailwind 配置
├── tsconfig.json     # TypeScript 配置
└── package.json      # 项目依赖

```

## 🛠️ 开发环境设置

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
# 在一个终端启动 Next.js
npm run next-dev

# 在另一个终端启动 Electron
npm run dev
```

### 构建应用
```bash
npm run build
```

## 🎨 核心功能模块

### 已实现
- ✅ Electron + Next.js 集成
- ✅ 基础 UI 框架
- ✅ 毛玻璃效果主题
- ✅ 简单富文本编辑器
- ✅ Zustand 状态管理
- ✅ 侧边栏导航

### 待实现
- ⏳ CodeMirror 代码编辑器
- ⏳ 知识库管理
- ⏳ AI 对话集成
- ⏳ 图形工具 (Excalidraw, Mermaid)
- ⏳ 主题系统
- ⏳ 搜索功能
- ⏳ 插件系统
- ⏳ 数据持久化

## 🔧 配置说明

### Electron 配置
主进程文件位于 `electron/main.js`，负责：
- 创建应用窗口
- 管理 IPC 通信
- 启动 Next.js 服务

### Next.js 配置
配置文件 `next.config.js` 设置：
- 生产环境导出为静态文件
- Electron 外部模块处理
- 图片优化配置

### TypeScript 配置
使用路径别名简化导入：
- `@/` → `src/`
- `@modules/` → `src/modules/`
- `@shared/` → `src/shared/`
- `@stores/` → `src/stores/`

## 📝 开发计划

### Phase 1: 基础架构 ✅
- Electron + Next.js 项目搭建
- 基础 UI 框架
- 状态管理集成

### Phase 2: 核心功能
- 双引擎编辑器系统
- 知识库管理
- 主题系统

### Phase 3: 高级功能
- AI 集成
- 图形工具
- 搜索系统

### Phase 4: 优化发布
- 性能优化
- 自动更新
- 跨平台打包

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT