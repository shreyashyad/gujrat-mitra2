import { useState, useRef, useEffect } from "react";
import {
  MessageSquareText,
  ChevronDown,
  Send,
  Check,
} from "lucide-react";

export default function SidebarFooterAccordion() {
  const [openKey, setOpenKey] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [sending, setSending] = useState(false);

  const textareaRef = useRef(null);

  const toggle = (key) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };

  useEffect(() => {
    if (openKey === "feedback") {
      setTimeout(() => textareaRef.current?.focus(), 250);
    }
  }, [openKey]);

  const submitFeedback = async () => {
    if (!feedbackText.trim() || sending) return;

    setSending(true);

    // Fake API Delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSending(false);
    setFeedbackSent(true);
    setFeedbackText("");

    setTimeout(() => {
      setFeedbackSent(false);
      setOpenKey(null);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-2.5 border-b border-black/5 dark:border-white/5">
      {/* Feedback Group */}
      <div
        className="rounded-2xl border border-black/10 dark:border-white/10
                   bg-black/[0.02] dark:bg-white/[0.03] backdrop-blur-md
                   shadow-xs overflow-hidden transition-all duration-300"
      >
        <button
          type="button"
          onClick={() => toggle("feedback")}
          className="flex w-full items-center justify-between p-3.5
                     hover:bg-black/5 dark:hover:bg-white/5
                     active:scale-[0.99] transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]"
        >
          <span className="flex items-center gap-2.5 font-gu text-md font-bold text-ink dark:text-ink-dark">
            <MessageSquareText
              size={17}
              className="text-[#e48d0b]"
              strokeWidth={2.25}
            />
            તમારો પ્રતિભાવ આપો
          </span>

          <ChevronDown
            size={17}
            className={`transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              openKey === "feedback"
                ? "rotate-180 text-ink dark:text-ink-dark"
                : "text-ink/40 dark:text-ink-dark/40"
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            openKey === "feedback"
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="p-3.5 pt-0 space-y-3">
              <textarea
                ref={textareaRef}
                rows={3}
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.ctrlKey && e.key === "Enter") {
                    submitFeedback();
                  }
                }}
                placeholder="તમારો પ્રતિભાવ અહીં લખો..."
                className="w-full rounded-xl border border-ink/15 dark:border-ink-dark/20
                           bg-surface/90 dark:bg-black/50 backdrop-blur-sm p-3 text-xs font-gu resize-none outline-none
                           transition-all duration-200 focus:border-[#e48d0b] focus:ring-2 focus:ring-[#e48d0b]/20"
              />

              <button
                onClick={submitFeedback}
                disabled={!feedbackText.trim() || sending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-home py-2.5 font-gu text-xs font-bold text-home-text
             shadow-xs transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]
             active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    મોકલી રહ્યું છે...
                  </>
                ) : feedbackSent ? (
                  <>
                    <Check size={14} className="stroke-[2.5]" />
                    આભાર! પ્રતિભાવ મળ્યો.
                  </>
                ) : (
                  <>
                    <Send size={13} className="stroke-[2.2]" strokeWidth={2} />
                    મોકલો
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-ink/50 dark:text-ink-dark/50">
                Ctrl + Enter દબાવીને પણ મોકલી શકો છો.
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}
