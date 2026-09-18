import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MainGrid from "../components/layout/MainGrid.jsx";
import CharchapatraLanding from "../components/charchapatra/CharchapatraLanding.jsx";
import { useCharchaPatraDetail } from "../context/CharchaPatraDetailContext.jsx";
import { charchaPatroData } from "../data/CharchaPatroData.js";

export default function CharchaPatra() {
  const { id } = useParams();
  const { activeItem, openDetail, closeDetail } = useCharchaPatraDetail();

  // When URL has /charcha-patra/:id → open that article
  useEffect(() => {
    if (id) {
      const found = charchaPatroData.find(
        (item) => String(item.id) === String(id)
      );
      if (found) {
        openDetail(found);
      }
    } else {
      closeDetail(window.location.pathname);
    }
  }, [id]);

  return (
    <MainGrid>
      <div className="w-full flex flex-col space-y-6">
        {/* Page Title - only show when no article is open */}
        {!activeItem && (
          <div className="mb-6 inline-block">
            <h1 className="font-gu flex items-center gap-x-3 text-2xl font-bold text-[#e48d0b] sm:text-3xl">
              ચર્ચાપત્રો
              <span className="mb-1 flex items-center gap-0.5">
                <span className="h-2 w-2 rounded-full bg-[#D61F26]" />
                <span className="h-2 w-2 rounded-full bg-[#D61F26]/75" />
                <span className="h-2 w-2 rounded-full bg-[#D61F26]/50" />
                <span className="h-2 w-2 rounded-full bg-[#D61F26]/25" />
              </span>
            </h1>
          </div>
        )}

        {/* Show Detail Panel OR Landing */}
        {!activeItem && (
          <CharchapatraLanding />
        )}
      </div>
    </MainGrid>
  );
}