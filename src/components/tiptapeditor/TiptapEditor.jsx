import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Extension } from "@tiptap/core";

import {
  Undo,
  Redo,
  Bold,
  Italic,
  Strikethrough,
  Code,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  Superscript as SuperIcon,
  Subscript as SubIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  ImagePlus,
  ChevronDown,
  Type,
  Heading,
} from "lucide-react";

/* =========================================================
   Custom FontSize extension
   ========================================================= */
const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) =>
              element.style.fontSize?.replace(/['"]+/g, "") || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
          ({ chain }) =>
            chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
          ({ chain }) =>
            chain()
              .setMark("textStyle", { fontSize: null })
              .removeEmptyTextStyle()
              .run(),
    };
  },
});

const FONT_SIZES = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
];

const HEADING_LEVELS = [1, 2, 3, 4, 5, 6];

const TiptapEditor = ({ content, onChange, isGujarati }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeWord, setActiveWord] = useState("");
  const [popoverPos, setPopoverPos] = useState(null);

  const [headingMenuOpen, setHeadingMenuOpen] = useState(false);
  const [fontSizeMenuOpen, setFontSizeMenuOpen] = useState(false);
  const [fontMenuPos, setFontMenuPos] = useState(null);
  const [headingMenuPos, setHeadingMenuPos] = useState(null);
  const [, setTick] = useState(0);

  const containerRef = useRef(null);
  const headingBtnRef = useRef(null);
  const fontSizeBtnRef = useRef(null);
  const savedSelectionRef = useRef(null);
  const isGujaratiRef = useRef(isGujarati);
  const suggestionsRef = useRef([]);
  const selectedIndexRef = useRef(0);
  const activeWordRef = useRef("");

  useEffect(() => {
    isGujaratiRef.current = isGujarati;
    if (!isGujarati) clearSuggestions();
  }, [isGujarati]);

  useEffect(() => {
    suggestionsRef.current = suggestions;
  }, [suggestions]);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    activeWordRef.current = activeWord;
  }, [activeWord]);

  // Close menus on outside click (ignore the toggle buttons themselves)
  useEffect(() => {
    const handlePointerDown = (event) => {
      const t = event.target;

      const isInsideContainer = containerRef.current?.contains(t);
      const isInsidePopover = t.closest?.(".transliteration-popover");
      const isFontMenu = t.closest?.("[data-font-size-menu]");
      const isHeadingMenu = t.closest?.("[data-heading-menu]");
      const isFontBtn = fontSizeBtnRef.current?.contains(t);
      const isHeadingBtn = headingBtnRef.current?.contains(t);

      if (!isInsideContainer && !isInsidePopover) clearSuggestions();

      if (!isFontMenu && !isFontBtn) {
        setFontSizeMenuOpen(false);
        setFontMenuPos(null);
      }
      if (!isHeadingMenu && !isHeadingBtn) {
        setHeadingMenuOpen(false);
        setHeadingMenuPos(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const clearSuggestions = () => {
    setSuggestions([]);
    setSelectedIndex(0);
    setPopoverPos(null);
    setActiveWord("");
  };

  // Close dropdowns when page / any parent scrolls
  useEffect(() => {
    if (!fontSizeMenuOpen && !headingMenuOpen) return undefined;

    const closeMenus = () => {
      setFontSizeMenuOpen(false);
      setFontMenuPos(null);
      setHeadingMenuOpen(false);
      setHeadingMenuPos(null);
    };

    // capture: true → nested overflow containers પણ catch થાય
    window.addEventListener("scroll", closeMenus, true);
    return () => window.removeEventListener("scroll", closeMenus, true);
  }, [fontSizeMenuOpen, headingMenuOpen]);

  const saveSelection = () => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    savedSelectionRef.current = { from, to };
  };

  const runWithSelection = (commandFn) => {
    if (!editor) return;
    const sel = savedSelectionRef.current;
    let chain = editor.chain().focus();
    if (sel) chain = chain.setTextSelection(sel);
    commandFn(chain).run();
  };

  const fetchSuggestions = async (word) => {
    if (!word || !/^[a-zA-Z]+$/.test(word)) {
      clearSuggestions();
      return;
    }
    try {
      const res = await fetch(
        `https://inputtools.google.com/request?text=${encodeURIComponent(
          word
        )}&itc=gu-t-i0-und&num=5`
      );
      const data = await res.json();
      if (data[0] === "SUCCESS" && data[1]?.[0]?.[1]) {
        setSuggestions(data[1][0][1]);
        setSelectedIndex(0);
        setActiveWord(word);
      }
    } catch (err) {
      console.error("Transliteration error:", err);
    }
  };

  const applySuggestion = (selectedGujaratiWord) => {
    if (
      !editor ||
      !activeWordRef.current ||
      typeof selectedGujaratiWord !== "string"
    )
      return;

    const { state } = editor;
    const { $from } = state.selection;
    const wordStartPos = Math.max(0, $from.pos - activeWordRef.current.length);
    const wordEndPos = $from.pos;

    editor
      .chain()
      .focus()
      .deleteRange({ from: wordStartPos, to: wordEndPos })
      .insertContent(selectedGujaratiWord + " ")
      .run();

    clearSuggestions();
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: HEADING_LEVELS } }),
      Underline,
      Subscript,
      Superscript,
      Image,
      TextStyle,
      FontSize,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "ચર્ચાપત્ર નો લખાણ..." }),
    ],
    content: content || "",
    onTransaction: () => setTick((t) => t + 1),
    editorProps: {
      attributes: {
        class:
          "ProseMirror max-w-none min-h-[180px] font-gu text-[20px] text-ink outline-none focus:outline-none dark:text-ink-dark",
      },
      handleKeyDown: (_view, event) => {
        if (!isGujaratiRef.current || suggestionsRef.current.length === 0) {
          return false;
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestionsRef.current.length - 1 ? prev + 1 : 0
          );
          return true;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestionsRef.current.length - 1
          );
          return true;
        }
        if (event.key === "Enter" || event.key === "Tab" || event.key === " ") {
          event.preventDefault();
          const selectedWord =
            suggestionsRef.current[selectedIndexRef.current];
          if (selectedWord) applySuggestion(selectedWord);
          return true;
        }
        if (event.key === "Escape") {
          event.preventDefault();
          clearSuggestions();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
      if (!isGujaratiRef.current) return;

      const { state, view } = ed;
      const { $from } = state.selection;
      const textBefore = $from.parent.textBetween(0, $from.parentOffset);
      const words = textBefore.split(/\s+/);
      const lastWord = words[words.length - 1];

      if (lastWord && /^[a-zA-Z]+$/.test(lastWord)) {
        const coords = view.coordsAtPos($from.pos);
        const popoverWidth = 280;
        const popoverHeight = 220;

        let left = coords.left;
        const maxLeft = window.innerWidth - popoverWidth - 16;
        left = Math.min(Math.max(16, left), maxLeft);

        const spaceBelow = window.innerHeight - coords.bottom;
        const top =
          spaceBelow < popoverHeight
            ? Math.max(8, coords.top - popoverHeight - 4)
            : coords.bottom + 4;

        setPopoverPos({ top, left });
        fetchSuggestions(lastWord);
      } else {
        clearSuggestions();
      }
    },
  });

  if (!editor) return null;

  const setLink = () => {
    saveSelection();
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      runWithSelection((chain) => chain.extendMarkRange("link").unsetLink());
      return;
    }
    runWithSelection((chain) =>
      chain.extendMarkRange("link").setLink({ href: url })
    );
  };

  const addImage = () => {
    saveSelection();
    const url = window.prompt("Image URL");
    if (url) runWithSelection((chain) => chain.setImage({ src: url }));
  };

  const btn = (active) =>
    `shrink-0 rounded p-1.5 hover:bg-gray-200 cursor-pointer ${active ? "bg-[#e48d0b]/20 text-[#e48d0b]" : ""
    }`;

  const currentHeadingLabel = () => {
    for (const level of HEADING_LEVELS) {
      if (editor.isActive("heading", { level })) return `H${level}`;
    }
    return "Normal";
  };

  const currentFontSize =
    editor.getAttributes("textStyle").fontSize || "Size";

  const toggleFontMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveSelection();
    if (fontSizeMenuOpen) {
      setFontSizeMenuOpen(false);
      setFontMenuPos(null);
      return;
    }
    const rect = fontSizeBtnRef.current.getBoundingClientRect();
    setFontMenuPos({ top: rect.bottom + 4, left: rect.left });
    setFontSizeMenuOpen(true);
    setHeadingMenuOpen(false);
    setHeadingMenuPos(null);
  };

  const toggleHeadingMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    saveSelection();
    if (headingMenuOpen) {
      setHeadingMenuOpen(false);
      setHeadingMenuPos(null);
      return;
    }
    const rect = headingBtnRef.current.getBoundingClientRect();
    setHeadingMenuPos({ top: rect.bottom + 4, left: rect.left });
    setHeadingMenuOpen(true);
    setFontSizeMenuOpen(false);
    setFontMenuPos(null);
  };

  const applyFontSize = (size) => {
    if (size === null) {
      runWithSelection((chain) => chain.unsetFontSize());
    } else {
      runWithSelection((chain) => chain.setFontSize(size));
    }
    setFontSizeMenuOpen(false);
    setFontMenuPos(null);
  };

  const applyHeading = (level) => {
    if (level === null) {
      runWithSelection((chain) => chain.setParagraph());
    } else {
      runWithSelection((chain) => chain.toggleHeading({ level }));
    }
    setHeadingMenuOpen(false);
    setHeadingMenuPos(null);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl bg-white transition-all dark:bg-[#1a1a1a]"
      >
        {/* Toolbar — 1 row + horizontal scroll */}
        <div
          className="
            flex flex-nowrap items-center gap-1
            overflow-x-auto overflow-y-hidden
            border-b border-gray-200 bg-gray-50 p-2 text-gray-700
            dark:border-white/10 dark:bg-white/5 dark:text-ink-dark
            [scrollbar-width:thin]
            [scrollbar-color:rgba(228,141,11,.45)_transparent]
            [&::-webkit-scrollbar]:h-1.5
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#e48d0b]/50
          "
        >
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.undo());
            }}
            disabled={!editor.can().undo()}
            className="shrink-0 rounded p-1.5 hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
            title="Undo"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.redo());
            }}
            disabled={!editor.can().redo()}
            className="shrink-0 rounded p-1.5 hover:bg-gray-200 disabled:opacity-30 cursor-pointer"
            title="Redo"
          >
            <Redo size={16} />
          </button>

          <div className="mx-1 h-4 w-px shrink-0 bg-gray-300" />

          {/* Font size */}
          <div className="relative shrink-0" ref={fontSizeBtnRef}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggleFontMenu}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded px-2 py-1.5 text-[13px] hover:bg-gray-200"
              title="Font size"
            >
              <Type size={16} />
              <span className="min-w-[36px]">{currentFontSize}</span>
              <ChevronDown size={12} />
            </button>
          </div>

          {/* Heading */}
          <div className="relative shrink-0" ref={headingBtnRef}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={toggleHeadingMenu}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded px-2 py-1.5 text-[13px] hover:bg-gray-200"
              title="Heading"
            >
              <Heading size={16} />
              <span className="min-w-[48px]">{currentHeadingLabel()}</span>
              <ChevronDown size={12} />
            </button>
          </div>

          <div className="mx-1 h-4 w-px shrink-0 bg-gray-300" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleBulletList());
            }}
            className={btn(editor.isActive("bulletList"))}
            title="Bullet"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleOrderedList());
            }}
            className={btn(editor.isActive("orderedList"))}
            title="Ordered"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleBlockquote());
            }}
            className={btn(editor.isActive("blockquote"))}
            title="Quote"
          >
            <Quote size={16} />
          </button>

          <div className="mx-1 h-4 w-px shrink-0 bg-gray-300" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleBold());
            }}
            className={btn(editor.isActive("bold"))}
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleItalic());
            }}
            className={btn(editor.isActive("italic"))}
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleStrike());
            }}
            className={btn(editor.isActive("strike"))}
            title="Strike"
          >
            <Strikethrough size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleUnderline());
            }}
            className={btn(editor.isActive("underline"))}
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleCode());
            }}
            className={btn(editor.isActive("code"))}
            title="Code"
          >
            <Code size={16} />
          </button>

          <div className="mx-1 h-4 w-px shrink-0 bg-gray-300" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={setLink}
            className={btn(editor.isActive("link"))}
            title="Link"
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleSuperscript());
            }}
            className={btn(editor.isActive("superscript"))}
            title="Superscript"
          >
            <SuperIcon size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.toggleSubscript());
            }}
            className={btn(editor.isActive("subscript"))}
            title="Subscript"
          >
            <SubIcon size={16} />
          </button>

          <div className="mx-1 h-4 w-px shrink-0 bg-gray-300" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.setTextAlign("left"));
            }}
            className={btn(editor.isActive({ textAlign: "left" }))}
            title="Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.setTextAlign("center"));
            }}
            className={btn(editor.isActive({ textAlign: "center" }))}
            title="Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.setTextAlign("right"));
            }}
            className={btn(editor.isActive({ textAlign: "right" }))}
            title="Right"
          >
            <AlignRight size={16} />
          </button>
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              saveSelection();
              runWithSelection((chain) => chain.setTextAlign("justify"));
            }}
            className={btn(editor.isActive({ textAlign: "justify" }))}
            title="Justify"
          >
            <AlignJustify size={16} />
          </button>

          <div className="mx-1 h-4 w-px shrink-0 bg-gray-300" />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={addImage}
            className="flex shrink-0 cursor-pointer items-center gap-1 rounded p-1.5 text-[13px] hover:bg-gray-200"
            title="Add Image"
          >
            <ImagePlus size={16} />
            <span>Add</span>
          </button>
        </div>

        {/* Content */}
        <div className="min-h-[220px] p-4">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Font size portal */}
      {fontSizeMenuOpen &&
        fontMenuPos &&
        createPortal(
          <div
            data-font-size-menu
            className="fixed z-[10000] max-h-64 w-28 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-neutral-900"
            style={{ top: fontMenuPos.top, left: fontMenuPos.left }}
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyFontSize(null)}
              className="block w-full cursor-pointer px-3 py-1.5 text-left text-[13px] hover:bg-[#e48d0b]/10"
            >
              Default
            </button>
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFontSize(size)}
                className={`block w-full cursor-pointer px-3 py-1.5 text-left text-[13px] hover:bg-[#e48d0b]/10 ${currentFontSize === size
                  ? "bg-[#e48d0b]/20 font-semibold text-[#e48d0b]"
                  : ""
                  }`}
              >
                {size}
              </button>
            ))}
          </div>,
          document.body
        )}

      {/* Heading portal */}
      {headingMenuOpen &&
        headingMenuPos &&
        createPortal(
          <div
            data-heading-menu
            className="fixed z-[10000] w-32 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-neutral-900"
            style={{ top: headingMenuPos.top, left: headingMenuPos.left }}
          >
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyHeading(null)}
              className={`block w-full cursor-pointer px-3 py-1.5 text-left text-[13px] hover:bg-[#e48d0b]/10 ${editor.isActive("paragraph")
                ? "bg-[#e48d0b]/20 font-semibold text-[#e48d0b]"
                : ""
                }`}
            >
              Normal
            </button>
            {HEADING_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyHeading(level)}
                className={`block w-full cursor-pointer px-3 py-1.5 text-left text-[13px] hover:bg-[#e48d0b]/10 ${editor.isActive("heading", { level })
                  ? "bg-[#e48d0b]/20 font-semibold text-[#e48d0b]"
                  : ""
                  }`}
              >
                Heading {level}
              </button>
            ))}
          </div>,
          document.body
        )}

      {/* Transliteration portal */}
      {isGujarati &&
        suggestions.length > 0 &&
        popoverPos &&
        createPortal(
          <div
            className="transliteration-popover fixed z-[9999] flex min-w-[220px] max-w-[320px] w-max flex-col overflow-hidden rounded-xl border-2 border-[#e48d0b]/50 bg-white shadow-xl dark:border-[#e48d0b]/40 dark:bg-neutral-900"
            style={{ top: popoverPos.top, left: popoverPos.left }}
          >
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  applySuggestion(item);
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`cursor-pointer px-4 py-2.5 text-left font-gu text-[17px] transition-colors sm:text-[18px] ${idx === selectedIndex
                  ? "border-l-4 border-[#e48d0b] bg-[#e48d0b]/20 font-semibold text-ink dark:text-ink-dark"
                  : "text-ink hover:bg-[#e48d0b]/10 dark:text-ink-dark dark:hover:bg-[#e48d0b]/15"
                  }`}
              >
                {item}
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
};

export default TiptapEditor;