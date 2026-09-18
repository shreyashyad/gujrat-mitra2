import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MoveUp } from 'lucide-react'

const SCROLL_SHOW_THRESHOLD = 400;

export default function BackToTop() {
    const [isPastThreshold, setIsPastThreshold] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    // Robust scroll detection: poll via requestAnimationFrame and check every
    // possible scroll owner (window, <html>, <body>).
    useEffect(() => {
        let rafId;

        const tick = () => {
            const winScrollY = window.scrollY || window.pageYOffset || 0;
            const htmlScrollTop = document.documentElement.scrollTop || 0;
            const bodyScrollTop = document.body.scrollTop || 0;

            const effectiveScroll = Math.max(winScrollY, htmlScrollTop, bodyScrollTop);

            setIsPastThreshold(effectiveScroll > SCROLL_SHOW_THRESHOLD);

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Only hide for real overlay modals that lock the body
    useEffect(() => {
        const check = () => {
            const body = document.body;
            const html = document.documentElement;

            const locked =
                body.style.position === "fixed" ||
                body.style.overflow === "hidden" ||
                html.style.overflow === "hidden";

            setModalOpen(locked);
        };

        check();

        const observer = new MutationObserver(check);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["style"],
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["style"],
        });

        return () => observer.disconnect();
    }, []);

    const visible = isPastThreshold && !modalOpen;

    const scrollToTop = () => {
        document.body.scrollTo({ top: 0, behavior: "smooth" });
        document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    key="back-to-top"
                    type="button"
                    onClick={scrollToTop}
                    aria-label="ઉપર જાઓ"
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.9 }}
                    transition={{ type: "spring", damping: 22, stiffness: 300 }}
                    style={{ position: "fixed" }}
                    className={`
                        group z-[9000] flex h-11 w-11 items-center justify-center cursor-pointer
                        rounded-full bg-[#e48d0b] text-white 
                        shadow-[0_8px_20px_-4px_rgba(228,141,11,0.5)] 
                        backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-[#d27e08]
                        md:h-12 md:w-12

                        /* Mobile: sit above MobileBottomNav (પોઝિશન બરાબર એ જ રાખી છે) */
                        bottom-[5rem] right-4

                        /* Desktop (પોઝિશન બરાબર એ જ રાખી છે) */
                        md:bottom-5 md:right-8
                    `}
                >
                    <MoveUp className="h-5 w-5 stroke-[2.5] transition-transform duration-300 group-hover:-translate-y-0.5" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}