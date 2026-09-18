import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { videos } from "../../data/videos.js";

export default function VideoCard() {
  const latestVideos = (videos || []).slice(0, 5);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  // Auto scroll every 3.5 seconds
  useEffect(() => {
    if (latestVideos.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % latestVideos.length);
    }, 3500);

    return () => clearInterval(timerRef.current);
  }, [latestVideos.length]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    if (latestVideos.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % latestVideos.length);
      }, 3500);
    }
  };

  const goTo = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(index);
    resetTimer();
  };

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev - 1 + latestVideos.length) % latestVideos.length);
    resetTimer();
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent((prev) => (prev + 1) % latestVideos.length);
    resetTimer();
  };

  const handleCardClick = () => {
    navigate("/videos");
  };

  const currentVideo = latestVideos[current] || {};

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && navigate("/videos")}
      className="select-none space-y-3 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 bg-white dark:bg-[#121212] border border-gray-200/70 dark:border-white/10 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300"
    >
      {/* Title Header with Arrow Navigation Controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/videos"
          onClick={(e) => e.stopPropagation()}
          className="group flex items-center gap-1.5 select-none active:opacity-50 transition-opacity duration-150"
        >
          <h3 className="font-gu tracking-tight text-[#e48d0b] group-hover:opacity-80 transition-opacity text-[24px] sm:text-[26px] font-semibold">
            વીડિયો
          </h3>
          <span className="flex items-center gap-0.5 shrink-0">
            <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
          </span>
        </Link>

        {/* Chevron Controls in Header */}
        {latestVideos.length > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrev}
              className="p-1 rounded-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              aria-label="Previous video"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="p-1 rounded-full border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
              aria-label="Next video"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Main Card Wrapper */}
      <div className="group relative block rounded-2xl overflow-hidden bg-white dark:bg-[#1c1c1e] space-y-2.5">
        {/* Image Container */}
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
          {latestVideos.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-sm text-ink/40">
              No videos
            </div>
          ) : (
            latestVideos.map((video, idx) => (
              <div
                key={video.id || idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === current ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <img
                  src={video.img || video.thumbnail || video.image}
                  alt={video.title || "Video"}
                  className="h-full w-full object-cover object-center"
                  loading={idx === 0 ? "eager" : "lazy"}
                />

                {/* Subtle bottom gradient for dots contrast */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/60 to-transparent z-10" />

                {/* Center Play Icon */}
                <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                  <div className="flex items-center justify-center w-11 h-11 rounded-full bg-black/40 text-white border border-white/30 backdrop-blur-xs group-hover:scale-110 group-hover:bg-[#e48d0b] transition-all duration-300 shadow-md">
                    <svg
                      className="w-5 h-5 ml-0.5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Dots indicator inside the image overlay */}
                {latestVideos.length > 1 && (
                  <div className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center gap-1.5">
                    {latestVideos.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        type="button"
                        onClick={(e) => goTo(e, dotIdx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          dotIdx === current
                            ? "w-4 bg-[#e48d0b]"
                            : "w-1.5 bg-white/60 hover:bg-white"
                        }`}
                        aria-label={`Go to video ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Video Title - Cleanly separated below the image */}
        {latestVideos.length > 0 && (
          <div className="px-1 pb-0.5">
            <p className="font-gu text-ink dark:text-ink-dark text-[20px] font-normal line-clamp-2 leading-snug transition-colors">
              {currentVideo.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}