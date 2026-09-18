import { useState, useMemo, useRef, useEffect } from "react";
import { Bookmark, ChevronDown } from "lucide-react";
import { articles } from "../../data/articles.js";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

const CITIES = [
  { id: "ahmedabad", label: "અમદાવાદ", keys: ["અમદાવાદ", "અમદાવાદમાં", "ahmedabad", "Amdavad"] },
  { id: "surat", label: "સુરત", keys: ["સુરત", "સુરતમાં", "surat"] },
  { id: "vadodara", label: "વડોદરા", keys: ["વડોદરા", "વડોદરામાં", "vadodara", "baroda"] },
  { id: "rajkot", label: "રાજકોટ", keys: ["રાજકોટ", "રાજકોટમાં", "rajkot"] },
  { id: "bhavnagar", label: "ભાવનગર", keys: ["ભાવનગર", "ભાવનગરમાં", "bhavnagar"] },
];

function matchesCity(article, city) {
  if (city.id === "all") return true;
  const hay = `${article.headline || ""} ${article.cat || ""} ${article.tag || ""} ${article.summary || ""}`.toLowerCase();
  return city.keys.some((k) => hay.includes(k.toLowerCase()));
}

/** Simple Meta details row + optional save button inside */
function MetaRow({ article, showSave = false, isBookmarked = false, onBookmark }) {
  return (
    <div className="article-metaRow relative">
      {/* Always single row + truncate on overflow (all devices) */}
      <div className="flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate pr-8">
        {article.cat && (
          <>
            <span className="font-semibold text-[#e48d0b]">{article.cat}</span>
            <span className="opacity-50">•</span>
          </>
        )}
        <span>{article.time}</span>
        <span className="opacity-50">•</span>
        <span className="truncate">{getReadTime(article)}</span>
      </div>

      {showSave && (
        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={onBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className="absolute bottom-0 right-0 z-10 flex h-7 w-7 items-center justify-center
                     text-ink/40 dark:text-ink-dark/40 hover:text-[#e48d0b] dark:hover:text-[#e6c27a]
                     transition-colors cursor-pointer"
        >
          <Bookmark
            size={16}
            className={isBookmarked ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]" : ""}
          />
        </button>
      )}
    </div>
  );
}

/** Left — large featured card (Image + Text ઉપર-નીચે) */
function FeaturedCard({ article }) {
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
      className="group flex h-full flex-col justify-between md:justify-start! lg:min-h-[336px] cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
    >
      <div className="flex flex-col flex-1 min-w-0 gap-2">
        <div className="relative w-full aspect-[18/11] overflow-hidden rounded-[7px]">
          {article.img ? (
            <img
              src={article.img}
              alt={article.headline || ""}
              loading="lazy"
              data-no-scale
              className="absolute inset-0 h-full w-full max-w-none object-cover object-center scale-107"
            />
          ) : (
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5" />
          )}

          <button
            type="button"
            aria-label="સેવ કરો"
            onClick={handleBookmark}
            title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
            className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
              isBookmarked
                ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
                : "bg-black/40 text-white hover:bg-black/60"
            }`}
          >
            <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
          </button>
        </div>

        {/* No forced 3-line height – MetaRow sits right after actual headline */}
        <p className="article-headline line-clamp-3 min-h-0!">
          {article.headline}
        </p>

        <MetaRow article={article} />
      </div>
    </div>
  );
}

/** Middle — Image (left) + Text (right) આજુ-બાજુ */
function MidCard({ article, className = "" }) {
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
      className={`group flex w-full items-stretch gap-3 cursor-pointer lg:min-h-[102px] transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985] ${className}`}
    >
      {/* Same size image as TextCard list view */}
      <div className="relative h-[76px] w-[100px] sm:h-[99px] sm:w-[120px] shrink-0 overflow-hidden rounded-[7px] bg-black/5 dark:bg-white/5">
        {article.img ? (
          <img
            src={article.img}
            alt={article.headline || ""}
            loading="lazy"
            data-no-scale
            className="absolute inset-0 h-full w-full max-w-none object-cover object-center scale-107"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-ink/40 dark:text-ink-dark/40">
            No Image
          </div>
        )}

        <button
          type="button"
          aria-label="સેવ કરો"
          onClick={handleBookmark}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute top-1 right-1 z-10 flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/45 text-white hover:bg-black/65"
          }`}
        >
          <Bookmark size={16} className={isBookmarked ? "fill-current" : ""} />
        </button>
      </div>

      {/* ટેક્સ્ટ કન્ટેનર */}
      <div className="flex min-w-0 flex-1 flex-col justify-between md:justify-start! py-0.5">
        <p className="article-headline leading-snug line-clamp-3 min-h-0!">
          {article.headline}
        </p>

        <div className="article-metaRow">
          <div className="mt-1 flex items-center gap-x-1 overflow-hidden whitespace-nowrap truncate">
            {article.cat && (
              <>
                <span className="font-semibold text-[#e48d0b] shrink-0">{article.cat}</span>
                <span className="opacity-50 shrink-0">•</span>
              </>
            )}
            <span className="shrink-0">{article.time}</span>
            <span className="opacity-50 shrink-0">•</span>
            <span className="truncate">{getReadTime(article)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Right — Stacked Text Card 
 *  <768 + ≥1024 → pure text
 *  768–1023 → list view (image left + text right) with SAME image size as MidCard
 */
function TextCard({ article, className = "" }) {
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
      className={`group relative flex w-full cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]
        flex-col justify-between 
        min-[768px]:flex-row min-[768px]:items-start min-[768px]:gap-3 min-[768px]:min-h-0
        lg:flex-col lg:justify-start! lg:gap-0 lg:min-h-[102px]
        ${className}`}
    >
      {/* Image – same size as MidCard, visible only 768–1023 */}
      <div className="relative hidden min-[768px]:block lg:hidden 
                      h-[76px] w-[100px] sm:h-[99px] sm:w-[120px] 
                      flex-shrink-0 overflow-hidden rounded-[7px] bg-black/5 dark:bg-white/5">
        {article.img ? (
          <img
            src={article.img}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-ink/40 dark:text-ink-dark/40">
            No Image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="pr-8">
          <p className="article-headline line-clamp-3 min-h-0!">
            {article.headline}
          </p>
        </div>

        <MetaRow
          article={article}
          showSave
          isBookmarked={isBookmarked}
          onBookmark={handleBookmark}
        />
      </div>
    </div>
  );
}

function CityDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const selected = CITIES.find((c) => c.id === value) || CITIES[0];

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-w-[110px] items-center justify-between gap-2 rounded-[7px]
                   border border-black/10 dark:border-white/20 bg-white dark:bg-[#1a1a1a] 
                   px-3 py-1 font-gu text-[16px] sm:text-[17px] font-semibold 
                   text-ink dark:text-ink-dark hover:border-black/20 dark:hover:border-white/40 
                   transition-all cursor-pointer"
      >
        <span>{selected.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink/70 dark:text-ink-dark/70 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 z-50 mt-1 w-full min-w-[130px] overflow-hidden rounded-[7px]
                     border border-black/30 dark:border-white/20 bg-white dark:bg-[#1a1a1a] 
                     shadow-lg"
        >
          {CITIES.map((city) => {
            const isSelected = city.id === value;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  onChange(city.id);
                  setOpen(false);
                }}
                className={`flex w-full items-center px-3 py-1.5 text-left font-gu text-[15px] sm:text-[16px] 
                           transition-colors cursor-pointer ${
                             isSelected
                               ? "bg-[#1d6fce] font-semibold text-white"
                               : "text-ink dark:text-ink-dark hover:bg-black/5 dark:hover:bg-white/10"
                           }`}
              >
                {city.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function MaruShaher() {
  const [cityId, setCityId] = useState(CITIES[0].id);
  const city = CITIES.find((c) => c.id === cityId) || CITIES[0];

  const items = useMemo(() => {
    const list = articles.gujarat || [];
    const nonHero = list.filter((a) => a.type !== "hero");
    let filtered = nonHero.filter((a) => matchesCity(a, city));

    if (filtered.length < 7) {
      const ids = new Set(filtered.map((a) => a.id));
      for (const a of nonHero) {
        if (ids.has(a.id)) continue;
        filtered.push(a);
        if (filtered.length >= 7) break;
      }
    }
    return filtered.slice(0, 7);
  }, [city]);

  const featured = items[0];
  const midCards = items.slice(1, 4);
  const textCards = items.slice(4, 7);

  if (!featured) return null;

  return (
    <section className="lg:items-stretch shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-7 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl">
      <div className="mt-[-7px] mb-2 flex items-center gap-3">
        <h2 className="font-gu text-xl sm:text-2xl font-bold text-[#e48d0b]">
          મારું શહેર
        </h2>

        <span className="flex items-center gap-0.5 mb-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/100" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>

        <CityDropdown value={cityId} onChange={setCityId} />
      </div>

      {/* 
        < 768px          → 1 column
        768px – 912px    → 1 column (single list)
        913px – 1023px   → 2 columns (Featured full + left MidCards / right TextCards)
        ≥ 1024px         → original 3-column (untouched)
      */}
      <div className="grid grid-cols-1 min-[913px]:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1.1fr] gap-6 lg:gap-5 lg:items-stretch">
        {/* Featured */}
        <div className="min-[913px]:col-span-2 lg:col-span-1">
          <FeaturedCard article={featured} />
        </div>

        {/* Middle — image+text cards */}
        <div className="flex flex-col justify-start gap-3">
          {midCards.map((article) => (
            <MidCard key={article.id} article={article} />
          ))}
        </div>

        {/* Right — list-view style on 768-1023 with same image size */}
        <div className="flex flex-col justify-start gap-3">
          {textCards.map((article) => (
            <TextCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}