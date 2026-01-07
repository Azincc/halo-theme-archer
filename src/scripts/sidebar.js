import PerfectScrollbar from 'https://cdn.jsdelivr.net/npm/perfect-scrollbar@1.5.5/+esm';

const Selector = (classPrefix) => ({
    ACTIVE: `${classPrefix}-active`,
});

class Sidebar {
    static defaultOptions = {
        activeIndex: 0,
    };

    constructor(options) {
        this.options = { ...Sidebar.defaultOptions, ...options };
        this.activeIndex = this.options.activeIndex;
        this._initElements();
        this._initTabs();
        this._bindTabsClick();
        this._bindButtonClick();
        this._bindWrapperClick();
        this.perfectScrollbar();
    }

    _initElements() {
        this.sidebar = document.querySelector(this.options.sidebar);
        this.tabs = document.querySelectorAll(this.options.tabs);
        this.panels = document.querySelectorAll(this.options.panels);
        this.menuButton = document.querySelector(this.options.menuButton);
        this.nav = document.querySelector(this.options.nav);
        this.content = document.querySelector(this.options.content);
    }

    _initTabs() {
        this.tabs.forEach((tab, index) => {
            tab.setAttribute('data-tab-index', index);
        });
    }

    activateSidebar() {
        this.sidebar.classList.remove('sidebar-hide');
        document.querySelector('.wrapper')?.classList.add('wrapper-sidebar-active');
        document.querySelector('header.header')?.classList.add('header-sidebar-active');
        document.querySelector('.footer-fixed')?.classList.add('footer-fixed-sidebar-active');
        document.querySelector('.toc-wrapper')?.classList.add('toc-slide');
        this.menuButton.classList.add('header-sidebar-menu-active');
        this.sidebar.classList.add('sidebar-active');
    }

    _inactivateSidebar() {
        document.querySelector('.wrapper')?.classList.remove('wrapper-sidebar-active');
        document.querySelector('header.header')?.classList.remove('header-sidebar-active');
        document.querySelector('.footer-fixed')?.classList.remove('footer-fixed-sidebar-active');
        document.querySelector('.toc-wrapper')?.classList.remove('toc-slide');
        this.menuButton.classList.remove('header-sidebar-menu-active');
        this.sidebar.classList.remove('sidebar-active');
    }

    switchTo(toIndex) {
        this._switchTo(toIndex);
    }

    _switchTab(toIndex) {
        for (let i = 0; i < 3; i++) {
            if (i !== toIndex) {
                this.nav.classList.remove(`sidebar-tabs-active-${i}`);
            } else {
                this.nav.classList.add(`sidebar-tabs-active-${i}`);
            }
        }
    }

    _switchPanel(toIndex) {
        for (let i = 0; i < 3; i++) {
            if (i !== toIndex) {
                this.content.classList.remove(`sidebar-content-active-${i}`);
            } else {
                this.content.classList.add(`sidebar-content-active-${i}`);
            }
        }
    }

    _switchTo(toIndex) {
        this._switchTab(toIndex);
        this._switchPanel(toIndex);
    }

    _bindTabsClick() {
        this.tabs.forEach((tab) => {
            tab.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const index = parseInt(target.getAttribute('data-tab-index'), 10);
                this.switchTo(index);
            });
        });
    }

    _bindButtonClick() {
        this.menuButton.addEventListener('click', (e) => {
            if (this.sidebar.classList.contains('sidebar-active')) {
                this._inactivateSidebar();
            } else {
                this.activateSidebar();
            }
        });
    }

    _bindWrapperClick() {
        document.querySelector('.wrapper')?.addEventListener('click', (e) => {
            this._inactivateSidebar();
        });
    }

    // 阻止sidebarContent在滚动到顶部或底部时继续滚动
    perfectScrollbar() {
        const sidebarElement = document.querySelector('.sidebar');
        if (!sidebarElement) {
            console.warn('Sidebar element not found. Skipping PerfectScrollbar initialization.');
            return;
        }
        const ps = new PerfectScrollbar(sidebarElement, {
            suppressScrollX: true,
        });
    }
}

export default Sidebar;
