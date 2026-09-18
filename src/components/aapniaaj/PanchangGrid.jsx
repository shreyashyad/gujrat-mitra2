// src/components/aapniaaj/PanchangGrid.jsx
import { Share } from "lucide-react";

function Card({ emoji, label, value, nature, className = "" }) {
  const valueColor =
    nature === "good"
      ? "text-emerald-600 dark:text-emerald-400"
      : nature === "bad"
        ? "text-rose-600 dark:text-rose-400"
        : "text-ink dark:text-ink-dark";

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl bg-white dark:bg-white/[0.04] border border-gray-200/70 dark:border-white/10 p-2 px-3 py-2.5 min-w-0 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_10px_rgba(0,0,0,0.04)] transition-transform duration-200 ease-in-out hover:-translate-y-0.5 cursor-default h-full ${className}`}
    >
      {emoji && (
        <span className="text-3xl shrink-0 w-12 text-center leading-none">
          {emoji}
        </span>
      )}
      <div className="min-w-0 flex flex-col leading-[1.35]">
        <span className="font-gu text-[18px] text-ink/60 dark:text-ink-dark/50 font-semibold">
          {label}
        </span>
        <span className={`font-gu sm:text-[25px] font-medium ${valueColor}`}>
          {value}
        </span>
      </div>
    </div>
  );
}

/* Special tall card for આજનો દિવસ */
function TodayDayCard({
  dateStr,
  weekday,
  tithi,
  paksha,
  displayTithi,
  className = "",
}) {
  const handleShare = async () => {
    const shareData = {
      title: `${tithi} - આજનું પંચાંગ`,
      text: `આજનો દિવસ: ${tithi} (${paksha}), ${dateStr}, ${displayTithi}, ${weekday}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Share failed", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        alert("લિંક અને માહિતી ક્લિપબોર્ડમાં કોપી થઈ ગઈ છે!");
      } catch (err) {
        console.error("Clipboard failed", err);
      }
    }
  };

  return (
    <div
      className={`rounded-xl bg-white dark:bg-white/[0.04] border border-gray-200/70 dark:border-white/10 p-3 sm:p-4 min-w-0 shadow-[0_1px_2px_rgba(0,0,0,0.03),0_0_10px_rgba(0,0,0,0.04)] transition-transform duration-200 ease-in-out hover:-translate-y-0.5 cursor-default h-full ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 h-full">
        {/* LEFT SIDE — Width 35% */}
        <div className="w-full sm:w-[35%] shrink-0 min-w-0 flex flex-col justify-center gap-1">
          <span className="font-gu text-[18px] text-ink/60 dark:text-ink-dark/50 font-semibold leading-tight flex justify-between gap-2 items-center">
            <div>આજનો દિવસ</div>
            <div className="font-gu text-[16px] font-medium dark:text-ink-dark text-right sm:text-left bg-white border border-[#e48d0b] rounded-3xl p-1 text-[#e48d0b]">
              {paksha}
            </div>
          </span>
          <span className="font-gu text-[22px] sm:text-[30px] font-medium text-ink dark:text-ink-dark leading-tight">
            {tithi}
          </span>
          <span className="font-gu text-[22px] font-medium text-ink/60 dark:text-ink-dark leading-tight">
            {dateStr}, {weekday}
          </span>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-3xl  text-ink font-gu font-bold text-[20px] hover:bg-[#e48d0b]/10 transition-colors cursor-pointer"
            >
              <Share className="w-6 h-6" />
              {/* <span>ચોઘડિયા શેર કરો</span> */}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE — Width 65% */}
        <div className="w-full sm:w-[65%] min-w-0 flex flex-col justify-center sm:border-l sm:border-black/[0.08] dark:sm:border-white/[0.08] sm:pl-6 leading-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              "ગુરુ નાનક જયંતિ",
              "દેવ દિવાળી",
              "વ્રતની પૂનમ",
              "ત્રિપુરારી પૂર્ણિમા",
              "ભીષ્મ પંચક વ્રત",
              "તુલસી વિવાહ",
              "કાર્તિક સ્નાન",
              "કાર્તિક સ્વામી દર્શન",
              "ગુરુ તેગબહાદુર દિન",
              "સિદ્ધરાયલ યાત્રા (જૈન)",
            ].map((item, index) => (
              <div
                key={index}
                className="group relative flex items-center justify-between"
              >
                <span className="font-gu text-[21px] font-medium text-ink/85 transition-colors duration-300 group-hover:text-[#e48d0b] dark:text-ink-dark/85 dark:group-hover:text-[#e6c27a]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PanchangGrid({ data }) {
  if (!data) return null;

  const {
    temp,
    humidity,
    aqi,
    rain,
    dayStatus,
    nakshatra,
    rashi,
    yoga,
    karan,
    islamicDate,
    islamicDay,
    parsiDate,
    parsiDay,
    rahukaal,
    ayan,
    weekday,
    dateStr,
    tithi,
    displayTithi = "વિક્રમ સંવત ૨૦૮૨, અષાઢ સુદ પૂનમ",
    paksha,
  } = data;

  return (
    <div className="mb-4 space-y-2.5">
      {/* ========== ROW 2-3: આજનો દિવસ (tall left) + 2×2 right ========== */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
        style={{ gridTemplateRows: "auto auto" }}
      >
        {/* Tall left – rich આજનો દિવસ card */}
        <div className="col-span-2 row-span-2">
          <TodayDayCard
            dateStr={dateStr}
            paksha={paksha}
            weekday={weekday}
            tithi={displayTithi}
            className="min-h-[148px] sm:min-h-full"
          />
        </div>

        {/* Right 2×2 */}
        <Card emoji="⭐" label="નક્ષત્ર" value={nakshatra} />
        <Card emoji="♈" label="આજની રાશી" value={rashi} />
        <Card emoji="🧘" label="યોગ" value={yoga} />
        <Card emoji="📿" label="કરણ" value={karan} />
      </div>

      {/* ========== ROW 5: રાહુકાળ (wide) + અયન + દિવસ (શુભ) ========== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="col-span-2">
          <Card emoji="🌑" label="રાહુકાળ" value={rahukaal} />
        </div>
        <Card emoji={ayan?.emoji || "🧭"} label="અયન" value={ayan?.value} />
        <Card
          emoji={dayStatus?.emoji || "✅"}
          label="દિવસ"
          value={dayStatus?.value}
          nature={dayStatus?.nature}
        />
      </div>

      {/* ========== ROW 4: Islamic + Parsi ========== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <Card emoji="🕌" label="ઇસ્લામિક તારીખ" value={islamicDate} />
        <Card emoji="📅" label="ઇસ્લામિક દિવસ" value={islamicDay} />
        <Card emoji="🔥" label="પારસી તારીખ" value={parsiDate} />
        <Card emoji="📆" label="પારસી દિવસ" value={parsiDay} />
      </div>
    </div>
  );
}