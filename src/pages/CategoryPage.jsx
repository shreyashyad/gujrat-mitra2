import { useParams } from "react-router-dom";
import MainGrid from "../components/layout/MainGrid.jsx";
import CategoryFeed from "../components/category/CategoryFeed.jsx";
import { sidebarCategories } from "../data/sidebarCategories.js";
import NotFound from "./NotFound.jsx";

/* Same mobile-only home blocks (each component already has md:hidden) */
import HomeVideosSection from "../components/home/HomeVideosSection.jsx";
import HomeFiller1 from "../components/home/HomeFiller1.jsx";
import HomeRmtgmt from "../components/home/HomeRmtgmt.jsx";
import HomeBeeps from "../components/home/HomeBeeps.jsx";
import HomeFiller2 from "../components/home/HomeFiller2.jsx";
import HomeAajnuRashifal from "../components/home/HomeAajnuRashifal.jsx";
import HomeFiller3 from "../components/home/HomeFiller3.jsx";
import HomePhotoGallery from "../components/home/HomePhotoGallery.jsx";
import HomeFiller4 from "../components/home/HomeFiller4.jsx";
import HomeOnThisDay from "../components/home/HomeOnThisDay.jsx";

export default function CategoryPage() {
  const { slug } = useParams();
  const category = sidebarCategories.find((c) => c.slug === slug);

  // માન્ય category ન મળે તો સીધું 404 બતાવો
  if (!category) {
    return <NotFound />;
  }

  return (
    <MainGrid>
      {category.dataKey ? (
        <>
          <CategoryFeed
            dataKey={category.dataKey}
            slug={slug}
            categoryLabel={category.name}
          />

          {/* Mobile (<768px) only — same blocks as Home below hero */}
          <HomeVideosSection />
          <HomeFiller1 />
          <HomeRmtgmt />
          <HomeBeeps />
          <HomeFiller2 />
          <HomeAajnuRashifal />
          <HomeFiller3 />
          <HomePhotoGallery />
          <HomeFiller4 />
          <HomeOnThisDay />
        </>
      ) : (
        <div
          className="mt-2 rounded-2xl bg-white dark:bg-white/[0.04]
                        shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                        dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]
                        p-5 sm:p-6"
        >
          <p className="font-gu text-base text-ink/70 dark:text-ink-dark/70">
            આ કેટેગરીના સમાચાર ટૂંક સમયમાં અહીં ઉમેરાશે.
          </p>
        </div>
      )}
    </MainGrid>
  );
}
