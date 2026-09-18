import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  ChevronRight,
  Bookmark,
  Sparkles,
  FileText,
  Upload,
  ArrowLeft,
  MessageSquareText,
  Volume2,
  VolumeOff,
  Star,
  Edit3,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCharchaPatraDetail } from "../../context/CharchaPatraDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";
import { charchaPatroData } from "../../data/CharchaPatroData.js";
import ShareModal from "../common/ShareModal.jsx";

function stripHtmlTags(html) {
  if (!html) return "";
  return html.replace(/<\/?[^>]+(>|$)/g, "");
}

function parseBodyParagraphs(body) {
  if (!body) return [];
  const pMatches = body.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (pMatches && pMatches.length > 0) {
    return pMatches
      .map((m) => m.replace(/<\/?p[^>]*>/gi, "").trim())
      .filter(Boolean);
  }
  return body
    .split(/\n+|\|/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function generateAISummary(article) {
  if (!article) return "આ ચર્ચાપત્રનો AI સારાંશ ઉપલબ્ધ નથી.";
  const rawContent = article.description || article.body || article.content || article.text || "";
  const cleanText = stripHtmlTags(rawContent);
  if (cleanText.length > 160) return `${cleanText.slice(0, 160).trim()}...`;
  return (
    cleanText ||
    "આ ચર્ચાપત્રના મુખ્ય મુદ્દાઓ આપમેળે જનરેટ થયા છે. વધુ વિગતો માટે સંપૂર્ણ ચર્ચાપત્ર વાંચો."
  );
}

function AdBlock() {
  return (
    <div className="my-4 flex justify-center" aria-hidden="true">
      <div
        className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-100 text-xs text-gray-400 dark:border-white/10 dark:bg-white/5"
        style={{ width: "min(234px, 100%)", height: "60px" }}
      >
        Advertisement
      </div>
    </div>
  );
}

function ParagraphsWithAds({ paragraphs }) {
  const blocks = useMemo(() => {
    if (!paragraphs || paragraphs.length === 0) return [];
    const generatedBlocks = [];
    let i = 0;
    if (i < paragraphs.length) {
      generatedBlocks.push({ type: "paras", items: [paragraphs[i]] });
      i += 1;
      generatedBlocks.push({ type: "ad" });
    }
    while (i < paragraphs.length) {
      const chunk = paragraphs.slice(i, i + 2);
      generatedBlocks.push({ type: "paras", items: chunk });
      i += chunk.length;
      generatedBlocks.push({ type: "ad" });
    }
    return generatedBlocks;
  }, [paragraphs]);

  if (!paragraphs || paragraphs.length === 0) {
    return (
      <p className="font-gu text-[15px] text-ink/60 dark:text-ink-dark/60">
        ચર્ચાપત્રની વિગતો ઉપલબ્ધ નથી.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {blocks.map((block, bi) => {
        if (block.type === "ad") return <AdBlock key={`ad-${bi}`} />;
        return (
          <div key={`paras-${bi}`} className="space-y-4">
            {block.items.map((para, pi) => (
              <p
                key={`para-${bi}-${pi}`}
                className="font-gu text-[18px] font-normal leading-relaxed text-ink sm:text-[20px] md:text-[24px] dark:text-ink-dark"
              >
                {para}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function getMockComments(articleId) {
  const baseComments = [
    {
      id: "mock-1",
      name: "રાજેશ પટેલ",
      time: "૨ કલાક પહેલા",
      text: "ખૂબ જ મહત્વની માહિતી. આવા ચર્ચાપત્રો વધુ આવવા જોઈએ.",
    },
    {
      id: "mock-2",
      name: "પ્રિયા શાહ",
      time: "૫ કલાક પહેલા",
      text: "સરકારે આ મુદ્દે તાત્કાલિક પગલાં લેવા જોઈએ. સારો અભિપ્રાય.",
    },
    {
      id: "mock-3",
      name: "અમિત દેસાઈ",
      time: "૧ દિવસ પહેલા",
      text: "વિગતવાર રજૂઆત કરી છે. આભાર ગુજરાત મિત્ર!",
    },
  ];
  const charCode =
    articleId && String(articleId).length > 1
      ? String(articleId).charCodeAt(1)
      : 0;
  const count = isNaN(charCode) ? 0 : charCode % 3;
  return baseComments.slice(0, 2 + count);
}

function toGujaratiDigits(str) {
  if (str === null || str === undefined) return "";
  const map = {
    "0": "૦", "1": "૧", "2": "૨", "3": "૩", "4": "૪",
    "5": "૫", "6": "૬", "7": "૭", "8": "૮", "9": "૯", ".": ".",
  };
  return String(str).replace(/[0-9.]/g, (m) => map[m] || m);
}

const gujaratiDigitMap = { "૦": "0", "૧": "1", "૨": "2", "૩": "3", "૪": "4", "૫": "5", "૬": "6", "૭": "7", "૮": "8", "૯": "9" };
const gujaratiMonthMap = { જાન્યુઆરી: 0, ફેબ્રુઆરી: 1, માર્ચ: 2, એપ્રિલ: 3, મે: 4, જૂન: 5, જુલાઈ: 6, ઓગસ્ટ: 7, સપ્ટેમ્બર: 8, ઓક્ટોબર: 9, નવેમ્બર: 10, ડિસેમ્બર: 11 };

function getDateValue(dateText) {
  if (!dateText) return 0;
  const normalized = String(dateText).replace(/[૦-૯]/g, (digit) => gujaratiDigitMap[digit]);
  const match = normalized.match(/(\d+)\s+([^,]+),\s*(\d+)/);
  if (!match) return 0;
  const month = gujaratiMonthMap[match[2].trim()];
  if (month === undefined) return 0;
  return new Date(Number(match[3]), month, Number(match[1])).getTime();
}

function sortByDateDescending(items) {
  return [...items].sort((a, b) => {
    const dateDifference = getDateValue(b.date) - getDateValue(a.date);
    return dateDifference || Number(b.id) - Number(a.id);
  });
}

export default function CharchapatraDetailPanel() {
  const { activeItem: article, closeDetail, openDetail } = useCharchaPatraDetail();
  const { isSaved, toggleSave } = useSavedNews();
  const navigate = useNavigate();

  const [tab, setTab] = useState("full");
  const [shareOpen, setShareOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCommentsListOpen, setIsCommentsListOpen] = useState(false);

  const commentsRef = useRef(null);
  const feedbackRef = useRef(null);
  const commentInputRef = useRef(null);

  const scrollToComments = useCallback(() => {
    setIsCommentsListOpen(true);
    const el = feedbackRef.current || commentsRef.current;
    if (!el) return;
    el.style.scrollMarginTop = "80px";
    el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });

    requestAnimationFrame(() => {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
      window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
    });

    setTimeout(() => {
      const input = commentInputRef.current;
      if (input) {
        input.focus({ preventScroll: true });
      }
    }, 350);
  }, []);

  const isBookmarked = article ? isSaved(article.id) : false;

  const related = useMemo(() => {
    if (!article || !Array.isArray(charchaPatroData)) return [];
    const available = charchaPatroData.filter((item) => item.id !== article.id);
    const sameAuthor = available.filter((item) => item.author === article.author);
    const others = available.filter((item) => item.author !== article.author);
    return [
      ...sortByDateDescending(sameAuthor),
      ...sortByDateDescending(others),
    ];
  }, [article?.id, article?.author]);

  useEffect(() => {
    if (article) {
      setTab("full");
      setCommentText("");
      setComments(getMockComments(article.id));
      setIsCommentsListOpen(false);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  }, [article?.id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDetail]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleWhatsAppShare = useCallback(() => {
    if (!article) return;
    const text = `${article.title || "ચર્ચાપત્ર"}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }, [article]);

  const handleXShare = useCallback(() => {
    if (!article) return;
    const text = `${article.title || "ચર્ચાપત્ર"}\n${window.location.href}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }, [article]);

  const handlePostComment = useCallback(() => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      {
        id: `comment-${Date.now()}`,
        name: "તમે",
        time: "હમણાં",
        text: commentText.trim(),
      },
      ...prev,
    ]);
    setCommentText("");
  }, [commentText]);

  const pickVoice = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    const score = (v) => {
      const name = (v.name || "").toLowerCase();
      const lang = (v.lang || "").toLowerCase();
      let s = 0;
      if (lang.startsWith("gu")) s += 100;
      if (lang.startsWith("hi")) s += 70;
      if (lang.startsWith("en-in") || lang === "en_in") s += 40;
      if (name.includes("google")) s += 30;
      if (name.includes("gujarati") || name.includes("ગુજ")) s += 50;
      if (v.localService === false) s += 10;
      return s;
    };
    return [...voices].sort((a, b) => score(b) - score(a))[0] || null;
  }, []);

  const handleListen = useCallback(() => {
    if (!article || typeof window === "undefined" || !window.speechSynthesis) {
      alert("તમારા બ્રાઉઝરમાં સ્પીચ સપોર્ટ નથી.");
      return;
    }
    const synth = window.speechSynthesis;
    if (isSpeaking || synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    const rawContent = article.description || article.body || article.content || "";
    const cleanText = stripHtmlTags(rawContent);
    const textToSpeak = [article.title || "", cleanText].filter(Boolean).join(". ");
    if (!textToSpeak.trim()) return;

    const speakNow = () => {
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "gu-IN";
      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voice = pickVoice();
      if (voice) {
        utterance.voice = voice;
        if (voice.lang) utterance.lang = voice.lang;
      }
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setTimeout(() => {
        synth.speak(utterance);
        setIsSpeaking(true);
      }, 60);
    };

    const voices = synth.getVoices();
    if (!voices || voices.length === 0) {
      const onVoices = () => {
        synth.removeEventListener("voiceschanged", onVoices);
        speakNow();
      };
      synth.addEventListener("voiceschanged", onVoices);
      setTimeout(() => {
        synth.removeEventListener("voiceschanged", onVoices);
        speakNow();
      }, 500);
    } else {
      speakNow();
    }
  }, [article, isSpeaking, pickVoice]);

  const truncateWords = (text, max = 3) => {
    if (!text) return "";
    const words = String(text).trim().split(/\s+/);
    if (words.length <= max) return text;
    return `${words.slice(0, max).join(" ")}...`;
  };

  if (!article) return null;

  const rawContent = article.description || article.body || article.content || article.text || "";
  const paragraphs = parseBodyParagraphs(rawContent);
  const aiSummary = generateAISummary(article);
  const author = article.author || "વાચક";

  return (
    <div
      className="
        w-full min-w-0
        rounded-none border-0 bg-transparent p-0 shadow-none
        sm:rounded-3xl sm:border sm:border-gray-200/70 sm:bg-white sm:p-5 sm:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
        md:p-7
        dark:sm:border-white/10 dark:sm:bg-[#121212]
      "
      role="article"
      aria-label={article.title}
    >
      {/* Breadcrumb */}
      <div className="mb-3 flex min-w-0 items-center gap-1.5 border-b border-black/8 pb-3 sm:mb-4 sm:gap-2 dark:border-white/10">
        <button
          type="button"
          onClick={() => {
            closeDetail("/charcha-patra");
            navigate("/charcha-patra", { replace: true });
          }}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/5 text-ink transition-colors hover:bg-[#e48d0b]/15 hover:text-[#e48d0b] sm:h-9 sm:w-9 dark:bg-white/10 dark:text-ink-dark"
          aria-label="બંધ કરો"
        >
          <ArrowLeft size={16} className="sm:h-[18px] sm:w-[18px]" />
        </button>

        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden font-gu text-[13px] text-ink/60 sm:gap-1.5 sm:text-[15px] md:text-[17px] dark:text-ink-dark/60"
        >
          <button
            type="button"
            onClick={() => {
              closeDetail("/");
              navigate("/");
            }}
            className="shrink-0 cursor-pointer font-medium transition-colors hover:text-[#e48d0b]"
          >
            હોમ
          </button>
          <ChevronRight size={14} className="shrink-0 opacity-50" />
          <button
            type="button"
            onClick={() => {
              closeDetail("/charcha-patra");
              navigate("/charcha-patra", { replace: true });
            }}
            className="shrink-0 cursor-pointer font-medium text-ink/80 transition-colors hover:text-[#e48d0b] dark:text-ink-dark/80"
          >
            ચર્ચાપત્ર
          </button>
          <ChevronRight size={14} className="shrink-0 opacity-50" />
          <span
            className="min-w-0 truncate font-semibold text-[#e48d0b]"
            title={article.title}
            aria-current="page"
          >
            {truncateWords(article.title || "લેખ", 3)}
          </span>
        </nav>

        <button
          type="button"
          onClick={handleListen}
          className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1.5 font-gu text-[12px] font-semibold transition-all sm:gap-1.5 sm:px-3 sm:text-[14px] md:text-[15px] ${
            isSpeaking
              ? "border-[#e48d0b] bg-[#e48d0b]/15 text-[#e48d0b]"
              : "border-black/10 bg-white text-ink/70 hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-dark/70"
          }`}
          aria-label={isSpeaking ? "બંધ કરો" : "સાંભળો"}
        >
          {isSpeaking ? <VolumeOff size={15} /> : <Volume2 size={15} />}
          <span className="hidden xs:inline sm:inline">
            {isSpeaking ? "બંધ કરો" : "સાંભળો"}
          </span>
        </button>
      </div>

      {/* HEADING */}
      <h1 className="mb-2 font-gu text-[24px] font-bold leading-snug text-ink sm:text-[32px] md:text-[40px] lg:text-[48px] dark:text-ink-dark">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="mb-4 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-gu text-[13px] text-ink/55 sm:mb-5 sm:text-[16px] md:text-[18px] dark:text-ink-dark/55">
        <span>પોસ્ટ કરેલ: {article.date || "—"}</span>
        <span className="opacity-50">•</span>
        <button
          type="button"
          onClick={() =>
            navigate(`/charcha-patra/profile/${encodeURIComponent(author)}`)
          }
          className="cursor-pointer border-0 bg-transparent p-0 font-gu font-bold text-[#e48d0b]"
        >
          {author}
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            closeDetail("/charcha-patra/form");
            navigate("/charcha-patra/form", {
              state: {
                relatedTitle: article.title || "",
                authorName: author || "",
              },
            });
          }}
          className="relative z-10 ml-auto flex shrink-0 cursor-pointer items-center gap-1 rounded-[6px] border border-[#e48d0b]/60 px-2 py-1 font-gu text-[11px] font-semibold text-[#e48d0b] transition-all hover:bg-[#e48d0b]/10 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[13px]"
        >
          <Edit3 size={13} className="sm:h-[15px] sm:w-[15px]" />
          <span>સંબંધિત ચર્ચાપત્ર લખો</span>
        </button>
      </div>

      {/* Image */}
      {(article.image || article.img) && (
        <div className="mb-4 overflow-hidden rounded-[7px] bg-black/5 sm:mb-6 sm:rounded-[10px] dark:bg-white/5">
          <img
            src={article.image || article.img}
            alt={article.title || "ચર્ચાપત્ર ઈમેજ"}
            className="h-auto max-h-[280px] w-full object-cover sm:max-h-[360px] md:max-h-[420px]"
            loading="lazy"
          />
        </div>
      )}

      {/* Tabs + Actions */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex w-full gap-1 rounded-3xl bg-black/[0.04] p-1 sm:max-w-md lg:max-w-[340px] dark:bg-white/[0.06]">
          <button
            type="button"
            onClick={() => setTab("full")}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-3xl px-2 py-2 font-gu text-[13px] font-semibold transition-all duration-200 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-[15px] ${
              tab === "full"
                ? "bg-[#e48d0b] text-white shadow-sm"
                : "text-ink/70 hover:bg-black/[0.04] dark:text-ink-dark/70 dark:hover:bg-white/[0.05]"
            }`}
          >
            <FileText size={15} strokeWidth={2} />
            <span>સંપૂર્ણ ચર્ચાપત્ર</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("ai")}
            className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-3xl px-2 py-2 font-gu text-[13px] font-semibold transition-all duration-200 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-[15px] ${
              tab === "ai"
                ? "bg-[#e48d0b] text-white shadow-sm"
                : "text-ink/70 hover:bg-black/[0.04] dark:text-ink-dark/70 dark:hover:bg-white/[0.05]"
            }`}
          >
            <Sparkles size={15} strokeWidth={2} />
            <span>AI સારાંશ</span>
          </button>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <button
            type="button"
            onClick={scrollToComments}
            className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-ink/70 transition-all hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] sm:h-10 sm:px-3 dark:border-white/10 dark:bg-white/[0.04]"
            aria-label="કમેન્ટ્સ"
          >
            <MessageSquareText size={17} />
            <span className="font-gu text-xs">{comments.length}</span>
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white text-ink/70 transition-all hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] sm:h-10 sm:w-10 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-dark/70"
              aria-label="શેર કરો"
              title="શેર કરો"
            >
              <Upload size={17} />
            </button>
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white text-ink/70 transition-all hover:border-[#25D366]/50 hover:bg-[#25D366]/10 sm:h-10 sm:w-10 dark:border-white/10 dark:bg-white/[0.04]"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.02.24-3.4-.71-2.87-1.15-4.71-4.06-4.85-4.25-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09.99-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.61-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.35z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleXShare}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white text-ink/70 transition-all hover:border-black/40 hover:bg-black/5 sm:h-10 sm:w-10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
              aria-label="X પર શેર કરો"
              title="X પર શેર કરો"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => toggleSave(article)}
              title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
              className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border transition-all sm:h-10 sm:w-10 ${
                isBookmarked
                  ? "border-[#e48d0b]/40 bg-[#e48d0b]/10 text-[#e48d0b]"
                  : "border-black/10 bg-white text-ink/70 hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-dark/70"
              }`}
              aria-label="સેવ કરો"
            >
              <Bookmark size={17} className={isBookmarked ? "fill-current" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="mb-6 sm:mb-7">
        {tab === "ai" ? (
          <div className="rounded-2xl border border-[#e48d0b]/25 bg-[#e48d0b]/[0.06] p-3 sm:p-5 dark:bg-[#e6c27a]/[0.08]">
            <p className="mb-2 flex items-center gap-1.5 font-gu text-[12px] font-semibold text-[#e48d0b] sm:text-[13px] dark:text-[#e6c27a]">
              <Sparkles size={14} />
              AI સારાંશ
            </p>
            <p className="font-gu text-[18px] leading-relaxed text-ink sm:text-[20px] md:text-[24px] dark:text-ink-dark">
              {aiSummary}
            </p>
          </div>
        ) : (
          <ParagraphsWithAds
            paragraphs={
              paragraphs.length > 0 ? paragraphs : [stripHtmlTags(rawContent)]
            }
          />
        )}
      </div>

      {/* COMMENTS */}
      <div
        ref={commentsRef}
        className="mb-6 border-t border-black/8 pt-4 sm:mb-8 sm:pt-5 dark:border-white/10"
      >
        <div className="mb-4 sm:mb-5">
          <h3
            ref={feedbackRef}
            className="mb-1 font-gu text-[18px] font-medium text-ink sm:text-[20px] md:text-[22px] dark:text-ink-dark"
          >
            તમારો પ્રતિભાવ આપો
          </h3>
          <textarea
            ref={commentInputRef}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="તમારો પ્રતિભાવ લખો..."
            rows={1}
            className="w-full resize-none overflow-hidden rounded-xl border border-black/10 bg-transparent px-3 py-2.5 font-gu text-[16px] leading-6 text-ink transition-colors placeholder:text-ink/40 focus:border-[#e48d0b] focus:outline-none focus:ring-0 sm:px-4 sm:py-3 sm:text-[18px] dark:border-white/12 dark:text-ink-dark dark:placeholder:text-ink-dark/40"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={handlePostComment}
              disabled={!commentText.trim()}
              className="inline-flex cursor-pointer items-center rounded-xl bg-[#e48d0b] px-4 py-2 font-gu text-[15px] font-semibold text-white transition-all hover:bg-[#c98a2e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5 sm:text-[18px]"
            >
              પોસ્ટ કરો
            </button>
          </div>
        </div>

        <div className="border-t border-black/8 pt-3 sm:pt-4 dark:border-white/10">
          <button
            type="button"
            onClick={() => setIsCommentsListOpen(!isCommentsListOpen)}
            className="group flex w-full cursor-pointer items-center justify-between py-1 font-gu text-[17px] font-semibold text-ink sm:text-xl dark:text-ink-dark"
          >
            <div className="flex items-center gap-2">
              <MessageSquareText size={18} className="text-[#e48d0b] sm:h-5 sm:w-5" />
              <span>કોમેન્ટ્સ લિસ્ટ</span>
            </div>
            <ChevronDown
              size={18}
              className={`text-ink/60 transition-transform duration-300 group-hover:text-[#e48d0b] dark:text-ink-dark/60 ${
                isCommentsListOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${
              isCommentsListOpen
                ? "mt-3 grid-rows-[1fr] opacity-100 sm:mt-4"
                : "mt-0 grid-rows-[0fr] overflow-hidden opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="space-y-3 sm:space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-2.5 border-b border-black/10 pb-3 last:border-b-0 sm:gap-3 sm:pb-4 dark:border-white/10"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 font-gu text-[16px] font-semibold text-[#e48d0b] sm:h-11 sm:w-11 sm:text-[18px] dark:bg-white/10">
                      {comment.name?.charAt(0) || "?"}
                    </div>
                    <div className="min-w-0 flex-1 leading-[1.3]">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <span className="font-gu text-[15px] font-semibold text-ink sm:text-[18px] dark:text-ink-dark">
                          {comment.name}
                        </span>
                        <span className="font-gu text-[13px] text-ink/60 sm:text-[16px] dark:text-ink-dark/45">
                          {comment.time}
                        </span>
                      </div>
                      <p className="break-words font-gu text-[15px] leading-relaxed text-ink sm:text-[18px] dark:text-ink-dark/80">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="py-4 text-center font-gu text-sm text-ink/50 dark:text-ink-dark/50">
                    હજુ કોઈ કોમેન્ટ નથી. પહેલા લખો!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBlock />

      {/* Related */}
      {related.length > 0 && (
        <div className="mb-4 border-t border-black/8 pt-4 sm:mb-6 sm:pt-5 dark:border-white/10">
          <div className="flex flex-col gap-3 sm:gap-5">
            {related.map((item) => {
              const itemCleanText = stripHtmlTags(
                item.description || item.body || item.content || item.text || ""
              );
              const itemRating = item.rating || "4.2";
              const authorArticleCount = charchaPatroData.filter(
                (entry) =>
                  entry.author?.trim().toLowerCase() ===
                  item.author?.trim().toLowerCase()
              ).length;
              const authorProfileSource = charchaPatroData.find(
                (entry) =>
                  entry.author?.trim().toLowerCase() ===
                  item.author?.trim().toLowerCase()
              );
              const itemProfileImage =
                authorProfileSource?.profilePhoto ||
                authorProfileSource?.authorImage ||
                authorProfileSource?.profilePic ||
                authorProfileSource?.avatar ||
                item.profilePhoto ||
                item.authorImage ||
                item.profilePic ||
                item.avatar ||
                item.image;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    openDetail(item);
                    navigate(`/charcha-patra/${item.id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex cursor-pointer flex-col gap-3 rounded-2xl border border-gray-200/70 bg-white p-4 shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 sm:flex-row sm:gap-4 sm:rounded-3xl sm:p-5 md:p-7 dark:border-white/10 dark:bg-[#121212]"
                >
                  <div className="flex shrink-0 items-center gap-3 sm:w-[90px] sm:flex-col sm:items-center sm:gap-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (item.author) {
                          navigate(
                            `/charcha-patra/profile/${encodeURIComponent(item.author.trim())}`
                          );
                        }
                      }}
                      className="flex cursor-pointer flex-row items-center gap-2 border-0 bg-transparent p-0 transition-opacity hover:opacity-80 sm:flex-col sm:gap-0"
                      aria-label={`${item.author} નું પ્રોફાઇલ ખોલો`}
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-[#FAE589] sm:h-[72px] sm:w-[72px]">
                        {itemProfileImage ? (
                          <img
                            src={itemProfileImage}
                            alt={item.author}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-bold text-ink sm:text-xl">
                            {item.author?.charAt(0) || "?"}
                          </span>
                        )}
                      </div>
                      <div className="flex min-w-0 flex-col items-start sm:items-center">
                        <span className="font-gu text-[15px] font-medium leading-tight text-[#e48d0b] sm:mt-2 sm:text-center sm:text-[17px]">
                          {item.author}
                        </span>
                        <div className="mt-0.5 flex items-center gap-0.5 sm:mt-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={11}
                              className={`sm:h-3 sm:w-3 ${
                                i <= Math.round(parseFloat(itemRating))
                                  ? "text-[#e48d0b]"
                                  : "text-gray-300 dark:text-gray-600"
                              }`}
                              fill={
                                i <= Math.round(parseFloat(itemRating))
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="mt-0.5 font-gu text-[12px] leading-[1.25] text-ink/50 sm:mt-1 sm:text-center sm:text-[15px] dark:text-ink-dark/50">
                          વર્ષ ૨૦૨૦થી
                          <span className="hidden sm:inline">
                            <br />
                          </span>
                          <span className="sm:hidden"> · </span>
                          ચર્ચાપત્રો {toGujaratiDigits(authorArticleCount || 0)}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <h2 className="font-gu text-[17px] font-medium leading-snug text-ink sm:text-[19px] md:text-[20px] dark:text-ink-dark">
                      {item.title}
                    </h2>
                    <div className="mb-2 mt-1.5 flex flex-wrap items-center gap-2">
                      <span className="font-gu text-[13px] text-ink/60 sm:text-[15px] md:text-[17px] dark:text-ink-dark/60">
                        તારીખ :- {item.date}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          closeDetail("/charcha-patra/form");
                          navigate("/charcha-patra/form", {
                            state: {
                              relatedTitle: item.title || "",
                              authorName: item.author || "",
                            },
                          });
                        }}
                        className="relative z-10 flex shrink-0 cursor-pointer items-center gap-1 rounded-[6px] border border-[#e48d0b]/60 px-2 py-1 font-gu text-[11px] font-semibold text-[#e48d0b] transition-all hover:bg-[#e48d0b]/10 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[13px]"
                      >
                        <Edit3 size={13} className="sm:h-[15px] sm:w-[15px]" />
                        <span>સંબંધિત ચર્ચાપત્ર લખો</span>
                      </button>
                    </div>
                    <p className="line-clamp-2 font-gu text-[14px] leading-[1.6] text-ink/80 sm:text-[16px] md:text-[17px] dark:text-ink-dark/80">
                      {itemCleanText || "કોઈ વિગત ઉપલબ્ધ નથી."}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 font-gu text-[12px] text-ink/60 sm:mt-3 sm:gap-4 sm:text-[13px] dark:text-ink-dark/60">
                      <span className="font-semibold">
                        રેટીંગ :-{" "}
                        <span className="text-[#e48d0b]">
                          {toGujaratiDigits(itemRating)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Share popup */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title={article.title}
        text={article.title}
        url={typeof window !== "undefined" ? window.location.href : ""}
        image={article.image || article.img}
      />
    </div>
  );
}