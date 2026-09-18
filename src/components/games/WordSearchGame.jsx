import { useState, useCallback, useMemo } from "react";
import { Trophy, RotateCcw, Check } from "lucide-react";
import { wordSearchPuzzle } from "../../data/wordSearch.js";

function cellKey(r, c) {
  return `${r}-${c}`;
}

function sameCell(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

function cellsEqual(a, b) {
  if (a.length !== b.length) return false;
  const same = a.every((p, i) => p[0] === b[i][0] && p[1] === b[i][1]);
  if (same) return true;
  return a.every(
    (p, i) =>
      p[0] === b[b.length - 1 - i][0] && p[1] === b[b.length - 1 - i][1]
  );
}

/** Adjacent including diagonal (king-move) */
function isAdjacent(a, b) {
  if (!a || !b) return false;
  const dr = Math.abs(a[0] - b[0]);
  const dc = Math.abs(a[1] - b[1]);
  return dr <= 1 && dc <= 1 && !(dr === 0 && dc === 0);
}

/**
 * Path must stay on one straight line (H / V / diagonal).
 */
function staysStraight(path, next) {
  if (path.length === 0) return true;
  if (path.length === 1) return isAdjacent(path[0], next);

  const [r0, c0] = path[0];
  const [r1, c1] = path[1];
  const dr = r1 - r0;
  const dc = c1 - c0;

  const sr = dr === 0 ? 0 : dr / Math.abs(dr);
  const sc = dc === 0 ? 0 : dc / Math.abs(dc);

  const last = path[path.length - 1];
  const expected = [last[0] + sr, last[1] + sc];
  return sameCell(expected, next);
}

export default function WordSearchGame({ onComplete }) {
  const puzzle = wordSearchPuzzle;
  const { grid, words } = puzzle;

  const [foundIds, setFoundIds] = useState(() => new Set());
  const [path, setPath] = useState([]);

  const foundCells = useMemo(() => {
    const set = new Set();
    words.forEach((w) => {
      if (foundIds.has(w.id)) {
        w.cells.forEach(([r, c]) => set.add(cellKey(r, c)));
      }
    });
    return set;
  }, [foundIds, words]);

  const pathSet = useMemo(() => {
    const s = new Set();
    path.forEach(([r, c]) => s.add(cellKey(r, c)));
    return s;
  }, [path]);

  const tryMatch = useCallback(
    (currentPath) => {
      if (currentPath.length < 2) return false;
      for (const w of words) {
        if (foundIds.has(w.id)) continue;
        if (cellsEqual(currentPath, w.cells)) {
          setFoundIds((prev) => {
            const next = new Set(prev);
            next.add(w.id);
            if (next.size === words.length && onComplete) {
              setTimeout(() => onComplete?.(next.size), 400);
            }
            return next;
          });
          return true;
        }
      }
      return false;
    },
    [words, foundIds, onComplete]
  );

  const onCellClick = (r, c) => {
    const clicked = [r, c];

    setPath((prev) => {
      if (prev.length === 0) {
        return [clicked];
      }

      if (sameCell(prev[prev.length - 1], clicked)) {
        return prev.slice(0, -1);
      }

      if (prev.some((p) => sameCell(p, clicked))) {
        return prev;
      }

      if (!staysStraight(prev, clicked)) {
        return [clicked];
      }

      const nextPath = [...prev, clicked];
      const matched = tryMatch(nextPath);
      if (matched) {
        return [];
      }
      return nextPath;
    });
  };

  const reset = () => {
    setFoundIds(new Set());
    setPath([]);
  };

  const allFound = foundIds.size === words.length;

  return (
    <div className="space-y-4 w-full">
      {/* Title row — same as Crossword / Sudoku */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-gu text-[22px] font-semibold text-[#e48d0b]">
          મળ્યા: {foundIds.size} / {words.length}
          {path.length > 0 && (
            <span className="ml-2 font-normal text-ink/50 dark:text-ink-dark/50">
              — પસંદ: {path.length} અક્ષર
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          {path.length > 0 && (
            <button
              type="button"
              onClick={() => setPath([])}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5
                         bg-black/[0.04] dark:bg-white/[0.08] cursor-pointer
                         font-gu text-[15px] font-semibold text-ink/70 dark:text-ink-dark/70
                         hover:bg-red-500/10 hover:text-red-600 transition-colors"
            >
              રદ કરો
            </button>
          )}
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
      </div>

      {/* Desktop: 70% grid | 30% words+tips */}
      <div className="grid grid-cols-1 lg:grid-cols-[65%_35%] gap-5 lg:gap-6 items-start">
        {/* LEFT — grid + win */}
        <div className="min-w-0 space-y-4">
          <div className="flex justify-center w-full">
            <div
              className="inline-block rounded-2xl p-2 sm:p-3
                         bg-white dark:bg-white/[0.04]
                         shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                         dark:shadow-[0_1px_3px_rgba(0,0,0,0.25)]
                         select-none"
            >
              <div
                className="grid gap-0.5 sm:gap-1"
                style={{
                  gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
                }}
              >
                {grid.map((row, r) =>
                  row.map((letter, c) => {
                    const key = cellKey(r, c);
                    const isFound = foundCells.has(key);
                    const isActive = pathSet.has(key);

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => onCellClick(r, c)}
                        className={`flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg
                                   font-gu text-[11px] sm:text-[20px] font-medium transition-all duration-150
                                   ${
                                     isFound
                                       ? "bg-emerald-500/25 text-emerald-800 dark:text-emerald-300"
                                       : isActive
                                         ? "bg-[#e48d0b] text-white shadow-md"
                                         : "bg-black/[0.03] dark:bg-white/[0.06] text-ink dark:text-ink-dark hover:bg-[#e48d0b]/15"
                                   }`}
                      >
                        {letter}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {allFound && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600">
                <Trophy className="w-6 h-6" />
              </div>
              <p className="font-gu text-lg font-bold text-ink dark:text-ink-dark">
                સરસ! બધા શબ્દો મળી ગયા 🎉
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

        {/* RIGHT — word list + tip (Crossword clues style) */}
        <div className="min-w-0 space-y-4">
          <div>
            <h3 className="font-gu text-[20px] font-semibold text-[#e48d0b] mb-2">
              શોધો
            </h3>
            <ul className="space-y-1.5">
              {words.map((w) => {
                const found = foundIds.has(w.id);
                return (
                  <li
                    key={w.id}
                    className={`font-gu text-xs sm:text-[17px] font-semibold flex items-center gap-1.5 ${
                      found
                        ? "text-emerald-700 dark:text-emerald-400 line-through"
                        : "text-ink/80 dark:text-ink-dark/80"
                    }`}
                  >
                    {found && <Check size={16} className="shrink-0" />}
                    {w.name}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="font-gu text-[20px] font-semibold text-[#e48d0b] mb-2">
              સૂચના
            </h3>
            <p className="font-gu text-xs sm:text-[17px] text-ink/80 dark:text-ink-dark/80 font-semibold leading-relaxed">
              દરેક અક્ષર પર એક-એક ક્લિક કરો (સીધી લાઇનમાં). પૂરો શબ્દ મળતાં જ લીલું થશે.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}