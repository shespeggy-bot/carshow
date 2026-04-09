import { useLayoutEffect, useRef, useState } from "react";
import { AutoShowPage } from "./AutoShowPage";

/** 设计稿尺寸（与 Figma 一致） */
const DESIGN_W = 750;
const DESIGN_H = 4505;

/** 与 GitHub 部署版一致的手机宽度上限（px） */
const PHONE_OUTER_W = 414;
/** 黑色描边 5px + 5px */
const PHONE_BORDER = 10;

function initialScale(): number {
  if (typeof window === "undefined") return (PHONE_OUTER_W - PHONE_BORDER) / DESIGN_W;
  const outer = Math.min(PHONE_OUTER_W, window.innerWidth - 24);
  return Math.max(outer - PHONE_BORDER, 1) / DESIGN_W;
}

/**
 * 在手机框视口内按比例缩放整页，并支持上下滑动浏览长页面。
 */
export default function App() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const apply = () => {
      const w = el.clientWidth;
      if (w < 1) return;
      setScale(w / DESIGN_W);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scaledH = DESIGN_H * scale;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#143886] p-3 sm:p-6">
      <div
        className="flex h-[min(92dvh,880px)] w-[min(414px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-[2.75rem] border-[5px] border-[#141414] bg-[#141414] shadow-[0_24px_56px_rgba(0,0,0,0.38)]"
        style={{ boxSizing: "border-box" }}
      >
        {/* 刘海占位 */}
        <div className="pointer-events-none flex h-7 shrink-0 items-end justify-center bg-[#141414] pb-1">
          <div className="h-5 w-24 rounded-full bg-black/75" aria-hidden />
        </div>

        {/* 可上下滑动；滚动条隐藏，仍可滚轮/触屏滑动 */}
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
    </div>
  );
}
