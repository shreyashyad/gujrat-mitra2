import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
    ChevronRight,
    Bookmark,
    Upload,
    AlertTriangle,
    Play,
    Pause,
    ArrowLeft,
    ThumbsUp,
    ThumbsDown,
    MessageSquareText,
    ChevronDown,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Settings,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVideoDetail } from "../../context/VideoDetailContext.jsx";
import { useSavedNews } from "../../context/SavedNewsContext.jsx";
import { videos } from "../../data/videos.js";
import ShareModal from "../common/ShareModal.jsx";

function getYouTubeEmbedUrl(url) {
    if (!url) return null;
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([\w-]{11})/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&rel=0` : null;
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
        .split("|")
        .map((p) => p.trim())
        .filter(Boolean);
}

function AdBlock() {
    return (
        <div className="my-4 flex justify-center" aria-hidden="true">
            <div
                className="flex items-center justify-center bg-gray-100 dark:bg-white/5 border border-dashed border-gray-300 dark:border-white/10 rounded-lg text-xs text-gray-400"
                style={{ width: "234px", height: "60px" }}
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
                વિડિઓની વિગતો ઉપલબ્ધ નથી.
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {blocks.map((block, bi) => {
                if (block.type === "ad") {
                    return <AdBlock key={`ad-${bi}`} />;
                }
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

function getMockComments(videoId) {
    const baseComments = [
        {
            id: "mock-1",
            name: "રાજેશ પટેલ",
            time: "૨ કલાક પહેલા",
            text: "ખૂબ જ મહત્વની માહિતી. આવા વિડિઓ વધુ આવવા જોઈએ.",
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
    const charCode = videoId && videoId.length > 1 ? videoId.charCodeAt(1) : 0;
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

function getRelatedVideos(video) {
    if (!video) return [];
    const seen = new Set([video.id]);

    const categoryMatches = (videos || []).filter((item) => {
        if (!item?.id) return false;
        if (seen.has(item.id)) return false;
        if (video.cat && item.cat === video.cat) {
            seen.add(item.id);
            return true;
        }
        return false;
    });

    const remainingMatches = (videos || []).filter((item) => {
        if (!item?.id) return false;
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
    });

    return [...shuffleArray(categoryMatches), ...shuffleArray(remainingMatches)];
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

/* =========================================================
   YouTube-style Custom Video Player
   ========================================================= */
function YouTubeStylePlayer({ src, poster, title, onError }) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const progressRef = useRef(null);
    const hideTimer = useRef(null);
    const clickTimer = useRef(null);
    const skipFlashTimeout = useRef(null);
    const previewVideoRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const lastPreviewSeek = useRef(0);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [buffered, setBuffered] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [showSpeedMenu, setShowSpeedMenu] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isHovering, setIsHovering] = useState(false);
    const [seekFeedback, setSeekFeedback] = useState(null);
    const [hoverPreview, setHoverPreview] = useState(null);
    const [isScrubbing, setIsScrubbing] = useState(false);

    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

    const resetHideTimer = useCallback(() => {
        setShowControls(true);
        if (hideTimer.current) clearTimeout(hideTimer.current);
        if (isPlaying) {
            hideTimer.current = setTimeout(() => {
                if (!isHovering) setShowControls(false);
            }, 2500);
        }
    }, [isPlaying, isHovering]);

    useEffect(() => {
        resetHideTimer();
        return () => {
            if (hideTimer.current) clearTimeout(hideTimer.current);
        };
    }, [isPlaying, resetHideTimer]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onTimeUpdate = () => setCurrentTime(video.currentTime);
        const onLoadedMetadata = () => setDuration(video.duration || 0);
        const onProgress = () => {
            if (video.buffered.length > 0) {
                setBuffered(video.buffered.end(video.buffered.length - 1));
            }
        };
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onVolumeChange = () => {
            setVolume(video.volume);
            setIsMuted(video.muted);
        };

        video.addEventListener("timeupdate", onTimeUpdate);
        video.addEventListener("loadedmetadata", onLoadedMetadata);
        video.addEventListener("progress", onProgress);
        video.addEventListener("play", onPlay);
        video.addEventListener("pause", onPause);
        video.addEventListener("volumechange", onVolumeChange);

        video.muted = true;
        video.play().catch(() => { });

        return () => {
            video.removeEventListener("timeupdate", onTimeUpdate);
            video.removeEventListener("loadedmetadata", onLoadedMetadata);
            video.removeEventListener("progress", onProgress);
            video.removeEventListener("play", onPlay);
            video.removeEventListener("pause", onPause);
            video.removeEventListener("volumechange", onVolumeChange);
        };
    }, [src]);

    useEffect(() => {
        const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
        document.addEventListener("fullscreenchange", onFsChange);
        return () => document.removeEventListener("fullscreenchange", onFsChange);
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => { });
        } else {
            video.pause();
        }
        resetHideTimer();
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = !video.muted;
        if (!video.muted && video.volume === 0) video.volume = 0.5;
        resetHideTimer();
    };

    const handleVolumeChange = (e) => {
        const video = videoRef.current;
        if (!video) return;
        const val = parseFloat(e.target.value);
        video.volume = val;
        video.muted = val === 0;
        resetHideTimer();
    };

    const drawPreviewFrame = useCallback(() => {
        const pv = previewVideoRef.current;
        const canvas = previewCanvasRef.current;
        if (!pv || !canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        try {
            ctx.drawImage(pv, 0, 0, canvas.width, canvas.height);
        } catch (_) { }
    }, []);

    useEffect(() => {
        const pv = previewVideoRef.current;
        if (!pv) return;
        pv.addEventListener("seeked", drawPreviewFrame);
        return () => pv.removeEventListener("seeked", drawPreviewFrame);
    }, [drawPreviewFrame]);

    const requestPreviewFrame = useCallback((time) => {
        const pv = previewVideoRef.current;
        if (!pv || !isFinite(time) || pv.readyState < 1) return;
        const now = performance.now();
        if (now - lastPreviewSeek.current < 60) return;
        if (Math.abs(pv.currentTime - time) < 0.1) return;
        lastPreviewSeek.current = now;
        try {
            pv.currentTime = time;
        } catch (_) { }
    }, []);

    const pctFromClientX = useCallback((clientX) => {
        const bar = progressRef.current;
        if (!bar) return 0;
        const rect = bar.getBoundingClientRect();
        return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    }, []);

    const updateHoverPreview = useCallback(
        (clientX) => {
            const bar = progressRef.current;
            if (!bar || !duration) return;
            const rect = bar.getBoundingClientRect();
            const pct = pctFromClientX(clientX);
            const time = pct * duration;
            const rawLeft = clientX - rect.left;
            const half = 84;
            const clampedLeft = Math.min(Math.max(rawLeft, half), Math.max(rect.width - half, half));
            setHoverPreview({ time, left: clampedLeft });
            requestPreviewFrame(time);
        },
        [duration, pctFromClientX, requestPreviewFrame],
    );

    const handleProgressMouseDown = (e) => {
        if (!duration) return;
        setIsScrubbing(true);
        updateHoverPreview(e.clientX);
        const video = videoRef.current;
        if (video) video.currentTime = pctFromClientX(e.clientX) * duration;
        resetHideTimer();
    };

    const handleProgressMouseMove = (e) => {
        updateHoverPreview(e.clientX);
    };

    const handleProgressMouseLeave = () => {
        if (!isScrubbing) setHoverPreview(null);
    };

    useEffect(() => {
        if (!isScrubbing) return;
        const onMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            updateHoverPreview(clientX);
            const video = videoRef.current;
            if (video && duration) video.currentTime = pctFromClientX(clientX) * duration;
        };
        const onUp = () => {
            setIsScrubbing(false);
            setHoverPreview(null);
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onMove);
        window.addEventListener("touchend", onUp);
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onUp);
        };
    }, [isScrubbing, duration, updateHoverPreview, pctFromClientX]);

    const toggleFullscreen = () => {
        const el = containerRef.current;
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen?.().catch(() => { });
        } else {
            document.exitFullscreen?.();
        }
        resetHideTimer();
    };

    const changeSpeed = (rate) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSpeedMenu(false);
        resetHideTimer();
    };

    const skip = useCallback((delta) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.min(Math.max(video.currentTime + delta, 0), video.duration || 0);

        const dir = delta > 0 ? "forward" : "backward";
        const amount = Math.abs(delta);
        setSeekFeedback((prev) => ({
            dir,
            seconds: prev && prev.dir === dir ? prev.seconds + amount : amount,
            key: Date.now(),
        }));
        clearTimeout(skipFlashTimeout.current);
        skipFlashTimeout.current = setTimeout(() => setSeekFeedback(null), 700);
        resetHideTimer();
    }, [resetHideTimer]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const tagName = document.activeElement?.tagName?.toLowerCase();
            if (tagName === "input" || tagName === "textarea") return;

            const video = videoRef.current;
            if (!video) return;

            if (e.code === "Space") {
                e.preventDefault();
                togglePlay();
            } else if (e.code === "ArrowRight") {
                e.preventDefault();
                skip(10);
            } else if (e.code === "ArrowLeft") {
                e.preventDefault();
                skip(-10);
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                const newVol = Math.min(Math.max(video.volume + 0.1, 0), 1);
                video.volume = newVol;
                video.muted = newVol === 0;
                resetHideTimer();
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                const newVol = Math.min(Math.max(video.volume - 0.1, 0), 1);
                video.volume = newVol;
                video.muted = newVol === 0;
                resetHideTimer();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [skip, resetHideTimer]);

    const handleSurfaceClick = (e) => {
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const thirdWidth = rect.width / 3;

        if (clickTimer.current) {
            clearTimeout(clickTimer.current);
            clickTimer.current = null;

            if (clickX < thirdWidth) {
                skip(-10);
            } else if (clickX > rect.width - thirdWidth) {
                skip(10);
            } else {
                toggleFullscreen();
            }
            return;
        }

        clickTimer.current = setTimeout(() => {
            togglePlay();
            clickTimer.current = null;
        }, 250);
    };

    useEffect(() => {
        return () => {
            clearTimeout(clickTimer.current);
            clearTimeout(skipFlashTimeout.current);
        };
    }, []);

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    const bufferedPercent = duration ? (buffered / duration) * 100 : 0;

    return (
        <div
            ref={containerRef}
            tabIndex={0}
            className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black select-none group focus:outline-none focus:ring-2 focus:ring-[#e48d0b]/50"
            onMouseMove={() => {
                setIsHovering(true);
                resetHideTimer();
            }}
            onMouseLeave={() => {
                setIsHovering(false);
                if (isPlaying) {
                    hideTimer.current = setTimeout(() => setShowControls(false), 800);
                }
            }}
            onClick={handleSurfaceClick}
        >
            <style>{`
                @keyframes skip-ripple-anim {
                    0% { transform: scale(0.5); opacity: 0.5; }
                    100% { transform: scale(1.7); opacity: 0; }
                }
                .skip-ripple {
                    animation: skip-ripple-anim 0.7s ease-out forwards;
                }
                @keyframes skip-chevron-anim {
                    0%, 100% { opacity: 0.3; transform: scale(0.92); }
                    50% { opacity: 1; transform: scale(1.08); }
                }
                .skip-chevron {
                    display: inline-flex;
                    animation: skip-chevron-anim 0.55s ease-in-out 2;
                }
            `}</style>
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                playsInline
                className="h-full w-full object-contain"
                onError={onError}
            />

            <video
                ref={previewVideoRef}
                src={src}
                muted
                preload="auto"
                playsInline
                tabIndex={-1}
                aria-hidden="true"
                style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
            />

            {seekFeedback && (
                <div
                    className={`pointer-events-none absolute inset-y-0 z-20 flex w-1/2 items-center justify-center overflow-hidden ${seekFeedback.dir === "forward" ? "right-0" : "left-0"
                        }`}
                >
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: "radial-gradient(circle, rgba(0,0,0,0.38) 0%, transparent 68%)",
                        }}
                    />
                    <div key={seekFeedback.key} className="relative flex items-center justify-center">
                        <span className="skip-ripple absolute h-28 w-28 rounded-full bg-white/20" />
                        <div className="relative z-10 flex flex-col items-center gap-1.5 rounded-2xl bg-black/55 px-5 py-3.5 text-white">
                            <div className="flex items-center -space-x-1.5">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="skip-chevron text-[#e48d0b]"
                                        style={{ animationDelay: `${i * 0.12}s` }}
                                    >
                                        {seekFeedback.dir === "forward" ? (
                                            <ChevronsRight size={20} />
                                        ) : (
                                            <ChevronsLeft size={20} />
                                        )}
                                    </span>
                                ))}
                            </div>
                            <span className="font-gu text-[13px] font-semibold leading-none">
                                {seekFeedback.seconds} સેકન્ડ
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm">
                        <Play size={36} className="ml-1 fill-current" />
                    </div>
                </div>
            )}

            <div
                className={`pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0"
                    }`}
            />

            <div
                className={`absolute inset-x-0 bottom-0 z-10 px-3 pb-2 pt-8 transition-opacity duration-300 ${showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    ref={progressRef}
                    className="group/progress relative mb-2 h-1 cursor-pointer rounded-full bg-white/30"
                    onMouseDown={handleProgressMouseDown}
                    onMouseMove={handleProgressMouseMove}
                    onMouseLeave={handleProgressMouseLeave}
                >
                    {hoverPreview && (
                        <div
                            className="pointer-events-none absolute bottom-full mb-2.5 flex -translate-x-1/2 flex-col items-center"
                            style={{ left: hoverPreview.left }}
                        >
                            <div className="overflow-hidden rounded-md border-2 border-white shadow-lg">
                                <canvas
                                    ref={previewCanvasRef}
                                    width={160}
                                    height={90}
                                    className="block h-[90px] w-[160px] bg-black object-cover"
                                />
                            </div>
                            <span className="mt-1 rounded bg-black/85 px-1.5 py-0.5 font-gu text-[11px] font-medium text-white">
                                {formatTime(hoverPreview.time)}
                            </span>
                        </div>
                    )}

                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/40"
                        style={{ width: `${bufferedPercent}%` }}
                    />
                    <div
                        className="absolute inset-y-0 left-0 rounded-full bg-[#e48d0b]"
                        style={{ width: `${progressPercent}%` }}
                    />
                    <div
                        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#e48d0b] opacity-0 shadow transition-opacity group-hover/progress:opacity-100"
                        style={{ left: `calc(${progressPercent}% - 6px)` }}
                    />
                </div>

                <div className="flex items-center gap-1 sm:gap-2 text-white">
                    <button
                        type="button"
                        onClick={togglePlay}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-white/20"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause size={18} className="fill-current sm:w-5 sm:h-5" />
                        ) : (
                            <Play size={18} className="ml-0.5 fill-current sm:w-5 sm:h-5" />
                        )}
                    </button>

                    <div className="flex items-center gap-0.5 sm:gap-1">
                        <button
                            type="button"
                            onClick={toggleMute}
                            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-white/20"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted || volume === 0 ? <VolumeX size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Volume2 size={16} className="sm:w-[18px] sm:h-[18px]" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="hidden h-1 w-14 cursor-pointer appearance-none rounded-full bg-white/30 accent-[#e48d0b]
                 sm:block sm:w-16
                 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3
                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
                 [&::-webkit-slider-thumb]:bg-white"
                        />
                    </div>

                    <span className="ml-0.5 font-gu text-[10px] sm:text-xs tabular-nums text-white/90 shrink-0">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div className="flex-1" />

                    <div className="relative">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSpeedMenu((v) => !v);
                            }}
                            className="flex h-8 sm:h-9 items-center gap-0.5 sm:gap-1 rounded-full
                 px-1.5 sm:px-2.5 text-[11px] sm:text-xs font-medium hover:bg-white/20"
                            title="Playback speed"
                        >
                            <Settings size={14} className="sm:w-4 sm:h-4" />
                            <span className="tabular-nums">{playbackRate}x</span>
                        </button>

                        {showSpeedMenu && (
                            <div
                                className="absolute bottom-full right-0 mb-2 min-w-[72px] sm:min-w-[90px]
                   overflow-hidden rounded-lg bg-black/90 py-1 shadow-xl backdrop-blur z-30"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {speeds.map((rate) => (
                                    <button
                                        key={rate}
                                        type="button"
                                        onClick={() => changeSpeed(rate)}
                                        className={`block w-full px-2.5 sm:px-3 py-[1px] md:py-1.5 text-left text-[12px] sm:text-[12px] md:text-[13px] lg:text-[14px] sm:text-xs hover:bg-white/15 ${playbackRate === rate ? "text-[#e48d0b] font-semibold" : "text-white"
                                            }`}
                                    >
                                        {rate === 1 ? "Normal" : `${rate}x`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={toggleFullscreen}
                        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full hover:bg-white/20"
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                        {isFullscreen ? <Minimize size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Maximize size={16} className="sm:w-[18px] sm:h-[18px]" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function VideoDetailPanel() {
    const { video, openVideo, closeVideo } = useVideoDetail();
    const { isSaved, toggleSave } = useSavedNews();
    const navigate = useNavigate();

    const [videoError, setVideoError] = useState(false);
    const [shareOpen, setShareOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [isCommentsOpen, setIsCommentsOpen] = useState(false);

    const commentsRef = useRef(null);
    const feedbackRef = useRef(null);
    const commentInputRef = useRef(null);

    const scrollToComments = useCallback(() => {
        setIsCommentsOpen(true);

        const el = feedbackRef.current || commentsRef.current;
        if (!el) return;

        el.style.scrollMarginTop = "80px";

        // 1) Primary scroll
        el.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest",
        });

        // 2) Window fallback
        requestAnimationFrame(() => {
            const y = el.getBoundingClientRect().top + window.pageYOffset - 150;
            window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
        });

        // 3) Nested scroll parent fallback
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

        // ✅ Focus input after scroll starts (works on all devices)
        setTimeout(() => {
            const input = commentInputRef.current;
            if (input) {
                input.focus({ preventScroll: true }); // scroll already handled above
            }
        }, 350);
    }, []);

    const isBookmarked = video ? isSaved(video.id) : false;
    const ytEmbed = video ? getYouTubeEmbedUrl(video.url) : null;

    const related = useMemo(
        () => (video ? getRelatedVideos(video) : []),
        [video?.id],
    );

    useEffect(() => {
        if (video) {
            setVideoError(false);
            setCommentText("");
            setComments(getMockComments(video.id));
            setIsCommentsOpen(false);
        }
    }, [video?.id]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") closeVideo();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeVideo]);

    const handleWhatsAppShare = useCallback(() => {
        if (!video) return;
        const text = `${video.title || "વિડિઓ"}\n${window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    }, [video]);

    const handleXShare = useCallback(() => {
        if (!video) return;
        const text = `${video.title || "વિડિઓ"}\n${window.location.href}`;
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
            "_blank"
        );
    }, [video]);

    const handleToggleSave = useCallback(() => {
        if (!video) return;
        toggleSave({
            id: video.id,
            headline: video.title,
            title: video.title,
            img: video.img,
            cat: video.cat,
            url: video.url,
            duration: video.duration,
            type: "video",
            ...video,
        });
    }, [video, toggleSave]);

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
        setIsCommentsOpen(true);
    }, [commentText]);

    if (!video) return null;

    const paragraphs = parseBodyParagraphs(video.body);

    const shortTitle = (video.title || "")
        .trim()
        .split(/\s+/)
        .slice(0, 3)
        .join(" ") + ((video.title || "").trim().split(/\s+/).length > 3 ? "…" : "");

    return (
        <div
            className="
                w-full min-w-0 rounded-none border-0 bg-transparent p-0 shadow-none
                sm:rounded-3xl sm:border sm:border-gray-200/70 sm:bg-white sm:p-5 sm:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
                md:p-7
                dark:sm:border-white/10 dark:sm:bg-[#121212]
            "
            role="article"
            aria-label={video.title}
        >
            {/* Breadcrumb */}
            <div className="mb-3 flex min-w-0 items-center gap-1.5 border-b border-black/8 pb-3 sm:mb-4 sm:gap-2 dark:border-white/10">
                <button
                    type="button"
                    onClick={closeVideo}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-black/5 text-ink transition-colors hover:bg-[#e48d0b]/15 hover:text-[#e48d0b] sm:h-9 sm:w-9 dark:bg-white/10 dark:text-ink-dark"
                    aria-label="બંધ કરો"
                >
                    <ArrowLeft size={16} className="sm:h-[18px] sm:w-[18px]" />
                </button>
                <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden font-gu text-[13px] text-ink/60 sm:gap-1.5 sm:text-[15px] md:text-[17px] dark:text-ink-dark/60">
                    <button
                        type="button"
                        onClick={() => {
                            closeVideo({ resetScroll: true });
                            navigate("/", { replace: true });
                        }}
                        className="shrink-0 cursor-pointer font-medium transition-colors hover:text-[#e48d0b]"
                    >
                        હોમ
                    </button>
                    <ChevronRight size={14} className="shrink-0 opacity-50" />
                    <button
                        type="button"
                        onClick={() => {
                            closeVideo({ resetScroll: true });
                            navigate("/videos", { replace: true });
                        }}
                        className="max-w-[80px] truncate cursor-pointer font-medium text-ink/80 transition-colors hover:text-[#e48d0b] sm:max-w-none dark:text-ink-dark/80"
                    >
                        વિડિઓ
                    </button>
                    <ChevronRight size={14} className="shrink-0 opacity-50" />
                    <span
                        className="min-w-0 truncate font-semibold text-[#e48d0b]"
                        title={video.title}
                    >
                        {shortTitle}
                    </span>
                </nav>
            </div>

            {/* HEADING */}
            <h1 className="mb-2 font-gu text-[24px] font-bold leading-snug text-ink sm:text-[32px] md:text-[40px] lg:text-[50px] dark:text-ink-dark">
                {video.title}
            </h1>

            <div className="mb-4 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-gu text-[13px] text-ink/55 sm:mb-5 sm:text-[16px] md:text-[18px] dark:text-ink-dark/55">
                {video.cat && (
                    <>
                        <span className="font-semibold text-[#e48d0b]/90">{video.cat}</span>
                        <span className="opacity-50">•</span>
                    </>
                )}
                {video.duration && <span>{video.duration}</span>}
            </div>

            {/* Video player */}
            <div className="mb-4">
                {videoError ? (
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black min-h-[200px]">
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                            <AlertTriangle className="text-amber-500" size={32} />
                            <p className="font-gu text-sm text-white/80">
                                આ વીડિયો પ્લે થઈ શકતો નથી.
                            </p>
                            <button
                                type="button"
                                onClick={() => setVideoError(false)}
                                className="rounded-lg bg-[#e48d0b] px-4 py-2 font-gu text-sm font-semibold text-white hover:bg-[#c98a2e]"
                            >
                                ફરી પ્રયાસ કરો
                            </button>
                        </div>
                    </div>
                ) : ytEmbed ? (
                    <div className="relative aspect-video overflow-hidden rounded-2xl bg-black min-h-[200px]">
                        <iframe
                            key={video.id}
                            src={ytEmbed}
                            title={video.title}
                            className="h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <YouTubeStylePlayer
                        key={video.id}
                        src={video.url}
                        poster={video.img}
                        title={video.title}
                        onError={() => setVideoError(true)}
                    />
                )}
            </div>

            {/* Actions */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 sm:mb-8">
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                        type="button"
                        className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center
                 rounded-xl border border-black/10 bg-white text-ink/75 transition-all
                 hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b]
                 dark:border-white/10 dark:bg-white/[0.04]"
                        aria-label="લાઈક"
                    >
                        <ThumbsUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                    <button
                        type="button"
                        className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center
                 rounded-xl border border-black/10 bg-white text-ink/75 transition-all
                 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-500
                 dark:border-white/10 dark:bg-white/[0.04]"
                        aria-label="ડિસલાઈક"
                    >
                        <ThumbsDown size={16} className="sm:w-[18px] sm:h-[18px]" />
                    </button>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                        type="button"
                        onClick={scrollToComments}
                        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-black/10 bg-white px-2.5 text-ink/70 transition-all hover:border-[#e48d0b]/40 hover:bg-[#e48d0b]/10 hover:text-[#e48d0b] sm:h-10 sm:px-3 dark:border-white/10 dark:bg-white/[0.04]"
                        aria-label="કમેન્ટ્સ"
                    >
                        <MessageSquareText size={17} />
                        <span className="font-gu text-xs">{comments.length}</span>
                    </button>
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
                        className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center
                 rounded-xl border border-black/10 bg-white text-ink/75 shadow-sm transition-all
                 hover:border-[#25D366]/50 hover:bg-[#25D366]/10
                 dark:border-white/10 dark:bg-white/[0.04]"
                        aria-label="WhatsApp"
                        title="WhatsApp"
                    >
                        <svg viewBox="0 0 24 24" width="18" height="18" className="sm:w-5 sm:h-5" fill="#25D366">
                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.92 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.35-.5.05-1.02.24-3.4-.71-2.87-1.15-4.71-4.06-4.85-4.25-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09.99-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.28.14.44.12.61-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.35z" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        onClick={handleXShare}
                        className="flex h-9 w-9 sm:h-10 sm:w-10 cursor-pointer items-center justify-center
                 rounded-xl border border-black/10 bg-white text-ink/75 shadow-sm transition-all
                 hover:border-black/40 hover:bg-black/5
                 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
                        aria-label="X પર શેર કરો"
                        title="X પર શેર કરો"
                    >
                        <svg viewBox="0 0 24 24" width="16" height="16" className="sm:w-[18px] sm:h-[18px]" fill="currentColor">
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

            {/* Body paragraphs */}
            {paragraphs.length > 0 && (
                <div className="mb-7">
                    <ParagraphsWithAds paragraphs={paragraphs} />
                </div>
            )}

            {/* Comments Section */}
            <div ref={commentsRef} className="mb-6 border-t border-black/8 pt-4 sm:mb-8 sm:pt-5 dark:border-white/10">
                <div className="mb-4 sm:mb-5">
                    <h3
                        ref={feedbackRef}
                        className="mb-2 font-gu text-[18px] font-medium text-ink sm:text-[20px] md:text-[22px] dark:text-ink-dark"
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
                    <div className="mt-2.5 flex justify-end">
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
                        onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                        className="group flex w-full cursor-pointer items-center justify-between py-1 font-gu text-[17px] font-medium text-ink sm:text-[20px] dark:text-ink-dark"
                    >
                        <div className="flex items-center gap-2">
                            <MessageSquareText size={18} className="text-[#e48d0b] sm:h-5 sm:w-5" />
                            <span>કોમેન્ટ્સ લિસ્ટ</span>
                        </div>
                        <ChevronDown
                            size={18}
                            className={`text-ink/60 transition-transform duration-300 group-hover:text-[#e48d0b] dark:text-ink-dark/60 ${isCommentsOpen ? "rotate-180" : ""}`}
                        />
                    </button>

                    <div
                        className={`grid transition-all duration-300 ease-in-out ${isCommentsOpen
                            ? "mt-3 grid-rows-[1fr] opacity-100 sm:mt-4"
                            : "mt-0 grid-rows-[0fr] overflow-hidden opacity-0"}`}
                    >
                        <div className="overflow-hidden">
                            <div className="space-y-3 sm:space-y-4">
                                {comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="flex items-start gap-2.5 border-b border-black/10 pb-3 last:border-b-0 sm:gap-3 sm:pb-4 dark:border-white/10"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 font-gu text-[16px] font-semibold text-[#e48d0b] sm:h-11 sm:w-11 sm:text-[18px] dark:bg-white/10 dark:text-ink-dark/60">
                                            {comment.name?.charAt(0) || "?"}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                                <span className="font-gu text-[15px] font-semibold text-ink sm:text-[18px] dark:text-ink-dark">
                                                    {comment.name}
                                                </span>
                                                <span className="font-gu text-[13px] text-ink/80 dark:text-ink-dark/45 sm:text-[16px]">
                                                    {comment.time}
                                                </span>
                                            </div>
                                            <p className="mt-0.5 font-gu text-[15px] leading-relaxed text-ink/80 sm:text-[18px] dark:text-ink-dark/80">
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

            {/* Related videos */}
            {related.length > 0 && (
                <div className="mb-6 border-t border-black/8 pt-4 sm:mb-8 sm:pt-5 dark:border-white/10">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {related.map((item) => {
                            const videoId = item.id ?? item.url;
                            const isItemBookmarked = isSaved(videoId);

                            return (
                                <div
                                    key={videoId}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => openVideo(item)}
                                    onKeyDown={(e) => e.key === "Enter" && openVideo(item)}
                                    className="group flex h-full cursor-pointer flex-col justify-between rounded-2xl bg-white p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 active:scale-[0.99] dark:bg-white/[0.04] dark:shadow-[0_1px_3px_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.15)]"
                                >
                                    <div>
                                        <div className="relative block w-full overflow-hidden rounded-xl">
                                            {item.img ? (
                                                <img
                                                    src={item.img}
                                                    alt=""
                                                    loading="lazy"
                                                    className="aspect-[16/10] w-full object-cover"
                                                />
                                            ) : (
                                                <div className="aspect-[16/10] w-full bg-black/5 dark:bg-white/5" />
                                            )}

                                            <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    aria-label="સેવ કરો"
                                                    title={isItemBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleSave({
                                                            id: videoId,
                                                            headline: item.title,
                                                            title: item.title,
                                                            img: item.img,
                                                            cat: item.cat,
                                                            url: item.url,
                                                            duration: item.duration,
                                                            type: "video",
                                                            ...item,
                                                        });
                                                    }}
                                                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white shadow-md backdrop-blur-md transition-all duration-300 active:scale-90 ${isItemBookmarked
                                                        ? "border-transparent bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
                                                        : "bg-black/40 hover:bg-[#e48d0b]"
                                                        }`}
                                                >
                                                    <Bookmark
                                                        size={16}
                                                        className={isItemBookmarked ? "fill-current" : ""}
                                                    />
                                                </button>
                                            </span>

                                            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-[0_2px_12px_rgba(0,0,0,0.2)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#e48d0b]">
                                                    <Play size={20} className="ml-0.5" fill="currentColor" />
                                                </span>
                                            </span>

                                            {item.duration && (
                                                <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/60 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-md">
                                                    {item.duration}
                                                </span>
                                            )}
                                        </div>

                                        <p className="mt-3 text-[15px] font-medium text-[#e48d0b]">
                                            {item.cat && <span>{item.cat}</span>}
                                        </p>

                                        <p className="article-headline mt-1 text-[15px] leading-snug sm:text-[16px]">
                                            {item.title}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <AdBlock />

            {/* Share popup */}
            <ShareModal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                title={video.title}
                text={video.title}
                url={typeof window !== "undefined" ? window.location.href : ""}
                image={video.img}
            />
        </div>
    );
}