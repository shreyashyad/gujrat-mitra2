// src/App.jsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import Header from "./components/layout/Header/Header.jsx";
import Footer from "./components/layout/Footer.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";
import MobileBottomNav from "./components/widgets/MobileBottomNav.jsx";
import SideAds, {
  AD_RAIL_MAX_WIDTH,
  AD_RAIL_GRID_COLS,
  AD_RAIL_GAP,
  AD_RAIL_PADDING,
} from "./components/common/SideAds.jsx";
import { sidebarCategories } from "./data/sidebarCategories.js";

import { NewsDetailProvider } from "./context/NewsDetailContext.jsx";
import { GameDetailProvider } from "./context/GameDetailContext.jsx";
import { BeepsDetailProvider } from "./context/BeepsDetailContext.jsx";
import { VideoDetailProvider } from "./context/VideoDetailContext.jsx";
import { CharchaPatraDetailProvider } from "./context/CharchaPatraDetailContext.jsx"; 
import BeepsModalOverlay from "./components/beeps/BeepsModalOverlay.jsx";
import SaveToast from "./components/common/SaveToast.jsx";
import BackToTop from "./components/common/BackToTop.jsx";

const validPaths = [
  "/",
  "/saved",
  "/beeps",
  "/epaper",
  "/aapni-aaj",
  "/games",
  "/videos",
  "/charcha-patra",
  "/opinion",
];

const validCategorySlugs = sidebarCategories.map((c) => c.slug);

function getPageScrollY() {
  return Math.max(
    window.scrollY || window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0
  );
}

function restorePageScroll(scrollY, onComplete) {
  const apply = () => {
    window.scrollTo({ top: scrollY, behavior: "auto" });
    document.documentElement.scrollTop = scrollY;
    document.body.scrollTop = scrollY;
  };

  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(() => {
      apply();
      window.setTimeout(() => {
        apply();
        window.setTimeout(() => {
          apply();
          onComplete?.();
        }, 80);
      }, 80);
    });
  });
}

function saveCurrentHistoryScroll(replaceState) {
  const scrollY = getPageScrollY();
  const routeKey = `${window.location.pathname}${window.location.search}`;

  window.sessionStorage.setItem(`page-scroll:${routeKey}`, String(scrollY));
  replaceState.call(
    window.history,
    { ...(window.history.state || {}), __scrollY: scrollY },
    "",
    window.location.href
  );
}

function getSavedRouteScroll(pathname, search) {
  const value = window.sessionStorage.getItem(
    `page-scroll:${pathname}${search}`
  );
  return value === null ? null : Number(value);
}

function AppContent() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const modalOpenRef = useRef(false);
  const pendingScrollRestoreRef = useRef(null);
  const restoringScrollRef = useRef(false);
  const lastModalScrollYRef = useRef(null);
  const lastPathnameRef = useRef(location.pathname);

  useEffect(() => {
    if (window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.replaceState = function (state, ...args) {
      const currentState = window.history.state || {};
      const preservedState = {
        ...(typeof currentState.prevScrollY === "number"
          ? { prevScrollY: currentState.prevScrollY }
          : {}),
        ...(currentState.appModal ? { appModal: currentState.appModal } : {}),
      };

      return originalReplaceState.call(
        this,
        { ...preservedState, ...(state || {}) },
        ...args
      );
    };

    window.history.pushState = function (state, ...args) {
      if (typeof state?.prevScrollY === "number") {
        lastModalScrollYRef.current = state.prevScrollY;
      }

      saveCurrentHistoryScroll(window.history.replaceState);
      return originalPushState.call(this, state, ...args);
    };

    const syncModalState = () => {
      const modalSelector =
        '[role="dialog"][aria-modal="true"], [aria-modal="true"], [data-modal-open="true"], [data-overlay-open="true"]';
      const hasOpenDialog =
        !!document.querySelector(modalSelector) ||
        document.body.style.overflow === "hidden" ||
        document.documentElement.style.overflow === "hidden" ||
        document.body.style.position === "fixed";

      modalOpenRef.current = hasOpenDialog;
      return hasOpenDialog;
    };

    const handleBrowserBack = (event) => {
      const targetScrollY =
        getSavedRouteScroll(window.location.pathname, window.location.search) ??
        (typeof event?.state?.__scrollY === "number"
          ? event.state.__scrollY
          : lastModalScrollYRef.current);
      if (typeof targetScrollY === "number") {
        pendingScrollRestoreRef.current = targetScrollY;
        restoringScrollRef.current = true;
      }

      if (!syncModalState()) {
        return;
      }

      event.preventDefault();
      document.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Escape",
          bubbles: true,
        })
      );

      const currentState = event?.state || window.history.state;
      if (
        currentState &&
        typeof currentState.__scrollY !== "number" &&
        typeof currentState.prevScrollY === "number"
      ) {
        pendingScrollRestoreRef.current = currentState.prevScrollY;
      }

      lastModalScrollYRef.current = null;
    };

    // A plain window "scroll" listener already sees every page scroll —
    // window, document (capture) and document.body listeners below used
    // to all fire for the SAME event and each one wrote to
    // sessionStorage synchronously, on every scroll tick. On a long
    // scroll that's dozens of redundant, unthrottled writes per second,
    // which is a big part of the site-wide "laggy" feel. Keep a single
    // listener and rAF-throttle the save so it runs at most once per
    // animation frame.
    let scrollSaveScheduled = false;
    const saveScrollOnScroll = () => {
      if (restoringScrollRef.current || scrollSaveScheduled) {
        return;
      }
      scrollSaveScheduled = true;
      requestAnimationFrame(() => {
        scrollSaveScheduled = false;
        if (restoringScrollRef.current) return;
        saveCurrentHistoryScroll(window.history.replaceState);
      });
    };

    syncModalState();
    window.addEventListener("popstate", handleBrowserBack);
    window.addEventListener("scroll", saveScrollOnScroll, { passive: true });

    return () => {
      window.removeEventListener("popstate", handleBrowserBack);
      window.removeEventListener("scroll", saveScrollOnScroll);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    const pendingScrollY = pendingScrollRestoreRef.current;
    pendingScrollRestoreRef.current = null;

    const pathnameChanged = lastPathnameRef.current !== location.pathname;
    lastPathnameRef.current = location.pathname;

    if (navigationType === "POP") {
      const routeScrollY = getSavedRouteScroll(
        location.pathname,
        location.search
      );
      const scrollY =
        typeof pendingScrollY === "number" ? pendingScrollY : routeScrollY;

      if (typeof scrollY === "number") {
        restoringScrollRef.current = true;
        restorePageScroll(scrollY, () => {
          restoringScrollRef.current = false;
        });
      } else {
        restoringScrollRef.current = false;
      }
      return;
    }

    if (navigationType === "PUSH" && pathnameChanged) {
      const routeScrollY = getSavedRouteScroll(
        location.pathname,
        location.search
      );
      const scrollY = typeof routeScrollY === "number" ? routeScrollY : 0;

      restoringScrollRef.current = true;
      restorePageScroll(scrollY, () => {
        restoringScrollRef.current = false;
      });
    }
  }, [location.key, location.pathname, location.search, navigationType]);

  const pathParts = location.pathname.split("/");
  const categorySlug = pathParts[1] === "category" ? pathParts[2] : null;

  const isKnownRoute =
    validPaths.includes(location.pathname) ||
    (categorySlug && validCategorySlugs.includes(categorySlug)) ||
    location.pathname.startsWith("/trending/") ||
    location.pathname.startsWith("/epaper/preview/") ||
    location.pathname.startsWith("/epaper/view/") ||
    location.pathname.startsWith("/charcha-patra/") ||
    location.pathname.startsWith("/opinion/");

  const showFullHeader = isKnownRoute;
  const showChrome = isKnownRoute;

  const layoutWrapperClass = showChrome
    ? `mx-auto grid w-full flex-1 grid-cols-1 ${AD_RAIL_GRID_COLS} ${AD_RAIL_GAP} ${AD_RAIL_PADDING} ${AD_RAIL_MAX_WIDTH}`
    : `mx-auto w-full flex-1 ${AD_RAIL_PADDING} ${AD_RAIL_MAX_WIDTH}`;

  return (
    <div className="bg-[#f5f5f7] dark:bg-surface-dark min-h-screen flex flex-col justify-between transition-all duration-300">
      {showFullHeader && <Header showChrome={showChrome} />}

      <div className={layoutWrapperClass}>
        {showChrome && (
          <div className="hidden xl:block" aria-hidden="true">
            <SideAds />
          </div>
        )}

        <main className={`min-w-0 w-full ${isKnownRoute ? "pb-24 md:landscape:pb-0 xl:pb-0" : ""}`}>
          <AppRoutes />
          {showChrome && <Footer />}
        </main>

        {showChrome && <div className="hidden xl:block" aria-hidden="true" />}
      </div>

      {showChrome && <MobileBottomNav />}

      <BeepsModalOverlay />
      <SaveToast />
      <BackToTop />
    </div>
  );
}

export default function AppShell() {
  return (
    <NewsDetailProvider>
      <GameDetailProvider>
        <BeepsDetailProvider>
          <VideoDetailProvider>
            <CharchaPatraDetailProvider> 
              <AppContent />
            </CharchaPatraDetailProvider>
          </VideoDetailProvider>
        </BeepsDetailProvider>
      </GameDetailProvider>
    </NewsDetailProvider>
  );
}