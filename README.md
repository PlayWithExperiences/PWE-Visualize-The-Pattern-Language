# 模式语言实验室 · Pattern Language Lab

浏览 Christopher Alexander 与合作者《A Pattern Language》的 253 项模式目录，在小住宅与庭院的概念模型里组合探索首批 10 个模式。

## 当前功能

- 253 项编号、英文名称与项目中文译名，按城镇／建筑／建造筛选与搜索。
- 10 个可组合模式，各有原创问题、解释、几何效果、取舍和项目组合建议。
- 参数化三维几何投影的轴测图、拖动／键盘旋转、平面图与剖开外墙。
- 第一人称漫游：眼高 1.65 米，WASD 行走，拖动／方向键转头，墙体和家具碰撞，手机长按方向按钮；支持全屏和回到入口。模式变化立即更新漫游场景。
- 建筑包络、庭院及座位参数；相同包络下的简化面积比较。
- 3 个生活情境预设、空白组合、本机保存、并排比较和 URL 参数分享。
- 无运行时第三方依赖，无在线模型调用。适配 GitHub Pages 子路径。

243 项目前仅提供目录，并未实现详细解释或生成规则。完整原书关系网络尚未录入；十项关联为项目建议。模型是概念空间演示，不是采光或结构模拟，更不是可施工方案。

## 本地开发

需要 Node.js（执行测试／构建）与 Python 3（本地静态服务）。无需安装依赖。

```sh
npm start
# http://127.0.0.1:5199
npm test
npm run build
```

`model.js` 产生几何和指标；`scene.js` 用正交投影生成 SVG；`app.js` 管理交互；`data/` 保留目录与出处。第一人称使用浏览器原生 WebGL，读取同一几何并补充简化平顶，眼高跟随脚下地面；这不是完整的人体物理或真实光照模拟。此阶段使用可调几何，不依赖固定 Blender 模型。

## 发布

```sh
node scripts/publish.mjs
```

脚本构建 `dist/`，只把站点文件提交至同一仓库的 `gh-pages` 分支，不复制 ProjectInfo 或源码历史，不强制推送。GitHub Pages 使用 `gh-pages` 的根目录作为来源。首次启用 Pages 需仓库支持该功能。

公开地址： https://playwithexperiences.github.io/PWE-Visualize-The-Pattern-Language/

数据来源、译名与解释边界见 [data/README.md](data/README.md)。
