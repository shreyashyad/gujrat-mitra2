import WidgetRail from "../widgets/WidgetRail.jsx";
import BottomAdContainer from "../common/BottomAdContainer.jsx";
import { useLocation } from "react-router-dom";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useVideoDetail } from "../../context/VideoDetailContext.jsx";
import { useGameDetail } from "../../context/GameDetailContext.jsx";
import { useCharchaPatraDetail } from "../../context/CharchaPatraDetailContext.jsx";
import NewsDetailPanel from "../overlays/NewsDetailPanel.jsx";
import VideoDetailPanel from "../overlays/VideoDetailPanel.jsx";
import GameDetailPanel from "../overlays/GameDetailPanel.jsx";
import CharchapatraDetailPanel from "../charchapatra/CharchapatraDetailPanel.jsx";

export default function MainGrid({ children }) {
  const { pathname } = useLocation();
  const { isOpen: newsOpen, article } = useNewsDetail();
  const { isOpen: videoOpen, video } = useVideoDetail();
  const { isOpen: gameOpen, activeGame } = useGameDetail();
  const { isOpen: charchaOpen, activeItem } = useCharchaPatraDetail();

  // Priority: news > video > game > Charcha Patra > children
  const showNews = newsOpen && article;
  const showVideo = !showNews && videoOpen && video;
  const showGame = !showNews && !showVideo && gameOpen && activeGame;
  const isCharchaProfile = pathname.startsWith("/charcha-patra/profile/");
  const showCharcha =
    !isCharchaProfile &&
    !showNews &&
    !showVideo &&
    !showGame &&
    charchaOpen &&
    activeItem;

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_295px] xl:gap-6">
        <main className="min-w-0 w-full py-5 sm:py-6">
          {showNews ? (
            <NewsDetailPanel />
          ) : showVideo ? (
            <VideoDetailPanel />
          ) : showGame ? (
            <GameDetailPanel />
          ) : showCharcha ? (
            <CharchapatraDetailPanel />
          ) : (
            children
          )}
        </main>

        <aside className="hidden w-full min-w-0 py-6 pl-0 pr-0 xl:block lg:pl-1 lg:pr-1 xl:sticky xl:bottom-6 xl:self-end">
          <div className="flex flex-col gap-4">
            <WidgetRail />
          </div>
        </aside>
      </div>

      <BottomAdContainer />
    </>
  );
}