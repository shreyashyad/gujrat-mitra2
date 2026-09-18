import { createContext, useContext, useState, useCallback } from "react";

const OpinionDetailContext = createContext(null);

export function OpinionDetailProvider({ children }) {
  const [activeItem, setActiveItem] = useState(null);

  const openDetail = useCallback((item) => setActiveItem(item), []);
  const closeDetail = useCallback(() => setActiveItem(null), []);

  return (
    <OpinionDetailContext.Provider value={{ activeItem, openDetail, closeDetail }}>
      {children}
    </OpinionDetailContext.Provider>
  );
}

export function useOpinionDetail() {
  const ctx = useContext(OpinionDetailContext);
  if (!ctx) throw new Error("useOpinionDetail must be used within OpinionDetailProvider");
  return ctx;
}