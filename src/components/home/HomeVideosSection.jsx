import { AlertTriangle, Play } from "lucide-react";
import { useAsyncData } from "../../hooks/useAsyncData.js";
import { getVideos } from "../../services/newsService.js";
import { useVideoDetail } from "../../context/VideoDetailContext.jsx";

export default function HomeVideosSection() {
  const { data: videos, loading, error } = useAsyncData(getVideos, []);
  const { openVideo } = useVideoDetail();

  const handleOpen = (video) => {
    if (!video) return;
    openVideo({
      id: video.id ?? video.url,
      title: video.title,
      headline: video.title,
      img: video.img,
      cat: video.cat,
      url: video.url,
      duration: video.duration,
      body: video.body,
      type: "video",
      ...video,
    });
  };

  return (
    <section className="mt-5 md:hidden">
      <div className="mb-2 flex items-center gap-2">
        <h2 className="font-gu text-2xl font-bold text-[#e48d0b]">વિડિઓ</h2>
        <span className="flex items-center gap-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {loading && (
        <div className="no-scrollbar flex animate-pulse gap-4 overflow-x-auto pb-0 [-webkit-overflow-scrolling:touch]">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="w-[75vw] shrink-0 rounded-2xl bg-transparent p-0 sm:w-[320px]"
            >
              <div className="aspect-video rounded-xl bg-black/5 dark:bg-white/5" />
              <div className="mt-3 h-4 w-4/5 rounded bg-black/5 dark:bg-white/5" />
              <div className="mt-2 h-3 w-2/5 rounded bg-black/5 dark:bg-white/5" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-500/10 p-6 text-center">
          <p className="font-gu text-base text-red-600 dark:text-red-400">
            વિડિઓ લોડ કરવામાં સમસ્યા આવી.
          </p>
        </div>
      )}

      {!loading && !error && videos && (
        <div
          className="home-x-scroll no-scrollbar flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-0
           [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {videos.map((video, index) => (
            <article
              key={video.id || index}
              role="button"
              tabIndex={0}
              onClick={() => handleOpen(video)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpen(video);
                }
              }}
              className="group w-[55vw] shrink-0 cursor-pointer snap-start rounded-2xl bg-transparent p-0 transition-transform duration-300 ease-in-out will-change-transform hover:-translate-y-0.5 active:scale-[0.99] sm:w-[320px]"
            >
              <div className="relative block w-full overflow-hidden rounded-xl text-left">
                {video.img ? (
                  <img
                    src={video.img}
                    alt=""
                    data-no-scale
                    className="aspect-video w-full max-w-none scale-105 object-cover transition-transform duration-500"
                  />
                ) : (
                  <div className="aspect-video w-full bg-black/5 dark:bg-white/5" />
                )}

                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#e48d0b] shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-transform group-hover:scale-110">
                    <Play size={20} fill="currentColor" />
                  </span>
                </span>

                {video.duration && (
                  <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/60 px-2.5 py-0.5 font-en text-[11px] font-medium text-white">
                    {video.duration}
                  </span>
                )}
              </div>

              <p className="mt-1 font-gu text-[15px] text-ink/50 dark:text-ink-dark/50">
                <span className="font-medium text-[#e48d0b]">{video.cat}</span>
              </p>
              <p className="article-headline">{video.title}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}