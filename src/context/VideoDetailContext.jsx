import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSearchParams } from "react-router-dom";
import { getVideos } from "../services/newsService.js";

const VideoDetailContext = createContext(null);
const VIDEO_PARAM = "video";

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
  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(apply);
  });
  setTimeout(apply, 0);
  setTimeout(apply, 50);
  setTimeout(apply, 120);
}

export function VideoDetailProvider({ children }) {
  const [video, setVideo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isClosingRef = useRef(false);
  const savedScrollYRef = useRef(0);

  const openVideo = useCallback(
    (item) => {
      if (!item?.id) return;

      // Only capture the "return to" position on the FIRST open — see
      // NewsDetailContext for why this guard matters when opening a
      // related video from inside an already-open panel.
      if (!isOpen) {
        savedScrollYRef.current = getScrollY();
      }

      setVideo(item);
      setIsOpen(true);

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(VIDEO_PARAM, item.id);
          return next;
        },
      );
      setScrollY(0);
    },
    [isOpen, setSearchParams],
  );

  const closeVideo = useCallback((options) => {
    isClosingRef.current = true;

    // resetScroll: true is passed by breadcrumb links that navigate to a
    // different page — those should land at the top of that page, not at
    // wherever the video panel happened to be scrolled from.
    const resetScroll = options?.resetScroll === true;
    const y = resetScroll ? 0 : savedScrollYRef.current;

    setIsOpen(false);
    setVideo(null);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(VIDEO_PARAM);
        return next;
      },
      { replace: true },
    );

    setScrollY(y);

    setTimeout(() => {
      isClosingRef.current = false;
    }, 50);
  }, [setSearchParams]);

  useEffect(() => {
    if (isClosingRef.current) return;

    const idFromUrl = searchParams.get(VIDEO_PARAM);

    if (!idFromUrl) {
      if (isOpen) {
        setIsOpen(false);
        setVideo(null);
        setScrollY(savedScrollYRef.current);
      }
      return;
    }

    if (isOpen && video?.id === idFromUrl) return;

    let cancelled = false;

    (async () => {
      const list = await getVideos();
      if (cancelled || isClosingRef.current) return;

      const found = (list || []).find((v) => v.id === idFromUrl);
      if (found) {
        if (!isOpen) {
          savedScrollYRef.current = getScrollY();
        }
        setVideo(found);
        setIsOpen(true);
        setScrollY(0);
      } else {
        setSearchParams(
          (prev) => {
            const next = new URLSearchParams(prev);
            next.delete(VIDEO_PARAM);
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
    <VideoDetailContext.Provider
      value={{ video, isOpen, openVideo, closeVideo }}
    >
      {children}
    </VideoDetailContext.Provider>
  );
}

export function useVideoDetail() {
  const ctx = useContext(VideoDetailContext);
  if (!ctx) {
    throw new Error("useVideoDetail must be used within VideoDetailProvider");
  }
  return ctx;
}