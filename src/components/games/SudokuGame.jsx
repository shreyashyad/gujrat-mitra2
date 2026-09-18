import { useState, useMemo, useCallback } from "react";
import { Trophy, RotateCcw, CheckCircle2 } from "lucide-react";
import { defaultSudoku } from "../../data/sudoku.js";

function cloneGrid(g) {
  return g.map((row) => [...row]);
}

export default function SudokuGame({ onComplete }) {
  const puzzleData = defaultSudoku;
  const fixed = useMemo(() => cloneGrid(puzzleData.puzzle), [puzzleData]);

  const [grid, setGrid] = useState(() => cloneGrid(puzzleData.puzzle));
  const [cellStatus, setCellStatus] = useState(() => new Map());
  const [won, setWon] = useState(false);
  const [checked, setChecked] = useState(false);

  const isFixed = useCallback((r, c) => fixed[r][c] !== 0, [fixed]);

  const toGujaratiNum = (num) => {
    if (num === 0 || num === "" || num == null) return "";
    const gujaratiDigits = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
    return String(num).replace(/\d/g, (digit) => gujaratiDigits[digit]);
  };

  const onInput = (r, c, raw) => {
    if (isFixed(r, c) || won) return;
    const cleaned = raw.replace(/\D/g, "").slice(-1);
    const num = cleaned === "" ? 0 : Math.min(9, Math.max(0, parseInt(cleaned, 10)));

    setGrid((prev) => {
      const next = cloneGrid(prev);
      next[r][c] = num;
      return next;
    });
    setCellStatus((prev) => {
      const m = new Map(prev);
      m.delete(`${r}-${c}`);
      return m;
    });
    setChecked(false);
    setWon(false);
  };

  const handleCheck = () => {
    const status = new Map();
    let allFilled = true;
    let allCorrect = true;

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (isFixed(r, c)) continue;
        const val = grid[r][c];
        if (val === 0) {
          allFilled = false;
          allCorrect = false;
          continue;
        }
        const key = `${r}-${c}`;
        if (val === puzzleData.solution[r][c]) {
          status.set(key, "correct");
        } else {
          status.set(key, "wrong");
          allCorrect = false;
        }
      }
    }

    setCellStatus(status);
    setChecked(true);

    if (allFilled && allCorrect) {
      setWon(true);
      onComplete?.(1);
    }
  };

  const reset = () => {
    setGrid(cloneGrid(puzzleData.puzzle));
    setCellStatus(new Map());
    setWon(false);
    setChecked(false);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Title row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-gu text-[22px] font-semibold text-[#e48d0b]">
          {puzzleData.title}
          <span className="ml-2 font-normal text-ink/50 dark:text-ink-dark/50">
            ({puzzleData.difficulty === "easy" ? "સરળ" : "મધ્યમ"})
          </span>
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

      {/* Desktop: 65% board | 35% tips */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-5 lg:gap-6 items-start">
        {/* LEFT — board + check */}
        <div className="min-w-0 space-y-4">
          <div className="flex justify-center w-full">
            <div
              className="inline-block rounded-2xl p-1.5 sm:p-2
                         bg-white dark:bg-white/[0.04]
                         shadow-[0_1px_3px_rgba(0,0,0,0.06)]
                         dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)]"
            >
              <div className="grid grid-cols-9 gap-0">
                {grid.map((row, r) =>
                  row.map((val, c) => {
                    const key = `${r}-${c}`;
                    const fixedCell = isFixed(r, c);
                    const status = cellStatus.get(key);
                    const thickRight = c === 2 || c === 5;
                    const thickBottom = r === 2 || r === 5;

                    let cellBg = fixedCell
                      ? "bg-black/[0.05] dark:bg-white/[0.07] text-ink dark:text-ink-dark"
                      : "bg-transparent text-[#e48d0b] dark:text-[#e6c27a]";

                    if (status === "correct") {
                      cellBg =
                        "bg-emerald-500/25 text-emerald-800 dark:text-emerald-300";
                    } else if (status === "wrong") {
                      cellBg = "bg-red-500/25 text-red-600 dark:text-red-400";
                    }

                    return (
                      <div
                        key={key}
                        className={`
                          relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center
                          border border-black/10 dark:border-white/10
                          ${thickRight ? "border-r-2 border-r-black/30 dark:border-r-white/25" : ""}
                          ${thickBottom ? "border-b-2 border-b-black/30 dark:border-b-white/25" : ""}
                          ${cellBg}
                        `}
                      >
                        {fixedCell ? (
                          <span className="font-gu text-sm sm:text-base font-bold">
                            {toGujaratiNum(val)}
                          </span>
                        ) : (
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={val === 0 ? "" : toGujaratiNum(val)}
                            onChange={(e) => onInput(r, c, e.target.value)}
                            disabled={won}
                            className={`
                              h-full w-full text-center font-gu text-sm sm:text-base font-bold
                              bg-transparent outline-none
                              text-[#e48d0b] dark:text-[#e6c27a]
                              ${status === "correct" ? "text-emerald-800 dark:text-emerald-300" : ""}
                              ${status === "wrong" ? "text-red-600 dark:text-red-400" : ""}
                              focus:bg-[#e48d0b]/10
                              disabled:opacity-80
                            `}
                            aria-label={`row ${r + 1} col ${c + 1}`}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Check button */}
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
                સરસ! સુડોકુ પૂર્ણ 🎉
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

        {/* RIGHT — tips */}
        <div className="min-w-0 space-y-4">
          <div>
            <h3 className="font-gu text-[20px] font-semibold text-[#e48d0b] mb-2">
              સૂચના
            </h3>
            <p className="font-gu text-xs sm:text-[17px] text-ink/80 dark:text-ink-dark/80 font-semibold leading-relaxed">
              ખાલી ખાનામાં ૧–૯ લખો, પછી “ચેક કરો” દબાવો. દરેક પંક્તિ, સ્તંભ અને ૩×૩ બોક્સમાં ૧ થી ૯ એક વાર જ આવવા જોઈએ.
            </p>
          </div>

          <div>
            <h3 className="font-gu text-[20px] font-semibold text-[#e48d0b] mb-2">
              રંગની સમજ
            </h3>
            <ul className="space-y-1.5">
              <li className="font-gu text-xs sm:text-[17px] text-ink/80 dark:text-ink-dark/80 font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">લીલું</span>
                {" — "}સાચું
              </li>
              <li className="font-gu text-xs sm:text-[17px] text-ink/80 dark:text-ink-dark/80 font-semibold">
                <span className="text-red-600 dark:text-red-400">લાલ</span>
                {" — "}ખોટું
              </li>
              <li className="font-gu text-xs sm:text-[17px] text-ink/60 dark:text-ink-dark/60 font-semibold">
                ખાલી ખાનાં હજુ ભરવાના છે
              </li>
            </ul>
          </div>

          {checked && !won && (
            <p className="font-gu text-[15px] text-ink/60 dark:text-ink-dark/60">
              કેટલાંક ખાનાં ખોટા અથવા ખાલી છે — ફરી તપાસો.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}