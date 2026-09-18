import suratPreview from "../assets/epaper/21ca97e214.png";
import suratPage from "../assets/epaper/epaperPage.jpg";
import cityA from "../assets/epaper/e2280e3fbd.png";
import cityB from "../assets/epaper/898e36e678.png";

export const EPAPER_PAGE_COUNT = 12;

export const epaperEditions = [
  { id: "surat", name: "સુરત", image: cityA, accent: "current" },
  { id: "navsari-valsad-vapi", name: "નવસારી-વલસાડ-વાપી", image: cityB, accent: "current" },
  { id: "bharuch-bharuch", name: "ભરૂચી-વ્યારા-ભરૂચ", image: cityA, accent: "current" },
  { id: "vadodara", name: "વડોદરા", image: cityB, accent: "current" },
  { id: "navsari-valsad-vapi-2", name: "નવસારી-વલસાડ-વાપી", image: cityA, accent: "current" },
];

export const archiveEditions = [
  "સુરત", "અકબરપુર ચોપડા", "ગોધરા", "દાહોદ",
  "શ્રી ટાઈમ્સ", "સિટી પ્લસ", "સમારી", "રવિવારીય પૂર્તિ",
  "રવિવારીય પૂર્તિ", "બિઝનેસમિત્ર પ્લસ"
].map((name, index) => ({
  id: `archive-${index + 1}`,
  name,
  image: index % 2 ? cityB : cityA,
  accent: "archive",
}));

export const specialEditions = [
  "કલેન્ડર", "નૂતન વર્ષ સ્પે.", "બાય-બાય 2022", "ભવિષ્ય દર્પણ", "વેકેશન 2023"
].map((name, index) => ({
  id: `special-${index + 1}`,
  name,
  image: index % 2 ? cityB : cityA,
  accent: "special",
}));

export const viewerPages = Array.from({ length: EPAPER_PAGE_COUNT }, (_, index) => ({
  number: index + 1,
  thumbnail: suratPreview,
  image: suratPage,
}));

export const currentEdition = {
  id: "surat",
  name: "સુરત",
  date: "૧૭ સપ્ટેમ્બર ૨૦૨૩",
  weekday: "શુક્રવાર",
  publishedLabel: "સપ્ટેમ્બર ૨૦૨૫",
  publishedSubLabel: "મહા સુદ બારસ",
  pages: viewerPages,
};