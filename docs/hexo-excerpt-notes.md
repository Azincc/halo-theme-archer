# Hexo-Excerpt Technical Analysis

**Repository**: https://github.com/chekun/hexo-excerpt  
**Version**: 1.3.1  
**License**: MIT  
**Last Commit**: Nov 2024

## Overview

Hexo-excerpt is an automatic excerpt generator plugin for Hexo that intelligently truncates blog posts while preserving HTML structure and respecting the `<!-- more -->` marker. It uses DOM parsing to identify structural boundaries (tags) rather than simple character truncation, making it suitable for mixed content with code blocks, images, and formatted text.

---

## Architecture

### Core Files

| File | Purpose | Key Functions |
|------|---------|---|
| `index.js` | Entry point | Registers excerpt generator with Hexo |
| `lib/hexo-excerpt.js` | Main algorithm | Handles depth counting, filtering, DOM rendering |
| `lib/dom-filter.js` | CSS selector filtering | Excludes matched tags from excerpts |

### Key Dependencies

- **htmlparser2** (v6.1.0) - HTML parsing to DOM
- **dom-serializer** (v1.3.1) - DOM rendering back to HTML
- **css-select** (v4.0.0) - CSS selector compilation and matching
- **domutils** (v2.5.2) - DOM node manipulation and filtering
- **lodash.defaults** (v4.2.0) - Config merging

---

## Configuration Schema

### Default Configuration
```yaml
excerpt:
  depth: 10                    # Number of top-level tags to include in excerpt
  excerpt_excludes: []        # CSS selectors to exclude from excerpt
  more_excludes: []           # CSS selectors to exclude from "more" section
  hideWholePostExcerpts: false # Hide excerpts if they're the entire post
```

### Legacy Support
- `excerpt_depth` (deprecated) - Falls back to `excerpt.depth` with warning

### Config Merging Logic (lib/hexo-excerpt.js:24)
```javascript
let opts = defaults({}, this.config.excerpt, legacy, DEFAULT_CONFIG);
```
Priority: `excerpt.depth` > `excerpt_depth` > `depth: 10` (default)

---

## Excerpt Generation Algorithm

### High-Level Flow

1. **Check for existing excerpts** - Skip processing if already set
2. **Detect `<!-- more -->` marker** - Honor manual separators
3. **Parse HTML content** - Convert to DOM tree
4. **Count top-level tag nodes** - Track structural blocks
5. **Split at depth boundary** - Create excerpt and "more" sections
6. **Apply CSS filters** - Remove excluded elements
7. **Render back to HTML** - Serialize DOM to string

### Pseudocode

```
function generateExcerpt(post, config):
    // Step 1: Skip if already has excerpt or manual marker
    if post.excerpt exists OR
       content contains "<!-- more -->" OR
       content contains '<a id="more"></a>' OR
       content contains '<span id="more"></span>':
        return post unchanged
    
    // Step 2: Parse HTML to DOM tree
    nodes = parseDocument(post.content)
    
    // Step 3: Count nodes until depth threshold
    excerptTagCount = 1
    nodeIndex = 0
    for each node in nodes:
        if node is a tag AND not excluded by excerptFilter:
            excerptTagCount++
            if excerptTagCount > config.depth:
                break
        nodeIndex++
    
    // Step 4: Split at boundary
    excerptNodes = nodes[0 : nodeIndex]
    moreNodes = nodes[nodeIndex : end]
    
    // Step 5: Filter (remove excluded elements)
    excerptNodes = filter(excerptNodes, excerptFilter)
    moreNodes = filter(moreNodes, moreFilter)
    
    // Step 6: Skip if excerpt is entire post and hideWholePostExcerpts=true
    if moreNodes is empty AND hideWholePostExcerpts=true:
        return post unchanged
    
    // Step 7: Render filtered nodes back to HTML
    post.excerpt = renderDOM(excerptNodes)
    post.more = renderDOM(moreNodes)
    
    return post
```

### Detailed Depth Counting (lib/hexo-excerpt.js:46-54)

```javascript
let stopIndex = 1;        // Start at 1, not 0
let index = 0;
for (; index < nodes.length && stopIndex <= opts.depth; index++) {
    if (nodes[index].type === 'tag' && excerptFilter.match(nodes[index])) {
        stopIndex++;
    }
}
```

**Key aspects**:
- Initial counter starts at 1, so `depth: 10` means "collect nodes until we've seen 10 tag nodes"
- **Only counts tag nodes** (ignores text nodes, comments)
- **Applies filter before counting** - excluded tags don't count toward depth
- **Index is slice boundary** - `nodes.slice(0, index)` becomes excerpt

---

## "More" Marker Handling

### Detection Logic (lib/hexo-excerpt.js:36)

Multiple marker formats are supported:

```javascript
if (post.excerpt ||                                    // Already set
    /<!--\s*more\s*-->/.test(post.content) ||        // <!-- more -->
    post.content.indexOf('<a id="more"></a>') !== -1 ||  // <a id="more"></a>
    post.content.indexOf('<span id="more"></span>') !== -1) {  // <span id="more"></span>
    return post unchanged;
}
```

**Whitespace flexibility**: Pattern `/<!--\s*more\s*-->/` allows spaces/newlines around `more`

### Behavior
- If ANY marker is detected, the post is **returned unchanged**
- No automatic excerpt/more split is performed
- Post content retains markers as-is

---

## CSS Selector Filtering (lib/dom-filter.js)

### Filter Class Architecture

```javascript
class Filter {
    constructor(hexo, excludes):
        this.selectors = excludes.map(selector => 
            try: CSSselect.compile(selector)
            catch: return () => false  // Invalid selectors silently ignored
        )
    
    match(node):
        // Returns true if node does NOT match any exclude selector
        return !selectors.some(s => s(node))
    
    filter(nodes):
        // Two-phase filtering:
        // 1. Remove inner matching nodes (descendants)
        // 2. Keep only top-level non-matching nodes
        
        domutils.filter(n => !match(n), nodes)
            .forEach(node => removeElement(node))
        
        return nodes.filter(match.bind(this))
}
```

### Filtering Behavior

**Two-phase approach**:
1. **Inner node removal** - Recursively removes ALL nodes matching selectors (including nested)
2. **Top-level filtering** - Keeps only top-level nodes not matching selectors

**Example** (from tests with `excerpt_excludes: ['.ignore', 'span.also']`):
```html
Input:
<p>block 1</p>
<p>block 2 <span class="also">123</span></p>
<div class="ignore">block3</div>

Output (after filtering):
<p>block 1</p>
<p>block 2 </p>    <!-- inner span removed, p kept -->
                   <!-- div.ignore removed entirely -->
```

### Error Handling
Invalid CSS selectors (syntax errors):
- Logged as error: `'hexo-excerpt: Ignore invalid CSS selector: ' + selector`
- Replaced with null function: `() => false` (matches nothing, doesn't exclude anything)
- Processing continues without interruption

---

## Edge Case Handling

### 1. HTML Entities

**Status**: ✅ Preserved correctly

**Mechanism**: `parseDocument` and `domrender` both use `{ decodeEntities: false }`

**Example**:
```
Input:  <p>block 1 &lt;span&gt;</p>
Output: <p>block 1 &lt;span&gt;</p>  <!-- unchanged -->
```

**Test case**: `without-config.js` line 53-62, assertion line 90

### 2. Nested Tags (Code Blocks, etc.)

**Status**: ✅ Fully preserved within excerpt boundary

**Behavior**: 
- Only top-level tags count toward depth
- Inner content is preserved as-is
- No recursive counting

**Example**:
```html
Input:
<div>
  <pre><code>block 1</code></pre>
  <p>block 2</p>
</div>

At depth=2:
Output (both included):
<div>
  <pre><code>block 1</code></pre>
  <p>block 2</p>
</div>
```

### 3. Images

**Status**: ✅ Preserved (treated as regular tags)

**Behavior**: 
- `<img>` tag counts as 1 toward depth
- Self-closing tags work normally
- No special handling for lazy-loading attributes

### 4. Multibyte Characters (Unicode, CJK)

**Status**: ✅ Fully supported

**Mechanism**: 
- Text content handled by htmlparser2/domutils (native Node.js UTF-8)
- No character-level truncation
- Safe boundaries at tag edges

---

## Configuration Validation

### Type Coercion (lib/hexo-excerpt.js:24-27)

```javascript
opts.depth = parseInt(opts.depth);  // String → Number

if (!Array.isArray(opts.excerpt_excludes)) 
    opts.excerpt_excludes = [opts.excerpt_excludes];
if (!Array.isArray(opts.more_excludes)) 
    opts.more_excludes = [opts.more_excludes];
```

**Edge cases**:
- `depth: "5"` → `5` (coerced)
- `depth: "notanumber"` → `NaN` (causes all posts treated as < depth)
- `excerpt_excludes: ".ignore"` → `[".ignore"]` (auto-wrapped)
- `excerpt_excludes: [".ignore", ".other"]` → unchanged

---

## Example Input/Output

### Example 1: Basic Truncation

**Config**:
```yaml
excerpt:
  depth: 5
```

**Input Post Content**:
```html
<p>Introduction paragraph</p>
<p>Second paragraph</p>
<p>Third paragraph</p>
<p>Fourth paragraph</p>
<p>Fifth paragraph</p>
<p>Sixth paragraph</p>
<p>Seventh paragraph</p>
```

**Output**:
```
post.excerpt = '<p>Introduction paragraph</p>\n<p>Second paragraph</p>\n<p>Third paragraph</p>\n<p>Fourth paragraph</p>\n<p>Fifth paragraph</p>'

post.more = '\n<p>Sixth paragraph</p>\n<p>Seventh paragraph</p>'
```

**Test source**: `with-config.js` lines 23-72

---

### Example 2: Respecting "More" Marker

**Input Post Content**:
```html
<p>block 1</p>
<!-- more -->
<p>block 2</p>
<p>block 3</p>
```

**Output**:
```
post.excerpt = '' (unchanged)
post.more = ''   (unchanged)
post.content = '<p>block 1</p>\n<!-- more -->\n<p>block 2</p>\n<p>block 3</p>'
```

**Test source**: `with-config.js` lines 42-50, assertion 74-76

---

### Example 3: CSS Selector Filtering

**Config**:
```yaml
excerpt:
  depth: 5
  excerpt_excludes:
    - '.ignore'        # Exclude elements with class "ignore"
    - 'span.also'      # Exclude span elements with class "also"
```

**Input Post Content**:
```html
<p>block 1</p>
<p>block 2</p>
<p class="also">block 3</p>
<p>block 4 <span class="also">abc</span></p>
<p class="ignore">block 5</p>
<p>block 6</p>
<p class="ignore">block 7</p>
<p>block 8</p>
<p>block 9</p>
<p>block 10</p>
<p>block 11</p>
```

**Processing**:
- Count: block 1✓(1), block 2✓(2), block 3✓(3), block 4✓(4), block 5✗(ignored), block 6✓(5)
- STOP at node index 6

**Output**:
```
post.excerpt = '<p>block 1</p>\n<p>block 2</p>\n<p class="also">block 3</p>\n<p>block 4 </p>\n\n<p>block 6</p>'
              (span.also removed from block 4, class.ignore removed)

post.more = '\n\n<p>block 8</p>\n<p>block 9</p>\n<p>block 10</p>\n<p>block 11</p>'
```

**Note**: Whitespace artifacts (empty lines) appear when top-level nodes are removed

**Test source**: `with-filter.js` lines 22-79

---

### Example 4: Short Post (hideWholePostExcerpts)

**Config** (default):
```yaml
excerpt:
  depth: 10
  hideWholePostExcerpts: false  # Show excerpts even for short posts
```

**Input Post Content** (3 tags):
```html
<p>block 1</p>
<p>block 2 <span>123</span></p>
<div>block3</div>
```

**Output**:
```
post.excerpt = '<p>block 1</p>\n<p>block 2 <span>123</span></p>\n<div>block3</div>'
post.more = ''

Note: Entire post is in excerpt because hideWholePostExcerpts=false
```

**Test source**: `without-config.js` lines 11-76

---

### Example 5: HTML Entities

**Input Post Content**:
```html
<p>block 1 &lt;span&gt;</p>
<p>2</p><p>3</p><p>4</p>
<p>5</p><p>6</p><p>7</p>
<p>8</p><p>9</p><p>10</p>
<p>block 11 &lt;span&gt;</p>
```

**Config**:
```yaml
excerpt:
  depth: 10
```

**Output**:
```
post.excerpt = '<p>block 1 &lt;span&gt;</p>\n<p>2</p><p>3</p><p>4</p>\n<p>5</p><p>6</p><p>7</p>\n<p>8</p><p>9</p><p>10</p>'
post.more = '\n<p>block 11 &lt;span&gt;</p>'

Note: HTML entities (&lt;, &gt;) preserved exactly as-is
```

**Test source**: `without-config.js` lines 51-92

---

## Behaviors to Port to Halo-Theme-Archer

### 1. **Tag-based Depth Counting** ✅ Core Algorithm
   - **What**: Count structural tags (block-level elements) not characters
   - **Why**: Preserves code blocks, images, and complex layouts
   - **How**: Parse to DOM, iterate nodes, count tag-type nodes
   - **Relevance**: Essential for mixed-content blog themes

### 2. **"More" Marker Detection** ✅ Excerpt Boundary
   - **What**: Support multiple marker formats (`<!-- more -->`, `<a id="more"></a>`, `<span id="more"></span>`)
   - **Why**: User control over exact excerpt boundaries
   - **How**: Regex pattern + exact string matching before processing
   - **Relevance**: Common feature in Hexo blogs; users expect it

### 3. **CSS Selector Filtering** ✅ Content Exclusion
   - **What**: Exclude elements matching CSS selectors from excerpts
   - **Why**: Hide ads, disclaimers, or non-essential content
   - **How**: Compile selectors once, apply before counting/filtering
   - **Relevance**: Flexible, avoids hardcoded tag blacklists

### 4. **HTML Entity Preservation** ✅ Content Integrity
   - **What**: Keep `&lt;`, `&gt;`, `&amp;` etc. unchanged
   - **Why**: Prevent encoding errors and preserve intent in code samples
   - **How**: Parse with `decodeEntities: false`, render with same flag
   - **Relevance**: Critical for technical content

### 5. **Nested Content Preservation** ✅ Structure Safety
   - **What**: Keep inner HTML intact within boundary tags
   - **Why**: Don't truncate mid-tag, breaking code/lists/blockquotes
   - **How**: Only count top-level tags, preserve sub-content
   - **Relevance**: Ensures valid output HTML

### 6. **Error Handling for Config** ✅ Robustness
   - **What**: Silently skip invalid CSS selectors, coerce types
   - **Why**: Invalid config shouldn't break the theme
   - **How**: Try-catch on selector compilation, parseInt on depth, auto-array wrapping
   - **Relevance**: Graceful degradation

### 7. **hideWholePostExcerpts Option** ✅ UX Polish
   - **What**: Optionally hide excerpts for short posts
   - **Why**: Prevent showing "Read More" link when there's nothing more
   - **How**: Check if `more` section is empty, skip excerpt setting
   - **Relevance**: Cleaner UI for mixed post lengths

---

## Testing Strategy

The plugin includes comprehensive test suites:

| Test File | Scenarios Covered |
|-----------|---|
| `with-config.js` | Custom depth (5), deprecation warning |
| `without-config.js` | Default depth (10), HTML entities, markers |
| `with-filter.js` | CSS selectors, filtering edge cases |

### Running Tests
```bash
npm test
npm run test-cover  # With coverage
```

---

## Known Limitations & Quirks

### 1. Whitespace Artifacts
When filtering removes top-level nodes, orphaned whitespace text nodes can create empty lines in output:
```html
Input:  <p>a</p>\n<p class="ignore">b</p>\n<p>c</p>
Output: <p>a</p>\n\n<p>c</p>  <!-- extra newline from removed node -->
```

### 2. No Character Limit
Plugin only respects tag depth, not character/word count. Very large tags can dominate excerpts.

### 3. CSS Selector Compilation Cost
Selectors are compiled once per post batch, but invalid selectors are silently replaced with `() => false`, affecting subsequent filtering.

### 4. Deprecated excerpt_depth
Old config parameter still works but logs warning. Migration path exists but not forced.

### 5. Empty More on Whole-Post Excerpts
When excerpt == entire post:
- If `hideWholePostExcerpts: true` → excerpt is NOT set (empty string)
- If `hideWholePostExcerpts: false` → excerpt is set, `more` is empty string

---

## Performance Notes

- **Parsing**: O(content size) - htmlparser2 is streaming-based
- **Depth counting**: O(n) where n = number of DOM nodes
- **Filtering**: O(n*m) where m = number of selectors
- **DOM rendering**: O(n) - linear traversal

**Typical performance**: Negligible for posts < 100 tags; benchmark recommended for larger datasets.

---

## Version History (Key Commits)

- **1.3.1** (Nov 2024) - Security patches, latest dependencies
- **1.3.0** (May 2021) - Security patches
- **1.2.1** (May 2021) - Bug fixes
- **1.2.0** - Don't process if excerpt already exists (#35)
- **1.0.0** - Initial release

---

## Files Snapshot

```
hexo-excerpt/
├── index.js                    (6 lines) - Entry point
├── lib/
│   ├── hexo-excerpt.js         (79 lines) - Main algorithm
│   └── dom-filter.js           (37 lines) - CSS filtering
├── tests/
│   ├── with-config.js          (102 lines) - Depth tests
│   ├── without-config.js       (95 lines) - Default config tests
│   └── with-filter.js          (86 lines) - CSS filter tests
├── package.json                - Dependencies, scripts
└── README.md                   - User-facing docs
```

---

## Dependencies Analysis

### Direct Dependencies
1. **htmlparser2@^6.1.0** - HTML → DOM parsing
   - Supports HTML5, XHTML, malformed HTML
   - Streaming parser, good memory efficiency
   - `decodeEntities: false` prevents double-encoding

2. **dom-serializer@^1.3.1** - DOM → HTML rendering
   - Complements htmlparser2
   - Preserves original formatting where possible

3. **css-select@^4.0.0** - CSS selector matching
   - Compiles selectors to fast matcher functions
   - Error handling via try-catch

4. **domutils@^2.5.2** - DOM utilities
   - `filter()` for node selection
   - `removeElement()` for in-place node removal

5. **lodash.defaults@^4.2.0** - Config merging
   - Standard defaults pattern (priority: specific > general)

### Why These Choices?
- **htmlparser2 + domutils** - Mature ecosystem (used by cheerio, jsdom)
- **css-select** - Fast selector compilation vs. regex
- **lodash.defaults** - Familiar Node.js pattern, well-tested

---

## Integration Notes for Halo-Theme-Archer

### Applicable Contexts
1. **Post list pages** - Show excerpt with "Read More" link
2. **Archive pages** - Concise post preview
3. **Search results** - Relevant snippet display
4. **Social media previews** - Open Graph excerpt

### Not Applicable
- **Full post pages** - Use complete content
- **Admin preview** - Show editing interface
- **Feed generation** - May want separate rules

### Implementation Strategy
1. **Wrap algorithm in template helper** or **Thymeleaf function**
2. **Cache excerpts** in database to avoid re-parsing
3. **Make depth/filters configurable** in theme settings
4. **Preserve existing excerpt** if already set in post metadata

---

## Conclusion

Hexo-excerpt solves the excerpt generation problem elegantly by:
- **Respecting structure** (counting tags, not characters)
- **Honoring user intent** (supporting multiple "more" markers)
- **Enabling flexibility** (CSS selector filtering)
- **Maintaining integrity** (preserving entities, nesting, entities)

The codebase is **clean, well-tested, and battle-hardened** (1000+ GitHub stars, v1.3.1 stable).

**Recommendation**: Port the core algorithm (depth counting + DOM filtering) to Halo-theme-archer. Consider whether to adapt htmlparser2 or use native browser DOM APIs (if web-based) or server-side DOM library equivalents.
