import { useTheme } from "../../context/ThemeContext.jsx";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to day mode" : "Switch to night mode"}
      title={isDark ? "Day mode" : "Night mode"}
      className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full
             text-black/95 dark:text-white
             active:bg-black/10 dark:active:bg-white/15 active:scale-90
             transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]
             cursor-pointer select-none"
    >
      <div className="transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:rotate-45">
        {isDark ? (
          /* Sun / Day Icon */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
            <circle cx="12" cy="12" r="5" strokeWidth="2" />
            <path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          /* Moon / Night Icon */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
            <path
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </button>
  );
}