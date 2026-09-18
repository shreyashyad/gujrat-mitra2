import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Share,
  Star,
  StarHalf,
  MapPin,
  FileText,
  Edit3,
} from "lucide-react";
import { charchaPatroData } from "../../data/CharchaPatroData.js";
import { useCharchaPatraDetail } from "../../context/CharchaPatraDetailContext.jsx";
import ShareModal from "../common/ShareModal.jsx";

export default function CharchapatraProfileData() {
  const navigate = useNavigate();
  const { authorSlug } = useParams();
  const { openDetail } = useCharchaPatraDetail();

  const [shareItem, setShareItem] = useState(null);

  const authorName = decodeURIComponent(authorSlug || "").trim();

  const toGujaratiDigits = (str) => {
    if (str === null || str === undefined) return "";
    const map = {
      "0": "૦",
      "1": "૧",
      "2": "૨",
      "3": "૩",
      "4": "૪",
      "5": "૫",
      "6": "૬",
      "7": "૭",
      "8": "૮",
      "9": "૯",
      ".": ".",
    };
    return String(str).replace(/[0-9.]/g, (m) => map[m] || m);
  };

  const authorArticles = useMemo(() => {
    return charchaPatroData.filter(
      (item) => item.author?.trim().toLowerCase() === authorName.toLowerCase()
    );
  }, [authorName]);

  const profileSource = authorArticles[0] || null;

  const profileImage =
    profileSource?.profilePhoto ||
    profileSource?.authorImage ||
    profileSource?.profilePic ||
    profileSource?.avatar ||
    null;

  const location = profileSource?.location || "";
  const articlesCount = authorArticles.length;

  const rawAvgRating =
    authorArticles.length > 0
      ? (
          authorArticles.reduce(
            (sum, a) => sum + (parseFloat(a.rating) || 0),
            0
          ) / authorArticles.length
        ).toFixed(1)
      : "4.0";
  const avgRating = toGujaratiDigits(rawAvgRating);

  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const renderRatingStars = (ratingValue) => {
    const numericRating =
      parseFloat(
        String(ratingValue).replace(/[૦-૯]/g, (d) =>
          "૦૧૨૩૪૫૬૭૮૯".indexOf(d)
        )
      ) || 4.2;

    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(numericRating)) {
        stars.push(
          <Star
            key={i}
            size={16}
            fill="currentColor"
            className="text-[#e48d0b]"
          />
        );
      } else if (i === Math.ceil(numericRating) && numericRating % 1 !== 0) {
        stars.push(
          <StarHalf
            key={i}
            size={16}
            fill="currentColor"
            className="text-[#e48d0b]"
          />
        );
      } else {
        stars.push(
          <Star
            key={i}
            size={16}
            className="text-black/15 dark:text-white/20"
          />
        );
      }
    }
    return stars;
  };

  const handleShare = (e, item) => {
    e.stopPropagation();
    setShareItem(item);
  };

  /* ========== Empty / Not found ========== */
  if (!authorName || authorArticles.length === 0) {
    return (
      <div
        className="
          flex w-full flex-col space-y-5
          rounded-none border-0 bg-transparent p-0 shadow-none
          md:space-y-6 md:rounded-3xl md:border md:border-gray-200/70 md:bg-white md:p-7
          md:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
          dark:md:border-white/10 dark:md:bg-[#121212]
        "
      >
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
            onClick={() => navigate("/charcha-patra")}
          >
            ચર્ચાપત્ર
          </button>
          <ChevronRight
            size={14}
            className="shrink-0 text-ink/40 dark:text-ink-dark/40"
          />
          <span className="truncate text-[#e48d0b]">પ્રોફાઇલ</span>
        </div>

        <div className="rounded-2xl border border-gray-200/70 bg-white p-8 text-center dark:border-white/10 dark:bg-[#121212] sm:rounded-3xl sm:p-10">
          <p className="font-gu text-[16px] text-ink/70 sm:text-[17px] dark:text-ink-dark/70">
            આ લેખકની પ્રોફાઇલ મળી નથી.
          </p>
          <button
            type="button"
            onClick={() => navigate("/charcha-patra")}
            className="mt-4 cursor-pointer rounded-[6px] border border-[#e48d0b]/60 px-4 py-2 font-gu text-[14px] font-semibold text-[#e48d0b] transition hover:bg-[#e48d0b]/10 sm:text-[15px]"
          >
            પાછા ચર્ચાપત્ર પર જાઓ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        flex w-full flex-col space-y-5
        rounded-none border-0 bg-transparent p-0 shadow-none
        md:space-y-6 md:rounded-3xl md:border md:border-gray-200/70 md:bg-white md:p-7
        md:shadow-[0_2px_3px_rgba(0,0,0,0.06),0_0_20px_rgba(0,0,0,0.06)]
        dark:md:border-white/10 dark:md:bg-[#121212]
      "
    >
      {/* ========== Breadcrumb ========== */}
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
          {authorName || "પ્રોફાઇલ"}
        </span>
      </div>

      {/* ========== Profile Header ========== */}
      <div className="rounded-2xl border border-gray-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_10px_rgba(0,0,0,0.03)] dark:border-white/10 dark:bg-[#121212] sm:p-5">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#e48d0b]/30 bg-[#FAE589] shadow-sm sm:h-28 sm:w-28 md:h-32 md:w-32">
            {profileImage ? (
              <img
                src={profileImage}
                alt={authorName}
                className="h-full w-full object-cover"
                style={{ borderRadius: "50%" }}
              />
            ) : (
              <span className="font-gu text-2xl font-bold text-ink sm:text-3xl">
                {authorName.charAt(0)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            <h1 className="font-gu text-[22px] font-semibold leading-tight text-ink sm:text-[26px] md:text-[28px] dark:text-ink-dark">
              {authorName}
            </h1>

            {location && (
              <div className="mt-1 flex items-center gap-1.5 font-gu text-[15px] text-ink/60 sm:text-[17px] dark:text-ink-dark/60">
                <MapPin size={15} className="shrink-0" />
                <span>{location}</span>
              </div>
            )}

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3">
              <div className="flex items-center gap-1">
                {renderRatingStars(rawAvgRating)}
                <span className="ml-1 font-gu text-[14px] font-semibold text-[#e48d0b] sm:text-[15px]">
                  {avgRating}
                </span>
              </div>

              <div className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 font-gu text-[13px] text-ink/70 sm:px-3 sm:text-[15px] dark:bg-white/5 dark:text-ink-dark/70">
                <FileText size={14} />
                <span>
                  {toGujaratiDigits(articlesCount)} ચર્ચાપત્ર
                  {articlesCount > 1 ? "ો" : ""}
                </span>
              </div>
            </div>

            <p className="mt-1 font-gu text-[13px] text-ink/55 sm:text-[15px] dark:text-ink-dark/55">
              વર્ષ ૨૦૨૦થી • {toGujaratiDigits(articlesCount)} ચર્ચાપત્રો અપલોડ
            </p>
          </div>
        </div>
      </div>

      {/* ========== Author's Articles ========== */}
      <div>
        <h2 className="mb-3 font-gu text-[16px] font-semibold text-ink sm:mb-4 sm:text-[17px] dark:text-ink-dark">
          {authorName}ના ચર્ચાપત્રો
        </h2>

        <div className="flex flex-col gap-3 sm:gap-4">
          {authorArticles.map((item) => {
            const rawContent =
              item.description || item.body || item.content || item.text || "";
            const cleanText = stripHtmlTags(rawContent);
            const currentRating = toGujaratiDigits(
              item.rating || rawAvgRating
            );

            return (
              <article
                key={item.id}
                onClick={() => {
                  openDetail(item);
                  navigate(`/charcha-patra/${item.id}`);
                }}
                className="flex cursor-pointer flex-col rounded-2xl border border-gray-200/70 bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_10px_rgba(0,0,0,0.03)] transition-transform duration-300 ease-out hover:-translate-y-0.5 dark:border-white/10 dark:bg-[#121212] sm:p-5"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetail(item);
                    navigate(`/charcha-patra/${item.id}`);
                  }
                }}
              >
                <h3 className="font-gu text-[17px] font-medium leading-snug text-ink sm:text-[20px] md:text-[22px] dark:text-ink-dark">
                  {item.title}
                </h3>

                <div className="mt-2 mb-3 flex flex-col gap-2 sm:mt-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                  <div className="font-gu text-[13px] text-ink/65 sm:text-[15px] dark:text-ink-dark/60">
                    <span>પોસ્ટ કરેલ: {item.date}</span>
                    {item.author && (
                      <>
                        <span className="mx-1.5">·</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const slug = encodeURIComponent(
                              item.author.trim()
                            );
                            navigate(`/charcha-patra/profile/${slug}`);
                          }}
                          className="cursor-pointer border-0 bg-transparent p-0 font-gu font-medium text-[#e48d0b] hover:underline"
                        >
                          {item.author}
                        </button>
                      </>
                    )}
                  </div>

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
                    className="flex w-fit shrink-0 cursor-pointer items-center gap-1.5 rounded-[6px] border border-[#e48d0b]/60 px-2.5 py-1.5 font-gu text-[12px] font-semibold text-[#e48d0b] transition-all hover:bg-[#e48d0b]/10 sm:px-3 sm:text-[13px]"
                  >
                    <Edit3 size={14} className="sm:h-[15px] sm:w-[15px]" />
                    <span>સંબંધિત ચર્ચાપત્ર લખો</span>
                  </button>
                </div>

                <p className="line-clamp-3 font-gu text-[15px] leading-[1.55] text-ink/80 sm:text-[17px] md:text-[18px] dark:text-ink-dark/84">
                  {cleanText || "કોઈ વિગત ઉપલબ્ધ નથી."}
                </p>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-black/10 pt-3 dark:border-white/10 sm:mt-5">
                  <div className="flex items-center gap-1.5">
                    {renderRatingStars(item.rating || rawAvgRating)}
                    <span className="font-gu text-[14px] font-semibold text-[#e48d0b] sm:text-[16px]">
                      {currentRating}
                    </span>
                  </div>
                  <button
                    type="button"
                    aria-label="શેર કરો"
                    onClick={(e) => handleShare(e, item)}
                    className="cursor-pointer p-1 text-ink/70 transition-colors hover:text-[#e48d0b] dark:text-ink-dark/70"
                  >
                    <Share size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* ========== Share Modal ========== */}
      <ShareModal
        open={Boolean(shareItem)}
        onClose={() => setShareItem(null)}
        title={shareItem?.title || "ચર્ચાપત્ર"}
        text={
          shareItem
            ? stripHtmlTags(
                shareItem.description ||
                  shareItem.body ||
                  shareItem.content ||
                  shareItem.text ||
                  shareItem.title ||
                  ""
              )
            : ""
        }
        url={
          shareItem
            ? `${window.location.origin}/charcha-patra/${shareItem.id}`
            : ""
        }
        image={
          shareItem?.image ||
          shareItem?.img ||
          shareItem?.profilePhoto ||
          null
        }
      />
    </div>
  );
}