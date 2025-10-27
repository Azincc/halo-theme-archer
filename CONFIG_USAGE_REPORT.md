# 主题配置项使用情况报告

## 已使用的配置项 ✅

### basic 组
- ✅ `main_title` - 主标题（用于 header.html, head.html）
- ✅ `subtitle` - 副标题（用于 header.html）
- ✅ `favicon` - 网站图标（用于 head.html）

### layout 组
- ✅ `home_avatar` - 首页展示头像（用于 index.html）
- ✅ `home_slogan` - 首页介绍词（用于 index.html）
- ✅ `featured_focus_num` - 推荐阅读数量（用于 index.html）
- ✅ `blogger_keywords` - 博主介绍关键词（用于 index.html）
- ✅ `home_links` - 社交链接（用于 index.html）

### profile 组
- ✅ `avatar` - 头像（用于 profile.html）
- ✅ `author` - 作者名（用于 profile.html, site-meta.html, head.html）
- ✅ `signature` - 个性签名（用于 profile.html）
- ✅ `social` - 社交链接（用于 social.html, footer.html）
- ✅ `friends` - 友情链接（用于 profile.html）
- ✅ `profile_icons` - 个人资料图标（用于 profile.html）
- ✅ `profile_links` - 附加个人链接（用于 profile.html）

### style 组
- ✅ `color_scheme` - 默认配色（用于 layout.html）
- ✅ `site_header_image` - 首页顶部图片（用于 background.html）
- ✅ `post_header_image` - 文章页顶部图片（用于 background.html）
- ✅ `about_header_image` - 关于页顶部图片（用于 background.html）
- ✅ `_404_header_image` - 404页顶部图片（用于 background.html）
- ✅ `index_intro_height` - 首页简介高度（用于 background.html）
- ✅ `post_intro_height` - 文章页简介高度（用于 background.html, layout.html）
- ✅ `about_intro_height` - 关于页简介高度（用于 background.html）
- ✅ `float_button_theme` - 浮动按钮主题（用于 header.html, footer-fixed.html）
- ✅ `read_progress_color` - 阅读进度条颜色（用于 header.html）
- ✅ `post_banner_theme` - 文章页横幅主题（用于 header.html）
- ✅ `avatar_border` - 显示头像边框（用于 profile.html）
- ✅ `profile_sticky` - 固定个人资料（用于 profile.html）
- ✅ `show_categories` - 显示文章分类（用于 base-title-tags.html）
- ⚠️  `truncate_length` - 摘要截断长度（仅在文档中提及，未实际使用）
- ✅ `read_more_button` - 显示阅读更多按钮（用于 post-card.html）
- ✅ `toc` - 启用文章目录（用于 layout.html）
- ⚠️  `reading_info` - 显示字数和阅读时间（未使用）

### search 组
- ✅ `enable` - 启用搜索（用于 profile.html）
- ✅ `url` - 搜索 URL（用于 profile.html）
- ✅ `engine` - 搜索引擎（用于 profile.html）

### seo 组
- ✅ `SEO_title` - 网站标题（用于 head.html）
- ✅ `SEO_keywords` - 网站关键词（用于 head.html）
- ✅ `twitter_id` - Twitter ID（用于 head.html）
- ✅ `fb_admins` - Facebook 管理员 ID（用于 head.html）
- ✅ `fb_app_id` - Facebook App ID（用于 head.html）
- ✅ `feed` - RSS Feed（用于 head.html）

### algolia_search 组
- ✅ `enable` - 启用（用于 head.html, layout.html）
- ✅ `applicationID` - Application ID（用于 head.html, layout.html）
- ✅ `apiKey` - API Key（用于 head.html, layout.html）
- ✅ `indexName` - Index Name（用于 head.html, layout.html）
- ✅ `hits` - 命中配置（用于 head.html, layout.html）
- ✅ `labels` - 标签配置（用于 head.html, layout.html）

### donate 组
- ✅ `enable` - 启用（用于 donate-popup.html, footer-fixed.html）
- ✅ `title` - 标题（用于 donate-popup.html）
- ✅ `description` - 描述（用于 donate-popup.html）
- ✅ `qr_codes` - 二维码（用于 donate-popup.html）

### analytics 组
- ✅ `busuanzi` - 不蒜子统计（用于 footer.html, layout.html）
- ✅ `baidu_analytics` - 百度统计 ID（用于 head.html）
- ✅ `google_analytics` - 谷歌统计 ID（用于 head.html）
- ✅ `CNZZ_analytics` - CNZZ 统计 ID（用于 head.html）

### other 组
- ✅ `copyright` - 版权信息（用于 post.html）
- ✅ `website_approve` - 网站审批（用于 footer.html）
- ✅ `outdated_threshold` - 文章时效性提示（用于 post.html）
- ✅ `mermaid` - Mermaid 图表（用于 layout.html）
- ✅ `math.mathjax` - MathJax 支持（用于 post.html，支持全局启用和文章级别启用）
- ✅ `custom_font` - 自定义字体（用于 custom-font.html）

### custom 组
- ✅ `keywords` - SEO关键词（作为 `seo.SEO_keywords` 的备用项，已在 head.html 中使用）
- ✅ `code_css` - 自定义CSS代码（用于 head.html）
- ✅ `code_js` - 自定义JavaScript代码（用于 layout.html）
- ✅ `head_html` - 自定义HTML代码-头部（用于 head.html）
- ✅ `footer_html` - 自定义HTML代码-底部（用于 layout.html）

## 未使用的配置项 ⚠️

### pluginPage 组（特殊页面配置）
这些配置项用于特殊页面（豆瓣、瞬间、装备、图库），当前主题尚未实现这些页面，但为未来扩展预留：
- ⚠️ `douban_description` - 豆瓣页面描述（预留）
- ⚠️ `douban_comment` - 豆瓣页面允许评论（预留）
- ⚠️ `moments_description` - 瞬间页面描述（预留）
- ⚠️ `moments_comment` - 瞬间页面允许评论（预留）
- ⚠️ `equipment_description` - 装备页面描述（预留）
- ⚠️ `equipment_comment` - 装备页面允许评论（预留）
- ⚠️ `photos_description` - 图库页面描述（预留）
- ⚠️ `photos_comment` - 图库页面允许评论（预留）

**注意**：这些配置项是为未来的特殊页面功能预留的，不会影响当前主题的正常使用。如需实现这些功能，需要创建对应的自定义页面模板。

## 已解决的问题 ✅

1. ✅ `footer.sfooter_info` & `footer.show_stats` - 已在 footer.html 中实现。
2. ✅ `style.reading_info` - 已在 background.html 中根据配置显示字数和阅读时间。
3. ✅ `style.truncate_length` - 已用于 post-card.html 的摘要截断。
4. ✅ `custom.keywords` - 现已作为 SEO 关键词的回退项整合入 head.html。
5. ✅ `other.math.mathjax` - 已在 post.html 中完善，支持全局启用和文章级别启用，并可配置版本号。

## 仍待确认 / 后续计划 ⚠️

1. `pluginPage` 组的特殊页面描述与评论开关为未来扩展预留，当前暂无对应页面模板。

如需进一步扩展，请参考 README 中的迁移计划说明。
