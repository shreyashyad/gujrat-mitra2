import { articles } from "../data/articles.js";
import { beeps } from "../data/beeps.js";
import { videos } from "../data/videos.js";
import { sportsPointsTable } from "../data/sportsData.js";
import { marketIndices, marketCurrency, marketCommodities } from "../data/markets.js";
import { poll } from "../data/poll.js";
import { quizQuestions, triviaQuestions } from "../data/games.js";
import { rashiList, rashiTips } from "../data/rashi.js";

// ---------------------------------------------------------------------------
// Data-access layer. Every function returns a Promise even though the data
// is static today — that's on purpose. When the real backend is ready, only
// THIS file changes (swap the body for a fetch() call). No component
// anywhere else needs to know or care where the data actually comes from.
//
// VITE_API_BASE_URL unset (default today) → static/local mode.
// VITE_API_BASE_URL set → every function below hits the real API instead.
// ---------------------------------------------------------------------------

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getArticlesByCategory(dataKey) {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/articles?category=${dataKey}`);
    if (!res.ok) throw new Error(`Failed to load articles for ${dataKey}`);
    return res.json();
  }
  return articles[dataKey] || [];
}

export async function getBeeps() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/beeps`);
    if (!res.ok) throw new Error("Failed to load beeps");
    return res.json();
  }
  return beeps;
}

export async function getVideos() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/videos`);
    if (!res.ok) throw new Error("Failed to load videos");
    return res.json();
  }
  return videos;
}

export async function getSportsPointsTable() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/sports/points-table`);
    if (!res.ok) throw new Error("Failed to load points table");
    return res.json();
  }
  return sportsPointsTable;
}

export async function getMarketSnapshot() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/markets/snapshot`);
    if (!res.ok) throw new Error("Failed to load market snapshot");
    return res.json();
  }
  return [...marketIndices, marketCurrency[0], ...marketCommodities.slice(0, 2)];
}

export async function getPoll() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/poll/active`);
    if (!res.ok) throw new Error("Failed to load poll");
    return res.json();
  }
  return poll;
}

export async function getQuizQuestions() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/games/quiz`);
    if (!res.ok) throw new Error("Failed to load quiz questions");
    return res.json();
  }
  return quizQuestions;
}

export async function getTriviaQuestions() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/games/trivia`);
    if (!res.ok) throw new Error("Failed to load trivia questions");
    return res.json();
  }
  return triviaQuestions;
}

export async function getRashi() {
  if (API_BASE) {
    const res = await fetch(`${API_BASE}/aapni-aaj/rashi`);
    if (!res.ok) throw new Error("Failed to load rashi data");
    return res.json();
  }
  return { rashiList, rashiTips };
}

// Article id thi pure articles object mathi article find kare
export async function getArticleById(id) {
  if (!id) return null;

  if (API_BASE) {
    const res = await fetch(`${API_BASE}/articles/${id}`);
    if (!res.ok) return null;
    return res.json();
  }

  // Local static data
  for (const categoryArticles of Object.values(articles)) {
    if (!Array.isArray(categoryArticles)) continue;
    const found = categoryArticles.find((a) => a.id === id);
    if (found) return found;
  }
  return null;
}