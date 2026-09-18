import { Bookmark } from "lucide-react";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

/** Sub-component: Receives article, state, and handler as props */
function MetaRow({ article, isBookmarked, onBookmark }) {
    return (
        <div className="mt-0 md:mt-2 relative md:px-2 md:pb-3.5 flex items-center justify-between text-ink/50 dark:text-ink-dark/50 text-[14px] md:text-[15px]">
            {/* Left metadata info */}
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 truncate">
                {article.cat && (
                    <>
                        <span className="font-semibold text-[#e48d0b]">
                            {article.cat}
                        </span>
                        <span className="opacity-50">•</span>
                    </>
                )}
                <span>{article.time}</span>
                <span className="opacity-50">•</span>
                <span className="truncate">{getReadTime(article)}</span>
            </div>

            {/* Bookmark button */}
            <button
                type="button"
                aria-label="સેવ કરો"
                onClick={onBookmark}
                title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
                className="p-1 text-ink/50 dark:text-ink-dark/50 hover:text-[#e48d0b] dark:hover:text-[#e6c27a] transition-colors cursor-pointer shrink-0"
            >
                <Bookmark
                    size={18}
                    className={isBookmarked ? "fill-current text-[#e48d0b] dark:text-[#e6c27a]" : ""}
                />
            </button>
        </div>
    );
}

export default function HeroArticleCard({ article, categoryLabel }) {
    const { openNews } = useNewsDetail();
    const { isSaved, toggleSave } = useSavedNews();
    const isBookmarked = isSaved(article.id);

    const handleOpen = (e) => {
        e.preventDefault();
        openNews(article);
    };

    const handleBookmark = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSave(article);
    };

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(e) => e.key === "Enter" && handleOpen(e)}
            className="group flex flex-col md:justify-start lg:min-h-[530px] cursor-pointer rounded-lg overflow-hidden hover:-translate-y-0.5 transition-all duration-300 ease-out active:scale-[0.985]"
        >
            {/* Image Container */}
            <div className="relative w-full aspect-[16/11] overflow-hidden rounded-t-lg">
                {article.img ? (
                    <img
                        src={article.img}
                        alt={article.headline || ""}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-black/5 dark:bg-white/5" />
                )}
            </div>

            <div className="mt-1 md:mt-4.5 px-0 md:px-1">
                <p className="font-gu font-semibold leading-[1.35] text-[22px] sm:text-[33px] md:text-[33px] text-ink dark:text-ink-dark transition-colors duration-200 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">
                    {article.headline}
                </p>
            </div>

            {/* MetaRow directly below headline */}
            <MetaRow
                article={article}
                isBookmarked={isBookmarked}
                onBookmark={handleBookmark}
            />
        </div>
    );
}