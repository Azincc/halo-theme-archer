import archerUtil from './util.js';

const rem = archerUtil.rem();

const initDonate = () => {
    const donatePopup = document.querySelector('.donate-popup');
    const donateBtn = document.querySelector('.donate-btn');
    const postBody = document.querySelector('.post-body');
    const postPage = document.querySelector('.post-page');

    if (!donatePopup || !donateBtn || !postBody || !postPage) {
        return;
    }

    const hideDonatePopup = () => {
        donatePopup.classList.add('donate-popup--hidden');
        donateBtn.classList.remove('footer-fixed-btn--active');
    };

    const showDonatePopup = () => {
        const popupWidth = Math.floor((postBody.offsetWidth - postPage.offsetWidth) / 2 + 4 * rem);
        donatePopup.style.width = `${popupWidth}px`;

        donatePopup.classList.remove('donate-popup--hidden');
        donateBtn.classList.add('footer-fixed-btn--active');
    };

    donateBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        if (donatePopup.classList.contains('donate-popup--hidden')) {
            showDonatePopup();
        } else {
            hideDonatePopup();
        }
    });
};

export default initDonate;
