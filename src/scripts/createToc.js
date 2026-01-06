/**
 * Generates a Table of Contents (TOC) from the headings within a specified HTML content element
 * and injects the generated TOC into a target DOM element.
 * This version only creates the structure, leaving interaction control to the original toc.js
 */
const createTOC = (contentSelector, tocSelector, headingSelector = "h1, h2, h3, h4, h5, h6") => {
  const contentRootDom = document.querySelector(contentSelector);
  const tocRootDom = document.querySelector(tocSelector);


  if (!contentRootDom) {
    console.warn(`Element not found for selector: ${contentSelector}`);
    return null;
  }
  if (!tocRootDom) {
    console.warn(`Element not found for TOC selector: ${tocSelector}`);
    return null;
  }

  const originalHeadings = Array.from(contentRootDom.querySelectorAll(headingSelector));

  if (originalHeadings.length === 0) {
    return null;
  }

  // Generate slug, compatible with most Markdown parser rules
  const slugify = (str) =>
    str
      .trim()
      .toLowerCase()
      .replace(/[\s]+/g, "-") // Convert whitespace to -
      .replace(/[^a-z0-9-]/g, "") // Remove non-alphanumeric and -
      .replace(/-+/g, "-") // Merge consecutive -
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing -

  const usedIds = new Map();

  // First, collect existing ids
  originalHeadings.forEach((h) => {
    if (h.id) {
      const baseId = h.id;
      let id = baseId;
      const usedCount = usedIds.get(baseId) ?? 0;
      if (usedCount) {
        id = `${baseId}-${usedCount}`;
        h.id = id;
      }
      usedIds.set(id, usedCount + 1);
    }
  });

  // Then, automatically generate ids for headings without id
  originalHeadings.forEach((h) => {
    if (h.id) return;
    const baseId = slugify(h.textContent || "heading") || "heading";
    let id = baseId;
    const usedCount = usedIds.get(baseId) ?? 0;
    if (usedCount) {
      id = `${baseId}-${usedCount}`;
    }
    h.id = id;
    usedIds.set(id, usedCount + 1);
  });

  // Find the minimum heading level
  const headingLevels = originalHeadings.map((h) => parseInt(h.tagName.slice(1), 10));
  const minLevel = Math.min(...headingLevels);
  const maxLevel = Math.max(...headingLevels);

  // Create the outermost ol.toc
  const tocContainer = document.createElement("ol");
  tocContainer.className = "toc";

  // Build TOC tree structure
  const tocTreeRoot = {
    level: minLevel - 1,
    children: [],
  };

  let lastNode = tocTreeRoot;

  originalHeadings.forEach((heading) => {
    const level = parseInt(heading.tagName.slice(1), 10);
    let parent = lastNode;
    // Roll back to the appropriate parent node
    while (parent.level >= level) {
      parent = parent.parent;
    }
    const node = {
      level,
      heading,
      children: [],
      parent,
    };
    parent.children.push(node);
    lastNode = node;
  });

  // Render TOC tree as DOM
  const counters = {};
  const stack = [];

  // Initialize stack with root nodes in reverse order
  for (let i = tocTreeRoot.children.length - 1; i >= 0; i--) {
    stack.push({ node: tocTreeRoot.children[i], parentOl: tocContainer });
  }

  while (stack.length) {
    const { node, parentOl } = stack.pop();
    const level = node.level;

    // Update numbering and reset deeper levels
    counters[level] = (counters[level] || 0) + 1;
    for (let lv = level + 1; lv <= maxLevel; lv++) {
      counters[lv] = 0;
    }

    // Build numbering string
    const numArr = [];
    for (let lv = minLevel; lv <= level; lv++) {
      numArr.push(counters[lv] || 0);
    }
    const numStr = numArr.join(".");

    // Create li and a
    const li = document.createElement("li");
    li.className = `toc-item toc-level-${level}`;

    const a = document.createElement("a");
    a.href = `#${node.heading.id}`;
    a.className = `toc-link`;

    // Numbering span
    const spanNum = document.createElement("span");
    spanNum.className = "toc-number";
    spanNum.textContent = numStr + ". ";

    // Text span
    const spanText = document.createElement("span");
    spanText.className = "toc-text";
    spanText.textContent = (node.heading.textContent ?? "").trim();

    a.append(spanNum, spanText);
    li.appendChild(a);

    // If there are children, create an OL and push them onto the stack
    if (node.children.length > 0) {
      const childOl = document.createElement("ol");
      childOl.className = `toc-child`;
      li.appendChild(childOl);
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push({ node: node.children[i], parentOl: childOl });
      }
    }

    parentOl.appendChild(li);
  }

  // Add the content of TOC container
  tocRootDom.appendChild(tocContainer)

  console.log('TOC structure generated successfully');
  return true;
};

export default createTOC;