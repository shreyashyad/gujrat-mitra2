import { createContext, useContext, useState } from "react";
import { languages } from "../data/languages.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    () => localStorage.getItem("gm-language") || languages[0].code
  );

  const changeLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem("gm-language", code);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}