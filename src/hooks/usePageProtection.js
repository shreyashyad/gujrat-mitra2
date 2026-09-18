import { useEffect } from "react";

/**
 * Weak client-side protections:
 * - Disable right-click
 * - Block common DevTools / view-source shortcuts
 * - Disable text selection
 * - Basic DevTools detection (very easy to bypass)
 *
 * This does NOT stop screenshots or screen recording.
 */
export function usePageProtection({
  disableRightClick = true,
  disableShortcuts = true,
  disableSelection = true,
  detectDevTools = true,
} = {}) {
  useEffect(() => {
    // ---------- Right Click ----------
    const handleContextMenu = (e) => {
      if (disableRightClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // ---------- Keyboard Shortcuts ----------
    const handleKeyDown = (e) => {
      if (!disableShortcuts) return;

      const key = e.key?.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      // F12
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C
      if (ctrl && shift && (key === "i" || key === "j" || key === "c")) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl+U (view source)
      if (ctrl && key === "u") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl+S (save page)
      if (ctrl && key === "s") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Ctrl+Shift+K (Firefox console)
      if (ctrl && shift && key === "k") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    };

    // ---------- Text Selection ----------
    const handleSelectStart = (e) => {
      if (disableSelection) {
        e.preventDefault();
      }
    };

    // ---------- Basic DevTools Detection ----------
    let devToolsInterval = null;
    if (detectDevTools) {
      const threshold = 160;
      devToolsInterval = setInterval(() => {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
          // Optional: you can blank the page or redirect
          // document.body.innerHTML = "<h1 style='text-align:center;margin-top:20vh'>Access Denied</h1>";
          // or just console warn
          console.clear();
        }
      }, 1000);
    }

    // Attach listeners
    document.addEventListener("contextmenu", handleContextMenu, true);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("selectstart", handleSelectStart, true);

    // CSS for selection (extra safety)
    if (disableSelection) {
      document.body.style.userSelect = "none";
      document.body.style.webkitUserSelect = "none";
      document.body.style.msUserSelect = "none";
    }

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu, true);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("selectstart", handleSelectStart, true);

      if (disableSelection) {
        document.body.style.userSelect = "";
        document.body.style.webkitUserSelect = "";
        document.body.style.msUserSelect = "";
      }

      if (devToolsInterval) clearInterval(devToolsInterval);
    };
  }, [disableRightClick, disableShortcuts, disableSelection, detectDevTools]);
}