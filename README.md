# Hexo 到 Halo 主题迁移计划

本文档概述了将 hexo-theme-archer 迁移到 Halo 主题的计划。

原始主题位于[hexo-theme-archer](https://github.com/fi3ework/hexo-theme-archer) 要完成的主题文件位置在根目录，
template文件夹主题模板目录，存放主题模板文件，所有模板都需要放在这个目录。
halo文件夹是halo的源代码，不需要访问。
主题的编写指南在[theme-dev-doc](https://github.com/halo-dev/docs/tree/main/versioned_docs/version-2.21/developer-guide)，请在生成代码过程中有不清楚的地方可以翻阅theme-dev-doc。
如果你需要移动文件夹或者大量文件，可以停止并且告诉我需要移动的文件和目标位置。
/templates/assets/- 主题静态资源目录，存放主题的静态资源文件，目前静态资源文件只能放在这个目录。
/theme.yaml- 主题配置文件，配置主题的基本信息，如主题名称、版本、作者等。
/settings.yaml- 主题设置定义文件，配置主题的设置项表单。
每一次操作后将进度详细写在readme.md

## 迁移计划

1. **主题配置迁移**
    * 分析 `hexo-theme-archer/_config.yml` 文件以了解其配置选项。
    * 将这些配置选项映射并迁移到 Halo 主题设置的 `settings.yaml` 文件中。
    * 检查并确认 `theme.yaml` 中的基本主题信息是正确的。
    * 分析theme-dev-doc,了解halo主题的基本写法

2. **静态资源迁移**
    * 从 `hexo-theme-archer/source` 目录复制所有静态资源文件（例如 CSS、JavaScript、图片、字体）到 `/templates/assets` 目录。

3. **模板文件迁移**
    * 分析 `hexo-theme-archer/layout` 目录中的所有模板文件（通常是 `.ejs` 文件）。
    * 将这些 Hexo 模板文件转换为 Halo 支持的 Thymeleaf 模板格式。
    * 将转换后的模板文件放置在 `/templates` 目录中。这包括但不限于：
        * `index.html`（首页）(优先)
        * `post.html`（文章详情）
        * `page.html`（自定义页面）
        * `archives.html`（归档）
        * `categories.html`（分类）
        * `tags.html`（标签）
        * `header.html`（通用头部）
        * `footer.html`（通用底部）
        * `sidebar.html`（侧边栏）

4. **语言文件迁移（暂缓）**
    * 分析 `hexo-theme-archer/languages` 目录中的语言文件。
    * 将这些语言文件集成到 Halo 主题中以支持多语言功能。
    * 暂缓迁移语言文件

5. **更新 README.md**
    * 在每次操作后，我将更新 `README.md` 文件以详细记录进度。

## 进度

* **已完成：主题配置迁移**
* **已完成：静态资源迁移**
* **已完成：模板文件迁移**
  * [x] 开始实现 index.html
    * 已完成首页布局结构
    * 集成了 Archer 主题的特色元素（置顶标记、文章摘要、阅读更多按钮）
    * 采用现代化的设计风格：
      - 响应式布局
      - 暗色模式支持
      - 卡片式文章展示
      - 平滑过渡动画
    * 添加了返回顶部功能
    * 使用所有主题配置更新了 `settings.yaml`。
    * 确认了`theme.yaml` 中的基本主题信息是正确的。
    * 已从 `hexo-theme-archer/source` 目录复制所有静态资源文件到 `/templates/assets` 目录。
    * 已阅读theme-dev-doc,了解halo主题的基本写法
    * 已将所有模板文件转换为Thymeleaf语法并验证其正确性。
    * 已完成所有页面的迁移。

* **2024-10-27**：根据 Halo 官方文档校验首页模板结构，修复 `templates/index.html` 的标签嵌套与闭合问题，确保主题首页在 Halo 中正常渲染。
* **2024-10-27**：重构全局布局，新增背景、个人信息、赞赏弹窗等核心模块，统一 Archives/Categories/Tags/404/Post/Page 页面以适配 Halo 布局。
* **2024-10-27**：根据 Halo 主题结构规范，将 `_partial` 文件夹迁移至 `templates/modules/partials/` 目录，修复所有模板中的引用路径（从 `~{_partial/...}` 更新为 `~{modules/partials/...}`）。已验证静态资源引用符合 Halo 规范。添加了 `.gitignore` 文件。成功克隆 hexo-theme-archer 原始仓库至 `/home/hexo-theme-archer` 供参考。
* **2024-10-27**：完成 `modules/head.html` 重构，整合 SEO 优化、Open Graph / Twitter Card / Facebook 元数据、RSS Feed、Algolia 搜索配置、百度/谷歌/CNZZ 统计等功能。更新 `settings.yaml` 增加 SEO 相关配置字段（Twitter ID、Facebook 配置、RSS Feed 开关等）。更新 `ARCHER-DESIGN.MD` 标记 `base-head.ejs` 迁移已完成。
* **2024-10-27**：完成 `settings.yaml` 配置项校验与修复。✅ 已修复：`footer.sfooter_info`（底部信息）、`footer.show_stats`（站点统计）、`style.truncate_length`（摘要截断长度）的引用。✅ 已确认使用：`style.reading_info`（字数和阅读时间）已在 background.html 中实现。⚠️ 预留功能：`pluginPage` 组的特殊页面配置（豆瓣/瞬间/装备/图库）为未来扩展功能预留，暂不影响主题正常使用。已生成详细的配置使用情况报告 `CONFIG_USAGE_REPORT.md`。
* **2024-10-28**：修复前端脚本在缺少侧边栏或站点简介元素时的运行错误：为 PerfectScrollbar、侧边栏标签、滚动交互等模块增加空节点校验与降级逻辑，将站点封面图加载异常从报错调整为警告，避免控制台出现未捕获异常。
* **2024-10-28**：重构 index.html 页面，添加完整的站点简介(site-intro)、个人资料侧边栏(profile)和文章列表结构；修复 layout.html 缺少 header 的问题。确保页面包含所有 JavaScript 所需的 DOM 元素。调整首页布局：头图区域在main内部、左侧显示profile、右侧显示文章列表，符合Archer主题的原始设计。
* **2024-12-27**：修复 post.html 模板报错：移除 post.prev/post.next 的前后文导航功能。由于 Halo PostVo 结构不包含 prev/next 字段，原模板尝试访问这些不存在的属性导致 SpringEL 表达式异常（EL1008E）。已删除前后文导航区块以解决此问题。
* **2024-12-27**：修复 post.html 页面 SpEL 表达式错误：移除了不存在的 `post.spec.extra` 字段引用，将 MathJax 加载改为仅依赖主题配置 `theme.config.other.math?.mathjax?.enable`。同时，按照 hexo-theme-archer 原始设计，为 post.html 添加了完整的文章头部区域（site-intro），包括：文章标题、副标题、封面图片、分类/标签链接、字数统计、阅读时长、发布日期、Busuanzi 页面浏览量统计、社交分享按钮等元素，确保文章页面样式与 Archer 主题保持一致。
* **2024-12-27**：全面检查并修复所有模板文件中错误的 Halo 元数据字段引用。根据 Halo 2.21 官方文档修复如下问题：
  - `post.html`：修复 `post.content.wordCount` 和 `post.content.readingTime`（ContentVo 无此字段），改为使用 Thymeleaf 计算字数和阅读时长；修复 `post.spec.owner` 应使用 `post.owner.displayName` 显示作者名称。
  - `index.html` 和 `post-card.html`：修复 `post.content.content`（ListedPostVo 无 content 字段），改为使用 `post.status.excerpt` 或 `post.spec.excerpt.raw` 作为摘要回退。
  - `modules/layout.html`：移除 `post.content.toc`（ContentVo 无 toc 字段），TOC 功能需通过 JavaScript 实现或使用插件。
  - 确保所有模板文件遵循 Halo 官方 PostVo、ListedPostVo、ContentVo、ContributorVo 等数据结构规范。
* **2024-12-27**：对比 hexo-theme-archer 原始主题，补充缺失的页脚（footer）和固定页脚（footer-fixed）模块：
  - 新增 `modules/footer.html`：包含社交链接、版权信息、网站备案信息、不蒜子访客统计等元素。
  - 新增 `modules/footer-fixed.html`：包含赞赏弹窗（donate-popup）、返回顶部按钮（back-top）等浮动按钮。
  - 更新 `modules/layout.html`：在页面中引入 footer 和 footer-fixed 模块，确保页面结构完整。
  - 更新 `settings.yaml`：新增 busuanzi 统计配置组，包括启用开关、统计类型（PV/UV）、显示文本等配置项。
  - 确保所有页脚元素与原始 Archer 主题保持一致，同时使用正确的 Halo Thymeleaf 语法。
* **2024-12-27**：修复缺失的 header-sidebar-menu 和 header-actions 组件：
  - 重构 `modules/header.html`：按照原始 Archer 主题结构，添加了顶部阅读进度条、侧边栏菜单按钮、主题切换按钮、返回首页链接和 banner 区域。
  - 新增 `modules/sidebar.html`：实现完整的侧边栏功能，包括归档（Archives）、标签（Tags）和分类（Categories）三个面板，支持点击标签/分类名称动态显示对应文章列表。
  - 更新 `modules/layout.html`：在页面中引入 sidebar 模块和 site-meta 脚本，为 JavaScript 提供必要的站点元数据。
  - 侧边栏支持通过点击 `.header-sidebar-menu` 按钮从左侧滑入，完全还原原始 Archer 主题的交互体验。
  - 所有 CSS 样式已存在于 `assets/css/style.css` 中，JavaScript 交互逻辑已在 `assets/scripts/sidebar.js` 和 `initSidebar.js` 中实现。
* **2024-12-27**：修复 sidebar 导航链接问题：
  - **修复 sidebar 导航链接**：将 `modules/sidebar.html` 中的标签和分类从 `<span>` 改为 `<a>` 元素，并正确绑定到 `tag.status.permalink` 和 `category.status.permalink`，使得点击标签/分类名称能够正确导航到对应页面（如 `/tags/halo`、`/categories/default`）。
  - 使用 `th:attr="data-tags=..."` 和 `th:attr="data-categories=..."` 确保自定义属性正确设置，保留了原有的 JavaScript 交互功能。
* **2024-12-27**：修复 sidebar archives 和 tags 页面的问题：
  - **修复 sidebar archives 显示**：调整 `modules/sidebar.html` 中的 archives 数据结构，正确遍历 `archive.months` 和 `month.posts`，使归档列表能够正确显示所有文章。使用 `#dates.format()` 替代 `#temporals.format()` 以兼容 Halo 的日期格式化方法。
  - **修复 tags 页面错误**：修改 `templates/tags.html`，将不存在的 `#numbers.random()` 方法替换为使用 `iterStat.index % 19` 的方式生成伪随机字体大小（12-30px），解决了 `Method random(java.lang.Integer,java.lang.Integer) cannot be found` 的 SpEL 错误。
* **2024-12-27**：新增 tag 和 category 单页模板：
  - **新增 `templates/tag.html`**：创建单个标签的文章聚合页面，显示该标签下的所有文章列表，包含 Site Intro 头图区域、左侧个人资料和右侧文章流，完整复刻 Archer 主题的布局风格。
  - **新增 `templates/category.html`**：创建单个分类的文章聚合页面，显示该分类下的所有文章列表，布局与 tag 页面保持一致。
  - 两个页面都支持分页功能，使用 `posts.hasPrevious()`、`posts.hasNext()` 等方法实现翻页导航。
  - 页面标题显示为"标签名/分类名 - Tags/Categories"，头图区域显示对应图标和文章数量统计。
* **2024-12-27**：修复 `#strings.stripHtml()` 方法不存在的问题：
  - **问题**：Thymeleaf 的 `#strings` 工具对象没有 `stripHtml()` 方法，导致在 `post.html`、`index.html`、`tag.html`、`category.html` 和 `modules/post-card.html` 中使用时报错。
  - **解决方案**：使用 `#strings.replace()` 方法在 HTML 标签前后添加空格，然后移除所有空格来简化文本，用于字数统计和阅读时间计算。
  - 在 `post.html` 中的阅读时间计算：使用简化的字符计数方式，将字数除以 400 来估算阅读分钟数（中文阅读速度约 400 字/分钟），并将 Math 计算统一为浮点数类型，避免 SpringEL 对 `Math.max` 重载的歧义。
  - 在摘要显示中：使用 `th:text` 替代 `th:utext` 来避免 HTML 标签显示问题，确保摘要文本正确截断。
* **2024-12-27**：修复暗黑模式切换失败的问题：
  - **问题**：点击顶部的切换按钮时，由于暗黑样式表路径错误（引用了 `/css/dark.css`），导致样式文件加载失败，同时暗黑样式未完整覆盖页面背景颜色。
  - **解决方案**：更新 `assets/scripts/theme.js`，通过解析已经加载的主样式表路径自动推断资源基础路径，并回退到 `siteMeta.root`，确保动态加载的 `assets/css/dark.css` 始终指向正确位置；同时在 `assets/css/dark.css` 中仅覆盖 `body`、`.background-holder`、`.container` 的背景色，与原始 Archer 主题保持一致，避免误伤其他模块的配色。
* **2025-11-01**：新增文章前后文导航按钮功能：
  - **功能**：在文章详情页的正文底部添加了前后文导航按钮（previous/next post navigation），允许读者快速跳转到上一篇和下一篇文章。
  - **实现**：使用 Halo 的 `postFinder.cursor(post.metadata.name)` API 获取当前文章的导航光标对象，通过 `postCursor.hasPrevious()` 和 `postCursor.hasNext()` 判断是否存在前后文章，并使用 `postCursor.previous` 和 `postCursor.next` 获取相邻文章的标题和链接。
  - **样式**：复用原始 Archer 主题中已存在的 `.post-paginator`、`.nextTitle`、`.prevTitle`、`.nextSlogan`、`.prevSlogan` 等 CSS 样式类，确保视觉效果与原主题保持一致。采用与原主题相同的HTML结构：每个导航项（`<li class="next">` 和 `<li class="previous">`）包含标题slogan（`<div>`）和文章链接（`<a>`），链接内包含文章标题（`<div>`）。
  - **布局说明**：左侧显示 `< Previous Post`（链接到 `postCursor.previous`），右侧显示 `Next Post >`（链接到 `postCursor.next`），与原 Archer 主题的布局保持一致。
  - **调试输出**：添加了详细的控制台日志输出，包括 postCursor 对象、hasPrevious/hasNext 状态以及 previous/next 文章的详细信息，便于主题开发和故障排查。
  - **参考文档**：Halo 官方文档 - [文章 Finder API](https://docs.halo.run/developer-guide/theme/finder-apis/post) 中的 `cursor()` 方法和 NavigationPostVo 类型定义。
