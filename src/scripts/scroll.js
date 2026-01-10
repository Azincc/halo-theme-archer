import archerUtil from './util.js';
import CONFIG from './config.js';

const initScroll = () => {
    const banner = document.querySelector('.banner');
    const postBanner = banner?.querySelector('.post-title a');
    const bgEle = document.querySelector('.site-intro');
    const header = document.querySelector('header.header');
    const headerActions = document.querySelector('.header-actions');
    const donateBtn = document.querySelector('.donate-btn');
    const backTop = document.querySelector('.back-top');
    const sidebarMenu = document.querySelector('.header-sidebar-menu');
    const tocWrapper = document.querySelector('.toc-wrapper');
    const tocCatalog = tocWrapper?.querySelector('.toc-catalog');
    const progressBar = document.querySelector('.read-progress');

    const hasIntro = !!bgEle && !!header;

    if (!hasIntro) {
        console.warn('Site intro or header element not found. Some scroll features will be skipped.');
    }

    const bgTitleHeight = hasIntro
        ? bgEle.getBoundingClientRect().top + window.scrollY + bgEle.offsetHeight - header.offsetHeight / 2
        : 0;

    // toc 的收缩
    tocCatalog?.addEventListener('click', () => {
        tocWrapper.classList.toggle('toc-hide-children');
    });

    // 滚动式切换文章标题和站点标题
    const showBannerScrollHeight = CONFIG.BANNER_SCROLL_THRESHOLD;
    let previousHeight = 0,
        continueScroll = 0;

    const isScrollingUpOrDown = (currTop) => {
        continueScroll += currTop - previousHeight;
        if (continueScroll > CONFIG.SCROLL_CONTINUE_THRESHOLD) {
            // 向下滑动
            continueScroll = 0;
            return 1;
        } else if (continueScroll < showBannerScrollHeight) {
            // 向上滑动
            continueScroll = 0;
            return -1;
        } else {
            return 0;
        }
    };

    // 是否在向上或向下滚动
    let crossingState = -1;
    let isHigherThanIntro = hasIntro;
    const isCrossingIntro = (currTop) => {
        if (!hasIntro) {
            return 0;
        }
        // 向下滑动超过 intro
        if (currTop > bgTitleHeight) {
            if (crossingState !== 1) {
                crossingState = 1;
                isHigherThanIntro = false;
                return 1;
            }
        } else {
            // 向上滑动超过 intro
            if (crossingState !== -1) {
                crossingState = -1;
                isHigherThanIntro = true;
                return -1;
            }
        }
        return 0;
    };

    // 判断是否为 post-page
    const isPostPage = archerUtil.isPostPage();
    let articleHeight, articleTop;

    if (isPostPage) {
        // 使用 ResizeObserver 监听高度变化
        const updateDimensions = () => {
            articleTop = hasIntro
                ? bgEle.getBoundingClientRect().top + window.scrollY + bgEle.offsetHeight - header.offsetHeight / 2
                : CONFIG.TOC_SCROLL_OFFSET;
            const articleEntry = document.querySelector('.article-entry');
            articleHeight = articleEntry ? articleEntry.offsetHeight : 0;
        };

        const resizeObserver = new ResizeObserver(() => {
            updateDimensions();
            updateScroll(window.scrollY);
        });

        const articleEntry = document.querySelector('.article-entry');
        if (articleEntry) {
            resizeObserver.observe(articleEntry);
        }

        // 初始计算
        updateDimensions();
    }

    const calcReadPercent = (scrollTop, beginY, contentHeight) => {
        const windowHeight = window.innerHeight;

        // 如果高度未加载或异常，返回 0
        if (!contentHeight) {
            return 0;
        }

        // 防止文章过短，直接返回 100%
        if (contentHeight <= windowHeight) {
            return 100;
        }

        if (scrollTop < beginY) {
            return CONFIG.MIN_READ_PROGRESS;
        }

        let readPercent = ((scrollTop - beginY) / (contentHeight - windowHeight)) * 100;
        return readPercent > CONFIG.MAX_READ_PROGRESS ? CONFIG.MAX_READ_PROGRESS : readPercent;
    };

    const updateReadProgress = (readPercent) => {
        if (!progressBar) {
            return;
        }
        const restPercent = readPercent - 100 <= 0 ? readPercent - 100 : 0;
        progressBar.style.opacity = '1';
        progressBar.style.transform = `translate3d(${restPercent}%, 0, 0)`;
    };

    // rAF 操作
    let tickingScroll = false;
    const updateScroll = (scrollTop) => {
        const isMobile = archerUtil.isMobile();
        const crossingState = isCrossingIntro(scrollTop);
        const readPercent = calcReadPercent(scrollTop, articleTop, articleHeight);

        // intro 边界切换
        if (crossingState === 1) {
            tocWrapper?.classList.add('toc-fixed');
            // 移动端保持 header-mobile 类，不切换 header 样式
            if (!isMobile) {
                header?.classList.remove('header-mobile');
                headerActions?.classList.add('header-actions-hide');
            }
            sidebarMenu?.classList.add('header-sidebar-menu-black');
            backTop?.classList.remove('footer-fixed-btn--hidden');
        } else if (crossingState === -1) {
            tocWrapper?.classList.remove('toc-fixed');
            if (!isMobile) {
                header?.classList.add('header-mobile');
                headerActions?.classList.remove('header-actions-hide');
            }
            banner?.classList.remove('banner-show');
            sidebarMenu?.classList.remove('header-sidebar-menu-black');
            backTop?.classList.add('footer-fixed-btn--hidden');
        }

        // 移动端切换 banner
        if (isMobile) {
            if (isHigherThanIntro) {
                banner?.classList.remove('banner-show');
                headerActions?.classList.remove('header-actions-hide');
            } else {
                banner?.classList.add('banner-show');
                headerActions?.classList.add('header-actions-hide');
            }
        }

        if (!isMobile && isPostPage) {
            const upDownState = isScrollingUpOrDown(scrollTop);

            // 仅在桌面端的 Post 页面，当从主内容区域向上滚动时，显示 toggle banner
            if (upDownState === 1) {
                banner?.classList.remove('banner-show');
            } else if (upDownState === -1 && !isHigherThanIntro) {
                banner?.classList.add('banner-show');
            }

            // 仅在桌面端的 Post 页面，阅读进度大于等于配置阈值时，显示 Donate 按钮
            if (readPercent >= CONFIG.DONATE_SHOW_PROGRESS) {
                donateBtn?.classList.remove('footer-fixed-btn--hidden');
            } else if (crossingState === -1 && !donateBtn?.classList.contains('footer-fixed-btn--active')) {
                donateBtn?.classList.add('footer-fixed-btn--hidden');
            }
        }

        if (isPostPage) {
            // 更新进度条君的长度
            updateReadProgress(readPercent);
        }

        previousHeight = scrollTop;
        tickingScroll = false;
    };

    // scroll 回调
    const onScroll = () => {
        const scrollTop = window.scrollY;
        const bindedUpdate = updateScroll.bind(null, scrollTop);
        tickingScroll = archerUtil.rafTick(tickingScroll, bindedUpdate);
    };
    const throttleOnScroll = archerUtil.throttle(onScroll, CONFIG.THROTTLE_DELAY);

    onScroll();
    document.addEventListener('scroll', throttleOnScroll);

    // 绑定返回顶部事件
    [postBanner, backTop].forEach((ele) => {
        ele?.addEventListener('click', archerUtil.backTop);
    });
};

export default initScroll;
