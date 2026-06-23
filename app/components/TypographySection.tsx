"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const TYPE_SCALE = [
  { name: "Display", size: "96px / 6rem", weight: "900", sample: "Clarity in motion", tag: "font-black" },
  { name: "Headline", size: "60px / 3.75rem", weight: "800", sample: "Bold decisions", tag: "font-extrabold" },
  { name: "Title", size: "36px / 2.25rem", weight: "700", sample: "Brand voice matters", tag: "font-bold" },
  { name: "Body Large", size: "20px / 1.25rem", weight: "400", sample: "Every pixel is intentional — from the first impression to the final interaction.", tag: "font-normal" },
  { name: "Body", size: "16px / 1rem", weight: "400", sample: "Consistent typography creates rhythm. Rhythm creates trust. Trust creates loyalty.", tag: "font-normal" },
  { name: "Caption", size: "12px / 0.75rem", weight: "500", sample: "METADATA · LABELS · UI ELEMENTS · CAPTIONS", tag: "font-medium uppercase tracking-widest" },
];

export default function TypographySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="typography" className="py-32 px-8 bg-black text-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/30">02 — Type</span>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tight mt-2">Typography</h2>
          </div>
          <div className="text-right text-white/30 text-sm">
            <div>Typeface: Inter</div>
            <div>5 weights · 6 sizes</div>
          </div>
        </div>

        {/* Huge specimen */}
        <motion.div
          className="mb-24 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          <div className="text-[clamp(5rem,18vw,16rem)] font-black leading-none tracking-tighter text-white/[0.07] select-none pointer-events-none">
            Aa
          </div>
          <div className="text-[clamp(5rem,18vw,16rem)] font-black leading-none tracking-tighter -mt-[0.15em] bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #ffffff 40%, #6c47ff)" }}>
            Bb
          </div>
        </motion.div>

        {/* Type scale */}
        <div className="space-y-0">
          {TYPE_SCALE.map((item, i) => (
            <motion.div
              key={item.name}
              className="flex items-baseline gap-8 py-6 border-b border-white/8 group cursor-default"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
            >
              <div className="w-32 shrink-0">
                <div className="text-xs uppercase tracking-widest text-white/30">{item.name}</div>
                <div className="text-xs font-mono text-white/20 mt-0.5">{item.size}</div>
              </div>
              <div className={`flex-1 text-white group-hover:text-white/80 transition-colors leading-tight ${item.tag}`}
                style={{ fontSize: Math.min(parseInt(item.size), 48) + "px" }}>
                {item.sample}
              </div>
              <div className="shrink-0 text-xs font-mono text-white/20 hidden md:block">{item.weight}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
