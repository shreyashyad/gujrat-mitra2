import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

const SavedNewsContext = createContext(null);

const STORAGE_KEY = "gm-saved-news";
const TOAST_DURATION = 2200; // ms

function getItemKey(item) {
  if (!item || typeof item !== "object") return "";

  const raw = item.id ?? item.opinionId ?? item.articleId ?? item.url ?? item.slug ?? "";
  const value = String(raw ?? "").trim();

  if (!value) return "";

  return value.replace(/^opinion[-_]/i, "");
}

function normalizeSavedItem(article) {
  if (!article || typeof article !== "object") return null;

  const key = getItemKey(article);
  if (!key) return null;

  return {
    ...article,
    id: key,
    headline: article.headline || article.title || article.name || "",
    title: article.title || article.headline || article.name || "",
    img: article.img || article.image || article.thumbnail || "",
    type: article.type || "article",
  };
}

function loadSaved() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    return list.map((item) => normalizeSavedItem(item)).filter(Boolean);
  } catch {
    return [];
  }
}

export function SavedNewsProvider({ children }) {
  const [savedArticles, setSavedArticles] = useState(loadSaved);
  const [toast, setToast] = useState(null); // { id, message }
  const toastTimerRef = useRef(null);

  // localStorage sathe hammesha sync rakho — refresh/naya tab par pan yaad rahe
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedArticles));
    } catch {
      // storage full/blocked hoy to bhi crash na thay
    }
  }, [savedArticles]);

  const showToast = useCallback((message) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ id: Date.now(), message });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const isSaved = useCallback(
    (id) => {
      const key = String(id ?? "");
      if (!key) return false;
      return savedArticles.some((a) => String(getItemKey(a)) === key);
    },
    [savedArticles],
  );

  const toggleSave = useCallback(
    (article) => {
      const normalized = normalizeSavedItem(article);
      if (!normalized) return;

      setSavedArticles((prev) => {
        const key = getItemKey(normalized);
        const exists = prev.some((a) => String(getItemKey(a)) === key);

        if (exists) {
          showToast("સેવ કરેલમાંથી દૂર કરાયું");
          return prev.filter((a) => String(getItemKey(a)) !== key);
        }

        showToast("પછી માટે સેવ કરાયું");
        return [normalized, ...prev];
      });
    },
    [showToast],
  );

  return (
    <SavedNewsContext.Provider
      value={{ savedArticles, isSaved, toggleSave, toast }}
    >
      {children}
    </SavedNewsContext.Provider>
  );
}

export function useSavedNews() {
  const ctx = useContext(SavedNewsContext);
  if (!ctx) {
    throw new Error("useSavedNews must be used within SavedNewsProvider");
  }
  return ctx;
} 