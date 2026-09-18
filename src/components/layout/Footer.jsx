// ============================================================
// FILE: src/components/layout/Footer.jsx  (updated)
// ============================================================
import ArogyaJivansaili from "./Footer/ArogyaJivansaili.jsx";
import BharatOfbitVigyanTech from "./Footer/BharatOfbitVigyanTech.jsx";
import ManoranjanMusafariArogyaRmtgmt from "./Footer/ManoranjanMusafariArogyaRmtgmt.jsx";

export default function Footer() {
  return (
    <div className="hidden md:block mx-auto max-w-[1440px] space-y-[-10px]">
      {/* Part 1 */}
      <ArogyaJivansaili />

      {/* Part 2 */}
      <BharatOfbitVigyanTech />

      {/* Part 3 */}
      <ManoranjanMusafariArogyaRmtgmt />

    </div>
  );
}