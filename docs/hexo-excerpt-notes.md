# Hexo-Excerpt 技术分析

**仓库**: https://github.com/chekun/hexo-excerpt  
**版本**: 1.3.1  
**许可证**: MIT  
**最后提交**: Nov 2024

## 概述

Hexo-excerpt 是一个用于 Hexo 的自动摘要生成插件，它能智能地截断博客文章，同时保留 HTML 结构并尊重 `<!-- more -->` 标记。它使用 DOM 解析来识别结构边界（标签）而不是简单的字符截断，使其适合包含代码块、图像和格式化文本的混合内容。

---

## 架构

### 核心文件

| 文件 | 功能 | 主要函数 |
|------|---------|---|
| `index.js` | 入口点 | 使用 Hexo 注册摘要生成器 |
| `lib/hexo-excerpt.js` | 主算法 | 处理深度计数、过滤、DOM 渲染 |
| `lib/dom-filter.js` | CSS 选择器过滤 | 从摘要中排除匹配的标签 |

### 关键依赖

- **htmlparser2** (v6.1.0) - HTML 解析为 DOM
- **dom-serializer** (v1.3.1) - DOM 渲染回 HTML
- **css-select** (v4.0.0) - CSS 选择器编译和匹配
- **domutils** (v2.5.2) - DOM 节点操作和过滤
- **lodash.defaults** (v4.2.0) - 配置合并

---

## 配置架构

### 默认配置
```yaml
excerpt:
  depth: 10                    # 摘要中包含的顶级标签数
  excerpt_excludes: []        # 从摘要中排除的 CSS 选择器
  more_excludes: []           # 从"更多"部分中排除的 CSS 选择器
  hideWholePostExcerpts: false # 如果摘要是整个文章，是否隐藏摘要
```

### 向后兼容支持
- `excerpt_depth` (已弃用) - 回退到 `excerpt.depth`，并显示警告

### 配置合并逻辑 (lib/hexo-excerpt.js:24)
```javascript
let opts = defaults({}, this.config.excerpt, legacy, DEFAULT_CONFIG);
```
优先级: `excerpt.depth` > `excerpt_depth` > `depth: 10` (默认)

---

## 摘要生成算法

### 高级流程

1. **检查现有摘要** - 如果已设置则跳过处理
2. **检测 `<!-- more -->` 标记** - 尊重手动分隔符
3. **解析 HTML 内容** - 转换为 DOM 树
4. **计数顶级标签节点** - 追踪结构块
5. **在深度边界处分割** - 创建摘要和"更多"部分
6. **应用 CSS 过滤器** - 移除排除的元素
7. **渲染回 HTML** - 序列化 DOM 为字符串

### 伪代码

```
function generateExcerpt(post, config):
    // 步骤 1: 如果已有摘要或手动标记则跳过
    if post.excerpt exists OR
       content contains "<!-- more -->" OR
       content contains '<a id="more"></a>' OR
       content contains '<span id="more"></span>':
        return post unchanged
    
    // 步骤 2: 将 HTML 解析为 DOM 树
    nodes = parseDocument(post.content)
    
    // 步骤 3: 计数节点直到达到深度阈值
    excerptTagCount = 1
    nodeIndex = 0
    for each node in nodes:
        if node is a tag AND not excluded by excerptFilter:
            excerptTagCount++
            if excerptTagCount > config.depth:
                break
        nodeIndex++
    
    // 步骤 4: 在边界处分割
    excerptNodes = nodes[0 : nodeIndex]
    moreNodes = nodes[nodeIndex : end]
    
    // 步骤 5: 过滤（移除排除的元素）
    excerptNodes = filter(excerptNodes, excerptFilter)
    moreNodes = filter(moreNodes, moreFilter)
    
    // 步骤 6: 如果摘要是整个文章且 hideWholePostExcerpts=true 则跳过
    if moreNodes is empty AND hideWholePostExcerpts=true:
        return post unchanged
    
    // 步骤 7: 将过滤的节点渲染回 HTML
    post.excerpt = renderDOM(excerptNodes)
    post.more = renderDOM(moreNodes)
    
    return post
```

### 详细深度计数 (lib/hexo-excerpt.js:46-54)

```javascript
let stopIndex = 1;        // 从 1 开始，不是 0
let index = 0;
for (; index < nodes.length && stopIndex <= opts.depth; index++) {
    if (nodes[index].type === 'tag' && excerptFilter.match(nodes[index])) {
        stopIndex++;
    }
}
```

**关键方面**:
- 初始计数器从 1 开始，所以 `depth: 10` 意味着"收集节点直到我们看到 10 个标签节点"
- **仅计算标签节点**（忽略文本节点、注释）
- **在计数前应用过滤器** - 排除的标签不计入深度
- **索引是切片边界** - `nodes.slice(0, index)` 成为摘要

---

## "更多"标记处理

### 检测逻辑 (lib/hexo-excerpt.js:36)

支持多种标记格式：

```javascript
if (post.excerpt ||                                    // 已设置
    /<!--\s*more\s*-->/.test(post.content) ||        // <!-- more -->
    post.content.indexOf('<a id="more"></a>') !== -1 ||  // <a id="more"></a>
    post.content.indexOf('<span id="more"></span>') !== -1) {  // <span id="more"></span>
    return post unchanged;
}
```

**空白符灵活性**: 模式 `/<!--\s*more\s*-->/` 允许 `more` 周围有空格/换行

### 行为
- 如果检测到 ANY 标记，文章 **原样返回**
- 不执行自动摘要/更多分割
- 文章内容保留标记原样

---

## CSS 选择器过滤 (lib/dom-filter.js)

### Filter 类架构

```javascript
class Filter {
    constructor(hexo, excludes):
        this.selectors = excludes.map(selector => 
            try: CSSselect.compile(selector)
            catch: return () => false  // 无效选择器被静默忽略
        )
    
    match(node):
        // 如果节点不匹配任何排除选择器，返回 true
        return !selectors.some(s => s(node))
    
    filter(nodes):
        // 两阶段过滤:
        // 1. 移除匹配的内部节点（后代）
        // 2. 仅保留顶级非匹配节点
        
        domutils.filter(n => !match(n), nodes)
            .forEach(node => removeElement(node))
        
        return nodes.filter(match.bind(this))
}
```

### 过滤行为

**两阶段方法**:
1. **内部节点移除** - 递归移除所有匹配选择器的节点（包括嵌套的）
2. **顶级过滤** - 仅保留顶级非匹配节点

**例子**（来自 `excerpt_excludes: ['.ignore', 'span.also']` 的测试）:
```html
输入:
<p>block 1</p>
<p>block 2 <span class="also">123</span></p>
<div class="ignore">block3</div>

输出（过滤后）:
<p>block 1</p>
<p>block 2 </p>    <!-- 内部 span 已移除，p 保留 -->
                   <!-- div.ignore 完全移除 -->
```

### 错误处理
无效的 CSS 选择器（语法错误）:
- 记录为错误: `'hexo-excerpt: Ignore invalid CSS selector: ' + selector`
- 替换为空函数: `() => false`（不匹配任何内容，不排除任何内容）
- 处理继续而不中断

---

## 边界情况处理

### 1. HTML 实体

**状态**: ✅ 正确保留

**机制**: `parseDocument` 和 `domrender` 都使用 `{ decodeEntities: false }`

**例子**:
```
输入:  <p>block 1 &lt;span&gt;</p>
输出: <p>block 1 &lt;span&gt;</p>  <!-- 不变 -->
```

**测试用例**: `without-config.js` 第 53-62 行，断言第 90 行

### 2. 嵌套标签（代码块等）

**状态**: ✅ 在摘要边界内完全保留

**行为**: 
- 仅顶级标签计入深度
- 内部内容原样保留
- 无递归计数

**例子**:
```html
输入:
<div>
  <pre><code>block 1</code></pre>
  <p>block 2</p>
</div>

在 depth=2 时:
输出（两者都包含）:
<div>
  <pre><code>block 1</code></pre>
  <p>block 2</p>
</div>
```

### 3. 图像

**状态**: ✅ 保留（作为常规标签处理）

**行为**: 
- `<img>` 标签计入深度 1
- 自闭合标签正常工作
- 对延迟加载属性无特殊处理

### 4. 多字节字符（Unicode、CJK）

**状态**: ✅ 完全支持

**机制**: 
- 文本内容由 htmlparser2/domutils 处理（原生 Node.js UTF-8）
- 无字符级截断
- 标签边缘处的安全边界

---

## 配置验证

### 类型强制转换 (lib/hexo-excerpt.js:24-27)

```javascript
opts.depth = parseInt(opts.depth);  // String → Number

if (!Array.isArray(opts.excerpt_excludes)) 
    opts.excerpt_excludes = [opts.excerpt_excludes];
if (!Array.isArray(opts.more_excludes)) 
    opts.more_excludes = [opts.more_excludes];
```

**边界情况**:
- `depth: "5"` → `5` (强制转换)
- `depth: "notanumber"` → `NaN` (导致所有文章被视为 < 深度)
- `excerpt_excludes: ".ignore"` → `[".ignore"]` (自动包装)
- `excerpt_excludes: [".ignore", ".other"]` → 不变

---

## 输入/输出示例

### 示例 1: 基本截断

**配置**:
```yaml
excerpt:
  depth: 5
```

**输入文章内容**:
```html
<p>引言段落</p>
<p>第二段</p>
<p>第三段</p>
<p>第四段</p>
<p>第五段</p>
<p>第六段</p>
<p>第七段</p>
```

**输出**:
```
post.excerpt = '<p>引言段落</p>\n<p>第二段</p>\n<p>第三段</p>\n<p>第四段</p>\n<p>第五段</p>'

post.more = '\n<p>第六段</p>\n<p>第七段</p>'
```

**测试来源**: `with-config.js` 第 23-72 行

---

### 示例 2: 尊重"更多"标记

**输入文章内容**:
```html
<p>block 1</p>
<!-- more -->
<p>block 2</p>
<p>block 3</p>
```

**输出**:
```
post.excerpt = '' (不变)
post.more = ''   (不变)
post.content = '<p>block 1</p>\n<!-- more -->\n<p>block 2</p>\n<p>block 3</p>'
```

**测试来源**: `with-config.js` 第 42-50 行，断言 74-76

---

### 示例 3: CSS 选择器过滤

**配置**:
```yaml
excerpt:
  depth: 5
  excerpt_excludes:
    - '.ignore'        # 排除 class 为 "ignore" 的元素
    - 'span.also'      # 排除 class 为 "also" 的 span 元素
```

**输入文章内容**:
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

**处理**:
- 计数: block 1✓(1), block 2✓(2), block 3✓(3), block 4✓(4), block 5✗(忽略), block 6✓(5)
- 在节点索引 6 处停止

**输出**:
```
post.excerpt = '<p>block 1</p>\n<p>block 2</p>\n<p class="also">block 3</p>\n<p>block 4 </p>\n\n<p>block 6</p>'
              (span.also 从 block 4 中移除，class.ignore 被移除)

post.more = '\n\n<p>block 8</p>\n<p>block 9</p>\n<p>block 10</p>\n<p>block 11</p>'
```

**注意**: 当移除顶级节点时会出现空白制品（空行）

**测试来源**: `with-filter.js` 第 22-79 行

---

### 示例 4: 短文章 (hideWholePostExcerpts)

**配置**（默认）:
```yaml
excerpt:
  depth: 10
  hideWholePostExcerpts: false  # 即使对于短文章也显示摘要
```

**输入文章内容**（3 个标签）:
```html
<p>block 1</p>
<p>block 2 <span>123</span></p>
<div>block3</div>
```

**输出**:
```
post.excerpt = '<p>block 1</p>\n<p>block 2 <span>123</span></p>\n<div>block3</div>'
post.more = ''

注意: 整个文章在摘要中，因为 hideWholePostExcerpts=false
```

**测试来源**: `without-config.js` 第 11-76 行

---

### 示例 5: HTML 实体

**输入文章内容**:
```html
<p>block 1 &lt;span&gt;</p>
<p>2</p><p>3</p><p>4</p>
<p>5</p><p>6</p><p>7</p>
<p>8</p><p>9</p><p>10</p>
<p>block 11 &lt;span&gt;</p>
```

**配置**:
```yaml
excerpt:
  depth: 10
```

**输出**:
```
post.excerpt = '<p>block 1 &lt;span&gt;</p>\n<p>2</p><p>3</p><p>4</p>\n<p>5</p><p>6</p><p>7</p>\n<p>8</p><p>9</p><p>10</p>'
post.more = '\n<p>block 11 &lt;span&gt;</p>'

注意: HTML 实体（&lt;, &gt;）完全按原样保留
```

**测试来源**: `without-config.js` 第 51-92 行

---

## 需要移植到 Halo-Theme-Archer 的行为

### 1. **基于标签的深度计数** ✅ 核心算法
   - **什么**: 计数结构标签（块级元素）而不是字符
   - **为什么**: 保留代码块、图像和复杂布局
   - **如何**: 解析为 DOM，迭代节点，计数标签类型节点
   - **相关性**: 对混合内容博客主题至关重要

### 2. **"更多"标记检测** ✅ 摘要边界
   - **什么**: 支持多种标记格式（`<!-- more -->`、`<a id="more"></a>`、`<span id="more"></span>`）
   - **为什么**: 用户控制确切的摘要边界
   - **如何**: 正则表达式 + 处理前的精确字符串匹配
   - **相关性**: Hexo 博客中的常见功能；用户期望它

### 3. **CSS 选择器过滤** ✅ 内容排除
   - **什么**: 排除与 CSS 选择器匹配的元素
   - **为什么**: 隐藏广告、免责声明或非必要内容
   - **如何**: 编译选择器一次，在计数/过滤前应用
   - **相关性**: 灵活，避免硬编码标签黑名单

### 4. **HTML 实体保留** ✅ 内容完整性
   - **什么**: 保持 `&lt;`、`&gt;`、`&amp;` 等不变
   - **为什么**: 防止编码错误并保留代码示例中的意图
   - **如何**: 使用 `decodeEntities: false` 解析，使用相同标志渲染
   - **相关性**: 对技术内容至关重要

### 5. **嵌套内容保留** ✅ 结构安全
   - **什么**: 在边界标签内保留内部 HTML
   - **为什么**: 不在标签中间截断，破坏代码/列表/引用
   - **如何**: 仅计数顶级标签，保留子内容
   - **相关性**: 确保有效的输出 HTML

### 6. **配置错误处理** ✅ 健壮性
   - **什么**: 静默跳过无效的 CSS 选择器，强制转换类型
   - **为什么**: 无效配置不应该破坏主题
   - **如何**: 选择器编译上的 Try-catch、深度上的 parseInt、自动数组包装
   - **相关性**: 优雅降级

### 7. **hideWholePostExcerpts 选项** ✅ UX 优化
   - **什么**: 可选隐藏短文章的摘要
   - **为什么**: 防止在没有更多内容时显示"阅读更多"链接
   - **如何**: 检查"更多"部分是否为空，跳过摘要设置
   - **相关性**: 为混合文章长度提供更清晰的 UI

---

## 测试策略

插件包括全面的测试套件：

| 测试文件 | 覆盖的场景 |
|-----------|---|
| `with-config.js` | 自定义深度（5）、弃用警告 |
| `without-config.js` | 默认深度（10）、HTML 实体、标记 |
| `with-filter.js` | CSS 选择器、过滤边界情况 |

### 运行测试
```bash
npm test
npm run test-cover  # 带覆盖率
```

---

## 已知限制和怪癖

### 1. 空白制品
当过滤移除顶级节点时，孤立的空白文本节点可以在输出中创建空行：
```html
输入:  <p>a</p>\n<p class="ignore">b</p>\n<p>c</p>
输出: <p>a</p>\n\n<p>c</p>  <!-- 来自移除节点的额外换行符 -->
```

### 2. 无字符限制
插件仅尊重标签深度，不是字符/单词计数。非常大的标签可以占据摘要。

### 3. CSS 选择器编译成本
选择器每个文章批次编译一次，但无效选择器被静默替换为 `() => false`，影响后续过滤。

### 4. 弃用的 excerpt_depth
旧配置参数仍然有效但记录警告。存在迁移路径但未强制。

### 5. 整个文章摘要上的空"更多"
当摘要 == 整个文章时：
- 如果 `hideWholePostExcerpts: true` → 摘要未设置（空字符串）
- 如果 `hideWholePostExcerpts: false` → 摘要已设置，`more` 为空字符串

---

## 性能说明

- **解析**: O(内容大小) - htmlparser2 基于流
- **深度计数**: O(n)，其中 n = DOM 节点数
- **过滤**: O(n*m)，其中 m = 选择器数
- **DOM 渲染**: O(n) - 线性遍历

**典型性能**: < 100 个标签的文章可忽略不计；对于更大的数据集建议基准测试。

---

## 版本历史（关键提交）

- **1.3.1** (Nov 2024) - 安全补丁，最新依赖
- **1.3.0** (May 2021) - 安全补丁
- **1.2.1** (May 2021) - Bug 修复
- **1.2.0** - 如果摘要已存在，不处理 (#35)
- **1.0.0** - 初始版本

---

## 文件快照

```
hexo-excerpt/
├── index.js                    (6 行) - 入口点
├── lib/
│   ├── hexo-excerpt.js         (79 行) - 主算法
│   └── dom-filter.js           (37 行) - CSS 过滤
├── tests/
│   ├── with-config.js          (102 行) - 深度测试
│   ├── without-config.js       (95 行) - 默认配置测试
│   └── with-filter.js          (86 行) - CSS 过滤测试
├── package.json                - 依赖、脚本
└── README.md                   - 用户文档
```

---

## 依赖分析

### 直接依赖
1. **htmlparser2@^6.1.0** - HTML → DOM 解析
   - 支持 HTML5、XHTML、格式不正确的 HTML
   - 流式解析器，良好的内存效率
   - `decodeEntities: false` 防止双重编码

2. **dom-serializer@^1.3.1** - DOM → HTML 渲染
   - 补充 htmlparser2
   - 尽可能保留原始格式

3. **css-select@^4.0.0** - CSS 选择器匹配
   - 将选择器编译为快速匹配函数
   - 通过 try-catch 处理错误

4. **domutils@^2.5.2** - DOM 工具
   - `filter()` 用于节点选择
   - `removeElement()` 用于原地节点移除

5. **lodash.defaults@^4.2.0** - 配置合并
   - 标准默认值模式（优先级：特定 > 一般）

### 为什么选择这些？
- **htmlparser2 + domutils** - 成熟的生态系统（用于 cheerio、jsdom）
- **css-select** - 快速选择器编译 vs 正则表达式
- **lodash.defaults** - 熟悉的 Node.js 模式，经过充分测试

---

## Halo-Theme-Archer 集成说明

### 适用上下文
1. **文章列表页面** - 显示摘要和"阅读更多"链接
2. **归档页面** - 简洁的文章预览
3. **搜索结果** - 相关片段显示
4. **社交媒体预览** - Open Graph 摘要

### 不适用
- **完整文章页面** - 使用完整内容
- **管理员预览** - 显示编辑界面
- **Feed 生成** - 可能想要不同的规则

### 实现策略
1. **将算法包装在模板助手**或**Thymeleaf 函数**中
2. **缓存摘要**在数据库中以避免重新解析
3. **使深度/过滤器可配置**在主题设置中
4. **保留现有摘要**如果已在文章元数据中设置

---

## 结论

Hexo-excerpt 通过以下方式优雅地解决了摘要生成问题：
- **尊重结构**（计数标签，不是字符）
- **尊重用户意图**（支持多种"更多"标记）
- **启用灵活性**（CSS 选择器过滤）
- **维护完整性**（保留实体、嵌套、多字节）

代码库是**干净、经过充分测试和久经考验的**（1000+ GitHub stars，v1.3.1 稳定）。

**建议**: 将核心算法（深度计数 + DOM 过滤）移植到 Halo-theme-archer。考虑是否适配 htmlparser2 或使用原生浏览器 DOM API（如果基于网络）或服务器端 DOM 库等价物。
