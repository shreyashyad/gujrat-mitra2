import { getFillerArticles } from "../../data/articles.js";
import { FillerCard } from "./HomeFiller1.jsx";

export default function HomeFiller4() {
  const items = getFillerArticles().slice(18, 24);

  if (!items.length) return null;

  return (
    <section className="mt-6 md:hidden">
      <div className="flex flex-col">
        {items.map((article) => (
          <FillerCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}