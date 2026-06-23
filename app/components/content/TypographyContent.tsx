"use client";
import Image from "next/image";
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

// ─── Mobile-only logo carousel ────────────────────────────────────────
const LOGO_SLIDES = [
  { bg: "#ffffff", border: LINE,   src: "/LOGObranco.png", alt: "xCoAx 2027 — Logo on white", label: "On White", hex: "#ffffff", labelColor: "#000000", borderTop: LINE },
  { bg: "#000000", border: "none", src: "/LOGOpreto.png",  alt: "xCoAx 2027 — Logo on black", label: "On Black", hex: "#000000", labelColor: "#ffffff", borderTop: "1px solid rgba(255,255,255,0.1)" },
];

function MobileLogoCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (delta > 40 && current < LOGO_SLIDES.length - 1) setCurrent((c) => c + 1);
    if (delta < -40 && current > 0) setCurrent((c) => c - 1);
    touchStartX.current = null;
  };

  return (
    <div className="mt-4">
      <div
        className="relative overflow-hidden rounded"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex"
          animate={{ x: `-${current * 100}%` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          style={{ willChange: "transform" }}
        >
          {LOGO_SLIDES.map((slide) => (
            <div
              key={slide.label}
              className="w-full shrink-0 flex flex-col"
              style={{ backgroundColor: slide.bg, border: slide.border, borderRadius: 4 }}
            >
              <div className="flex items-center justify-center" style={{ padding: "2rem", minHeight: 280 }}>
                <div style={{ width: 160, height: 200, position: "relative", flexShrink: 0 }}>
                  <Image src={slide.src} alt={slide.alt} fill className="object-contain object-center" priority />
                </div>
              </div>
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: slide.borderTop }}
              >
                <span className="text-[12px] font-medium tracking-[0.3em] uppercase" style={{ color: slide.labelColor }}>{slide.label}</span>
                <span className="text-[12px] font-medium tracking-[0.28em]" style={{ color: slide.labelColor }}>{slide.hex}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {LOGO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              backgroundColor: i === current ? "#000000" : "rgba(0,0,0,0.2)",
              border: "none", padding: 0, cursor: "pointer",
              transition: "background-color 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function TypographyContent() {
  const [contentReady, setContentReady] = useState(false);

  return (
    <div className="bg-white" style={{ fontFamily: "var(--font-dm-mono), monospace" }}>

      {/* ════ BLOCK 1 — Intro ════ */}
      <section
        className="relative min-h-screen flex flex-col justify-between px-14 py-10"
        style={{ borderBottom: LINE }}
      >
        <SectionBands sectionId="typography" />
        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
            xCoAx_2027&thinsp;/&thinsp;Brand&nbsp;Book&thinsp;/&thinsp;Logo
          </span>
          <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
            02&thinsp;—&thinsp;Introduction
          </span>
        </div>

        <TypewriterTitle
          text="Logo"
          className="brand-title font-medium leading-[0.88] tracking-tight text-black"
          style={{ fontSize: "clamp(4.5rem,11vw,9.5rem)" }}
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
              <p className="text-[12px] leading-[2.1] tracking-[0.04em] max-w-lg" style={{ color: "rgba(0,0,0,0.45)" }}>
                The xCoAx 2027 logo combines the Aesthetics X with the conference wordmark. Stripped of complexity and reduced to its essential form, the logo functions clearly across all scales — from large format print to small dimensional contexts such as credentials or digital favicons.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div className="flex items-center justify-between text-[10px] tracking-[0.28em] uppercase" style={{ color: "rgba(0,0,0,0.18)" }}>
              <span>Mark&thinsp;·&thinsp;Wordmark&thinsp;·&thinsp;Clear space</span>
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

        {/* ════ BLOCK 2 — Full Logo (white + black) ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Logo&thinsp;/&thinsp;Full&nbsp;Logo
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                01&thinsp;—&thinsp;Versions
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={32}>
            {/* Mobile: swipeable carousel */}
            <div className="hidden mobile:block">
              <MobileLogoCarousel />
            </div>
            {/* Desktop: side-by-side */}
            <div className="flex gap-4 mt-4 mobile:hidden">

              <div
                className="flex-1 flex flex-col"
                style={{ backgroundColor: "#ffffff", borderRadius: 4, border: LINE }}
              >
                <div className="flex items-center justify-center" style={{ padding: "2rem" }}>
                  <div style={{ width: 220, height: 260, position: "relative", flexShrink: 0 }}>
                    <Image
                      src="/LOGObranco.png"
                      alt="xCoAx 2027 — Logo on white"
                      fill
                      className="object-contain object-center"
                      priority
                    />
                  </div>
                </div>
                <div
                  className="px-7 py-4 flex items-center justify-between shrink-0"
                  style={{ borderTop: LINE }}
                >
                  <span className="text-[12px] font-medium tracking-[0.3em] uppercase" style={{ color: "#000000" }}>
                    On White
                  </span>
                  <span className="text-[12px] font-medium tracking-[0.28em]" style={{ color: "#000000" }}>
                    #ffffff
                  </span>
                </div>
              </div>

              <div
                className="flex-1 flex flex-col"
                style={{ backgroundColor: "#000000", borderRadius: 4 }}
              >
                <div className="flex items-center justify-center" style={{ padding: "2rem" }}>
                  <div style={{ width: 220, height: 260, position: "relative", flexShrink: 0 }}>
                    <Image
                      src="/LOGOpreto.png"
                      alt="xCoAx 2027 — Logo on black"
                      fill
                      className="object-contain object-center"
                      priority
                    />
                  </div>
                </div>
                <div
                  className="px-7 py-4 flex items-center justify-between shrink-0"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <span className="text-[12px] font-medium tracking-[0.3em] uppercase" style={{ color: "#ffffff" }}>
                    On Black
                  </span>
                  <span className="text-[12px] font-medium tracking-[0.28em]" style={{ color: "#ffffff" }}>
                    #000000
                  </span>
                </div>
              </div>

            </div>{/* end desktop flex */}
          </Reveal>

          <Reveal delay={0.28} y={10}>
            <div className="body-row flex items-start gap-14 mt-8">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[11px] leading-[2.0] tracking-[0.03em]" style={{ color: "rgba(0,0,0,0.45)", maxWidth: 760 }}>
                The full logo combines the Aesthetics X with the xCoAx wordmark, forming the primary mark of the identity. It exists in two versions — on white and on black — ensuring consistent legibility and visual impact across both light and dark applications, from printed materials to digital interfaces.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ════ BLOCK 3 — Symbol ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Logo&thinsp;/&thinsp;Symbol
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                02&thinsp;—&thinsp;Mark
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={40}>
            <div className="flex items-center justify-center py-8">
              <Image
                src="/AESTHETICS_X.png"
                alt="xCoAx 2027 — Symbol"
                width={240}
                height={240}
                className="object-contain h-auto"
                style={{ width: 240, maxHeight: "42vh", mixBlendMode: "multiply" }}
              />
            </div>
          </Reveal>

          <Reveal delay={0.2} y={18}>
            <div className="body-row flex items-start gap-14">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[12px] leading-[2.1] tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.45)", maxWidth: 760 }}>
                The symbol is the letter X in its most distilled form — isolated from the wordmark and reduced to its purest expression. While the full logo combines the X with the conference name, the symbol operates independently in contexts where the identity needs to be communicated with maximum economy, such as favicons, stamps, embossing or small scale digital applications. Despite its simplicity, the symbol retains the conceptual DNA of the full identity system — it is the same X that anchors the wordmark, and by extension, the same form from which the entire visual language of xCoAx 2027 is built.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ════ BLOCK 4 — Wordmark ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Logo&thinsp;/&thinsp;Wordmark
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                03&thinsp;—&thinsp;Type
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={40}>
            <div className="flex items-center justify-center py-10">
              <Image
                src="/WORDMARK.png"
                alt="xCoAx 2027 — Wordmark"
                width={340}
                height={113}
                className="object-contain h-auto"
                style={{ width: 340, maxHeight: "25vh", mixBlendMode: "multiply" }}
              />
            </div>
          </Reveal>

          <Reveal delay={0.2} y={18}>
            <div className="body-row flex items-start gap-14">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[12px] leading-[2.1] tracking-[0.04em]" style={{ color: "rgba(0,0,0,0.45)", maxWidth: 760 }}>
                The wordmark is a standalone typographic version of the xCoAx identity, designed for contexts where the symbol is already present as a visual element or where a cleaner, more restrained application is required. By isolating the logotype, the wordmark offers a lighter alternative that maintains brand recognition without adding visual complexity. This flexibility is essential in situations such as body text captions, digital interfaces, or layouts where the Aesthetics X is already functioning as the dominant graphic element. The wordmark should never be used as a replacement for the full logo in primary brand contexts, but rather as a considered alternative that serves the visual balance of each specific application.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ════ BLOCK 5 — Clear space (3-column grid) ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Logo&thinsp;/&thinsp;Clear&nbsp;Space
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                04&thinsp;—&thinsp;Spacing
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-3 gap-6 flex-1 my-8">
            {[
              { label: "Full Logo",  src: "/LOGO_CLEARSPACE.png",     w: 260, h: 195 },
              { label: "Symbol",     src: "/SYMBOL_CLEARSPACE.png",   w: 220, h: 220 },
              { label: "Wordmark",   src: "/WORDMARK_CLEARSPACE.png", w: 260, h: 116 },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 0.08} y={22}>
                <div
                  className="flex flex-col h-full"
                  style={{
                    borderRight: i < 2 ? LINE : "none",
                    paddingRight: i < 2 ? "1.5rem" : 0,
                  }}
                >
                  <p className="text-[10px] tracking-[0.3em] uppercase mb-5" style={{ color: "rgba(0,0,0,0.28)" }}>
                    {item.label}
                  </p>
                  <div className="flex items-center justify-center flex-1">
                    <Image
                      src={item.src}
                      alt={`xCoAx 2027 — ${item.label} clear space`}
                      width={item.w}
                      height={item.h}
                      className="object-contain h-auto"
                      style={{ maxWidth: "100%", maxHeight: "42vh", mixBlendMode: "multiply" }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.28} y={14}>
            <div className="body-row flex items-start gap-10">
              <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
              <p className="text-[11px] leading-[2.0] tracking-[0.03em]" style={{ color: "rgba(0,0,0,0.45)", maxWidth: 760 }}>
                To ensure the integrity and legibility of the identity across all applications, a minimum clear space must be maintained around the logo, symbol and wordmark at all times. This space is defined by one and a half times the width of the X in the xCoAx wordmark, establishing a margin that is intrinsic to the identity itself rather than arbitrary. This unit of measurement should be respected consistently across all three versions, preventing surrounding elements from compromising the visual balance and impact of the mark.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ════ BLOCK 6 — Minimum Size ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Logo&thinsp;/&thinsp;Minimum&nbsp;Size
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                05&thinsp;—&thinsp;Minimum Size
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={28}>
            <div className="flex items-end gap-24 py-8">

              {/* Full Logo */}
              <div className="flex flex-col gap-4">
                <div className="flex items-end" style={{ height: 64 }}>
                  <Image
                    src="/LOGObranco.png"
                    alt="xCoAx 2027 — Full Logo minimum size"
                    width={507}
                    height={671}
                    className="object-contain"
                    style={{ width: "auto", height: 32, mixBlendMode: "multiply" }}
                  />
                </div>
                <p className="text-[10px] tracking-[0.1em]" style={{ color: "rgba(0,0,0,0.4)", fontWeight: 300 }}>
                  Digital&thinsp;:&thinsp;32px&thinsp;·&thinsp;Print&thinsp;:&thinsp;20mm
                </p>
                <p className="text-[9px] tracking-[0.22em] uppercase" style={{ color: "rgba(0,0,0,0.22)" }}>
                  Full Logo
                </p>
              </div>

              {/* Symbol */}
              <div className="flex flex-col gap-4">
                <div className="flex items-end" style={{ height: 64 }}>
                  <Image
                    src="/AESTHETICS_X.png"
                    alt="xCoAx 2027 — Symbol minimum size"
                    width={618}
                    height={546}
                    className="object-contain"
                    style={{ width: "auto", height: 32, mixBlendMode: "multiply" }}
                  />
                </div>
                <p className="text-[10px] tracking-[0.1em]" style={{ color: "rgba(0,0,0,0.4)", fontWeight: 300 }}>
                  Digital&thinsp;:&thinsp;32px&thinsp;·&thinsp;Print&thinsp;:&thinsp;20mm
                </p>
                <p className="text-[9px] tracking-[0.22em] uppercase" style={{ color: "rgba(0,0,0,0.22)" }}>
                  Symbol
                </p>
              </div>

              {/* Wordmark */}
              <div className="flex flex-col gap-4">
                <div className="flex items-end" style={{ height: 64 }}>
                  <Image
                    src="/WORDMARK.png"
                    alt="xCoAx 2027 — Wordmark minimum size"
                    width={340}
                    height={113}
                    className="object-contain"
                    style={{ width: "auto", height: 32, mixBlendMode: "multiply" }}
                  />
                </div>
                <p className="text-[10px] tracking-[0.1em]" style={{ color: "rgba(0,0,0,0.4)", fontWeight: 300 }}>
                  Digital&thinsp;:&thinsp;32px&thinsp;·&thinsp;Print&thinsp;:&thinsp;20mm
                </p>
                <p className="text-[9px] tracking-[0.22em] uppercase" style={{ color: "rgba(0,0,0,0.22)" }}>
                  Wordmark
                </p>
              </div>

            </div>
          </Reveal>

          <Reveal delay={0.22} y={14}>
            <div className="flex items-end justify-between gap-10">
              <div className="body-row flex items-start gap-10">
                <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
                <p className="text-[11px] leading-[2.0] tracking-[0.03em]" style={{ color: "rgba(0,0,0,0.45)", maxWidth: 760 }}>
                  The minimum size ensures the X remains clearly recognizable across all applications, from large format print to the smallest digital touchpoints such as navigation icons and favicons.
                </p>
              </div>
              <span className="shrink-0 text-[9px] tracking-[0.24em] uppercase text-right" style={{ color: "rgba(0,0,0,0.3)" }}>
                Digital&thinsp;·&thinsp;Print
              </span>
            </div>
          </Reveal>
        </section>

        {/* ════ BLOCK 7 — Footer ════ */}
        <section className="flex flex-col justify-center px-14 py-16">
          <Reveal y={18}>
            <div className="flex items-end justify-between mb-12 pb-5" style={{ borderBottom: LINE }}>
              <span className="text-[10px] tracking-[0.32em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Logo&thinsp;/&thinsp;Summary
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                Mark&thinsp;·&thinsp;Wordmark&thinsp;·&thinsp;Clear space
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div
              className="mt-4 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(0,0,0,0.18)", borderTop: LINE, paddingTop: "1.25rem" }}
            >
              <span>xCoAx 2027&thinsp;—&thinsp;Brand Book</span>
              <span>End of Logo&thinsp;↑</span>
            </div>
          </Reveal>
        </section>

      </motion.div>
    </div>
  );
}
