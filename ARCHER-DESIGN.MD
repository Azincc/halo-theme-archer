# Hexo 主题 Archer：设计与实现深度分析

本文档旨在对 `hexo-theme-archer` 主题进行全面而深入的分析，重点剖析其布局模板、样式设计、脚本功能和整体架构。通过本次分析，为后续将此主题迁移至 Halo 平台提供坚实的技术参考。

## 目录

- [核心布局 (`layout.ejs`)](#核心布局-layoutejs)
- [页面模板分析](#页面模板分析)
  - [首页 (`index.ejs`)](#首页-indexejs)
  - [文章页 (`post.ejs`)](#文章页-postejs)
  - [关于页 (`about.ejs`)](#关于页-aboutejs)
  - [404 页 (`404.ejs`)](#404-页-404ejs)
  - [归档、分类、标签页的回退机制](#归档分类标签页的回退机制)
- [核心子模块 (`_partial`) 分析](#核心子模块-_partial-分析)
- [样式与脚本分析](#样式与脚本分析)
- [主题配置 (`_config.yml`) 分析](#主题配置-_configyml-分析)

---

## 迁移进度概览

- ✅ 已将 Hexo 主题 `_partial` 目录中的 13 个核心片段迁移并重命名为 Halo 规范的 `templates/modules/partials/`，同时完成所有模板引用更新（`~{_partial/...}` → `~{modules/partials/...}`）。
- ✅ 已校验静态资源引用方式，确认所有文件均从 `templates/assets/` 提供，并符合 Halo 官方《静态资源》文档要求。
- ✅ 在 `/home/hexo-theme-archer` 克隆原始 Hexo 主题仓库，作为后续功能比对与迁移的参考基准。
- ⏳ 尚未迁移 Hexo 主题中的脚本、评论、数学公式等扩展子目录（`_partial/script`, `_partial/comment`, `_partial/math`, `_partial/critical-css` 等），后续需按需评估并转换为 Halo 模板或静态资源。
- ⏳ `base-head`、`algolia` 等与 `<head>` 及搜索功能相关的片段仍保持在 Hexo 格式，待 Halo 模板进一步重构时同步处理。
- ❌ 暂无计划迁移 Hexo 中的开发支撑配置（如 `dev/`, `docs/`, `gulpfile.js` 等），这些对 Halo 主题运行并非必需，可按需要另行评估。

## 核心布局 (`layout.ejs`)

`layout.ejs` 是整个 Archer 主题的骨架和入口文件，它定义了所有页面的通用 HTML 结构、资源加载顺序和核心组件布局。

### 结构化分析

该文件的结构可以分为以下几个核心部分：

1.  **文档头部 (`<head>`)**:
    *   通过 `<%- partial('_partial/base-head') %>` 引入，负责定义网站的元信息、SEO、图标以及预加载关键的 CSS 和 JS 文件。

2.  **外部库引入**:
    *   **jQuery**:
        *   主要来源: `https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js` (jsDelivr CDN)。
        *   **容错机制**: 内置了一段脚本来检查 `window.$` 是否成功加载。如果 CDN 加载失败，它会动态地加载本地的 `lib/jquery.min.js` 文件作为备用，增强了主题的稳定性。

3.  **动态 `<body>` 类**:
    *   页面的 `<body>` 标签的 `class` 是动态生成的，这为不同类型的页面提供了独立的样式钩子 (styling hook)，便于通过 CSS 实现页面专属的视觉效果。
    *   判断逻辑如下：
        *   `is_home()` (首页): 应用 `.home-body` 类。
        *   `is_post()` (文章页): 应用 `.post-body` 类。
        *   `page.layout === "404"` (404页): 应用 `.four-zero-four-body` 类。
        *   `page.layout === "about"` (关于页): 应用 `.about-body` 类。

4.  **页面核心组件 (通过 `partial` 引入)**:
    *   **页头 (`base-header`)**: 网站的顶部导航和标题区域。
    *   **固定页脚 (`base-footer-fixed`)**: 一个始终固定在页面底部的页脚栏。
    *   **主内容容器 (`.wrapper`)**:
        *   **背景图 (`base-background-image`)**: 控制主题的背景图片。
        *   **加载动画**: 包含一个 `loading.svg` 图片，在页面内容加载完成前显示。
        *   **页面主体 (`<%- body %>`)**: 这是 Hexo 渲染的核心内容区域，不同页面的具体内容会在这里插入。
        *   **个人信息卡 (`base-profile`)**: 仅在首页 (`is_home()`) 条件下显示。
        *   **主页脚 (`base-footer`)**: 包含版权、社交链接等信息。

5.  **功能性组件**:
    *   **文章目录 (TOC)**:
        *   **加载条件**: 仅在文章页 (`is_post()`) 并且主题配置和文章 Front-matter 允许时加载。
        *   **实现**: 使用 Hexo 内置的 `toc()` 辅助函数生成。其外层容器 `.toc-wrapper` 用于控制定位和动画。
    *   **侧边栏 (`base-sidebar`)**: 引入可交互的侧边栏。
    *   **站点元数据 (`site-meta.ejs`)**: 可能包含一些用于脚本的站点级别数据。

6.  **脚本与第三方服务**:
    *   **核心脚本 (`main.js`)**: 主题的主要交互功能都在这个文件中实现。
    *   **图片灯箱 (Fancybox)**:
        *   来源: `https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0.36/dist/fancybox/fancybox.umd.js`
        *   功能: 用于实现图片的点击放大和预览效果。
    *   **搜索 (Algolia)**:
        *   加载条件: 当 `theme.algolia_search.enable` 为 `true` 时加载。
        *   文件: `_partial/algolia.ejs` 和 `scripts/search.js`。
    *   **网站统计 (Busuanzi)**:
        *   加载条件: 当 `theme.busuanzi` 为 `true` 时加载。
        *   来源: `busuanzi.ibruce.info`。
    *   **社交分享 (`share.js`)**: 在文章页异步加载，提供分享功能。
    *   **图表渲染 (Mermaid)**:
        *   加载条件: 在文章页且 `theme.mermaid.enable` 为 `true` 时加载。
        *   来源: 从 CDN 加载 Mermaid 库，用于渲染流程图、序列图等。

## 页面模板分析

### 首页 (`index.ejs`)

`index.ejs` 是博客文章列表页的核心模板，用于展示文章摘要、元信息和分页导航。

#### 结构化分析

1.  **文章遍历**:
    *   通过 `<%_ page.posts.each(function (_post) { %>` 循环遍历所有文章对象。

2.  **文章摘要生成逻辑**:
    *   这是一个核心功能，摘要内容的生成遵循以下优先级：
        1.  **手动摘要 (`_post.excerpt`)**: 如果文章中使用了 `<!-- more -->` 分隔符，则 `_post.excerpt` 会包含分隔符之前的所有内容。这是最优先的摘要形式。
        2.  **自定义摘要 (`_post.abstract`)**: 如果文章的 Front-matter 中定义了 `abstract` 字段，则其内容会被用作摘要。
        3.  **自动截断**: 如果以上两者都不可用，主题会截取文章正文的前 `theme.truncate_length` 个字符作为摘要（默认为 300）。可以通过设置 `truncate_length: 0` 来禁用自动摘要。
    *   **"阅读更多"按钮**:
        *   加载条件: `theme.read_more_button` 为 `true` 且摘要是通过 `excerpt` 或 `abstract` 生成的。
        *   样式类: `.abstract-read-more-button`。

3.  **文章元信息 (`.abstract-post-meta`)**:
    *   **发布日期**:
        *   显示格式: `YYYY/MM/DD`。
        *   包含 `title` 属性，当鼠标悬停时，会显示文章的最后更新日期 (`_post.updated`)。
        *   图标类: `.iconfont-archer` (字体图标 `&#xe676;`)。
    *   **标签和分类**:
        *   通过 `<%- partial('./_partial/base-title-tags', {...}) %>` 引入子模块来显示。
        *   显示条件: 文章至少有一个标签，或者 `theme.show_categories` 为 `true` 且文章至少有一个分类。

4.  **置顶文章标识**:
    *   如果文章的 Front-matter 中设置了 `top: true` 或 `sticky: true`，会在标题前显示一个置顶图标。
    *   图标类: `.iconfont-archer` (字体图标 `&#xe63d;`)。

5.  **分页导航**:
    *   加载条件: 当文章总页数 `page.total` 大于 1 时显示。
    *   实现: 使用 Hexo 内置的 `paginator()` 辅助函数生成。
    *   样式类: `.page-nav`。
    *   按钮文本: 上一页为 `< PREV`，下一页为 `NEXT >`。

### 文章页 (`post.ejs`)

`post.ejs` 负责渲染单篇文章的完整内容、版权信息、前后文导航以及评论区。

#### 结构化分析

1.  **文章正文渲染**:
    *   通过 `<%- page.content %>` 将 Markdown 转换后的 HTML 内容完整地渲染到 `.article-entry` 容器中。

2.  **版权与许可信息 (`.license-wrapper`)**:
    *   加载条件: `theme.copyright.enable` 为 `true` 且文章 Front-matter 中未设置 `copyright: false`。
    *   显示内容:
        *   作者 (`config.author`)
        *   文章链接 (`page.permalink`)
        *   发布与更新日期
        *   许可协议 (`theme.copyright.license`)
    *   **翻译文章支持**: 如果文章 Front-matter 中定义了 `translated` 对象，会额外显示原文作者和链接。

3.  **前后文导航 (`.post-paginator`)**:
    *   在文章底部提供指向上一篇 (`page.prev`) 和下一篇 (`page.next`) 文章的链接。
    *   样式类: `.next` 和 `.previous`，包含标题和导航提示。

4.  **评论系统集成**:
    *   加载条件: 文章 Front-matter 中未设置 `comments: false`。
    *   **多评论系统支持**: 主题通过引入多个 `_partial/comment/` 目录下的子模块，支持了几乎所有主流的评论插件，包括：
        *   Disqus, Gitalk, Valine, Waline, Utterances 等。
    *   用户只需在 `_config.yml` 中填写对应评论系统的配置即可启用。

5.  **文章时效性提示**:
    *   **功能**: 这是一个非常贴心的功能，当文章发布时间超过预设天数（`theme.outdated_threshold.days`）时，会在文章开头自动插入一个提示框。
    *   **实现**: 通过一段内联 JavaScript 实现。脚本会计算当前时间与文章发布时间的差值，如果超过阈值，则动态创建一个 `.note-warning` 元素并插入到文章内容的开头。
    *   **加载条件**: `theme.outdated_threshold.enable` 为 `true` 且文章未禁用此功能。

6.  **数学公式支持 (MathJax)**:
    *   加载条件: 当文章的 Front-matter 中设置了 `mathjax: true` 时。
    *   实现: 引入 `_partial/math/mathjax.ejs` 子模块，该模块负责加载 MathJax 库并初始化。

### 关于页 (`about.ejs`)

这是一个极为简洁的页面模板，专门用于渲染“关于我”页面。

#### 结构化分析

*   **唯一目的**: 其核心代码只有一行 `<%- page.content %>`，用于将 `about.md` 文件中的内容渲染出来。
*   **布局类**: 主容器 `<main>` 拥有一个 `.about-page` 类，用于应用特定的关于页样式。
*   **注释**: 文件中有一行中文注释 `<!-- 不可以删除，否则会调用 post 的 layout -->`，这说明如果没有这个 `about.ejs` 文件，Hexo 在渲染 `about/index.md` 时可能会错误地回退到使用 `post.ejs` 布局，从而导致显示多余的元素（如评论区、版权声明等）。

## 核心子模块 (`_partial`) 分析

**⚠️ 迁移状态说明**：原 Hexo `_partial` 目录已按 Halo 主题结构规范迁移至 `templates/modules/partials/`，以下分析内容仍以原始 Hexo 代码为基础，实际迁移文件采用 Thymeleaf 模板语法且结构有所调整。

`_partial` 目录是 Archer 主题模块化设计的核心，包含了所有可重用的 UI 组件。

### 已迁移的核心组件 (13 个文件)

| 原 Hexo 路径 (参考) | Halo 迁移路径 | 状态 | 说明 |
| --------------------- | -------------- | ------ | ------ |
| `_partial/base-background-image.ejs` | `templates/modules/partials/background.html` | ✅ 已迁移 | 背景图与文章头图控制 |
| `_partial/base-title-tags.ejs` | `templates/modules/partials/base-title-tags.html` | ✅ 已迁移 | 分类和标签显示组件 |
| - | `templates/modules/partials/category-tree.html` | ✅ 已迁移 | 分类树递归渲染（Halo 新增） |
| `_partial/custom-font.ejs` | `templates/modules/partials/custom-font.html` | ✅ 已迁移 | 自定义字体加载器 |
| `_partial/donate-popup.ejs` | `templates/modules/partials/donate-popup.html` | ✅ 已迁移 | 赞赏弹窗 |
| - | `templates/modules/partials/font-loader.html` | ✅ 已迁移 | WebFont 异步加载器（Halo 新增） |
| `_partial/base-footer-fixed.ejs` | `templates/modules/partials/footer-fixed.html` | ✅ 已迁移 | 固定底部工具栏 |
| `_partial/base-footer.ejs` | `templates/modules/partials/footer.html` | ✅ 已迁移 | 页脚版权与统计 |
| `_partial/base-header.ejs` | `templates/modules/partials/header.html` | ✅ 已迁移 | 顶部导航与进度条 |
| `_partial/base-profile.ejs` | `templates/modules/partials/profile.html` | ✅ 已迁移 | 首页个人信息卡片 |
| `_partial/base-sidebar.ejs` | `templates/modules/partials/sidebar.html` | ✅ 已迁移 | 侧边栏（归档/标签/分类） |
| `_partial/site-meta.ejs` | `templates/modules/partials/site-meta.html` | ✅ 已迁移 | 站点元数据脚本 |
| `_partial/base-social.ejs` | `templates/modules/partials/social.html` | ✅ 已迁移 | 社交链接组件 |

### 尚未迁移的 Hexo 扩展模块

| 原 Hexo 路径 | 迁移优先级 | 说明 |
| -------------- | ----------- | ------ |
| `_partial/base-head.ejs` | 🔴 高 | SEO、元信息与资源预加载，需重构为 Halo 的 `modules/head.html` |
| `_partial/algolia.ejs` | 🟡 中 | Algolia 搜索配置，Halo 可能需使用内置搜索替代 |
| `_partial/comment/*` | 🟡 中 | 评论系统集成（Disqus/Gitalk/Valine 等），Halo 有原生评论方案 |
| `_partial/math/*` | 🟢 低 | MathJax/KaTeX 支持，可作为增强功能后续添加 |
| `_partial/script/*` | 🟢 低 | 额外脚本集成，需评估是否适用于 Halo |
| `_partial/critical-css/*` | 🟢 低 | 关键 CSS 内联优化，可作为性能优化项后续处理 |

### `_partial/base-head.ejs`

此文件负责生成 HTML 文档的 `<head>` 部分，是 SEO 优化、样式和关键脚本加载的集中地。

#### 结构化分析

1.  **动态标题和 SEO**:
    *   **标题 (`<title>`)**: 动态生成页面标题。如果是文章页，格式为 `文章标题 · SEO标题`；否则直接使用 `SEO_title`。`SEO_title` 在 `_config.yml` 中配置。
    *   **关键词 (`keywords`)**: 聚合了文章自身的 `keywords` 和主题配置中的 `SEO_keywords`。
    *   **描述 (`description`)**: 直接使用 `config.description`。
    *   **Open Graph & 其他元数据**: 使用 Hexo 的 `open_graph()` 辅助函数生成社交媒体分享所需的元数据。

2.  **样式表加载**:
    *   **预加载 (`preload`)**: 主题对所有主要 CSS 文件都使用了 `<link rel="preload" as="style">`，这是一种性能优化技术，可以告知浏览器提前加载这些关键资源。
    *   **加载顺序与逻辑**:
        1.  **Fancybox CSS**: 从 CDN 加载图片灯箱的样式。
        2.  **主样式 (`style.css`)**: 主题的核心样式文件。
        3.  **移动端样式 (`mobile.css`)**: 使用 `media='screen and (max-width: 960px)'` 实现响应式设计，仅在屏幕宽度小于 960px 时应用。
        4.  **暗黑模式 (`dark.css`)**: 暗黑主题的样式文件。
    *   **`onload` 技巧**: 通过 `onload="this.onload=null;this.rel='stylesheet'"`，实现了 CSS 的异步加载，避免了 CSS 加载阻塞页面渲染，提升了首次绘制速度 (First Paint)。

3.  **脚本与字体预加载**:
    *   同样使用 `preload` 来优化 jQuery、`main.js` 以及主题所用字体的加载速度。

4.  **第三方服务集成**:
    *   **Algolia**: 如果启用，会在这里生成 Algolia 搜索所需的 JavaScript 配置对象。
    *   **百度统计 & 谷歌统计 (GA)**: 如果在 `_config.yml` 中配置了对应的 ID，会自动插入跟踪代码。

### `_partial/base-header.ejs`

这个模块定义了网站的顶部区域，包含了导航、进度条和标题等元素。

#### 结构化分析

1.  **动态 Header 类**:
    *   首页会额外添加 `.index-header` 类，用于实现首页独有的透明或特殊背景效果。
    *   `.header-mobile` 类用于在移动端视图下应用特定样式。

2.  **阅读进度条 (`.read-progress`)**:
    *   一个在页面滚动时会填充的进度条，用于指示当前阅读位置。
    *   颜色可通过 `theme.read_progress_color` 配置为 `feature` (主题色) 或 `default` (黑色)。

3.  **侧边栏菜单按钮 (`.header-sidebar-menu`)**:
    *   点击后会触发 `main.js` 中的事件，用于展开或关闭侧边栏。
    *   外观可通过 `theme.float_button_theme` 配置为 `rounded` (圆形) 或 `default` (方形)。

4.  **顶部操作按钮 (`.header-actions`)**:
    *   **主题切换按钮 (`.header-theme-btn`)**: 用于在亮色和暗色模式间切换。
    *   **返回首页链接 (`.home-link`)**: 显示博客主标题，并链接到首页。

5.  **Banner 区域 (`.banner`)**:
    *   这是显示页面大标题的区域。
    *   包含博客主标题 (`.blog-title`) 和文章标题 (`.post-title`)。
    *   在文章页，`main.js` 会通过滚动事件监听来控制 banner 的显隐和动画效果。
    *   样式可通过 `theme.post_banner_theme` 配置为 `clean` (简洁样式) 或 `default`。

### `_partial/base-footer.ejs`

定义了网站的底部区域，包含社交链接、版权和备案信息。

#### 结构化分析

1.  **社交链接 (`.social`)**:
    *   通过 `<%- partial('base-social') %>` 引入。
    *   加载条件: `theme.social` 在 `_config.yml` 中有配置。

2.  **版权信息 (`.copyright`)**:
    *   显示 "Powered by Hexo" 和 "theme Archer"。

3.  **网站备案信息 (`.website-approve`)**:
    *   专为中国大陆用户设计，用于显示 ICP 备案号和公安备案信息。
    *   加载条件: `theme.website_approve.enable` 为 `true`。

4.  **网站统计 (`.busuanzi-container`)**:
    *   加载条件: `theme.busuanzi` 为 `true`。
    *   用于显示由 Busuanzi 提供的网站访问量 (PV 或 UV)。

### `_partial/base-profile.ejs`

这是显示在首页的作者信息卡片，是主题的一个标志性设计。

#### 结构化分析

1.  **核心信息**:
    *   **头像 (`.profile-avatar`)**: 头像路径在 `_config.yml` 中配置。可以通过 `theme.avatar_border` 控制是否显示边框。
    *   **作者名 (`.profile-name`)**
    *   **签名 (`.profile-signature`)**

2.  **社交链接 (`.profile-social`)**:
    *   复用了 `base-social` 子模块。

3.  **友情链接 (`.friends`)**:
    *   遍历 `theme.friends` 对象来生成友链列表。

4.  **功能链接**:
    *   **关于我 (`.about-me`)**: 链接到 `/about` 页面。
    *   **站内搜索 (`.search-me`)**:
        *   根据 `theme.search.engine` 的配置（`google`, `baidu`, `bing`），生成不同搜索引擎的站内搜索链接。
    *   **自定义链接 (`.profile-link-item`)**:
        *   允许用户在 `_config.yml` 的 `profile_links` 中添加任意数量的自定义链接。

5.  **粘性布局 (Sticky)**:
    *   如果 `theme.profile_sticky` 设置为 `true`，个人信息卡片会在页面滚动时固定在屏幕一侧。

## 样式与脚本分析

### 样式 (`CSS`) 深度分析

Archer 主题的样式系统是模块化、响应式且支持主题切换的。虽然生产环境下的 CSS 文件是压缩过的，但通过分析其结构和 EJS 中的类名，我们可以清晰地了解其设计思想。

*   **`source/css/style.css`**: 这是主题的基石样式文件，定义了所有核心组件的默认外观、布局、字体和颜色。
    *   **命名规范**: 大量使用了类似 BEM 的命名方式（如 `.profile`, `.profile-avatar`），使得结构清晰，易于维护。
    *   **布局技术**: 广泛使用了 Flexbox 进行组件内部的对齐和分布，例如 `.header-actions` 和 `.post-paginator` 都使用了 `display: flex` 来实现灵活的布局。
    *   **动画效果**: 通过 `transition` 属性为元素的交互（如链接的 `:hover` 效果、按钮的点击反馈）和状态变化（如侧边栏的滑入滑出）提供了平滑的过渡动画。

*   **`source/css/mobile.css`**: 专为移动设备优化的样式表。
    *   **加载方式**: 通过 `@media screen and (max-width: 960px)` 查询加载，实现了移动优先的响应式设计。
    *   **核心调整**:
        *   **布局变为单列**: 将 PC 上的多列布局（如文章列表和个人信息卡）调整为垂直堆叠的单列布局。
        *   **字体大小调整**: 适当减小标题和正文的字体大小，以适应小屏幕的阅读。
        *   **简化头部**: 隐藏 PC 端的一些次要元素，突出核心导航功能。
        *   **调整 TOC (文章目录)**: 在移动端，TOC 通常会变为抽屉式或完全隐藏，以节省屏幕空间。

*   **`source/css/dark.css`**: 暗黑模式样式表。
    *   **实现原理**: 当用户通过 `.header-theme-btn` 切换到暗黑模式时，`main.js` 会为 `<html>` 或 `<body>` 标签添加一个特定的类（如 `.dark-mode`）。`dark.css` 中包含了针对这个类的样式覆盖规则。
    *   **核心调整**:
        *   反转颜色：将页面的背景色变为深色（如 `#121212`），文本颜色变为浅色（如 `#e0e0e0`）。
        *   降低元素对比度：调整边框、背景和链接的颜色，使其在深色背景下不那么刺眼。
        *   图片滤镜：可能会为图片应用 `filter: brightness(.8) contrast(1.2)` 之类的滤镜，使其在暗黑模式下看起来更和谐。

### 脚本 (`JavaScript`) 深度分析

Archer 主题的交互体验由多个 JavaScript 文件共同驱动，它们各司其职，并通过事件监听进行协作。

*   **`source/scripts/main.js`**: 这是主题的交互核心，负责驱动绝大部分动态功能。
    *   **Sidebar 控制类**: 内部很可能实现了一个 `Sidebar` 类或对象，用于管理侧边栏的显示/隐藏状态、侧边栏内部的选项卡切换（文章、分类、标签）。它会监听 `.header-sidebar-menu` 的点击事件来触发。
    *   **滚动事件监听**: 这是 `main.js` 中最复杂的部分之一。它会监听整个页面的滚动事件，并根据当前的滚动位置触发多种效果：
        1.  **阅读进度条更新**: 根据 `scrollTop` 计算出阅读百分比，并更新 `.read-progress` 元素的宽度。
        2.  **Header 样式变化**: 当页面向下滚动超过 Banner 高度时，会为 `<header>` 添加一个类（如 `.header-scrolled`），使其背景变为不透明，并可能会隐藏 Banner 中的标题。
        3.  **TOC (文章目录) 固定**: 当滚动到文章正文区域时，会将 `.toc-wrapper` 的 `position` 变为 `fixed`，使其固定在屏幕一侧。
        4.  **返回顶部按钮显隐**: 当滚动超过一屏高度时，显示“返回顶部”按钮。
    *   **主题切换**: 监听 `.header-theme-btn` 的点击事件，切换 `<body>` 的 `class` 并将用户的选择（`light` 或 `dark`）存入 `localStorage`，以便下次访问时保持一致。

*   **`source/scripts/search.js`**: 负责 Algolia 搜索功能。
    *   **初始化**: 使用 `_config.yml` 中提供的 `applicationID`, `apiKey` 和 `indexName` 初始化 Algolia 的搜索客户端。
    *   **事件绑定**: 监听搜索输入框的 `input` 事件，实时向 Algolia 发送搜索请求。
    *   **结果渲染**: 获取到搜索结果后，动态地将结果（文章标题、链接、摘要等）渲染到预设的 DOM 容器中。

*   **`source/scripts/share.js`**: 实现社交分享功能。
    *   **事件监听**: 监听文章页底部分享按钮的点击事件。
    *   **动态 URL 生成**: 根据不同社交平台（如微博、Twitter、Facebook）的分享 API，动态生成包含当前文章标题和链接的分享 URL。
    *   **弹出窗口**: 调用 `window.open()` 在一个新窗口中打开分享链接，提供更好的用户体验。

## Halo 迁移注意事项与下一步建议

1. **模板命名与引用**：Halo 不允许在 `templates/` 下使用以下划线开头的目录，因此所有可复用组件应放置于 `templates/modules/`（或其子目录）中，引用语法统一为 `~{modules/...}`。新建片段时务必沿用现有结构和命名。
2. **静态资源管理**：所有样式、脚本和图片均需放在 `templates/assets/` 下。引用资源时首选 `@{/assets/...}`，并准备好本地兜底资源以应对 CDN 失败（参考 `font-loader.html` 与 `layout.html` 中的写法）。
3. **Hexo 专属功能代替方案**：Algolia 搜索、第三方评论、多语言等 Hexo 插件特性需要重新评估 Halo 的对应实现。若 Halo 已提供原生方案，可优先迁移至官方能力，必要时再考虑自定义实现。
4. **脚本兼容性**：迁移 JavaScript 逻辑时需关注 Halo 站点运行环境（可能存在 CSP、模块化加载等差异）。建议统一放置于 `templates/assets/scripts/`，并视情况使用 `th:inline="javascript"` 注入配置。
5. **未迁移片段的处理**：对于迁移优先级较低的模块（如 `_partial/critical-css`、`_partial/script`），可在 Halo 主题稳定运行后再按需引入，避免在初期引入过多不必要的复杂度。
6. **文档同步**：当前文档已记录迁移清单和状态，后续每次迁移或取舍决策，建议继续在本文件中更新，保持团队对整体进度的一致认知。
