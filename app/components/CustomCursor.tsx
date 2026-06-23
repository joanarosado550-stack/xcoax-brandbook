"use client";
import { useEffect, useRef } from "react";

const CHARS  = ["*", "·", "+", "0", "#", "@", "{", "}", "|", "\\", "/", "!", "?", "=", "~", "^", "<", ">"];
const COLORS = ["#3645ff", "#ff48b9", "#ef66ff", "#25f4a5", "#caf938"];

export default function CustomCursor() {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 768px)").matches) return;
    const el = elRef.current;
    if (!el) return;

    let charIdx  = 0;
    let colorIdx = 0;

    // ── Position: direct DOM write on every mousemove — zero lag ──────
    const onMove = (e: MouseEvent) => {
      // translate(calc(x - 50%), calc(y - 50%)) centres the glyph on the tip
      el.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // ── Character cycle — every 150ms ──────────────────────────────────
    const charTimer = setInterval(() => {
      charIdx = (charIdx + 1) % CHARS.length;
      el.textContent = CHARS[charIdx];
    }, 150);

    // ── Color cycle — offset by 75ms so char & color are never in sync ─
    const colorTimer = setTimeout(() => {
      setInterval(() => {
        colorIdx = (colorIdx + 1) % COLORS.length;
        el.style.color = COLORS[colorIdx];
      }, 150);
    }, 75);

    return () => {
      window.removeEventListener("mousemove", onMove);
      clearInterval(charTimer);
      clearTimeout(colorTimer);
    };
  }, []);

  return (
    <div
      ref={elRef}
      aria-hidden="true"
      className="hidden sm:block"
      style={{
        position:     "fixed",
        top:          0,
        left:         0,
        pointerEvents:"none",
        zIndex:       99999,
        transform:    "translate(-200px, -200px)",
        fontFamily:   "var(--font-dm-mono), monospace",
        fontSize:     18,
        fontWeight:   500,
        color:        "#3645ff",
        lineHeight:   1,
        userSelect:   "none",
        whiteSpace:   "nowrap",
      }}
    >
      *
    </div>
  );
}
