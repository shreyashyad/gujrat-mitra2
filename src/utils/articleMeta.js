const GUJ_TO_ARABIC = {
  "૦": "0", "૧": "1", "૨": "2", "૩": "3", "૪": "4",
  "૫": "5", "૬": "6", "૭": "7", "૮": "8", "૯": "9",
};
const ARABIC_TO_GUJ = Object.fromEntries(
  Object.entries(GUJ_TO_ARABIC).map(([guj, arabic]) => [arabic, guj])
);
export const toGujDigits = (n) => String(n).replace(/[0-9]/g, (d) => ARABIC_TO_GUJ[d]);

export function hoursAgo(timeStr) {
  if (!timeStr) return Infinity;
  const normalized = timeStr.replace(/[૦-૯]/g, (d) => GUJ_TO_ARABIC[d]);
  const match = normalized.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : Infinity;
}

export function getReadTime(article) {
  if (article.read) return article.read;
  const wordCount = (article.body || "").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 150));
  return `${toGujDigits(minutes)} મિનિટ વાંચન`;
}