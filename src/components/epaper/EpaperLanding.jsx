import React from "react";
import { useNavigate } from "react-router-dom";
import {
  currentEdition,
  epaperEditions,
  archiveEditions,
  specialEditions,
} from "../../data/epaperData.js";
import EpaperAdvertisement from "./EpaperAdvertisement.jsx";
import {Calendar} from 'lucide-react'

const dots = (
  <span className="flex items-center gap-0.5 mb-0.5">
    <span className="h-2 w-2 rounded-full bg-[#D61F26]/100" />
    <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
    <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
    <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
  </span>
);

const gujaratiMonths = [
  "જાન્યુઆરી",
  "ફેબ્રુઆરી",
  "માર્ચ",
  "એપ્રિલ",
  "મે",
  "જૂન",
  "જુલાઈ",
  "ઓગસ્ટ",
  "સપ્ટેમ્બર",
  "ઓક્ટોબર",
  "નવેમ્બર",
  "ડિસેમ્બર",
];
const gujaratiWeekdays = [
  "રવિવાર",
  "સોમવાર",
  "મંગળવાર",
  "બુધવાર",
  "ગુરુવાર",
  "શુક્રવાર",
  "શનિવાર",
];
const localGujaratiTithis = {
  "2023-09-17": "ભાદરવા સુદ બીજ",
  "2023-09-18": "ભાદરવા સુદ ત્રીજ",
  "2023-09-19": "ભાદરવા સુદ ચોથ",
  "2023-09-20": "ભાદરવા સુદ પાંચમ",
  "2023-09-21": "ભાદરવા સુદ છઠ",
  "2023-09-22": "ભાદરવા સુદ સાતમ",
  "2023-09-23": "ભાદરવા સુદ આઠમ",
  "2023-09-24": "ભાદરવા સુદ નોમ",
  "2023-09-25": "ભાદરવા સુદ દશમ",
  "2023-09-26": "ભાદરવા સુદ અગિયારસ",
  "2023-09-27": "ભાદરવા સુદ બારસ",
  "2023-09-28": "ભાદરવા સુદ તેરસ",
  "2023-09-29": "ભાદરવા સુદ ચૌદસ",
  "2023-09-30": "ભાદરવા સુદ પૂનમ",
};

function toGujaratiDigits(value) {
  return String(value).replace(/\d/g, (digit) => "૦૧૨૩૪૫૬૭૮૯"[digit]);
}

function formatSelectedDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return {
    date: `${toGujaratiDigits(day)} ${gujaratiMonths[month - 1]} ${toGujaratiDigits(year)}`,
    weekday: gujaratiWeekdays[date.getDay()],
    monthYear: `${gujaratiMonths[month - 1]} ${toGujaratiDigits(year)}`,
    tithi: localGujaratiTithis[value] || "મહા સુદ બારસ",
  };
}

function Section({ title, items, variant = "", titleInside = false }) {
  const navigate = useNavigate();
  const cardColor = variant === "special" ? "bg-[#F3ECE2]/80" : "bg-white";

  const openEdition = (editionId) => {
    const scrollY = Math.max(
      window.scrollY || window.pageYOffset || 0,
      document.documentElement.scrollTop || 0,
      document.body.scrollTop || 0
    );
    window.sessionStorage.setItem("page-scroll:/epaper", String(scrollY));
    navigate(`/epaper/preview/${editionId}`);
  };
  // const cardColor = variant === "special" ? "bg-[#fff8e7]/80" : "bg-white";

  return (
    <section>
      {!titleInside && (
        <h2 className="mb-4 flex items-center gap-1 border-b border-black/5 pb-2 text-lg font-bold text-[#e48d0b] dark:border-white/10 dark:text-[#e48d0b] sm:text-xl">
          {title}
          {dots}
        </h2>
      )}
      <div
        className={`rounded-3xl border border-gray-200/70 ${cardColor} p-7 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-[#121212] ${variant}`}
      >
        {titleInside && (
          <h2 className="mb-4 flex items-center gap-1 border-b border-black/5 pb-2 text-[26px] font-bold text-[#e48d0b] dark:border-white/10 dark:text-[#e48d0b]">
            {title}
            {dots}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className="group min-w-0 cursor-pointer border-0 bg-transparent p-0 text-center font-inherit text-ink transition-all duration-300 ease-out hover:-translate-y-0.5 active:scale-[0.985] dark:text-ink-dark"
              onClick={() => openEdition(item.id)}
              aria-label={`${item.name} ઈ-પેપર ખોલો`}
            >
              <img
                src={item.image}
                alt=""
                className="block aspect-[206/150] h-auto w-full rounded-2xl object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
              <span className="mt-2 block min-h-[48px] text-[20px] md:text-[22px] lg:text-[26px] font-semibold leading-[1.2]">
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function EpaperLanding() {
  const dateInputRef = React.useRef(null);
  const [selectedDate, setSelectedDate] = React.useState("2023-09-17");
  const formattedDate = formatSelectedDate(selectedDate);

  return (
    <div className=" flex w-full flex-col gap-6 text-ink dark:text-[var(--color-ink-dark)]">
      <EpaperAdvertisement />
      <div className="flex items-center justify-center gap-8 border-t border-black/10 pb-1 pt-3 text-[19px] font-bold text-ink dark:border-white/10 dark:text-ink-dark max-[767px]:gap-3 max-[767px]:text-[17px]">
        <div className="flex items-center gap-2.5 leading-[1.15] text-center">
          <strong>
            {formattedDate.date}
            <br />
            {formattedDate.weekday}
          </strong>
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
          {formattedDate.monthYear}
          <br />
          {formattedDate.tithi}
        </div>
      </div>
      <Section title="એડીશન" items={epaperEditions} titleInside />
      <Section
        title="પૂર્તી"
        items={archiveEditions}
        variant="archive"
        titleInside
      />
      <Section
        title="સ્પેશિયલ ઓડીશન"
        items={specialEditions}
        variant="special"
        titleInside
      />
    </div>
  );
}
