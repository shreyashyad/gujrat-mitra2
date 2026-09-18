import { useState, useLayoutEffect, useRef } from "react";
import { NavLink, Link } from "react-router-dom";
import { sidebarCategories } from "../../../data/sidebarCategories.js";
import CategoryDropdown from "../../common/CategoryDropdown.jsx";
import logo2 from "../../../assets/logo2.png";

export default function CategoryNavbar({ isScrolled, onMenuClick }) {
  const categoriesOnly = sidebarCategories.filter((c) => !c.home);
  const [visibleCount, setVisibleCount] = useState(categoriesOnly.length);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const measureRef = useRef(null);
  const homeRef = useRef(null);

  // Track mobile breakpoint (<768px)
  useLayoutEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;

    const calculateVisibleItems = () => {
      if (!containerRef.current || !measureRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const HOME_WIDTH = homeRef.current?.offsetWidth ?? 56;
      const MORE_BTN_WIDTH = 80;
      const LOGO_WIDTH = isScrolled ? 100 : 0;
      const MENU_WIDTH = isScrolled ? 36 : 0;

      let availableWidth = containerWidth - HOME_WIDTH - LOGO_WIDTH - MENU_WIDTH;

      const items = Array.from(measureRef.current.children);
      let totalWidth = 0;
      items.forEach((item) => {
        totalWidth += item.offsetWidth;
      });

      if (totalWidth <= availableWidth) {
        setVisibleCount(items.length);
        return;
      }

      availableWidth -= MORE_BTN_WIDTH;
      let currentWidth = 0;
      let count = 0;

      for (const item of items) {
        if (currentWidth + item.offsetWidth > availableWidth) break;
        currentWidth += item.offsetWidth;
        count++;
      }

      setVisibleCount(Math.max(count, 0));
    };

    calculateVisibleItems();

    const observer = new ResizeObserver(() => calculateVisibleItems());
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [isScrolled, isMobile]);

  const visible = categoriesOnly.slice(0, visibleCount);
  const overflow = categoriesOnly.slice(visibleCount);

  // Desktop + scrolled = logo/menu show
  const showLogoMenu = isScrolled && !isMobile;

  return (
    <div
      className={`relative flex w-full min-w-0 justify-center overflow-hidden border-black/5 select-none dark:border-white/5 transition-all duration-300 ease-out  ${isMobile ? "pl-0 mx-0" : "pl-2 mx-[-10px]"
        } ${isScrolled ? "pt-2.5 pb-1.5" : "py-0.5"}`}
    >
      {/* Hidden measurement — only needed for desktop calc */}
      <div
        ref={measureRef}
        className="pointer-events-none absolute left-0 top-0 h-0 w-0 overflow-hidden opacity-0 invisible -z-50"
        aria-hidden="true"
      >
        {categoriesOnly.map((cat) => (
          <div key={cat.slug} className="flex shrink-0 items-center">
            <span
              style={{ fontFamily: "'Hind Vadodara', sans-serif" }}
              className="flex h-8 items-center whitespace-nowrap px-2 text-[15px] font-semibold sm:px-2.5 sm:text-[17px]"
            >
              {cat.name}
            </span>
            <span className="mx-0.5 text-base">|</span>
          </div>
        ))}
      </div>

      <div className="flex h-[42px] w-full max-w-[1440px] min-w-0 items-center px-0 gap-2 ml-[-12px]">
        {/* max-w-0 + w-0 + overflow-hidden + opacity-0 = zero space when collapsed */}
        <div
          className={`flex shrink-0 items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${showLogoMenu
            ? "max-w-[150px] w-auto opacity-100"
            : "max-w-0 w-0 opacity-0 pointer-events-none"
            }`}
        >
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logo2}
              alt="ગુજરાત મિત્ર"
              className="h-10 w-auto shrink-0 object-contain"
            />
          </Link>
        </div>

        {/* ===== Home + Categories ===== */}
        <div
          ref={containerRef}
          className="relative flex h-full min-w-0 flex-1 items-center overflow-hidden"
        >
          {/* Home button */}
          <NavLink
            ref={homeRef}
            to="/"
            end
            aria-label="હોમ"
            title="હોમ"
            className="group relative z-20 flex h-full w-12 shrink-0 items-center justify-center transition-all duration-300 active:scale-95 sm:w-14"
          >
            <div
              className="absolute inset-0 bg-[#FFC107] hover:bg-[#FFC107] transition-all duration-300 dark:bg-neutral-800 dark:hover:bg-neutral-700"
              style={{
                clipPath: "polygon(0 0, 100% 0, 75% 100%, 0 100%)",
              }}
            />
            <div className="relative z-10 ml-[-6px] flex items-center justify-center sm:ml-[-8px]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5.5 w-5.5 sm:h-6.5 sm:w-6.5 text-black dark:text-white transition-all duration-300"
              >
                <path
                  d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 11-1.06 1.06l-8.69-8.69a.25.25 0 00-.354 0l-8.69 8.69a.75.75 0 01-1.06-1.06l8.69-8.69z"
                  fill="currentColor"
                />
                <path
                  d="M12 5.43l7.5 7.5v6.32a1.75 1.75 0 01-1.75 1.75H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V20.25a.75.75 0 01-.75.75H6.25A1.75 1.75 0 014.5 19.25v-6.32L12 5.43z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </NavLink>

          {isMobile ? (
            /* ===== MOBILE (<768px) ===== */
            <div className="relative z-10 -ml-0 flex h-full min-w-0 flex-1 items-center overflow-hidden ml-[-12px]">
              <div
                className="absolute inset-0 bg-[#fdf6e3] dark:bg-[#0d0d0d]"
                style={{
                  clipPath: "polygon(12px 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />
              <div className="relative z-10 flex h-full w-full min-w-0 items-center overflow-x-auto no-scrollbar py-0 pl-3 pr-3">
                {categoriesOnly.map((cat, i) => (
                  <div key={cat.slug} className="flex shrink-0 items-center">
                    <NavLink
                      to={`/category/${cat.slug}`}
                      style={{ fontFamily: "'Hind Vadodara', sans-serif" }}
                      className={({ isActive }) =>
                        `flex h-6 items-center whitespace-nowrap px-2 transition-all duration-200 active:scale-95 text-[14.5px] ${isActive
                          ? "font-bold text-[#e48d0b]"
                          : "font-semibold text-black/90 dark:text-white"
                        }`
                      }
                    >
                      {cat.name}
                    </NavLink>
                    {i < categoriesOnly.length - 1 && (
                      <span className="mx-0.5 select-none text-black/20 dark:text-white/20">
                        |
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Menu button — mobile માં ક્યારેય ન દેખાય */}
              <div
                className={`flex shrink-0 items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${showLogoMenu
                  ? "max-w-[40px] w-auto opacity-100 ml-1 pr-3"
                  : "max-w-0 w-0 opacity-0 ml-0 pr-0 pointer-events-none"
                  }`}
              >
                <button
                  type="button"
                  onClick={onMenuClick}
                  aria-label="મેનુ ખોલો"
                  className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                       text-black hover:bg-black/5 hover:text-ink
                       dark:text-ink-dark/80 dark:hover:bg-white/5 dark:hover:text-ink-dark
                       transition-all active:scale-90 duration-200 cursor-pointer select-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-7 h-7 text-black dark:text-white"
                  >
                    <path d="M3 6h18" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M3 12h18" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M3 18h18" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            /* ===== DESKTOP (>=768px) ===== */
            <div className="relative z-10 -ml-4 flex h-full min-w-0 flex-1 items-center overflow-hidden sm:-ml-5">
              <div
                className="absolute inset-0 bg-[#fdf6e3] dark:bg-[#0d0d0d]"
                style={{
                  clipPath: "polygon(16px 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />

              <div className="relative z-10 flex h-full min-w-0 w-full items-center overflow-hidden py-0 sm:py-1 pl-4 pr-1 sm:pl-5 sm:pr-2">
                <div className="flex min-w-0 items-center overflow-hidden">
                  {visible.map((cat, i) => (
                    <div key={cat.slug} className="flex shrink-0 items-center">
                      <NavLink
                        to={`/category/${cat.slug}`}
                        style={{ fontFamily: "'Hind Vadodara', sans-serif" }}
                        className={({ isActive }) =>
                          `flex h-6 sm:h-8 items-center whitespace-nowrap px-2 transition-all duration-200 active:scale-95 sm:px-2.5 text-[15px] sm:text-[17px] ${isActive
                            ? "font-bold text-[#e48d0b]"
                            : "font-semibold text-black/90 hover:opacity-100 dark:text-white"
                          }`
                        }
                      >
                        {cat.name}
                      </NavLink>
                      {i < visible.length - 1 && (
                        <span className="mx-0.5 select-none text-black/20 dark:text-white/20">
                          |
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {overflow.length > 0 && (
                  <div className="relative z-[100] flex shrink-0 items-center">
                    <span className="mx-0.5 select-none text-black/20 dark:text-white/20">
                      |
                    </span>
                    <CategoryDropdown items={overflow} />
                  </div>
                )}
              </div>

              {/* Menu button — desktop scrolled only */}
              <div
                className={`flex shrink-0 items-center overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${showLogoMenu
                  ? "max-w-[40px] w-auto opacity-100 ml-1 pr-3"
                  : "max-w-0 w-0 opacity-0 ml-0 pr-0 pointer-events-none"
                  }`}
              >
                <button
                  type="button"
                  onClick={onMenuClick}
                  aria-label="મેનુ ખોલો"
                  className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full
                       text-black hover:bg-black/5 hover:text-ink
                       dark:text-ink-dark/80 dark:hover:bg-white/5 dark:hover:text-ink-dark
                       transition-all active:scale-90 duration-200 cursor-pointer select-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="w-7 h-7 text-black dark:text-white"
                  >
                    <path d="M3 6h18" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M3 12h18" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M3 18h18" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}