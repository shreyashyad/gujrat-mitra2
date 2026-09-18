import React from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Calendar, ScanSearch } from "lucide-react";
import {
  archiveEditions,
  currentEdition,
  epaperEditions,
  specialEditions,
} from "../../data/epaperData.js";
import EpaperAdvertisement from "./EpaperAdvertisement.jsx";

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

function gujaratiNumber(number) {
  return String(number).replace(/\d/g, (digit) => "૦૧૨૩૪૫૬૭૮૯"[digit]);
}

function formatSelectedDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const digits = (text) =>
    String(text).replace(/\d/g, (digit) => "૦૧૨૩૪૫૬૭૮૯"[digit]);
  return {
    date: `${digits(day)} ${gujaratiMonths[month - 1]} ${digits(year)}`,
    weekday: gujaratiWeekdays[date.getDay()],
  };
}

function downloadImage(src, filename) {
  const anchor = document.createElement("a");
  anchor.href = src;
  anchor.download = filename;
  anchor.click();
}

export default function EpaperReader() {
  const navigate = useNavigate();
  const { editionId = "surat" } = useParams();
  const [params] = useSearchParams();
  const dateInputRef = React.useRef(null);
  const scrollLockRef = React.useRef(null);
  const [selectedDate, setSelectedDate] = React.useState("2023-09-17");
  const requestedPage = Math.max(
    1,
    Math.min(currentEdition.pages.length, Number(params.get("page")) || 1),
  );
  const [page, setPage] = React.useState(requestedPage);
  const navScrollRef = React.useRef(null);

  const edition = [
    ...epaperEditions,
    ...archiveEditions,
    ...specialEditions,
  ].find((item) => item.id === editionId);
  const editionName = edition?.name || currentEdition.name;

  React.useEffect(() => setPage(requestedPage), [requestedPage]);

  React.useEffect(() => {
    if (!navScrollRef.current) return;
    const activeButton = navScrollRef.current.querySelector(`[data-page="${page}"]`);
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [page]);

  // Keep scroll position locked when page changes
  React.useLayoutEffect(() => {
    if (scrollLockRef.current == null) return;

    const y = scrollLockRef.current;
    const restore = () => window.scrollTo(0, y);

    restore();
    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
    });

    const t1 = setTimeout(restore, 0);
    const t2 = setTimeout(restore, 50);
    const t3 = setTimeout(() => {
      restore();
      scrollLockRef.current = null;
    }, 120);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [page]);

  const current = currentEdition.pages[page - 1];
  const formattedDate = formatSelectedDate(selectedDate);
  const totalPages = currentEdition.pages.length;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(`/epaper/preview/${editionId}`);
  };

  const selectPage = (number) => {
    const safePage = Math.max(1, Math.min(totalPages, number));
    if (safePage === page) return;

    scrollLockRef.current = window.scrollY;
    setPage(safePage);
    navigate(`/epaper/view/${editionId}?page=${safePage}`, {
      replace: true,
      preventScrollReset: true,
    });
  };
  
  return (
    <div className="w-full">
      {/* Ad */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <EpaperAdvertisement />
      </div>

      {/* Date bar */}
      <div
        className="mb-3 sm:mb-4 flex items-center justify-center
                   gap-3 sm:gap-5 md:gap-8
                   border-t border-black/10 pb-1 pt-2.5 sm:pt-3
                   text-[15px] sm:text-[17px] md:text-[19px]
                   font-bold text-ink dark:border-white/10 dark:text-ink-dark"
      >
        <div className="mb-4 flex items-center justify-center gap-8 border-t border-black/10 pb-1 pt-3 text-[19px] font-bold text-ink dark:border-white/10 dark:text-ink-dark max-[767px]:gap-3 max-[767px]:text-[17px]">
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
            {currentEdition.publishedLabel}
            <br />
            {currentEdition.publishedSubLabel}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mb-4 flex min-w-0 items-center gap-2 border-b border-black/8 pb-3 dark:border-white/10">
        <button
          type="button"
          onClick={handleBack}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/5 text-ink transition-colors hover:bg-[#e48d0b]/15 hover:text-[#e48d0b] dark:bg-white/10 dark:text-ink-dark"
          aria-label="પાછળ જાઓ"
        >
          <ArrowLeft size={18} />
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-1 items-center gap-1.5 truncate text-[15px] font-gu text-ink/60 dark:text-ink-dark/60 sm:text-[17px]"
        >
          <button
            type="button"
            onClick={() => navigate("/")}
            className="cursor-pointer font-medium transition-colors hover:text-[#e48d0b]"
          >
            હોમ
          </button>
          <ChevronRight size={14} className="shrink-0 opacity-50" />
          <button
            type="button"
            onClick={() => navigate("/epaper")}
            className="cursor-pointer font-medium transition-colors hover:text-[#e48d0b]"
          >
            ઈ-પેપર
          </button>
          <ChevronRight size={14} className="shrink-0 opacity-50" />
          <button
            type="button"
            onClick={() => navigate(`/epaper/preview/${editionId}`)}
            className="cursor-pointer font-medium text-ink/80 dark:text-ink-dark/80 transition-colors hover:text-[#e48d0b]"
          >
            {editionName}
          </button>
          <ChevronRight size={14} className="shrink-0 opacity-50" />
          <span
            className="max-w-[140px] truncate font-semibold text-[#e48d0b] sm:max-w-[220px]"
            aria-current="page"
          >
            પાનું {gujaratiNumber(page)}
          </span>
        </nav>
      </div>

      {/* Page number nav — Prev / ALL numbers / Next (scroll on small screen) */}
      <div
        className="mb-3 sm:mb-4 grid
                   grid-cols-[88px_minmax(0,1fr)] gap-2
                   sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-3
                   md:grid-cols-[140px_minmax(0,1fr)] md:gap-5
                   lg:grid-cols-[154px_minmax(0,1fr)] lg:gap-7"
      >
        <div />
        <nav
          ref={navScrollRef}
          aria-label="ઈ-પેપર પેજ નેવિગેશન"
          className="flex min-w-0 max-w-full overflow-x-auto rounded-md
                     border border-black/10 bg-white
                     dark:border-white/10 dark:bg-[#121212]
                     [scrollbar-width:thin]
                     [scrollbar-color:rgba(0,0,0,0.25)_transparent]"
        >
          <button
            type="button"
            className="sticky left-0 z-[1] shrink-0 border-r border-black/10 bg-white px-1.5 sm:px-2 py-1
                       font-gu text-[15px] sm:text-[17px] font-semibold text-[#2d6da3]
                       disabled:cursor-not-allowed disabled:text-neutral-400
                       dark:border-white/10 dark:bg-[#121212]"
            onClick={() => selectPage(page - 1)}
            disabled={page === 1}
          >
            પાછું
          </button>

          {currentEdition.pages.map((item) => (
            <button
              key={item.number}
              data-page={item.number} // આ એટ્રિબ્યુટ ઉમેરવું જરૂરી છે
              type="button"
              className={`shrink-0 border-r border-black/10 px-2 sm:px-2.5 py-1
                          font-gu text-[15px] sm:text-[17px] font-semibold dark:border-white/10 ${
                            page === item.number
                              ? "bg-[#e48d0b] text-white"
                              : "text-[#2d6da3]"
                          }`}
              onClick={() => selectPage(item.number)}
              aria-current={page === item.number ? "page" : undefined}
            >
              {gujaratiNumber(item.number)}
            </button>
          ))}

          <button
            type="button"
            className="sticky right-0 z-[1] shrink-0 bg-white px-1.5 sm:px-2 py-1
                       font-gu text-[15px] sm:text-[17px] font-semibold text-[#2d6da3]
                       disabled:cursor-not-allowed disabled:text-neutral-400
                       dark:bg-[#121212]"
            onClick={() => selectPage(page + 1)}
            disabled={page === totalPages}
          >
            આગળ
          </button>
        </nav>
      </div>

      {/* Main: side rail + viewer */}
      <div
        className="mx-auto grid items-start
                   grid-cols-[88px_minmax(0,1fr)] gap-2
                   sm:grid-cols-[120px_minmax(0,1fr)] sm:gap-3
                   md:grid-cols-[140px_minmax(0,1fr)] md:gap-5
                   lg:grid-cols-[154px_minmax(0,1fr)] lg:gap-7"
      >
        {/* Side thumbnail rail */}
        <div
          className="flex min-h-0 flex-col gap-2 overflow-y-auto overflow-x-hidden
                     rounded-lg border border-black/10 bg-white/90 p-1.5 shadow-inner
                     [scrollbar-color:rgba(184,122,22,.45)_transparent] [scrollbar-width:thin]
                     dark:border-white/10 dark:bg-[#121212]
                     h-[420px] max-h-[420px]
                     sm:h-[520px] sm:max-h-[520px] sm:rounded-xl sm:p-2 sm:gap-3
                     md:h-[640px] md:max-h-[640px]
                     lg:h-[800px] lg:max-h-[800px]"
        >
          {currentEdition.pages.map((item) => (
            <button
              key={item.number}
              type="button"
              className={`group shrink-0 cursor-pointer overflow-hidden
                          rounded-md sm:rounded-lg
                          border-0 bg-transparent p-0 text-center shadow-sm
                          transition-transform hover:-translate-y-0.5 ${page === item.number
                  ? "ring-2 ring-[#e11d3f] ring-offset-1 sm:ring-offset-2 ring-offset-surface dark:ring-offset-surface-dark"
                  : ""
                }`}
              onClick={() => selectPage(item.number)}
            >
              <img
                src={item.image}
                alt={`પેજ ${gujaratiNumber(item.number)}`}
                className="block h-auto w-full bg-white object-contain
                           transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <span
                className="block bg-white py-1 sm:py-1.5 md:py-2
                           text-[14px] sm:text-sm md:text-lg lg:text-[xl]
                           font-bold leading-none text-black
                           underline decoration-[#f21f3d] decoration-2
                           underline-offset-2 sm:underline-offset-4 md:underline-offset-8
                           dark:bg-[#121212] dark:text-white"
              >
                પાનું {gujaratiNumber(item.number)}
              </span>
            </button>
          ))}
        </div>

        {/* Main viewer */}
        <div
          className="text-center
                     p-0 rounded-none border-0 shadow-none bg-transparent
                     sm:rounded-2xl sm:border sm:border-gray-200/70
                     sm:bg-white sm:p-3
                     sm:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
                     md:rounded-3xl md:p-7
                     dark:sm:border-white/10 dark:sm:bg-[#121212]"
        >
          {/* Row: Page number (left) + ZOOM (right) */}
          <div className="flex items-center justify-between">
            <span className="font-gu text-[18px] font-semibold text-ink sm:text-[20px] dark:text-ink-dark">
              પાનું {gujaratiNumber(page)}
            </span>

            <button
              type="button"
              className="cursor-pointer rounded-md border-0 bg-[#e48d0b]
                         px-2 sm:px-3 py-0.5 sm:py-1
                         font-gu text-[15px] sm:text-[17px]
                         font-bold text-white transition-colors hover:bg-[#d58f28]"
              onClick={() =>
                navigate(`/epaper/fullscreen/${editionId}/${page}`)
              }
            >
              <div className="flex items-center gap-2">
                <ScanSearch className="w-4 h-4 md:w-[25px] md:h-[25px]" />
                <p>ઝૂમ</p>
              </div>
            </button>
          </div>

          <img
            src={current.image}
            alt={`ગુજરાતમિત્ર ઈ-પેપર પેજ ${gujaratiNumber(page)}`}
            className="mx-auto mt-2 sm:mt-3 block h-auto w-full
                       max-w-full sm:max-w-[464px]
                       rounded-lg sm:rounded-2xl
                       shadow-[0_1px_3px_rgba(0,0,0,.08)]"
          />

          <div className="mt-1.5 sm:mt-1 flex flex-wrap justify-end gap-1 sm:gap-2">
            <button
              type="button"
              className="cursor-pointer rounded-full border border-[#e5b900] bg-white
                         px-1.5 sm:px-2.5 py-0.5
                         font-gu text-[10px] sm:text-[13px] font-bold text-black"
              onClick={() =>
                downloadImage(current.image, `gujaratmitra-page-${page}.png`)
              }
            >
              ◉ ડાઉનલોડ
            </button>
            <button
              type="button"
              className="cursor-pointer rounded-full border border-[#e5b900] bg-white
                         px-1.5 sm:px-2.5 py-0.5
                         font-gu text-[10px] sm:text-[13px] font-bold text-black"
              onClick={() => window.print()}
            >
              ◉ સંપૂર્ણ PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}