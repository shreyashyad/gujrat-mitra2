import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { charchaPatroData } from "../../data/CharchaPatroData.js";
import {
  Share,
  Edit3,
  Star,
  StarHalf,
  Search,
  X,
  Pin,
} from "lucide-react";
import { useCharchaPatraDetail } from "../../context/CharchaPatraDetailContext.jsx";
import ShareModal from "../common/ShareModal.jsx";

export default function CharchapatraLanding() {
  const navigate = useNavigate();
  const { openDetail } = useCharchaPatraDetail();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shareItem, setShareItem] = useState(null);

  const authorArticleCounts = useMemo(() => {
    return charchaPatroData.reduce((counts, item) => {
      const authorKey = item.author?.trim().toLowerCase();
      if (authorKey) counts[authorKey] = (counts[authorKey] || 0) + 1;
      return counts;
    }, {});
  }, []);

  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const renderRatingStars = (ratingValue) => {
    const rating = parseFloat(ratingValue) || 4.2;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <Star key={i} size={15} className="sm:w-[17px] sm:h-[17px] text-[#e8a33d]" fill="currentColor" />
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <StarHalf key={i} size={15} className="sm:w-[17px] sm:h-[17px] text-[#e8a33d]" fill="currentColor" />
        );
      } else {
        stars.push(
          <Star key={i} size={15} className="sm:w-[17px] sm:h-[17px] text-gray-300 dark:text-gray-600" />
        );
      }
    }
    return stars;
  };

  const filteredData = charchaPatroData
    .filter((item) => {
      const q = searchQuery.toLowerCase();
      const titleMatch = item.title?.toLowerCase().includes(q);
      const authorMatch = item.author?.toLowerCase().includes(q);
      const contentMatch = stripHtmlTags(item.description || item.body || "")
        .toLowerCase()
        .includes(q);
      return titleMatch || authorMatch || contentMatch;
    })
    .sort((a, b) => {
      if (a.isHero && !b.isHero) return -1;
      if (!a.isHero && b.isHero) return 1;
      return 0;
    });

  const openAuthorProfile = (e, author) => {
    e.stopPropagation();
    if (!author) return;
    const authorSlug = encodeURIComponent(author.trim());
    navigate(`/charcha-patra/profile/${authorSlug}`);
  };

  const openArticle = (item) => {
    if (!item) return;
    // openDetail() updates the panel instantly; navigate() below is the
    // only history entry this should push (see CharchaPatraDetailContext
    // for why an extra manual pushState here used to triple it up).
    openDetail(item);
    navigate(`/charcha-patra/${item.id}`);
  };

  const handleShare = (e, item) => {
    e.stopPropagation();
    setShareItem(item);
  };

  return (
    <div className="w-full flex flex-col space-y-4 sm:space-y-5 md:space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3 pb-3 md:pb-4 md:grid md:grid-cols-3 md:gap-4">
        <div className="hidden md:block" />

        <div className="flex justify-start md:justify-center">
          <button
            type="button"
            onClick={() => navigate("/charcha-patra/form")}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2
                 rounded-[6px] border border-[#e8a33d]/60 text-[#e8a33d]
                 hover:bg-[#e8a33d]/10 font-gu font-semibold
                 text-[13px] sm:text-[15px] transition-all cursor-pointer w-fit"
          >
            <Edit3 size={15} className="sm:w-[17px] sm:h-[17px]" />
            <span>ચર્ચાપત્ર લખો</span>
          </button>
        </div>

        <div className="flex justify-end">
          <div className="relative flex items-center">
            <div
              className={`flex items-center rounded-[6px] border border-[#e8a33d] bg-transparent
                    transition-all duration-300 ease-in-out
                    ${isSearchExpanded
                  ? "w-40 sm:w-56 md:w-64 px-2.5 sm:px-3 py-1.5"
                  : "w-[100px] sm:w-[120px] px-2.5 sm:px-3 py-1.5 cursor-pointer"
                }`}
              onClick={() => setIsSearchExpanded(true)}
            >
              <Search
                size={16}
                className="text-ink/60 dark:text-ink-dark/60 shrink-0 sm:w-[17px] sm:h-[17px]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => {
                  if (!searchQuery) setIsSearchExpanded(false);
                }}
                placeholder="સર્ચ કરો..."
                className="bg-transparent border-none outline-none font-gu
                     text-[13px] sm:text-[15px]
                     text-ink dark:text-ink-dark
                     placeholder:text-ink/50 dark:placeholder:text-ink-dark/50
                     transition-all duration-300 ml-1.5 sm:ml-2 w-full"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery("");
                    setIsSearchExpanded(false);
                  }}
                  className="text-ink/50 hover:text-ink dark:text-ink-dark/50 dark:hover:text-ink-dark
                       ml-1 p-0.5 cursor-pointer shrink-0"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards / Empty */}
      {filteredData.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center
                     rounded-2xl sm:rounded-3xl
                     border border-gray-200/70 bg-white
                     px-4 sm:px-6 py-10 sm:py-16 text-center
                     shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
                     dark:border-white/10 dark:bg-[#121212]"
        >
          <Search
            size={32}
            className="mb-3 sm:mb-4 text-ink/25 dark:text-ink-dark/25 sm:w-10 sm:h-10"
            strokeWidth={1.5}
          />
          <p className="font-gu text-[17px] sm:text-[20px] font-semibold text-ink dark:text-ink-dark">
            સર્ચ કરેલ ડેટા મળ્યો નથી
          </p>
          <p className="mt-1.5 sm:mt-2 max-w-md font-gu text-[13px] sm:text-[15px] text-ink/55 dark:text-ink-dark/55">
            {searchQuery
              ? `"${searchQuery}" માટે કોઈ ચર્ચાપત્ર મળ્યું નથી. અન્ય શબ્દ અજમાવો.`
              : "કોઈ ચર્ચાપત્ર ઉપલબ્ધ નથી."}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setIsSearchExpanded(false);
              }}
              className="mt-4 sm:mt-5 cursor-pointer rounded-[6px] border border-[#e8a33d]/60
                         px-3 sm:px-4 py-1.5 sm:py-2 font-gu text-[13px] sm:text-[14px]
                         font-semibold text-[#e8a33d] transition hover:bg-[#e8a33d]/10"
            >
              સર્ચ સાફ કરો
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {filteredData.map((item) => {
            const rawContent =
              item.description || item.body || item.content || item.text || "";
            const cleanText = stripHtmlTags(rawContent);
            const profileImage =
              item.profilePhoto ||
              item.authorImage ||
              item.image ||
              item.profilePic ||
              item.avatar;
            const currentRating = item.rating || "4.2";
            const isHero = Boolean(item.isHero);
            const authorArticleCount =
              authorArticleCounts[item.author?.trim().toLowerCase()] || 0;

            return (
              <div
                key={item.id}
                onClick={() => openArticle(item)}
                className={`relative flex flex-col justify-between
                            bg-white dark:bg-[#121212]
                            transition-all hover:-translate-y-0.5
                            shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
                            p-4 sm:p-5 md:p-7
                            border border-gray-200/70 dark:border-white/10
                            rounded-2xl sm:rounded-3xl cursor-pointer
                            ${isHero ? "ring-1 ring-[#e8a33d]/40" : ""}`}
              >
                {isHero && (
                  <button
                    type="button"
                    title="પિન કરેલું / Pinned"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10
                               flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center
                               rounded-full bg-[#e8a33d] text-white shadow-md
                               transition-transform hover:scale-105 cursor-pointer"
                    aria-label="પિન કરેલું"
                  >
                    <Pin size={11} className="sm:w-3 sm:h-3" fill="currentColor" />
                  </button>
                )}

                {/* Top */}
                <div className="flex flex-col">
                  <h2
                    className={`text-[18px] sm:text-[21px] md:text-[25px]
                                font-medium font-gu text-ink dark:text-ink-dark
                                leading-snug hover:text-[#e8a33d] transition-colors
                                ${isHero ? "pr-8 sm:pr-12" : ""}`}
                  >
                    {item.title}
                  </h2>

                  <div className="flex flex-wrap items-center justify-between
                                  mt-2 sm:mt-3 mb-3 sm:mb-4 gap-2
                                  text-[15px] sm:text-[17px] font-gu
                                  text-ink/60 dark:text-ink-dark/60">
                    <span>{item.date}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/charcha-patra/form", {
                          state: {
                            relatedTitle: item.title,
                            authorName: item.author,
                          },
                        });
                      }}
                      className="flex items-center gap-1 sm:gap-1.5
                                 px-2 sm:px-3 py-1 sm:py-1.5 rounded-[6px]
                                 border border-[#e8a33d]/60 text-[#e8a33d]
                                 hover:bg-[#e8a33d]/10 font-gu font-semibold
                                 text-[11px] sm:text-[13px] transition-all
                                 cursor-pointer shrink-0"
                    >
                      <Edit3 size={13} className="sm:w-[15px] sm:h-[15px]" />
                      <span>સંબંધિત ચર્ચાપત્ર લખો</span>
                    </button>
                  </div>

                  <p className="font-gu text-[17px] sm:text-[18px] md:text-[19px]
                                leading-[1.65] sm:leading-[1.7]
                                text-ink/80 dark:text-ink-dark/84 line-clamp-4 sm:line-clamp-5">
                    {cleanText || "કોઈ વિગત ઉપલબ્ધ નથી."}
                  </p>
                </div>

                {/* Bottom */}
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4
                border-t border-black/10 dark:border-white/10
                flex flex-col gap-3 sm:gap-4">

                  {/* Author row: avatar | name + stars + rating | share */}
                  {item.author && (
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={(e) => openAuthorProfile(e, item.author)}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAE589]
                   flex items-center justify-center shrink-0 overflow-hidden
                   border border-black/10 cursor-pointer
                   hover:ring-2 hover:ring-[#e8a33d]/50 transition-all"
                        aria-label={`${item.author} ની પ્રોફાઇલ`}
                      >
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={item.author}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-ink text-base sm:text-lg">
                            {item.author.charAt(0)}
                          </span>
                        )}
                      </button>

                      <div className="flex flex-col min-w-0 flex-1 leading-[1.25]">
                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={(e) => openAuthorProfile(e, item.author)}
                            className="font-gu font-normal text-[16px] sm:text-[18px] md:text-[20px]
                       text-ink dark:text-ink-dark hover:text-[#e8a33d]
                       transition-colors cursor-pointer text-left"
                          >
                            {item.author}
                          </button>

                          {/* Stars + rating number side by side */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5">
                              {renderRatingStars(currentRating)}
                            </div>
                            <span className="font-gu font-semibold text-[13px] sm:text-[15px] text-[#e8a33d]">
                              {currentRating}
                            </span>
                          </div>
                        </div>

                        <span className="font-gu text-[12px] sm:text-[14px] md:text-[15px]
                         text-ink/60 dark:text-ink-dark/60 truncate mt-0.5">
                          {item.authorSubText ||
                            `વર્ષ ૨૦૨૦થી • ${authorArticleCount} ચર્ચાપત્રો`}
                        </span>
                      </div>

                      {/* Share — end of profile row */}
                      <button
                        type="button"
                        onClick={(e) => handleShare(e, item)}
                        className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 cursor-pointer items-center justify-center
                   rounded-xl bg-white text-ink/70 shadow-sm transition-all
                   hover:bg-[#e48d0b]/10 hover:text-[#e48d0b]
                   dark:bg-white/[0.04] dark:text-ink-dark/70"
                        aria-label="શેર કરો"
                        title="શેર કરો"
                      >
                        <Share size={18} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}


      {/* Share popup */}
      <ShareModal
        open={Boolean(shareItem)}
        onClose={() => setShareItem(null)}
        title={shareItem?.title}
        text={shareItem?.title}
        url={
          shareItem
            ? `${window.location.origin}/charcha-patra/${shareItem.id}`
            : ""
        }
        image={
          shareItem
            ? shareItem.profilePhoto ||
            shareItem.authorImage ||
            shareItem.image ||
            shareItem.profilePic ||
            shareItem.avatar
            : ""
        }
      />
    </div>
  );
}