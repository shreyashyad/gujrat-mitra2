import { Bookmark } from "lucide-react";
import { articles } from "../../data/articles.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

/** Collect all type:'hero' articles in category order, then take last 5 reversed */
function getLastHeroStories() {
  const keys = [
    "foryou",
    "gujarat",
    "india",
    "business",
    "sports",
    "world",
    "entertainment",
    "technology",
    "health",
    "agriculture",
    "auto",
    "editorial",
  ];

  let heroes = [];

  for (const key of keys) {
    const list = articles[key] || [];
    const heroItems = list.filter((a) => a.type === "hero");
    if (heroItems.length > 0) {
      heroes.push(...heroItems);
    }
  }

  const uniqueHeroes = heroes.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id)
  );

  if (uniqueHeroes.length < 5) {
    for (const key of keys) {
      const list = articles[key] || [];
      if (list.length > 0 && !uniqueHeroes.some((u) => u.id === list[0].id)) {
        uniqueHeroes.push(list[0]);
      }
      if (uniqueHeroes.length >= 5) break;
    }
  }

  return uniqueHeroes.slice(-5).reverse();
}

function StoryCard({ article }) {
  const { openNews } = useNewsDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(article);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openNews(article)}
      onKeyDown={(e) => e.key === "Enter" && openNews(article)}
      className="group relative w-[160px] sm:w-[180px] lg:w-full h-[320px] sm:h-[350px]
                 shrink-0 rounded-[7px] overflow-hidden cursor-pointer
                 dark:shadow-[0_2px_10px_rgba(0,0,0,0.4)]
                 hover:-translate-y-1 transition-all duration-300 ease-out
                 active:scale-[0.98] isolate"
    >
      {/* Background image */}
      {article.img ? (
        <img
          src={article.img}
          alt={article.headline || ""}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out"
        />
      ) : (
        <div className="absolute inset-0 bg-black/10 dark:bg-white/10" />
      )}

      {/* Top Left: Only Yellow Border Ring */}
      <div className="absolute top-3 left-3 z-10">
        <div className="h-7 w-7 rounded-full border-[2.5px] border-[#fbc02d] shadow-sm" />
      </div>

      {/* Bottom Content Gradient Overlay */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-3.5 pb-3 flex flex-col gap-2 pt-12 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
        <p className="article-headline text-white drop-shadow-md">
          {article.headline}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span className="font-gu text-[14px] text-white/90 font-medium tracking-wide">
            વેબ સ્ટોરી
          </span>
        </div>
      </div>

      {/* Right Bottom: Save Button */}
      <button
        type="button"
        aria-label="સેવ કરો"
        onClick={handleBookmark}
        title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
        className={`absolute bottom-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full
                    backdrop-blur-md active:scale-90 transition-all duration-200 cursor-pointer ${
                      isBookmarked
                        ? "bg-[#fbc02d] text-black shadow-md"
                        : "bg-black/50 text-white hover:bg-black/70"
                    }`}
      >
        <Bookmark
          size={16}
          className={`transition-transform duration-200 ${
            isBookmarked ? "fill-current" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default function WebStoriesSection() {
  const stories = getLastHeroStories();

  if (!stories || stories.length === 0) return null;

  return (
    <section className="shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] pt-7 pb-6 px-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      <div className="mt-[-7px] mb-2 flex items-center gap-3">
        <h2 className="font-gu text-xl sm:text-2xl font-bold text-[#e48d0b] dark:text-ink-dark">
          વેબ સ્ટોરીઝ
        </h2>
        <span className="flex items-center gap-0.5 mb-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* 
        Mobile / Tablet → horizontal scroll, cards keep nice fixed width
        Desktop (lg+)  → normal 5-column grid (no scroll needed)
      */}
      <div className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible">
        {stories.map((article, i) => (
          <StoryCard key={article.id || i} article={article} />
        ))}
      </div>
    </section>
  );
}