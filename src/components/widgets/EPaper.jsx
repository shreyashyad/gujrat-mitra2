import React from "react";
import { Link } from "react-router-dom";
import epaperImage from "../../assets/epaper-preview.jpg";

export default function EPaper({ title = "ઈ-પેપર", to = "/epaper" }) {
  return (
    <Link
      to={to}
      className="group block select-none font-gu space-y-1 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 border border-gray-200/70 dark:border-white/10 rounded-3xl hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] bg-white dark:bg-[#1c1c1e]"
    >
      {/* ટાઇટલ અને ડોટ્સ */}
      <div className="flex items-center gap-1.5 w-fit active:opacity-50 transition-opacity duration-150">
        <h3 className="font-gu tracking-tight text-[#e48d0b] group-hover:opacity-80 transition-opacity text-[26px] font-semibold">
          {title}
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* ઇમેજ કન્ટેનર */}
      <div className="w-full max-w-sm rounded-[7px]">
        <div className="relative w-full overflow-hidden leading-none h-[150px] rounded-b-3xl scale-102">
          <img
            src={epaperImage}
            alt="ઈ-પેપર"
            className="block w-full h-auto object-cover object-top rounded-3xl"
            style={{
              clipPath: "inset(0 0 50% 0)",
              marginBottom: "-65%",
            }}
          />
        </div>
      </div>
    </Link>
  );
}