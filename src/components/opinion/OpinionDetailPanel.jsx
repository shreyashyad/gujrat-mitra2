import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Bookmark,
  Upload,
  Volume2,
  VolumeOff,
  Star,
  MessageSquareText,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allContent } from "../../data/opinion.js";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";
import ShareModal from "../common/ShareModal.jsx";

const editorial = allContent.editorial || [];
const commentsAndColumns = allContent.commentAndColumns || [];

function parseBodyParagraphs(body) {
  if (!body) return [];
  const pMatches = body.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
  if (pMatches && pMatches.length > 0) {
    return pMatches
      .map((m) => m.replace(/<\/?p[^>]*>/gi, "").trim())
      .filter(Boolean);
  }
  return body
    .split(/\n+| \| /)
    .map((p) => p.replace(/<\/?[^>]+(>|$)/g, "").trim())
    .filter(Boolean);
}

function parseKeypoints(keypoints) {
  if (!Array.isArray(keypoints) || keypoints.length === 0) return [];
  return keypoints
    .map((k) =>
      typeof k === "string" ? k.replace(/<\/?p[^>]*>/gi, "").trim() : ""
    )
    .filter(Boolean);
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
        લેખની વિગતો ઉપલબ્ધ નથી.
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

function getOpinionList() {
  return [...commentsAndColumns, ...editorial];
}

function normalizeId(id) {
  if (id == null || id === "") return null;
  const s = String(id);
  if (s.startsWith("opinion-")) return s.slice("opinion-".length);
  return s;
}

function getAuthorProfilePath(authorName) {
  if (!authorName) return "/opinion";
  const unique = Array.from(
    new Map(
      [...commentsAndColumns, ...editorial].map((item) => [item.author, item])
    ).values()
  );
  const match = unique.find(
    (a) => a.author?.trim().toLowerCase() === authorName.trim().toLowerCase()
  );
  if (match?.id != null) return `/opinion/author/${match.id}`;
  return `/opinion/author/${encodeURIComponent(authorName.trim())}`;
}

function getRelatedOpinions(current) {
  if (!current) return [];
  const currentId = normalizeId(current.id) || normalizeId(current.opinionId);
  const currentTitle = (current.headline || current.title || "")
    .trim()
    .toLowerCase();

  const list = getOpinionList().filter((item) => {
    if (!item || item.isFiller) return false;
    const itemId = normalizeId(item.id);
    const itemTitle = (item.headline || item.title || "")
      .trim()
      .toLowerCase();
    if (currentId && itemId && currentId === itemId) return false;
    if (currentTitle && itemTitle && currentTitle === itemTitle) return false;
    return true;
  });

  const authorName = (current.author || "").trim().toLowerCase();
  const sameAuthor = [];
  const others = [];

  list.forEach((item) => {
    const itemAuthor = (item.author || "").trim().toLowerCase();
    if (authorName && itemAuthor === authorName) sameAuthor.push(item);
    else others.push(item);
  });

  const toTime = (item) => {
    if (item.timestamp) return Number(item.timestamp) || 0;
    if (item.date) return new Date(item.date).getTime() || 0;
    return 0;
  };

  sameAuthor.sort((a, b) => toTime(b) - toTime(a));
  others.sort((a, b) => toTime(b) - toTime(a));
  return [...sameAuthor, ...others];
}

function StarRating({ rating = 0, size = 18 }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f-${i}`} size={size} className="fill-[#e48d0b] text-[#e48d0b]" />
      ))}
      {hasHalf && (
        <div className="relative">
          <Star size={size} className="text-black/20 dark:text-white/20" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: "50%" }}>
            <Star size={size} className="fill-[#e48d0b] text-[#e48d0b]" />
          </div>
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} size={size} className="text-black/20 dark:text-white/20" />
      ))}
      <span className="ml-1.5 font-gu text-[13px] font-semibold text-ink/70 sm:text-[15px] dark:text-ink-dark/70">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function getMockComments(articleId) {
  const baseComments = [
    {
      id: "mock-1",
      name: "રાજેશ પટેલ",
      time: "૨ કલાક પહેલા",
      text: "ખૂબ જ મહત્વની માહિતી. આવા સમાચાર વધુ આવવા જોઈએ.",
    },
    {
      id: "mock-2",
      name: "પ્રિયા શાહ",
      time: "૫ કલાક પહેલા",
      text: "સરકારે આ મુદ્દે તાત્કાલિક પગલાં લેવા જોઈએ. સારો રિપોર્ટ.",
    },
    {
      id: "mock-3",
      name: "અમિત દેસાઈ",
      time: "૧ દિવસ પહેલા",
      text: "વિગતવાર આપ્યું છે. આભાર ગુજરાત મિત્ર!",
    },
  ];
  const charCode =
    articleId && articleId.length > 1 ? articleId.charCodeAt(1) : 0;
  const count = isNaN(charCode) ? 0 : charCode % 3;
  return baseComments.slice(0, 2 + count);
}

function truncateWords(text, max = 3) {
  if (!text) return "";
  const words = String(text).trim().split(/\s+/);
  if (words.length <= max) return text;
  return `${words.slice(0, max).join(" ")}…`;
}

function buildRelatedChunks(items) {
  const chunks = [];
  let i = 0;
  let mode = "grid";
  while (i < items.length) {
    const size = mode === "grid" ? 4 : 6;
    chunks.push({ type: mode, items: items.slice(i, i + size) });
    i += size;
    mode = mode === "grid" ? "list" : "grid";
  }
  return chunks;
}

export function OpinionDetailPanel({ article, onClose, onOpenOpinion }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave } = useSavedNews();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [isCommentsListOpen, setIsCommentsListOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const commentsRef = useRef(null);
  const feedbackRef = useRef(null);
  const commentInputRef = useRef(null);

  const isEditorial = useMemo(() => {
    if (!article) return false;
    const id = normalizeId(article.opinionId || article.id);
    return editorial.some((item) => String(item.id) === String(id));
  }, [article]);

  const profilePic = article?.authorProfilePic || article?.profilepic || null;
  const title = article?.headline || article?.title || "";
  const imageSrc = article?.img || article?.image || null;
  const keypoints = parseKeypoints(article?.keypoints);
  const paragraphs = parseBodyParagraphs(article?.body);
  const rating = article?.rating || null;

  const related = useMemo(
    () => (article ? getRelatedOpinions(article) : []),
    [article?.id, article?.author, article?.opinionId]
  );

  const relatedChunks = useMemo(
    () => buildRelatedChunks(related),
    [related]
  );

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
      let parent = el.parentElement;
      while (parent) {
        const style = window.getComputedStyle(parent);
        if (
          (style.overflowY === "auto" || style.overflowY === "scroll") &&
          parent.scrollHeight > parent.clientHeight
        ) {
          const parentRect = parent.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          const top = elRect.top - parentRect.top + parent.scrollTop - 150;
          parent.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
          break;
        }
        parent = parent.parentElement;
      }
    }, 50);
    setTimeout(() => {
      commentInputRef.current?.focus({ preventScroll: true });
    }, 350);
  }, []);

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

  const currentItemId = article
    ? String(article.opinionId || article.id || "")
    : "";
  const isBookmarked = currentItemId ? isSaved(currentItemId) : false;

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setUserRating(0);
    setHoverRating(0);
    setRatingSubmitted(false);
    setShareOpen(false);
    if (article) {
      const id = String(article.opinionId || article.id || "");
      setCommentText("");
      setComments(getMockComments(id));
      setIsCommentsListOpen(false);
    }
  }, [article?.id, article?.opinionId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [onClose]);

  const handleBookmark = useCallback(() => {
    if (!article) return;
    toggleSave({
      id: article.opinionId || article.id,
      headline: title,
      title,
      img: imageSrc,
      cat: article.cat || "ઓપીનિયન",
      author: article.author,
      source: article.source,
      time: article.time || article.date,
      body: article.body,
      type: "opinion",
      ...article,
    });
  }, [article, imageSrc, title, toggleSave]);

  const goToAuthorProfile = useCallback(
    (authorName) => {
      if (!authorName) return;
      navigate(getAuthorProfilePath(authorName));
    },
    [navigate]
  );

  const openRelated = useCallback(
    (item) => {
      const rawId = normalizeId(item?.id) || normalizeId(item?.opinionId);
      if (!rawId) return;
      if (typeof onOpenOpinion === "function") {
        onOpenOpinion(item);
      } else {
        navigate(`/opinion/${rawId}`);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [onOpenOpinion, navigate]
  );

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
      if (name.includes("hindi") || name.includes("हिन्दी")) s += 25;
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
    const textToSpeak = [title, ...paragraphs].filter(Boolean).join(". ");
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
  }, [article, isSpeaking, pickVoice, title, paragraphs]);

  if (!article) return null;

  const shareUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <div
      className="
        w-full min-w-0
        rounded-none border-0 bg-transparent p-0 shadow-none
        sm:rounded-3xl sm:border sm:border-gray-200/70 sm:bg-white sm:p-5
        sm:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
        md:p-7
        dark:sm:border-white/10 dark:sm:bg-[#121212]
      "
      role="article"
      aria-label={title}
    >
      {/* Breadcrumb */}
      <div className="mb-3 flex min-w-0 items-center gap-1.5 border-b border-black/8 pb-3 sm:mb-4 sm:gap-2 dark:border-white/10">
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/5 text-ink transition-colors hover:bg-[#e48d0b]/15 hover:text-[#e48d0b] sm:h-9 sm:w-9 dark:bg-white/10 dark:text-ink-dark"
          aria-label="પાછા"
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
              navigate("/", { replace: true });
            }}
            className="shrink-0 cursor-pointer font-medium transition-colors hover:text-[#e48d0b]"
          >
            હોમ
          </button>
          <ChevronRight size={14} className="shrink-0 opacity-50" />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 cursor-pointer font-medium text-ink/80 transition-colors hover:text-[#e48d0b] dark:text-ink-dark/80"
          >
            ઓપીનિયન
          </button>
          <ChevronRight size={14} className="shrink-0 opacity-50" />
          <span
            className="min-w-0 truncate font-semibold text-[#e48d0b]"
            title={title}
            aria-current="page"
          >
            {truncateWords(title || "લેખ", 3)}
          </span>
        </nav>

        <button
          type="button"
          onClick={handleListen}
          className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1.5 font-gu text-[12px] font-semibold transition-all sm:gap-1.5 sm:px-3 sm:text-[14px] md:text-[15px] ${isSpeaking
              ? "border-[#e48d0b] bg-[#e48d0b]/15 text-[#e48d0b]"
              : "border-black/10 bg-white text-ink/70 hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-dark/70"
            }`}
          aria-label={isSpeaking ? "બંધ કરો" : "સાંભળો"}
        >
          {isSpeaking ? <VolumeOff size={15} /> : <Volume2 size={15} />}
          <span className="hidden sm:inline">
            {isSpeaking ? "બંધ કરો" : "સાંભળો"}
          </span>
        </button>
      </div>

      {/* Headline */}
      <h1 className="mb-2 font-gu text-[24px] font-bold leading-snug text-ink sm:text-[32px] md:text-[40px] lg:text-[48px] dark:text-ink-dark">
        {title}
      </h1>

      {/* Author row */}
      <div className="mb-4 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-gu text-[13px] text-ink/55 sm:mb-5 sm:text-[16px] md:text-[18px] dark:text-ink-dark/55">
        {article.author && (
          <button
            type="button"
            onClick={() => goToAuthorProfile(article.author)}
            className="flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 transition-opacity hover:opacity-80"
            aria-label={`${article.author} નું પ્રોફાઇલ ખોલો`}
          >
            {profilePic && (
              <img
                src={profilePic}
                alt=""
                className="h-5 w-5 shrink-0 rounded-full border border-black/10 object-cover sm:h-[22px] sm:w-[22px] dark:border-white/10"
              />
            )}
            <span className="font-semibold text-[#e48d0b]">{article.author}</span>
          </button>
        )}
        <span className="opacity-50">•</span>
        <span>{article.time || article.date}</span>
        {!isEditorial && rating != null && (
          <>
            <span className="opacity-50">•</span>
            <StarRating rating={Number(rating)} size={14} />
          </>
        )}
      </div>

      {/* Image + Keypoints */}
      <div className="mb-4 grid grid-cols-1 items-center gap-3 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] md:gap-4">
        <div className="relative overflow-hidden rounded-[7px] bg-black/5 dark:bg-white/5">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title || "ઓપીનિયન ઈમેજ"}
              className="aspect-[16/10] h-auto w-full object-cover md:aspect-auto md:h-full lg:min-h-[280px] lg:min-h-[360px]"
            />
          ) : (
            <div className="flex aspect-[16/10] items-center justify-center font-gu text-sm text-ink/40 lg:min-h-[280px] dark:text-ink-dark/40">
              છબી ઉપલબ્ધ નથી
            </div>
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          {keypoints.length > 0 ? (
            <ul className="flex flex-1 flex-col gap-3 px-1 sm:gap-4 sm:px-3 md:px-4">
              {keypoints.map((kp, i) => {
                const words = (kp || "").trim().split(/\s+/);
                const firstTwo = words.slice(0, 2).join(" ");
                const rest = words.slice(2).join(" ");
                const isLast = i === keypoints.length - 1;
                return (
                  <li
                    key={i}
                    className={`flex items-start gap-2 pb-2 font-gu text-[17px] font-medium leading-[1.4] text-ink sm:pb-3 sm:text-[18px] md:text-[21px] dark:text-ink-dark ${isLast ? "" : "border-b-2 border-black/15 dark:border-white/15"
                      }`}
                  >
                    <span>
                      {firstTwo && <strong className="font-medium">{firstTwo}</strong>}
                      {rest ? ` ${rest}` : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="font-gu text-sm text-ink/50 dark:text-ink-dark/50">
              મુખ્ય મુદ્દા ઉપલબ્ધ નથી.
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-6 md:justify-end">
        {/* Left (mobile) / First on right (desktop) — comments */}
        <button
          type="button"
          onClick={scrollToComments}
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-ink/70 transition-all hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] sm:h-10 sm:px-3 dark:border-white/10 dark:bg-white/[0.04]"
          aria-label="કમેન્ટ્સ"
        >
          <MessageSquareText size={17} />
          <span className="font-gu text-xs">{comments.length}</span>
        </button>

        {/* Right — Share · WhatsApp · X · Bookmark */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Share → popup (all options) */}
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white text-ink/70 transition-all hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] sm:h-10 sm:w-10 dark:border-white/10 dark:bg-white/[0.04] dark:text-ink-dark/70"
            aria-label="શેર કરો"
            title="શેર કરો"
          >
            <Upload size={17} />
          </button>

          {/* WhatsApp — always visible */}
          <button
            type="button"
            onClick={() => {
              const text = `${title || "ઓપીનિયન"}\n${typeof window !== "undefined" ? window.location.href : ""}`;
              window.open(
                `https://wa.me/?text=${encodeURIComponent(text)}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white text-ink/70 transition-all hover:border-[#25D366]/50 hover:bg-[#25D366]/10 sm:h-10 sm:w-10 dark:border-white/10 dark:bg-white/[0.04]"
            aria-label="WhatsApp"
            title="WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.02.24-3.4-.71-2.87-1.15-4.71-4.06-4.85-4.25-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09.99-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.61-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.35z" />
            </svg>
          </button>

          {/* X — always visible */}
          <button
            type="button"
            onClick={() => {
              const u = typeof window !== "undefined" ? window.location.href : "";
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(title || "ઓપીનિયન")}&url=${encodeURIComponent(u)}`,
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-black/10 bg-white text-ink/70 shadow-sm transition-all hover:border-black/40 hover:bg-black/5 sm:h-10 sm:w-10 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
            aria-label="X પર શેર કરો"
            title="X પર શેર કરો"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>

          {/* Bookmark */}
          <button
            type="button"
            onClick={handleBookmark}
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

      {/* Body */}
      <div className="mb-6 sm:mb-7">
        <ParagraphsWithAds paragraphs={paragraphs} />
      </div>

      {!isEditorial && rating != null && (
        <div className="mb-5 flex items-center gap-2 sm:mb-6 sm:gap-3">
          <span className="font-gu text-[15px] font-semibold text-ink sm:text-[18px] dark:text-ink-dark">
            રેટિંગ:
          </span>
          <StarRating rating={Number(rating)} size={18} />
        </div>
      )}

      {/* Comments */}
      <div
        ref={commentsRef}
        className="mb-6 border-t border-black/8 pt-4 sm:mb-8 sm:pt-5 dark:border-white/10"
      >
        {!isEditorial && (
          <div className="mb-3 flex items-center justify-end gap-3 pb-3">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || userRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      if (!ratingSubmitted) setUserRating(star);
                    }}
                    onMouseEnter={() => !ratingSubmitted && setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    disabled={ratingSubmitted}
                    className={`transition-transform ${ratingSubmitted ? "cursor-default" : "cursor-pointer hover:scale-110"
                      }`}
                    aria-label={`${star} સ્ટાર`}
                  >
                    <Star
                      size={18}
                      className={
                        active
                          ? "fill-[#e48d0b] text-[#e48d0b]"
                          : "text-black/25 dark:text-white/25"
                      }
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-4 border-t border-black/8 pt-3 sm:mb-5 sm:pt-3 dark:border-white/10">
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
              className={`text-ink/60 transition-transform duration-300 group-hover:text-[#e48d0b] dark:text-ink-dark/60 ${isCommentsListOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out ${isCommentsListOpen
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

      {/* Related — same as before */}
      {related.length > 0 && (
        <div className="mb-4 border-t border-black/8 pt-4 sm:mb-6 sm:pt-5 dark:border-white/10">
          <div className="flex flex-col gap-3 sm:hidden">
            {relatedChunks.map((chunk, ci) =>
              chunk.type === "grid" ? (
                <div key={`chunk-${ci}`} className="grid grid-cols-2 gap-3">
                  {chunk.items.map((item) => {
                    const itemTitle = item.headline || item.title || "";
                    const itemImg = item.img || item.image || null;
                    const itemAuthor = item.author || "";
                    const itemPic =
                      item.authorProfilePic || item.profilepic || null;
                    return (
                      <div
                        key={item.id}
                        className="group flex flex-col gap-1.5 rounded-xl text-left"
                      >
                        <button
                          type="button"
                          onClick={() => openRelated(item)}
                          className="flex w-full cursor-pointer flex-col gap-1.5 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                        >
                          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[7px]">
                            {itemImg ? (
                              <img
                                src={itemImg}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                            )}
                          </div>
                          <p className="article-headline line-clamp-3 !h-auto !min-h-0 text-[14px] leading-snug">
                            {itemTitle}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToAuthorProfile(itemAuthor);
                          }}
                          className="flex w-fit cursor-pointer items-center gap-x-1 border-0 bg-transparent p-0 transition-opacity hover:opacity-80"
                        >
                          {itemPic && (
                            <img
                              src={itemPic}
                              alt=""
                              className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 object-cover dark:border-white/10"
                            />
                          )}
                          <span className="truncate font-gu text-[12px] font-semibold text-[#e48d0b]">
                            {itemAuthor}
                          </span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div key={`chunk-${ci}`} className="flex flex-col gap-3">
                  {chunk.items.map((item) => {
                    const itemTitle = item.headline || item.title || "";
                    const itemImg = item.img || item.image || null;
                    const itemAuthor = item.author || "";
                    const itemPic =
                      item.authorProfilePic || item.profilepic || null;
                    return (
                      <div
                        key={item.id}
                        className="group flex items-start gap-3 rounded-xl text-left"
                      >
                        <button
                          type="button"
                          onClick={() => openRelated(item)}
                          className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                        >
                          <div className="relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-lg">
                            {itemImg ? (
                              <img
                                src={itemImg}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 py-0.5">
                            <p className="article-headline line-clamp-2 !h-auto !min-h-0 text-[15px] leading-snug">
                              {itemTitle}
                            </p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                goToAuthorProfile(itemAuthor);
                              }}
                              className="mt-1 flex w-fit cursor-pointer items-center gap-x-1 border-0 bg-transparent p-0 transition-opacity hover:opacity-80"
                            >
                              {itemPic && (
                                <img
                                  src={itemPic}
                                  alt=""
                                  className="h-3.5 w-3.5 shrink-0 rounded-full border border-black/10 object-cover dark:border-white/10"
                                />
                              )}
                              <span className="truncate font-gu text-[12px] font-semibold text-[#e48d0b]">
                                {itemAuthor}
                              </span>
                            </button>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>

          <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {related.map((item) => {
              const itemTitle = item.headline || item.title || "";
              const itemImg = item.img || item.image || null;
              const itemAuthor = item.author || "";
              const itemPic = item.authorProfilePic || item.profilepic || null;
              return (
                <div
                  key={item.id}
                  className="group flex min-h-0 flex-col gap-2 rounded-xl text-left lg:min-h-[240px]"
                >
                  <button
                    type="button"
                    onClick={() => openRelated(item)}
                    className="flex w-full cursor-pointer flex-col gap-2 text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                  >
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl">
                      {itemImg ? (
                        <img
                          src={itemImg}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                      )}
                    </div>
                    <p className="article-headline line-clamp-3 !h-auto !min-h-0">
                      {itemTitle}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToAuthorProfile(itemAuthor);
                    }}
                    className="mt-[-4px] flex w-fit cursor-pointer items-center gap-x-1.5 border-0 bg-transparent p-0 transition-opacity hover:opacity-80"
                  >
                    {itemPic && (
                      <img
                        src={itemPic}
                        alt=""
                        className="h-4 w-4 shrink-0 rounded-full border border-black/10 object-cover sm:h-[18px] sm:w-[18px] dark:border-white/10"
                      />
                    )}
                    <span className="truncate font-gu text-[13px] font-semibold text-[#e48d0b] sm:text-[15px]">
                      {itemAuthor}
                    </span>
                  </button>
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
        title={title}
        text={title}
        url={shareUrl}
        image={imageSrc}
      />
    </div>
  );
}