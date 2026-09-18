import { Play, Bookmark } from "lucide-react";
import MainGrid from "../components/layout/MainGrid.jsx";
import { useAsyncData } from "../hooks/useAsyncData.js";
import { getVideos } from "../services/newsService.js";
import { useSavedNews } from "../context/SavedNewsContext.jsx";
import { useVideoDetail } from "../context/VideoDetailContext.jsx";

function SectionHeader({ title, className = "" }) {
  return (
    <div className={`mb-4 sm:mb-5 md:mb-6 ${className}`}>
      <h1 className="font-gu text-xl xs:text-2xl sm:text-3xl font-bold text-[#e48d0b]  flex gap-x-2 sm:gap-x-3 items-center">
        {title}
        <span className="flex items-center gap-0.5 mb-0.5 sm:mb-1">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D61F26]/100" />
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </h1>
    </div>
  );
}

export default function VideosPage() {
  const { data: videos, loading, error } = useAsyncData(getVideos, []);
  const { isSaved, toggleSave } = useSavedNews();
  const { openVideo } = useVideoDetail();

  const handleBookmark = (e, video) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave({
      id: video.id ?? video.url,
      headline: video.title,
      title: video.title,
      img: video.img,
      cat: video.cat,
      url: video.url,
      duration: video.duration,
      type: "video",
      ...video,
    });
  };

  return (
    <MainGrid>
      <div className="py-1 sm:py-2">
        <SectionHeader title="વિડિઓ" />

        {/* ---------- Loading skeleton ---------- */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 animate-pulse">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={i}
                className="rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5
                           bg-white dark:bg-white/[0.04]
                           shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                           dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]"
              >
                <div className="aspect-[16/10] rounded-lg sm:rounded-xl bg-black/5 dark:bg-white/5" />
                <div className="mt-2.5 sm:mt-3.5 h-4 sm:h-5 w-4/5 rounded bg-black/5 dark:bg-white/5" />
                <div className="mt-1.5 sm:mt-2 h-2.5 sm:h-3 w-2/5 rounded bg-black/5 dark:bg-white/5" />
              </div>
            ))}
          </div>
        )}

        {/* ---------- Error ---------- */}
        {error && (
          <div className="p-4 sm:p-6 text-center rounded-xl sm:rounded-2xl bg-red-500/10">
            <p className="font-gu text-sm sm:text-base text-red-600 dark:text-red-400">
              વિડિઓ લોડ કરવામાં સમસ્યા આવી.
            </p>
          </div>
        )}

        {/* ---------- Video grid ---------- */}
        {!loading && !error && videos && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {videos.map((v, i) => {
              const videoId = v.id ?? v.url;
              const isBookmarked = isSaved(videoId);

              return (
                <div
                  key={videoId || i}
                  role="button"
                  tabIndex={0}
                  onClick={() => openVideo(v)}
                  onKeyDown={(e) => e.key === "Enter" && openVideo(v)}
                  className="group flex flex-col justify-between
                             p-2.5 sm:p-3 md:p-3.5
                             rounded-xl sm:rounded-2xl
                             h-full cursor-pointer
                             bg-white dark:bg-white/[0.04]
                             shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                             dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]
                             hover:-translate-y-1
                             transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
                             active:scale-[0.99]"
                >
                  <div className="min-w-0">
                    {/* Thumbnail */}
                    <div className="relative block w-full overflow-hidden rounded-lg sm:rounded-xl">
                      {v.img ? (
                        <img
                          src={v.img}
                          alt=""
                          loading="lazy"
                          className="w-full aspect-[16/10] object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-[16/10] bg-black/5 dark:bg-white/5" />
                      )}

                      {/* Bookmark */}
                      <span className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label="સેવ કરો"
                          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
                          onClick={(e) => handleBookmark(e, v)}
                          className={`flex h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 items-center justify-center rounded-full text-white backdrop-blur-md border border-white/30 transition-all duration-300 active:scale-90 shadow-md ${
                            isBookmarked
                              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black border-transparent"
                              : "bg-black/40 hover:bg-[#e48d0b]"
                          }`}
                        >
                          <Bookmark
                            size={14}
                            className={`sm:w-4 sm:h-4 ${isBookmarked ? "fill-current" : ""}`}
                          />
                        </button>
                      </span>

                      {/* Play button */}
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-black/40 text-white border border-white/30 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.2)] group-hover:scale-110 group-hover:bg-[#e48d0b] transition-all duration-300">
                          <Play
                            size={16}
                            className="ml-0.5 sm:w-5 sm:h-5"
                            fill="currentColor"
                          />
                        </span>
                      </span>

                      {/* Duration */}
                      {v.duration && (
                        <span className="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 rounded-full bg-black/60 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-en font-medium text-white">
                          {v.duration}
                        </span>
                      )}
                    </div>

                    {/* Category */}
                    <p className="article-metaRow text-[13px] sm:text-[14px] md:text-[15px] mt-2 sm:mt-2.5 md:mt-3">
                      <span className="font-semibold text-[#e48d0b]">{v.cat}</span>
                    </p>

                    {/* Title */}
                    <p className="article-headline text-[14px] sm:text-[15px] md:text-base leading-snug mt-0.5 line-clamp-3">
                      {v.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainGrid>
  );
}