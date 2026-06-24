"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

// ─── Band typing constants ─────────────────────────────────────────────
const TYPE_MS = 32;   // ms per character
const STAGGER = 150;  // ms between band starts

// ─── Band definitions ─────────────────────────────────────────────────
const BANDS = [
  { char: "#", count: 32, color: "#3645ff", delay: STAGGER * 0, pos: { top:    "11%", left:  "3%"  } },
  { char: "@", count: 20, color: "#000000", delay: STAGGER * 1, pos: { top:    "21%", right: "4%"  } },
  { char: "+", count: 24, color: "#ff48b9", delay: STAGGER * 2, pos: { top:    "43%", left:  "2%"  } },
  { char: "·", count: 18, color: "#25f4a5", delay: STAGGER * 3, pos: { top:    "61%", right: "3%"  } },
  { char: "*", count: 28, color: "#caf938", delay: STAGGER * 4, pos: { bottom: "22%", left:  "4%"  } },
  { char: "0", count: 22, color: "#ef66ff", delay: STAGGER * 5, pos: { bottom: "10%", right: "5%"  } },
];

// ─── Blinking cursor ───────────────────────────────────────────────────
function BlinkCursor({ color }: { color: string }) {
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

// ─── Single ASCII band — types, deletes, loops forever ────────────────
function AsciiBand({
  char,
  count,
  color,
  delay,
  pos,
}: {
  char: string;
  count: number;
  color: string;
  delay: number;
  pos: { top?: string; bottom?: string; left?: string; right?: string };
}) {
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
    if (phase === "deleting") {
      if (shown > 0) {
        const t = setTimeout(() => setShown((s) => s - 1), TYPE_MS);
        return () => clearTimeout(t);
      }
      setPhase("typing");
    }
  }, [active, shown, count, phase]);

  return (
    <div
      className="absolute select-none pointer-events-none"
      style={{
        fontFamily: "var(--font-dm-mono), monospace",
        fontSize: 13,
        fontWeight: 500,
        color,
        letterSpacing: "0.03em",
        whiteSpace: "nowrap",
        zIndex: 5,
        ...pos,
      }}
    >
      {char.repeat(shown)}
      {active && <BlinkCursor color={color} />}
    </div>
  );
}

// ─── Palette colors for scroll indicator ──────────────────────────────
const PALETTE = ["#3645ff", "#ff48b9", "#ef66ff", "#25f4a5", "#caf938"];

// ─── Landing section ───────────────────────────────────────────────────
export default function LandingSection() {
  const [ready,        setReady]        = useState(false);
  const [colorIdx,     setColorIdx]     = useState(0);

  // Gate band render to client-side only (avoids SSR mismatch)
  useEffect(() => {
    setReady(true);
  }, []);

  // Cycle scroll indicator color every 600ms
  useEffect(() => {
    const id = setInterval(() => {
      setColorIdx((i) => (i + 1) % PALETTE.length);
    }, 600);
    return () => clearInterval(id);
  }, []);

  const indicatorColor = PALETTE[colorIdx];

  return (
    <section
      className="relative w-screen h-screen flex flex-col items-center justify-center bg-white overflow-hidden snap-start"
      style={{ fontFamily: "var(--font-dm-mono), monospace" }}
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ASCII bands */}
      {ready && BANDS.map((band, i) => <AsciiBand key={i} {...band} />)}

      {/* Logo — visible immediately, no animation */}
      <div
        className="relative z-10"
        style={{ width: 280, height: "min(52vh, 364px)" }}
      >
        <Image
          src="/LOGObranco.png"
          alt="xCoAx 2027"
          fill
          className="object-contain"
          style={{ mixBlendMode: "multiply" }}
          sizes="280px"
          priority
        />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
      >
        <motion.div
          style={{
            height: 52,
            width: 2,
            backgroundColor: indicatorColor,
            transition: "background-color 0.5s ease",
          }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="text-[9px] tracking-[0.3em] uppercase"
          style={{
            color: indicatorColor,
            transition: "color 0.5s ease",
          }}
        >
          Scroll
        </span>
      </motion.div>
    </section>
  );
}
