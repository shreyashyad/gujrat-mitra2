// src/components/aapniAaj/AapniAajHero.jsx
import { useRef, useState, useEffect } from "react";
import { CITY_OPTIONS, GU_DAYS } from "../../data/aapniAajData.js";
import { Calendar, MapPin, ChevronDown } from "lucide-react";

// અંકોને ગુજરાતીમાં રૂપાંતરિત કરવા માટેનું ફંક્શન
const toGujaratiDigits = (str) => {
  const guDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
  return str.replace(/[0-9]/g, (w) => guDigits[parseInt(w, 10)]);
};

// YYYY-MM-DD ને DD/MM/YYYY માં ફોર્મેટ કરવા માટેનું ફંક્શન
const formatToGujaratiDate = (isoStr) => {
  if (!isoStr) return "";
  const [year, month, day] = isoStr.split("-");
  const formatted = `${day}/${month}/${year}`;
  return toGujaratiDigits(formatted);
};

export default function AapniAajHero({
  dateISO,
  onDateChange,
  city,
  onCityChange,
  weekday,
  tithiHeading,
}) {
  const dateInputRef = useRef(null);
  const cityWrapRef = useRef(null);
  const [cityOpen, setCityOpen] = useState(false);

  // કેલેન્ડર પોપ-અપ ખોલવા માટેનું ફંક્શન
  const openDatePicker = () => {
    if (dateInputRef.current) {
      if (dateInputRef.current.showPicker) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  // બહાર ક્લિક કરતાં ડ્રોપડાઉન બંધ
  useEffect(() => {
    if (!cityOpen) return;
    const onDoc = (e) => {
      if (cityWrapRef.current && !cityWrapRef.current.contains(e.target)) {
        setCityOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setCityOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [cityOpen]);

  // અહીં પૂરેપૂરું લખાણ કાયમી ફિક્સ કરી દીધું છે
  const displayHeading = "વિક્રમ સંવત ૨૦૮૨, અષાઢ સુદ પૂનમ";

  return (
    <div className="rounded-2xl mb-4 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
        <h2 className="font-gu text-[28px] font-normal text-ink dark:text-ink-dark leading-snug">
          {displayHeading}{" "}
          <span className="text-[#e48d0b] font-semibold">
            — {weekday || GU_DAYS[new Date().getDay()]}
          </span>
        </h2>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Custom Date Input */}
          <div
            onClick={openDatePicker}
            className="relative flex items-center justify-between gap-2 flex-1 sm:flex-initial h-10 cursor-pointer rounded-xl bg-gray-100 dark:bg-neutral-800/80 border border-black/10 dark:border-white/10 px-3 py-1.5 transition-all focus-within:ring-2 focus-within:ring-[#e48d0b]/50"
          >
            <span className="text-[19px] font-normal text-ink dark:text-ink-dark font-gu leading-none select-none">
              {formatToGujaratiDate(dateISO)}
            </span>

            <div className="text-ink dark:text-white/60 hover:text-[#e48d0b] transition-colors text-[15px]">
              <Calendar strokeWidth={2} />
            </div>

            <input
              ref={dateInputRef}
              type="date"
              value={dateISO}
              onChange={(e) => onDateChange(e.target.value)}
              className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
            />
          </div>

          {/* Custom City Select — MapPin shows on trigger + every option */}
          <div className="relative h-10" ref={cityWrapRef}>
            <button
              type="button"
              onClick={() => setCityOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={cityOpen}
              className="flex h-full min-w-[140px] cursor-pointer items-center gap-2 rounded-xl border border-black/10 bg-gray-100 px-3 font-gu text-[18px] text-ink outline-none transition-all hover:border-[#e48d0b]/40 focus:ring-2 focus:ring-[#e48d0b]/50 dark:border-white/10 dark:bg-neutral-800/80 dark:text-ink-dark"
            >
              <MapPin
                strokeWidth={2}
                size={18}
                className="shrink-0 text-ink dark:text-white/60"
              />
              <span className="flex-1 truncate text-left">{city}</span>
              <ChevronDown
                size={16}
                className={`shrink-0 text-ink/50 transition-transform dark:text-white/50 ${
                  cityOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {cityOpen && (
              <ul
                role="listbox"
                className="absolute right-0 z-50 mt-1.5 min-w-full overflow-hidden rounded-xl border border-black/10 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-neutral-900"
              >
                {CITY_OPTIONS.map((c) => {
                  const selected = c === city;
                  return (
                    <li key={c} role="option" aria-selected={selected}>
                      <button
                        type="button"
                        onClick={() => {
                          onCityChange(c);
                          setCityOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center gap-2.5 px-3 py-2.5 text-left font-gu text-[17px] transition-colors ${
                          selected
                            ? "bg-[#2563eb] text-white"
                            : "text-ink hover:bg-black/[0.04] dark:text-ink-dark dark:hover:bg-white/[0.06]"
                        }`}
                      >
                        <MapPin
                          strokeWidth={2}
                          size={16}
                          className={`shrink-0 ${
                            selected ? "text-white" : "text-ink/60 dark:text-white/50"
                          }`}
                        />
                        <span>{c}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}