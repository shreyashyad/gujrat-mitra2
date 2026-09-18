import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Link2, Check } from "lucide-react";
import { useState } from "react";
import logo1 from "../../assets/logo1.png";

/**
 * props:
 *  open: boolean
 *  onClose: () => void
 *  title?: string
 *  text?: string
 *  url?: string   // defaults to window.location.href
 *  image?: string // optional preview image
 */
export default function ShareModal({
  open,
  onClose,
  title = "",
  text = "",
  url,
  image,
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || "ગુજરાત મિત્ર";
  const shareText = text || shareTitle;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setCopied(false);
  }, [open]);

  if (!open) return null;

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(shareTitle);

  const openWindow = (href) => {
    window.open(href, "_blank", "noopener,noreferrer,width=600,height=560");
  };

  const handleWhatsApp = () => {
    openWindow(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`);
  };

  const handleX = () => {
    openWindow(
      `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
    );
  };

  const handleFacebook = () => {
    openWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
    );
  };

  const handleLinkedIn = () => {
    openWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    );
  };

  const handleInstagram = async () => {
    // Instagram has no web share-to-feed URL — copy link + hint
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      alert("લિંક કોપી થઈ. Instagram માં paste કરીને શેર કરો.");
    } catch {
      window.prompt("Instagram માટે લિંક કોપી કરો:", shareUrl);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("લિંક કોપી કરો:", shareUrl);
    }
  };

  const handleNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (err) {
        if (err?.name !== "AbortError") handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const options = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      onClick: handleWhatsApp,
      bg: "bg-[#25D366]/15 hover:bg-[#25D366]/25",
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="#25D366">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.02.24-3.4-.71-2.87-1.15-4.71-4.06-4.85-4.25-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09.99-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.61-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.35z" />
        </svg>
      ),
    },
    {
      key: "x",
      label: "X",
      onClick: handleX,
      bg: "bg-black/8 hover:bg-black/12 dark:bg-white/10 dark:hover:bg-white/15",
      icon: (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      key: "facebook",
      label: "Facebook",
      onClick: handleFacebook,
      bg: "bg-[#1877F2]/15 hover:bg-[#1877F2]/25",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#1877F2">
          <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.56-4.7 1.32 0 2.7.24 2.7.24v2.97h-1.52c-1.5 0-1.96.93-1.96 1.89v2.26h3.34l-.53 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07z" />
        </svg>
      ),
    },
    {
      key: "instagram",
      label: "Instagram",
      onClick: handleInstagram,
      bg: "bg-[#E4405F]/15 hover:bg-[#E4405F]/25",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#E4405F">
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.69 21.31.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.41-11.85a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
        </svg>
      ),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      onClick: handleLinkedIn,
      bg: "bg-[#0A66C2]/15 hover:bg-[#0A66C2]/25",
      icon: (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="#0A66C2">
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 11-.01-4.12 2.06 2.06 0 01.01 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.23 0z" />
        </svg>
      ),
    },
    {
      key: "copy",
      label: copied ? "કોપી થયું" : "Copy link",
      onClick: handleCopy,
      bg: "bg-black/8 hover:bg-black/12 dark:bg-white/10 dark:hover:bg-white/15",
      icon: copied ? (
        <Check size={20} className="text-emerald-600" />
      ) : (
        <Link2 size={20} />
      ),
    },
  ];

  const modal = (
    <div
      className="fixed inset-0 z-[10000] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
      style={{ overscrollBehavior: "none" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="શેર કરો"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-md overflow-hidden
          rounded-t-2xl bg-white shadow-2xl
          dark:bg-[#1c1c1e]
          sm:rounded-2xl
          animate-[shareSlideUp_0.28s_ease-out]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 px-4 py-3 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src={logo1}
              alt="ગુજરાત મિત્ર"
              className="h-7 w-auto object-contain"
            />
            <span className="font-gu text-[16px] font-semibold text-ink dark:text-ink-dark">
              શેર કરો
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/5 text-ink transition hover:bg-black/10 dark:bg-white/10 dark:text-white"
            aria-label="બંધ કરો"
          >
            <X size={16} />
          </button>
        </div>

        {/* Preview */}
        <div className="border-b border-black/8 px-4 py-3 dark:border-white/10">
          <div className="flex gap-3">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/5 dark:bg-white/5">
              {image ? (
                <img src={image} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <img src={logo1} alt="" className="h-8 w-auto opacity-70" />
                </div>
              )}
              {/* logo watermark */}
              <div className="absolute bottom-1 left-1 rounded bg-white/90 px-1 py-0.5 dark:bg-black/70">
                <img src={logo1} alt="" className="h-3 w-auto" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 font-gu text-[14px] font-semibold leading-snug text-ink dark:text-ink-dark">
                {shareTitle}
              </p>
              <p className="mt-1 truncate font-en text-[11px] text-ink/50 dark:text-ink-dark/50">
                {shareUrl}
              </p>
            </div>
          </div>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-3">
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={opt.onClick}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl px-2 py-3 transition ${opt.bg}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-sm dark:bg-white/10 dark:text-white">
                {opt.icon}
              </span>
              <span className="font-gu text-[12px] font-medium text-ink dark:text-ink-dark">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
        <div className="h-[env(safe-area-inset-bottom)] sm:hidden" />
      </div>

      <style>{`
        @keyframes shareSlideUp {
          from { transform: translateY(24px); opacity: 0.6; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );

  return createPortal(modal, document.body);
}