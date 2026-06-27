"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { TypewriterTitle } from "./TypewriterTitle";
import { SectionBands } from "./SectionBands";

// ─── Custom scroll-reveal hook ─────────────────────────────────────────
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

    const elRect  = el.getBoundingClientRect();
    const bottom  = scroller
      ? scroller.getBoundingClientRect().bottom
      : window.innerHeight;

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

// ─── Data ──────────────────────────────────────────────────────────────
const X_DATA = [
  {
    id: "computation",
    index: "01",
    name: "Computation X",
    image: "/COMPUTATION_X.png",
    imageLeft: true,
    description:
      "Built from characters rooted in code and mathematical logic, the Computation X reflects precision, structure and systematic thinking. Every character is placed with intention, forming a mark that feels grid-strict and algorithmically ordered.",
    characters: "0 + = 1 - >",
  },
  {
    id: "communication",
    index: "02",
    name: "Communication X",
    image: "/COMMUNICATION_X.png",
    imageLeft: false,
    description:
      "Constructed from symbols drawn from written language and human expression, the Communication X represents the exchange of meaning between people. Its character choices feel familiar and readable, suggesting dialogue, notation and the flow of information.",
    characters: "@ * : #",
  },
  {
    id: "aesthetics",
    index: "03",
    name: "Aesthetics X",
    image: "/AESTHETICS_X.png",
    imageLeft: true,
    description:
      "The Aesthetics X emerges from the overlay of the Computation and Communication X's, combining both character sets into a single, more complex mark. It is not designed but generated — the result of two systems converging — embodying the conference's central idea that aesthetics arises at the intersection of logic and language.",
    characters: "0 + = 1 - > @ * : #",
  },
];

const LINE = "1px solid rgba(0,0,0,0.08)";

// ─── Main component ────────────────────────────────────────────────────
export default function ColorsContent() {
  const [contentReady, setContentReady] = useState(false);

  return (
    <div className="bg-white" style={{ fontFamily: "var(--font-dm-mono), monospace" }}>

      {/* ════ BLOCK 1 — Intro ════ */}
      <section
        className="relative min-h-screen flex flex-col justify-between px-14 py-10"
        style={{ borderBottom: LINE }}
      >
        <SectionBands sectionId="colors" />
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
            xCoAx_2027&thinsp;/&thinsp;Brand&nbsp;Book&thinsp;/&thinsp;Concept
          </span>
          <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
            01&thinsp;—&thinsp;Introduction
          </span>
        </div>

        {/* Typewriter title */}
        <TypewriterTitle
          text="Concept"
          className="brand-title font-medium leading-[0.88] tracking-tight text-black"
          style={{ fontSize: "clamp(4.5rem,11vw,9.5rem)" }}
          onDone={() => setContentReady(true)}
        />

        {/* Body + bottom — fade in after title finishes */}
        <motion.div
          className="flex flex-col gap-8"
          initial={{ opacity: 0, y: 10 }}
          animate={contentReady ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Reveal delay={0.05} y={20}>
            <div className="body-row flex items-start gap-14">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[12px] leading-[2.1] tracking-[0.04em] max-w-lg" style={{ color: "rgba(0,0,0,0.45)" }}>
                The identity system of xCoAx 2027 is built around three distinct variations of the letter X, each one representing a core pillar of the conference. Constructed through the logic of ASCII art, every X is defined by a specific set of characters that reflect the nature of its domain — making the mark itself an expression of the concept it embodies.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div className="flex items-center justify-between text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(0,0,0,0.18)" }}>
              <span>3&thinsp;Pillars</span>
              <span>Scroll to explore&thinsp;↓</span>
            </div>
          </Reveal>
        </motion.div>
      </section>

      {/* ════ All remaining blocks — visible after title types ════ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={contentReady ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
      >

        {/* ════ BLOCKS 2–4 — X sections ════ */}
        {X_DATA.map((x) => {
          const imgBlock = (
            <div className="x-img-wrap flex-1 flex items-center justify-center p-12">
              <Reveal y={32}>
                <Image
                  src={x.image}
                  alt={x.name}
                  width={580}
                  height={500}
                  className="x-img object-contain w-full h-auto"
                  style={{ mixBlendMode: "multiply", maxHeight: "62vh" }}
                  priority={x.index === "01"}
                />
              </Reveal>
            </div>
          );

          const txtBlock = (
            <div
              className="x-text flex flex-col justify-center px-14 py-12 shrink-0"
              style={{
                width: 300,
                borderLeft:  x.imageLeft ? LINE : "none",
                borderRight: x.imageLeft ? "none" : LINE,
              }}
            >
              <Reveal delay={0.16} y={18}>
                <p className="text-[10px] tracking-[0.35em] uppercase mb-5" style={{ color: "rgba(0,0,0,0.28)" }}>
                  {x.index}&thinsp;/&thinsp;03
                </p>
                <h3 className="font-medium tracking-[0.1em] uppercase leading-tight mb-5" style={{ fontSize: "1.05rem" }}>
                  {x.name}
                </h3>
                <div className="mb-5" style={{ height: 1, width: 28, backgroundColor: "rgba(0,0,0,0.18)" }} />
                <p className="text-[11px] leading-[2.05] tracking-[0.03em]" style={{ color: "rgba(0,0,0,0.45)" }}>
                  {x.description}
                </p>
                <div className="mt-4">
                  <p className="text-[9px] tracking-[0.22em] uppercase mb-1.5" style={{ color: "rgba(0,0,0,0.28)", fontWeight: 300 }}>
                    Characters
                  </p>
                  <p className="text-[13px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.55)", fontWeight: 300 }}>
                    {x.characters}
                  </p>
                </div>
              </Reveal>
            </div>
          );

          return (
            <section key={x.id} className="min-h-screen flex x-block snap-block" style={{ borderBottom: LINE }}>
              {x.imageLeft ? <>{imgBlock}{txtBlock}</> : <>{txtBlock}{imgBlock}</>}
            </section>
          );
        })}

        {/* ════ BLOCK 5 — Summary ════ */}
        <section className="min-h-screen flex flex-col justify-center px-14 py-16">

          <Reveal y={18}>
            <div className="flex items-end justify-between mb-12 pb-5" style={{ borderBottom: LINE }}>
              <span className="text-[10px] tracking-[0.32em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Concept&thinsp;/&thinsp;Summary
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                Three pillars
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-3 mobile:grid-cols-1 mobile:gap-8">
            {X_DATA.map((x, i) => (
              <Reveal key={x.id} delay={i * 0.1} y={22}>
                <div
                  className="flex flex-col x-summary-item"
                  style={{
                    borderRight: i < 2 ? LINE : "none",
                    paddingRight: i < 2 ? "2.5rem" : 0,
                    paddingLeft:  i > 0 ? "2.5rem" : 0,
                  }}
                >
                  <div className="flex items-center justify-center py-10">
                    <Image
                      src={x.image}
                      alt={x.name}
                      width={300}
                      height={260}
                      className="object-contain w-full h-auto"
                      style={{ mixBlendMode: "multiply", maxHeight: "26vh" }}
                    />
                  </div>
                  <div className="pt-5" style={{ borderTop: LINE }}>
                    <p className="text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "rgba(0,0,0,0.28)" }}>
                      {x.index}
                    </p>
                    <p className="text-[13px] font-medium tracking-[0.1em] uppercase">{x.name}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.35} y={10}>
            <div
              className="mt-16 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(0,0,0,0.18)", borderTop: LINE, paddingTop: "1.25rem" }}
            >
              <span>xCoAx 2027&thinsp;—&thinsp;Brand Book</span>
              <span>End of Concept&thinsp;↑</span>
            </div>
          </Reveal>

        </section>

      </motion.div>
    </div>
  );
}
