import SportsWidgetCard from "./SportsWidgetCard.jsx";
import MarketWidgetCard from "./MarketWidgetCard.jsx";
import PollWidgetCard from "./PollWidgetCard.jsx";
import OpinionWidgetCard from "./OpinionWidgetCard.jsx";
import CharchaPatroWidgetCard from "./CharchaPatroWidgetCard.jsx";
import FashionCard from "./FashionCard.jsx";
import GocharAgochar from "./GocharAgochar.jsx";
import AapniAajSidebar from "./AapniAajSidebar.jsx";
import EPaper from "./EPaper.jsx";
import { useBeepsDetail } from "../../context/BeepsDetailContext.jsx";
import GamesWidgetCard from "./GamesWidgetCard.jsx";
import GeneralKnowledge from "./GeneralKnowledge.jsx";
import VideoCard from "./VideoCard.jsx";
import BeepsCard from "./BeepsCard.jsx";
import { useLocation } from "react-router-dom";

export default function WidgetRail() {
  const { isOpen: beepsOpen, openBeeps } = useBeepsDetail();
  const { pathname } = useLocation();

  const hideEpaper = pathname === "/epaper";
  const hideAapniAaj = pathname === "/aapni-aaj";
  const hideBeeps = pathname === "/beeps" || beepsOpen;
  const hideGames = pathname === "/games";
  const hideVideos = pathname === "/videos";

  // Top group in original order (only visible ones)
  const topCards = [];

  if (!hideEpaper) {
    topCards.push(<EPaper key="epaper" title="ઈ-પેપર" to="/epaper" />);
  }
  if (!hideAapniAaj) {
    topCards.push(
      <AapniAajSidebar key="aapni" title="આપની આજ" to="/aapni-aaj" />
    );
  }
  if (!hideBeeps) {
    topCards.push(
      <BeepsCard
        key="beeps"
        title="બીપ્સ"
        to="/beeps"
        onClick={() => openBeeps(0)}
        isActive={beepsOpen}
      />
    );
  }
  if (!hideGames) {
    topCards.push(
      <GamesWidgetCard key="games" title="ગેમ્સ" to="/games" />
    );
  }
  if (!hideVideos) {
    topCards.push(<VideoCard key="videos" title="વિડિઓ" to="/videos" />);
  }

  // First visible card (if any) + Ad1 + remaining top cards
  const firstTop = topCards.length > 0 ? topCards[0] : null;
  const restTop = topCards.length > 1 ? topCards.slice(1) : [];

  return (
    <div className="flex flex-col gap-7">
      {/* 1st visible top card (E-Paper / આપની આજ / બીપ્સ ...) */}
      {firstTop}

      {/* Ad 1 — always right after the first top card */}
      <div className="flex size-50 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
        <span className="font-gu text-xs text-ink/30 dark:text-ink-dark/30">
          જાહેરાત / Advertisement
        </span>
      </div>

      {/* Remaining top cards (shift up into previous places) */}
      {restTop}

      {/* Always visible middle group */}
      <SportsWidgetCard />
      <MarketWidgetCard />
      <PollWidgetCard />
      <OpinionWidgetCard title="ઓપીનિયન" />
      <CharchaPatroWidgetCard title="ચર્ચાપત્રો" />

      {/* Ad 2 */}
      <div className="flex size-25 w-full flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
        <span className="font-gu text-xs text-ink/30 dark:text-ink-dark/30">
          જાહેરાત / Advertisement
        </span>
      </div>

      {/* Last group */}
      <FashionCard title="ફેશન" />
      <GocharAgochar title="ગોચર અગોચર" />
      <GeneralKnowledge title="સામાન્ય જ્ઞાન" />
    </div>
  );
}