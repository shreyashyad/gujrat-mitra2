// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { SavedNewsProvider } from "./context/SavedNewsContext.jsx";
import { FontScaleProvider } from "./context/FontScaleContext.jsx";
import "./index.css";

// Prevent font-zoom flash on first paint
(function applySavedFontScale() {
  try {
    const saved = Number(localStorage.getItem("fontZoom"));
    if (saved && saved >= 80 && saved <= 130) {
      document.documentElement.style.setProperty(
        "--font-scale",
        String(saved / 100)
      );
      document.documentElement.setAttribute("data-font-zoom", String(saved));
    }
  } catch (e) {
    // ignore
  }
})();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <SavedNewsProvider>
            <FontScaleProvider>
              <App />
            </FontScaleProvider>
          </SavedNewsProvider>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);