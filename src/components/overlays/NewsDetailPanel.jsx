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
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNewsDetail } from "../../context/NewsDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";
import { getReadTime } from "../../utils/articleMeta.js";
import { articles } from "../../data/articles.js";
import { sidebarCategories } from "../../data/sidebarCategories.js";
import ShareModal from "../common/ShareModal.jsx";

function resolveCategorySlug(categoryName) {
    if (!categoryName || !Array.isArray(sidebarCategories)) return null;
    const match = sidebarCategories.find((c) => {
        const candidates = [c.name, c.label, c.title, c.nameGu, c.gu, c.text];
        return candidates.some(
            (val) => typeof val === "string" && val.trim() === categoryName.trim()
        );
    });
    return match?.slug || null;
}

function parseBodyParagraphs(body) {
    if (!body) return [];
    const pMatches = body.match(/<p[^>]*>([\s\S]*?)<\/p>/gi);
    if (pMatches?.length) {
        return pMatches
            .map((m) => m.replace(/<\/?p[^>]*>/gi, "").trim())
            .filter(Boolean);
    }
    return body
        .split("|")
        .map((p) => p.trim())
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

function generateAISummary(article) {
    if (!article) return "આ સમાચારનું AI સારાંશ ઉપલબ્ધ નથી.";
    const paragraphs = parseBodyParagraphs(article.body);
    const first = paragraphs[0] || "";
    if (first.length > 160) return `${first.slice(0, 160).trim()}...`;
    return (
        first ||
        "આ સમાચારના મુખ્ય મુદ્દાઓ આપમેળે જનરેટ થયા છે. વધુ વિગતો માટે સંપૂર્ણ સમાચાર વાંચો."
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
        if (!paragraphs?.length) return [];
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

    if (!paragraphs?.length) {
        return (
            <p className="font-gu text-[15px] text-ink/60 dark:text-ink-dark/60">
                સમાચારની વિગતો ઉપલબ્ધ નથી.
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

function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getArticleList() {
    return Array.isArray(articles)
        ? articles
        : Object.values(articles || {}).flatMap((list) =>
            Array.isArray(list) ? list : [list]
        );
}

function getRelatedByCategory(article) {
    if (!article?.cat) return [];
    const seen = new Set([article.id]);
    const all = [];
    getArticleList().forEach((item) => {
        if (
            item?.id &&
            !seen.has(item.id) &&
            item.cat === article.cat &&
            !item.isFiller
        ) {
            seen.add(item.id);
            all.push(item);
        }
    });
    return shuffleArray(all);
}

function getAllOtherArticles(article) {
    if (!article) return [];
    const seen = new Set([article.id]);
    const all = [];
    getArticleList().forEach((item) => {
        if (item?.id && !seen.has(item.id) && !item.isFiller) {
            seen.add(item.id);
            all.push(item);
        }
    });
    return shuffleArray(all);
}

export default function NewsDetailPanel() {
    const { article, closeNews, openNews } = useNewsDetail();
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

    // ✅ Scroll to "તમારો પ્રતિભાવ આપો" + focus input (all devices)
    const scrollToComments = useCallback(() => {
        setIsCommentsListOpen(true);

        const el = feedbackRef.current || commentsRef.current;
        if (!el) return;

        el.style.scrollMarginTop = "80px";

        // 1) Primary
        el.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
        });

        // 2) Window fallback (mobile Safari etc.)
        requestAnimationFrame(() => {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
            window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        });

        // 3) Nested scroll parent fallback (modal / overflow container)
        setTimeout(() => {
            let parent = el.parentElement;
            while (parent) {
                const style = window.getComputedStyle(parent);
                const overflowY = style.overflowY;
                if (
                    (overflowY === "auto" || overflowY === "scroll") &&
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

        // ✅ Focus textarea after scroll
        setTimeout(() => {
            const input = commentInputRef.current;
            if (input) {
                input.focus({ preventScroll: true });
            }
        }, 350);
    }, []);

    const isBookmarked = article ? isSaved(article.id) : false;

    const related = useMemo(() => {
        if (!article) return [];
        const sameCat = getRelatedByCategory(article);
        const others = getAllOtherArticles(article).filter(
            (item) => item.cat !== article.cat
        );
        return [...sameCat, ...others];
    }, [article?.id]);

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
            if (e.key === "Escape") closeNews();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [closeNews]);

    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const handleWhatsAppShare = useCallback(() => {
        if (!article) return;
        const text = `${article.headline || "સમાચાર"}\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }, [article]);

    const handleXShare = useCallback(() => {
        if (!article) return;
        const text = `${article.headline || "સમાચાર"}\n${window.location.href}`;
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

    const handleCategoryNavigate = useCallback(() => {
        if (!article) return;
        const slug = resolveCategorySlug(article.cat);
        closeNews({ resetScroll: true });
        navigate(slug ? `/category/${slug}` : "/", { replace: true });
    }, [article, closeNews, navigate]);

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
        const paragraphs = parseBodyParagraphs(article.body);
        const textToSpeak = [article.headline || "", ...paragraphs]
            .filter(Boolean)
            .join(". ");
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
        if (!voices?.length) {
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

    const paragraphs = parseBodyParagraphs(article.body);
    const keypoints = parseKeypoints(article.keypoints);
    const aiSummary = generateAISummary(article);
    const readTime = getReadTime(article);
    const author = article.author || article.source || "મીતા શાહ";
    const designation = article.designation || "સ્ટાફ રિપોર્ટર";

    function buildRelatedChunks(items) {
        const chunks = [];
        let i = 0;
        let mode = "grid";
        while (i < items.length) {
            const size = mode === "grid" ? 4 : 6;
            chunks.push({
                type: mode,
                items: items.slice(i, i + size),
            });
            i += size;
            mode = mode === "grid" ? "list" : "grid";
        }
        return chunks;
    }

    const relatedChunks = buildRelatedChunks(related);

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
            aria-label={article.headline}
        >
            {/* Breadcrumb */}
            <div className="mb-3 flex min-w-0 items-center gap-1.5 border-b border-black/8 pb-3 sm:mb-4 sm:gap-2 dark:border-white/10">
                <button
                    type="button"
                    onClick={closeNews}
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
                            closeNews({ resetScroll: true });
                            navigate("/", { replace: true });
                        }}
                        className="shrink-0 cursor-pointer font-medium transition-colors hover:text-[#e48d0b]"
                    >
                        હોમ
                    </button>
                    <ChevronRight size={14} className="shrink-0 opacity-50" />
                    <button
                        type="button"
                        onClick={handleCategoryNavigate}
                        className="max-w-[80px] truncate cursor-pointer font-medium text-ink/80 transition-colors hover:text-[#e48d0b] sm:max-w-none dark:text-ink-dark/80"
                    >
                        {article.cat || "સમાચાર"}
                    </button>
                    <ChevronRight size={14} className="shrink-0 opacity-50" />
                    <span
                        className="min-w-0 truncate font-semibold text-[#e48d0b]"
                        aria-current="page"
                        title={article.headline || "લેખ"}
                    >
                        {truncateWords(article.headline || "લેખ", 3)}
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
                    <span className="hidden xs:inline sm:inline">
                        {isSpeaking ? "બંધ કરો" : "સાંભળો"}
                    </span>
                </button>
            </div>

            {/* Heading */}
            <h1 className="mb-2 font-gu text-[24px] font-bold leading-snug text-ink sm:text-[32px] md:text-[40px] lg:text-[48px] dark:text-ink-dark">
                {article.headline}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-gu text-[13px] text-ink/55 sm:mb-5 sm:text-[16px] md:text-[18px] dark:text-ink-dark/55">
                <span>લેખક: {author}</span>
                <span className="opacity-50">•</span>
                <span>{designation}</span>
                <span className="opacity-50">•</span>
                <span>{article.cat || "સમાચાર"}</span>
                <span className="opacity-50">•</span>
                <span>{article.time || "હમણાં"}</span>
                <span className="opacity-50">•</span>
                <span>{readTime}</span>
            </div>

            {/* Image + Keypoints */}
            <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] md:gap-4 items-center">
                <div className="relative overflow-hidden rounded-[7px] bg-black/5 dark:bg-white/5">
                    {article.img ? (
                        <img
                            src={article.img}
                            alt={article.headline || "સમાચાર ઈમેજ"}
                            className="h-auto w-full object-cover aspect-[16/10] md:aspect-auto md:h-full lg:min-h-[280px] lg:min-h-[360px]"
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
                                            {firstTwo && (
                                                <strong className="font-medium">{firstTwo}</strong>
                                            )}
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

            {/* Tabs + Actions */}
            <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="flex w-full gap-1 rounded-3xl bg-black/[0.04] p-1 sm:max-w-md lg:max-w-[340px] dark:bg-white/[0.06]">
                    <button
                        type="button"
                        onClick={() => setTab("full")}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-3xl px-2 py-2 font-gu text-[13px] font-semibold transition-all duration-200 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-[15px] ${tab === "full"
                            ? "bg-[#e48d0b] text-white shadow-sm"
                            : "text-ink/70 hover:bg-black/[0.04] dark:text-ink-dark/70 dark:hover:bg-white/[0.05]"
                            }`}
                    >
                        <FileText size={15} strokeWidth={2} />
                        <span>સંપૂર્ણ સમાચાર</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab("ai")}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-3xl px-2 py-2 font-gu text-[13px] font-semibold transition-all duration-200 sm:gap-2 sm:px-3 sm:py-2.5 sm:text-[15px] ${tab === "ai"
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
                            title="WhatsApp"
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
                            className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border transition-all sm:h-10 sm:w-10 ${isBookmarked
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

            {/* Content */}
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
                    <ParagraphsWithAds paragraphs={paragraphs} />
                )}
            </div>

            {/* Comments */}
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

            {/* Related */}
            {related.length > 0 && (
                <div className="mb-4 border-t border-black/8 pt-4 sm:mb-6 sm:pt-5 dark:border-white/10">
                    <div className="flex flex-col gap-3 sm:hidden">
                        {relatedChunks.map((chunk, ci) =>
                            chunk.type === "grid" ? (
                                <div key={`chunk-${ci}`} className="grid grid-cols-2 gap-3">
                                    {chunk.items.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                openNews(item);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="group flex cursor-pointer flex-col gap-1.5 rounded-xl text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                                        >
                                            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[7px]">
                                                {item.img ? (
                                                    <img
                                                        src={item.img}
                                                        alt=""
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                                                )}
                                            </div>
                                            <p className="article-headline line-clamp-3 !min-h-0 !h-auto text-[14px] leading-snug">
                                                {item.headline}
                                            </p>
                                            <div className="article-metaRow">
                                                <div className="flex flex-nowrap items-center gap-x-1 overflow-hidden text-ellipsis whitespace-nowrap text-[11px]">
                                                    {item.cat && (
                                                        <>
                                                            <span className="shrink-0 font-semibold text-[#e48d0b]">
                                                                {item.cat}
                                                            </span>
                                                            <span className="shrink-0 opacity-50">•</span>
                                                        </>
                                                    )}
                                                    <span className="shrink-0">{item.time}</span>
                                                    <span className="shrink-0 opacity-50">•</span>
                                                    <span className="truncate">{getReadTime(item)}</span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div key={`chunk-${ci}`} className="flex flex-col gap-3">
                                    {chunk.items.map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => {
                                                openNews(item);
                                                window.scrollTo({ top: 0, behavior: "smooth" });
                                            }}
                                            className="group flex cursor-pointer items-start gap-3 rounded-xl text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99]"
                                        >
                                            <div className="relative h-[72px] w-[96px] shrink-0 overflow-hidden rounded-lg">
                                                {item.img ? (
                                                    <img
                                                        src={item.img}
                                                        alt=""
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1 py-0.5">
                                                <p className="article-headline line-clamp-2 !min-h-0 !h-auto text-[15px] leading-snug">
                                                    {item.headline}
                                                </p>
                                                <div className="article-metaRow mt-1">
                                                    <div className="flex flex-nowrap items-center gap-x-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12px]">
                                                        {item.cat && (
                                                            <>
                                                                <span className="shrink-0 font-semibold text-[#e48d0b]">
                                                                    {item.cat}
                                                                </span>
                                                                <span className="shrink-0 opacity-50">•</span>
                                                            </>
                                                        )}
                                                        <span className="shrink-0">{item.time}</span>
                                                        <span className="shrink-0 opacity-50">•</span>
                                                        <span className="truncate">{getReadTime(item)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )
                        )}
                    </div>

                    <div className="hidden gap-5 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
                        {related.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => {
                                    openNews(item);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="group flex min-h-0 cursor-pointer flex-col gap-2 rounded-xl text-left transition-transform hover:-translate-y-0.5 active:scale-[0.99] lg:min-h-[240px]"
                            >
                                <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl">
                                    {item.img ? (
                                        <img
                                            src={item.img}
                                            alt=""
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-black/5 dark:bg-white/5" />
                                    )}
                                </div>
                                <div className="flex min-w-0 flex-col gap-1 py-0.5">
                                    <p className="article-headline line-clamp-3 !min-h-0 !h-auto">
                                        {item.headline}
                                    </p>
                                    <div className="article-metaRow">
                                        <div className="mt-0.5 flex flex-nowrap items-center gap-x-1 overflow-hidden text-ellipsis whitespace-nowrap">
                                            {item.cat && (
                                                <>
                                                    <span className="shrink-0 font-semibold text-[#e48d0b]">
                                                        {item.cat}
                                                    </span>
                                                    <span className="shrink-0 opacity-50">•</span>
                                                </>
                                            )}
                                            <span className="shrink-0">{item.time}</span>
                                            <span className="shrink-0 opacity-50">•</span>
                                            <span className="truncate">{getReadTime(item)}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Share popup */}
            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                title={article.headline}
                text={article.headline}
                url={typeof window !== "undefined" ? window.location.href : ""}
                image={article.img}
            />
        </div>
    );
}