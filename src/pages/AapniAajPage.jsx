// src/pages/AapniAajPage.jsx

import { useMemo, useState, useCallback, useEffect } from "react";
import { Goal } from "lucide-react";
import MainGrid from "../components/layout/MainGrid.jsx";
import {
  CITY_DATA,
  GU_DAYS,
  GU_MONTHS,
  AQI_DATA,
  HUMIDITY_DATA,
  DAY_STATUS,
  TEMP_DATA,
  RAIN_DATA,
  ISLAMIC_DATA,
  PARSI_DATA,
  AYAN_DATA,
  PANCHANG_HEADINGS,
} from "../data/aapniAajData.js";
import {
  toISODate,
  buildPanchangCards,
  computeRahukaal,
} from "../utils/aapniAajUtils.js";

import AapniAajHero from "../components/aapniaaj/AapniAajHero.jsx";
import SkyCard from "../components/aapniaaj/SkyCard.jsx";
import PanchangGrid from "../components/aapniaaj/PanchangGrid.jsx";
import JainTimingsSection from "../components/aapniaaj/JainTimingsSection.jsx";
import ChoghadiyaSection from "../components/aapniaaj/ChoghadiyaSection.jsx";
import RashiSection from "../components/aapniaaj/RashiSection.jsx";
import MuhuratSection from "../components/aapniaaj/MuhuratSection.jsx";
import HolidaysSection from "../components/aapniaaj/HolidaysSection.jsx";
import {
  HistoryTodaySection,
  GrahanPanotiSection,
  BirthdayRashifalSection,
} from "../components/aapniaaj/ExtraInfoSections.jsx";
import { usePageProtection } from "../hooks/usePageProtection";

const JUMPERS = [
  { id: "rashi", label: "રાશિફળ" },
  { id: "muhurat", label: "શુભ મુહર્તો" },
  { id: "choghadiya", label: "ચોઘડિયા" },
  { id: "holidays", label: "જાહેર રજાઓ" },
  { id: "history", label: "આજનો ઇતિહાસ" },
  { id: "grahan", label: "ગ્રહણ / પનોતી" },
  { id: "birthday", label: "જન્મદિવસ રાશિફળ" },
];

const SECTION_SCROLL_CLASS =
  "scroll-mt-[calc(var(--header-h,7rem)+0.75rem)] outline-none transition-shadow duration-300 rounded-2xl";

function SectionJumpers() {
  const handleJump = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });

    el.classList.add("ring-2", "ring-orange-500", "ring-offset-2");
    window.setTimeout(() => {
      el.classList.remove("ring-2", "ring-orange-500", "ring-offset-2");
    }, 1000);
  }, []);

  return (
    <nav
      aria-label="સેક્શન નેવિગેશન"
      className="mb-6 -mx-1 overflow-x-auto scrollbar-none"
    >
      <div className="flex min-w-max items-center gap-1.5 px-2 py-2">
        {JUMPERS.map((j) => (
          <button
            key={j.id}
            type="button"
            onClick={() => handleJump(j.id)}
            className="group relative flex shrink-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl border border-black/[0.06] bg-white/80 px-4 py-2.5 font-gu text-[13.5px] font-semibold text-ink/70 shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#e48d0b] hover:bg-white hover:text-[#e48d0b] hover:shadow-[0_8px_20px_rgba(232,163,61,0.12)] active:scale-[0.97] dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-ink-dark/70 dark:hover:border-[#e6c27a]/40 dark:hover:bg-white/[0.08] dark:hover:text-[#e48d0b] dark:hover:shadow-[0_8px_20px_rgba(230,194,122,0.1)]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#e48d0b]/0 via-[#e48d0b]/5 to-[#e48d0b]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-[#e6c27a]/0 dark:via-[#e6c27a]/5 dark:to-[#e6c27a]/0" />
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-black/[0.03] text-ink/45 transition-all duration-300 group-hover:bg-[#e48d0b]/15 group-hover:text-[#e48d0b] dark:bg-white/[0.05] dark:text-ink-dark/45 dark:group-hover:bg-[#e6c27a]/15 dark:group-hover:text-[#e6c27a]">
              <Goal size={14} className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            </span>
            <span className="relative z-10 tracking-tight text-[20px]">{j.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function AapniAajPage() {
  const [dateISO, setDateISO] = useState(() => toISODate());
  const [city, setCity] = useState("સુરત");
  const [isProtectedMaskActive, setIsProtectedMaskActive] = useState(false);

  usePageProtection({
    disableRightClick: true,
    disableShortcuts: true,
    disableSelection: true,
    detectDevTools: false,  
  });

  // Print Screen અથવા Snipping Tool (PrintScreen key) દબાવતા જ સ્ક્રીન બ્લુ કરી દેવા માટે
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "PrintScreen" || (e.ctrlKey && e.key.toLowerCase() === "p")) {
        e.preventDefault();
        setIsProtectedMaskActive(true);
        setTimeout(() => setIsProtectedMaskActive(false), 3000); // 3 સેકન્ડ પછી હટી જશે
      }
    };

    // જ્યારે વિન્ડો બ્લર થાય (એટલે કે Snipping tool કે અન્ય એપ ઓપન થાય ત્યારે સ્ક્રીન છુપાવવા)
    const handleWindowBlur = () => {
      setIsProtectedMaskActive(true);
    };

    const handleWindowFocus = () => {
      setIsProtectedMaskActive(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("window", handleWindowFocus);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("window", handleWindowFocus);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  const cityData = CITY_DATA[city];
  const selectedDate = useMemo(
    () => new Date(dateISO + "T00:00:00"),
    [dateISO]
  );
  const weekday = GU_DAYS[selectedDate.getDay()];

  const rahukaal = useMemo(
    () =>
      computeRahukaal(cityData.sunriseMin, cityData.sunsetMin, selectedDate),
    [cityData, selectedDate]
  );

  const baseCards = useMemo(
    () =>
      buildPanchangCards({
        city,
        rahukaalStr: rahukaal.label,
      }),
    [city, rahukaal.label]
  );

  const getBase = (labelPart) => {
    const found = baseCards?.find((c) => c.label?.includes(labelPart));
    return found?.value || "—";
  };

  const panchangData = useMemo(() => {
    const aqiEntry =
      AQI_DATA.find((item) => item.label.includes(city)) || AQI_DATA[0];
    const humidityEntry =
      HUMIDITY_DATA.find((item) => item.label.includes(city)) ||
      HUMIDITY_DATA[0];
    const tempEntry = TEMP_DATA[city] || TEMP_DATA["સુરત"];
    const rainEntry = RAIN_DATA[city] || RAIN_DATA["સુરત"];
    const dayStatus = DAY_STATUS[city] || {
      value: "શુભ",
      emoji: "✅",
      nature: "good",
    };

    const d = selectedDate;
    const dateStr = `${d.getDate()} ${GU_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
    const tithi = "અષાઢ સુદ પૂનમ";

    return {
      temp: {
        emoji: tempEntry.emoji,
        value: tempEntry.value,
      },
      humidity: {
        emoji: humidityEntry?.emoji || "💧",
        value: humidityEntry?.status
          ? `${humidityEntry.value} • ${humidityEntry.status}`
          : humidityEntry?.value || "—",
      },
      aqi: {
        emoji: aqiEntry?.emoji || "🌬️",
        value: aqiEntry?.status
          ? `${aqiEntry.value} • ${aqiEntry.status}`
          : aqiEntry?.value || "—",
      },
      rain: {
        emoji: rainEntry.emoji,
        value: rainEntry.value,
      },
      dayStatus: {
        emoji: dayStatus.emoji,
        value: dayStatus.value,
        nature: dayStatus.nature,
      },
      nakshatra: getBase("નક્ષત્ર") || getBase("Nakshatra") || "ઉત્તરાષાઢા",
      rashi: getBase("રાશી") || getBase("Rashi") || "મિથુન",
      yoga: getBase("યોગ") || getBase("Yoga") || "સિદ્ધિ યોગ",
      karan: getBase("કરણ") || getBase("Karan") || "બવ કરણ",
      islamicDate: ISLAMIC_DATA.date,
      islamicDay: ISLAMIC_DATA.day,
      parsiDate: PARSI_DATA.date,
      parsiDay: PARSI_DATA.day,
      rahukaal: rahukaal.label || "—",
      ayan: AYAN_DATA,
      weekday,
      dateStr,
      tithi,
      hinduPanchang: PANCHANG_HEADINGS.hinduPanchang,
      paksha: PANCHANG_HEADINGS.paksha,
    };
  }, [city, rahukaal.label, baseCards, weekday, selectedDate]);

  return (
    <MainGrid className="aapni-aaj-page relative">
      {/* જો કોઈ સ્ક્રીનશોટ કે સ્નિપિંગ ટૂલ ઓપન કરે અથવા પ્રિન્ટ સ્ક્રીન દબાવે તો આ બ્લુ કવર આવી જશે */}
      {isProtectedMaskActive && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-blue-600 text-white font-gu text-2xl font-bold">
          સુરક્ષા કારણોસર આ પેજનું સ્ક્રીનશોટ કે રેકોર્ડિંગ પ્રતિબંધિત છે.
        </div>
      )}

      {/* Page Title */}
      <div className="mb-5 sm:mb-6">
        <h1 className="font-gu text-2xl sm:text-3xl font-bold text-[#e48d0b] dark:text-ink-dark flex gap-x-3 items-center">
          આપની આજ
          <span className="flex items-center gap-0.5 mb-1">
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/100" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
            <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
          </span>
        </h1>
      </div>

      <AapniAajHero
        dateISO={dateISO}
        onDateChange={setDateISO}
        city={city}
        onCityChange={setCity}
        weekday={weekday}
        tithiHeading="અષાઢ સુદ પૂનમ"
      />

      <SkyCard cityData={cityData} />

      <SectionJumpers />

      <div id="panchang" tabIndex={-1} className={`mb-10 ${SECTION_SCROLL_CLASS}`}>
        <PanchangGrid data={panchangData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-6">
        <div className="flex flex-col gap-6">
          <div id="rashi" tabIndex={-1} className={SECTION_SCROLL_CLASS}>
            <RashiSection />
          </div>
          <div id="muhurat" tabIndex={-1} className={SECTION_SCROLL_CLASS}>
            <MuhuratSection />
          </div>
          <div id="history" tabIndex={-1} className={SECTION_SCROLL_CLASS}>
            <HistoryTodaySection />
          </div>
          <div id="grahan" tabIndex={-1} className={SECTION_SCROLL_CLASS}>
            <GrahanPanotiSection />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div id="jain" tabIndex={-1} className={SECTION_SCROLL_CLASS}>
            <JainTimingsSection
              sunriseMin={cityData.sunriseMin}
              sunsetMin={cityData.sunsetMin}
            />
          </div>
          <div id="choghadiya" tabIndex={-1} className={SECTION_SCROLL_CLASS}>
            <ChoghadiyaSection
              sunriseMin={cityData.sunriseMin}
              sunsetMin={cityData.sunsetMin}
            />
          </div>
          <div id="holidays" tabIndex={-1} className={SECTION_SCROLL_CLASS}>
            <HolidaysSection />
          </div>
          <div id="birthday" tabIndex={-1} className={SECTION_SCROLL_CLASS}>
            <BirthdayRashifalSection />
          </div>
        </div>
      </div>
    </MainGrid>
  );
}