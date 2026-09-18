export default function DownloadAppButton() {
  return (
    <a
  href="#download"
  title="એપ ડાઉનલોડ કરો"
  aria-label="એપ ડાઉનલોડ કરો"
  className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full
             text-black/95 dark:text-white
             active:bg-black/10 dark:active:bg-white/15 active:scale-90
             transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]
             cursor-pointer select-none"
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
        <rect x="6" y="2" width="12" height="20" rx="2.2" strokeWidth="2" />
        <path
          d="M12 9v6M9.2 12.2L12 15l2.8-2.8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}