import MainGrid from "../components/layout/MainGrid.jsx";
import HomeHeroSection from "../components/home/HomeHeroSection.jsx";
import HomeVideosSection from "../components/home/HomeVideosSection.jsx";
import HomeFiller1 from "../components/home/HomeFiller1.jsx";
import HomeFiller2 from "../components/home/HomeFiller2.jsx";
import HomeFiller3 from "../components/home/HomeFiller3.jsx";
import HomeFiller4 from "../components/home/HomeFiller4.jsx";
import HomeOnThisDay from "../components/home/HomeOnThisDay.jsx";
import HomePhotoGallery from "../components/home/HomePhotoGallery.jsx";
import HomeAajnuRashifal from "../components/home/HomeAajnuRashifal.jsx";
import HomeRmtgmt from "../components/home/HomeRmtgmt.jsx";
import HomeBeeps from "../components/home/HomeBeeps.jsx";
import GujaratNewsSection from "../components/home/GujaratNewsSection.jsx";
import BharatNewsSection from "../components/home/BharatNewsSection.jsx";
import BusinessNewsSection from "../components/home/BusinessNewsSection.jsx";
import SportsNewsSection from "../components/home/SportsNewsSection.jsx";
import WorldNewsSection from "../components/home/WorldNewsSection.jsx";
import EntertainmentNewsSection from "../components/home/EntertainmentNewsSection.jsx";
import WebStoriesSection from "../components/home/WebStoriesSection.jsx";
import MaruGujarat from "../components/home/MaruGujarat.jsx";
import MaruShaher from "../components/home/MaruShaher.jsx";
import ShikshanNewsSection from "../components/home/ShikshanNewsSection.jsx";
import ManoranjanNewsSection from "../components/home/ManoranjanNewsSection.jsx";
import RecipeNewsSection from "../components/home/RecipeNewsSection.jsx";
// Tablet-only inline widgets (sidebar 768–1279 me hidden hai, isliye uske
// cards beech-beech me: top news -> video -> e-paper -> games -> poll)
import VideoCard from "../components/widgets/VideoCard.jsx";
import EPaper from "../components/widgets/EPaper.jsx";
import GamesWidgetCard from "../components/widgets/GamesWidgetCard.jsx";
import PollWidgetCard from "../components/widgets/PollWidgetCard.jsx";

// Sirf tablet (768–1279px): mobile pe BottomNav hai, desktop pe sidebar hai
function TabletOnly({ children }) {
  return <div className="hidden py-4 md:block xl:hidden">{children}</div>;
}

export default function Home() {
  return (
    <MainGrid>
      <div>
        <HomeHeroSection />
        <TabletOnly>
          <VideoCard title="વિડિઓ" to="/videos" />
        </TabletOnly>
        <HomeVideosSection />
        <TabletOnly>
          <EPaper title="ઈ-પેપર" to="/epaper" />
        </TabletOnly>
        <HomeFiller1 />
        <HomeRmtgmt />
        <HomeBeeps />
        <HomeFiller2 />
        <TabletOnly>
          <GamesWidgetCard title="ગેમ્સ" to="/games" />
        </TabletOnly>
        <HomeAajnuRashifal />
        <HomeFiller3 />
        <TabletOnly>
          <PollWidgetCard />
        </TabletOnly>
        <HomePhotoGallery />
        <HomeFiller4 />
        {/* <HomeOnThisDay /> */}
        <div className="hidden md:block">
          <section className="flex flex-col space-y-10">
            <GujaratNewsSection />
            <BharatNewsSection />
            <BusinessNewsSection />
            <SportsNewsSection />
            <WorldNewsSection />
            <EntertainmentNewsSection />
            <MaruGujarat />
            <MaruShaher />
            <ManoranjanNewsSection />
            <ShikshanNewsSection />
            <RecipeNewsSection />
            <WebStoriesSection />
          </section>
        </div>
      </div>
    </MainGrid>
  );
}