import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Share, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import logo from "../../assets/logo1.png";
import ShareModal from "../common/ShareModal.jsx";

const SWIPE_THRESHOLD = 50;
const NAV_LOCK_MS = 450;

export default function BeepsModal({ beeps = [], initialIndex, onClose }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const resolveIndex = (val) => {
    if (!beeps?.length) return 0;
    if (typeof val === "number" && Number.isInteger(val) && val >= 0 && val < beeps.length) {
      return val;
    }
    if (typeof val === "string") {
      const found = beeps.findIndex((b) => b.id === val);
      return found >= 0 ? found : 0;
    }
    return 0;
  };

  const [index, setIndex] = useState(() => resolveIndex(initialIndex));
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [bounceY, setBounceY] = useState(null);
  const [shareItem, setShareItem] = useState(null);

  useEffect(() => {
    setIndex(resolveIndex(initialIndex));
  }, [initialIndex, beeps]);

  const touchStartY = useRef(null);
  const touchStartX = useRef(null);
  const lockedRef = useRef(false);
  const wheelLockRef = useRef(false);
  const mobileScrollRef = useRef(null);

  const beep = beeps[index] || null;
  const isFirst = index === 0;
  const isLast = index === beeps.length - 1;

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleShare = (e, targetBeep) => {
    e.stopPropagation();
    setShareItem(targetBeep || beep);
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

  const changeIndex = (newIndex, dir) => {
    if (isAnimating || lockedRef.current) return;
    setDirection(dir);
    setIsAnimating(true);
    lockBriefly();
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollTop = 0;
    }
    requestAnimationFrame(() => {
      setIndex(newIndex);
      setTimeout(() => {
        setIsAnimating(false);
        setDirection(0);
      }, 450);
    });
  };

  const goNext = () => {
    if (isLast) {
      triggerBounce(14);
      return;
    }
    changeIndex(index + 1, 1);
  };

  const goPrev = () => {
    if (isFirst) {
      triggerBounce(-14);
      return;
    }
    changeIndex(index - 1, -1);
  };

  useEffect(() => {
    if (mobileScrollRef.current) {
      mobileScrollRef.current.scrollTop = 0;
    }
  }, [index]);

  const handleTouchStart = (e) => {
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
    const el = mobileScrollRef.current;
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

    const el = mobileScrollRef.current;
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

  const handleDesktopMouseDown = (e) => {
    if (e.target.closest("button")) return;
    e.preventDefault();
    const startX = e.clientX;
    function handleMouseUp(upEvent) {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", preventTextSelect);
      const deltaX = startX - upEvent.clientX;
      if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
      if (deltaX > 0) goNext();
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
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowRight" || e.key === "ArrowUp") goNext();
      else if (e.key === "ArrowLeft" || e.key === "ArrowDown") goPrev();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [index, isFirst, isLast, isAnimating, closeModal]);

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

  const SideCard = ({ item, side }) => {
    if (!item) {
      return (
        <div
          className={`hidden h-full w-[280px] shrink-0 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] lg:block xl:w-[320px] 2xl:w-[360px] ${side === "left" ? "-translate-x-[25%]" : "translate-x-[25%]"
            }`}
        />
      );
    }
    return (
      <div
        onClick={side === "left" ? goPrev : goNext}
        className={`hidden h-full w-[280px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-[16px]
                    bg-white shadow-xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]
                    will-change-transform scale-[0.92] opacity-45 hover:opacity-70
                    dark:bg-[#1c1c1e] lg:flex xl:w-[320px] 2xl:w-[360px]
                    ${side === "left"
            ? "-translate-x-[25%] hover:-translate-x-[18%]"
            : "translate-x-[25%] hover:translate-x-[18%]"
          }`}
      >
        <div className="relative h-[38%] min-h-[140px] shrink-0 overflow-hidden">
          {item.img ? (
            <img src={item.img} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-800">
              <Sparkles className="text-white/20" size={32} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
          <div className="absolute left-3.5 top-3.5">
            <img
              src={logo}
              alt="Logo"
              className="h-6 w-auto brightness-0 invert drop-shadow"
            />
          </div>
          <div className="absolute right-3 top-3">
            <button
              type="button"
              onClick={(e) => handleShare(e, item)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/55"
            >
              <Share size={14} />
            </button>
          </div>
        </div>
        <div className="pointer-events-none flex flex-1 flex-col justify-between overflow-y-auto p-4">
          <div>
            <span className="inline-flex w-fit items-center self-start rounded-md bg-red-600 px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
              SHORT &amp; SNAPPY
            </span>
            <h2 className="mt-2 line-clamp-3 font-gu text-[18px] font-medium leading-snug text-ink xl:text-[20px] dark:text-ink-dark">
              {item.text}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 font-gu text-[15px] text-ink/50 xl:text-[17px] dark:text-ink-dark/50">
              <span className="font-bold text-[#e48d0b]">{item.source}</span>
              <span>•</span>
              <span className="font-medium">{item.time}</span>
            </p>
            <p className="mt-2.5 line-clamp-4 font-gu text-[17px] font-normal leading-relaxed text-ink/80 xl:text-[20px] dark:text-ink-dark/80">
              {item.snippet}
            </p>
          </div>
          <div className="mt-3 rounded-xl border border-dashed border-black/10 bg-black/[0.02] py-3 text-center dark:border-white/10 dark:bg-white/[0.02]">
            <p className="font-gu text-xs font-medium tracking-wide text-ink/40 dark:text-ink-dark/40">
              જાહેરાત / Advertisement
            </p>
          </div>
        </div>
      </div>
    );
  };

  const getMainCardAnim = () => {
    if (!isAnimating) return "translate-x-0 scale-100 opacity-100";
    if (direction === 1) return "animate-slide-in-from-right";
    if (direction === -1) return "animate-slide-in-from-left";
    return "";
  };

  return (
    <div
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        overscrollBehavior: "none",
        touchAction: "none",
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-black/40"
      onClick={closeModal}
      onWheel={handleWheel}
    >
      {/* DESKTOP / TABLET */}
      <div
        className="relative hidden h-[min(72vh,680px)] w-full items-center justify-between px-2 md:flex lg:px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <SideCard item={index > 0 ? beeps[index - 1] : null} side="left" />

        <div
          key={index}
          onMouseDown={handleDesktopMouseDown}
          className={`relative z-10 mx-auto flex h-full w-full max-w-xl flex-1 cursor-grab flex-col overflow-hidden rounded-[16px] bg-white shadow-2xl select-none active:cursor-grabbing dark:bg-[#1c1c1e] lg:max-w-2xl will-change-transform ${getMainCardAnim()}`}
        >
          <div className="relative h-[40%] min-h-[180px] shrink-0 overflow-hidden sm:min-h-[200px] lg:h-[45%]">
            {beep?.img ? (
              <img
                src={beep.img}
                alt=""
                className="h-full w-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <Sparkles className="text-white/20" size={48} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            <div className="absolute left-4 top-4">
              <img
                src={logo}
                alt="Logo"
                className="h-7 w-auto brightness-0 invert drop-shadow"
              />
            </div>
            <div className="absolute right-4 top-4 flex items-center gap-2.5">
              <button
                type="button"
                onClick={(e) => handleShare(e)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/55"
              >
                <Share size={16} />
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/55"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="beep-scroll flex-1 overflow-y-auto p-4 lg:p-5 xl:p-6">
            <span className="inline-flex w-fit items-center self-start rounded-md bg-red-600 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
              SHORT &amp; SNAPPY
            </span>
            <h2 className="mt-3 font-gu text-[18px] font-medium leading-snug text-ink lg:text-[20px] dark:text-ink-dark">
              {beep?.text}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 font-gu text-[15px] text-ink/50 lg:text-[17px] dark:text-ink-dark/50">
              <span className="font-bold text-[#e48d0b]">{beep?.source}</span>
              <span>•</span>
              <span className="font-medium">{beep?.time}</span>
            </p>
            <p className="mt-3 font-gu text-[17px] font-normal leading-relaxed text-ink/80 lg:text-[20px] dark:text-ink-dark/80">
              {beep?.snippet}
            </p>
            <div className="mt-5 rounded-xl border border-dashed border-black/10 bg-black/[0.02] py-6 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <p className="font-gu text-xs font-medium tracking-wide text-ink/40 dark:text-ink-dark/40">
                જાહેરાત / Advertisement
              </p>
            </div>
          </div>
        </div>

        <SideCard
          item={index < beeps.length - 1 ? beeps[index + 1] : null}
          side="right"
        />

        <div className="absolute -bottom-14 left-1/2 z-20 flex -translate-x-1/2 items-center gap-5">
          <button
            type="button"
            onClick={goPrev}
            disabled={isFirst}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition dark:bg-[#2a2a2a] ${isFirst
                ? "cursor-not-allowed opacity-30"
                : "cursor-pointer hover:scale-105 active:scale-95"
              }`}
          >
            <ChevronLeft size={22} className="text-ink dark:text-white" />
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={isLast}
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg transition dark:bg-[#2a2a2a] ${isLast
                ? "cursor-not-allowed opacity-30"
                : "cursor-pointer hover:scale-105 active:scale-95"
              }`}
          >
            <ChevronRight size={22} className="text-ink dark:text-white" />
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          ...(bounceY !== null ? { "--bounce-y": `${bounceY}px` } : {}),
          overscrollBehavior: "none",
          touchAction: "pan-y",
        }}
        className={`relative flex h-[80vh] max-h-[80vh] w-[92%] max-w-lg flex-col overflow-hidden rounded-[13px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)] select-none dark:bg-[#1c1c1e] md:hidden ${bounceY !== null ? "beep-edge-bounce" : ""
          }`}
      >
        <div className="absolute inset-x-0 top-0 z-20 h-[3px] overflow-hidden rounded-t-[13px] bg-black/5 dark:bg-white/10">
          <div
            className="h-full bg-[#e48d0b] transition-all duration-300"
            style={{ width: `${((index + 1) / beeps.length) * 100}%` }}
          />
        </div>

        <div
          key={`scroll-${index}`}
          ref={mobileScrollRef}
          className="beep-fade-in beep-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="relative h-48 shrink-0 overflow-hidden sm:h-60">
            {beep?.img ? (
              <img
                src={beep.img}
                alt=""
                draggable={false}
                className="pointer-events-none h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800">
                <Sparkles className="text-white/20" size={48} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
            <div className="absolute left-4 top-4 z-10">
              <img
                src={logo}
                alt="Logo"
                className="h-7 w-auto brightness-0 invert drop-shadow"
              />
            </div>

            <div className="absolute right-3.5 top-3.5 z-10 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => handleShare(e)}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xl"
              >
                <Share size={15} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xl"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <span className="inline-flex w-fit items-center self-start rounded-md bg-red-600 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
              SHORT &amp; SNAPPY
            </span>
            <h2 className="mt-3 font-gu text-[20px] font-medium leading-snug text-ink dark:text-ink-dark">
              {beep?.text}
            </h2>
            <p className="mt-1.5 flex items-center gap-1.5 font-gu text-[17px] text-ink/50 dark:text-ink-dark/50">
              <span className="font-bold text-[#e48d0b]">{beep?.source}</span>
              <span>•</span>
              <span className="font-medium">{beep?.time}</span>
            </p>
            <p className="mt-3 font-gu text-[20px] font-normal leading-relaxed text-ink/90 dark:text-ink-dark/80">
              {beep?.snippet}
            </p>
            <div className="mt-5 rounded-xl border border-dashed border-black/10 bg-black/[0.02] py-5 text-center dark:border-white/10 dark:bg-white/[0.02]">
              <p className="font-gu text-xs font-medium tracking-wide text-ink/40 dark:text-ink-dark/40">
                જાહેરાત / Advertisement
              </p>
            </div>
            <div className="pb-4 pt-6 text-center">
              <p className="font-gu text-[14px] text-ink/60 dark:text-ink-dark/40">
                {isLast
                  ? "છેલ્લા સમાચાર"
                  : "આગળના સમાચાર માટે નીચે સુધી સ્ક્રોલ કરીને ઉપર સ્વાઇપ કરો"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromRight {
          0% { transform: translateX(60px) scale(0.96); opacity: 0.6; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes slideInFromLeft {
          0% { transform: translateX(-60px) scale(0.96); opacity: 0.6; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        .animate-slide-in-from-right {
          animation: slideInFromRight 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-slide-in-from-left {
          animation: slideInFromLeft 0.45s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .overscroll-contain { overscroll-behavior: contain; }
        .beep-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.25) transparent;
        }
        .beep-scroll::-webkit-scrollbar { width: 4px; }
        .beep-scroll::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.25);
          border-radius: 4px;
        }
        .dark .beep-scroll { scrollbar-color: rgba(255, 255, 255, 0.25) transparent; }
        .dark .beep-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.25); }
      `}</style>

      <ShareModal
        open={Boolean(shareItem)}
        onClose={() => setShareItem(null)}
        title={shareItem?.text}
        text={shareItem?.snippet || shareItem?.text}
        url={typeof window !== "undefined" ? window.location.href : ""}
        image={shareItem?.img}
      />
    </div>
  );
}