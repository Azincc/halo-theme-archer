# archer-halo (migrated)

这是从 Hexo 主题迁移为 Halo 的最小样例。按照 Halo 官方 theme-starter 结构准备。

安装与测试
1. 将本项目的代码克隆到本地：
   git clone https://github.com/Azincc/halo-theme-archer.git
2. 新建并切换到 migrate 分支（如果尚未拉取远端 migrate 分支）：
   git fetch origin
   git checkout -b migrate origin/migrate
   # 或者如果你在本地已经有 migrate 分支： git checkout migrate
3. 把 themes/archer-halo 目录放到你的 Halo 服务实例的 `themes/` 下，或把此仓库作为主题仓库（取决于你的部署方式）。
4. 在 Halo 管理后台启用主题或重启 Halo 服务以加载新主题。
5. 根据需要把 SCSS 编译为 resources/css/style.css，并把静态资源放到 resources/ 下。

注意事项
- 这是最小可运行结构，迁移完整功能（例如：tag 列表、搜索、评论、分页、partials 等）需要把 Hexo EJS 文件逐一手动改写为 Halo 模板变量/语法。
- 检查 Hexo 使用的自定义 helper（例如时间格式化、摘要）并在模板中用 Halo 的 API/表达式替换或在后端提供。