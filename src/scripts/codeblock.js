/**
 * Code block rendering for Mermaid diagrams and LaTeX/MathJax formulas
 * Converts code blocks with specific language classes to rendered content
 * Supports both native code blocks and Shiki-wrapped code blocks
 */

/**
 * Find mermaid code blocks (supports Shiki plugin wrapper)
 * Selectors: language-mermaid class or data attribute
 */
function findMermaidBlocks() {
    // Multiple selectors to handle different scenarios:
    // 1. Standard: pre > code.language-mermaid
    // 2. Shiki wrapped: shiki-code pre > code.language-mermaid
    // 3. With hljs: code.hljs.language-mermaid
    const selectors = ['code.language-mermaid', 'code[class*="language-mermaid"]', 'pre.language-mermaid'];
    return document.querySelectorAll(selectors.join(', '));
}

/**
 * Find LaTeX/math code blocks (supports Shiki plugin wrapper)
 */
function findMathBlocks() {
    const selectors = [
        'code.language-latex',
        'code.language-math',
        'code[class*="language-latex"]',
        'code[class*="language-math"]',
    ];
    return document.querySelectorAll(selectors.join(', '));
}

/**
 * Get the outermost wrapper element to replace
 * Handles Shiki's <shiki-code> wrapper
 */
function getWrapperToReplace(codeElement) {
    const pre = codeElement.closest('pre');
    if (!pre) return codeElement;

    // Check if wrapped by shiki-code custom element
    const shikiWrapper = pre.closest('shiki-code');
    if (shikiWrapper) {
        return shikiWrapper;
    }

    return pre;
}

/**
 * Initialize Mermaid diagram rendering
 * Converts <pre><code class="language-mermaid"> blocks to mermaid diagrams
 */
export function initMermaid() {
    if (typeof window.mermaid === 'undefined') {
        console.warn('Mermaid not loaded yet');
        return;
    }

    const mermaidBlocks = findMermaidBlocks();

    if (mermaidBlocks.length === 0) {
        return;
    }

    mermaidBlocks.forEach((codeBlock, index) => {
        const wrapper = getWrapperToReplace(codeBlock);
        const content = codeBlock.textContent || codeBlock.innerText;

        // Skip if already processed
        if (wrapper.classList && wrapper.classList.contains('mermaid-processed')) {
            return;
        }

        // Create mermaid container
        const mermaidDiv = document.createElement('div');
        mermaidDiv.className = 'mermaid';
        mermaidDiv.id = `mermaid-${Date.now()}-${index}`;
        mermaidDiv.textContent = content.trim();

        // Replace wrapper with mermaid div
        if (wrapper.parentNode) {
            wrapper.parentNode.replaceChild(mermaidDiv, wrapper);
        }
    });

    // Run mermaid rendering
    try {
        window.mermaid.run();
    } catch (error) {
        console.error('Mermaid rendering error:', error);
    }
}

/**
 * Initialize MathJax/LaTeX rendering
 * Converts <pre><code class="language-latex"> or <pre><code class="language-math"> blocks
 */
export function initMathJax() {
    if (typeof window.MathJax === 'undefined') {
        console.warn('MathJax not loaded yet');
        return;
    }

    const mathBlocks = findMathBlocks();

    if (mathBlocks.length === 0) {
        // Still trigger typeset for inline math in the document
        triggerMathJaxTypeset();
        return;
    }

    mathBlocks.forEach((codeBlock) => {
        const wrapper = getWrapperToReplace(codeBlock);
        let content = codeBlock.textContent || codeBlock.innerText;
        content = content.trim();

        // Skip if already processed
        if (wrapper.classList && wrapper.classList.contains('mathjax-processed')) {
            return;
        }

        // Create math container
        const mathDiv = document.createElement('div');
        mathDiv.className = 'mathjax-block';

        // Check if content already has delimiters
        const hasDisplayDelimiters = /^\s*\$\$[\s\S]*\$\$\s*$/.test(content) || /^\s*\\\[[\s\S]*\\\]\s*$/.test(content);

        if (hasDisplayDelimiters) {
            // Content already has delimiters, use as-is
            mathDiv.textContent = content;
        } else {
            // Wrap content in display math delimiters
            mathDiv.textContent = `$$${content}$$`;
        }

        // Replace wrapper with math div
        if (wrapper.parentNode) {
            wrapper.parentNode.replaceChild(mathDiv, wrapper);
        }
    });

    // Typeset all math elements
    triggerMathJaxTypeset();
}

/**
 * Trigger MathJax typesetting
 */
function triggerMathJaxTypeset() {
    try {
        if (window.MathJax) {
            if (window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise().catch((err) => {
                    console.error('MathJax typeset error:', err);
                });
            } else if (window.MathJax.typeset) {
                window.MathJax.typeset();
            }
        }
    } catch (error) {
        console.error('MathJax rendering error:', error);
    }
}

/**
 * Initialize all code block renderers
 * Should be called after the external libraries are loaded
 */
export function initCodeBlocks() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMermaid();
            initMathJax();
        });
    } else {
        initMermaid();
        initMathJax();
    }
}

export default initCodeBlocks;
