const resolveSystemThemeMode = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

/** 获取用户偏好的主题颜色模式 */
const getPreferredThemeMode = () => {
    const storedMode = localStorage.preferredThemeMode;
    if (storedMode === 'dark' || storedMode === 'light') {
        return storedMode;
    }
    return resolveSystemThemeMode();
};

const setThemeModeSwitchBtnActive = (active) => {
    const themeModeSwitchBtns = document.querySelectorAll('.header-theme-btn');
    themeModeSwitchBtns.forEach((btn) => {
        if (active) {
            btn.classList.remove('header-theme-btn-disabled');
        } else {
            btn.classList.add('header-theme-btn-disabled');
        }
    });
};

const setThemeMode = (mode) => {
    setThemeModeSwitchBtnActive(false);
    const normalizedMode = mode === 'dark' ? 'dark' : 'light';
    if (normalizedMode === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.preferredThemeMode = normalizedMode;
    setThemeModeSwitchBtnActive(true);
};

const switchThemeMode = () => {
    const nextMode = getPreferredThemeMode() === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
};

export const initializeColorScheme = () => {
    setThemeMode(getPreferredThemeMode());
};

/** 初始化切换主题颜色模式功能 */
const initTheme = () => {
    setThemeMode(getPreferredThemeMode());

    const themeModeSwitchBtns = document.querySelectorAll('.header-theme-btn');
    themeModeSwitchBtns.forEach((btn) => {
        // Remove existing listener if any (not strictly necessary with native if not storing ref, but good practice if needed)
        // With native addEventListener, we can just add it. `click.archer-theme` namespace doesn't exist in native.
        // Assuming we rely on idempotency or just adding it once.
        btn.addEventListener('click', () => {
            switchThemeMode();
        });
    });
};

export default initTheme;
