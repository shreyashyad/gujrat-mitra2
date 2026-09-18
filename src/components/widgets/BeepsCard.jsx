import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { beeps } from "../../data/beeps.js";
import { useBeepsDetail } from "../../context/BeepsDetailContext.jsx";

export default function BeepsCard() {
  const items = (beeps || []).slice(0, 5);
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const { openBeeps } = useBeepsDetail();

  useEffect(() => {
    if (items.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 2800);

    return () => clearInterval(timerRef.current);
  }, [items.length]);

  const handleOpen = (e, item) => {
    e.stopPropagation();
    openBeeps(item.id, beeps); // always pass id
  };

  const handleContainerClick = () => {
    navigate("/beeps");
  };

  const getPosition = (index) => {
    let diff = index - current;
    const len = items.length;
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;
    return diff;
  };

  const getTruncatedText = (text, maxWords = 15) => {
    if (!text) return "";
    const words = text.trim().split(/\s+/);
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(" ") + "...";
    }
    return text;
  };

  return (
    <div
      onClick={handleContainerClick}
      className="select-none space-y-2 p-4 pb-8 rounded-3xl cursor-pointer hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-300 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] border-[2px] border-transparent bg-origin-border [background-clip:padding-box,border-box] [background-image:linear-gradient(to_top,#ffffff,#ffffff),linear-gradient(to_top,#e5e7eb,rgba(239,68,68,0.5),#e48d0b)] dark:[background-image:linear-gradient(to_top,#1c1c1e,#1c1c1e),linear-gradient(to_bottom,#4b5563,rgba(239,68,68,0.5),#e48d0b)]"
    >
      {/* Title Header */}
      <Link
        to="/beeps"
        onClick={(e) => e.stopPropagation()}
        className="flex items-center gap-1.5 w-fit select-none cursor-pointer active:opacity-60 transition-opacity"
      >
        <h3 className="font-gu tracking-tight text-[#e48d0b] dark:text-[#f39c12] text-[26px] font-semibold">
          બીપ્સ
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </Link>

      {/* Card Carousel Area */}
      <div className="relative w-full">
        <div className="relative w-full h-[220px] sm:h-[260px] flex items-center justify-center">
          {items.map((item, idx) => {
            const pos = getPosition(idx);
            if (Math.abs(pos) > 2) return null;

            let style = {};

            if (pos === 0) {
              style = {
                width: "72%",
                height: "100%",
                opacity: 1,
                zIndex: 30,
                transform: "translate(-50%, -50%) scale(1.03)",
                boxShadow: "0 12px 28px rgba(0,0,0,0.18)",
              };
            } else if (pos === -1) {
              style = {
                width: "58%",
                height: "88%",
                opacity: 0.55,
                zIndex: 20,
                transform: "translate(-82%, -50%) scale(0.97)",
              };
            } else if (pos === 1) {
              style = {
                width: "58%",
                height: "88%",
                opacity: 0.55,
                zIndex: 20,
                transform: "translate(-18%, -50%) scale(0.97)",
              };
            } else if (pos === -2) {
              style = {
                width: "46%",
                height: "78%",
                opacity: 0.25,
                zIndex: 10,
                transform: "translate(-96%, -50%) scale(0.95)",
              };
            } else if (pos === 2) {
              style = {
                width: "46%",
                height: "78%",
                opacity: 0.25,
                zIndex: 10,
                transform: "translate(-4%, -50%) scale(0.95)",
              };
            }

            return (
              <div
                key={item.id}
                onClick={(e) => handleOpen(e, item)}
                className="absolute top-1/2 left-1/2 rounded-[12px] overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] group"
                style={style}
              >
                <img
                  src={item.img}
                  alt={item.text?.slice(0, 40) || "Beep"}
                  className="w-full h-full object-cover object-center"
                  loading={pos === 0 ? "eager" : "lazy"}
                />

                <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-md px-2.5 py-1.5 flex items-center">
                  <p className="font-gu text-white text-[20px] font-medium w-full leading-snug text-center">
                    {getTruncatedText(item.text, 9)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}