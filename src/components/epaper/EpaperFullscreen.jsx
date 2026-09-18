import React from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import { Crop, Share } from "lucide-react";
import { currentEdition } from "../../data/epaperData.js";
import logo1 from "../../assets/logo1.png";

/* ========== SHARP CUSTOM ICONS ========== */
const IconPlay = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="-60 0 512 512" fill="currentColor" className={className}>
    <path d="M64 96L328 256 64 416 64 96Z" />
  </svg>
);

const IconPause = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4L8.66667 12L20 20V4Z" />
    <path d="M4 20H6.66667V4H4V20Z" />
  </svg>
);

const IconList = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M22,17 L22,19 L8,19 L8,17 L22,17 Z M22,11 L22,13 L8,13 L8,11 L22,11 Z M22,5 L22,7 L8,7 L8,5 L22,5 Z M4,20 C2.8954305,20 2,19.1045695 2,18 C2,16.8954305 2.8954305,16 4,16 C5.1045695,16 6,16.8954305 6,18 C6,19.1045695 5.1045695,20 4,20 Z M4,14 C2.8954305,14 2,13.1045695 2,12 C2,10.8954305 2.8954305,10 4,10 C5.1045695,10 6,10.8954305 6,12 C6,13.1045695 5.1045695,14 4,14 Z M4,8 C2.8954305,8 2,7.1045695 2,6 C2,4.8954305 2.8954305,4 4,4 C5.1045695,4 6,4.8954305 6,6 C6,7.1045695 5.1045695,8 4,8 Z" />
  </svg>
);

const IconPlus = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M232 280L64 280 64 232 232 232 232 64 280 64 280 232 448 232 448 280 280 280 280 448 232 448 232 280Z" />
  </svg>
);

const IconMinus = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.2" className={className}>
    <path d="M1 7.5H14" />
  </svg>
);

const IconReset = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 30 30" fill="currentColor" className={className}>
    <g transform="translate(0,-289.0625)">
      <path d="m 15.127557,295.06926 c -2.018565,-0.0307 -4.059305,0.61057 -5.7529033,1.96637 -2.1752994,1.74142 -3.326138,4.29888 -3.3677755,6.8915 l 1.988056,0.0299 c 0.030306,-2.01336 0.928045,-3.99714 2.6297898,-5.35946 3.027282,-2.42347 7.416714,-1.93765 9.840184,1.08963 2.42347,3.02728 1.937649,7.41671 -1.089632,9.84019 l -1.875106,-2.34294 -1.40473,6.24714 6.403089,-0.001 -1.873182,-2.34096 c 3.871082,-3.09896 4.50049,-8.78113 1.401521,-12.65221 -1.74317,-2.17748 -4.304014,-3.32844 -6.899311,-3.36789 z m -0.09746,6.99346 a 2,2 0 0 0 -2.029875,1.96968 2,2 0 0 0 1.969672,2.02987 2,2 0 0 0 2.029874,-1.96967 2,2 0 0 0 -1.969671,-2.02988 z" />
    </g>
  </svg>
);

const IconFlipV = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M5.75 3C5.33579 3 5 3.33579 5 3.75C5 4.16421 5.33579 4.5 5.75 4.5H18.25C18.6642 4.5 19 4.16421 19 3.75C19 3.33579 18.6642 3 18.25 3H5.75Z" />
    <path d="M9.22162 14.2188C9.48789 13.9526 9.90455 13.9284 10.1982 14.1462L10.2823 14.2188L11.502 15.44V12.3691L11.5 12.3437V8.56L10.2803 9.78115L10.1962 9.85377C9.9026 10.0716 9.48594 10.0474 9.21967 9.78115C8.9534 9.51488 8.9292 9.09822 9.14705 8.80461L9.21967 8.72049L11.5871 6.35039C11.7128 6.14201 11.9629 6 12.2509 6C12.503 6 12.726 6.10886 12.862 6.27578L12.9148 6.35073L15.282 8.72049L15.3546 8.80461C15.5482 9.0656 15.5506 9.42381 15.3618 9.6872L15.282 9.78115L15.1979 9.85377C14.9369 10.0474 14.5787 10.0498 14.3153 9.86094L14.2213 9.78115L13 8.56V11.6308L13.002 11.6562V15.44L14.2233 14.2188C14.4895 13.9526 14.9062 13.9284 15.1998 14.1462L15.2839 14.2188C15.5502 14.4851 15.5744 14.9018 15.3565 15.1954L15.2839 15.2795L12.9167 17.6493C12.7911 17.8578 12.541 18 12.2529 18C11.9649 18 11.7147 17.858 11.589 17.6496L9.22162 15.2795C8.92873 14.9866 8.92873 14.5117 9.22162 14.2188Z" />
    <path d="M5 20.25C5 19.8358 5.33579 19.5 5.75 19.5H18.25C18.6642 19.5 19 19.8358 19 20.25C19 20.6642 18.6642 21 18.25 21H5.75C5.33579 21 5 20.6642 5 20.25Z" />
  </svg>
);

const IconFlipH = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 18.25C3 18.6642 3.33579 19 3.75 19C4.16421 19 4.5 18.6642 4.5 18.25V5.75C4.5 5.33579 4.16421 5 3.75 5C3.33579 5 3 5.33579 3 5.75V18.25Z" />
    <path d="M19.5 18.25C19.5 18.6642 19.8358 19 20.25 19C20.6642 19 21 18.6642 21 18.25V5.75C21 5.33579 20.6642 5 20.25 5C19.8358 5 19.5 5.33579 19.5 5.75V18.25Z" />
    <path d="M14.1462 14.0535C13.9284 14.3472 13.9526 14.7638 14.2188 15.0301C14.5117 15.323 14.9866 15.323 15.2795 15.0301L17.6496 12.6627C17.858 12.537 18 12.2869 18 11.9988C18 11.7107 17.8578 11.4606 17.6493 11.335L15.2795 8.96778L15.1954 8.89517C14.9018 8.67731 14.4851 8.70152 14.2188 8.96778L14.1462 9.0519C13.9284 9.34551 13.9526 9.76218 14.2188 10.0284L15.44 11.2498H11.6562L11.6308 11.2517H8.56L9.78115 10.0304L9.86094 9.93645C10.0498 9.67306 10.0474 9.31484 9.85377 9.05386L9.78115 8.96974L9.6872 8.88995C9.42381 8.70108 9.0656 8.70347 8.80461 8.89712L8.72049 8.96974L6.35073 11.337L6.27578 11.3897C6.10886 11.5257 6 11.7487 6 12.0008C6 12.2888 6.14201 12.5389 6.35039 12.6646L8.72049 15.032L8.80461 15.1047C9.09822 15.3225 9.51488 15.2983 9.78115 15.032C10.0474 14.7658 10.0716 14.3491 9.85377 14.0555L9.78115 13.9714L8.56 12.7517H12.3437L12.3691 12.7498H15.44L14.2188 13.9694L14.1462 14.0535Z" />
  </svg>
);

const IconExpand = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const IconSettings = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 1024 1024" fill="currentColor" className={className}>
    <path d="M600.704 64a32 32 0 0130.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0134.432 15.36L944.32 364.8a32 32 0 01-4.032 37.504l-77.12 85.12a357.12 357.12 0 010 49.024l77.12 85.248a32 32 0 014.032 37.504l-88.704 153.6a32 32 0 01-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 01600.704 960H423.296a32 32 0 01-30.464-22.208L357.696 828.48a351.616 351.616 0 01-42.56-24.64l-112.32 24.256a32 32 0 01-34.432-15.36L79.68 659.2a32 32 0 014.032-37.504l77.12-85.248a357.12 357.12 0 010-48.896l-77.12-85.248A32 32 0 0179.68 364.8l88.704-153.6a32 32 0 0134.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 01423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 00-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 000 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0034.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0034.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 000-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 00-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 110 384 192 192 0 010-384zm0 64a128 128 0 100 256 128 128 0 000-256z" />
  </svg>
);

const IconClose = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 76 76" fill="currentColor" className={className}>
    <path d="M 26.9166,22.1667L 37.9999,33.25L 49.0832,22.1668L 53.8332,26.9168L 42.7499,38L 53.8332,49.0834L 49.0833,53.8334L 37.9999,42.75L 26.9166,53.8334L 22.1666,49.0833L 33.25,38L 22.1667,26.9167L 26.9166,22.1667 Z " />
  </svg>
);

const IconSave = ({ size = 21, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M22 24H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h15v.006a1.016 1.016 0 0 1 .77.283l5.91 5.91a1.017 1.017 0 0 1 .29.8H24v15a2 2 0 0 1-2 2ZM7 22h10v-7H7v7Zm8-20h-6v6h6V2Zm7 5.477-5-5V8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V2H2v20h3v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7h3V7.477Z" />
  </svg>
);

const IconChevronDown = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconDownload = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const IconWhatsApp = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const IconX = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const IconShare = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconSpinner = ({ size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const GUJARAT_MITRA_LOGO = logo1;

/* ========== SNIP PREVIEW MODAL ========== */
function SnipPreviewModal({ previewUrl, blob, page, onClose, showToast }) {
  const fileName = `gujaratmitra-page-${page}-snip.png`;

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Snip downloaded.");
  };

  const canShareFiles = React.useCallback((file) => {
    return !!(navigator.share && navigator.canShare?.({ files: [file] }));
  }, []);

  const handleNativeShare = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    try {
      if (canShareFiles(file)) {
        await navigator.share({
          files: [file],
          title: `ગુજરાતમિત્ર – પેજ ${page}`,
          text: `ગુજરાતમિત્ર ઈ-પેપર પેજ ${page} માંથી`,
        });
        showToast("Shared successfully.");
      } else {
        handleDownload();
        showToast("Your browser can't attach images directly. Image downloaded — attach it manually.");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        handleDownload();
        showToast("Could not share. Image downloaded instead.");
      }
    }
  };

  const handleWhatsApp = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    if (canShareFiles(file)) {
      try {
        await navigator.share({
          files: [file],
          text: `ગુજરાતમિત્ર ઈ-પેપર – પેજ ${page}`,
        });
        showToast("Shared successfully.");
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    const text = encodeURIComponent(`ગુજરાતમિત્ર ઈ-પેપર – પેજ ${page}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    handleDownload();
    showToast("WhatsApp opened with text. Attach the downloaded image manually.");
  };

  const handleX = async () => {
    if (!blob) return;
    const file = new File([blob], fileName, { type: "image/png" });
    if (canShareFiles(file)) {
      try {
        await navigator.share({
          files: [file],
          text: `ગુજરાતમિત્ર ઈ-પેપર – પેજ ${page}`,
        });
        showToast("Shared successfully.");
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }
    const text = encodeURIComponent(`ગુજરાતમિત્ર ઈ-પેપર – પેજ ${page}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    handleDownload();
    showToast("X opened with text. Attach the downloaded image manually.");
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. TOP — ફક્ત "શેર કરો" + Close */}
        <div className="flex items-center justify-between border-b border-black/10 px-4 py-3 dark:border-white/10">
          <span className="font-gu text-[16px] font-semibold text-ink dark:text-white">
            શેર કરો
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/5 text-ink hover:bg-black/10 dark:bg-white/10 dark:text-white"
            aria-label="Close"
          >
            <IconClose size={18} />
          </button>
        </div>

        {/* 2. IMAGE PREVIEW (logo already baked in image) */}
        <div className="bg-neutral-100 p-3 dark:bg-neutral-800 sm:p-4">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Snip preview"
              className="mx-auto max-h-[48vh] w-full rounded-lg object-contain shadow"
            />
          ) : (
            <div className="flex h-40 items-center justify-center text-sm text-ink/50">
              Loading preview…
            </div>
          )}
        </div>

        {/* 3. ACTION BUTTONS */}
        <div className="flex items-center justify-center gap-3 px-4 py-4 sm:gap-4">
          <button
            type="button"
            onClick={handleDownload}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-ink/70 shadow-sm transition-all hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-dark/70 dark:hover:bg-[#e48d0b]/15"
            aria-label="ડાઉનલોડ કરો"
            title="ડાઉનલોડ કરો"
          >
            <IconDownload size={18} />
          </button>
          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-[#128C7E] shadow-sm transition-all hover:border-[#25D366]/50 hover:bg-[#25D366]/15 dark:border-white/10 dark:bg-white/[0.04]"
            aria-label="WhatsApp પર શેર કરો"
            title="WhatsApp પર શેર કરો"
          >
            <IconWhatsApp size={20} />
          </button>
          <button
            type="button"
            onClick={handleX}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-ink/70 shadow-sm transition-all hover:border-black/40 hover:bg-black/5 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-dark/70 dark:hover:bg-white/[0.08]"
            aria-label="X પર શેર કરો"
            title="X પર શેર કરો"
          >
            <IconX size={18} />
          </button>
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-ink/70 shadow-sm transition-all hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-dark/70"
            aria-label="શેર કરો"
            title="શેર કરો"
          >
            <IconShare size={18} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ========== SNIP TUTORIAL OVERLAY ========== */
function SnipTutorialOverlay({ onDismiss }) {
  React.useEffect(() => {
    const t = setTimeout(() => onDismiss?.(), 2000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[10040] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/45" />

      <div className="snip-tutorial-card relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white px-5 py-6 text-center shadow-2xl dark:bg-neutral-900">
        <p className="font-gu text-[17px] font-semibold text-ink dark:text-white">
          સ્નિપ &amp; શેર
        </p>
        <p className="mt-2 font-gu text-[14px] leading-relaxed text-ink/70 dark:text-white/70">
          પેજ પર આંગળી / માઉસથી ખેંચીને વિસ્તાર પસંદ કરો.
        </p>

        <div className="relative mx-auto mt-5 h-28 w-44 overflow-hidden rounded-xl border border-dashed border-[#e48d0b]/60 bg-[#e48d0b]/5">
          <div className="snip-drag-box absolute left-3 top-3 h-10 w-14 rounded border-2 border-[#e48d0b] bg-[#e48d0b]/20" />
          <div className="snip-drag-hand absolute left-4 top-4 text-[22px]">👆</div>
        </div>

        <p className="mt-4 font-gu text-[12px] text-ink/50 dark:text-white/50">
          ૨ સેકન્ડમાં માર્ગદર્શન બંધ થશે…
        </p>
      </div>

      <style>{`
        .snip-tutorial-card {
          animation: snipCardIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        @keyframes snipCardIn {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .snip-drag-box {
          animation: snipBoxDrag 1.4s ease-in-out infinite;
        }
        .snip-drag-hand {
          animation: snipHandDrag 1.4s ease-in-out infinite;
        }
        @keyframes snipBoxDrag {
          0%, 15% { width: 3.5rem; height: 2.5rem; }
          55%, 70% { width: 9rem; height: 5.5rem; }
          100% { width: 3.5rem; height: 2.5rem; }
        }
        @keyframes snipHandDrag {
          0%, 15% { transform: translate(0, 0); }
          55%, 70% { transform: translate(4.5rem, 2.5rem); }
          100% { transform: translate(0, 0); }
        }
      `}</style>
    </div>,
    document.body
  );
}

/* ========== MAIN COMPONENT ========== */
export default function EpaperFullscreen() {
  const navigate = useNavigate();
  const { editionId = "surat", page: pageParam = "1" } = useParams();
  const [page, setPage] = React.useState(Math.max(1, Math.min(currentEdition.pages.length, Number(pageParam) || 1)));
  const [zoom, setZoom] = React.useState(1);
  const [rotation, setRotation] = React.useState(0);
  const [baseWidth, setBaseWidth] = React.useState(464);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showPageMenu, setShowPageMenu] = React.useState(false);
  const [showPageSidebar, setShowPageSidebar] = React.useState(false);
  const [settingsPos, setSettingsPos] = React.useState(null);
  const [pageMenuPos, setPageMenuPos] = React.useState(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isSnipping, setIsSnipping] = React.useState(false);
  const [showSnipTutorial, setShowSnipTutorial] = React.useState(false);
  const [isProcessingSnip, setIsProcessingSnip] = React.useState(false);
  const [snipSelection, setSnipSelection] = React.useState(null);
  const [snipModal, setSnipModal] = React.useState(null);
  const [toast, setToast] = React.useState("");
  const toolbarRef = React.useRef(null);
  const settingsButtonRef = React.useRef(null);
  const settingsMenuRef = React.useRef(null);
  const pageMenuButtonRef = React.useRef(null);
  const pageMenuMenuRef = React.useRef(null);
  const viewerRef = React.useRef(null);
  const imageRef = React.useRef(null);
  const snipStartRef = React.useRef(null);
  const snipSelectionRef = React.useRef(null);
  const suppressNextImageClickRef = React.useRef(false);
  const hasSeenSnipTutorialRef = React.useRef(false);
  const watermarkImgRef = React.useRef(null);
  const item = currentEdition.pages[page - 1];

  const showToast = React.useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }, []);

  React.useEffect(() => {
    const wm = new Image();
    wm.decoding = "async";
    wm.onload = () => {
      watermarkImgRef.current = wm;
    };
    wm.src = GUJARAT_MITRA_LOGO;
    if (wm.complete && wm.naturalWidth) {
      watermarkImgRef.current = wm;
    }
  }, []);

  const goToPage = React.useCallback((nextPage) => {
    const safePage = Math.max(1, Math.min(currentEdition.pages.length, nextPage));
    setPage(safePage);
    setRotation(0);
    navigate(`/epaper/fullscreen/${editionId}/${safePage}`, { replace: true });
  }, [editionId, navigate]);

  const changeZoom = React.useCallback((amount) => {
    setZoom((value) => Math.max(0.5, Math.min(6, +(value + amount).toFixed(2))));
  }, []);

  const handleReset = React.useCallback(() => {
    setZoom(1);
    setRotation(0);
    showToast("Reset to default view.");
  }, [showToast]);

  React.useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return undefined;
    const updateBaseWidth = () => {
      setBaseWidth(Math.max(1, Math.min(viewer.clientWidth - 16, 464)));
    };
    updateBaseWidth();
    const observer = new ResizeObserver(updateBaseWidth);
    observer.observe(viewer);
    return () => observer.disconnect();
  }, []);

  const getViewerMetrics = React.useCallback(() => {
    const viewer = viewerRef.current;
    const image = imageRef.current;
    if (!viewer || !image?.naturalWidth || !image.naturalHeight) return null;
    const availableWidth = Math.max(1, viewer.clientWidth - 16);
    const availableHeight = Math.max(1, viewer.clientHeight - 16);
    const baseHeight = baseWidth * (image.naturalHeight / image.naturalWidth);
    return { availableWidth, availableHeight, baseWidth, baseHeight };
  }, [baseWidth]);

  const fitToScreen = React.useCallback(() => {
    const metrics = getViewerMetrics();
    if (!metrics) return;
    const { availableWidth, availableHeight, baseHeight } = metrics;
    const fitZoom = Math.min(availableWidth / baseWidth, availableHeight / baseHeight);
    setZoom(Math.max(0.5, Math.min(6, +fitZoom.toFixed(2))));
  }, [getViewerMetrics, baseWidth]);

  const fitWidth = React.useCallback(() => {
    const metrics = getViewerMetrics();
    if (!metrics) return;
    const fitZoom = metrics.availableWidth / baseWidth;
    setZoom(Math.max(0.5, Math.min(6, +fitZoom.toFixed(2))));
  }, [getViewerMetrics, baseWidth]);

  const fitHeight = React.useCallback(() => {
    const metrics = getViewerMetrics();
    if (!metrics) return;
    const fitZoom = metrics.availableHeight / metrics.baseHeight;
    setZoom(Math.max(0.5, Math.min(6, +fitZoom.toFixed(2))));
  }, [getViewerMetrics]);

  const toggleFullscreen = React.useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => showToast("Unable to enter fullscreen."));
    } else {
      document.exitFullscreen?.();
    }
  }, [showToast]);

  const downloadCurrentImage = React.useCallback(() => {
    setIsDownloading(true);
    const image = new Image();
    image.onload = () => {
      const anchor = document.createElement("a");
      anchor.href = item.image;
      anchor.download = `gujaratmitra-page-${page}.png`;
      anchor.click();
      setIsDownloading(false);
    };
    image.onerror = () => {
      setIsDownloading(false);
      showToast("Unable to download this page image.");
    };
    image.src = item.image;
  }, [item.image, page, showToast]);

  const getSnipPoint = React.useCallback((event) => {
    const image = imageRef.current;
    if (!image) return null;
    const rect = image.getBoundingClientRect();
    const clientX = event.clientX ?? event.touches?.[0]?.clientX;
    const clientY = event.clientY ?? event.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return null;
    return {
      x: Math.max(0, Math.min(rect.width, clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, clientY - rect.top)),
    };
  }, []);

  const drawLogoHeaderAndFinish = React.useCallback((ctx, finalW, headerH, watermark, finish) => {
    // 1) white header + logo
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalW, headerH);

    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(0, headerH - 2, finalW, 2);

    const maxLogoW = finalW * 0.7;
    const maxLogoH = headerH * 0.85;
    const ratio = watermark.naturalWidth / (watermark.naturalHeight || 1);

    let logoW = maxLogoW;
    let logoH = logoW / ratio;
    if (logoH > maxLogoH) {
      logoH = maxLogoH;
      logoW = logoH * ratio;
    }

    ctx.drawImage(
      watermark,
      (finalW - logoW) / 2,
      (headerH - logoH) / 2,
      logoW,
      logoH
    );

    // 2) diagonal watermark — આખી image ના 80%
    const contentH = ctx.canvas.height - headerH;
    const wmSize = Math.min(finalW, contentH) * 0.8; // ★ 80% cover
    let wmW = wmSize;
    let wmH = wmW / ratio;
    if (wmH > contentH * 0.8) {
      wmH = contentH * 0.8;
      wmW = wmH * ratio;
    }
    if (wmW > finalW * 0.8) {
      wmW = finalW * 0.8;
      wmH = wmW / ratio;
    }

    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.translate(finalW / 2, headerH + contentH / 2);
    ctx.rotate((-25 * Math.PI) / 180);
    ctx.drawImage(watermark, -wmW / 2, -wmH / 2, wmW, wmH);
    ctx.restore();

    finish();
  }, []);

  const createSnipWithWatermark = React.useCallback((selection) => {
    const image = imageRef.current;
    if (!image?.naturalWidth || !image.naturalHeight || selection.width < 8 || selection.height < 8) {
      showToast("Please select a larger area.");
      return;
    }

    setIsProcessingSnip(true);

    const scaleX = image.naturalWidth / image.clientWidth;
    const scaleY = image.naturalHeight / image.clientHeight;
    const cropW = Math.round(selection.width * scaleX);
    const cropH = Math.round(selection.height * scaleY);

    const headerH = Math.max(140, Math.min(200, Math.round(cropW * 0.25)));
    const finalW = cropW;
    const finalH = headerH + cropH;

    const canvas = document.createElement("canvas");
    canvas.width = finalW;
    canvas.height = finalH;
    const ctx = canvas.getContext("2d");

    // content below header
    ctx.drawImage(
      image,
      Math.round(selection.x * scaleX),
      Math.round(selection.y * scaleY),
      cropW, cropH,
      0, headerH,
      cropW, cropH
    );

    const finish = () => {
      canvas.toBlob((blob) => {
        setIsProcessingSnip(false);
        if (!blob) {
          showToast("Unable to create the selected snip.");
          return;
        }
        setSnipModal({ previewUrl: URL.createObjectURL(blob), blob });
      }, "image/png");
    };

    const preloaded = watermarkImgRef.current;
    if (preloaded?.naturalWidth) {
      drawLogoHeaderAndFinish(ctx, finalW, headerH, preloaded, finish);
      return;
    }

    const watermark = new Image();
    watermark.onload = () => {
      watermarkImgRef.current = watermark;
      drawLogoHeaderAndFinish(ctx, finalW, headerH, watermark, finish);
    };
    watermark.onerror = () => finish();
    watermark.src = GUJARAT_MITRA_LOGO;
  }, [showToast, drawLogoHeaderAndFinish]);

  const toggleSnipping = React.useCallback(() => {
    if (isProcessingSnip) return;

    if (isSnipping) {
      setIsSnipping(false);
      setShowSnipTutorial(false);
      setSnipSelection(null);
      snipSelectionRef.current = null;
      snipStartRef.current = null;
      showToast("સ્નિપ મોડ બંધ.");
      return;
    }

    if (rotation !== 0) {
      showToast("Reset rotation before snipping the page.");
      return;
    }
    setSnipSelection(null);
    snipSelectionRef.current = null;
    snipStartRef.current = null;
    setIsSnipping(true);

    if (!hasSeenSnipTutorialRef.current) {
      hasSeenSnipTutorialRef.current = true;
      setShowSnipTutorial(true);
    } else {
      showToast("પેજ પર ખેંચીને વિસ્તાર પસંદ કરો.");
    }
  }, [isSnipping, isProcessingSnip, rotation, showToast]);

  const handleSnipPointerDown = React.useCallback((event) => {
    if (!isSnipping) return;
    event.preventDefault();
    event.stopPropagation();
    try {
      event.currentTarget.setPointerCapture?.(event.pointerId);
    } catch (_) { }
    const point = getSnipPoint(event);
    if (point) {
      snipStartRef.current = point;
      const selection = { x: point.x, y: point.y, width: 0, height: 0 };
      snipSelectionRef.current = selection;
      setSnipSelection(selection);
      setShowSnipTutorial(false);
    }
  }, [getSnipPoint, isSnipping]);

  const handleSnipPointerMove = React.useCallback((event) => {
    if (!isSnipping || !snipStartRef.current) return;
    event.preventDefault();
    const point = getSnipPoint(event);
    if (!point) return;
    const start = snipStartRef.current;
    const selection = {
      x: Math.min(start.x, point.x),
      y: Math.min(start.y, point.y),
      width: Math.abs(point.x - start.x),
      height: Math.abs(point.y - start.y),
    };
    snipSelectionRef.current = selection;
    setSnipSelection(selection);
  }, [getSnipPoint, isSnipping]);

  const handleSnipPointerUp = React.useCallback((event) => {
    if (!snipStartRef.current) return;
    event.preventDefault();
    snipStartRef.current = null;
    suppressNextImageClickRef.current = true;

    const selection = snipSelectionRef.current;

    // Selection પછી snip mode બંધ
    setIsSnipping(false);
    setShowSnipTutorial(false);

    if (selection && selection.width >= 8 && selection.height >= 8) {
      createSnipWithWatermark(selection);
    } else {
      showToast("Please select a larger area.");
      setSnipSelection(null);
    }
  }, [createSnipWithWatermark, showToast]);

  const closeSnipModal = React.useCallback(() => {
    if (snipModal?.previewUrl) URL.revokeObjectURL(snipModal.previewUrl);
    setSnipModal(null);
    setSnipSelection(null);
  }, [snipModal]);

  const openSettings = React.useCallback(() => {
    const rect = settingsButtonRef.current?.getBoundingClientRect();
    if (rect) setSettingsPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    setShowPageMenu(false);
    setShowSettings((v) => !v);
  }, []);

  const openPageMenu = React.useCallback(() => {
    const rect = pageMenuButtonRef.current?.getBoundingClientRect();
    if (rect) setPageMenuPos({ top: rect.bottom + 4, left: rect.left });
    setShowSettings(false);
    setShowPageMenu((v) => !v);
  }, []);

  React.useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  React.useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        if (snipModal) closeSnipModal();
        else if (showPageSidebar) setShowPageSidebar(false);
        else if (isSnipping) {
          setIsSnipping(false);
          setShowSnipTutorial(false);
          setSnipSelection(null);
        } else navigate(`/epaper/view/${editionId}?page=${page}`);
      }
      if (event.key === "ArrowRight") goToPage(page + 1);
      if (event.key === "ArrowLeft") goToPage(page - 1);
      if (event.key === "+" || event.key === "=") changeZoom(0.25);
      if (event.key === "-") changeZoom(-0.25);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [changeZoom, closeSnipModal, editionId, goToPage, isSnipping, navigate, page, showPageSidebar, snipModal]);

  React.useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (showSettings && !settingsButtonRef.current?.contains(event.target) && !settingsMenuRef.current?.contains(event.target)) {
        setShowSettings(false);
      }
      if (showPageMenu && !pageMenuButtonRef.current?.contains(event.target) && !pageMenuMenuRef.current?.contains(event.target)) {
        setShowPageMenu(false);
      }
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [showSettings, showPageMenu]);

  React.useEffect(() => {
    if (!showSettings && !showPageMenu) return undefined;
    const closeAll = () => {
      setShowSettings(false);
      setShowPageMenu(false);
    };
    const toolbar = toolbarRef.current;
    toolbar?.addEventListener("scroll", closeAll);
    window.addEventListener("resize", closeAll);
    return () => {
      toolbar?.removeEventListener("scroll", closeAll);
      window.removeEventListener("resize", closeAll);
    };
  }, [showSettings, showPageMenu]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-surface text-ink dark:bg-surface-dark dark:text-ink-dark">
      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className="relative z-20 w-full flex-none overflow-x-auto border-b border-black/10 bg-[#fdf6e3] shadow-sm dark:border-white/10 dark:bg-neutral-900
  [scrollbar-width:thin] [scrollbar-color:rgba(184,122,22,.45)_transparent]"
      >
        <div
          className="mx-auto flex h-12 min-w-max w-full items-center justify-between gap-2 px-2 font-sans text-xs sm:h-14 sm:gap-3 sm:px-3
    [&_button]:shrink-0 [&_button]:cursor-pointer [&_button]:rounded-md [&_button]:border-0 [&_button]:bg-transparent [&_button]:p-1.5 sm:[&_button]:p-2
    [&_button]:transition-colors [&_button]:hover:bg-black/[0.06]
    [&_button:disabled]:cursor-not-allowed [&_button:disabled]:opacity-40
    dark:[&_button]:text-white dark:[&_button]:hover:bg-white/[0.08]
    [&_span]:shrink-0"
        >
          {/* Left */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button type="button" title="Show Pages" aria-label="Show Pages" aria-expanded={showPageSidebar} onClick={() => { setShowSettings(false); setShowPageMenu(false); setShowPageSidebar(true); }}>
              <IconList size={21} />
            </button>
            <button type="button" title="First Page" onClick={() => goToPage(1)} disabled={page === 1}>
              <IconPause size={21} />
            </button>
            <button type="button" title="Previous Page" onClick={() => goToPage(page - 1)} disabled={page === 1}>
              <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}>
                <IconPlay size={21} />
              </span>
            </button>
            <button type="button" title="Previous Page" onClick={() => goToPage(page - 1)} disabled={page === 1} className="hidden lg:inline-flex">
              <span className="text-sm font-semibold">Previous</span>
            </button>
            <button ref={pageMenuButtonRef} type="button" title="Jump to Page" aria-expanded={showPageMenu} className="!flex !items-center !gap-1 !px-2 sm:!gap-1.5 sm:!px-2.5" onClick={openPageMenu}>
              <span className="text-sm font-semibold dark:text-white">{page}/{currentEdition.pages.length}</span>
              <IconChevronDown size={14} className={`transition-transform dark:text-white ${showPageMenu ? "rotate-180" : ""}`} />
            </button>
            <button type="button" title="Next Page" onClick={() => goToPage(page + 1)} disabled={page === currentEdition.pages.length} className="hidden lg:inline-flex">
              <span className="text-sm font-semibold">Next</span>
            </button>
            <button type="button" title="Next Page" onClick={() => goToPage(page + 1)} disabled={page === currentEdition.pages.length}>
              <IconPlay size={21} />
            </button>
            <button type="button" title="Last Page" onClick={() => goToPage(currentEdition.pages.length)} disabled={page === currentEdition.pages.length}>
              <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}>
                <IconPause size={21} />
              </span>
            </button>
          </div>

          {/* Center */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button type="button" title="Zoom Out" onClick={() => changeZoom(-0.25)} disabled={zoom === 0.5}>
              <IconMinus size={18} />
            </button>
            <span className="min-w-[48px] px-1 text-center text-[14px] font-medium dark:text-white sm:text-[15px]">{Math.round(zoom * 100)}%</span>
            <button type="button" title="Zoom In" onClick={() => changeZoom(0.25)} disabled={zoom === 6}>
              <IconPlus size={18} />
            </button>
            <button type="button" title="Reset" onClick={handleReset}>
              <IconReset size={21} />
            </button>
            <button type="button" title="Fit Width" onClick={fitWidth} className="hidden sm:inline-flex">
              <IconFlipH size={21} />
            </button>
            <button type="button" title="Fit Height" onClick={fitHeight} className="hidden sm:inline-flex">
              <IconFlipV size={21} />
            </button>
          </div>

          {/* Right */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            <button type="button" title="Download Current Page" disabled={isDownloading} onClick={downloadCurrentImage}>
              <IconSave size={21} />
            </button>
            <button type="button" title="Toggle Fullscreen" onClick={toggleFullscreen}>
              <IconExpand size={21} />
            </button>
            <button ref={settingsButtonRef} type="button" title="Zoom Settings" aria-expanded={showSettings} onClick={openSettings}>
              <IconSettings size={21} />
            </button>
            <button
              type="button"
              title="Close Reader"
              className="!flex !h-8 !w-8 sm:!h-9 sm:!w-9 !items-center !justify-center !rounded-full !bg-black/5 !p-0 text-ink hover:!bg-[#e48d0b]/15 hover:!text-[#e48d0b] dark:!bg-white/10 dark:!text-white"
              onClick={() => navigate(`/epaper/view/${editionId}?page=${page}`)}
            >
              <IconClose size={22} />
            </button>
          </div>
        </div>
      </div>

      {showPageMenu && pageMenuPos && createPortal(
        <div ref={pageMenuMenuRef} style={{ position: "fixed", top: pageMenuPos.top, left: pageMenuPos.left }} className="z-[10000] max-h-56 w-36 overflow-y-auto rounded-xl border border-black/10 bg-white p-1.5 font-sans text-xs text-ink shadow-lg dark:border-white/10 dark:bg-neutral-900 dark:text-white">
          {currentEdition.pages.map((_, index) => (
            <button key={index} type="button" className={`flex w-full cursor-pointer items-center gap-2 rounded-md border-0 bg-transparent px-2.5 py-1.5 text-left transition-colors hover:bg-black/[0.06] dark:text-white dark:hover:bg-white/[0.08] ${index + 1 === page ? "bg-black/[0.08] font-semibold dark:bg-white/[0.12]" : ""}`} onClick={() => { goToPage(index + 1); setShowPageMenu(false); }}>
              <span>Page {index + 1}</span>
            </button>
          ))}
        </div>,
        document.body
      )}

      {showSettings && settingsPos && createPortal(
        <div ref={settingsMenuRef} style={{ position: "fixed", top: settingsPos.top, right: settingsPos.right }} className="z-[10000] flex items-center gap-1.5 rounded-xl border border-black/10 bg-white p-2 font-sans text-xs text-ink shadow-lg dark:border-white/10 dark:bg-neutral-900 dark:text-white">
          <span className="px-1 font-semibold dark:text-white">Zoom {Math.round(zoom * 100)}%</span>
          <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-0 bg-black/[0.06] px-2.5 py-1.5 transition-colors hover:bg-black/[0.1] dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]" onClick={() => { setZoom(1); setRotation(0); }}>
            <IconReset size={14} />
            <span>Reset</span>
          </button>
          <button type="button" className="flex cursor-pointer items-center gap-1 rounded-md border-0 bg-black/[0.06] px-2.5 py-1.5 transition-colors hover:bg-black/[0.1] dark:bg-white/[0.08] dark:text-white dark:hover:bg-white/[0.14]" onClick={() => { fitToScreen(); setShowSettings(false); }}>
            <IconExpand size={14} />
            <span>Fit</span>
          </button>
        </div>,
        document.body
      )}

      {showPageSidebar && (
        <div className="absolute inset-0 z-30">
          <button type="button" aria-label="Close page list" className="absolute inset-0 h-full w-full cursor-default border-0 bg-black/55 p-0" onClick={() => setShowPageSidebar(false)} />
          <aside aria-label="E-paper page list" className="relative z-10 flex h-full w-[50vw] flex-col border-r border-black/10 bg-white p-1 shadow-2xl dark:border-white/10 dark:bg-neutral-900 sm:w-[280px] sm:p-3">
            <div className="flex shrink-0 items-center justify-between border-b border-black/10 pb-2 dark:border-white/10">
              <span className="font-gu text-[20px] font-bold text-ink dark:text-white sm:text-[26px]">પેજ યાદી</span>
              <button type="button" title="Close page list" aria-label="Close page list" className="!flex !h-8 !w-8 !items-center !justify-center !rounded-full !bg-black/5 !p-0 text-ink hover:!bg-[#e48d0b]/15 hover:!text-[#e48d0b] dark:!bg-white/10 dark:!text-white" onClick={() => setShowPageSidebar(false)}>
                <IconClose size={18} />
              </button>
            </div>
            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-1 [scrollbar-color:rgba(184,122,22,.45)_transparent] [scrollbar-width:thin] sm:gap-10 sm:p-1.5">
              {currentEdition.pages.map((pageItem) => (
                <button key={pageItem.number} type="button" className={`group shrink-0 cursor-pointer overflow-hidden rounded-md border-0 bg-transparent p-0 text-center shadow-sm transition-transform hover:-translate-y-0.5 sm:rounded-lg ${page === pageItem.number ? "ring-2 ring-[#e11d3f] ring-offset-1 ring-offset-white dark:ring-offset-neutral-900" : ""}`} onClick={() => { goToPage(pageItem.number); setShowPageSidebar(false); }} aria-current={page === pageItem.number ? "page" : undefined}>
                  <img src={pageItem.image} alt={`પેજ ${pageItem.number}`} className="block h-auto w-full bg-white object-contain" />
                  <span className="block bg-white py-1 text-[20px] font-bold leading-none text-black underline decoration-[#f21f3d] decoration-2 underline-offset-2 dark:bg-neutral-900 dark:text-white sm:py-1.5 sm:text-sm">
                    પાનું {pageItem.number}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Viewer */}
      <div
        ref={viewerRef}
        className="relative flex-1 overflow-auto overscroll-contain bg-white dark:bg-neutral-950"
        style={{ touchAction: isSnipping ? "none" : "auto" }}
      >
        <div
          className={`mx-auto origin-top-left ${zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          style={{ width: `${Math.max(1, baseWidth * zoom)}px`, transition: "width 150ms" }}
          onClick={() => {
            if (suppressNextImageClickRef.current) {
              suppressNextImageClickRef.current = false;
              return;
            }
            if (!isSnipping) setZoom((z) => (z > 1 ? 1 : 1.5));
          }}
        >
          <div
            className={`relative origin-center select-none text-center ${isSnipping ? "cursor-crosshair" : ""}`}
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 150ms",
              touchAction: isSnipping ? "none" : "auto",
            }}
            onPointerDown={handleSnipPointerDown}
            onPointerMove={handleSnipPointerMove}
            onPointerUp={handleSnipPointerUp}
            onPointerCancel={handleSnipPointerUp}
          >
            <img
              ref={imageRef}
              src={item.image}
              alt={`ગુજરાતમિત્ર ઈ-પેપર પેજ ${page}`}
              className="pointer-events-none block h-auto w-full"
              draggable={false}
              onError={() => showToast("Unable to load this page image.")}
            />
            {isSnipping && snipSelection && (
              <div
                className="pointer-events-none absolute border-2 border-[#e48d0b] bg-[#e48d0b]/20 shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]"
                style={{
                  left: snipSelection.x,
                  top: snipSelection.y,
                  width: snipSelection.width,
                  height: snipSelection.height,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Snip button — Crop + Share badge */}
      <button
        type="button"
        title={isSnipping ? "સ્નિપ મોડ બંધ કરો" : "સ્નિપ & શેર"}
        aria-label={isSnipping ? "સ્નિપ મોડ બંધ કરો" : "સ્નિપ & શેર"}
        aria-pressed={isSnipping}
        aria-busy={isProcessingSnip}
        disabled={isProcessingSnip}
        style={{
          bottom: "max(8px, env(safe-area-inset-bottom, 0px))",
          right: window.innerWidth < 768 ? "8px" : "max(25px, env(safe-area-inset-right, 0px))",
        }}
        className={`fixed z-[10000] flex h-11 w-11 md:h-14 md:w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:scale-100 ${isSnipping
          ? "bg-[#e48d0b] ring-2 ring-[#e48d0b] ring-offset-2 ring-offset-white dark:ring-offset-neutral-950"
          : "bg-[#666] hover:bg-[#555]"
          }`}
        onClick={toggleSnipping}
      >
        {isProcessingSnip ? (
          <IconSpinner className="h-5 w-5 md:h-[26px] md:w-[26px] pointer-events-none text-white" />
        ) : (
          <>
            {/* Main Crop icon */}
            <Crop strokeWidth={2.25} className="h-5 w-5 md:h-[26px] md:w-[26px] pointer-events-none text-white" />

            {/* Top-right Share badge */}
            <span
              className="pointer-events-none absolute -right-0.5 -top-0.5 md:-right-1 md:-top-1 flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-[#FFD700] shadow-sm"
              aria-hidden
            >
              <Share strokeWidth={2.5} className="h-3 w-3 md:h-[13px] md:w-[13px] text-black" />
            </span>
          </>
        )}
      </button>

      {showSnipTutorial && (
        <SnipTutorialOverlay onDismiss={() => setShowSnipTutorial(false)} />
      )}

      {snipModal && (
        <SnipPreviewModal
          previewUrl={snipModal.previewUrl}
          blob={snipModal.blob}
          page={page}
          onClose={closeSnipModal}
          showToast={showToast}
        />
      )}

      {toast && (
        <div role="alert" className="fixed bottom-4 left-1/2 z-[10000] -translate-x-1/2 rounded-lg bg-black/80 px-4 py-2 font-sans text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}