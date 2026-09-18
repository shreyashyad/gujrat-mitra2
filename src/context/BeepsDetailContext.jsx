import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

const BeepsDetailContext = createContext(null);

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

export function BeepsDetailProvider({ children }) {
  const [beeps, setBeeps] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const savedScrollYRef = useRef(0);
  const isClosingRef = useRef(false);

  const openBeeps = useCallback((indexOrId, beepsList) => {
    if (beepsList) setBeeps(beepsList);
    savedScrollYRef.current = getScrollY();

    // history entry for proper back button
    window.history.pushState(
      { appModal: "beeps", prevScrollY: savedScrollYRef.current },
      ""
    );

    setActiveIndex(indexOrId);
    setIsOpen(true);
  }, []);

  const closeBeeps = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const y = savedScrollYRef.current;
    setIsOpen(false);
    setActiveIndex(null);
    setScrollY(y);

    // if current history entry is our modal, go back so back button stays correct
    if (window.history.state?.appModal === "beeps") {
      window.history.back();
    }

    setTimeout(() => {
      isClosingRef.current = false;
    }, 100);
  }, []);

  // Handle browser back while modal is open
  useEffect(() => {
    const onPopState = () => {
      if (isOpen && !isClosingRef.current) {
        isClosingRef.current = true;
        setIsOpen(false);
        setActiveIndex(null);
        setScrollY(savedScrollYRef.current);
        setTimeout(() => {
          isClosingRef.current = false;
        }, 100);
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isOpen]);

  return (
    <BeepsDetailContext.Provider
      value={{
        beeps,
        isOpen,
        activeIndex,
        openBeeps,
        closeBeeps,
      }}
    >
      {children}
    </BeepsDetailContext.Provider>
  );
}

export function useBeepsDetail() {
  const ctx = useContext(BeepsDetailContext);
  if (!ctx) {
    throw new Error("useBeepsDetail must be used inside BeepsDetailProvider");
  }
  return ctx;
}