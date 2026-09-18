// src/data/aapniAajData.js

export const CITY_DATA = {
  સુરત: {
    sunriseMin: 6 * 60 + 12,
    sunsetMin: 19 * 60 + 24,
    sunriseStr: "૦૬:૧૨ AM",
    sunsetStr: "૦૭:૨૪ PM",
    moonriseMin: 19 * 60 + 20,
    moonsetMin: 6 * 60 + 5,
    moonriseStr: "૦૭:૨૦ PM",
    moonsetStr: "૦૬:૦૫ AM",
    lat: 21.17,
    lon: 72.83,
  },
  અમદાવાદ: {
    sunriseMin: 6 * 60 + 7,
    sunsetMin: 19 * 60 + 28,
    sunriseStr: "૦૬:૦૭ AM",
    sunsetStr: "૦૭:૨૮ PM",
    moonriseMin: 19 * 60 + 15,
    moonsetMin: 6 * 60 + 1,
    moonriseStr: "૦૭:૧૫ PM",
    moonsetStr: "૦૬:૦૧ AM",
    lat: 23.02,
    lon: 72.57,
  },
  વડોદરા: {
    sunriseMin: 6 * 60 + 9,
    sunsetMin: 19 * 60 + 26,
    sunriseStr: "૦૬:૦૯ AM",
    sunsetStr: "૦૭:૨૬ PM",
    moonriseMin: 19 * 60 + 17,
    moonsetMin: 6 * 60 + 3,
    moonriseStr: "૦૭:૧૭ PM",
    moonsetStr: "૦૬:૦૩ AM",
    lat: 22.3,
    lon: 73.19,
  },
  રાજકોટ: {
    sunriseMin: 6 * 60 + 15,
    sunsetMin: 19 * 60 + 27,
    sunriseStr: "૦૬:૧૫ AM",
    sunsetStr: "૦૭:૨૭ PM",
    moonriseMin: 19 * 60 + 23,
    moonsetMin: 6 * 60 + 8,
    moonriseStr: "૦૭:૨૩ PM",
    moonsetStr: "૦૬:૦૮ AM",
    lat: 22.3,
    lon: 70.8,
  },
  ભાવનગર: {
    sunriseMin: 6 * 60 + 13,
    sunsetMin: 19 * 60 + 25,
    sunriseStr: "૦૬:૧૩ AM",
    sunsetStr: "૦૭:૨૫ PM",
    moonriseMin: 19 * 60 + 21,
    moonsetMin: 6 * 60 + 6,
    moonriseStr: "૦૭:૨૧ PM",
    moonsetStr: "૦૬:૦૬ AM",
    lat: 21.76,
    lon: 72.15,
  },
};

export const CITY_OPTIONS = Object.keys(CITY_DATA);

export const RASHI_LIST = [
  { sym: "♈", name: "મેષ" },
  { sym: "♉", name: "વૃષભ" },
  { sym: "♊", name: "મિથુન" },
  { sym: "♋", name: "કર્ક" },
  { sym: "♌", name: "સિંહ" },
  { sym: "♍", name: "કન્યા" },
  { sym: "♎", name: "તુલા" },
  { sym: "♏", name: "વૃશ્ચિક" },
  { sym: "♐", name: "ધન" },
  { sym: "♑", name: "મકર" },
  { sym: "♒", name: "કુંભ" },
  { sym: "♓", name: "મીન" },
];

export const RASHI_TIPS_DAILY = [
  "આજે નવા કાર્યોની શરૂઆત માટે શુભ દિવસ છે.",
  "આર્થિક બાબતોમાં સાવચેતી રાખવી હિતાવહ છે.",
  "મિત્રો સાથે સમય પસાર કરવાની તક મળશે.",
  "કૌટુંબિક બાબતોમાં ધ્યાન આપવાની જરૂર છે.",
  "કારકિર્દીમાં સારા સમાચાર મળી શકે છે.",
  "સ્વાસ્થ્યનું ધ્યાન રાખવું જરૂરી છે.",
  "સંબંધોમાં મીઠાશ જળવાઈ રહેશે.",
  "ધીરજ રાખવાથી કાર્ય સફળ થશે.",
  "મુસાફરીના યોગ બની શકે છે.",
  "વ્યવસાયમાં પ્રગતિની શક્યતા છે.",
  "નવા સંપર્કો લાભદાયી રહેશે.",
  "આધ્યાત્મિક બાબતોમાં રસ વધશે.",
];

export const RASHI_TIPS_WEEKLY = [
  "આ સપ્તાહે કારકિર્દીમાં નવી તકો મળી શકે છે.",
  "આર્થિક આયોજન પર વિશેષ ધ્યાન આપવું પડશે.",
  "સામાજિક સંબંધોમાં સુધારો જોવા મળશે.",
  "સ્વાસ્થ્ય પ્રત્યે સભાનતા રાખવી જરૂરી છે.",
  "વ્યવસાયમાં પ્રગતિના સંકેત મળશે.",
  "કૌટુંબિક જવાબદારીઓ વધી શકે છે.",
  "નાણાકીય લેવડદેવડમાં સાવચેતી રાખવી.",
  "નવા સંબંધો બંધાવવાની શક્યતા છે.",
  "મુસાફરીના યોગ બની શકે છે.",
  "મહેનતનું યોગ્ય પરિણામ મળશે.",
  "સર્જનાત્મક કાર્યોમાં સફળતા મળશે.",
  "મનની શાંતિ માટે ધ્યાન કરવું લાભદાયી રહેશે.",
];

export const RASHI_TIPS_YEARLY = [
  "આ વર્ષે કારકિર્દી અને વ્યવસાયમાં મોટી તકો સાંપડશે.",
  "આર્થિક સ્થિરતા તરફ વર્ષ સાનુકૂળ રહેશે.",
  "શિક્ષણ અને જ્ઞાનવૃદ્ધિ માટે વર્ષ ઉત્તમ છે.",
  "કૌટુંબિક સુખાકારીમાં વધારો થશે.",
  "નેતૃત્વ ક્ષમતામાં વધારો અને માન-સન્માન મળશે.",
  "સ્વાસ્થ્ય અને દિનચર્યામાં સુધારો કરવો લાભદાયી રહેશે.",
  "સંબંધો અને ભાગીદારીમાં સંતુલન જળવાશે.",
  "પરિવર્તનનું વર્ષ, નવી શરૂઆતો માટે શુભ.",
  "ઉચ્ચ શિક્ષણ અને વિદેશ યાત્રાના યોગ છે.",
  "મહેનત અને ધીરજથી મોટી સફળતા મળશે.",
  "નવીન વિચારો અને ટેક્નોલોજી ક્ષેત્રે પ્રગતિ થશે.",
  "આધ્યાત્મિક વિકાસ અને આંતરિક શાંતિનું વર્ષ.",
];

export const MARRIAGE_MUHURATS = [
  { date: "૧૫ જાન્યુઆરી", label: "શુભ મુહૂર્ત" },
  { date: "૨૯ જાન્યુઆરી", label: "શુભ મુહૂર્ત" },
  { date: "૧૨ ફેબ્રુઆરી", label: "શુભ મુહૂર્ત" },
  { date: "૨૨ એપ્રિલ", label: "શુભ મુહૂર્ત" },
  { date: "૬ મે", label: "શુભ મુહૂર્ત" },
  { date: "૨૯ નવેમ્બર", label: "શુભ મુહૂર્ત" },
  { date: "૫ ડિસેમ્બર", label: "શુભ મુહૂર્ત" },
];

export const JANOI_MUHURATS = [
  { date: "૨૭ જાન્યુઆરી", label: "શુભ મુહૂર્ત" },
  { date: "૧૮ ફેબ્રુઆરી", label: "શુભ મુહૂર્ત" },
  { date: "૩ મે", label: "શુભ મુહૂર્ત" },
  { date: "૧૩ મે", label: "શુભ મુહૂર્ત" },
  { date: "૨૫ નવેમ્બર", label: "શુભ મુહૂર્ત" },
];

export const FESTIVAL_LIST = [
  { date: "૧૪ જાન્યુઆરી", label: "મકરસંક્રાંતિ" },
  { date: "૩ માર્ચ", label: "હોળી" },
  { date: "૨૬ માર્ચ", label: "રામનવમી" },
  { date: "૨૦ એપ્રિલ", label: "અક્ષય તૃતીયા" },
  { date: "૧૦ જુલાઈ", label: "ગુરુ પૂર્ણિમા" },
  { date: "૨૮ ઓગસ્ટ", label: "રક્ષાબંધન" },
  { date: "૪ સપ્ટેમ્બર", label: "જન્માષ્ટમી" },
  { date: "૧૧ ઓક્ટોબર", label: "નવરાત્રી શરૂ" },
  { date: "૨૦ ઓક્ટોબર", label: "દશેરા" },
  { date: "૮ નવેમ્બર", label: "દિવાળી" },
];

export const SHUBH_DIVAS_LIST = [
  { date: "૨૩ જાન્યુઆરી", label: "વસંત પંચમી" },
  { date: "૨૦ એપ્રિલ", label: "અક્ષય તૃતીયા" },
  { date: "૯ ઓગસ્ટ", label: "નાગ પંચમી" },
  { date: "૨૭ ઓગસ્ટ", label: "ગણેશ ચતુર્થી" },
  { date: "૫ નવેમ્બર", label: "ધનતેરસ" },
  { date: "૯ નવેમ્બર", label: "ભાઈબીજ" },
];

export const PUBLIC_HOLIDAYS = [
  {
    date: "૧૫ ઓગસ્ટ",
    name: "સ્વતંત્રતા દિવસ",
    states: ["ગુજરાતમાં", "મહારાષ્ટ્રમાં"],
    marketClosed: true,
  },
  {
    date: "૨ ઓક્ટોબર",
    name: "ગાંધી જયંતિ",
    states: ["ગુજરાતમાં", "મહારાષ્ટ્રમાં"],
    marketClosed: true,
  },
  {
    date: "૧૪ જાન્યુઆરી",
    name: "ઉત્તરાયણ",
    states: ["ગુજરાતમાં"],
    marketClosed: false,
  },
  {
    date: "૧૭ સપ્ટેમ્બર",
    name: "ગણેશ ચતુર્થી",
    states: ["મહારાષ્ટ્રમાં"],
    marketClosed: true,
  },
  {
    date: "૧ મે",
    name: "ગુજરાત સ્થાપના દિવસ / મહારાષ્ટ્ર દિવસ",
    states: ["ગુજરાતમાં", "મહારાષ્ટ્રમાં"],
    marketClosed: true,
  },
  {
    date: "૮ નવેમ્બર",
    name: "દિવાળી (લક્ષ્મી પૂજન)",
    states: ["ગુજરાતમાં", "મહારાષ્ટ્રમાં"],
    marketClosed: true,
  },
];

export const HISTORY_TODAY = {
  date: "૨ સપ્ટેમ્બર",
  events: [
    {
      year: "૧૯૪૭",
      text: "સ્વતંત્રતા બાદ નવા શાસનતંત્ર અને વહીવટી વ્યવસ્થાના નિર્માણની શરૂઆત થઈ.",
    },
    {
      year: "૧૯૬૯",
      text: "ગુજરાત સહિત દેશના વિવિધ વિસ્તારોમાં સામાજિક અને આર્થિક સુધારાઓ અંગે ચર્ચાઓને વેગ મળ્યો. શિક્ષણ અને સમાજના વિકાસ સાથે જોડાયેલા મુદ્દાઓ પર ખાસ ધ્યાન અપાયું.",
    },
    {
      year: "૨૦૦૮",
      text: "વૈશ્વિક નાણાકીય કટોકટીની અસર અનેક દેશોના અર્થતંત્ર પર જોવા મળી. શેરબજારોમાં અસ્થિરતા અને બેન્કિંગ ક્ષેત્રમાં મુશ્કેલીઓ ઊભી થઈ.",
    },
  ],
};

export const LUCKY_COLOR_NUMBER = {
  color: "પીળો / સોનેરી",
  number: "૩, ૭, ૧૨",
};

export const GRAHAN_LIST = [
  {
    label: "આગામી ગ્રહણ",
    value: "ચંદ્રગ્રહણ — ૧૮ ઓગસ્ટ ૨૦૨૬",
  },
  {
    label: "પ્રકાર",
    value: "આંશિક ચંદ્રગ્રહણ",
  },
];

export const PANOTI_LIST = [
  {
    label: "શનિ પનોતિ (સાડાસાતી)",
    value: "હાલમાં મકર, કુંભ અને મીન રાશિ પર અસર",
  },
  {
    label: "શનિ ઢૈયા",
    value: "વૃષભ અને તુલા રાશિ પર અસર",
  },
];

export const AQI_DATA = [
  {
    label: "હવાની ગુણવત્તા (AQI) — સુરત",
    value: "૭૮",
    emoji: "🌬️",
    status: "મધ્યમ",
  },
  {
    label: "હવાની ગુણવત્તા (AQI) — અમદાવાદ",
    value: "૯૨",
    emoji: "🌬️",
    status: "મધ્યમ",
  },
  {
    label: "હવાની ગુણવત્તા (AQI) — વડોદરા",
    value: "૮૫",
    emoji: "🌬️",
    status: "મધ્યમ",
  },
  {
    label: "હવાની ગુણવત્તા (AQI) — રાજકોટ",
    value: "૬૫",
    emoji: "🌬️",
    status: "સારું",
  },
  {
    label: "હવાની ગુણવત્તા (AQI) — ભાવનગર",
    value: "૭૧",
    emoji: "🌬️",
    status: "મધ્યમ",
  },
];

export const HUMIDITY_DATA = [
  {
    label: "ભેજ (Humidity) — સુરત",
    value: "૬૮%",
    emoji: "💧",
    status: "સામાન્ય",
  },
  {
    label: "ભેજ (Humidity) — અમદાવાદ",
    value: "૫૫%",
    emoji: "💧",
    status: "સામાન્ય",
  },
  {
    label: "ભેજ (Humidity) — વડોદરા",
    value: "૬૨%",
    emoji: "💧",
    status: "સામાન્ય",
  },
  {
    label: "ભેજ (Humidity) — રાજકોટ",
    value: "૪૮%",
    emoji: "💧",
    status: "સુકું",
  },
  {
    label: "ભેજ (Humidity) — ભાવનગર",
    value: "૭૨%",
    emoji: "💧",
    status: "વધુ",
  },
];

export const DAY_STATUS = {
  સુરત: { value: "શુભ", emoji: "✅", nature: "good" },
  અમદાવાદ: { value: "શુભ", emoji: "✅", nature: "good" },
  વડોદરા: { value: "મધ્યમ", emoji: "⚖️", nature: "neutral" },
  રાજકોટ: { value: "અશુભ", emoji: "⚠️", nature: "bad" },
  ભાવનગર: { value: "શુભ", emoji: "✅", nature: "good" },
};

// ========== DATA FOR WIREFRAME LAYOUT ==========
export const TEMP_DATA = {
  સુરત: { value: "૩૨°C", emoji: "🌡️" },
  અમદાવાદ: { value: "૩૪°C", emoji: "🌡️" },
  વડોદરા: { value: "૩૩°C", emoji: "🌡️" },
  રાજકોટ: { value: "૩૧°C", emoji: "🌡️" },
  ભાવનગર: { value: "૩૨°C", emoji: "🌡️" },
};

export const RAIN_DATA = {
  સુરત: { value: "૪૦%", emoji: "🌧️" },
  અમદાવાદ: { value: "૨૫%", emoji: "🌧️" },
  વડોદરા: { value: "૩૫%", emoji: "🌧️" },
  રાજકોટ: { value: "૧૫%", emoji: "🌧️" },
  ભાવનગર: { value: "૪૫%", emoji: "🌧️" },
};

export const ISLAMIC_DATA = {
  date: "૧૦ રબી ઉલ અવ્વલ ૧૪૪૮",
  day: "મંગળવાર",
};

export const PARSI_DATA = {
  date: "૧૨ શહરેવર ૧૩૯૫",
  day: "મંગળવાર",
};

export const AYAN_DATA = {
  value: "દક્ષિણાયન",
  emoji: "🧭",
};

// ========== NEW: right-side headings on the "આજનો દિવસ" card ==========
// હિન્દુ પંચાંગ — the day's festival/observance name
// પક્ષ — the current lunar fortnight (waxing/waning)
export const PANCHANG_HEADINGS = {
  paksha: "શુક્લ પક્ષ",
};

export const GU_MONTHS = [
  "જાન્યુઆરી",
  "ફેબ્રુઆરી",
  "માર્ચ",
  "એપ્રિલ",
  "મે",
  "જૂન",
  "જુલાઈ",
  "ઓગસ્ટ",
  "સપ્ટેમ્બર",
  "ઓક્ટોબર",
  "નવેમ્બર",
  "ડિસેમ્બર",
];

export const GU_DAYS = [
  "રવિવાર",
  "સોમવાર",
  "મંગળવાર",
  "બુધવાર",
  "ગુરુવાર",
  "શુક્રવાર",
  "શનિવાર",
];

export const RAHU_SEGMENT_BY_WEEKDAY = {
  0: 8,
  1: 2,
  2: 7,
  3: 5,
  4: 6,
  5: 4,
  6: 3,
};

export const CHOGH_ROTATION = [
  "Udveg",
  "Chal",
  "Labh",
  "Amrit",
  "Kaal",
  "Shubh",
  "Rog",
];
export const CHOGH_DAY_START = [
  "Udveg",
  "Amrit",
  "Rog",
  "Labh",
  "Shubh",
  "Chal",
  "Kaal",
];
export const CHOGH_NIGHT_START = [
  "Shubh",
  "Chal",
  "Kaal",
  "Udveg",
  "Amrit",
  "Rog",
  "Labh",
];
export const CHOGH_LABEL_GU = {
  Udveg: "ઉદ્વેગ",
  Chal: "ચલ",
  Labh: "લાભ",
  Amrit: "અમૃત",
  Kaal: "કાળ",
  Shubh: "શુભ",
  Rog: "રોગ",
};
export const CHOGH_NATURE = {
  Udveg: "bad",
  Chal: "neutral",
  Labh: "good",
  Amrit: "good",
  Kaal: "bad",
  Shubh: "good",
  Rog: "bad",
};

export const BIRTHDAY_RASHIFAL = {
  title: "જન્મદિવસ રાશિફળ",
  events: [
    {
      date: "૨ સપ્ટેમ્બર",
      icon: "🎂",
      title: "જો તમારો જન્મદિવસ આજે (૨ સપ્ટેમ્બર) હોય તો...",
      text: "કોઈપણ વર્ષ ૨ સપ્ટેમ્બરએ જન્મેલી વ્યક્તિની રાશિ કર્ક ગણાય છે. આ રાશિના જાતકો સંવેદનશીલ, કલ્પનાશીલ અને પોતાના પરિવાર પ્રત્યે ખૂબ લાગણીશીલ હોય છે. તેઓ સંબંધોને મહત્વ આપે છે અને મુશ્કેલ સમયમાં પોતાના નજીકના લોકોનો સાથ નિભાવવામાં આગળ રહે છે. આ વર્ષે તમારા માટે સંબંધો અને કારકિર્દીમાં નવી તકો ઊભી થઈ શકે છે.",
    },
  ],
};

export const aapniAajData = {
  CITY_DATA,
  CITY_OPTIONS,
  RASHI_LIST,
  RASHI_TIPS_DAILY,
  RASHI_TIPS_WEEKLY,
  RASHI_TIPS_YEARLY,
  MARRIAGE_MUHURATS,
  JANOI_MUHURATS,
  FESTIVAL_LIST,
  SHUBH_DIVAS_LIST,
  PUBLIC_HOLIDAYS,
  HISTORY_TODAY,
  BIRTHDAY_RASHIFAL,
  LUCKY_COLOR_NUMBER,
  GRAHAN_LIST,
  PANOTI_LIST,
  AQI_DATA,
  HUMIDITY_DATA,
  DAY_STATUS,
  TEMP_DATA,
  RAIN_DATA,
  ISLAMIC_DATA,
  PARSI_DATA,
  AYAN_DATA,
  PANCHANG_HEADINGS,
  GU_MONTHS,
  GU_DAYS,
  RAHU_SEGMENT_BY_WEEKDAY,
  CHOGH_ROTATION,
  CHOGH_DAY_START,
  CHOGH_NIGHT_START,
  CHOGH_LABEL_GU,
  CHOGH_NATURE,
};

export const aapniAajSidebarData = {
  date: "૧ સપ્ટેમ્બર ૨૦૨૬, મંગળવાર",
  samvat: "વિક્રમ સંવત ૨૦૮૨ • શુક્લ પક્ષ",
  description: "આજનું પંચાંગ અને રાશિફળ",
  rashi: "મિથુન",
  tithi: "તૃતીયા",
  sunrise: "૦૬:૧૨ AM",
  sunset: "૦૭:૨૪ PM",
  linkText: "વધુ વાંચો",
};

export default aapniAajData;