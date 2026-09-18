import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  Share,
} from "lucide-react";
import { allContent } from "../../data/opinion.js";
import ShareModal from "../common/ShareModal.jsx";

const editorial = allContent.editorial || [];
const commentsAndColumns = allContent.commentAndColumns || [];
const allOpinionArticles = [...commentsAndColumns, ...editorial];

export default function OpinionAuthorProfile() {
  const navigate = useNavigate();
  const { authorId } = useParams();

  const [shareItem, setShareItem] = useState(null);

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

  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  const authorArticles = useMemo(() => {
    if (!authorId) return [];
    const idStr = String(authorId).trim();

    let byId = allOpinionArticles.filter(
      (item) => String(item.id) === idStr || String(item.authorId) === idStr
    );

    if (byId.length > 0) {
      const authorName = byId[0]?.author;
      if (authorName) {
        return allOpinionArticles.filter(
          (item) =>
            item.author?.trim().toLowerCase() ===
            authorName.trim().toLowerCase()
        );
      }
      return byId;
    }

    const name = decodeURIComponent(idStr).trim().toLowerCase();
    return allOpinionArticles.filter(
      (item) => item.author?.trim().toLowerCase() === name
    );
  }, [authorId]);

  const profileSource = authorArticles[0] || null;
  const authorName =
    profileSource?.author || decodeURIComponent(authorId || "").trim();
  const profileImage =
    profileSource?.profilepic ||
    profileSource?.profilePhoto ||
    profileSource?.authorImage ||
    profileSource?.avatar ||
    null;
  const articlesCount = authorArticles.length;

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
            onClick={() => navigate("/opinion")}
          >
            ઓપીનિયન
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
            onClick={() => navigate("/opinion")}
            className="mt-4 cursor-pointer rounded-[6px] border border-[#e48d0b]/60 px-4 py-2 font-gu text-[14px] font-semibold text-[#e48d0b] transition hover:bg-[#e48d0b]/10 sm:text-[15px]"
          >
            પાછા ઓપીનિયન પર જાઓ
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
          onClick={() => navigate("/opinion")}
        >
          ઓપીનિયન
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

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start sm:gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-black/5 px-2.5 py-1 font-gu text-[13px] text-ink/70 sm:px-3 sm:text-[15px] dark:bg-white/5 dark:text-ink-dark/70">
                <FileText size={14} />
                <span>
                  {toGujaratiDigits(articlesCount)} ઓપીનિયન
                  {articlesCount > 1 ? "ો" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Author's Opinions ========== */}
      <div>
        <h2 className="mb-3 font-gu text-[16px] font-semibold text-ink sm:mb-4 sm:text-[17px] dark:text-ink-dark">
          {authorName}ના ઓપીનિયન
        </h2>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {authorArticles.map((item) => {
            const itemTitle = item.title || item.headline || "";
            const itemImg = item.image || item.img || null;
            const itemAuthor = item.author || "";
            const itemPic =
              item.profilepic ||
              item.profilePhoto ||
              item.authorImage ||
              item.avatar ||
              profileImage ||
              null;
            const itemDate = item.time || item.date || "";
            const rawContent =
              item.body || item.description || item.content || "";
            const cleanText = stripHtmlTags(rawContent);

            return (
              <article
                key={item.id}
                onClick={() => navigate(`/opinion/${item.id}`)}
                className="
                  flex h-full cursor-pointer flex-col
                  rounded-2xl border border-gray-200/70 bg-white p-4
                  shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_10px_rgba(0,0,0,0.03)]
                  transition-transform duration-300 ease-out hover:-translate-y-0.5
                  dark:border-white/10 dark:bg-[#121212]
                  sm:p-5
                "
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/opinion/${item.id}`);
                  }
                }}
              >
                {/* Image */}
                {itemImg && (
                  <div className="relative mb-3 aspect-[16/10] w-full overflow-hidden rounded-xl">
                    <img
                      src={itemImg}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <h3 className="article-headline">
                  {itemTitle}
                </h3>

                {/* Meta row — immediately after headline */}
                <div className="mt-1 article-metaRow">
                  <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-1">
                    {(itemAuthor || itemPic) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (itemAuthor) {
                            navigate(
                              `/opinion/author/${encodeURIComponent(
                                itemAuthor.trim()
                              )}`
                            );
                          }
                        }}
                        className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 font-gu font-medium text-[#e48d0b] hover:opacity-80"
                      >
                        {itemPic && (
                          <img
                            src={itemPic}
                            alt=""
                            className="h-[18px] w-[18px] shrink-0 rounded-full border border-black/10 object-cover dark:border-white/10"
                          />
                        )}
                        {itemAuthor && (
                          <span className="truncate max-w-[120px] sm:max-w-[140px]">
                            {itemAuthor}
                          </span>
                        )}
                      </button>
                    )}
                    {(itemAuthor || itemPic) && itemDate && (
                      <span className="opacity-50">·</span>
                    )}
                    {itemDate && <span className="truncate">{itemDate}</span>}
                  </div>

                  {/* Share */}
                  <button
                    type="button"
                    aria-label="શેર કરો"
                    onClick={(e) => handleShare(e, item)}
                    className="ml-auto shrink-0 cursor-pointer p-1 text-ink/70 transition-colors hover:text-[#e48d0b] dark:text-ink-dark/70"
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
        title={shareItem?.title || shareItem?.headline || "ઓપીનિયન"}
        text={
          shareItem
            ? stripHtmlTags(
                shareItem.body ||
                  shareItem.description ||
                  shareItem.content ||
                  shareItem.title ||
                  shareItem.headline ||
                  ""
              )
            : ""
        }
        url={
          shareItem
            ? `${window.location.origin}/opinion/${shareItem.id}`
            : ""
        }
        image={shareItem?.image || shareItem?.img || null}
      />
    </div>
  );
}