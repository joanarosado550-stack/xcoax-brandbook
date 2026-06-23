"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect, useCallback, CSSProperties } from "react";
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
  threshold = 80,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  threshold?: number;
}) {
  const { ref, visible } = useScrollReveal(threshold);
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

// ─── Shared constants ──────────────────────────────────────────────────
const LINE = "1px solid rgba(0,0,0,0.08)";
const FONT = "var(--font-dm-mono), monospace";

// ─── Image placeholder ─────────────────────────────────────────────────
function ImgPlaceholder({
  label = "Image",
  style,
}: {
  label?: string;
  style?: CSSProperties;
}) {
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
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.18)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Shared bottom row: description + context label ────────────────────
function BottomRow({
  description,
  context,
  delay = 0.22,
}: {
  description: string;
  context: string;
  delay?: number;
}) {
  return (
    <Reveal delay={delay} y={14} threshold={10}>
      <div className="flex items-end justify-between gap-10">
        <div className="body-row flex items-start gap-10">
          <div className="h-px w-10 mt-2.5 shrink-0" style={{ backgroundColor: "rgba(0,0,0,0.18)" }} />
          <p
            className="text-[11px] leading-[2.0] tracking-[0.03em]"
            style={{ maxWidth: 760, color: "rgba(0,0,0,0.45)" }}
          >
            {description}
          </p>
        </div>
        <span
          className="shrink-0 text-[9px] tracking-[0.24em] uppercase text-right"
          style={{ color: "rgba(0,0,0,0.3)" }}
        >
          {context}
        </span>
      </div>
    </Reveal>
  );
}

// ─── Viewport-triggered video ─────────────────────────────────────────
function ViewportVideo({ src, type = "video/mp4", loop = false, style }: { src: string; type?: string; loop?: boolean; style?: CSSProperties }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video ref={videoRef} muted playsInline preload="auto" loop={loop} style={style}>
      <source src={src} type={type} />
    </video>
  );
}

// ─── Main component ────────────────────────────────────────────────────
export default function PhotoContent() {
  const [contentReady, setContentReady] = useState(false);

  return (
    <div className="bg-white" style={{ fontFamily: FONT }}>

      {/* ════ BLOCK 1 — Intro ════ */}
      <section
        className="relative min-h-screen flex flex-col justify-between px-14 py-10"
        style={{ borderBottom: LINE }}
      >
        <SectionBands sectionId="photo" />

        <div className="flex items-center justify-between">
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
            xCoAx_2027&thinsp;/&thinsp;Brand&nbsp;Book&thinsp;/&thinsp;Applications
          </span>
          <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
            06&thinsp;—&thinsp;Introduction
          </span>
        </div>

        <TypewriterTitle
          text="Applications"
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
              <p
                className="text-[12px] leading-[2.1] tracking-[0.04em]"
                style={{ color: "rgba(0,0,0,0.45)", maxWidth: 760 }}
              >
                The applications section demonstrates the xCoAx 2027 identity in use across physical and digital contexts. From the conference hall to social media, each application translates the same conceptual foundation — computation, communication and aesthetics — into a context-specific expression, while remaining consistent with the system as a whole.
</p>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div
              className="flex items-center justify-between text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(0,0,0,0.18)" }}
            >
              <span>Poster&thinsp;·&thinsp;Credentials&thinsp;·&thinsp;Photography&thinsp;·&thinsp;Digital&thinsp;·&thinsp;Stationery</span>
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

        {/* ════ BLOCK 2 — Conference Hall ════ */}
        <section
          className="h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Applications&thinsp;/&thinsp;Conference&nbsp;Hall
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                01&thinsp;—&thinsp;Conference Hall
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={32}>
            <div style={{ width: "100%", backgroundColor: "#000000", borderRadius: 4, display: "flex", justifyContent: "center" }}>
              <ViewportVideo
                src="/conferenciamock_1.mp4"
                style={{ width: "60%", height: "auto", objectFit: "contain", display: "block" }}
              />
            </div>
          </Reveal>

          <BottomRow
            description="The xCoAx 2027 identity extends into the physical conference space in Évora, with the Density Composition projected on the main stage screen — transforming the auditorium itself into an expression of the conference's visual language."
            context="Physical Application&thinsp;·&thinsp;Conference Hall"
          />
        </section>

        {/* ════ BLOCK 3 — Credentials ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Applications&thinsp;/&thinsp;Credentials
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                02&thinsp;—&thinsp;Credentials
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={32}>
            <div className="flex gap-3" style={{ height: "56vh", minHeight: 260 }}>
              <div style={{ flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image
                  src="/credentialsmockup.png"
                  alt="xCoAx 2027 — Conference Credentials"
                  width={1024}
                  height={1024}
                  className="object-contain"
                  style={{ maxHeight: "100%", width: "auto" }}
                />
              </div>
              <video
                src="/Comp 1_1.mov"
                autoPlay
                loop
                muted
                playsInline
                style={{
                  flex: 1,
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 4,
                }}
              />
            </div>
          </Reveal>

          <BottomRow
            description="The conference credential system extends the identity to physical event materials, including the attendee badge and wristband. Built using the same ASCII logic and color palette, these credentials maintain visual consistency between the digital and physical experience of the conference."
            context="Conference Credentials&thinsp;·&thinsp;Badge &amp; Wristband"
          />
        </section>

        {/* ════ BLOCK 4 — Merchandise ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Applications&thinsp;/&thinsp;Merchandise
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                03&thinsp;—&thinsp;Merchandise
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={32}>
            <div className="flex gap-5">
              {[
                { src: "/totemockup.png",    alt: "xCoAx 2027 — Tote Bag",  w: 6000, h: 4500 },
                { src: "/stickermockup.png", alt: "xCoAx 2027 — Stickers",  w: 2000, h: 2000 },
                { src: "/Tshirtmockup.png",  alt: "xCoAx 2027 — T-Shirt",   w: 2000, h: 2000 },
              ].map((img) => (
                <div key={img.src} className="relative flex-1" style={{ height: 500 }}>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <BottomRow
            description="The merchandise collection extends the xCoAx 2027 identity into everyday objects — a tote bag, laptop stickers and a t-shirt — carrying the ASCII visual language beyond the conference space and into the daily life of its attendees."
            context="Physical Application&thinsp;·&thinsp;Branded Merchandise"
          />
        </section>

        {/* ════ BLOCK 5 — Photography ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Applications&thinsp;/&thinsp;Photography
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                04&thinsp;—&thinsp;Photography
              </span>
            </div>
          </Reveal>

          {/* Three main images + callout */}
          <Reveal delay={0.1} y={28}>
            <div className="flex gap-3" style={{ height: "50vh", minHeight: 240 }}>
              {/* Image 1 */}
              <div style={{ flex: 1, height: "100%" }}>
                <Image
                  src="/photo1.png"
                  alt="xCoAx 2027 — Photography 01"
                  width={1200}
                  height={1200}
                  className="object-cover"
                  style={{ width: "100%", height: "100%", borderRadius: 4 }}
                />
              </div>
              {/* Image 2 */}
              <div style={{ flex: 1, height: "100%" }}>
                <Image
                  src="/photo2.png"
                  alt="xCoAx 2027 — Photography 02"
                  width={1200}
                  height={1200}
                  className="object-cover"
                  style={{ width: "100%", height: "100%", borderRadius: 4 }}
                />
              </div>
              {/* Image 3 */}
              <div style={{ flex: 1, height: "100%" }}>
                <Image
                  src="/photo3.png"
                  alt="xCoAx 2027 — Photography 03"
                  width={1200}
                  height={1200}
                  className="object-cover"
                  style={{ width: "100%", height: "100%", borderRadius: 4 }}
                />
              </div>
            </div>
          </Reveal>

          <BottomRow
            description="The xCoAx 2027 photography treatment renders all imagery in black and white, with ASCII characters tracing the edges of the human form. This technique extends the computational language of the identity into the photographic medium, blurring the line between captured image and generated form."
            context="Black &amp; White&thinsp;·&thinsp;ASCII Edge Treatment"
          />
        </section>

        {/* ════ BLOCK 6 — Social Media ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Applications&thinsp;/&thinsp;Social&nbsp;Media
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                05&thinsp;—&thinsp;Social Media
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={32}>
            <div className="flex gap-6 items-end justify-center" style={{ minHeight: "56vh" }}>
              {/* Left — Profile Picture (square) */}
              <div className="flex flex-col gap-2 items-center" style={{ flex: "0 0 auto", width: "28%" }}>
                <Image
                  src="/insta_profilepic.png"
                  alt="xCoAx 2027 — Instagram Profile Picture"
                  width={1024}
                  height={1024}
                  className="object-contain"
                  style={{ width: "100%", height: "auto", maxHeight: "56vh" }}
                />
              </div>
              {/* Right — Instagram Post (9:16 portrait) */}
              <div className="flex flex-col gap-2 items-center" style={{ flex: "0 0 auto", width: "28%" }}>
                <Image
                  src="/insta_mockup.png"
                  alt="xCoAx 2027 — Instagram Post Mockup"
                  width={1080}
                  height={1920}
                  className="object-contain"
                  style={{ width: "100%", height: "auto", maxHeight: "56vh" }}
                />
              </div>
            </div>
          </Reveal>

          <BottomRow
            description="The identity adapts to social media through a consistent visual language — the ASCII bands, the Aesthetics X and the color palette appear across profile imagery and content, ensuring the conference maintains a recognizable presence across digital platforms."
            context="Digital Application&thinsp;·&thinsp;Social Media"
          />
        </section>

        {/* ════ BLOCK 7 — Instagram Posts ════ */}
        <section
          className="min-h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Applications&thinsp;/&thinsp;Instagram&nbsp;Posts
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                06&thinsp;—&thinsp;Instagram Posts
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={32}>
            <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ViewportVideo
                src="/insta_posts_1.mp4"
                loop
                style={{ maxWidth: "100%", maxHeight: "56vh", objectFit: "contain", display: "block", borderRadius: 4 }}
              />
            </div>
          </Reveal>

          <BottomRow
            description="Instagram content applies the identity's motion and texture system to short-form video, demonstrating how the ASCII graphic language translates into dynamic, platform-native formats."
            context="Digital Application&thinsp;·&thinsp;Social Media"
          />
        </section>

        {/* ════ BLOCK 8 — Conference Website ════ */}
        <section
          className="h-screen flex flex-col justify-between px-14 py-10"
          style={{ borderBottom: LINE }}
        >
          <Reveal y={14}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "rgba(0,0,0,0.28)" }}>
                xCoAx_2027&thinsp;/&thinsp;Applications&thinsp;/&thinsp;Conference&nbsp;Website
              </span>
              <span className="text-[10px] tracking-[0.28em]" style={{ color: "rgba(0,0,0,0.18)" }}>
                07&thinsp;—&thinsp;Conference Website
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} y={32}>
            <div style={{ width: "100%", backgroundColor: "#000000", borderRadius: 4, display: "flex", justifyContent: "center" }}>
              <ViewportVideo
                src="/computermockup.mp4"
                loop
                style={{ width: "80%", height: "auto", objectFit: "contain", display: "block" }}
              />
            </div>
          </Reveal>

          <BottomRow
            description="The conference website applies the full identity system to a digital, interactive context — translating the ASCII texture, typewriter interactions and color palette into a cohesive online experience for attendees and visitors."
            context="Digital Application&thinsp;·&thinsp;Conference Website"
          />
        </section>

        {/* ════ Footer ════ */}
        <section className="flex flex-col justify-center px-14 py-16">
          <Reveal y={18}>
            <div
              className="flex items-end justify-between mb-12 pb-5"
              style={{ borderBottom: LINE }}
            >
              <span
                className="text-[10px] tracking-[0.32em] uppercase"
                style={{ color: "rgba(0,0,0,0.28)" }}
              >
                xCoAx_2027&thinsp;/&thinsp;Applications&thinsp;/&thinsp;Summary
              </span>
              <span
                className="text-[10px] tracking-[0.28em]"
                style={{ color: "rgba(0,0,0,0.18)" }}
              >
                Poster&thinsp;·&thinsp;Credentials&thinsp;·&thinsp;Photography&thinsp;·&thinsp;Digital&thinsp;·&thinsp;Stationery
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.12} y={10}>
            <div
              className="mt-4 flex items-center justify-between text-[10px] tracking-[0.28em] uppercase"
              style={{ color: "rgba(0,0,0,0.18)", borderTop: LINE, paddingTop: "1.25rem" }}
            >
              <span>xCoAx 2027&thinsp;—&thinsp;Brand Book</span>
              <span>End of Applications&thinsp;↑</span>
            </div>
          </Reveal>
        </section>

      </motion.div>
    </div>
  );
}
