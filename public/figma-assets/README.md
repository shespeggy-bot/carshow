# Figma 切图（静态资源）

生产环境 `npm run build` 时，页面会从本目录按 **文件名（hash）** 加载图片，与 `src/figmaAssets.ts` 中导出一致。

## 同步方式

1. **本机已打开 Figma 设计稿且 MCP 资源服务可用时**，在项目根目录执行：

   ```bash
   npm run assets:sync
   ```

   将文件下载到本目录。

2. **手动**：从 Figma / 设计导出工具导出相同 hash 文件名的资源，放入本目录。

部署前请确认本目录下文件齐全，否则线上图片会 404。
