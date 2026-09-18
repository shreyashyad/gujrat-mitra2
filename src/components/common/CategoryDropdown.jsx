import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export default function CategoryDropdown({ items }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null); // NULL થી સ્ટાર્ટ કર્યું જેથી 0,0 પોઝિશન ન પકડે
  const ref = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open થાય ત્યારે પોઝિશન ગણવી
  useEffect(() => {
    if (!open || !btnRef.current) {
      setCoords(null);
      return;
    }

    const update = () => {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    };

    update(); // Instant calculation
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  if (!items?.length) return null;

  // open અને coords બંને ઉપલબ્ધ હોય ત્યારે જ પોર્ટલ બતાવો
  const menu =
    open && coords
      ? createPortal(
          <div
            ref={ref}
            style={{
              position: "fixed",
              top: coords.top,
              right: coords.right,
            }}
            className="w-48 max-w-[calc(100vw-2rem)] max-h-80 overflow-y-auto
                       rounded-2xl border border-black/10 dark:border-white/15
                       bg-white dark:bg-navbar-dark/80 backdrop-blur-2xl
                       shadow-[0_10px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)]
                       z-[9999] p-1.5
                       animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          >
            <ul className="space-y-0.5">
              {items.map((cat) => (
                <li key={cat.slug}>
                  <NavLink
                    to={`/category/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    style={{ fontFamily: "'Hind Vadodara', sans-serif" }}
                    className={({ isActive }) =>
                      `block px-3.5 py-2 text-sm rounded-xl font-semibold transition-all duration-150 active:scale-[0.98] ${
                        isActive
                          ? "bg-home text-[#e8a33b] font-bold shadow-sm"
                          : "font-medium text-ink/90 dark:text-ink-dark/90 hover:bg-black/5 dark:hover:bg-white/10"
                      }`
                    }
                  >
                    {cat.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="relative shrink-0">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        style={{ fontFamily: "'Hind Vadodara', sans-serif" }}
        className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 h-7
                   text-xs font-bold text-ink/80 dark:text-ink-dark/80
                   hover:bg-black/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-ink-dark
                   active:scale-95 transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
      >
        વધુ
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {menu}
    </div>
  );
}