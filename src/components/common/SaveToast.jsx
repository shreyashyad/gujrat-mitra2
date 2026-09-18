import { AnimatePresence, motion } from "framer-motion";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";

export default function SaveToast() {
  const { toast } = useSavedNews();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-450 lg:bottom-24 z-[9999] flex justify-center">
      <AnimatePresence mode="wait">
        {toast && (
          <motion.div
            key="save-toast-container" 
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="pointer-events-auto rounded-full bg-black/90 dark:bg-white/95
                       backdrop-blur-md px-6 py-3 shadow-xl"
          >
            <p className="font-gu text-base md:text-lg font-semibold text-white dark:text-black whitespace-nowrap">
              {toast.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}