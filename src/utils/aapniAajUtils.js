// src/utils/aapniAajUtils.js
import {
  CHOGH_ROTATION,
  CHOGH_DAY_START,
  CHOGH_NIGHT_START,
  CHOGH_LABEL_GU,
  CHOGH_NATURE,
  RAHU_SEGMENT_BY_WEEKDAY,
  GU_MONTHS,
  GU_DAYS,
} from "../data/aapniAajData.js";

const GUJ_DIGITS = {
  0: "૦",
  1: "૧",
  2: "૨",
  3: "૩",
  4: "૪",
  5: "૫",
  6: "૬",
  7: "૭",
  8: "૮",
  9: "૯",
};

export function toGuDigits(str) {
  return String(str).replace(/[0-9]/g, (d) => GUJ_DIGITS[d]);
}

// ગુજરાતીમાં સવારે, બપોરે, સાંજે, રાત્રે સાથે સમય દર્શાવવા માટે ફંક્શન
export function formatMin(min) {
  min = ((min % 1440) + 1440) % 1440;
  let h = Math.floor(min / 60);
  const m = min % 60;

  // સમયગાળા મુજબ ગુજરાતી લેબલ
  let period = "સવારે";
  if (h >= 12 && h < 16) {
    period = "બપોરે";
  } else if (h >= 16 && h < 20) {
    period = "સાંજે";
  } else if (h >= 20 || h < 4) {
    period = "રાત્રે";
  }

  let h12 = h % 12;
  if (h12 === 0) h12 = 12;

  const timeStr =
    toGuDigits(String(h12).padStart(2, "0")) +
    ":" +
    toGuDigits(String(m).padStart(2, "0"));

  return `${timeStr} ${period}`;
}

export function toISODate(d = new Date()) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

export function guDateLabel(d = new Date()) {
  return `${toGuDigits(d.getDate())} ${GU_MONTHS[d.getMonth()]} ${toGuDigits(
    d.getFullYear()
  )} • ${GU_DAYS[d.getDay()]}`;
}

function choghSequence(startName) {
  const startIdx = CHOGH_ROTATION.indexOf(startName);
  const seq = [];
  for (let i = 0; i < 8; i++) {
    seq.push(CHOGH_ROTATION[(startIdx + i) % 7]);
  }
  return seq;
}

export function computeChoghadiya(sunriseMin, sunsetMin, now = new Date()) {
  const weekday = now.getDay();
  const nowMinRaw = now.getHours() * 60 + now.getMinutes();
  const effectiveNow = nowMinRaw < sunriseMin ? nowMinRaw + 1440 : nowMinRaw;

  const dayDur = (sunsetMin - sunriseMin) / 8;
  const daySeq = choghSequence(CHOGH_DAY_START[weekday]);
  const daySlots = daySeq.map((name, i) => {
    const start = sunriseMin + i * dayDur;
    const end = sunriseMin + (i + 1) * dayDur;
    return {
      name,
      label: CHOGH_LABEL_GU[name],
      nature: CHOGH_NATURE[name],
      start,
      end,
      isNow: effectiveNow >= start && effectiveNow < end,
    };
  });

  const nextSunriseMin = sunriseMin + 1440;
  const nightDur = (nextSunriseMin - sunsetMin) / 8;
  const nightSeq = choghSequence(CHOGH_NIGHT_START[weekday]);
  const nightSlots = nightSeq.map((name, i) => {
    const start = sunsetMin + i * nightDur;
    const end = sunsetMin + (i + 1) * nightDur;
    return {
      name,
      label: CHOGH_LABEL_GU[name],
      nature: CHOGH_NATURE[name],
      start,
      end,
      isNow: effectiveNow >= start && effectiveNow < end,
    };
  });

  return { daySlots, nightSlots };
}

export function computeRahukaal(sunriseMin, sunsetMin, date = new Date()) {
  const segLen = (sunsetMin - sunriseMin) / 8;
  const seg = RAHU_SEGMENT_BY_WEEKDAY[date.getDay()];
  const start = sunriseMin + (seg - 1) * segLen;
  const end = sunriseMin + seg * segLen;
  return {
    start,
    end,
    label: `${formatMin(Math.round(start))} થી ${formatMin(Math.round(end))}`,
  };
}

// પંચાંગ કાર્ડ્સ - Day અને Dark Mode બંનેમાં સરળતાથી વંચાય તે માટે કસ્ટમ ક્લાસ ઉમેરેલા છે
export function buildPanchangCards({ city, weather, rahukaalStr }) {
  return [
    { emoji: "🌡️", label: `${city} હવામાન`, value: weather || "30°C, વાદળછાયું" },
    { emoji: "🌧️", label: "વરસાદની શક્યતા", value: "35%" },
    { emoji: "🕉️", label: "હિન્દુ પંચાંગ", value: "ગુરુ પૂર્ણિમા" },
    { emoji: "☪️", label: "ઇસ્લામિક તારીખ", value: "૨૪ મુહર્રમ ૧૪૪૮" },
    { emoji: "✝️", label: "ખ્રિસ્તી તારીખ", value: "૧૦ જુલાઈ ૨૦૨૬" },
    { emoji: "🌙", label: "પક્ષ", value: "શુક્લ પક્ષ" },
    { emoji: "⏰", label: "રાહુકાળ", value: rahukaalStr },
    { emoji: "☀️", label: "અયન", value: "દક્ષિણાયન" },
    { emoji: "🔯", label: "યોગ", value: "સિદ્ધિ યોગ" },
    { emoji: "🌦️", label: "ઋતુ", value: "વર્ષા ઋતુ" },
    { emoji: "◐", label: "કરણ", value: "બવ કરણ" },
    { emoji: "⭐", label: "નક્ષત્ર", value: "ઉત્તરાષાઢા" },
    { emoji: "♊", label: "આજની રાશી", value: "મિથુન, ૨૪:૧૮ પછી કર્ક" },
    { emoji: "📅", label: "દિવસ", value: "શુભ" },
  ];
}

export function computeJainTimings(sunriseMin, sunsetMin) {
  const dayLen = sunsetMin - sunriseMin;
  return [
    { name: "જૈન તિથિ", value: "અષાઢ સુદ ૧૪", isText: true },
    { name: "નવકારશી", value: formatMin(sunriseMin + 48) },
    { name: "ચૌવિહાર", value: formatMin(sunsetMin) },
    { name: "પોરસી", value: formatMin(sunriseMin + dayLen / 4) },
    { name: "સાઢપોરસી", value: formatMin(sunriseMin + (3 * dayLen) / 8) },
    { name: "પુરિમઢ્ઢ", value: formatMin(sunriseMin + dayLen / 2) },
    { name: "અવઢ્ઢ", value: formatMin(sunriseMin + (3 * dayLen) / 4) },
  ];
}

/* Sun path helpers */
const SUN_BASELINE = 108;
const SUN_AMPLITUDE = 40;
const SUN_PHASE = 0.6;
const SUN_WIDTH = 320;

export function sunPoint(theta) {
  const totalRange = Math.PI + 2 * SUN_PHASE;
  const x = ((theta + SUN_PHASE) / totalRange) * SUN_WIDTH;
  const y = SUN_BASELINE - SUN_AMPLITUDE * Math.sin(theta);
  return { x, y };
}

export function buildSunPathD() {
  let d = "";
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const theta = -SUN_PHASE + (Math.PI + 2 * SUN_PHASE) * (i / steps);
    const pt = sunPoint(theta);
    d += (i === 0 ? "M" : "L") + pt.x.toFixed(1) + "," + pt.y.toFixed(1) + " ";
  }
  return d.trim();
}

export function arcState(nowMin, startMin, endMin) {
  for (const t of [nowMin, nowMin + 1440]) {
    if (t >= startMin && t <= endMin) {
      return { up: true, progress: (t - startMin) / (endMin - startMin) };
    }
  }
  return { up: false, progress: nowMin < startMin ? 0 : 1 };
}

export function getSunMarker(nowMin, sunriseMin, sunsetMin) {
  const state = arcState(nowMin, sunriseMin, sunsetMin);
  const p = Math.max(0, Math.min(1, state.progress));
  let sunTheta;
  if (state.up) {
    sunTheta = p * Math.PI;
  } else if (nowMin < sunriseMin) {
    const preDawnFrac =
      sunriseMin > 0 ? Math.max(0, Math.min(1, nowMin / sunriseMin)) : 1;
    sunTheta = -SUN_PHASE * (1 - preDawnFrac);
  } else {
    const postDuskFrac = Math.max(
      0,
      Math.min(1, (nowMin - sunsetMin) / (1440 - sunsetMin))
    );
    sunTheta = Math.PI + SUN_PHASE * postDuskFrac;
  }
  const pt = sunPoint(sunTheta);
  const totalRange = Math.PI + 2 * SUN_PHASE;
  const skipFrac = (SUN_PHASE / totalRange) * 100;
  const goldLen = ((p * Math.PI) / totalRange) * 100;
  return {
    ...pt,
    up: state.up,
    dasharray: `0 ${skipFrac.toFixed(1)} ${goldLen.toFixed(1)} 1000`,
    pathD: buildSunPathD(),
  };
}