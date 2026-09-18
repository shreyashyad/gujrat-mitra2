import { useState } from "react";
import { Bookmark } from "lucide-react";
import { getReadTime } from "../../utils/articleMeta.js";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useVideoDetail } from "../../context/VideoDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

export default function SmallArticleCard({ article, slug }) {
  const { openNews } = useNewsDetail();
  const { openVideo } = useVideoDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const isBookmarked = isSaved(article.id);
  const isVideo = article.type === "video";

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(article);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    if (isVideo) {
      openVideo(article);
    } else {
      openNews(article);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => e.key === "Enter" && handleOpen(e)}
      className="group flex flex-col justify-between p-3.5 rounded-2xl h-full cursor-pointer
                 bg-white dark:bg-white/[0.04]
                 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                 dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]
                 hover:-translate-y-0.5
                 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                 active:scale-[0.99]"
    >
      <div>
        {/* Image Container */}
        <div className="relative block w-full overflow-hidden rounded-xl">
          {article.img ? (
            <img
              src={article.img}
              alt={article.headline || ""}
              loading="lazy"
              className="w-full aspect-[16/10] object-cover transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full aspect-[16/10] bg-black/5 dark:bg-white/5 flex items-center justify-center text-xs text-ink/40 dark:text-ink-dark/40">
              No Image
            </div>
          )}

          {/* Action Buttons (Absolute Positioned on Image) */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            <button
              type="button"
              aria-label="સેવ કરો"
              onClick={handleBookmark}
              title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-white backdrop-blur-md border border-white/30 transition-all duration-300 active:scale-90 shadow-md ${isBookmarked
                  ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black border-transparent"
                  : "bg-black/40 hover:bg-[#e48d0b]"
                }`}
            >
              <Bookmark
                size={16}
                className={isBookmarked ? "fill-current" : ""}
              />
            </button>
          </div>

          {isVideo && (
            <>
              {/* Center play icon */}
              <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white border border-white/30 backdrop-blur-xs transition-all duration-300 group-hover:scale-110 group-hover:bg-[#e48d0b] shadow-md">
                  <svg className="h-5 w-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Duration badge */}
              {article.duration && (
                <span className="absolute bottom-2 left-2 z-[5] rounded-md bg-black/60 px-1.5 py-0.5 font-gu text-[12px] text-white">
                  {article.duration}
                </span>
              )}
            </>
          )}
        </div>

        {/* Article Headline */}
        <p className="article-headline mt-3 line-clamp-2">
          {article.headline}
        </p>
      </div>

      {/* Footer / Meta details */}
      <div className="article-metaRow">
        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1 truncate">
          {article.cat && (
            <>
              <span className="font-semibold text-[#e48d0b]">
                {article.cat}
              </span>
              <span className="opacity-50">•</span>
            </>
          )}
          {isVideo ? (
            <span className="truncate">{article.duration || ""}</span>
          ) : (
            <>
              <span>{article.time}</span>
              <span className="opacity-50">•</span>
              <span className="truncate">{getReadTime(article)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}