"use client";
import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { TypewriterTitle } from "./TypewriterTitle";
import { SectionBands } from "./SectionBands";

// ─── Scroll-reveal ────────────────────────────────────────────────────
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

function Reveal({
  children,
  delay = 0,
  y = 26,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
}) {
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

const LINE = "1px solid rgba(0,0,0,0.08)";
const FONT = "var(--font-dm-mono), monospace";

const WEIGHTS = [
  { label: "Light",   number: "300", weight: 300 },
  { label: "Regular", number: "400", weight: 400 },
  { label: "Medium",  number: "500", weight: 500 },
];

const HIERARCHY = [
  {
    role: "Heading",
    style: "Medium",
    size: 32,
    weight: 500,
    transform: "none" as const,
    tracking: "normal",
    sample: "Conference on Computation",
  },
  {
    role: "Subheading",
    style: "Regular",
    size: 20,
    weight: 400,
    transform: "none" as const,
    tracking: "normal",
    sample: "Communication, Aesthetics & X",
  },
  {
    role: "Body",
    style: "Light",
    size: 13,
    weight: 300,
    transform: "none" as const,
    tracking: "normal",
    sample: "Évora, Portugal · 8–10 July 2027",
  },
  {
    role: "Caption",
    style: "Light",
    size: 10,
    weight: 300,
    transform: "uppercase" as const,
    tracking: "0.25em",
    sample: "xCoAx 2027 · Visual Identity System",
  },
];

export default function LogoContent() {
  const [contentReady, setContentReady] = useState(false);

  return (
    <div className="bg-white" style={{ fontFamily: FONT }}>

      {/* ════ BLOCK 1 — Intro ════ */}
      <section
        className="relative min-h-screen flex flex-col justify-between px-14 py-10"
        style={{ borderBottom: LINE }}
      >
        <SectionBands sectionId="logo" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
            xCoAx_2027&thinsp;/&thinsp;Brand&nbsp;Book&thinsp;/&thinsp;Typography
          </span>
          <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
            03&thinsp;—&thinsp;Introduction
          </span>
        </div>

        <TypewriterTitle
          text="DM Mono"
          className="brand-title text-black leading-[0.88] tracking-tight"
          style={{ fontSize: "clamp(4.5rem,11vw,9.5rem)", fontWeight: 500 }}
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
              <p className="text-[12px] leading-[2.1] tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.45)", fontWeight: 300, maxWidth: 760 }}>
                The xCoAx 2027 identity uses DM Mono as its sole typeface. A monospaced font by nature, DM Mono shares the same fundamental logic as ASCII art — every character occupies an equal amount of horizontal space, echoing the grid-based construction of the identity's visual system. This typographic choice is not merely aesthetic but conceptual, reinforcing the connection between language, computation and form that sits at the core of the conference's identity.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div className="flex items-center justify-between text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(0,0,0,0.18)" }}>
              <span>300&thinsp;·&thinsp;400&thinsp;·&thinsp;500</span>
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

        {/* ════ BLOCK 2 — Weights ════ */}
        <section
          className="flex flex-col px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Typography&thinsp;/&thinsp;Weights
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                01&thinsp;—&thinsp;Scale
              </span>
            </div>
          </Reveal>

          <div className="flex flex-col">
            {WEIGHTS.map((w, i) => (
              <Reveal key={w.label} delay={i * 0.1} y={24}>
                <div
                  className="flex flex-col py-6"
                  style={{ borderBottom: i < WEIGHTS.length - 1 ? LINE : "none" }}
                >
                  <span
                    className="text-[10px] tracking-[0.28em] uppercase mb-5 select-none"
                    style={{ color: "rgba(0,0,0,0.28)", fontWeight: 400 }}
                  >
                    {w.label}&thinsp;·&thinsp;{w.number}
                  </span>
                  <span
                    className="text-black leading-none select-none"
                    style={{
                      fontSize: "clamp(2rem,5.5vw,4.5rem)",
                      fontWeight: w.weight,
                    }}
                  >
                    DM Mono {w.label}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════ BLOCK 3 — Type Hierarchy ════ */}
        <section
          className="flex flex-col px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Typography&thinsp;/&thinsp;Hierarchy
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                02&thinsp;—&thinsp;Scale
              </span>
            </div>
          </Reveal>

          <div className="flex flex-col">
            {HIERARCHY.map((h, i) => (
              <Reveal key={h.role} delay={i * 0.08} y={18}>
                <div
                  className="flex items-baseline gap-10 py-5"
                  style={{ borderBottom: i < HIERARCHY.length - 1 ? LINE : "none" }}
                >
                  <div className="shrink-0 flex flex-col gap-0.5" style={{ width: 130 }}>
                    <span className="text-[10px] tracking-[0.22em] uppercase text-black" style={{ fontWeight: 500 }}>
                      {h.role}
                    </span>
                    <span className="text-[9px] tracking-[0.18em] uppercase" style={{ color: "rgba(0,0,0,0.35)", fontWeight: 300 }}>
                      {h.style}&thinsp;·&thinsp;{h.size}px
                    </span>
                  </div>

                  <span
                    className="flex-1 text-black leading-tight"
                    style={{
                      fontSize: h.size,
                      fontWeight: h.weight,
                      textTransform: h.transform,
                      letterSpacing: h.tracking,
                    }}
                  >
                    {h.sample}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════ BLOCK 4 — Alphabet Specimen ════ */}
        <section
          className="flex flex-col px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Typography&thinsp;/&thinsp;Specimen
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                03&thinsp;—&thinsp;Glyphs
              </span>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            {[
              { label: "Uppercase", text: "ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
              { label: "Lowercase", text: "abcdefghijklmnopqrstuvwxyz" },
              { label: "Numerals",  text: "0123456789" },
              { label: "Special",   text: "{}[]/ \\ |!?.,:@#%&*+-<>~^_:;" },
            ].map((row, i) => (
              <Reveal key={row.label} delay={i * 0.07} y={16}>
                <div className="flex flex-col gap-3">
                  <span
                    className="text-[9px] tracking-[0.28em] uppercase"
                    style={{ color: "rgba(0,0,0,0.28)", fontWeight: 400 }}
                  >
                    {row.label}
                  </span>
                  <p
                    className="text-black leading-relaxed break-all"
                    style={{ fontSize: 18, fontWeight: 400 }}
                  >
                    {row.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════ Footer ════ */}
        <section className="flex flex-col justify-center px-14 py-16">
          <Reveal y={18}>
            <div className="flex items-end justify-between mb-12 pb-5" style={{ borderBottom: LINE }}>
              <span className="text-[10px] tracking-[0.32em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Typography&thinsp;/&thinsp;Summary
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                DM Mono&thinsp;·&thinsp;300&thinsp;·&thinsp;400&thinsp;·&thinsp;500
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div
              className="mt-4 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(0,0,0,0.18)", borderTop: LINE, paddingTop: "1.25rem" }}
            >
              <span>xCoAx 2027&thinsp;—&thinsp;Brand Book</span>
              <span>End of Typography&thinsp;↑</span>
            </div>
          </Reveal>
        </section>

      </motion.div>
    </div>
  );
}
