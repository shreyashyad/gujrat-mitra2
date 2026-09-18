// src/components/aapniAaj/SkyCard.jsx
import { useEffect, useState } from "react";
import { getSunMarker } from "../../utils/aapniAajUtils.js";

// Moon marker helper (same arc logic)
function getMoonMarker(nowMin, moonriseMin, moonsetMin) {
  // Normalize times
  let rise = moonriseMin;
  let set = moonsetMin;

  // Handle overnight moon (when set is next day)
  if (set < rise) set += 1440;

  let progress = 0;
  let up = false;

  const t = nowMin < rise && set > 1440 ? nowMin + 1440 : nowMin;

  if (t >= rise && t <= set) {
    up = true;
    progress = (t - rise) / (set - rise);
  } else if (t > set) {
    progress = 1;
  }

  progress = Math.max(0, Math.min(1, progress));

  // Use same sun path math
  const SUN_PHASE = 0.6;
  const SUN_BASELINE = 108;
  const SUN_AMPLITUDE = 40;
  const SUN_WIDTH = 320;

  const totalRange = Math.PI + 2 * SUN_PHASE;
  let theta;

  if (up) {
    theta = progress * Math.PI;
  } else if (nowMin < rise) {
    theta = -SUN_PHASE * 0.6;
  } else {
    theta = Math.PI + SUN_PHASE * 0.6;
  }

  const x = ((theta + SUN_PHASE) / totalRange) * SUN_WIDTH;
  const y = SUN_BASELINE - SUN_AMPLITUDE * Math.sin(theta);

  return { x, y, up };
}

export default function SkyCard({ cityData }) {
  const [sun, setSun] = useState(() => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return getSunMarker(nowMin, cityData.sunriseMin, cityData.sunsetMin);
  });

  const [moon, setMoon] = useState(() => {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    return getMoonMarker(nowMin, cityData.moonriseMin, cityData.moonsetMin);
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nowMin = now.getHours() * 60 + now.getMinutes();
      setSun(getSunMarker(nowMin, cityData.sunriseMin, cityData.sunsetMin));
      setMoon(getMoonMarker(nowMin, cityData.moonriseMin, cityData.moonsetMin));
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [cityData]);

  return (
    <div className="rounded-[20px] p-4 sm:p-5 mb-4 overflow-hidden">
      <svg className="w-full h-auto" viewBox="0 50 320 90">
        {/* Horizon line */}
        <line
          x1="0"
          y1="108"
          x2="320"
          y2="108"
          stroke="#d1d5db"
          strokeWidth="1"
        />

        {/* Full path (background track) */}
        <path
          d={sun.pathD}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength="100"
        />

        {/* Sun progress path (golden) */}
        <path
          d={sun.pathD}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={sun.dasharray}
        />

        {/* Soft glow behind sun */}
        <circle
          cx={sun.x}
          cy={sun.y}
          r="16"
          fill="#fbbf24"
          opacity={sun.up ? 0.25 : 0.12}
        />

        {/* Main Sun */}
        <circle
          cx={sun.x}
          cy={sun.y}
          r="10"
          fill="#f59e0b"
          stroke="#d97706"
          strokeWidth="2"
          opacity={sun.up ? 1 : 0.4}
        />

        {/* Moon */}
        <circle
          cx={moon.x}
          cy={moon.y}
          r="8"
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="1.5"
          opacity={moon.up ? 0.95 : 0.35}
        />
        {/* Moon crater detail */}
        <circle
          cx={moon.x - 2.5}
          cy={moon.y - 1.5}
          r="2"
          fill="#cbd5e1"
          opacity={moon.up ? 0.7 : 0.25}
        />
      </svg>

      {/* Times */}
      <div className="flex justify-between mt-2">
        <div>
          <div className="text-[20px] text-ink font-gu font-semibold">સૂર્યોદય</div>
          <div className="text-[17px] font-gu text-ink/80 font-extrabold">
            {cityData.sunriseStr}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[20px] text-ink font-gu font-semibold">સૂર્યાસ્ત</div>
          <div className="text-[17px] font-gu text-ink/80 font-extrabold">
            {cityData.sunsetStr}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-4 pt-3 border-t border-gray-200 dark:border-white/10">
        <div>
          <div className="text-[20px] text-ink font-gu font-semibold">ચંદ્રોદય</div>
          <div className="text-[17px] font-gu text-ink/80 font-bold">
            {cityData.moonriseStr}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[20px] text-ink font-gu font-semibold">ચંદ્રાસ્ત</div>
          <div className="text-[17px] font-gu text-ink/80 font-bold">
            {cityData.moonsetStr}
          </div>
        </div>
      </div>
    </div>
  );
}