import CONFIG from './config.js';

const initExcerpt = () => {
    function createExcerpt(element) {
        const excerptDepth = parseInt(element.getAttribute('data-truncate-depth'), 10) || CONFIG.DEFAULT_EXCERPT_DEPTH;

        // Get all direct child elements (like <p>, <div>, etc.).
        const allChildElements = Array.from(element.children);

        // Only proceed if there are more elements than the desired depth.
        if (allChildElements.length > excerptDepth) {
            // Get the elements that need to be removed.
            const elementsToRemove = allChildElements.slice(excerptDepth);

            // Remove them from the DOM.
            elementsToRemove.forEach((el) => {
                element.removeChild(el);
            });
        }
    }

    document.querySelectorAll('.truncate').forEach((element) => {
        createExcerpt(element);
    });
};

export default initExcerpt;
