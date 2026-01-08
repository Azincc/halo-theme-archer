/**
 * 主题配置常量
 * 集中管理所有魔术数字和配置项
 */

export const CONFIG = {
    // 响应式断点
    MOBILE_BREAKPOINT: 960, // 移动端最大宽度（px）

    // 滚动相关
    BANNER_SCROLL_THRESHOLD: -200, // Banner 显示滚动阈值
    SCROLL_CONTINUE_THRESHOLD: 30, // 连续滚动判定阈值
    SCROLL_OFFSET_REM: 1, // 滚动偏移量（rem）

    // 进度相关
    DONATE_SHOW_PROGRESS: 50, // 赞赏按钮显示的阅读进度（%）
    MIN_READ_PROGRESS: 0, // 最小阅读进度（%）
    MAX_READ_PROGRESS: 100, // 最大阅读进度（%）

    // 性能优化
    THROTTLE_DELAY: 100, // 节流延迟（ms）
    DEBOUNCE_DELAY: 300, // 防抖延迟（ms）

    // TOC 相关
    TOC_HEADING_SELECTORS: 'h1, h2, h3, h4, h5, h6', // TOC 标题选择器
    TOC_SCROLL_OFFSET: 0, // TOC 滚动偏移量

    // 摘要相关
    DEFAULT_EXCERPT_DEPTH: 5, // 默认摘要截取深度（元素数量）

    // 动画相关
    PRELOAD_TIMEOUT: 3000, // CSS preload 超时时间（ms）
    RESIZE_OBSERVER_THROTTLE: 500, // ResizeObserver 节流间隔（ms）
};

export default CONFIG;
