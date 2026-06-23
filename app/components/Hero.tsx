"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const CARDS = [
  { label: "Color System", tag: "Foundations", bg: "#0a0a0a", accent: "#f5f4f0", preview: "colors" },
  { label: "Typography", tag: "Type Scale", bg: "#1a1a2e", accent: "#e94560", preview: "type" },
  { label: "Logo Usage", tag: "Identity", bg: "#ff6b35", accent: "#ffffff", preview: "logo" },
  { label: "Components", tag: "UI Kit", bg: "#6c47ff", accent: "#ffffff", preview: "components" },
  { label: "Motion", tag: "Animation", bg: "#0d7377", accent: "#14ffec", preview: "motion" },
  { label: "Photography", tag: "Imagery", bg: "#f5f4f0", accent: "#0a0a0a", preview: "photo" },
];

function CardPreview({ type, accent, bg }: { type: string; accent: string; bg: string }) {
  if (type === "colors") {
    return (
      <div className="absolute inset-0 flex items-end p-6 gap-3">
        {["#0a0a0a", "#ff6b35", "#6c47ff", "#e94560", "#0d7377", "#f5f4f0"].map((c) => (
          <div key={c} className="flex-1 rounded-lg" style={{ height: 48, backgroundColor: c, border: "1px solid rgba(255,255,255,0.1)" }} />
        ))}
      </div>
    );
  }
  if (type === "type") {
    return (
      <div className="absolute inset-0 flex flex-col justify-center px-8">
        <div className="text-6xl font-black tracking-tight" style={{ color: accent, lineHeight: 1 }}>Aa</div>
        <div className="text-xs mt-3 uppercase tracking-widest opacity-60" style={{ color: accent }}>Display / Body / Caption</div>
      </div>
    );
  }
  if (type === "logo") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-5xl font-black tracking-tight" style={{ color: accent }}>BK</div>
      </div>
    );
  }
  if (type === "components") {
    return (
      <div className="absolute inset-0 flex flex-col items-start justify-center px-8 gap-3">
        <div className="rounded-full px-5 py-2 text-xs font-semibold" style={{ backgroundColor: accent, color: bg }}>Button Primary</div>
        <div className="rounded-full px-5 py-2 text-xs font-semibold border" style={{ borderColor: accent, color: accent }}>Button Ghost</div>
        <div className="rounded-lg px-4 py-2 text-xs w-full" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: accent, border: "1px solid rgba(255,255,255,0.15)" }}>Input field...</div>
      </div>
    );
  }
  if (type === "motion") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 rounded-2xl"
          style={{ backgroundColor: accent }}
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }
  if (type === "photo") {
    return (
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 p-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-md" style={{ backgroundColor: `hsl(${i * 40}, 12%, ${70 - i * 5}%)` }} />
        ))}
      </div>
    );
  }
  return null;
}

function StackCard({
  card,
  index,
  total,
  scrollYProgress,
}: {
  card: typeof CARDS[number];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const i = index;
  const progress = useTransform(scrollYProgress, [i / total, (i + 1) / total], [0, 1]);
  const y = useTransform(progress, [0, 1], [i * 14, -60]);
  const rotate = useTransform(progress, [0, 1], [i % 2 === 0 ? -i * 1.2 : i * 0.8, 0]);
  const scale = useTransform(progress, [0, 1], [1 - i * 0.025, 1]);
  const opacity = useTransform(progress, [0.8, 1], [1, 0]);

  return (
    <motion.div
      className="absolute inset-x-0 rounded-2xl overflow-hidden cursor-pointer"
      style={{
        height: 340,
        y,
        rotate,
        scale,
        opacity,
        zIndex: i,
        backgroundColor: card.bg,
        transformOrigin: "bottom center",
      }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <CardPreview type={card.preview} accent={card.accent} bg={card.bg} />
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
      >
        <span className="text-white font-semibold text-lg">{card.label}</span>
        <span
          className="text-xs uppercase tracking-widest px-3 py-1 rounded-full"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: card.accent }}
        >
          {card.tag}
        </span>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <section ref={containerRef} className="relative min-h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-between pt-20 pb-12 px-8">
        {/* Header */}
        <div className="flex items-start justify-between mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.95] tracking-tight text-black">
              Brand<br />Identity
            </h1>
            <p className="mt-4 text-neutral-400 text-sm max-w-xs">
              A complete visual language system. Scroll to explore each section.
            </p>
          </motion.div>
          <motion.div
            className="text-right"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="text-xs uppercase tracking-widest text-neutral-400">Version</div>
            <div className="text-2xl font-black">2.0</div>
            <div className="text-xs text-neutral-400 mt-1">2026 Edition</div>
          </motion.div>
        </div>

        {/* Stacked cards */}
        <div className="relative flex-1 flex items-center justify-center">
          <div className="relative w-full max-w-2xl" style={{ height: 380 }}>
            {CARDS.map((card, i) => (
              <StackCard
                key={card.label}
                card={card}
                index={i}
                total={CARDS.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>

        {/* Bottom strip */}
        <div className="flex items-center justify-between text-xs text-neutral-400 uppercase tracking-widest">
          <span>Scroll to explore</span>
          <span>6 sections · Complete system</span>
          <span>BK·Studio 2026</span>
        </div>
      </div>
    </section>
  );
}
