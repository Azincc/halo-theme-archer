# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 Halo 博客系统的主题项目，基于 [hexo-theme-archer](https://github.com/fi3ework/hexo-theme-archer) 移植而来。该主题使用 Vite 构建前端资源，通过 Halo 的模板引擎（类似 Thymeleaf）渲染页面。

## 常用命令

### 开发与构建

```bash
npm run dev       # 启动 Vite 开发服务器（用于前端资源热更新）
npm run build     # 构建前端资源（CSS/JS）到 templates/assets/dist/
npm run preview   # 预览构建后的资源
npm run format    # 使用 Prettier 格式化代码
```

### 打包主题

```bash
# Windows
package.cmd       # 自动构建并打包主题为 theme.zip

# Linux/Mac
./package-theme.sh <version>  # 打包主题到 dist/halo-theme-archer-<version>.zip
```

打包会包含以下文件：

- `templates/` - 所有模板文件
- `settings.yaml` - 主题设置配置
- `theme.yaml` - 主题元数据
- `annotation-setting.yaml` - 文章注解设置
- `README.md` - 说明文档

## 代码架构

### 目录结构

```
├── src/
│   ├── scripts/          # JavaScript 源代码
│   │   ├── main.js       # 主入口文件
│   │   ├── config.js     # 配置常量（魔术数字、阈值等）
│   │   ├── share.js      # 分享功能
│   │   ├── init.js       # 初始化逻辑
│   │   ├── theme.js      # 主题切换（深色/浅色）
│   │   ├── sidebar.js    # 侧边栏交互
│   │   ├── scroll.js     # 滚动相关功能（进度条等）
│   │   ├── toc.js        # 目录（Table of Contents）
│   │   ├── createToc.js  # 生成目录
│   │   ├── tag.js        # 标签相关功能
│   │   ├── excerpt.js    # 摘要截取功能
│   │   ├── donate.js     # 赞赏功能
│   │   └── util.js       # 工具函数
│   └── styles/           # CSS 样式源代码
│       ├── base.css      # 基础样式
│       ├── sidebar.css   # 侧边栏样式
│       ├── post.css      # 文章页样式
│       └── mobile.css    # 移动端适配
│
├── templates/            # Halo 模板文件（HTML）
│   ├── modules/          # 可复用的模块组件
│   │   ├── layout.html   # 主布局
│   │   ├── head.html     # HTML head 部分
│   │   ├── header.html   # 页面头部
│   │   ├── sidebar.html  # 侧边栏
│   │   ├── footer.html   # 页脚
│   │   ├── footer-fixed.html  # 固定底部
│   │   ├── post-card.html     # 文章卡片
│   │   └── toc.html      # 目录组件
│   ├── fragment/         # 页面片段
│   │   ├── index-post.html    # 首页文章列表项
│   │   ├── intro.html         # 介绍区域
│   │   ├── navigation.html    # 导航
│   │   └── profile.html       # 个人资料
│   ├── assets/           # 静态资源
│   │   └── dist/         # Vite 构建输出目录
│   ├── index.html        # 首页模板
│   ├── post.html         # 文章详情页
│   ├── archives.html     # 归档页
│   ├── tag.html          # 标签页
│   ├── category.html     # 分类页
│   ├── page.html         # 独立页面
│   └── 404.html          # 404 页面
│
├── theme.yaml            # Halo 主题元数据（版本、作者等）
├── settings.yaml         # 主题设置表单定义（用户可配置项）
├── annotation-setting.yaml  # 文章级别的注解设置
└── vite.config.js        # Vite 构建配置
```

### 核心架构说明

#### 0. 配置系统

- **src/scripts/config.js**: 集中管理所有配置常量和魔术数字
    - `MOBILE_BREAKPOINT`: 移动端响应式断点（960px）
    - `THROTTLE_DELAY` / `DEBOUNCE_DELAY`: 性能优化参数
    - `DONATE_SHOW_PROGRESS`: 赞赏按钮显示阈值
    - `DEFAULT_EXCERPT_DEPTH`: 摘要截取深度
    - 修改此文件可快速调整主题行为，无需在代码中搜索魔术数字

#### 1. 构建系统

- 使用 **Vite** 打包前端资源（JavaScript 和 CSS）
- 构建输出到 `templates/assets/dist/`
- 输出文件名固定（无 hash），便于模板引用
- 主要入口：
    - JavaScript: `main.js`, `share.js`
    - CSS: `base.css`, `sidebar.css`, `post.css`, `mobile.css`

#### 2. 模板系统

- 使用 Halo 的模板引擎（基于 Thymeleaf 语法）
- 模板变量通过 `${...}` 或 `th:*` 属性访问
- 布局采用模块化设计，`modules/` 存放可复用组件
- `fragment/` 存放更小的页面片段

#### 3. 配置系统

- **theme.yaml**: 主题的基本信息（名称、版本、作者、支持的 Halo 版本等）
- **settings.yaml**: 定义主题设置表单，用户可在 Halo 后台配置
    - 基础设置（标题、副标题、网站图标）
    - 个人资料（头像、签名、社交链接、友链）
    - 外观设置（主题模式、强调色、顶图）
    - 文章设置（目录、字数统计、摘要、阅读时间）
    - 布局设置（浮动按钮、进度条、横幅风格）
    - 赞赏功能
- **annotation-setting.yaml**: 文章级别的配置（如自定义摘要截取行数）

#### 4. JavaScript 模块分工

- **config.js**: 配置常量管理（所有魔术数字和阈值）
- **main.js**: 初始化各个功能模块，是脚本入口
- **init.js**: 页面初始化逻辑（主题加载、UI 初始化）
- **theme.js**: 深色/浅色主题切换逻辑
- **sidebar.js**: 侧边栏展开/收起、固定等交互（使用本地 perfect-scrollbar）
- **scroll.js**: 滚动相关功能（阅读进度条、返回顶部、导航高亮）
- **toc.js** / **createToc.js**: 文章目录生成和交互
- **tag.js**: 标签云、标签筛选等功能
- **excerpt.js**: 摘要截取功能（富文本内容截断）
- **donate.js**: 赞赏弹窗功能
- **util.js**: 通用工具函数（isMobile、throttle、debounce 等）

#### 5. 主题特色功能

- **深色/浅色模式**: 支持跟随系统、深色、浅色三种模式，可分别设置强调色
- **摘要截取**: 支持富文本摘要自动截断，可全局或单篇文章配置截取行数
- **自定义页面顶图**: 每个页面类型可单独配置顶部横幅图片
- **阅读进度条**: 文章阅读时显示进度条
- **目录（TOC）**: 自动生成文章目录，支持滚动高亮
- **赞赏功能**: 支持多个二维码图片展示

## 依赖说明

### npm 本地依赖

- **perfect-scrollbar**: 侧边栏滚动优化（已本地化，不再使用 CDN）
- **anchor-js**: 文章标题锚点生成（已本地化，不再使用 CDN）
- **terser**: 生产环境代码压缩和 console 清理

### CDN 依赖（已添加 SRI 完整性校验）

- **Font Awesome 5.15.4**: 图标库
- **Fancybox 5.0.36**: 图片灯箱
- **阿里云字体**: 自定义图标字体

所有 CDN 资源已添加 `integrity` 和 `crossorigin` 属性，防止资源篡改。

## 开发注意事项

### 修改前端代码

1. 修改 `src/scripts/` 或 `src/styles/` 中的源代码
2. 如需调整行为参数（断点、阈值等），优先修改 `src/scripts/config.js`
3. 运行 `npm run build` 重新构建
4. 构建产物会输出到 `templates/assets/dist/`
5. 模板文件通过 `templates/modules/head.html` 引用这些资源
6. 生产构建会自动移除 `console.log` 和 `console.info`，保留 `console.error`

### 修改模板

- 直接编辑 `templates/` 下的 `.html` 文件
- 注意 Halo 模板语法（类似 Thymeleaf）
- 常用变量可在 `settings.yaml` 中查看配置项

### 修改主题设置

- 编辑 `settings.yaml` 添加/修改设置项
- 设置项通过 Formkit 表单定义
- 配置值在模板中通过 `${theme.config.xxx}` 访问

### 摘要功能说明

- 摘要截取通过 `excerpt.js` 实现
- 全局设置在 `settings.yaml` 的 `rich_excerpt_depth` 字段
- 单篇文章可通过注解 `annotation-setting.yaml` 覆盖全局设置
- 截取行数为 0 时显示系统默认摘要

### 打包发布

1. 运行 `npm run build` 构建前端资源
2. Windows: 运行 `package.cmd`
3. Linux/Mac: 运行 `./package-theme.sh <version>`
4. 上传生成的 zip 文件到 Halo 后台主题管理

### Release Tag 格式

```
v<major>.<minor>.<patch>
```

示例：`v1.0.0`、`v1.2.3`

**版本自增规则**：默认按最新 tag 的 patch 版本 +1

- `v0.0.1` → `v0.0.2`
- `v0.1.9` → `v0.1.10`
- `v1.2.3` → `v1.2.4`

### Release Note 格式

Release Note 写在 tag 的 message 部分（`git tag -a v0.1.2 -m "..."`）：

**⚠️ 注意**：Git tag message 中 `#` 开头的行会被视为注释而忽略，因此标题使用方括号 `[]` 而非 `##`。

```markdown
[New Features]

- ✨ 新增了...

[Bug Fixes]

- 🐞 修复了...

[Improvements]

- 🚀 优化了...

[Chore]

- 🔧 更新了...
```

**内容要求**：总结从上一个 tag 到当前 tag 之间的所有修改。

## 已知问题与规划

- 主页个人资料页面自定义图标显示问题
- 站点访问统计仅支持 PV
- 2026.1 计划完善搜索功能

## 技术栈

- **构建工具**: Vite 7.x
- **模板引擎**: Halo Template (Thymeleaf-like)
- **目标平台**: Halo 2.11.0+
- **包管理**: npm
- **代码格式化**: Prettier
