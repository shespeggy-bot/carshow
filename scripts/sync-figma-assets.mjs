#!/usr/bin/env node
/**
 * 在 Figma 桌面端已打开设计稿且 MCP 资源服务可用时，将切图同步到 public/figma-assets/
 * 用法：node scripts/sync-figma-assets.mjs
 * 可选环境变量：FIGMA_ASSET_HOST（默认 http://127.0.0.1:3845）
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "public", "figma-assets");
const HOST = (process.env.FIGMA_ASSET_HOST ?? "http://127.0.0.1:3845").replace(/\/$/, "");

const FILES = [
  "7e56748152ca6e93efc83b20246e4985b6b5c392.svg",
  "845dbf0873681424fc1d0c01f2044c26e7e351d6.png",
  "f05595c86661083476f0964448c10f5d09b91b0d.svg",
  "95dcbc609606929da6e01bd65e7afc70f584f462.svg",
  "8183c8dd75554bbb5792081950e90829a2066d56.svg",
  "e8699ce658532192681bbc52b693f47257d2accf.svg",
  "3a5f54b151d141776f965bf604eb4707e454759c.svg",
  "6e1d2f32db79c2b637208f0c7b339dcbad422620.png",
  "9dbdbf86f00e154968bf79bedcd90a98c7b47ccc.png",
  "9cabb71b2a2df1da1bf35e86de9d325ec5855852.png",
  "5460b6181ee979668f71c6feb451295c8ed6402c.png",
  "1052ac475c43eba925c126464c49115688d1ab5b.png",
  "462ceea527a46d6810ef3dc36e78049d9864231a.png",
  "39aad5722e8cb5236e3668fa1833f0277da0999d.png",
  "110ca064aab4d374fd448db59fd5e827b5c447d0.png",
  "57afebbb86651e2ef9968b06c3b8132adab66509.png",
  "c3890eb0d4949a09752946a605c82c539094ebc1.png",
  "71d6514b1daeb19bd0be810276f8d000377596a2.png",
  "5397f9efab4159ca54351f04539a2101828c10dd.png",
  "cf0da49072a9a020603b93d7b50401aa62b4a3a4.png",
  "e6160701a245cbb068abec17f588c4c8c69bc535.png",
  "829d56bf2d9e4b33a94f11e9bcc82dc80bb95069.svg",
  "81aaeab6b387997c17981a99d31393696d150392.png",
  "e1b7ddf41b812769163df1878ac539334adbd1a6.png",
  "4fe06e7fa4693d1c328ac9eea81e108816248966.png",
  "60c477f327e5af92d219d860538fe3503a25b911.png",
  "0f8c9bda14d797a0c2728295a37ba57989eef591.png",
  "f43e23b7062954d015966871c090abcf65886f62.png",
  "c058ef7ddfbaf47e6b4b98c84a6e87db784f91b7.svg",
  "415811d069bef77007225d091a50153a55bbf51a.svg",
  "a71660424cbbd98921b969dcc180ac018293e2b7.svg",
  "f77d254d339bceaeb6d9aebc1cb0f53681d2f79e.svg",
  "1f5ed4d982933aa7b801e5050e6fd2f55cabb0bd.svg",
  "a8eb3f44c81c0dbe18d7bfe4b3f44f052e165776.svg",
  "b894f2f0366ac21901931f8f35c9e5a8d59fa0ed.svg",
  "c09c94c5346117f2fcc72911c80b36f02ee27aaa.svg",
  "8d44522c650e01819978596b969272a7fd8c57f6.svg",
  "a61c700dcfa2337660c4e2cbf57188600cd292ee.svg",
];

async function main() {
  await mkdir(OUT, { recursive: true });
  let ok = 0;
  let fail = 0;
  for (const name of FILES) {
    const url = `${HOST}/assets/${name}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[skip] ${name} -> ${res.status} ${url}`);
      fail++;
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = join(OUT, name);
    await writeFile(dest, buf);
    console.log(`[ok] ${name}`);
    ok++;
  }
  console.log(`\nDone: ${ok} saved, ${fail} failed (start Figma desktop / MCP if needed).`);
  if (fail > 0) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
