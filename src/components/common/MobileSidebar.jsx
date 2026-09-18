// src/components/common/MobileSidebar.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { sidebarCategories } from "../../data/sidebarCategories.js";
import { useFontScale } from "../../context/FontScaleContext.jsx";
import SocialIcons from "./SocialIcons.jsx";

export default function MobileSidebar({ open, onClose }) {
  const {
    fontSize,
    decreaseFont,
    increaseFont,
    canDecrease,
    canIncrease,
  } = useFontScale();

  const [mounted, setMounted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const toGujaratiNumeral = (num) => {
    const gujaratiDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
    return num
      .toString()
      .split("")
      .map((digit) => gujaratiDigits[parseInt(digit, 10)] || digit)
      .join("");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    alert("તમારો પ્રતિભાવ મોકલવામાં આવ્યો છે. આભાર!");
    setFeedbackText("");
    setShowFeedback(false);
  };

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-60 bg-black/40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar Sheet */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed inset-y-0 left-0 z-60 w-[340px] max-w-[85vw] flex flex-col bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 text-sm font-semibold select-none">
          {/* Profile */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E59E38] text-white text-2xl font-extrabold shadow-sm">
              વ
            </div>
            <div>
              <h3 className="text-xl font-medium text-black dark:text-white leading-tight">
                વાચક
              </h3>
              <p className="text-md text-neutral-400 font-normal">
                reader@gujaratmitra.in
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[17px] font-medium text-[#E59E38]">
            <button
              type="button"
              className="flex items-center gap-1 hover:underline cursor-pointer"
            >
              🔑 લોગિન કરો
            </button>
            <button
              type="button"
              className="flex items-center gap-1 hover:underline cursor-pointer"
            >
              ⚙️ પ્રોફાઈલ સેટિંગ્સ
            </button>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* ===== FONT SIZE CONTROLLER (WORKING) ===== */}
          <div className="space-y-1">
            <span className="text-[13px] text-neutral-400 font-normal">
              ફોન્ટ સાઈઝ
            </span>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={decreaseFont}
                disabled={!canDecrease}
                aria-label="ફોન્ટ નાનો કરો"
                className="flex h-10 w-12 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-bold text-base active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                A-
              </button>
              <span className="text-lg font-bold" aria-live="polite">
                {toGujaratiNumeral(fontSize)}%
              </span>
              <button
                type="button"
                onClick={increaseFont}
                disabled={!canIncrease}
                aria-label="ફોન્ટ મોટો કરો"
                className="flex h-10 w-12 items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-bold text-base active:scale-95 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                A+
              </button>
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Saved News */}
          <NavLink
            to="/saved"
            onClick={onClose}
            className="flex items-center gap-3 py-1 text-black dark:text-white hover:text-[#E59E38] transition-colors"
          >
            <span className="text-lg">🔖</span>
            <span className="font-semibold text-lg">સેવ કરેલ સમાચાર</span>
          </NavLink>

          {/* Charcha Patra */}
          <NavLink
            to="/charcha-patra"
            onClick={onClose}
            className="flex items-center gap-3 py-1 text-black dark:text-white hover:text-[#E59E38] transition-colors"
          >
            <span className="text-lg">✍️</span>
            <span className="font-semibold text-lg">ચર્ચા પત્ર</span>
          </NavLink>

          {/* Opinion */}
          <NavLink
            to="/opinion"
            onClick={onClose}
            className="flex items-center gap-3 py-1 text-black dark:text-white hover:text-[#E59E38] transition-colors"
          >
            <span className="text-lg">🗣️</span>
            <span className="font-semibold text-lg">ઓપિનિયન</span>
          </NavLink>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Categories */}
          <nav className="space-y-6">
            {sidebarCategories.map((cat) => (
              <NavLink
                key={cat.slug}
                to={cat.home ? "/" : `/category/${cat.slug}`}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 transition-colors ${
                    isActive
                      ? "text-[#E59E38] font-extrabold"
                      : "text-black dark:text-white hover:text-[#E59E38]"
                  }`
                }
              >
                <span className="text-lg w-6 text-center">{cat.emoji}</span>
                <span className="font-semibold text-lg">
                  {cat.home ? "હોમ" : cat.name}
                </span>
              </NavLink>
            ))}
          </nav>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-3 w-full py-1 text-red-500 font-bold hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="text-lg">🚪</span>
            <span className="text-lg">લોગ આઉટ</span>
          </button>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* Social Icons */}
          <div className="space-y-1.5">
            <span className="text-[13px] text-neutral-400 font-normal">
              અમને ફોલો કરો
            </span>
            <SocialIcons />
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          {/* App download + Feedback + Contact */}
          <div className="space-y-2.5 pt-1">
            <span className="text-[11px] text-neutral-400 font-normal">
              એપ ડાઉનલોડ કરો
            </span>

            <div className="flex flex-col gap-2">
              <div
                id="androidInstallBtn"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  className="fill-current text-black dark:text-white"
                >
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 00-.83.22l-1.88 3.24a11.463 11.463 0 00-9.9 0L4.7 5.67a.637.637 0 00-.83-.22c-.3.16-.42.54-.26.85L5.44 9.48C2.5 11.24 .5 14.4 0 18h24c-.5-3.6-2.5-6.76-6.4-8.52M7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5m10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5" />
                </svg>
                <div className="leading-tight">
                  <div className="text-[10px] text-neutral-500 block font-normal tracking-wider">
                    GET IT ON
                  </div>
                  <div className="text-md font-bold text-black dark:text-white">
                    Google Play
                  </div>
                </div>
              </div>

              <div
                id="appleInstallBtn"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="fill-current text-black dark:text-white"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.24.03 1.03-.3 2.15-.6.72-.19 1.42-.13 2.05.06-.05.05-.83.5-1.24 1.4-.9 1.98.34 4.14 2.17 4.44-.4 1.09-.94 2.16-2.16 3.87zM12.03 7.25c-.13-2.14 1.68-3.97 3.68-4.14.23 2.4-2.15 4.31-3.68 4.14z" />
                </svg>
                <div className="leading-tight">
                  <div className="text-[10px] text-neutral-500 block font-normal tracking-wider">
                    Download on the
                  </div>
                  <div className="text-md font-bold text-black dark:text-white">
                    App Store
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowFeedback(!showFeedback)}
                className="flex items-center justify-between w-full py-1 text-black dark:text-white hover:text-[#E59E38] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">💬</span>
                  <span className="font-bold text-base">ફીડબેક આપો</span>
                </div>
                <span
                  className={`transition-transform duration-300 ${
                    showFeedback ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  showFeedback
                    ? "grid-rows-[1fr] opacity-100 pt-3"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden space-y-3">
                  <form onSubmit={handleFeedbackSubmit} className="space-y-3">
                    <textarea
                      rows={3}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="તમારો પ્રતિભાવ અહીં લખો..."
                      className="w-full p-3 text-sm border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-[#E59E38] dark:bg-neutral-800 text-black dark:text-white font-normal resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#E59E38] hover:bg-[#d48e2f] text-black font-bold text-sm rounded-2xl transition-colors cursor-pointer shadow-sm active:scale-[0.99]"
                    >
                      મોકલો
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-neutral-200 dark:border-neutral-800" />

          <div className="pb-4">
            <button
              type="button"
              onClick={() => setShowContact(!showContact)}
              className="flex items-center justify-between w-full py-1 text-black dark:text-white hover:text-[#E59E38] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <span className="font-bold text-base">અમારો સંપર્ક કરો</span>
              </div>
              <span
                className={`transition-transform duration-300 ${
                  showContact ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showContact
                  ? "grid-rows-[1fr] opacity-100 pt-3"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden space-y-2 text-[13px] text-neutral-700 dark:text-neutral-300 font-normal leading-relaxed">
                <p>
                  <strong className="font-bold text-black dark:text-white">
                    ફોન:
                  </strong>{" "}
                  +91 261 234 5678
                </p>
                <p>
                  <strong className="font-bold text-black dark:text-white">
                    ઇમેઇલ:
                  </strong>{" "}
                  contact@gujaratmitra.in
                </p>
                <p>
                  <strong className="font-bold text-black dark:text-white">
                    સરનામું:
                  </strong>{" "}
                  ગુજરાત મિત્ર કાર્યાલય, રિંગ રોડ, સુરત
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
}