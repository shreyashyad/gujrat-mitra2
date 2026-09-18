import { Link, useLocation } from "react-router-dom";
import { beeps } from "../../data/beeps.js";
import { useBeepsDetail } from "../../context/BeepsDetailContext.jsx";

const BeepsIcon = ({ className, strokeWidth = 2 }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" strokeWidth={strokeWidth} />
  </svg>
);

const EpaperIcon = ({ className, strokeWidth = 2 }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="5" width="16" height="14" rx="1.5" strokeWidth={strokeWidth} />
    <path d="M8 9h8M8 12.5h8M8 16h5" strokeWidth={strokeWidth} />
  </svg>
);

const AajIcon = ({ className, strokeWidth = 2 }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="4" strokeWidth={strokeWidth} />
    <path
      d="M12 3v2M12 19v2M5 5l1.4 1.4M17.6 17.6L19 19M3 12h2M19 12h2M5 19l1.4-1.4M17.6 6.4L19 5"
      strokeWidth={strokeWidth}
    />
  </svg>
);

const VideoIcon = ({ className, strokeWidth = 2 }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3.5" y="6" width="17" height="12" rx="2" strokeWidth={strokeWidth} />
    <path d="M10.5 9.5l4.5 2.5-4.5 2.5v-5z" strokeWidth={strokeWidth} />
  </svg>
);

/* Original games icon — scaled into 24x24 so it never clips */
const GamesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <g transform="translate(4, 4)">
      <rect
        x="0.6"
        y="0.6"
        width="14.8"
        height="14.8"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect x="0" y="0" width="4" height="4" fill="currentColor" />
      <rect x="8" y="0" width="4" height="4" fill="currentColor" />
      <rect x="4" y="4" width="4" height="4" fill="currentColor" />
      <rect x="12" y="4" width="4" height="4" fill="currentColor" />
      <rect x="0" y="8" width="4" height="4" fill="currentColor" />
      <rect x="8" y="8" width="4" height="4" fill="currentColor" />
      <rect x="4" y="12" width="4" height="4" fill="currentColor" />
      <rect x="12" y="12" width="4" height="4" fill="currentColor" />
    </g>
  </svg>
);

const items = [
  { icon: BeepsIcon, label: "બીપ્સ", to: "/beeps", isBeeps: true },
  { icon: EpaperIcon, label: "ઈ-પેપર", to: "/epaper" },
  { icon: AajIcon, label: "આપની આજ", to: "/aapni-aaj", multiline: true },
  { icon: VideoIcon, label: "વિડિઓ", to: "/videos" },
  { icon: GamesIcon, label: "ગેમ્સ", to: "/games" },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { isOpen: beepsOpen, openBeeps } = useBeepsDetail();

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40
                 bg-white/60 dark:bg-[#1c1c1e]/60
                 backdrop-blur-2xl backdrop-saturate-150
                 border-t border-black/[0.04] dark:border-white/[0.08]
                 pb-[env(safe-area-inset-bottom)]"
      style={{
        WebkitBackdropFilter: "blur(28px) saturate(180%)",
        backdropFilter: "blur(28px) saturate(180%)",
      }}
    >
      <div className="grid grid-cols-5 h-[66px]">
        {items.map((item) => {
          const active = item.isBeeps ? beepsOpen : pathname === item.to;
          const Icon = item.icon;

          const content = (
            <>
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-visible">
                <Icon
                  className={`h-7 w-7 transition-colors duration-200 ${
                    active
                      ? "text-[#e48d0b] dark:text-[#e6c27a]"
                      : "text-black/45 dark:text-white/45"
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />
              </span>

              <span
                className={`mt-1 text-[13px] font-gu leading-tight px-0.5 transition-all duration-200 mt-1.5 ${
                  active
                    ? "font-semibold text-[#e48d0b] dark:text-[#e6c27a]"
                    : "font-medium text-black/45 dark:text-white/45"
                }`}
              >
                {item.multiline ? (
                  <>
                    આપની
                    આજ
                  </>
                ) : (
                  item.label
                )}
              </span>
            </>
          );

          // Beeps: page navigate karva ni jagya e direct modal open kare che.
          if (item.isBeeps) {
            return (
              <button
                key={item.to}
                type="button"
                onClick={() => openBeeps(0, beeps)}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-col items-center justify-center
                           text-center transition-all duration-200 active:scale-95
                           min-w-0 overflow-visible cursor-pointer"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center justify-center
                         text-center transition-all duration-200 active:scale-95
                         min-w-0 overflow-visible"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}