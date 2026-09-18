import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Share, ArrowUp } from "lucide-react";
import logo from "../../assets/logo1.png";
import ShareModal from "../common/ShareModal.jsx";

const SWIPE_THRESHOLD = 50;
const NAV_LOCK_MS = 350;

const PERIODS = [
  { key: "daily", label: "દૈનિક" },
  { key: "weekly", label: "સાપ્તાહિક" },
  { key: "yearly", label: "વાર્ષિક" },
];

export default function RashifalModal({
  rashiList = [],
  rashiTips,
  initialIndex,
  initialPeriod = "daily",
  onClose,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const resolveIndex = (val) => {
    if (!rashiList?.length) return 0;
    if (typeof val === "number" && Number.isInteger(val) && val >= 0 && val < rashiList.length) {
      return val;
    }
    if (typeof val === "string") {
      const found = rashiList.findIndex((r) => r.id === val || r.name === val);
      return found >= 0 ? found : 0;
    }
    return 0;
  };

  const [index, setIndex] = useState(() => resolveIndex(initialIndex));
  const [period, setPeriod] = useState(initialPeriod);
  const [bounceY, setBounceY] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);

  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const lockedRef = useRef(false);
  const wheelLockRef = useRef(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    setIndex(resolveIndex(initialIndex));
  }, [initialIndex, rashiList]);

  const rashi = rashiList[index];
  const tip =
    rashi?.[period] ||
    (period === "daily" ? rashiTips?.[index] : null) ||
    rashi?.daily ||
    "";

  const isFirst = index === 0;
  const isLast = index === rashiList.length - 1;

  const periodLabel =
    period === "daily"
      ? "આજનું રાશિફળ"
      : period === "weekly"
        ? "સાપ્તાહિક રાશિફળ"
        : "વાર્ષિક રાશિફળ";

  // URL sync
  useEffect(() => {
    if (!rashi) return;
    const id = rashi.id || rashi.name;
    if (!id) return;

    const next = new URLSearchParams(searchParams);
    next.set("rashi", id);
    next.set("period", period);
    setSearchParams(next, { replace: true });
  }, [rashi?.id, rashi?.name, period]);

  // Clean URL on unmount
  useEffect(() => {
    return () => {
      const next = new URLSearchParams(searchParams);
      next.delete("rashi");
      next.delete("period");
      setSearchParams(next, { replace: true });
    };
  }, []);

  // ========== FIXED Share handler ==========
  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShareOpen(true);
  };

  const lockBriefly = () => {
    lockedRef.current = true;
    setTimeout(() => {
      lockedRef.current = false;
    }, NAV_LOCK_MS);
  };

  const triggerBounce = (px) => {
    setBounceY(px);
    setTimeout(() => setBounceY(null), 350);
  };

  const goNext = () => {
    if (lockedRef.current) return;
    if (isLast) {
      triggerBounce(14);
      return;
    }
    lockBriefly();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (lockedRef.current) return;
    if (isFirst) {
      triggerBounce(-14);
      return;
    }
    lockBriefly();
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setIndex((i) => i - 1);
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [index, period]);

  const handleTouchStart = (e) => {
    // Ignore if user touched a button (Share / Close / Period)
    if (e.target.closest("button")) {
      touchStartY.current = null;
      touchStartX.current = null;
      return;
    }
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current == null) return;
    const el = scrollRef.current;
    const deltaY = touchStartY.current - e.touches[0].clientY;

    if (el) {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      if ((atTop && deltaY < 0) || (atBottom && deltaY > 0)) {
        e.preventDefault();
      }
    } else {
      e.preventDefault();
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartY.current === null) return;
    const deltaY = touchStartY.current - e.changedTouches[0].clientY;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    touchStartY.current = null;
    touchStartX.current = null;

    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;

    const el = scrollRef.current;
    if (el) {
      const atTop = el.scrollTop <= 2;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      if (deltaY > 0 && atBottom) goNext();
      else if (deltaY < 0 && atTop) goPrev();
    } else {
      if (deltaY > 0) goNext();
      else goPrev();
    }
  };

  const handleMouseDown = (e) => {
    if (e.target.closest("button")) return;
    e.preventDefault();
    const startY = e.clientY;

    function handleMouseUp(upEvent) {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", preventTextSelect);
      const deltaY = startY - upEvent.clientY;
      if (Math.abs(deltaY) < SWIPE_THRESHOLD) return;
      if (deltaY > 0) goNext();
      else goPrev();
    }
    function preventTextSelect(moveEvent) {
      moveEvent.preventDefault();
    }

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", preventTextSelect);
  };

  const handleWheel = (e) => {
    if (wheelLockRef.current) return;
    if (Math.abs(e.deltaY) < 20) return;
    wheelLockRef.current = true;
    setTimeout(() => {
      wheelLockRef.current = false;
    }, NAV_LOCK_MS);
    if (e.deltaY > 0) goNext();
    else goPrev();
  };

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowUp") goPrev();
      else if (e.key === "ArrowDown") goNext();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [index, onClose]);

  useEffect(() => {
    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";
    body.style.overscrollBehavior = "none";
    html.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = "";
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.overflow = "";
      body.style.overscrollBehavior = "";
      html.style.overscrollBehavior = "";
      window.scrollTo(0, scrollY);
    };
  }, []);

  return (
    <div
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black/35 p-4"
      onClick={onClose}
    >
      <div
  onClick={(e) => e.stopPropagation()}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  onMouseDown={handleMouseDown}
  onWheel={handleWheel}
  style={{
    ...(bounceY !== null ? { "--bounce-y": `${bounceY}px` } : {}),
    overscrollBehavior: "none",
    touchAction: "pan-y",
  }}
  className={`relative flex w-full max-w-3xl flex-col overflow-hidden rounded-[13px]
        bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18),0_4px_12px_rgba(0,0,0,0.08)]
        dark:bg-[#1c1c1e] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55),0_4px_12px_rgba(0,0,0,0.3)]
        h-[80vh] max-h-[80vh] md:h-[min(92vh,720px)] md:max-h-[min(92vh,720px)]
        select-none cursor-grab active:cursor-grabbing
        ${bounceY !== null ? "beep-edge-bounce" : ""}`}
>
        {/* Progress Bar */}
        <div className="absolute inset-x-0 top-0 z-20 h-[3px] overflow-hidden rounded-t-[13px] bg-black/5 dark:bg-white/10">
          <div
            className="h-full bg-[#e48d0b] transition-all duration-300"
            style={{ width: `${((index + 1) / rashiList.length) * 100}%` }}
          />
        </div>

        <div
          key={`scroll-${index}-${period}`}
          ref={scrollRef}
          className="rashi-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="beep-fade-in flex min-h-full flex-col justify-between">
            <div>
              {/* Header Banner */}
              <div className="relative flex h-72 shrink-0 flex-col items-center justify-center rounded-t-[13px] bg-gradient-to-br from-[#1a1c29] via-[#2d2342] to-[#12131C]">
                <div className="text-8xl text-[#e48d0b] drop-shadow-[0_4px_12px_rgba(232,163,61,0.3)]">
                  {rashi?.sym}
                </div>

                <div className="absolute left-4 top-4 z-10 flex items-center">
                  <img
                    src={logo}
                    alt="Logo"
                    className="logo h-7 w-auto object-contain brightness-0 invert drop-shadow-md"
                  />
                </div>

                {/* ===== FIXED BUTTONS ===== */}
                <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="શેર કરો"
                    onClick={handleShare}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white shadow-sm backdrop-blur-xl transition-all hover:bg-black/55 active:scale-90"
                  >
                    <Share size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label="બંધ કરો"
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white shadow-sm backdrop-blur-xl transition-all hover:bg-black/55 active:scale-90"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="absolute bottom-3 right-4 rounded-full bg-black/45 px-2.5 py-0.5 text-[12px] font-medium text-white/90 backdrop-blur-xl">
                  {index + 1} / {rashiList.length}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4 flex gap-2">
                  {PERIODS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPeriod(p.key);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={`flex-1 cursor-pointer rounded-lg py-2 font-gu text-sm font-bold transition-all duration-200
                        ${
                          period === p.key
                            ? "bg-[#e48d0b] text-white shadow-sm"
                            : "bg-black/[0.04] text-ink/70 hover:bg-black/[0.07] dark:bg-white/[0.06] dark:text-ink-dark/70 dark:hover:bg-white/[0.1]"
                        }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <span className="inline-flex w-fit items-center self-start rounded-md bg-[#e48d0b] px-3 py-1 text-xs font-black uppercase tracking-wider text-white shadow-sm">
                  {periodLabel}
                </span>

                <h2 className="mt-3.5 font-gu text-[20px] md:text-[26px] font-extrabold leading-tight text-ink dark:text-ink-dark">
                  {rashi?.name}
                </h2>

                <p className="mt-2 md:mt-4 font-gu text-[17px] md:text-[19px] font-normal leading-relaxed text-ink/90 dark:text-ink-dark/80">
                  {tip}
                </p>

                <div className="mt-6 rounded-2xl border border-dashed border-black/10 bg-black/[0.02] py-7 text-center dark:border-white/10 dark:bg-white/[0.02]">
                  <p className="font-gu text-xs font-medium tracking-wide text-ink/40 dark:text-ink-dark/40">
                    જાહેરાત / Advertisement
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center pb-5 pt-1 text-center">
              <p className="inline-flex animate-pulse items-center justify-center gap-1.5 font-gu text-[13px] font-medium leading-none text-ink/70 dark:text-ink-dark/40">
                <ArrowUp size={14} className="shrink-0" />
                <span>
                  {isLast ? "છેલ્લી રાશિ" : "આગળની રાશિ માટે ઉપર સ્વાઇપ કરો"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ShareModal – same as Beeps */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={`${rashi?.name || ""} - ${periodLabel}`}
        text={tip || ""}
        url={typeof window !== "undefined" ? window.location.href : ""}
        image={null}
      />

      <style>{`
        .overscroll-contain {
          overscroll-behavior: contain;
        }
        .rashi-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
        }
        .rashi-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .rashi-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 4px;
        }
        .dark .rashi-scroll {
          scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
        }
        .dark .rashi-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  );
}