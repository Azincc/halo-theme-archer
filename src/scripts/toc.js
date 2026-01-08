import archerUtil from './util.js';
import createTOC from './createToc.js';
import CONFIG from './config.js';

const isPostPage = archerUtil.isPostPage();

// Query toc headers absolute height
function initTocLinksScrollTop(headers) {
    return headers.map((header) => {
        return archerUtil.getAbsPosition(header).y;
    });
}

function calcScrollIntoScreenIndex(heights, currHeight, offset = 0) {
    for (let i = heights.length - 1; i >= 0; i--) {
        if (Math.ceil(currHeight + offset) >= heights[i]) {
            return i;
        }
    }
    return -1;
}

// hide all ol
function hideAllOl(root) {
    [...root.querySelectorAll('ol')].forEach((li) => {
        hideItem(li);
    });
}

// back to default state
function initFold(toc) {
    [...toc.children].forEach((child) => {
        hideAllOl(child);
    });
    [...toc.querySelectorAll('.toc-active')].forEach((child) => {
        child.classList.remove('toc-active');
    });
}

function hideItem(node) {
    node.style.display = 'none';
}

function showItem(node) {
    node.style.display = '';
}

function activeTocItem(node) {
    node.classList.add('toc-active');
}

function showAllChildren(node) {
    [...node.children].forEach((child) => {
        showItem(child);
    });
}

function spreadParentNodeOfTargetItem(tocItem) {
    let currNode = tocItem;
    while (currNode && currNode.parentNode) {
        showAllChildren(currNode.parentNode);
        showAllChildren(currNode);
        currNode = currNode.parentNode;
        if (currNode.classList.contains('toc')) {
            break;
        }
    }
}

const main = () => {
    // Skip initialization if not in post page
    if (!isPostPage) {
        return;
    }

    // 生成 TOC 结构
    const contentSelector = '.article-entry';
    const tocSelector = '.toc-wrapper';
    const tocGenerated = createTOC(contentSelector, tocSelector, CONFIG.TOC_HEADING_SELECTORS);

    if (!tocGenerated) {
        console.warn('TOC generation failed, skipping TOC interaction initialization');
        return;
    }

    const toc = document.querySelector('.toc-wrapper');
    const article = document.querySelector('article.article-entry');

    if (!toc) {
        console.warn('TOC element not found with .toc selector, trying alternatives');
        return;
    }

    if (!article) {
        console.warn('Article content element not found');
        return;
    }

    // #region Toc onscroll listener
    // #region Toc onscroll listener
    const getInitTocOnScrollFun = () => {
        const banner = document.querySelector('.banner');
        const tocItems = document.querySelectorAll('.toc-item');
        const headers = article.querySelectorAll(CONFIG.TOC_HEADING_SELECTORS);

        let throttleTocOnScroll = null;
        return () => {
            // Banner in post page will occupy a certain amount of place.
            // Therefore, anchor point positioning needs to reserve this space.
            const scrollOffsetHeight = (banner ? banner.offsetHeight : 0) + archerUtil.rem();
            headers.forEach((element) => {
                element.style.marginTop = `-${scrollOffsetHeight}px`;
                element.style.paddingTop = `${scrollOffsetHeight}px`;
            });

            // Get header links absolute height
            const headersHeights = initTocLinksScrollTop(Array.from(headers));

            // Document on-scroll event
            const tocOnScroll = () => {
                const currHeight = window.scrollY;
                const currHeightIndex = calcScrollIntoScreenIndex(headersHeights, currHeight);
                if (currHeightIndex >= 0) {
                    // spread, fold and active
                    const currItem = tocItems[currHeightIndex];
                    // 1. fold
                    initFold(toc);
                    // 2. spread
                    spreadParentNodeOfTargetItem(currItem);
                    // 3. active
                    if (currItem) {
                        activeTocItem(currItem.querySelector('a'));
                    }
                    // 4. scroll toc
                    const currItemOffsetTop = currItem?.offsetTop || undefined;
                    if (currItemOffsetTop) {
                        toc.scrollTop = currItemOffsetTop;
                    }
                } else {
                    initFold(toc);
                }
            };

            // Unbind existing on-scroll event
            if (throttleTocOnScroll) document.removeEventListener('scroll', throttleTocOnScroll);
            // Bind document on-scroll event
            throttleTocOnScroll = archerUtil.throttle(tocOnScroll, CONFIG.THROTTLE_DELAY);
            document.addEventListener('scroll', throttleTocOnScroll);
        };
    };
    const initTocOnScroll = getInitTocOnScrollFun();
    const throttleInitTocOnScroll = archerUtil.debounce(initTocOnScroll, CONFIG.DEBOUNCE_DELAY);
    // #endregion

    // Collapse all toc on initialization
    // Collapse all toc on initialization
    initFold(toc);

    // Initialize scroll events listener of toc
    initTocOnScroll();
    // Reload toc scroll events listener if article size is changes (usually because new image is loaded)
    archerUtil.observeResize(article, throttleInitTocOnScroll);
    // Reload toc scroll events listener if window size is changed
    window.addEventListener('resize', throttleInitTocOnScroll);

    // Remove toc loading status
    document.querySelector('.toc-wrapper')?.classList.remove('toc-wrapper-loding');
};

export default main;
