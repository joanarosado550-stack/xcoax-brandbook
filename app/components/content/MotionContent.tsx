"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback, CSSProperties } from "react";
import { TypewriterTitle } from "./TypewriterTitle";
import { SectionBands } from "./SectionBands";

// ─── Scroll-reveal (same as all other sections) ────────────────────────
function useScrollReveal(threshold = 80) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const triggered = useRef(false);

  const check = useCallback(() => {
    if (triggered.current || !ref.current) return;
    const el = ref.current;
    let scroller: HTMLElement | null = el.parentElement;
    while (scroller) {
      const { overflowY } = window.getComputedStyle(scroller);
      if (overflowY === "auto" || overflowY === "scroll") break;
      scroller = scroller.parentElement;
    }
    const elRect = el.getBoundingClientRect();
    const bottom = scroller ? scroller.getBoundingClientRect().bottom : window.innerHeight;
    if (elRect.top < bottom - threshold) {
      triggered.current = true;
      setVisible(true);
    }
  }, [threshold]);

  useEffect(() => {
    const init = setTimeout(check, 120);
    let scroller: HTMLElement | null = ref.current?.parentElement ?? null;
    while (scroller) {
      const { overflowY } = window.getComputedStyle(scroller);
      if (overflowY === "auto" || overflowY === "scroll") break;
      scroller = scroller.parentElement;
    }
    const target = scroller ?? window;
    target.addEventListener("scroll", check, { passive: true });
    return () => {
      clearTimeout(init);
      target.removeEventListener("scroll", check as EventListener);
    };
  }, [check]);

  return { ref, visible };
}

function Reveal({ children, delay = 0, y = 26 }: { children: React.ReactNode; delay?: number; y?: number }) {
  const { ref, visible } = useScrollReveal(80);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Constants ─────────────────────────────────────────────────────────
const LINE = "1px solid rgba(0,0,0,0.08)";
const FONT = "var(--font-dm-mono), monospace";

// ─── Image placeholder ─────────────────────────────────────────────────
function ImgPlaceholder({ label = "Image", style }: { label?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        border: "1px dashed rgba(0,0,0,0.14)",
        borderRadius: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.018)",
        fontFamily: FONT,
        ...style,
      }}
    >
      <span style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(0,0,0,0.18)" }}>
        {label}
      </span>
    </div>
  );
}

// ─── Block 3 — Animated ASCII band row ────────────────────────────────
const BAND_CHARS  = 68;  // characters per band
const BAND_SPEED  = 15;  // ms per character
const BAND_STAGGER = 150; // ms between band starts

const REVEAL_BANDS = [
  { char: "0", color: "#ef66ff", name: "Violet" },
  { char: "@", color: "#000000", name: "Black"  },
  { char: "*", color: "#caf938", name: "Lime"   },
  { char: "?", color: "#ff48b9", name: "Pink"   },
  { char: "#", color: "#3645ff", name: "Blue"   },
  { char: "+", color: "#25f4a5", name: "Mint"   },
];

function AsciiRevealBand({
  char, color, name, hex, delay, active,
}: {
  char: string; color: string; name: string; hex: string; delay: number; active: boolean;
}) {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  useEffect(() => {
    if (!started || count >= BAND_CHARS) return;
    const t = setTimeout(() => setCount((c) => c + 1), BAND_SPEED);
    return () => clearTimeout(t);
  }, [started, count]);

  const done = count >= BAND_CHARS;

  useEffect(() => {
    if (!started || done) return;
    const id = setInterval(() => setCursorOn((v) => !v), 420);
    return () => clearInterval(id);
  }, [started, done]);

  return (
    <div className="flex items-stretch" style={{ borderBottom: LINE }}>
      {/* Left label */}
      <div
        className="shrink-0 flex flex-col justify-center py-3 pr-6"
        style={{ width: 200, borderRight: LINE }}
      >
        <span style={{ fontSize: 22, fontWeight: 500, color, letterSpacing: 0, lineHeight: 1 }}>
          {char}
        </span>
        <span
          className="mt-2 uppercase"
          style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", color: "rgba(0,0,0,0.55)" }}
        >
          {name}
        </span>
        <span style={{ fontSize: 9, letterSpacing: "0.1em", color: "rgba(0,0,0,0.28)", marginTop: 2 }}>
          {hex}
        </span>
      </div>

      {/* Typing band */}
      <div className="flex-1 flex items-center pl-6 overflow-hidden">
        <span
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 500,
            color,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {char.repeat(count)}
          {started && !done && (
            <span style={{ opacity: cursorOn ? 1 : 0, transition: "opacity 0.08s" }}>▌</span>
          )}
        </span>
      </div>
    </div>
  );
}

// ─── Block 4 — Density Composition ────────────────────────────────────
const DENSITY_SPEED = 5; // ms per character

// Bands ordered top → bottom so the composition reads as a gradient:
// green at top → pink → blue → black at bottom.
// Widths taper from shortest (top) to full (bottom).
const DENSITY_BANDS = [
  { char: "/", color: "#caf938", maxCount:  36 }, // Lime   — shortest
  { char: "*", color: "#25f4a5", maxCount:  50 }, // Mint   — shorter still
  { char: "+", color: "#ef66ff", maxCount:  64 }, // Violet — shorter
  { char: "?", color: "#ff48b9", maxCount:  80 }, // Pink   — slightly shorter
  { char: "#", color: "#3645ff", maxCount: 100 }, // Blue   — full width
  { char: "0", color: "#000000", maxCount: 100 }, // Black
  { char: "@", color: "#000000", maxCount: 100 }, // Black
];

function BlinkCursor({ color }: { color: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const id = setInterval(() => setOn((v) => !v), 300);
    return () => clearInterval(id);
  }, []);
  return <span style={{ opacity: on ? 1 : 0, transition: "opacity 0.06s", color }}>▌</span>;
}

function DensityComposition({ visible }: { visible: boolean }) {
  const [counts,     setCounts]     = useState<number[]>(DENSITY_BANDS.map(() => 0));
  const [typingBand, setTypingBand] = useState(-1);

  // Start the sequence once the section is in view
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setTypingBand(0), 200);
    return () => clearTimeout(t);
  }, [visible]);

  // Advance one character at a time, sequentially through bands
  useEffect(() => {
    if (typingBand < 0 || typingBand >= DENSITY_BANDS.length) return;
    const current = counts[typingBand];
    const max     = DENSITY_BANDS[typingBand].maxCount;

    if (current < max) {
      const t = setTimeout(() => {
        setCounts((prev) => {
          const next = [...prev];
          next[typingBand] = next[typingBand] + 1;
          return next;
        });
      }, DENSITY_SPEED);
      return () => clearTimeout(t);
    } else {
      setTypingBand((b) => b + 1);
    }
  }, [typingBand, counts]);

  return (
    <div style={{ fontFamily: FONT, lineHeight: 1.55 }}>
      {DENSITY_BANDS.map((band, i) => {
        const isTyping = i === typingBand;
        const count    = counts[i];
        if (count === 0 && !isTyping) return <div key={i} style={{ minHeight: "1.55em" }} />;
        return (
          <div key={i} style={{ whiteSpace: "nowrap", minHeight: "1.55em" }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: band.color,
                letterSpacing: "0.04em",
              }}
            >
              {band.char.repeat(count)}
            </span>
            {isTyping && count > 0 && <BlinkCursor color={band.color} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────
export default function MotionContent() {
  const [contentReady, setContentReady] = useState(false);

  // Scroll-reveal refs for animated blocks
  const { ref: bandsRef,   visible: bandsVisible   } = useScrollReveal(60);
  const { ref: densityRef, visible: densityVisible } = useScrollReveal(60);

  return (
    <div className="bg-white" style={{ fontFamily: FONT }}>

      {/* ════ BLOCK 1 — Intro ════ */}
      <section
        className="relative min-h-screen flex flex-col justify-between px-14 py-10"
        style={{ borderBottom: LINE }}
      >
        <SectionBands sectionId="motion" />

        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
            xCoAx_2027&thinsp;/&thinsp;Brand&nbsp;Book&thinsp;/&thinsp;Graphic&nbsp;Elements
          </span>
          <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
            05&thinsp;—&thinsp;Introduction
          </span>
        </div>

        <TypewriterTitle
          text="Graphic Elements"
          className="brand-title font-medium leading-[0.88] tracking-tight text-black"
          style={{ fontSize: "clamp(3rem,8vw,7.5rem)" }}
          onDone={() => setContentReady(true)}
        />

        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={contentReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Reveal delay={0.05} y={20}>
            <div className="body-row flex items-start gap-14">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[12px] leading-[2.1] tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.45)", maxWidth: 760 }}>
                The graphic elements of the xCoAx 2027 identity extend the ASCII logic of the logo into a full visual language. Built from the same characters and color palette, these elements translate the conceptual foundation of the identity into flexible, expressive components — capable of adapting across countless applications while remaining instantly recognizable as part of the same system.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div className="flex items-center justify-between text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(0,0,0,0.18)" }}>
              <span>Symbol&thinsp;·&thinsp;Bands&thinsp;·&thinsp;Compositions</span>
              <span>Scroll to explore&thinsp;↓</span>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* ════ All remaining blocks ════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={contentReady ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
      >

        {/* ════ BLOCK 2 — The Aesthetics X ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Graphic&nbsp;Elements&thinsp;/&thinsp;Symbol
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                01&thinsp;—&thinsp;Mark
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={36}>
            <div className="flex items-center justify-center">
              <Image
                src="/AESTHETICS_X.png"
                alt="The Aesthetics X — xCoAx 2027"
                width={618}
                height={546}
                className="object-contain"
                style={{ maxHeight: "52vh", width: "auto", mixBlendMode: "multiply" }}
              />
            </div>
          </Reveal>

          <Reveal delay={0.22} y={18}>
            <div className="body-row flex items-start gap-14">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[12px] leading-[2.1] tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.45)", maxWidth: 760 }}>
                The Aesthetics X is the most visually complex element of the identity system. Functioning as the expressive, large-scale counterpart to the simplified logo, it carries the full character density and texture that the logo distills down to its essentials — making it the natural centerpiece for posters, backgrounds and large format applications.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ════ BLOCK 3 — ASCII Bands ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Graphic&nbsp;Elements&thinsp;/&thinsp;ASCII&nbsp;Bands
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                02&thinsp;—&thinsp;Bands
              </span>
            </div>
          </Reveal>

          {/* Scroll-reveal trigger wrapping the band rows */}
          <div ref={bandsRef} className="flex flex-col my-3" style={{ borderTop: LINE }}>
            {REVEAL_BANDS.map((band, i) => (
              <AsciiRevealBand
                key={band.color + i}
                char={band.char}
                color={band.color}
                name={band.name}
                hex={band.color}
                delay={i * BAND_STAGGER}
                active={bandsVisible}
              />
            ))}
          </div>

          <Reveal delay={0.4} y={10}>
            <div className="body-row flex items-start gap-14">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[11px] leading-[2.0] tracking-[0.03em]" style={{ color: "rgba(0,0,0,0.4)", maxWidth: 760 }}>
                The six ASCII bands form the foundational building blocks of the graphic system. Each band pairs a single character with one of the six palette colors, creating a modular set of textures that can be combined, layered or used independently across the identity. The system is not limited to these six combinations — any character can be paired with any color from the palette, allowing the bands to be freely adapted and expanded for new applications while remaining consistent with the identity's underlying logic.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ════ BLOCK 4 — Density Composition ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Graphic&nbsp;Elements&thinsp;/&thinsp;Composition
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                03&thinsp;—&thinsp;Density
              </span>
            </div>
          </Reveal>

          {/* Composition area — full remaining height */}
          <div
            ref={densityRef}
            className="flex-1 flex flex-col justify-center my-8 px-2"
          >
            <DensityComposition visible={densityVisible} />
          </div>

          <Reveal delay={0.1} y={10}>
            <div className="body-row flex items-start gap-14">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[11px] leading-[2.0] tracking-[0.03em]" style={{ color: "rgba(0,0,0,0.4)", maxWidth: 760 }}>
                The Density Composition layers multiple ASCII bands of varying width, character and color to create a gradient effect — moving from black through blue, pink and violet to mint and lime. Rather than depicting a fixed image, the composition demonstrates the generative potential of the system: structure and intensity emerging purely from the layering of characters.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ════ Footer ════ */}
        <section className="flex flex-col justify-center px-14 py-16">
          <Reveal y={18}>
            <div className="flex items-end justify-between mb-12 pb-5" style={{ borderBottom: LINE }}>
              <span className="text-[10px] tracking-[0.32em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Graphic&nbsp;Elements&thinsp;/&thinsp;Summary
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                Symbol&thinsp;·&thinsp;Bands&thinsp;·&thinsp;Density
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div
              className="mt-4 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(0,0,0,0.18)", borderTop: LINE, paddingTop: "1.25rem" }}
            >
              <span>xCoAx 2027&thinsp;—&thinsp;Brand Book</span>
              <span>End of Graphic Elements&thinsp;↑</span>
            </div>
          </Reveal>
        </section>

      </motion.div>
    </div>
  );
}
