import { AutoShowPage } from "./AutoShowPage";

/** 设计稿宽度 750px，总高度约 4505px（含底部 254px 装饰层） */
export default function App() {
  return (
    <div className="flex min-h-screen justify-center bg-[#e8eaef]">
      <div className="relative h-[4505px] w-[750px] shrink-0 overflow-hidden">
        <AutoShowPage />
      </div>
    </div>
  );
}
