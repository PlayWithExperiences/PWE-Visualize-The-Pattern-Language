# 数据出处与边界

更新于 2026-09-12 · 记录者 Codex

- `catalog.json`：253个编号、英文名称和三个尺度沿用2026-09-11核对的[官方目录](https://www.patternlanguage.com/apl/aplsample/aplsamplesummary.htm)。中文名是项目译名。
- 原书为 Christopher Alexander, Sara Ishikawa, Murray Silverstein, with Max Jacobson, Ingrid Fiksdahl-King, Shlomo Angel. *A Pattern Language: Towns, Buildings, Construction*. Oxford University Press, 1977。
- `book-source.json`：用户提供的1218页文字扫描本的书目信息、指纹和最初抽查记录。PDF及提取全文不进入仓库。
- `book-index.json`：逐项PDF页序、候选印刷页范围、方案段位置与阅读依据。章节边界仍属于文字恢复结果，并非逐页校勘出版物。108的PDF575–578反序已按印刷页重排；PDF811重复765，造成163缺少印刷页767。不能声称已读缺页。
- `guides/*.json`：全部253项独立中文问题和原则概括，依据原书方案段及相关正文编写。保留年代性假设、构造局限、缺页与未解决挑战；不复制原书插图。
- `guide-catalog.json`：由 `node scripts/compile-guides.mjs` 合并生成；十个工作组为项目教学划分，图解是项目解释。
- `book-relations.json`：1,771条有向“原书提及”。要求正文中的英文标题与括号编号同时匹配；OCR导致一些关系未匹配，不声称完整，不自动转换成依赖。可用 `python3 scripts/extract-book-relations.py /path/to/book.pdf` 在本地重建，脚本检查扫描本指纹且临时全文不被输出到仓库。
- `patterns.js`：保留25项住宅三维演示的具体作用与取舍。其 `related` 是项目组合建议，与 `book-relations.json` 的来源类型不同。

## 表达与限制

253项都有单项图解、空间三维实体和对应尺度的组合操作；这些是可漫游的概念模型，背景建筑可能只表现外部体量，不是253项写实建造模型。社会过程以组织、参与或访问关系表示；构造图解不含工程验算。图形有变化只能证明运行时操作存在，不能单独证明对原书的解释正确。

已发现的替代方案75–78在界面互换，其余组合可能争用同一位置。图解没有自动解决所有几何冲突；跨尺度仅传播明确实现的少量约束。原书正文、图解解释和三维简化分别呈现。
