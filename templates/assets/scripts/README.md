# Source Files - Hexo Theme Archer

## 说明

此目录包含从 [hexo-theme-archer](https://github.com/fi3ework/hexo-theme-archer) 仓库的 `src/js` 目录中获取的原始源码文件，经过适配后可直接在浏览器中作为 ES 模块运行。

## 文件列表

- `main.js` - 主入口文件
- `init.js` - 初始化功能
- `theme.js` - 主题切换功能
- `image.js` - 图片处理（Fancybox）
- `scroll.js` - 滚动事件处理
- `initSidebar.js` - 侧边栏初始化
- `donate.js` - 捐赠按钮功能
- `search.js` - Algolia 搜索功能
- `share.js` - 分享功能
- `sidebar.js` - 侧边栏类
- `tag.js` - 标签和分类功能
- `toc.js` - 目录（Table of Contents）功能
- `util.js` - 工具函数
- `browser.js` - 浏览器检测
- `mobile.js` - 移动端优化
- `fontawsome.js` - Font Awesome 图标
- `customFontLoader.js` - 自定义字体加载

## 重要变更

### main.js
- 移除了对 `../../package.json` 的依赖，使用硬编码的 package 信息替代
- 添加了 `.js` 扩展名到所有内部模块导入语句
- 导出 `initializeColorScheme` 函数到 `window.main` 对象，供外部脚本调用
- 作为 ES 模块导出默认对象

### theme.js
- 重构了主题切换逻辑，改进了主题初始化流程
- 导出 `initializeColorScheme` 函数，支持外部调用
- 优化了暗色主题样式表的加载和卸载逻辑

### browser.js
- 将 `module.exports` 改为 `export default`，与 ES 模块语法保持一致

### fontawsome.js
- 改为动态加载 Font Awesome 资源
- 使用 CDN (jsDelivr) 加载 CSS 和 JS 文件
- 避免同步导入，改为异步加载

### init.js
- 使用 CDN 导入 `anchor-js` (https://cdn.jsdelivr.net/npm/anchor-js@5.0.0/+esm)
- 添加 `.js` 扩展名到内部模块导入

### sidebar.js
- 使用 CDN 导入 `perfect-scrollbar` (https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/+esm)

### tag.js
- 使用 CDN 导入 `eventemitter3` (https://cdn.jsdelivr.net/npm/eventemitter3@5.0.1/+esm)
- 添加 `.js` 扩展名到内部模块导入

### search.js
- 使用 ESM CDN (https://esm.sh) 导入 Algolia 相关包
- 修改了 instantsearch widgets 的导入方式
- 添加 `.js` 扩展名到内部模块导入

### share.js
- 使用 CDN 导入 `qrcode-generator` (https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/+esm)

### customFontLoader.js
- 改为动态导入 `webfontloader`
- 使用 CDN (https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/+esm)

### 所有内部模块引用
- 所有对内部模块的引用都添加了 `.js` 扩展名
- 例如：`import util from './util'` → `import util from './util.js'`

## 依赖加载方式

所有外部依赖现在通过 CDN 加载，无需 npm 安装：

| 依赖包 | 加载方式 | CDN |
|--------|----------|-----|
| @fortawesome/fontawesome-free | 动态脚本注入 | jsDelivr |
| anchor-js | ES 模块导入 | jsDelivr |
| algoliasearch | ES 模块导入 | esm.sh |
| instantsearch.js | ES 模块导入 | esm.sh |
| perfect-scrollbar | ES 模块导入 | jsDelivr |
| qrcode-generator | ES 模块导入 | jsDelivr |
| webfontloader | 动态导入 | jsDelivr |
| eventemitter3 | ES 模块导入 | jsDelivr |

## 运行要求

✅ **好消息**: 这些源码文件现在可以作为 ES 模块在现代浏览器中直接运行！

### 浏览器要求

- 支持 ES6 模块 (`<script type="module">`)
- 支持动态导入 (`import()`)
- 支持 `async/await`
- 推荐使用现代浏览器（Chrome 61+, Firefox 60+, Safari 11+, Edge 16+）

### 模板变更

`templates/modules/layout.html` 已更新：
- `main.js` 使用 `type="module"` 加载
- `search.js` 使用 `type="module"` 加载
- `share.js` 使用 `type="module"` 加载

## 开发和调试

### 优势

1. **可读性强**: 源码未压缩，易于阅读和调试
2. **无需构建**: 不需要 webpack/npm，直接在浏览器中运行
3. **快速迭代**: 修改后刷新页面即可查看效果
4. **依赖透明**: 所有依赖都从 CDN 加载，版本明确

### 调试建议

1. 使用浏览器开发者工具的 Sources 面板查看源码
2. 在需要的地方添加 `console.log` 或断点
3. 利用浏览器的网络面板监控模块加载
4. 使用现代浏览器的 ES 模块调试功能

## 性能考虑

由于使用 CDN 加载依赖，首次加载可能需要更多时间。建议：

1. CDN 资源会被浏览器缓存
2. 生产环境建议使用编译后的版本以获得更好的性能
3. 可以使用 importmap 优化模块加载

## 版本信息

- 主题名称: hexo-theme-archer
- 版本: 1.7.0
- 版本日期: 20240720
- 主页: https://github.com/fi3ework/hexo-theme-archer
