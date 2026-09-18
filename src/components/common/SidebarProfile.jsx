// src/components/common/SidebarProfile.jsx
import { NavLink } from "react-router-dom";
import { KeyRound, Settings, Bookmark, ChevronRight } from "lucide-react";
import { useFontScale } from "../../context/FontScaleContext.jsx";

const DEFAULT_NAME = "વાચક";
const DEFAULT_EMAIL = "reader@gujaratmitra.in";

const GUJ_DIGITS = {
  0: "૦",
  1: "૧",
  2: "૨",
  3: "૩",
  4: "૪",
  5: "૫",
  6: "૬",
  7: "૭",
  8: "૮",
  9: "૯",
};
const toGujDigits = (n) => String(n).replace(/[0-9]/g, (d) => GUJ_DIGITS[d]);

export default function SidebarProfile({ onClose }) {
  const {
    fontSize: fontZoom,
    decreaseFont,
    increaseFont,
    canDecrease,
    canIncrease,
  } = useFontScale();

  return (
    <div className="p-4 border-b border-black/5 dark:border-white/5 space-y-3">
      {/* Identity Card */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] backdrop-blur-md border border-black/5 dark:border-white/10 shadow-xs">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-home text-home-text font-gu text-xl font-bold shadow-xs">
          {DEFAULT_NAME.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-gu text-base font-bold text-ink dark:text-ink-dark truncate leading-[1.2]">
            {DEFAULT_NAME}
          </p>
          <p className="text-sm text-ink/60 dark:text-ink-dark/60 truncate">
            {DEFAULT_EMAIL}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-5 px-1 pt-1">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-md font-gu font-semibold text-[#e48d0b]
                     hover:opacity-80 active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <KeyRound size={18} strokeWidth={2.25} />
          લોગિન કરો
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-md font-gu text-ink/70 hover:text-ink dark:text-ink-dark/70 dark:hover:text-ink-dark
                     active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <Settings size={18} strokeWidth={2.25} />
          પ્રોફાઇલ સેટિંગ્સ
        </button>
      </div>

      {/* Font Size — shared global scale */}
      <div className="flex items-center justify-between rounded-full border border-ink/15 dark:border-ink-dark/20 bg-black/[0.02] dark:bg-white/[0.02] p-1 shadow-xs">
        <button
          type="button"
          onClick={decreaseFont}
          disabled={!canDecrease}
          aria-label="ફોન્ટ નાનો કરો"
          className="flex h-7 w-10 items-center justify-center rounded-full
                     text-ink/80 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent
                     dark:text-ink-dark/80 dark:hover:bg-white/10
                     active:scale-90 font-en text-xs font-bold transition-all duration-150"
        >
          A−
        </button>
        <span
          className="font-gu text-base font-semibold text-ink/70 dark:text-ink-dark/70"
          aria-live="polite"
        >
          {toGujDigits(fontZoom)}%
        </span>
        <button
          type="button"
          onClick={increaseFont}
          disabled={!canIncrease}
          aria-label="ફોન્ટ મોટો કરો"
          className="flex h-7 w-10 items-center justify-center rounded-full
                     text-ink/80 hover:bg-black/5 disabled:opacity-30 disabled:hover:bg-transparent
                     dark:text-ink-dark/80 dark:hover:bg-white/10
                     active:scale-90 font-en text-xs font-bold transition-all duration-150"
        >
          A+
        </button>
      </div>

      {/* Saved News */}
      <NavLink to="/saved" onClick={onClose} className="block">
        {({ isActive }) => (
          <div
            className={`group relative flex items-center justify-between overflow-hidden rounded-2xl border px-3.5 py-3
                        transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                          isActive
                            ? "border-[#ffc107]/40 bg-gradient-to-r from-[#fff8dc] to-[#fff3c4] dark:from-[#3a2d00] dark:to-[#2b2100] shadow-xs"
                            : "border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-md hover:border-[#ffc107]/40 hover:bg-[#fffaf0] dark:hover:bg-white/5"
                        }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-[10px] transition-all duration-200 ${
                  isActive
                    ? "bg-[#ffc107] text-black shadow-xs"
                    : "bg-[#ffc107]/15 text-[#d49b00] group-hover:bg-[#ffc107] group-hover:text-black"
                }`}
              >
                <Bookmark size={18} strokeWidth={2.2} />
              </div>

              <div className="flex flex-col">
                <span
                  className={`font-gu text-md transition-colors ${
                    isActive
                      ? "font-bold text-home"
                      : "font-medium text-ink dark:text-ink-dark"
                  }`}
                >
                  સેવ કરેલ સમાચાર
                </span>
                <span className="font-gu text-[11px] text-ink/50 dark:text-ink-dark/50">
                  પછી વાંચવા માટે સાચવેલા સમાચાર
                </span>
              </div>
            </div>

            <ChevronRight
              size={17}
              className={`transition-all duration-200 ${
                isActive
                  ? "translate-x-0.5 text-[#d49b00] stroke-[2.5]"
                  : "text-ink/35 dark:text-ink-dark/35 group-hover:translate-x-0.5 group-hover:text-[#d49b00]"
              }`}
            />

            {isActive && (
              <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#ffc107]" />
            )}
          </div>
        )}
      </NavLink>
    </div>
  );
}