import { useState, useEffect, useRef, useLayoutEffect } from "react";
import TopNavbar from "./TopNavbar.jsx";
import CategoryNavbar from "./CategoryNavbar.jsx";
import TrendingNavbar from "./TrendingNavbar.jsx";
import MobileSidebar from "../../common/MobileSidebar.jsx";
import {
  AD_RAIL_MAX_WIDTH,
  AD_RAIL_GRID_COLS,
  AD_RAIL_GAP,
  AD_RAIL_PADDING,
} from "../../common/SideAds.jsx";

export default function Header({ showChrome }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const topNavSentinelRef = useRef(null);
  const stickyHeaderRef = useRef(null);
  const mobileStickyRef = useRef(null);

  // Mobile breakpoint
  useLayoutEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Desktop only: detect scroll past TopNavbar
  useEffect(() => {
    if (isMobile) return; // mobile માં isScrolled ની જરૂર નથી

    const sentinel = topNavSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsScrolled(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isMobile]);

  // Sticky header height → CSS variable
  useLayoutEffect(() => {
    const el = isMobile ? mobileStickyRef.current : stickyHeaderRef.current;
    if (!el) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--sticky-header-h",
        `${el.offsetHeight}px`
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, [isScrolled, isMobile]);

  const headerContainerClass = showChrome
    ? `mx-auto grid w-full grid-cols-1 ${AD_RAIL_GRID_COLS} ${AD_RAIL_GAP} px-0 ${AD_RAIL_PADDING} ${AD_RAIL_MAX_WIDTH}`
    : `mx-auto w-full px-0 ${AD_RAIL_PADDING} ${AD_RAIL_MAX_WIDTH}`;

  const mobileContainerClass = "mx-auto w-full px-0 max-w-none";

  // ========== MOBILE (<768px) ==========
  if (isMobile) {
    return (
      <>
        {/* Top + Category — always sticky */}
        <div
          ref={mobileStickyRef}
          className="sticky top-0 z-40 w-full select-none"
        >
          {/* TopNavbar */}
          <div className="w-full bg-white dark:bg-surface-dark shadow-[0_2px_4px_rgba(0,0,0,0.08)]">
            <div className={mobileContainerClass}>
              <div className="w-full min-w-0">
                <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
              </div>
            </div>
          </div>

          {/* CategoryNavbar — always sticky, NO logo/menu on scroll */}
          <div className="w-full bg-[#f5f5f7] dark:bg-surface-dark">
            <div className={mobileContainerClass}>
              <div className="w-full min-w-0">
                <CategoryNavbar
                  isScrolled={false}
                  onMenuClick={() => setSidebarOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* TrendingNavbar — NOT sticky, scrolls away under the sticky block */}
        <div className="w-full bg-[#f5f5f7] dark:bg-surface-dark">
          <div className={mobileContainerClass}>
            <div className="w-full min-w-0">
              <TrendingNavbar />
            </div>
          </div>
        </div>

        <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </>
    );
  }

  // ========== DESKTOP (>=768px) — exactly as before ==========
  return (
    <>
      {/* TopNavbar — normal flow */}
      <div
        ref={topNavSentinelRef}
        className="w-full bg-white dark:bg-surface-dark select-none shadow-[0_2px_4px_rgba(0,0,0,0.08)] max-md:mb-2 md:mb-3"
      >
        <div className={headerContainerClass}>
          {showChrome && <div className="hidden xl:block" aria-hidden="true" />}
          <div className="w-full min-w-0">
            <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
          </div>
          {showChrome && <div className="hidden xl:block" aria-hidden="true" />}
        </div>
      </div>

      {/* Category + Trending — sticky */}
      <header
        ref={stickyHeaderRef}
        className="sticky top-0 z-40 w-full select-none"
      >
        {/* Category row */}
        <div className="w-full bg-[#f5f5f7] dark:bg-surface-dark">
          <div className={headerContainerClass}>
            {showChrome && <div className="hidden xl:block" aria-hidden="true" />}
            <div className="w-full min-w-0">
              <CategoryNavbar
                isScrolled={isScrolled}
                onMenuClick={() => setSidebarOpen(true)}
              />
            </div>
            {showChrome && <div className="hidden xl:block" aria-hidden="true" />}
          </div>
        </div>

        {/* Trending row */}
        <div className="w-full bg-[#f5f5f7] dark:bg-surface-dark">
          <div className={headerContainerClass}>
            {showChrome && <div className="hidden xl:block" aria-hidden="true" />}
            <div className="w-full min-w-0">
              <TrendingNavbar />
            </div>
            {showChrome && <div className="hidden xl:block" aria-hidden="true" />}
          </div>
        </div>
      </header>

      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}