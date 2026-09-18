import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  UploadCloud,
  ArrowLeft,
  FileText,
  Languages,
  ChevronRight,
  X,
} from "lucide-react";

import TiptapEditorK from "../tiptapeditor/TiptapEditor.jsx";

const getCaretCoordinates = (element, position) => {
  const div = document.createElement("div");
  const style = getComputedStyle(element);

  for (const prop of style) {
    div.style[prop] = style[prop];
  }

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.top = "0px";
  div.style.left = "0px";

  div.textContent = element.value.substring(0, position);

  const span = document.createElement("span");
  span.textContent = element.value.substring(position) || ".";
  div.appendChild(span);

  document.body.appendChild(div);
  const { offsetLeft } = span;
  document.body.removeChild(div);

  return { left: offsetLeft };
};

const CharchaPatraForm = () => {
  const fileInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { relatedTitle, authorName } = location.state || {};

  const [formData, setFormData] = useState({
    title: relatedTitle ? `Re: ${relatedTitle}` : "",
    bodyContent: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isTitleGujarati, setIsTitleGujarati] = useState(true);
  const [isBodyGujarati, setIsBodyGujarati] = useState(true);

  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeWord, setActiveWord] = useState("");
  const [titlePopoverLeft, setTitlePopoverLeft] = useState(0);

  // revoke object URL when preview changes / unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideInput =
        titleInputRef.current && titleInputRef.current.contains(event.target);
      const isInsidePopover = event.target.closest(".transliteration-popover");

      if (!isInsideInput && !isInsidePopover) {
        clearSuggestions();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const setImageFromFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;

    if (imagePreview) URL.revokeObjectURL(imagePreview);

    const url = URL.createObjectURL(file);
    setImageFile(file);
    setImagePreview(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImageFromFile(file);
  };

  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    setImageFromFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Form Data:", { ...formData, imageFile });
  };

  const clearSuggestions = () => {
    setSuggestions([]);
    setSelectedIndex(0);
    setActiveWord("");
  };

  const fetchTitleSuggestions = async (word) => {
    if (!word || !/^[a-zA-Z]+$/.test(word)) {
      clearSuggestions();
      return;
    }
    try {
      const res = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(
          word
        )}&itc=gu-t-i0-und&num=5`
      );
      const data = await res.json();

      if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]) {
        setSuggestions(data[1][0][1]);
        setSelectedIndex(0);
        setActiveWord(word);
      }
    } catch (err) {
      console.error("Transliteration error:", err);
    }
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const inputEl = e.target;
    setFormData({ ...formData, title: val });

    if (!isTitleGujarati) {
      clearSuggestions();
      return;
    }

    const caretPos = inputEl.selectionStart || val.length;
    const coords = getCaretCoordinates(inputEl, caretPos);

    const maxLeft = inputEl.clientWidth - 260;
    setTitlePopoverLeft(
      Math.min(Math.max(16, coords.left), Math.max(16, maxLeft))
    );

    const words = val.split(/\s+/);
    const lastWord = words[words.length - 1];

    if (lastWord && /^[a-zA-Z]+$/.test(lastWord)) {
      fetchTitleSuggestions(lastWord);
    } else {
      clearSuggestions();
    }
  };

  const applyTitleSuggestion = (selectedWord) => {
    if (!activeWord || !selectedWord) return;

    const words = formData.title.split(/\s+/);
    words[words.length - 1] = selectedWord;
    const newTitle = words.join(" ") + " ";

    setFormData({ ...formData, title: newTitle });
    clearSuggestions();

    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  const handleTitleKeyDown = (e) => {
    if (!isTitleGujarati || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" || e.key === "Tab" || e.key === " ") {
      e.preventDefault();
      if (suggestions[selectedIndex]) {
        applyTitleSuggestion(suggestions[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      clearSuggestions();
    }
  };

  return (
    <div
      className="
      w-full flex flex-col space-y-6
      rounded-none border-0 bg-transparent p-0 shadow-none md:p-4
      md:rounded-3xl md:border md:border-gray-200/70 md:bg-white md:p-7
      md:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
      dark:md:border-white/10 dark:md:bg-[#121212]
    "
    >
      {/* Breadcrumb */}
      <div className="flex min-w-0 items-center gap-1 border-b border-black/5 pb-3 font-gu text-[15px] font-semibold text-ink sm:text-[17px] dark:border-white/10 dark:text-ink-dark">
        <button
          type="button"
          className="mr-2 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-black/5 text-inherit transition-colors hover:bg-[#e48d0b]/15 hover:text-[#e48d0b] sm:mr-3 sm:h-9 sm:w-9 dark:bg-white/10"
          onClick={() => navigate(-1)}
          aria-label="પાછળ જાઓ"
        >
          <ArrowLeft size={16} className="sm:h-[18px] sm:w-[18px]" />
        </button>
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-ink/60 transition-colors hover:text-[#e48d0b] dark:text-ink-dark/60"
          onClick={() => navigate("/")}
        >
          હોમ
        </button>
        <ChevronRight
          size={14}
          className="shrink-0 text-ink/40 dark:text-ink-dark/40"
        />
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 text-ink/60 transition-colors hover:text-[#e48d0b] dark:text-ink-dark/60"
          onClick={() => navigate("/charcha-patra")}
        >
          ચર્ચાપત્ર
        </button>
        <ChevronRight
          size={14}
          className="shrink-0 text-ink/40 dark:text-ink-dark/40"
        />
        <span className="min-w-0 truncate text-[#e48d0b]">
          {relatedTitle ? "સંબંધિત ચર્ચાપત્ર લખો" : "ચર્ચાપત્ર લખો"}
        </span>
      </div>

      {/* Form */}
      <div className="w-full min-w-0">
        <h1 className="mb-4 font-gu text-[24px] font-semibold text-ink sm:mb-6 sm:text-[28px] md:text-[32px] dark:text-ink-dark">
          {relatedTitle ? "સંબંધિત ચર્ચાપત્ર લખો" : "નવું ચર્ચાપત્ર લખો"}
        </h1>

        {relatedTitle && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#e48d0b]/30 bg-[#e48d0b]/8 p-3 sm:mb-6 sm:rounded-2xl sm:p-4">
            <FileText className="mt-0.5 shrink-0 text-[#e48d0b]" size={18} />
            <div className="min-w-0">
              <p className="font-gu text-[14px] font-medium uppercase tracking-wide text-[#e48d0b] sm:text-[17px]">
                આ ચર્ચાપત્રને જવાબ આપી રહ્યા છો
              </p>
              <p className="mt-1 font-gu text-[16px] font-medium leading-snug text-ink sm:text-[19px] dark:text-ink-dark">
                {relatedTitle}
              </p>
              {authorName && (
                <p className="mt-0.5 font-gu text-[14px] text-ink/60 sm:text-[17px] dark:text-ink-dark/60">
                  લેખક: {authorName}
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Title */}
          <div className="w-full min-w-0">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
              <label
                htmlFor="charchapatra-title"
                className="block font-gu text-[16px] font-medium text-ink sm:text-[18px] dark:text-ink-dark"
              >
                ચર્ચાપત્રનું શીર્ષક
              </label>
              <button
                type="button"
                onClick={() => setIsTitleGujarati((prev) => !prev)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-2.5 py-1 font-gu text-[12px] font-semibold transition-all sm:gap-2 sm:px-3 sm:text-[13px] ${
                  isTitleGujarati
                    ? "border-[#e48d0b] bg-[#e48d0b]/15 text-[#e48d0b]"
                    : "border-black/10 bg-black/5 text-ink/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-ink-dark/60"
                }`}
              >
                <Languages size={14} />
                <span>
                  {isTitleGujarati ? "ગુજરાતી (ON)" : "English (OFF)"}
                </span>
              </button>
            </div>
            <div className="relative w-full" ref={titleInputRef}>
              <input
                type="text"
                id="charchapatra-title"
                value={formData.title}
                onChange={handleTitleChange}
                onKeyDown={handleTitleKeyDown}
                placeholder="ચર્ચાપત્રનું શીર્ષક લખો..."
                className="block w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-gu text-[16px] text-ink outline-none transition focus:border-[#e48d0b] focus:ring-1 focus:ring-[#e48d0b]/40 sm:px-4 sm:py-3 sm:text-[18px] dark:border-white/10 dark:bg-[#1a1a1a] dark:text-ink-dark"
              />
              {isTitleGujarati && suggestions.length > 0 && (
                <div
                  className="transliteration-popover absolute top-full z-30 mt-1 flex min-w-[200px] max-w-[min(350px,calc(100vw-2rem))] w-max flex-col overflow-hidden rounded-xl border-2 border-[#e48d0b]/50 bg-white shadow-xl dark:bg-neutral-900"
                  style={{ left: `${titlePopoverLeft}px` }}
                >
                  {suggestions.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        applyTitleSuggestion(item);
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`cursor-pointer px-4 py-2.5 text-left font-gu text-[16px] transition-colors sm:px-5 sm:py-3 sm:text-[18px] ${
                        idx === selectedIndex
                          ? "border-l-4 border-[#e48d0b] bg-[#e48d0b]/20 font-bold text-ink dark:text-ink-dark"
                          : "text-ink hover:bg-[#e48d0b]/10 dark:text-ink-dark"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="w-full min-w-0">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
              <label className="block font-gu text-[16px] font-medium text-ink sm:text-[18px] dark:text-ink-dark">
                ચર્ચાપત્રનું લખાણ
              </label>
              <button
                type="button"
                onClick={() => setIsBodyGujarati((prev) => !prev)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-[6px] border px-2.5 py-1 font-gu text-[12px] font-semibold transition-all sm:gap-2 sm:px-3 sm:text-[13px] ${
                  isBodyGujarati
                    ? "border-[#e48d0b] bg-[#e48d0b]/15 text-[#e48d0b]"
                    : "border-black/10 bg-black/5 text-ink/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-ink-dark/60"
                }`}
              >
                <Languages size={14} />
                <span>
                  {isBodyGujarati ? "ગુજરાતી (ON)" : "English (OFF)"}
                </span>
              </button>
            </div>
            <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition-all focus-within:border-[#e48d0b] focus-within:ring-1 focus-within:ring-[#e48d0b]/40 dark:border-white/10 dark:bg-[#1a1a1a]">
              <TiptapEditorK
                content={formData.bodyContent}
                isGujarati={isBodyGujarati}
                onChange={(htmlContent) =>
                  setFormData({ ...formData, bodyContent: htmlContent })
                }
              />
            </div>
          </div>

          {/* File Upload + Preview */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-black/[0.02] p-5 text-center transition-colors hover:bg-black/[0.04] sm:rounded-2xl sm:p-8 dark:border-white/15 dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative w-full max-w-md">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mx-auto max-h-[280px] w-full rounded-xl object-contain"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                  aria-label="ફોટો દૂર કરો"
                >
                  <X size={16} />
                </button>
                <p className="mt-3 truncate font-gu text-[13px] text-ink/60 dark:text-ink-dark/60">
                  {imageFile?.name}
                </p>
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="mt-3 cursor-pointer rounded-[6px] border border-black/10 bg-white px-4 py-2 font-gu text-[13px] font-semibold text-ink shadow-sm transition hover:bg-black/5 sm:text-[14px] dark:border-white/10 dark:bg-white/10 dark:text-ink-dark dark:hover:bg-white/15"
                >
                  બીજો ફોટો પસંદ કરો
                </button>
              </div>
            ) : (
              <>
                <UploadCloud
                  size={36}
                  className="mb-2 text-ink/40 sm:mb-3 sm:h-[42px] sm:w-[42px] dark:text-ink-dark/40"
                  strokeWidth={1.5}
                />
                <h3 className="mb-1 font-gu text-[16px] font-semibold text-ink sm:text-[18px] dark:text-ink-dark">
                  ફોટો અપલોડ કરો
                </h3>
                <p className="mb-4 font-gu text-[13px] text-ink/55 sm:mb-5 sm:text-[14px] dark:text-ink-dark/55">
                  ડ્રેગ અને ડ્રોપ કરો અથવા બ્રાઉઝ કરીને મીડિયા અપલોડ કરો.
                </p>
                <button
                  type="button"
                  onClick={handleBrowseClick}
                  className="cursor-pointer rounded-[6px] border border-black/10 bg-white px-4 py-2 font-gu text-[13px] font-semibold text-ink shadow-sm transition hover:bg-black/5 sm:px-5 sm:text-[14px] dark:border-white/10 dark:bg-white/10 dark:text-ink-dark dark:hover:bg-white/15"
                >
                  ફાઇલ પસંદ કરો
                </button>
              </>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center pt-1 sm:pt-2">
            <button
              type="submit"
              className="w-full max-w-xs cursor-pointer rounded-[6px] bg-[#e48d0b] px-8 py-2.5 font-gu text-[16px] font-semibold text-white shadow transition hover:bg-[#d4922f] active:scale-[0.98] sm:w-auto sm:px-10 sm:text-[17px]"
            >
              સબમિટ કરો
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CharchaPatraForm;