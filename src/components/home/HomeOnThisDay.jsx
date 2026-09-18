import { CheckCircle2 } from "lucide-react";
import onThisDay from "../../data/onthisday.js";

export default function HomeOnThisDay() {
    const entry = onThisDay[0];

    if (!entry) return null;

    return (
        <section className="mt-6 md:hidden">
            {/* Section Header */}
            <div className="mb-2 flex items-center gap-2">
                <h2 className="font-gu text-2xl font-bold text-[#e48d0b] ">
                    ઇતિહાસમાં આજે
                </h2>
                <span className="flex items-center gap-0.5">
                    <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
                    <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
                    <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
                    <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
                </span>
            </div>

            {/* Main Content Card */}
            <article className="rounded-xl border border-black/10 bg-white px-4 py-4 dark:border-white/10 dark:bg-white/3">
                <p className="font-gu text-[18px] font-semibold text-ink/45 dark:text-ink-dark/45">
                    {entry.date}
                </p>

                <div className="mt-1 space-y-3">
                    {entry.items.map((item, index) => (
                        <div
                            key={`${entry.date}-${index}`}
                            className="flex gap-2 font-gu text-[18px] font-medium leading-[1.25] text-ink dark:text-ink-dark"
                        >
                            <span className="shrink-0 select-none">-</span>
                            <p className="min-w-0 flex-1">{item}</p>
                        </div>
                    ))}
                </div>
            </article>
        </section>
    );
}   