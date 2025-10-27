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
