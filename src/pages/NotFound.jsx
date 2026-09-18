import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface dark:bg-surface-dark px-4 py-16 relative overflow-hidden">
      {/* Soft ambient blobs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[520px] h-[520px] rounded-full bg-[#e48d0b]/[0.07] blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-[420px] h-[420px] rounded-full bg-[#d0466e]/[0.06] blur-[90px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Big 404 */}
        <div className="relative inline-block mb-8">
          <h1 className="font-gu text-[7.5rem] sm:text-[9.5rem] font-extrabold leading-none tracking-tighter text-[#e48d0b]/[0.5] dark:text-[#e48d0b]/[0.10] select-none">
            ૪૦૪
          </h1>
        </div>

        {/* Title + accent line */}
        <div className="mb-5">
          <h2 className="font-gu text-2xl sm:text-3xl font-bold text-ink dark:text-ink-dark tracking-tight">
            પેજ મળ્યું નથી
          </h2>
          <div className="mt-3 mx-auto h-[2px] w-16 rounded-full bg-gradient-to-r from-[#e48d0b] to-[#d0466e]/70" />
        </div>

        {/* Description */}
        <p className="font-gu text-[15px] sm:text-base text-ink/65 dark:text-ink-dark/65 leading-relaxed max-w-sm mx-auto mb-10">
          તમે જે પેજ શોધી રહ્યા છો તે કદાચ દૂર કરવામાં આવ્યું છે, <br /> અથવા અસ્થાયી રૂપે અપ્રાપ્ય છે.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5
                       px-7 py-3.5 rounded-full
                       bg-[#e48d0b] hover:bg-[#a36f20]
                       text-white font-gu font-semibold text-sm
                       shadow-[0_2px_8px_rgba(185,127,38,0.25)]
                       hover:shadow-[0_4px_12px_rgba(185,127,38,0.35)]
                       transition-all duration-200 active:scale-[0.97]"
          >
            <Home size={17} className="transition-transform group-hover:-translate-y-0.5" />
            મુખ્ય પૃષ્ઠ પર જાઓ
          </Link>

          <button
            onClick={() => window.history.back()}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5
                       px-7 py-3.5 rounded-full
                       bg-black/[0.04] dark:bg-white/[0.08]
                       hover:bg-black/[0.07] dark:hover:bg-white/[0.12]
                       text-ink dark:text-ink-dark
                       font-gu font-semibold text-sm
                       transition-all duration-200 active:scale-[0.97]"
          >
            <ArrowLeft size={17} className="transition-transform group-hover:-translate-x-0.5" />
            પાછા જાઓ
          </button>
        </div>

        {/* Footer */}
        <p className="mt-14 font-gu text-xs tracking-wide text-ink/35 dark:text-ink-dark/35">
          ગુજરાત મિત્ર પરિવાર
        </p>
      </div>
    </div>
  );
}