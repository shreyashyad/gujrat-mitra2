import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronRight, ArrowLeft, Calendar, BookOpen } from "lucide-react";
import {
  archiveEditions,
  currentEdition,
  epaperEditions,
  specialEditions,
} from "../../data/epaperData.js";
import EpaperAdvertisement from "./EpaperAdvertisement.jsx";

const gujaratiMonths = [
  "જાન્યુઆરી", "ફેબ્રુઆરી", "માર્ચ", "એપ્રિલ", "મે", "જૂન",
  "જુલાઈ", "ઓગસ્ટ", "સપ્ટેમ્બર", "ઓક્ટોબર", "નવેમ્બર", "ડિસેમ્બર",
];
const gujaratiWeekdays = [
  "રવિવાર", "સોમવાર", "મંગળવાર", "બુધવાર", "ગુરુવાર", "શુક્રવાર", "શનિવાર",
];

function formatSelectedDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const gujaratiDigits = (text) => String(text).replace(/\d/g, (digit) => "૦૧૨૩૪૫૬૭૮૯"[digit]);
  return {
    date: `${gujaratiDigits(day)} ${gujaratiMonths[month - 1]} ${gujaratiDigits(year)}`,
    weekday: gujaratiWeekdays[date.getDay()],
  };
}

function gujaratiNumber(number) {
  return String(number).replace(/\d/g, (digit) => "૦૧૨૩૪૫૬૭૮૯"[digit]);
}

function PreviewGrid({ onSelect }) {
  return (
    <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
      {currentEdition.pages.map((page, index) => (
        <React.Fragment key={page.number}>
          <button
            type="button"
            className="group relative min-w-0 cursor-pointer border-0 bg-transparent p-0 transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985]"
            onClick={() => onSelect(index)}
            aria-label={`પેજ ${index + 1} ખોલો`}
          >
            <img
              src={page.thumbnail}
              alt={`પેજ ${index + 1}`}
              className="block aspect-[206/150] h-auto w-full rounded-2xl object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            <span
              className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-tl-xl bg-[#FFEE8C] text-xl font-bold leading-none text-black shadow-sm sm:h-11 sm:w-11 sm:text-2xl"
              aria-hidden="true"
            >
              {gujaratiNumber(index + 1)}
            </span>
          </button>
          {(index === 3 || index === 7) && (
            <div className="col-span-full mx-auto grid h-16 w-full max-w-[720px] place-items-center rounded-2xl border border-black/5 bg-black/[0.03] text-xs font-gu text-ink/50 dark:border-white/10 dark:bg-white/[0.03] dark:text-ink-dark/50 sm:h-20 sm:text-sm">
              જાહેરાત / Advertisement
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function EpaperPreviewer() {
  const navigate = useNavigate();
  const { editionId = "surat" } = useParams();
  const dateInputRef = React.useRef(null);
  const [selectedDate, setSelectedDate] = React.useState("2023-09-17");
  const formattedDate = formatSelectedDate(selectedDate);
  const goReader = (page = 0) =>
    navigate(`/epaper/view/${editionId}?page=${page + 1}`);
  const edition = [
    ...epaperEditions,
    ...archiveEditions,
    ...specialEditions,
  ].find((item) => item.id === editionId);
  const title = edition?.name || currentEdition.name;

  return (
    <div className="w-full">
      <div className="mb-6">
        <EpaperAdvertisement />
      </div>

      <div className="mb-4 flex items-center justify-center gap-8 border-t border-black/10 pb-1 pt-3 text-[19px] font-bold text-ink dark:border-white/10 dark:text-ink-dark max-[767px]:gap-3 max-[767px]:text-[17px]">
        <div className="flex items-center gap-2.5 leading-[1.15] text-center">
          <strong>{formattedDate.date}<br />{formattedDate.weekday}</strong>
          <button
            type="button"
            className="relative grid h-[30px] w-[30px] cursor-pointer place-items-center border rounded font-sans text-xs"
            onClick={() => dateInputRef.current?.showPicker?.()}
            aria-label="તારીખ પસંદ કરો"
          >
            <Calendar />
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label="તારીખ પસંદ કરો"
            />
          </button>
        </div>
        <div className="leading-[1.15] text-neutral-500">
          {currentEdition.publishedLabel}<br />{currentEdition.publishedSubLabel}
        </div>
      </div>

      <section>
        <div className="rounded-3xl border border-gray-200/70 bg-white p-7 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#121212]">
          
          {/* Breadcrumb */}
          <div className="mb-3 flex min-w-0 items-center gap-1.5 border-b border-black/8 pb-3 sm:mb-4 sm:gap-2 dark:border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/5 text-ink transition-colors hover:bg-[#e48d0b]/15 hover:text-[#e48d0b] sm:h-9 sm:w-9 dark:bg-white/10 dark:text-ink-dark"
              aria-label="પાછળ જાઓ"
            >
              <ArrowLeft size={16} className="sm:h-[18px] sm:w-[18px]" />
            </button>

            <nav
              aria-label="Breadcrumb"
              className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden font-gu text-[13px] text-ink/60 sm:gap-1.5 sm:text-[15px] md:text-[17px] dark:text-ink-dark/60"
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                className="shrink-0 cursor-pointer font-medium transition-colors hover:text-[#e48d0b]"
              >
                હોમ
              </button>
              <ChevronRight size={14} className="shrink-0 opacity-50" />
              <button
                type="button"
                onClick={() => navigate("/epaper")}
                className="cursor-pointer font-medium text-ink/80 transition-colors hover:text-[#e48d0b] dark:text-ink-dark/80"
              >
                ઈ-પેપર
              </button>
              <ChevronRight size={14} className="shrink-0 opacity-50" />
              <span
                className="min-w-0 truncate font-semibold text-[#e48d0b]"
                aria-current="page"
                title={title}
              >
                {title}
              </span>
            </nav>
          </div>
          <PreviewGrid onSelect={goReader} />
        </div>
      </section>
    </div>
  );
}