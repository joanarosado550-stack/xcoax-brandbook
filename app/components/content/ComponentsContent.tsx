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

const COLORS = [
  { name: "Black",  hex: "#000000", rgb: "0, 0, 0",       cmyk: "0, 0, 0, 100",  pantone: "Neutral Black C",  dark: false },
  { name: "Blue",   hex: "#3645ff", rgb: "54, 69, 255",   cmyk: "79, 73, 0, 0",  pantone: "2726 C",           dark: false },
  { name: "Pink",   hex: "#ff48b9", rgb: "255, 72, 185",  cmyk: "0, 72, 27, 0",  pantone: "806 C",            dark: false },
  { name: "Violet", hex: "#ef66ff", rgb: "239, 102, 255", cmyk: "6, 60, 0, 0",   pantone: "252 C",            dark: false },
  { name: "Mint",   hex: "#25f4a5", rgb: "37, 244, 165",  cmyk: "85, 0, 32, 4",  pantone: "3385 C",           dark: true  },
  { name: "Lime",   hex: "#caf938", rgb: "202, 249, 56",  cmyk: "19, 0, 78, 2",  pantone: "387 C",            dark: true  },
];

export default function ComponentsContent() {
  const [contentReady, setContentReady] = useState(false);

  return (
    <div className="bg-white" style={{ fontFamily: FONT }}>

      {/* ════ BLOCK 1 — Intro ════ */}
      <section
        className="relative min-h-screen flex flex-col justify-between px-14 py-10"
        style={{ borderBottom: LINE }}
      >
        <SectionBands sectionId="components" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
            xCoAx_2027&thinsp;/&thinsp;Brand&nbsp;Book&thinsp;/&thinsp;Color
          </span>
          <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
            04&thinsp;—&thinsp;Introduction
          </span>
        </div>

        <TypewriterTitle
          text="Palette"
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
                The xCoAx 2027 color palette is built on a foundation of black, activated by a set of vivid, high-energy accent colors. Rooted in the visual culture of digital and computational aesthetics, the palette draws from the luminous quality of screen-based color — electric blue, neon pink, vivid violet, sharp green and acid yellow — creating a chromatic language that feels simultaneously technological and expressive. The deliberate contrast between the deep black base and the intensity of the accent colors mirrors the logic of the identity itself: structured and precise in its foundation, bold and experimental in its expression.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div className="flex items-center justify-between text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(0,0,0,0.18)" }}>
              <span>6&thinsp;Colors</span>
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

        {/* ════ BLOCK 2 — Full Palette Overview ════ */}
        <section
          className="flex flex-col px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between mb-12">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Color&thinsp;/&thinsp;Overview
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                01&thinsp;—&thinsp;Palette
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-6 mobile:grid-cols-2 gap-3">
            {COLORS.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.07} y={20}>
                <div
                  className="flex flex-col"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    document.getElementById(`color-${c.name.toLowerCase()}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  <motion.div
                    className="w-full rounded-sm"
                    style={{ backgroundColor: c.hex, height: 150 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  />
                  <div className="pt-4 flex flex-col gap-1.5">
                    <p className="text-[11px] tracking-[0.08em] text-black" style={{ fontWeight: 500 }}>
                      {c.name}
                    </p>
                    <p className="text-[10px] tracking-[0.06em]" style={{ color: "rgba(0,0,0,0.45)", fontWeight: 300 }}>
                      {c.hex}
                    </p>
                    <p className="text-[9px] tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.32)", fontWeight: 300 }}>
                      RGB&thinsp;{c.rgb}
                    </p>
                    <p className="text-[9px] tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.32)", fontWeight: 300 }}>
                      CMYK&thinsp;{c.cmyk}
                    </p>
                    <p className="text-[9px] tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.32)", fontWeight: 300 }}>
                      PANTONE&thinsp;·&thinsp;{c.pantone}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ════ BLOCK 3 — Individual color full-height blocks ════ */}
        {COLORS.map((c) => {
          const fg     = c.dark ? "#000000" : "#ffffff";
          const fgSub  = c.dark ? "rgba(0,0,0,0.5)"  : "rgba(255,255,255,0.5)";
          const fgMeta = c.dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)";
          const border = c.dark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)";

          return (
            <section
              key={c.name}
              id={`color-${c.name.toLowerCase()}`}
              className="min-h-screen flex flex-col justify-between px-14 py-10"
              style={{ backgroundColor: c.hex }}
            >
              <Reveal y={14}>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: fgMeta }}>
                    xCoAx_2027&thinsp;/&thinsp;Color&thinsp;/&thinsp;{c.name}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.08} y={40}>
                <div className="flex flex-col items-center justify-center text-center py-16">
                  <h3
                    className="leading-[0.88] tracking-tight"
                    style={{ fontSize: "clamp(4rem,10vw,9rem)", fontWeight: 500, color: fg }}
                  >
                    {c.name}
                  </h3>
                </div>
              </Reveal>

              <Reveal delay={0.18} y={16}>
                <div
                  className="flex items-end justify-between pt-6"
                  style={{ borderTop: `1px solid ${border}` }}
                >
                  <div className="flex flex-col gap-2 mobile:gap-4">
                    <p style={{ fontSize: 18, letterSpacing: "0.08em", textTransform: "uppercase", color: fg, fontWeight: 500 }}>
                      {c.hex}
                    </p>
                    <p style={{ fontSize: 18, letterSpacing: "0.06em", color: fgSub, fontWeight: 300 }}>
                      RGB&thinsp;{c.rgb}
                    </p>
                    <p style={{ fontSize: 18, letterSpacing: "0.06em", color: fgSub, fontWeight: 300 }}>
                      CMYK&thinsp;{c.cmyk}
                    </p>
                    <p style={{ fontSize: 18, letterSpacing: "0.06em", color: fgSub, fontWeight: 300 }}>
                      PANTONE&thinsp;·&thinsp;{c.pantone}
                    </p>
                  </div>
                  <span className="text-[10px] tracking-[0.28em] uppercase" style={{ color: fgMeta }}>
                    {COLORS.indexOf(c) + 1}&thinsp;/&thinsp;6
                  </span>
                </div>
              </Reveal>
            </section>
          );
        })}

        {/* ════ Footer ════ */}
        <section className="flex flex-col justify-center px-14 py-16">
          <Reveal y={18}>
            <div className="flex items-end justify-between mb-12 pb-5" style={{ borderBottom: LINE }}>
              <span className="text-[10px] tracking-[0.32em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Color&thinsp;/&thinsp;Summary
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                6&thinsp;Colors&thinsp;·&thinsp;Palette
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div
              className="mt-4 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(0,0,0,0.18)", borderTop: LINE, paddingTop: "1.25rem" }}
            >
              <span>xCoAx 2027&thinsp;—&thinsp;Brand Book</span>
              <span>End of Color&thinsp;↑</span>
            </div>
          </Reveal>
        </section>

      </motion.div>
    </div>
  );
}
