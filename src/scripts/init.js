import AnchorJS from 'https://cdn.jsdelivr.net/npm/anchor-js@5.0.0/+esm';
import toc from './toc.js';

const init = function () {
    // Remove site intro image placeholder
    // Remove site intro image placeholder
    const introImg = document.querySelector('.site-intro-img');
    const introPlaceholder = document.querySelector('.site-intro-placeholder');
    let bgURL = '';

    if (introImg) {
        const bgCSS = window.getComputedStyle(introImg).backgroundImage;
        const bgRegResult = bgCSS.match(/url\("?(.+?)"?\)/); // Updated regex to handle optional quotes
        if (bgRegResult && bgRegResult.length >= 2) {
            bgURL = bgRegResult[1];
        }
    }

    if (!bgURL) {
        console.warn(
            "Site intro image element not found or background image not set. This is expected if the current page doesn't have an intro image.",
        );
    } else {
        const img = new Image();
        img.onload = () => {
            introPlaceholder?.remove();
            console.info('site intro image loaded.');
        };
        img.src = bgURL;
    }

    // Dom content loaded event
    // Dom content loaded event
    document.addEventListener(
        'DOMContentLoaded',
        function () {
            document.querySelector('.container')?.classList.remove('container-unloaded');
            document.querySelector('.footer')?.classList.remove('footer-unloaded');
            document.querySelector('.loading')?.remove();

            // 动态添加类实现动画效果
            if (document.querySelector('.site-intro-meta')) {
                document.querySelectorAll('.intro-title, .intro-subtitle').forEach((el) => {
                    el.classList.add('intro-fade-in');
                });
                const postIntros = document.querySelector('.post-intros');
                if (postIntros) {
                    postIntros.classList.add('post-fade-in');
                }
            }

            // Init anchors
            // https://www.bryanbraun.com/anchorjs/
            const anchors = new AnchorJS();
            anchors.options = {
                placement: 'right',
                class: 'anchorjs-archer',
            };
            anchors.add();

            // Initialize TOC
            if (typeof toc === 'function') {
                toc();
            }
        },
        false,
    );
};

export default init;
