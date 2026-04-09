# AutoShow 车展页

React + Vite + TypeScript + Tailwind，设计稿宽度 **750px**，主页面为 `AutoShowPage`。

## 预览视觉

1. **本地**：在项目根目录执行 `npm run dev`，浏览器打开：**[http://localhost:5190/](http://localhost:5190/)**（端口在 `vite.config.ts` 固定为 `5190`，避免与本机其它占用 5173 的进程冲突）。若仍打不开，请看下方「端口异常」。
2. **线上（与部署一致）**：构建产物与 GitHub Pages 一致时，打开下方「在线预览」链接。本地开发时切图走 Figma MCP；线上走 `public/figma-assets/`。

### 端口异常（localhost 打不开 / invalid response）

- 先确认已在 **`chezhan-app` 目录**执行 `npm run dev`，且终端出现 `Local: http://localhost:5190/`。
- 若提示端口被占用：在终端执行 `lsof -i :5190` 查看占用进程，结束后再启动；或临时改 `vite.config.ts` 里 `server.port` 为其它未占用端口（如 `5191`）。

## 在线预览（GitHub）

- 仓库：<https://github.com/shespeggy-bot/carshow>
- 页面：<https://shespeggy-bot.github.io/carshow/>

**若打开是 404**，请在本仓库完成一次设置并等待部署：

1. **Settings → Pages → Build and deployment**
2. **Source** 选 **Deploy from a branch**（不要选 GitHub Actions）
3. **Branch** 选 **gh-pages**，文件夹选 **/ (root)**，点 Save
4. 打开 **Actions** 确认 **Deploy to GitHub Pages** 已成功；也可手动 **Run workflow** 重跑

首次推送后若还没有 `gh-pages` 分支，等 Actions 跑完会自动创建。

## 开发

```bash
npm install
npm run dev
```

开发时切图默认从 **Figma 桌面 MCP** 本地地址 `http://localhost:3845/assets/...` 加载（需本机打开对应设计稿并开启 MCP）。

## 切图（生产构建）

生产构建使用 `public/figma-assets/` 下的静态文件（文件名与 `src/figmaAssets.ts` 中 hash 一致）。

在 Figma MCP 可用时同步到本地：

```bash
npm run assets:sync
```

也可手动将导出文件放入 `public/figma-assets/`。然后再执行：

```bash
npm run build
```

部署到 GitHub Pages（子路径 `/carshow/`）时 CI 已设置 `VITE_BASE=/carshow/`；本地模拟：

```bash
VITE_BASE=/carshow/ npm run build
```

## 环境变量（可选）

| 变量 | 说明 |
|------|------|
| `VITE_FIGMA_ASSET_BASE` | 自定义资源根 URL（不含 `/assets` 后缀路径），将请求 `${BASE}/assets/{文件名}` |

## 目录说明

| 路径 | 说明 |
|------|------|
| `src/AutoShowPage.tsx` | 车展长页主组件 |
| `src/figmaAssets.ts` | 切图路径与导出 |
| `public/figma-assets/` | 生产环境静态切图 |
| `scripts/sync-figma-assets.mjs` | 从本机 MCP 拉取切图到 `public/figma-assets/` |
