import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const CharchaPatraDetailContext = createContext();

function getScrollY() {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function setScrollY(y) {
  const top = Number.isFinite(y) ? y : 0;
  const apply = () => {
    window.scrollTo(0, top);
    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
  };
  apply();
  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(apply);
  });
  setTimeout(apply, 0);
  setTimeout(apply, 50);
  setTimeout(apply, 120);
}

export function CharchaPatraDetailProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const { pathname } = useLocation();
  const savedScrollYRef = useRef(0);
  // Remembers which page the detail was opened FROM, so closeDetail can
  // tell "closing back to that same list" (restore the old scroll) apart
  // from "navigating to some other page via a breadcrumb" (start at top).
  const originPathnameRef = useRef(null);

  const openDetail = useCallback((item) => {
    if (!item) return;

    // openDetail runs from two different places for the same click:
    // 1) directly, from the card's onClick (for an instant UI update), and
    // 2) again, reactively, from CharchaPatra.jsx's `id` effect once
    //    navigate() below changes the URL/param.
    // Without this guard both calls used to push their own history entry
    // (on top of the one navigate() already pushes), so opening a single
    // article added 2-3 entries to history and the browser Back button
    // needed multiple presses to actually leave the article. Skip the
    // re-entrant call entirely — the item is already open.
    if (isOpen && activeItem && String(activeItem.id) === String(item.id)) {
      return;
    }

    // Only capture the "return to" position on the FIRST open. If a
    // charchapatra is already open and the user taps a related one, the
    // current scrollY belongs to that panel, not the original list —
    // capturing it here would silently replace the real return position.
    if (!isOpen) {
      savedScrollYRef.current = getScrollY();
      originPathnameRef.current = window.location.pathname;
    }
    setActiveItem(item);
    setIsOpen(true);
    queueMicrotask(() => setScrollY(0));
  }, [activeItem, isOpen]);

  const closeDetail = useCallback((targetPathname) => {
    // If we know where this close is headed and it's a different page
    // than the one the article was opened from, don't reuse that page's
    // saved scroll position — start the new page at the top instead.
    const shouldRestore =
      !targetPathname || targetPathname === originPathnameRef.current;
    const y = shouldRestore ? savedScrollYRef.current : 0;
    window.__gmModalState = null;
    setIsOpen(false);
    setActiveItem(null);
    setScrollY(y);
  }, []);

  useEffect(() => {
    if (!pathname.startsWith("/charcha-patra")) {
      setIsOpen(false);
      setActiveItem(null);
    }
  }, [pathname]);

  return (
    <CharchaPatraDetailContext.Provider value={{ isOpen, activeItem, openDetail, closeDetail }}>
      {children}
    </CharchaPatraDetailContext.Provider>
  );
}

export function useCharchaPatraDetail() {
  return useContext(CharchaPatraDetailContext);
}