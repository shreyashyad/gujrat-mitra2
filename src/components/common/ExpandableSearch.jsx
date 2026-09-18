import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const CustomSearchIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="11" cy="11" r="7" strokeWidth="2.5" />
    <path d="M21 21l-4.3-4.3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function ExpandableSearch({
  variant = "icon",
  label,
  placeholder = "શોધો...",
  widthClass = "w-48 sm:w-64",
  triggerWidthClass,
  open: controlledOpen,
  onOpenChange,
  query: controlledQuery,
  onQueryChange,
  mobileExpandBelow = false,
  forceOpenBar = false,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const query = controlledQuery !== undefined ? controlledQuery : internalQuery;

  const setOpen = (v) => {
    if (isControlled) onOpenChange?.(v);
    else setInternalOpen(v);
  };
  const setQuery = (v) => {
    if (controlledQuery !== undefined) onQueryChange?.(v);
    else setInternalQuery(v);
  };

  const collapsedWidth = triggerWidthClass || widthClass;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search:", query);
  };

  /* ---------- Mobile second-row bar ---------- */
  if (forceOpenBar) {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex w-full items-center gap-2 rounded-full border border-gray-300/80
                   bg-white px-3.5 h-10
                   dark:bg-navbar-dark dark:border-white/20 shadow-sm"
      >
        <CustomSearchIcon className="w-4 h-4 shrink-0 text-gray-500 dark:text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-gu text-ink placeholder:text-gray-400
                     outline-none border-none dark:text-ink-dark dark:placeholder:text-gray-500"
        />
        <button
          type="button"
          onClick={() => {
            setQuery("");
            setOpen(false);
          }}
          aria-label="Close search"
          className="shrink-0 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white
                     active:scale-90 transition-all duration-150 cursor-pointer"
        >
          <X size={18} />
        </button>
      </form>
    );
  }

  /* ---------- Normal icon + desktop expand ---------- */
  return (
    <div
      ref={containerRef}
      className={`
        relative flex items-center justify-end
        ${
          open
            ? mobileExpandBelow
              ? "w-8 sm:w-64"          // mobile stays icon size, desktop expands
              : widthClass             // original desktop expand
            : variant === "button"
              ? collapsedWidth
              : "w-8 sm:w-9"
        }
        transition-[width] duration-300
        ease-[cubic-bezier(0.32,0.72,0,1)]
      `}
    >
      {/* OPEN FORM – desktop only when mobileExpandBelow */}
      <div
        className={`
          absolute right-0 top-1/2 -translate-y-1/2 w-full
          ${
            open
              ? mobileExpandBelow
                ? "invisible opacity-0 scale-95 pointer-events-none sm:visible sm:opacity-100 sm:scale-100 sm:pointer-events-auto"
                : "visible opacity-100 scale-100 pointer-events-auto"
              : "invisible opacity-0 scale-95 pointer-events-none"
          }
          transition-all duration-300
          ease-[cubic-bezier(0.32,0.72,0,1)]
        `}
      >
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-full border border-gray-300/80
                     bg-white px-3.5 h-9
                     dark:bg-navbar-dark dark:border-white/20
                     transition-all duration-200 shadow-sm"
        >
          <CustomSearchIcon className="w-4 h-4 shrink-0 text-gray-500 dark:text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent text-sm font-gu text-ink placeholder:text-gray-400
                       outline-none border-none dark:text-ink-dark dark:placeholder:text-gray-500"
          />
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            aria-label="Close search"
            className="shrink-0 text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white
                       active:scale-90 transition-all duration-150 cursor-pointer"
          >
            <X size={16} />
          </button>
        </form>
      </div>

      {/* COLLAPSED ICON */}
      <div
        className={`
          absolute right-0 top-1/2 -translate-y-1/2
          ${
            open
              ? mobileExpandBelow
                ? "pointer-events-auto opacity-100 scale-100 sm:pointer-events-none sm:opacity-0 sm:scale-95"
                : "pointer-events-none opacity-0 scale-95"
              : "pointer-events-auto opacity-100 scale-100"
          }
          transition-all duration-300
          ease-[cubic-bezier(0.32,0.72,0,1)]
        `}
      >
        {variant === "button" ? (
          <div className={collapsedWidth}>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={label}
              title={label}
              className="flex w-full items-center justify-center gap-1.5 rounded-full h-9 px-2.5 sm:px-3
                         bg-white backdrop-blur-md text-sm font-gu font-medium text-ink/80
                         hover:text-ink active:scale-95 transition-all duration-200
                         dark:bg-navbar-dark/80 dark:text-ink-dark/80 dark:hover:text-ink-dark shadow-xs cursor-pointer"
            >
              <CustomSearchIcon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline truncate">{label}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={label || "Search"}
            title={label || "Search"}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full
                       text-black dark:text-white
                       active:bg-black/10 dark:active:bg-white/15 active:scale-90
                       transition-all duration-200 cursor-pointer select-none"
          >
            <CustomSearchIcon className="w-5 h-5 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>
    </div>
  );
}