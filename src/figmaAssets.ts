/**
 * Figma 切图地址策略（整理后）：
 * - 开发：从 Figma 桌面 MCP 的本地服务读取（需本机打开设计稿并开启 MCP）
 * - 生产构建：使用 `public/figma-assets/` 下与 hash 同名的文件（见 README 同步说明）
 * - 任意环境：可设置 `VITE_FIGMA_ASSET_BASE` 指向 CDN/静态资源根（不含 `/assets` 路径），与原先一致
 */
const trim = (s: string) => s.replace(/\/$/, "");

function assetUrl(filename: string): string {
  const custom = import.meta.env.VITE_FIGMA_ASSET_BASE;
  if (custom) {
    return `${trim(custom)}/assets/${filename}`;
  }
  if (import.meta.env.DEV) {
    return `http://localhost:3845/assets/${filename}`;
  }
  return `${trim(import.meta.env.BASE_URL)}figma-assets/${filename}`;
}

export const imgVector11 = assetUrl("7e56748152ca6e93efc83b20246e4985b6b5c392.svg");
export const img = assetUrl("845dbf0873681424fc1d0c01f2044c26e7e351d6.png");
export const imgRectangle45 = assetUrl("f05595c86661083476f0964448c10f5d09b91b0d.svg");
export const imgEllipse4 = assetUrl("95dcbc609606929da6e01bd65e7afc70f584f462.svg");
export const imgPolygon2 = assetUrl("8183c8dd75554bbb5792081950e90829a2066d56.svg");
export const img1 = assetUrl("e8699ce658532192681bbc52b693f47257d2accf.svg");
export const imgPolygon1 = assetUrl("3a5f54b151d141776f965bf604eb4707e454759c.svg");
export const img2 = assetUrl("6e1d2f32db79c2b637208f0c7b339dcbad422620.png");
export const img2X1 = assetUrl("9dbdbf86f00e154968bf79bedcd90a98c7b47ccc.png");
export const img5281 = assetUrl("9cabb71b2a2df1da1bf35e86de9d325ec5855852.png");
export const img321 = assetUrl("5460b6181ee979668f71c6feb451295c8ed6402c.png");
export const img44 = assetUrl("1052ac475c43eba925c126464c49115688d1ab5b.png");
export const img5391 = assetUrl("462ceea527a46d6810ef3dc36e78049d9864231a.png");
export const img45 = assetUrl("39aad5722e8cb5236e3668fa1833f0277da0999d.png");
export const img46 = assetUrl("110ca064aab4d374fd448db59fd5e827b5c447d0.png");
export const img5 = assetUrl("57afebbb86651e2ef9968b06c3b8132adab66509.png");
export const img6 = assetUrl("c3890eb0d4949a09752946a605c82c539094ebc1.png");
export const img7 = assetUrl("71d6514b1daeb19bd0be810276f8d000377596a2.png");
export const img8 = assetUrl("5397f9efab4159ca54351f04539a2101828c10dd.png");
export const img9 = assetUrl("cf0da49072a9a020603b93d7b50401aa62b4a3a4.png");
export const img10 = assetUrl("e6160701a245cbb068abec17f588c4c8c69bc535.png");
export const img11 = assetUrl("829d56bf2d9e4b33a94f11e9bcc82dc80bb95069.svg");
export const imgASleekModernElectricCarParkedOnAScenicRoadSurroundedByLushGreenery1 =
  assetUrl("81aaeab6b387997c17981a99d31393696d150392.png");
export const imgASleekModernElectricVehicleParkedInAnUrbanSettingWithDynamicLightingEffectsAndFuturisticArchitectureInTheBackground =
  assetUrl("e1b7ddf41b812769163df1878ac539334adbd1a6.png");
export const img481 = assetUrl("4fe06e7fa4693d1c328ac9eea81e108816248966.png");
export const imgImage1 = assetUrl("60c477f327e5af92d219d860538fe3503a25b911.png");
export const img361 = assetUrl("0f8c9bda14d797a0c2728295a37ba57989eef591.png");
export const img381 = assetUrl("f43e23b7062954d015966871c090abcf65886f62.png");
export const imgRectangle46 = assetUrl("c058ef7ddfbaf47e6b4b98c84a6e87db784f91b7.svg");
export const img3 = assetUrl("415811d069bef77007225d091a50153a55bbf51a.svg");
export const img4 = assetUrl("a71660424cbbd98921b969dcc180ac018293e2b7.svg");
export const img43 = assetUrl("f77d254d339bceaeb6d9aebc1cb0f53681d2f79e.svg");
export const imgASleekModernElectricCarParkedOnAScenicRoadSurroundedByLushGreenery =
  assetUrl("1f5ed4d982933aa7b801e5050e6fd2f55cabb0bd.svg");
export const imgUnion = assetUrl("a8eb3f44c81c0dbe18d7bfe4b3f44f052e165776.svg");
export const imgUnion1 = assetUrl("b894f2f0366ac21901931f8f35c9e5a8d59fa0ed.svg");
export const imgEllipse5 = assetUrl("c09c94c5346117f2fcc72911c80b36f02ee27aaa.svg");
export const imgRectangle47 = assetUrl("8d44522c650e01819978596b969272a7fd8c57f6.svg");
export const imgVector12 = assetUrl("a61c700dcfa2337660c4e2cbf57188600cd292ee.svg");
