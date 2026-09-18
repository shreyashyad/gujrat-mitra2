import MainGrid from "../components/layout/MainGrid.jsx";
import EpaperLanding from "../components/epaper/EpaperLanding.jsx";

export default function EpaperPage() {
  return (
    <MainGrid>
      <div className="mb-6 inline-block">
        <h1 className="font-gu flex items-center gap-x-3 text-2xl font-bold text-[#e48d0b] sm:text-3xl dark:text-ink-dark">
          ઈ-પેપર
          <span className="mb-1 flex items-center gap-0.5">
            <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
          </span>
        </h1>
      </div>
      <EpaperLanding />
    </MainGrid>
  );
}