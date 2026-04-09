import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AutoShowPage } from "./AutoShowPage";

/** 设计稿尺寸（与 Figma 一致） */
const DESIGN_W = 750;
const DESIGN_H = 4505;

/** 与 GitHub 部署版一致的手机宽度上限（px） */
const PHONE_OUTER_W = 414;
/** 黑色描边 5px + 5px */
const PHONE_BORDER = 10;

function initialScalePhone(): number {
  if (typeof window === "undefined") return (PHONE_OUTER_W - PHONE_BORDER) / DESIGN_W;
  const outer = Math.min(PHONE_OUTER_W, window.innerWidth - 24);
  return Math.max(outer - PHONE_BORDER, 1) / DESIGN_W;
}

/** 全屏仅内容：按视口宽度适配 750 设计稿 */
function initialScaleEmbed(): number {
  if (typeof window === "undefined") return 1;
  return Math.max(window.innerWidth, 1) / DESIGN_W;
}

/** 避免 ResizeObserver → setScale → 布局变化 → 再触发 RO 形成更新风暴 */
function scaleClose(a: number, b: number) {
  return Math.abs(a - b) < 1e-5;
}

/** 手机无法访问电脑的 localhost，开发时扫码应指向可公网打开的地址 */
const DEFAULT_QR_PUBLIC = "https://shespeggy-bot.github.io/carshow/";

/** 项目页 /repo → /repo/ 的重定向可能丢 query，生成二维码前统一成带尾部斜杠的目录 URL */
function normalizeQrBaseUrl(url: string): string {
  try {
    const u = new URL(url);
    const p = u.pathname;
    if (p !== "/" && !p.endsWith("/") && !/\.[a-z0-9]{2,8}$/i.test(p.split("/").pop() ?? "")) {
      u.pathname = `${p}/`;
    }
    return u.toString();
  } catch {
    return url;
  }
}

function resolveQrTargetUrl(): string {
  const fromEnv = import.meta.env.VITE_QR_PREVIEW_URL;
  if (typeof fromEnv === "string" && fromEnv.trim() !== "") {
    return normalizeQrBaseUrl(fromEnv.trim());
  }
  if (typeof window === "undefined") return normalizeQrBaseUrl(DEFAULT_QR_PUBLIC);
  const { hostname, href } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return normalizeQrBaseUrl(DEFAULT_QR_PUBLIC);
  }
  return normalizeQrBaseUrl(href);
}

/**
 * 扫码打开纯内容页（无手机框 / 无二维码）。
 * GitHub Pages 等项目站常把 `/repo?x=1` 301 到 `/repo/` 且丢掉 query，故同时带上 #embed=1，
 * 由 hash 读取，避免手机扫码后仍走「电脑预览」布局。
 */
function withEmbedParam(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("embed", "1");
    u.hash = "embed=1";
    return u.toString();
  } catch {
    const noHash = url.split("#")[0] ?? url;
    const sep = noHash.includes("?") ? "&" : "?";
    return `${noHash}${sep}embed=1#embed=1`;
  }
}

function isEmbedMode(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("embed") === "1") return true;
  const h = window.location.hash.replace(/^#/, "");
  if (!h) return false;
  const q = h.startsWith("?") ? h.slice(1) : h;
  return new URLSearchParams(q).get("embed") === "1";
}

/** 手机/平板浏览器直接打开站点（无 embed 标记）时也应全屏长页，不套电脑端的手机框 */
function getShouldEmbedLayout(): boolean {
  if (typeof window === "undefined") return false;
  if (isEmbedMode()) return true;
  // innerWidth 不依赖 matchMedia，部分内置浏览器对 media query 异常
  if (window.innerWidth <= 768) return true;
  if (window.matchMedia("(max-width: 768px)").matches) return true;
  if (window.matchMedia("(hover: none) and (pointer: coarse)").matches) return true;
  return false;
}

function useShouldEmbedLayout(): boolean {
  const [embed, setEmbed] = useState(() => getShouldEmbedLayout());

  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 768px)");
    const mqTouch = window.matchMedia("(hover: none) and (pointer: coarse)");
    const sync = () => setEmbed(getShouldEmbedLayout());
    mqNarrow.addEventListener("change", sync);
    mqTouch.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("hashchange", sync);
    return () => {
      mqNarrow.removeEventListener("change", sync);
      mqTouch.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("hashchange", sync);
    };
  }, []);

  return embed;
}

function useInnerScale(scrollRef: React.RefObject<HTMLDivElement | null>, initial: number) {
  const [scale, setScale] = useState(initial);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let raf = 0;

    const run = () => {
      const w = el.clientWidth;
      if (w < 1) return;
      const next = w / DESIGN_W;
      setScale((prev) => (scaleClose(prev, next) ? prev : next));
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(run);
    };

    schedule();

    const ro = new ResizeObserver(() => {
      schedule();
    });
    ro.observe(el);

    const onWin = () => schedule();
    window.addEventListener("resize", onWin);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", onWin);
    };
  }, []);

  return { scale, scaledH: DESIGN_H * scale };
}

/** 仅车展长页（与手机框内一致），全屏纵向滚动 */
function EmbedOnlyView() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scale, scaledH } = useInnerScale(scrollRef, initialScaleEmbed());

  return (
    <div
      ref={scrollRef}
      className="phone-screen-scroll min-h-dvh w-full touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain bg-[#000f2c] [-webkit-overflow-scrolling:touch]"
    >
      <div className="relative w-full" style={{ height: scaledH }}>
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            transform: `scale(${scale})`,
            width: DESIGN_W,
            height: DESIGN_H,
          }}
        >
          <div className="relative h-full w-full overflow-hidden">
            <AutoShowPage />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 电脑预览：手机框 + 扫码（二维码指向 ?embed=1） */
function PhoneShellWithQr() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scale, scaledH } = useInnerScale(scrollRef, initialScalePhone());
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    setPreviewUrl(withEmbedParam(resolveQrTargetUrl()));
  }, []);

  const canvasBg = "#143886";
  const bezel = "#141414";

  const qrSrc =
    previewUrl.length > 0
      ? `https://api.qrserver.com/v1/create-qr-code/?size=168x168&margin=0&data=${encodeURIComponent(previewUrl)}`
      : "";

  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center gap-8 p-3 sm:p-6 lg:flex-row lg:items-center lg:justify-center lg:gap-10"
      style={{ backgroundColor: canvasBg }}
    >
      <div
        className="flex h-[min(92dvh,880px)] w-[min(414px,calc(100vw-1.5rem))] shrink-0 flex-col overflow-hidden rounded-[2.75rem] shadow-[0_24px_56px_rgba(0,0,0,0.38)]"
        style={{
          boxSizing: "border-box",
          border: `5px solid ${bezel}`,
          backgroundColor: bezel,
        }}
      >
        <div className="pointer-events-none flex h-7 shrink-0 items-end justify-center bg-[#141414] pb-1">
          <div className="h-5 w-24 rounded-full bg-black/75" aria-hidden />
        </div>

        <div
          ref={scrollRef}
          className="phone-screen-scroll min-h-0 flex-1 touch-pan-y overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch]"
        >
          <div className="relative w-full" style={{ height: scaledH }}>
            <div
              className="absolute left-0 top-0 origin-top-left will-change-transform"
              style={{
                transform: `scale(${scale})`,
                width: DESIGN_W,
                height: DESIGN_H,
              }}
            >
              <div className="relative h-full w-full overflow-hidden">
                <AutoShowPage />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-[min(100%,280px)] shrink-0 flex-col items-center gap-3 text-center lg:max-w-[220px]">
        <p className="text-[13px] leading-snug text-white/90">手机扫码浏览</p>
        <div className="rounded-xl bg-white p-3 shadow-lg">
          {qrSrc ? (
            <img
              src={qrSrc}
              width={168}
              height={168}
              alt="扫码在手机打开页面内容（无手机框）"
              className="block h-[168px] w-[168px] max-w-full"
              decoding="async"
            />
          ) : (
            <div className="h-[168px] w-[168px] animate-pulse rounded bg-neutral-200" aria-hidden />
          )}
        </div>
        <p className="text-[11px] text-white/45">
          {typeof window !== "undefined" &&
          (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "扫码仅内容区，不含手机框（本机指向线上）"
            : "扫码仅内容区，不含手机框与二维码"}
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const embed = useShouldEmbedLayout();
  if (embed) {
    return <EmbedOnlyView />;
  }
  return <PhoneShellWithQr />;
}
