import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { X, Share, ChevronLeft, ChevronRight } from "lucide-react";
import photoGallery from "../../data/photoGallary.js";
import ShareModal from "../common/ShareModal.jsx";

export default function HomePhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  if (!photoGallery?.length) return null;

  // Resolve number or id → safe index
  const resolveIndex = (val) => {
    if (!photoGallery.length) return 0;
    if (typeof val === "number" && val >= 0 && val < photoGallery.length) {
      return val;
    }
    if (typeof val === "string") {
      const found = photoGallery.findIndex((p) => p.id === val);
      return found >= 0 ? found : 0;
    }
    return 0;
  };

  // Deep-link support
  useEffect(() => {
    const idFromUrl = searchParams.get("photo");
    if (idFromUrl) {
      const idx = resolveIndex(idFromUrl);
      setSelectedIndex(idx);
    }
  }, [searchParams]);

  // Put current photo id into URL
  useEffect(() => {
    if (selectedIndex === null) return;
    const photo = photoGallery[selectedIndex];
    if (!photo?.id) return;

    const next = new URLSearchParams(searchParams);
    next.set("photo", photo.id);
    setSearchParams(next, { replace: true });
  }, [selectedIndex]);

  // Clean URL when closed
  useEffect(() => {
    if (selectedIndex !== null) return;
    const next = new URLSearchParams(searchParams);
    next.delete("photo");
    setSearchParams(next, { replace: true });
  }, [selectedIndex]);

  const handleNext = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev + 1) % photoGallery.length);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev - 1 + photoGallery.length) % photoGallery.length);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShareOpen(true);
  };

  const handleClose = () => {
    setSelectedIndex(null);
    setShareOpen(false);
  };

  // Keyboard + body scroll lock
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  const currentPhoto = selectedIndex !== null ? photoGallery[selectedIndex] : null;

  return (
    <section className="mt-6 md:hidden">
      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-gu text-2xl font-bold text-[#e48d0b]">
          ફોટો ગેલેરી
        </h2>
        <span className="flex items-center gap-0.5">
          <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
          <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
        </span>
      </div>

      {/* Horizontal Scroll Grid */}
      <div className="home-x-scroll flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2
         no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none]">
        {photoGallery.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => setSelectedIndex(index)}
            className="group w-[40vw] sm:w-[200px] shrink-0 snap-start overflow-hidden rounded-xl bg-black/5 dark:bg-white/5 border border-black/[0.03] dark:border-white/[0.03] cursor-pointer"
          >
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={photo.img}
                alt="ફોટો ગેલેરી"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-out scale-106"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Preview Modal */}
      {selectedIndex !== null && currentPhoto && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300"
          onClick={handleClose}
        >
          {/* Top Control Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            <button
              type="button"
              onClick={handleShare}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="શેર કરો"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
            >
              <Share size={18} />
            </button>
            <button
              type="button"
              onClick={handleClose}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="બંધ કરો"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
            {selectedIndex + 1} / {photoGallery.length}
          </div>

          {/* Previous Button */}
          {photoGallery.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              onTouchStart={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="અગાઉનું"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Main Image */}
          <div
            className="relative max-h-[80vh] max-w-[92vw] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentPhoto.img}
              alt="ફોટો ગેલેરી પ્રિવ્યૂ"
              className="max-h-[80vh] w-full object-contain rounded-2xl"
            />
          </div>

          {/* Next Button */}
          {photoGallery.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              onTouchStart={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="આગળનું"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>
      )}

      {/* ShareModal */}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        title="ફોટો ગેલેરી"
        text={currentPhoto?.caption || currentPhoto?.title || "ફોટો ગેલેરી"}
        url={typeof window !== "undefined" ? window.location.href : ""}
        image={currentPhoto?.img}
      />
    </section>
  );
}