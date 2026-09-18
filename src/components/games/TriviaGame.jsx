import { useState } from "react";
import { Trophy, CheckCircle2 } from "lucide-react";
import { useGameDetail } from "../../context/GameDetailContext.jsx";

/**
 * Daily Trivia UI — with separate "Check Answer" and "Next Question" flow and custom styling.
 */
export default function TriviaGame() {
  const {
    step,
    score,
    questions,
    isDone,
    selectAnswer,
    next,
    restart,
  } = useGameDetail();

  // લોકલ સ્ટેટ જેથી ચેક કર્યા પહેલા ગમે ત્યારે ઓપ્શન બદલી શકાય
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [checked, setChecked] = useState(false);

  if (!questions?.length) {
    return (
      <p className="text-center font-gu text-[15px] text-ink/60 dark:text-ink-dark/60 py-10">
        પ્રશ્નો લોડ થઈ રહ્યા છે…
      </p>
    );
  }

  if (isDone) {
    return (
      <div className="text-center py-10 sm:py-12 rounded-2xl px-5 bg-black/[0.02] dark:bg-white/[0.03]">
        <div className="w-16 h-16 rounded-full bg-[#ffc107]/15 dark:bg-[#3a2d00]/50 text-[#e48d0b] flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8" />
        </div>
        <h2 className="font-gu text-2xl font-bold text-ink dark:text-ink-dark mb-2">
          સ્કોર: {score} / {questions.length}
        </h2>
        <p className="font-gu text-sm text-ink/60 dark:text-ink-dark/60 mb-6">
          રમત પૂર્ણ કરવા બદલ અભિનંદન!
        </p>
        <button
          type="button"
          onClick={() => {
            setSelectedOpt(null);
            setChecked(false);
            restart();
          }}
          className="rounded-full bg-[#e48d0b] hover:bg-[#a06d20] active:scale-[0.98] px-8 py-2.5 font-gu text-sm font-bold text-white shadow-[0_2px_8px_rgba(185,127,38,0.25)] transition-all duration-200"
        >
          ફરી રમો
        </button>
      </div>
    );
  }

  const current = questions[step];
  const hasAnswer = selectedOpt !== null;

  const handleSelect = (idx) => {
    if (checked) return; // જો ચેક થઈ ગયું હોય તો ઓપ્શન બદલાય નહીં
    setSelectedOpt(idx);
    selectAnswer(idx); // કોન્ટેક્ટમાં પણ અપડેટ મોકલવા માટે
  };

  const handleCheck = () => {
    if (hasAnswer) {
      setChecked(true);
    }
  };

  const handleNext = () => {
    setSelectedOpt(null); // નવું પ્રશ્ન આવે એટલે સિલેક્શન રિસેટ
    setChecked(false);
    next();
  };

  return (
    <div className="rounded-2xl p-4 sm:p-6 bg-black/[0.015] dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[15px] font-gu font-semibold text-[#e48d0b] tracking-wide">
          પ્રશ્ન {step + 1} / {questions.length}
        </p>
        <div className="h-1 flex-1 max-w-[12rem] rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#e48d0b] transition-all duration-300"
            style={{
              width: `${((step + 1) / Math.max(questions.length, 1)) * 100}%`,
            }}
          />
        </div>
      </div>
      <h3 className="font-gu text-base sm:text-[25px] font-semibold text-ink dark:text-ink-dark mb-5 leading-[1.2]">
        {current?.q}
      </h3>
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {current?.opts?.map((opt, idx) => {
          const isCorrect = idx === current.correct;
          const isChosen = idx === selectedOpt;
          
          let stateClass = "bg-black/[0.03] dark:bg-white/[0.06] hover:bg-[#e48d0b]/10 dark:hover:bg-[#e6c27a]/10 border border-transparent";
          
          if (checked) {
            if (isCorrect) {
              stateClass = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-500/30";
            } else if (isChosen) {
              stateClass = "bg-red-500/15 text-red-600 dark:text-red-400 font-semibold border border-red-500/30";
            } else {
              stateClass = "bg-black/[0.02] dark:bg-white/[0.03] opacity-50 border border-transparent";
            }
          } else if (isChosen) {
            stateClass = "bg-[#e48d0b]/15 text-[#e48d0b] font-semibold border border-[#e48d0b]/30";
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={checked}
              onClick={() => handleSelect(idx)}
              className={`rounded-xl px-3.5 py-2.5 sm:py-3.5 text-left text-sm sm:text-[17px] font-gu text-ink dark:text-ink-dark transition-all duration-200 active:scale-[0.99] ${stateClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Action Button: Check / Next */}
      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-[320px]">
          {!checked ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={!hasAnswer}
              className="w-full flex items-center justify-center gap-2 rounded-full cursor-pointer
                         bg-[#e48d0b] hover:bg-[#a06d20] active:scale-[0.98]
                         py-2.5 px-4 font-gu text-[17px] font-bold text-white
                         shadow-[0_2px_8px_rgba(185,127,38,0.25)]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#e48d0b]
                         transition-all duration-200"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>ચેક કરો</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="w-full flex items-center justify-center gap-2 rounded-full cursor-pointer
                         bg-[#e48d0b] hover:bg-[#a06d20] active:scale-[0.98]
                         py-2.5 px-4 font-gu text-[17px] font-bold text-white
                         shadow-[0_2px_8px_rgba(185,127,38,0.25)]
                         transition-all duration-200"
            >
              {step + 1 < questions.length ? "આગળનો પ્રશ્ન" : "પરિણામ જુઓ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}