"use client";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import type { SectionId } from "../page";

// ─── Editorial typewriter ─────────────────────────────────────────────
// Each sentence has its own fixed position, size and weight.
// All five slots are always mounted (absolute, no layout cost).
// Only the active slot shows text; the others stay empty.

const SENTENCES = [
  {
    text:     "A conference on computation, communication, aesthetics & x",
    color:    "#3645ff",
    size:     32,
    weight:   500,
    maxWidth: "56%",
    pos:      { top: "9%",    left:  "8%"  },
  },
  {
    text:     "Évora, Portugal · 8–10 July 2027",
    color:    "#ff48b9",
    size:     14,
    weight:   300,
    maxWidth: "34%",
    pos:      { bottom: "12%", right: "10%" },
  },
  {
    text:     "Where art, science and technology converge",
    color:    "#ef66ff",
    size:     22,
    weight:   400,
    maxWidth: "50%",
    pos:      { top: "50%", left: "8%", transform: "translateY(-50%)" },
  },
  {
    text:     "The unknown variable in creative computation",
    color:    "#3645ff",
    size:     18,
    weight:   300,
    maxWidth: "38%",
    pos:      { top: "10%", right: "10%" },
  },
  {
    text:     "An international conference since 2013",
    color:    "#ff48b9",
    size:     28,
    weight:   500,
    maxWidth: "50%",
    pos:      { bottom: "10%", left: "8%" },
  },
];

const TYPE_SPEED   = 90;
const DELETE_SPEED = 45;
const PAUSE_AFTER  = 1500;


function EditorialTypewriter() {
  const [idx,       setIdx]       = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase,     setPhase]     = useState<"typing" | "deleting">("typing");
  const [cursorOn,  setCursorOn]  = useState(true);

  const sentence = SENTENCES[idx];

  useEffect(() => {
    const id = setInterval(() => setCursorOn((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase === "typing") {
      if (displayed.length < sentence.text.length) {
        const id = setTimeout(
          () => setDisplayed(sentence.text.slice(0, displayed.length + 1)),
          TYPE_SPEED,
        );
        return () => clearTimeout(id);
      }
      const id = setTimeout(() => setPhase("deleting"), PAUSE_AFTER);
      return () => clearTimeout(id);
    }
    if (phase === "deleting") {
      if (displayed.length > 0) {
        const id = setTimeout(
          () => setDisplayed((d) => d.slice(0, -1)),
          DELETE_SPEED,
        );
        return () => clearTimeout(id);
      }
      setIdx((i) => (i + 1) % SENTENCES.length);
      setPhase("typing");
    }
  }, [phase, displayed, sentence.text]);

  return (
    <>
      {SENTENCES.map((s, i) => {
        const active = i === idx;
        return (
          <div
            key={i}
            className="absolute select-none pointer-events-none"
            style={{
              ...(s.pos as React.CSSProperties),
              maxWidth:   s.maxWidth,
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize:   s.size,
              fontWeight: s.weight,
              color:      s.color,
              lineHeight: 1.3,
              letterSpacing: "0.01em",
            }}
          >
            {active ? displayed : ""}
            {active && (
              <span
                style={{
                  display:       "inline-block",
                  width:         2,
                  height:        "0.82em",
                  backgroundColor: s.color,
                  marginLeft:    3,
                  verticalAlign: "middle",
                  opacity:       cursorOn ? 1 : 0,
                  transition:    "opacity 0.08s",
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

// ─── Folders data ──────────────────────────────────────────────────────
export const FOLDERS: {
  id: SectionId;
  label: string;
  index: string;
  bg: string;
  textDark: boolean;
  hint: string;
  tag: string;
  accent: string;
}[] = [
  { id: "colors",     label: "Concept",         index: "01", bg: "#000000", textDark: false, hint: "Vision · Context · Direction",  tag: "01", accent: "#ffffff" },
  { id: "typography", label: "Logo",             index: "02", bg: "#3645ff", textDark: false, hint: "Mark · Wordmark · Clear space",  tag: "02", accent: "#ffffff" },
  { id: "logo",       label: "Typography",       index: "03", bg: "#ff48b9", textDark: true,  hint: "Typefaces · Scale · Hierarchy",  tag: "03", accent: "#000000" },
  { id: "components", label: "Color",            index: "04", bg: "#ef66ff", textDark: true,  hint: "Palette · Tones · Usage rules",  tag: "04", accent: "#000000" },
  { id: "motion",     label: "Graphic Elements", index: "05", bg: "#25f4a5", textDark: true,  hint: "Patterns · Textures · Shapes",   tag: "05", accent: "#000000" },
  { id: "photo",      label: "Applications",     index: "06", bg: "#caf938", textDark: true,  hint: "Print · Digital · Environments", tag: "06", accent: "#000000" },
];

// ─── Single vertical tab ───────────────────────────────────────────────
function Tab({
  folder,
  index: i,
  isHovered,
  inView,
  onHoverStart,
  onHoverEnd,
  onOpen,
}: {
  folder: (typeof FOLDERS)[number];
  index: number;
  isHovered: boolean;
  inView: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onOpen: (id: SectionId) => void;
}) {
  const textColor  = folder.textDark ? "#000000" : "#ffffff";
  const mutedColor = folder.textDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)";

  return (
    <motion.div
      layoutId={`card-${folder.id}`}
      className="relative h-full flex flex-col items-center justify-between overflow-hidden cursor-pointer"
      style={{ backgroundColor: folder.bg, flexShrink: 0 }}
      initial={{ width: 46, x: 500 }}
      animate={{
        width: isHovered ? 76 : 46,
        x: inView ? 0 : 500,
      }}
      transition={{
        width: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
        x:     { delay: inView ? i * 0.065 : 0, duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onClick={() => onOpen(folder.id)}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: textColor, opacity: 0.08 }}
      />

      <div className="flex flex-col items-center justify-between h-full py-8 gap-0">
        <span
          className="text-[10px] font-mono tracking-widest select-none"
          style={{ color: mutedColor, writingMode: "vertical-lr", letterSpacing: "0.2em" }}
        >
          {folder.index}
        </span>

        <span
          className="text-[11px] font-medium uppercase tracking-[0.22em] select-none"
          style={{ color: textColor, writingMode: "vertical-lr", whiteSpace: "nowrap" }}
        >
          {folder.label}
        </span>

        <motion.span
          className="text-xs select-none"
          style={{ color: mutedColor }}
          animate={{
            opacity: isHovered ? 1 : (typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches ? 0.5 : 0),
            y: isHovered ? 0 : 4,
          }}
          transition={{ duration: 0.18 }}
        >
          ↑
        </motion.span>
      </div>
    </motion.div>
  );
}

// ─── Mobile tab list — full-width stacked rows ────────────────────────
function MobileTabList({
  folders,
  inView,
  onOpen,
}: {
  folders: typeof FOLDERS;
  inView: boolean;
  onOpen: (id: SectionId) => void;
}) {
  return (
    <div className="flex flex-col w-full h-full">
      {folders.map((folder, i) => {
        const textColor  = folder.textDark ? "#000000" : "#ffffff";
        const mutedColor = folder.textDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)";
        return (
          <motion.div
            key={folder.id}
            layoutId={`card-${folder.id}`}
            className="flex-1 flex items-center justify-between px-6 cursor-pointer"
            style={{ backgroundColor: folder.bg }}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: inView ? 0 : 80, opacity: inView ? 1 : 0 }}
            transition={{ delay: inView ? i * 0.065 : 0, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onOpen(folder.id)}
          >
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-mono tracking-widest select-none" style={{ color: mutedColor }}>
                {folder.index}
              </span>
              <span className="text-[13px] font-medium uppercase tracking-[0.18em] select-none" style={{ color: textColor }}>
                {folder.label}
              </span>
            </div>
            <span className="text-[11px] select-none" style={{ color: mutedColor }}>→</span>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────
export default function FolderStack({
  open,
  onOpen,
}: {
  open: SectionId | null;
  onOpen: (id: SectionId) => void;
}) {
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Intersection Observer — fires once when section scrolls into view
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15%" });

  // Typewriter delay: last tab finishes at (5 × 65ms stagger) + 350ms duration = 675ms
  const typewriterDelay = inView ? 0.75 : 0;

  return (
    <section
      ref={sectionRef}
      className="relative w-screen h-screen flex flex-row overflow-hidden bg-white snap-start"
    >
      <AnimatePresence>
        {!open && (
          <motion.div
            key="nav"
            className="absolute inset-0 flex flex-row"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {/* ════ MOBILE: full-width stacked rows ════ */}
            {isMobile ? (
              <MobileTabList folders={FOLDERS} inView={inView} onOpen={onOpen} />
            ) : (
              <>
                {/* ════ LEFT: centered typewriter ════ */}
                <div className="flex-1 flex flex-col items-center justify-center bg-white relative overflow-hidden">
                  {/* Subtle grid texture */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-[0.025]"
                    style={{
                      backgroundImage:
                        "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                      backgroundSize: "48px 48px",
                    }}
                  />

                  {/* Editorial typewriter — fades in after all tabs have landed */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inView ? 1 : 0 }}
                    transition={{ delay: typewriterDelay, duration: 0.5, ease: "easeOut" }}
                  >
                    <EditorialTypewriter />
                  </motion.div>

                  {/* Bottom-left metadata */}
                  <motion.div
                    className="absolute bottom-7 left-8 text-[9px] tracking-[0.25em] uppercase select-none"
                    style={{ color: "rgba(0,0,0,0.18)", fontFamily: "var(--font-dm-mono), monospace" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inView ? 1 : 0 }}
                    transition={{ delay: typewriterDelay, duration: 0.5, ease: "easeOut" }}
                  >
                    xCoAx 2027 · Brand Book
                  </motion.div>
                </div>

                {/* ════ RIGHT: 6 vertical tabs — slide in from right ════ */}
                <div className="flex flex-row h-full overflow-hidden">
                  {FOLDERS.map((folder, i) => (
                    <Tab
                      key={folder.id}
                      folder={folder}
                      index={i}
                      isHovered={hoveredId === folder.id}
                      inView={inView}
                      onHoverStart={() => setHoveredId(folder.id)}
                      onHoverEnd={() => setHoveredId(null)}
                      onOpen={onOpen}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
