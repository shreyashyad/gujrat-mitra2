import { useState, useMemo } from "react";
import { Trophy, RotateCcw, CheckCircle2 } from "lucide-react";
import { crosswordPuzzle } from "../../data/crossword.js";

function cellKey(r, c) {
  return `${r}-${c}`;
}

export default function CrosswordGame({ onComplete }) {
  const puzzle = crosswordPuzzle;
  const { layout, numbers, across, down, cols } = puzzle;

  const answers = useMemo(() => {
    const map = {};
    layout.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell !== "#") map[cellKey(r, c)] = cell;
      });
    });
    return map;
  }, [layout]);

  const [values, setValues] = useState(() => {
    const init = {};
    Object.keys(answers).forEach((k) => {
      init[k] = "";
    });
    return init;
  });
  const [status, setStatus] = useState(() => new Map());
  const [won, setWon] = useState(false);
  const [checked, setChecked] = useState(false);

  const onChange = (key, raw) => {
    if (won) return;
    const v = raw.slice(-2).trim();
    setValues((prev) => ({ ...prev, [key]: v }));
    setStatus((prev) => {
      const m = new Map(prev);
      m.delete(key);
      return m;
    });
    setChecked(false);
    setWon(false);
  };

  const handleCheck = () => {
    const next = new Map();
    let allCorrect = true;
    let allFilled = true;

    Object.keys(answers).forEach((key) => {
      const user = (values[key] || "").trim();
      if (!user) {
        allFilled = false;
        allCorrect = false;
        return;
      }
      if (user === answers[key]) {
        next.set(key, "correct");
      } else {
        next.set(key, "wrong");
        allCorrect = false;
      }
    });

    setStatus(next);
    setChecked(true);

    if (allFilled && allCorrect) {
      setWon(true);
      onComplete?.(1);
    }
  };

  const reset = () => {
    const init = {};
    Object.keys(answers).forEach((k) => {
      init[k] = "";
    });
    setValues(init);
    setStatus(new Map());
    setWon(false);
    setChecked(false);
  };

  const toGujaratiNum = (num) => {
    const gujaratiDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
    return String(num).replace(/\d/g, (digit) => gujaratiDigits[digit]);
  };

  return (
    <div className="space-y-4">
      {/* Title row — full width */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-gu text-[22px] font-semibold text-[#e48d0b]">
          {puzzle.title}
        </p>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5
                     bg-black/[0.04] dark:bg-white/[0.08] cursor-pointer
                     font-gu text-[15px] font-semibold text-ink/70 dark:text-ink-dark/70
                     hover:bg-[#e48d0b]/12 hover:text-[#e48d0b] transition-colors"
        >
          <RotateCcw size={16} />
          ફરી શરૂ
        </button>
      </div>

      {/* Desktop: 70% left (grid) + 30% right (clues) | Mobile: stack */}
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-5 lg:gap-6 items-start">
        {/* LEFT — grid + check */}
        <div className="min-w-0 space-y-4">
          <p className="text-center font-gu text-[17px] text-ink/50 dark:text-ink-dark/50">
            દરેક ખાનામાં એક અક્ષર લખો
          </p>

          <div className="flex justify-center">
            <div
              className="inline-grid gap-0.5 rounded-2xl
                         bg-white dark:bg-white/[0.04]
                         shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                         dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {layout.map((row, r) =>
                row.map((cell, c) => {
                  const key = cellKey(r, c);
                  if (cell === "#") {
                    return (
                      <div
                        key={key}
                        className="h-9 w-9 sm:h-15 sm:w-15 rounded-sm bg-ink dark:bg-ink-dark/90"
                      />
                    );
                  }

                  const num = numbers[key];
                  const st = status.get(key);
                  let borderCls =
                    "border border-black/15 dark:border-white/15 bg-white dark:bg-white/[0.06]";
                  if (st === "correct")
                    borderCls = "border border-emerald-500/40 bg-emerald-500/20";
                  if (st === "wrong")
                    borderCls = "border border-red-500/40 bg-red-500/15";

                  return (
                    <div
                      key={key}
                      className={`relative h-9 w-9 sm:h-15 sm:w-15 rounded-sm ${borderCls}`}
                    >
                      {num != null && (
                        <span className="absolute top-0.5 left-0.5 text-[8px] sm:text-[12px] font-gu font-bold text-ink/50 dark:text-ink-dark/50 leading-none">
                          {toGujaratiNum(num)}
                        </span>
                      )}
                      <input
                        type="text"
                        value={values[key] || ""}
                        onChange={(e) => onChange(key, e.target.value)}
                        disabled={won}
                        maxLength={2}
                        className={`
                          h-full w-full text-center font-gu text-sm sm:text-[25px] font-bold
                          bg-transparent outline-none pt-1
                          ${st === "correct"
                            ? "text-emerald-700 dark:text-emerald-300"
                            : st === "wrong"
                              ? "text-red-600 dark:text-red-400"
                              : "text-ink dark:text-ink-dark"
                          }
                          focus:bg-[#e48d0b]/10
                          disabled:opacity-90
                        `}
                        aria-label={`cell ${r}-${c}`}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Check Button managed to match layout width cleanly */}
          <div className="flex justify-center">
            <div className="w-full max-w-[320px]">
              <button
                type="button"
                onClick={handleCheck}
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
            </div>
          </div>

          {checked && !won && (
            <p className="text-center font-gu text-[15px] text-ink/60 dark:text-ink-dark/60">
              <span className="text-emerald-600 font-semibold">લીલું</span> = સાચું
              {" · "}
              <span className="text-red-600 font-semibold">લાલ</span> = ખોટું
            </p>
          )}

          {won && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                <Trophy className="w-6 h-6" />
              </div>
              <p className="font-gu text-lg font-bold text-ink dark:text-ink-dark">
                સરસ! ક્રોસવર્ડ પૂર્ણ 🎉
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-3 rounded-full bg-[#e48d0b] hover:bg-[#a06d20] px-6 py-2 font-gu text-sm font-bold text-white transition-all"
              >
                ફરી રમો
              </button>
            </div>
          )}
        </div>

        {/* RIGHT — clues (below button content on mobile, side on desktop) */}
        <div className="min-w-0 space-y-4">
          <div>
            <h3 className="font-gu text-[20px] font-semibold text-[#e48d0b] mb-2">
              આડી (ACROSS)
            </h3>
            <ul className="space-y-1.5">
              {across.map((item) => (
                <li
                  key={`a-${item.num}`}
                  className="font-gu text-xs sm:text-[17px] text-ink/80 dark:text-ink-dark/80 font-semibold"
                >
                  <span className="text-ink dark:text-ink-dark">
                    {toGujaratiNum(item.num)}.
                  </span>{" "}
                  {item.clue}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-gu text-[20px] font-semibold text-[#e48d0b] mb-2">
              ઊભી (DOWN)
            </h3>
            <ul className="space-y-1.5">
              {down.map((item) => (
                <li
                  key={`a-${item.num}`}
                  className="font-gu text-xs sm:text-[17px] text-ink/80 dark:text-ink-dark/80 font-semibold"
                >
                  <span className="text-ink dark:text-ink-dark">
                    {toGujaratiNum(item.num)}.
                  </span>{" "}
                  {item.clue}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}