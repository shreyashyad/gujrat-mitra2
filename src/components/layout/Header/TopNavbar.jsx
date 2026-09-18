import { useState } from "react";
import { Link } from "react-router-dom";
import ExpandableSearch from "../../common/ExpandableSearch.jsx";
import LanguageDropdown from "../../common/LanguageDropdown.jsx";
import ThemeToggle from "../../common/ThemeToggle.jsx";
import DownloadAppButton from "../../common/DownloadAppButton.jsx";
import logo1 from "../../../assets/logo1.png";

export default function TopNavbar({ onMenuClick }) {
  const [logoError, setLogoError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="bg-white dark:bg-navbar-dark py-2.5 pt-3 sm:pt-5 px-2 md:px-0">
      {/* ===== Main row (logo + icons) ===== */}
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between gap-1.5 sm:h-22 sm:gap-2">
        {/* LEFT */}
        <div className="flex min-w-0 shrink items-center gap-1 sm:gap-5">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="મેનુ ખોલો"
            className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full
              text-ink/80 hover:bg-black/5 hover:text-ink
              dark:text-ink-dark/80 dark:hover:bg-white/5 dark:hover:text-ink-dark
              transition-all active:scale-90 duration-200 cursor-pointer select-none"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 sm:w-7 sm:h-7 text-black dark:text-white"
            >
              <path d="M3 6h18" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 12h18" strokeWidth="2" strokeLinecap="round" />
              <path d="M3 18h18" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          <Link
            to="/"
            className="flex items-center gap-2 min-w-0 transition-opacity active:opacity-75 duration-150"
          >
            {!logoError ? (
              <img
                src={logo1}
                alt="ગુજરાત મિત્ર"
                onError={() => setLogoError(true)}
                className="logo h-11 w-auto max-w-[clamp(7.5rem,42vw,14rem)] shrink object-contain sm:h-15 sm:max-w-none"
              />
            ) : (
              <span className="font-gu text-lg sm:text-2xl font-bold tracking-tight text-ink dark:text-ink-dark truncate">
                ગુજરાત મિત્ર
              </span>
            )}
          </Link>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-x-1.5 sm:gap-x-3">
          <ExpandableSearch
            variant="icon"
            label="શોધો"
            placeholder="અમારા મિત્રમાં શોધો..."
            open={searchOpen}
            onOpenChange={setSearchOpen}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            mobileExpandBelow   // ← only affects mobile
          />
          <LanguageDropdown />
          <ThemeToggle />
          <DownloadAppButton />
        </div>
      </div>

      {/* ===== MOBILE ONLY – full-width search row under logo ===== */}
      {searchOpen && (
        <div className="sm:hidden mx-auto w-full max-w-[1440px] px-3 pb-2.5 pt-1">
          <ExpandableSearch
            variant="icon"
            label="શોધો"
            placeholder="અમારા મિત્રમાં શોધો..."
            open={searchOpen}
            onOpenChange={setSearchOpen}
            query={searchQuery}
            onQueryChange={setSearchQuery}
            forceOpenBar
          />
        </div>
      )}
    </div>
  );
}