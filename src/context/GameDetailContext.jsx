import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useSearchParams } from "react-router-dom";
import { GAMES_LIST } from "../data/gamesList.js";
import {
  getQuizQuestions,
  getTriviaQuestions,
} from "../services/newsService.js";
import { useAsyncData } from "../hooks/useAsyncData.js";

const GameDetailContext = createContext(null);

const GAME_PARAM = "game"; // URL ma ?game=quiz

function getScrollY() {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function setScrollY(y) {
  const top = typeof y === "number" ? y : 0;
  const apply = () => {
    window.scrollTo(0, top);
    document.documentElement.scrollTop = top;
    document.body.scrollTop = top;
  };
  apply();
  requestAnimationFrame(() => {
    apply();
    requestAnimationFrame(apply);
  });
  setTimeout(apply, 0);
  setTimeout(apply, 50);
  setTimeout(apply, 120);
}

export function GameDetailProvider({ children }) {
  const { data: quizQuestions } = useAsyncData(getQuizQuestions, []);
  const { data: triviaQuestions } = useAsyncData(getTriviaQuestions, []);

  // Metadata + async loaded questions merge
  const games = GAMES_LIST.map((g) => {
    if (g.id === "quiz") return { ...g, questions: quizQuestions || [] };
    if (g.id === "trivia") return { ...g, questions: triviaQuestions || [] };
    return g;
  });

  const [activeGameId, setActiveGameId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isClosingRef = useRef(false);
  const savedScrollYRef = useRef(0);

  const activeGame = games.find((g) => g.id === activeGameId) || null;

  const resetPlay = useCallback(() => {
    setStep(0);
    setScore(0);
    setAnswered(null);
  }, []);

  // ---------- Open (inline in MainGrid — no body scroll lock) ----------
  const openGame = useCallback(
    (game) => {
      if (!game?.id) return;

      if (!isOpen) {
        savedScrollYRef.current = getScrollY();
      }
      setActiveGameId(game.id);
      setIsOpen(true);
      resetPlay();

      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set(GAME_PARAM, game.id);
          return next;
        },
      );
      setScrollY(0);
    },
    [isOpen, setSearchParams, resetPlay]
  );

  // ---------- Close ----------
  const closeGame = useCallback(() => {
    isClosingRef.current = true;

    const y = savedScrollYRef.current;

    setIsOpen(false);
    setActiveGameId(null);

    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(GAME_PARAM);
        return next;
      },
      { replace: true }
    );

    setScrollY(y);

    setTimeout(() => {
      isClosingRef.current = false;
    }, 50);
  }, [setSearchParams]);

  // ---------- Refresh / direct URL ----------
  useEffect(() => {
    if (isClosingRef.current) return;

    const idFromUrl = searchParams.get(GAME_PARAM);

    if (!idFromUrl) {
      if (isOpen) {
        setIsOpen(false);
        setActiveGameId(null);
        setScrollY(savedScrollYRef.current);
      }
      return;
    }

    const found = GAMES_LIST.find((g) => g.id === idFromUrl);

    if (found) {
      if (activeGameId !== found.id) resetPlay();
      setActiveGameId(found.id);
      setIsOpen(true);
    } else {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete(GAME_PARAM);
          return next;
        },
        { replace: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const questions = activeGame?.questions || [];
  const current = questions[step];
  const isDone = questions.length > 0 && step >= questions.length;

  const selectAnswer = useCallback(
    (idx) => {
      if (answered !== null) return;
      setAnswered(idx);
      if (idx === current?.correct) setScore((s) => s + 1);
    },
    [answered, current]
  );

  const next = useCallback(() => {
    if (step + 1 < questions.length) {
      setStep((s) => s + 1);
      setAnswered(null);
    } else {
      setStep(questions.length);
    }
  }, [step, questions.length]);

  return (
    <GameDetailContext.Provider
      value={{
        games,
        activeGame,
        isOpen,
        openGame,
        closeGame,
        step,
        score,
        answered,
        current,
        questions,
        isDone,
        selectAnswer,
        next,
        restart: resetPlay,
      }}
    >
      {children}
    </GameDetailContext.Provider>
  );
}

export function useGameDetail() {
  const ctx = useContext(GameDetailContext);
  if (!ctx) {
    throw new Error("useGameDetail must be used within GameDetailProvider");
  }
  return ctx;
}