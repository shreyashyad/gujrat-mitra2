// src/context/FontScaleContext.jsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const FONT_MIN = 80;
export const FONT_MAX = 130;
export const FONT_STEP = 10;
export const FONT_STORAGE_KEY = "fontZoom";

function readStoredZoom() {
  if (typeof window === "undefined") return 100;
  try {
    const saved = Number(localStorage.getItem(FONT_STORAGE_KEY));
    if (saved && saved >= FONT_MIN && saved <= FONT_MAX) return saved;
  } catch {
    /* localStorage blocked */
  }
  return 100;
}

export function applyFontScale(percent) {
  if (typeof document === "undefined") return;
  const clamped = Math.min(
    FONT_MAX,
    Math.max(FONT_MIN, Number(percent) || 100)
  );
  document.documentElement.style.setProperty(
    "--font-scale",
    String(clamped / 100)
  );
  document.documentElement.setAttribute("data-font-zoom", String(clamped));
}

const FontScaleContext = createContext(null);

export function FontScaleProvider({ children }) {
  const [fontSize, setFontSize] = useState(readStoredZoom);

  useEffect(() => {
    applyFontScale(fontSize);
    try {
      localStorage.setItem(FONT_STORAGE_KEY, String(fontSize));
    } catch {
      /* ignore */
    }
  }, [fontSize]);

  const decreaseFont = useCallback(() => {
    setFontSize((z) => Math.max(FONT_MIN, z - FONT_STEP));
  }, []);

  const increaseFont = useCallback(() => {
    setFontSize((z) => Math.min(FONT_MAX, z + FONT_STEP));
  }, []);

  const value = useMemo(
    () => ({
      fontSize,
      decreaseFont,
      increaseFont,
      canDecrease: fontSize > FONT_MIN,
      canIncrease: fontSize < FONT_MAX,
      FONT_MIN,
      FONT_MAX,
      FONT_STEP,
    }),
    [fontSize, decreaseFont, increaseFont]
  );

  return (
    <FontScaleContext.Provider value={value}>
      {children}
    </FontScaleContext.Provider>
  );
}

export function useFontScale() {
  const ctx = useContext(FontScaleContext);
  if (!ctx) {
    throw new Error("useFontScale must be used within FontScaleProvider");
  }
  return ctx;
}