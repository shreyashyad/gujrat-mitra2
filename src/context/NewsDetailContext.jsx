import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSearchParams } from "react-router-dom";
import { getArticleById } from "../services/newsService.js";

const NewsDetailContext = createContext(null);

const NEWS_PARAM = "news";

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
  const top = typeof y === "number" ? y : 0;
  const apply = () => {
    window.scrollTo(0, top);
    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
  };
  apply();
  // content remount પછી layout settle થાય ત્યારે ફરી
  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(apply);
  });
  setTimeout(apply, 0);
  setTimeout(apply, 50);
  setTimeout(apply, 120);
}

export function NewsDetailProvider({ children }) {
  const [article, setArticle] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isClosingRef = useRef(false);
  const savedScrollYRef = useRef(0);

  const openNews = useCallback(
    (item) => {
      if (!item?.id) return;

      // Only capture the "return to" position on the FIRST open. If a
      // panel is already open (e.g. the user tapped a related article
      // inside it), the current scrollY belongs to the panel itself —
      // capturing it here would overwrite the original page position
      // with 0 (or wherever the panel happened to be), which is why
      // closing used to land back at the wrong spot.
      if (!isOpen) {
        savedScrollYRef.current = getScrollY();
      }

      setArticle(item);
      setIsOpen(true);

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(NEWS_PARAM, item.id);
          return next;
        },
      );

      requestAnimationFrame(() => {
        setScrollY(0);
        requestAnimationFrame(() => setScrollY(0));
      });
    },
    [isOpen, setSearchParams],
  );

  const closeNews = useCallback((options) => {
    isClosingRef.current = true;

    // resetScroll: true is used when the caller is navigating away to a
    // different page (breadcrumb links) rather than just closing back to
    // where the article was opened from — in that case we want the new
    // page to start at the top, not jump to the old saved position.
    const resetScroll = options?.resetScroll === true;
    const y = resetScroll ? 0 : savedScrollYRef.current;

    setIsOpen(false);
    setArticle(null);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(NEWS_PARAM);
        return next;
      },
      { replace: true },
    );

    // children ફરી paint થયા પછી જૂની જગ્યાએ
    setScrollY(y);

    setTimeout(() => {
      isClosingRef.current = false;
    }, 50);
  }, [setSearchParams]);

  useEffect(() => {
    if (isClosingRef.current) return;

    const idFromUrl = searchParams.get(NEWS_PARAM);

    if (!idFromUrl) {
      if (isOpen) {
        setIsOpen(false);
        setArticle(null);
        setScrollY(savedScrollYRef.current);
      }
      return;
    }

    if (isOpen && article?.id === idFromUrl) return;

    if (idFromUrl.startsWith("opinion-")) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(NEWS_PARAM);
          return next;
        },
        { replace: true },
      );
      return;
    }

    let cancelled = false;

    (async () => {
      const found = await getArticleById(idFromUrl);
      if (cancelled || isClosingRef.current) return;

      if (found) {
        // direct URL / refresh — save 0, top થી open
        if (!isOpen) {
          savedScrollYRef.current = getScrollY();
        }
        setArticle(found);
        setIsOpen(true);
        requestAnimationFrame(() => {
          setScrollY(0);
          requestAnimationFrame(() => setScrollY(0));
        });
      } else {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete(NEWS_PARAM);
            return next;
          },
          { replace: true },
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <NewsDetailContext.Provider
      value={{ article, isOpen, openNews, closeNews }}
    >
      {children}
    </NewsDetailContext.Provider>
  );
}

export function useNewsDetail() {
  const ctx = useContext(NewsDetailContext);
  if (!ctx) {
    throw new Error("useNewsDetail must be used within NewsDetailProvider");
  }
  return ctx;
}