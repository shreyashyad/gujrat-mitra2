import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { aapniAajSidebarData } from "../../data/aapniAajData.js";

export default function AapniAajSidebar({
  title = "આપની આજ",
  to = "/aapni-aaj",
}) {
  const navigate = useNavigate();

  const {
    date = "",
    samvat = "",
    description = "",
    rashi = "",
    tithi = "",
    sunrise = "",
    sunset = "",
    linkText = "વધુ વાંચો",
  } = aapniAajSidebarData || {};

  // આખા કાર્ડ પર ગમે ત્યાં ક્લિક કરવાથી /aapni-aaj રાઉટ પર નેવિગેટ થશે
  const handleCardClick = () => {
    navigate(to);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === "Enter" && navigate(to)}
      className="select-none font-gu space-y-1 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] p-4 bg-white dark:bg-[#121212] border border-[#facc15]/70 rounded-3xl hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
    >
      <Link
        to={to}
        onClick={(e) => e.stopPropagation()}
        className="group flex items-center gap-1.5 w-fit select-none active:opacity-50 transition-opacity duration-150"
      >
        <h3 className="font-gu tracking-tight text-[#e48d0b] group-hover:opacity-80 transition-opacity text-[26px] font-semibold">
          {title}
        </h3>
        <span className="flex items-center gap-0.5 shrink-0">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </Link>

      {/* Card Content Area */}
      <div className="block w-full max-w-sm rounded-[7px] bg-white dark:bg-[#121212]">
        {/* Date */}
        <div className="text-center pb-2">
          <h3 className="text-[20px] font-medium text-gray-700 dark:text-gray-200">
            {date}
          </h3>
          <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-0.5">
            {samvat}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-2 my-3 items-center">
          {/* Left */}
          <div className="col-span-6 flex flex-col items-center text-center pr-2">
            <div className="flex items-center justify-center gap-2">
              <img
                src="https://png.pngtree.com/png-vector/20221128/ourmid/pngtree-icon-of-sun-png-image_6484830.png"
                alt="Sun"
                className="w-10 h-10 object-contain shrink-0"
              />
              <div className="flex flex-col text-left">
                <h4 className="text-[20px] font-extrabold text-black dark:text-white leading-tight">
                  આપની
                </h4>
                <h4 className="text-[20px] font-extrabold text-black dark:text-white leading-tight">
                  આજ
                </h4>
              </div>
            </div>

            <p className="text-[15px] text-gray-500 dark:text-gray-400 mt-2 leading-snug">
              {description}
            </p>
          </div>

          {/* Right */}
          <div className="col-span-6 pl-2 space-y-1.5 text-[15px]">
            <div className="flex items-center justify-between">
              <span className="font-bold text-black dark:text-white">રાશિ</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium">
                {rashi}
              </span>
            </div>

            <div className="flex items-start justify-between gap-1">
              <span className="font-bold text-black dark:text-white">તિથી</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium text-right leading-tight">
                {tithi}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-black dark:text-white">સૂર્યોદય</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium font-en">
                {sunrise}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-bold text-black dark:text-white">સૂર્યાસ્ત</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium font-en">
                {sunset}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <span className="text-[#2563eb] font-bold text-[20px] underline underline-offset-4">
            {linkText}
          </span>
        </div>
      </div>
    </div>
  );
}