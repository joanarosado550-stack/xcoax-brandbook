"use client";
import { useState, useEffect, CSSProperties } from "react";

// ─── Shared ASCII band component for section pages ────────────────────
// Bands are rendered as absolute children of a `position: relative`
// container — typically the intro section block.
// They continuously type and delete on loop, like the homepage bands.

const TYPE_MS    = 32;   // ms per character
const BASE_DELAY = 650;  // wait until section title has finished typing
const STAGGER    = 190;  // ms between each band starting

type BandDef = {
  char:  string;
  count: number;
  color: string;
  pos:   CSSProperties; // top / right / bottom / left percentages
};

// ─── Per-section band configs ─────────────────────────────────────────
// Keys match the SectionId that controls which content component mounts.
// Bands are placed in the right margin / bottom-right corner of the
// intro block, away from left-aligned headings and body text.

export const SECTION_BANDS: Record<string, BandDef[]> = {
  // Concept (SectionId "colors")
  colors: [
    { char: "·", count: 16, color: "#caf938", pos: { top: "16%",    right: "3%" } },
    { char: "#", count: 12, color: "#3645ff", pos: { top: "54%",    right: "3%" } },
    { char: "+", count: 18, color: "#ff48b9", pos: { bottom: "16%", right: "4%" } },
  ],
  // Logo (SectionId "typography")
  typography: [
    { char: "·", count: 14, color: "#25f4a5", pos: { top: "14%",    right: "4%" } },
    { char: "+", count: 20, color: "#ff48b9", pos: { bottom: "18%", right: "3%" } },
    { char: "#", count: 11, color: "#3645ff", pos: { top: "48%",    right: "5%" } },
  ],
  // Typography (SectionId "logo")
  logo: [
    { char: "·", count: 18, color: "#caf938", pos: { top: "18%",    right: "3%" } },
    { char: "+", count: 14, color: "#25f4a5", pos: { bottom: "20%", right: "4%" } },
    { char: "#", count: 10, color: "#3645ff", pos: { top: "58%",    right: "3%" } },
  ],
  // Color (SectionId "components")
  components: [
    { char: "#", count: 15, color: "#3645ff", pos: { top: "15%",    right: "3%" } },
    { char: "·", count: 20, color: "#ff48b9", pos: { bottom: "22%", right: "4%" } },
    { char: "+", count: 13, color: "#25f4a5", pos: { top: "50%",    right: "5%" } },
  ],
  // Graphic Elements (SectionId "motion")
  motion: [
    { char: "·", count: 15, color: "#caf938", pos: { top:    "6%",  right: "3%" } },
    { char: "+", count: 19, color: "#ff48b9", pos: { bottom: "6%",  left:  "2%" } },
    { char: "#", count: 11, color: "#3645ff", pos: { top:    "48%", right: "4%" } },
  ],
  // Applications (SectionId "photo")
  photo: [
    { char: "#", count: 13, color: "#3645ff", pos: { top:    "6%",  right: "3%" } },
    { char: "·", count: 17, color: "#25f4a5", pos: { bottom: "6%",  left:  "2%" } },
    { char: "+", count: 10, color: "#ff48b9", pos: { top:    "50%", right: "4%" } },
  ],
};

// ─── Internal components ──────────────────────────────────────────────
function Cursor({ color }: { color: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 420);
    return () => clearInterval(id);
  }, []);
  return (
    <span style={{ opacity: on ? 1 : 0, transition: "opacity 0.08s", color }}>
      ▌
    </span>
  );
}

function Band({ char, count, color, delay, pos }: BandDef & { delay: number }) {
  const [shown,  setShown]  = useState(0);
  const [active, setActive] = useState(false);
  const [phase,  setPhase]  = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!active) return;
    if (phase === "typing") {
      if (shown < count) {
        const t = setTimeout(() => setShown((s) => s + 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      setPhase("deleting");
      return;
    }
    if (shown > 0) {
      const t = setTimeout(() => setShown((s) => s - 1), TYPE_MS);
      return () => clearTimeout(t);
    }
    setPhase("typing");
  }, [active, shown, count, phase]);

  return (
    <div
      className="absolute select-none pointer-events-none mobile:hidden"
      style={{
        fontFamily:    "var(--font-dm-mono), monospace",
        fontSize:      13,
        fontWeight:    500,
        color,
        letterSpacing: "0.03em",
        whiteSpace:    "nowrap",
        opacity:       0.25,
        zIndex:        0,
        ...pos,
      }}
    >
      {char.repeat(shown)}
      {active && <Cursor color={color} />}
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────
export function SectionBands({ sectionId }: { sectionId: string }) {
  const bands = SECTION_BANDS[sectionId] ?? [];
  return (
    <>
      {bands.map((band, i) => (
        <Band
          key={i}
          {...band}
          delay={BASE_DELAY + i * STAGGER}
        />
      ))}
    </>
  );
}
