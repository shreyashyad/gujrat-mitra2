import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext.jsx";

// પસંદ થયેલ ભાષા મુજબ ઉપરનો નાનો અક્ષર (Superscript)
const SCRIPT_GLYPH = {
  gu: "અ",
  en: "A",
  hi: "अ",
  mr: "अ",
};

export default function LanguageDropdown() {
  const { language, changeLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = languages.find((l) => l.code === language) ?? languages[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* ઈમેજ મુજબ A અને ઉપર નાના અક્ષર (Superscript) વાળું બટન */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title="ભાષા બદલો"
        className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full
             text-black/95 dark:text-white
             active:bg-black/10 dark:active:bg-white/15 active:scale-90
             transition-all duration-200 cursor-pointer select-none"
      >
        {/* smaller on mobile so it never overflows the box */}
        <span className="text-[25px] sm:text-[33px] font-semibold leading-none">A</span>
        <sup className="text-[18px] sm:text-[22px] font-bold leading-none -top-1 sm:-top-1.5 ml-0.5">
          {SCRIPT_GLYPH[current.code] || "અ"}
        </sup>
      </button>

      {/* Dropdown Menu - ઈમેજ પ્રમાણે વાઈટ કાર્ડ અને સેન્ટર્ડ લિસ્ટ */}
      <div
        className={`absolute right-0 mt-2 w-36 overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10
                   bg-white dark:bg-neutral-900 shadow-xl z-50 p-2 space-y-1.5
                   transition-all duration-200 origin-top-right ease-[cubic-bezier(0.32,0.72,0,1)]
                    ${open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
          }`}
      >
        <ul role="listbox" className="space-y-1.5">
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    changeLanguage(lang.code);
                    setOpen(false);
                  }}
                  role="option"
                  aria-selected={isSelected}
                  className={`w-full flex items-center justify-center py-2.5 px-3 text-sm font-semibold rounded-xl 
                              border transition-all duration-150 cursor-pointer text-center ${isSelected
                      ? "bg-[#E59E38] text-white border-transparent shadow-sm"
                      : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700"
                    }`}
                >
                  {lang.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}