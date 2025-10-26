# Hexo to Halo Theme Migration Plan

This document outlines the plan for migrating the hexo-theme-archer to a Halo theme.

## Migration Plan

1.  **Theme Configuration Migration**
    *   Analyze the `hexo-theme-archer/_config.yml` file to understand its configuration options.
    *   Map and migrate these configuration options to the `settings.yaml` file for theme settings in Halo.
    *   Check and confirm that the basic theme information in `theme.yaml` is correct.

2.  **Static Asset Migration**
    *   Copy all static asset files (e.g., CSS, JavaScript, images, fonts) from the `hexo-theme-archer/source` directory to the `/templates/assets` directory.

3.  **Template File Migration**
    *   Analyze all template files (usually `.ejs` files) in the `hexo-theme-archer/layout` directory.
    *   Convert these Hexo template files to the Freemarker template format supported by Halo.
    *   Place the converted template files in the `/templates` directory. This includes, but is not limited to:
        *   `index.ftl` (Home)
        *   `post.ftl` (Post detail)
        *   `page.ftl` (Custom page)
        *   `archives.ftl` (Archives)
        *   `categories.ftl` (Categories)
        *   `tags.ftl` (Tags)
        *   `header.ftl` (Common header)
        *   `footer.ftl` (Common footer)
        *   `sidebar.ftl` (Sidebar)

4.  **Language File Migration**
    *   Analyze the language files in the `hexo-theme-archer/languages` directory.
    *   Integrate these language files into the Halo theme to support multi-language features.

5.  **Update README.md**
    *   After each operation, I will update the `README.md` file with detailed progress.
