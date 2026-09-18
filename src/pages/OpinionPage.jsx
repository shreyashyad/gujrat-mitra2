import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRight, ChevronDown, Bookmark } from "lucide-react";
import MainGrid from "../components/layout/MainGrid.jsx";
import { OpinionDetailPanel } from "../components/opinion/OpinionDetailPanel.jsx";
import { allContent } from "../data/opinion.js";
import { useSavedNews } from "../context/SavedNewsContext.jsx";

const editorial = allContent.editorial;
const commentsAndColumns = allContent.commentAndColumns;

function getSaveId(rawId) {
  if (rawId == null || rawId === "") return "";
  const s = String(rawId);
  return s.startsWith("opinion-") ? s : `opinion-${s}`;
}

function createOpinionArticle({
  id,
  title,
  img,
  author,
  message,
  keypoints,
  date,
  profilepic,
}) {
  const body = message || title;
  const authorProfile = commentsAndColumns.find((item) => item.author === author);
  const saveId = getSaveId(id);
  return {
    id: saveId,
    opinionId: id,
    headline: title,
    body,
    keypoints: keypoints || [],
    img,
    author,
    source: author,
    designation: "કૉલમ લેખક",
    cat: "ઓપીનિયન",
    time: date,
    authorId: String(authorProfile?.id || 1),
    authorProfilePic: authorProfile?.profilepic || profilepic,
  };
}

function getSummary(html = "") {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > 180 ? text.slice(0, 180) + "..." : text;
}

function RedDots() {
  return (
    <span className="flex shrink-0 items-center gap-0.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26] sm:h-2 sm:w-2" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/75 sm:h-2 sm:w-2" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/50 sm:h-2 sm:w-2" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#D61F26]/25 sm:h-2 sm:w-2" />
    </span>
  );
}

function SectionTitle({ title, showDots = false, className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <h2 className="font-gu text-[20px] font-bold leading-none tracking-tight text-[#e48d0b] sm:text-[24px] md:text-[26px]">
        {title}
      </h2>
      {showDots && <RedDots />}
    </div>
  );
}

/* ---------- COLUMN 1 : Editorial ---------- */

function EditorialCard({ selected, onOpen }) {
  const { isSaved, toggleSave } = useSavedNews();
  const article = createOpinionArticle({
    id: selected.id,
    img: selected.image,
    author: selected.author,
    title: selected.title,
    message: selected.body,
    keypoints: selected.keypoints,
    date: selected.date,
    profilepic: selected.profilepic,
  });

  const saveId = getSaveId(selected.id);
  const isBookmarked =
    isSaved(saveId) || isSaved(String(selected.id)) || isSaved(article.id);

  const summary = getSummary(selected.body);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave({
      ...article,
      id: saveId,
      opinionId: selected.id,
    });
  };

  return (
    <article
      onClick={() => onOpen(article)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(article);
      }}
      className="group flex cursor-pointer flex-col transition-transform duration-300 ease-out hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden rounded-[7px]">
        <Link
          to={`/opinion/${selected.id}`}
          onClick={(e) => {
            e.preventDefault();
            onOpen(article);
          }}
          className="block overflow-hidden rounded-[7px]"
          aria-label="એડિટોરિયલ વાંચો"
        >
          <img
            src={selected.image}
            alt=""
            className="aspect-[16/9] w-full object-cover sm:aspect-[739/415]"
          />
        </Link>
        <button
          type="button"
          aria-label={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          onClick={handleBookmark}
          className={`absolute right-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 sm:right-3 sm:top-3 sm:h-8 sm:w-8 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Bookmark
            size={16}
            className="sm:h-4 sm:w-4"
            fill={isBookmarked ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="mt-2 text-center sm:mt-3">
        <h3 className="line-clamp-3 !h-auto !min-h-0 font-gu text-[20px] font-normal leading-snug text-ink sm:text-[24px] md:text-[28px] dark:text-ink-dark">
          {selected.title}
        </h3>
        <p className="mt-1.5 font-gu text-[15px] font-bold leading-none text-ink/60 sm:mt-2 sm:text-[18px] md:text-[20px] dark:text-ink-dark/60">
          {selected.date}
        </p>
      </div>

      <p className="mt-3 max-h-[120px] overflow-hidden text-center font-gu text-[16px] font-normal leading-snug text-ink/60 [mask-image:linear-gradient(to_bottom,black_62%,transparent_100%)] sm:mt-4 sm:max-h-[145px] sm:text-[20px] md:text-[24px] dark:text-ink-dark/60">
        {summary}
      </p>

      <div className="mt-4 flex flex-col items-center sm:mt-5">
        <Link
          to={`/opinion/${selected.id}`}
          onClick={(e) => {
            e.preventDefault();
            onOpen(article);
          }}
          className="inline-flex items-center gap-1 font-gu text-[15px] font-bold text-ink sm:text-[17px] dark:text-ink-dark"
        >
          વધુ વાંચો <ArrowRight size={14} />
        </Link>
        <span
          className="mt-1 h-[3px] w-[88px] bg-[#FFAD15] sm:w-[104px]"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}

function TextStory({ articleData, onOpen }) {
  const article = createOpinionArticle({
    id: articleData.id,
    title: articleData.title,
    author: articleData.author,
    message: articleData.body,
    keypoints: articleData.keypoints,
    date: articleData.date,
    img: articleData.image,
    profilepic: articleData.profilepic,
  });

  return (
    <article
      className="flex cursor-pointer flex-col"
      onClick={() => onOpen(article)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(article);
      }}
    >
      <div className="group text-center transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
        <h4 className="line-clamp-2 !h-auto !min-h-0 font-gu text-[18px] font-normal leading-snug text-ink sm:text-[22px] md:text-[24px] dark:text-ink-dark">
          {articleData.title}
        </h4>
        <span className="mt-1 block font-gu text-[14px] font-bold leading-none text-ink/60 sm:mt-1.5 sm:text-[17px] dark:text-ink-dark/60">
          {articleData.date}
        </span>
        <span
          className="mx-auto mt-2 block h-[3px] w-[88px] bg-[#FFAD15] sm:w-[104px]"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}

function useEditorialVisibleCount() {
  const [count, setCount] = useState(Infinity);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCount(3);
      else if (w < 768) setCount(5);
      else setCount(Infinity);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

function LeftColumn({ onOpen }) {
  const hero = editorial.find((item) => item.isHero) || editorial[0];
  const rest = editorial.filter((item) => item !== hero && !item.isHero);
  const allItems = hero ? [hero, ...rest] : rest;

  const visibleCount = useEditorialVisibleCount();
  const [expanded, setExpanded] = useState(false);

  const limit =
    expanded || visibleCount === Infinity ? allItems.length : visibleCount;
  const shown = allItems.slice(0, limit);
  const hasMore = allItems.length > visibleCount && visibleCount !== Infinity;

  const heroItem = shown[0];
  const textItems = shown.slice(1);

  return (
    <div className="flex min-w-0 flex-col">
      <SectionTitle
        title="એડિટોરિયલ"
        showDots
        className="mb-3 justify-start sm:mb-4"
      />

      {heroItem && <EditorialCard selected={heroItem} onOpen={onOpen} />}

      <div className="flex flex-col gap-4 pt-5 sm:gap-5 sm:pt-6">
        {textItems.map((articleData) => (
          <TextStory
            key={articleData.id}
            articleData={articleData}
            onOpen={onOpen}
          />
        ))}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mx-auto mt-4 flex h-8 w-8 cursor-pointer items-center justify-center text-[#D9A900] transition-colors hover:text-[#FFAD15] md:hidden"
          aria-label={expanded ? "ઓછા બતાવો" : "વધુ એડિટોરિયલ જુઓ"}
          aria-expanded={expanded}
        >
          <ChevronDown
            size={18}
            strokeWidth={2.5}
            className={`transition-transform duration-300 ease-out ${
              expanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      )}
    </div>
  );
}

/* ---------- COLUMN 2 : photo cards ---------- */

function PhotoCard({
  id,
  img,
  title,
  avatar,
  author,
  message,
  keypoints,
  date,
  onOpen,
}) {
  const { isSaved, toggleSave } = useSavedNews();
  const article = createOpinionArticle({
    id,
    title,
    img,
    author,
    message,
    keypoints,
    date,
  });

  const saveId = getSaveId(id);
  const isBookmarked =
    isSaved(saveId) || isSaved(String(id)) || isSaved(article.id);

  const authorProfile = commentsAndColumns.find((item) => item.author === author);

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave({
      ...article,
      id: saveId,
      opinionId: id,
    });
  };

  return (
    <article className="group">
      <div className="relative transition-transform duration-300 ease-out group-hover:-translate-y-0.5">
        <Link
          to={`/opinion/${id}`}
          onClick={(e) => {
            e.preventDefault();
            onOpen(article);
          }}
          className="block overflow-hidden rounded-[7px]"
          aria-label="લેખ વાંચો"
        >
          <img
            src={img}
            alt=""
            className="aspect-[16/9] w-full object-cover sm:aspect-[199/113]"
          />
        </Link>
        <button
          type="button"
          onClick={handleBookmark}
          aria-label={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          title={isBookmarked ? "સેવ થયેલ છે" : "સેવ કરો"}
          className={`absolute right-2 top-2 z-10 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full backdrop-blur-md transition-all duration-200 active:scale-90 sm:right-3 sm:top-3 sm:h-8 sm:w-8 ${
            isBookmarked
              ? "bg-[#e48d0b] text-white dark:bg-[#e6c27a] dark:text-black"
              : "bg-black/40 text-white hover:bg-black/60"
          }`}
        >
          <Bookmark
            size={15}
            className="sm:h-4 sm:w-4"
            fill={isBookmarked ? "currentColor" : "none"}
          />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onOpen(article)}
        className="mt-2 line-clamp-3 !h-auto !min-h-0 text-left font-gu text-[16px] font-normal leading-snug text-ink transition-colors sm:text-[18px] md:text-[20px] dark:text-ink-dark"
      >
        {title}
      </button>

      <div className="mt-1.5">
        <Link
          to={`/opinion/author/${authorProfile?.id || "4"}`}
          onClick={(e) => e.stopPropagation()}
          className="flex w-fit items-center gap-2"
          aria-label={`${author} નું પ્રોફાઇલ ખોલો`}
        >
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-black/10 sm:h-9 sm:w-9 dark:border-white/10">
            <img
              src={avatar}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          </span>
          <div className="min-w-0">
            <span className="block truncate font-gu text-[14px] font-semibold leading-none text-[#e48d0b] sm:text-[15px]">
              {author}
            </span>
            {date && (
              <p className="mt-0.5 font-gu text-[12px] font-medium leading-none text-ink/55 sm:text-[14px] dark:text-ink-dark/55">
                {date}
              </p>
            )}
          </div>
        </Link>
      </div>
    </article>
  );
}

function MidColumn({ cards, onOpen }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-6">
      {cards.map((c, i) => (
        <PhotoCard key={c.id ?? i} {...c} onOpen={onOpen} />
      ))}
    </div>
  );
}

const allPhotoCards = commentsAndColumns.map((articleData) => ({
  id: articleData.id,
  img: articleData.image,
  title: articleData.title,
  message: articleData.body,
  keypoints: articleData.keypoints,
  date: articleData.date,
  avatar: articleData.profilepic,
  author: articleData.author,
}));

/* ---------- COLUMN 3 : authors ---------- */

function AuthorsColumn({ selectedId }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const uniqueAuthors = Array.from(
    new Map(commentsAndColumns.map((item) => [item.author, item])).values()
  );
  const visibleAuthors = isExpanded ? uniqueAuthors : uniqueAuthors.slice(0, 3);

  return (
    <div className="flex min-w-0 flex-col">
      <h2 className="font-gu text-[20px] font-bold leading-none tracking-tight text-ink sm:text-[24px] md:text-[26px] dark:text-ink-dark">
        લેખકો
      </h2>
      <div className="mt-3 flex flex-col gap-1 sm:mt-4">
        {visibleAuthors.map((a) => {
          const active = String(a.id) === String(selectedId);
          return (
            <Link
              key={a.author}
              to={`/opinion/author/${a.id}`}
              className={`group flex items-center gap-2 border-b border-transparent pb-2.5 transition-all duration-300 ease-out hover:-translate-y-0.5 sm:pb-3 ${
                active ? "opacity-100" : "opacity-100"
              }`}
            >
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-black/10 sm:h-[30px] sm:w-[30px] dark:border-white/10">
                <img
                  src={a.profilepic}
                  alt=""
                  className="h-full w-full rounded-full object-cover"
                />
              </span>
              <span className="font-gu text-[17px] font-medium leading-none text-ink sm:text-[20px] md:text-[22px] dark:text-ink-dark">
                {a.author}
              </span>
            </Link>
          );
        })}
      </div>
      {uniqueAuthors.length > 3 && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="mx-auto mt-1 flex h-8 w-8 cursor-pointer items-center justify-center text-[#D9A900] transition-colors hover:text-[#FFAD15]"
          aria-label={isExpanded ? "લેખકો છુપાવો" : "વધુ લેખકો જુઓ"}
          aria-expanded={isExpanded}
        >
          <ChevronDown
            size={18}
            strokeWidth={2.5}
            className={`transition-transform duration-300 ease-out ${
              isExpanded ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      )}
    </div>
  );
}

/* ---------- PAGE ---------- */

export default function OpinionPage() {
  const navigate = useNavigate();
  const { id: opinionId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("author");

  const openOpinion = (article) => {
    if (article?.opinionId) {
      navigate(`/opinion/${article.opinionId}`);
    }
  };

  const selectedArticle = opinionId
    ? commentsAndColumns.find((item) => String(item.id) === String(opinionId)) ||
      editorial.find((item) => String(item.id) === String(opinionId))
    : null;

  if (opinionId) {
    const article = selectedArticle
      ? createOpinionArticle({
          id: selectedArticle.id,
          title: selectedArticle.title,
          img: selectedArticle.image,
          author: selectedArticle.author,
          message: selectedArticle.body,
          keypoints: selectedArticle.keypoints,
          date: selectedArticle.date,
          profilepic: selectedArticle.profilepic,
        })
      : null;

    return (
      <MainGrid>
        <OpinionDetailPanel
          article={article}
          onClose={() => {
            window.__gmModalState = null;
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate("/opinion");
            }
          }}
        />
      </MainGrid>
    );
  }

  return (
    <MainGrid>
      <div className="mx-auto w-full px-0 pb-8 sm:pb-12">
        <div
          className="
            rounded-none border-0 bg-transparent p-0 shadow-none
            sm:rounded-3xl sm:border sm:border-black/5 sm:bg-white sm:p-4
            sm:shadow-[0_10px_30px_rgba(0,0,0,0.07)]
            md:p-5 lg:p-6
            dark:sm:border-white/10 dark:sm:bg-[#121212]
          "
        >
          <div className="grid grid-cols-1 gap-x-5 gap-y-8 md:grid-cols-2 md:gap-y-6 xl:grid-cols-[1fr_1.4fr_0.5fr] xl:gap-x-6">
            <div className="md:col-span-2 xl:col-span-1">
              <LeftColumn onOpen={openOpinion} />
            </div>

            <div className="md:col-span-2 xl:col-span-1">
              <SectionTitle
                title="કૉમેન્ટ્સ અને કોલમ્સ"
                showDots
                className="mb-3 justify-start sm:mb-4"
              />
              <MidColumn cards={allPhotoCards} onOpen={openOpinion} />
            </div>

            <div className="md:col-span-2 xl:col-span-1">
              <AuthorsColumn selectedId={selectedId} />
            </div>
          </div>
        </div>
      </div>
    </MainGrid>
  );
}