import { useParams } from "react-router-dom";
import MainGrid from "../components/layout/MainGrid.jsx";
import { trendingTopics } from "../data/trendingTopics.js";
import { TrendingUp } from "lucide-react";

export default function TrendingPage() {
  const { slug } = useParams();
  const topic = trendingTopics.find((t) => t.slug === slug);

  return (
    <MainGrid>
      <div className="mb-6">
        <h1 className="font-gu text-2xl sm:text-3xl font-bold text-[#e48d0b] dark:text-ink-dark flex gap-x-3 items-center">
          {topic ? topic.title : slug}
          <span className="flex items-center gap-0.5 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/100" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
          </span>
        </h1>
      </div>

      <div
        className="rounded-2xl p-8 sm:p-10
                   bg-white dark:bg-white/[0.04]
                   shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                   dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]
                   flex flex-col items-center text-center gap-4"
      >
        <div className="w-14 h-14 rounded-full bg-[#e48d0b]/10 text-[#e48d0b] flex items-center justify-center">
          <TrendingUp size={26} />
        </div>
        <p className="font-gu text-base text-ink/70 dark:text-ink-dark/70 leading-relaxed max-w-sm">
          આ ટ્રેન્ડિંગ વિષયના સમાચાર અહીં દેખાશે.
        </p>
      </div>
    </MainGrid>
  );
}