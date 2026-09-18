// src/components/common/SideAds.jsx

export function AdBox({ side }) {
  return (
    <div
      className="flex h-[600px] w-full max-w-[120px] flex-col items-center justify-center gap-1
                 overflow-hidden rounded-2xl border border-dashed border-black/20 bg-gray-200
                 text-center shadow-sm dark:border-white/10 dark:bg-surface-dark"
      aria-label={side === "left" ? "ડાબી બાજુ જાહેરાત" : "જમણી બાજુ જાહેરાત"}
    >
      <span className="font-gu text-[11px] leading-tight text-ink/30 dark:text-ink-dark/30">
        જાહેરાત
      </span>
      <span className="text-[10px] leading-tight text-ink/20 dark:text-ink-dark/20">
        Advertisement
      </span>
    </div>
  );
}

export const AD_RAIL_MAX_WIDTH = "max-w-[1792px]";
export const AD_RAIL_GRID_COLS = "xl:grid-cols-[160px_minmax(0,1fr)_160px]";
export const AD_RAIL_GAP = "gap-4 lg:gap-4";
export const AD_RAIL_PADDING = "px-3.5 sm:px-2";

// Header ni niche j (~16px gap) FIXED — scroll thay to pan hंमेशा viewport ma dekhાય.
// Header.jsx (--sticky-header-h) dwara live update thatu CSS var vaparay che.
export default function SideAdRail() {
  return (
    <div
      className={`pointer-events-none fixed left-1/2 hidden w-full -translate-x-1/2 grid-cols-1 ${AD_RAIL_GRID_COLS} ${AD_RAIL_GAP} ${AD_RAIL_PADDING} ${AD_RAIL_MAX_WIDTH} xl:grid`}
      style={{
        top: "calc(var(--sticky-header-h, 0px) + 45px)",
        height: "calc(100vh - var(--sticky-header-h, 0px) - 16px)",
        zIndex: 45,
      }}
    >
      <div className="pointer-events-auto flex justify-center -translate-x-3">
        <AdBox side="left" />
      </div>

      <div />

      <div className="pointer-events-auto flex justify-center -translate-x-1">
        <AdBox side="right" />
      </div>
    </div>
  );
}