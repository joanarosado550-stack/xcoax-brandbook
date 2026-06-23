"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const PALETTE = [
  { name: "Ink", hex: "#0a0a0a", role: "Primary", light: false },
  { name: "Canvas", hex: "#f5f4f0", role: "Background", light: true },
  { name: "Ember", hex: "#ff6b35", role: "Accent 01", light: false },
  { name: "Violet", hex: "#6c47ff", role: "Accent 02", light: false },
  { name: "Crimson", hex: "#e94560", role: "Accent 03", light: false },
  { name: "Teal", hex: "#0d7377", role: "Accent 04", light: false },
  { name: "Fog", hex: "#d1cfc8", role: "Neutral", light: true },
  { name: "Slate", hex: "#6b6963", role: "Muted", light: false },
];

export default function ColorsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="colors" className="py-32 px-8 bg-[#f5f4f0]" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400">01 — Foundations</span>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tight mt-2">Color System</h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-xs text-right">
            Eight carefully calibrated tones. Each serves a distinct role in the visual hierarchy.
          </p>
        </div>

        {/* Primary swatch — large */}
        <motion.div
          className="rounded-2xl mb-4 flex items-end p-8 overflow-hidden relative"
          style={{ height: 280, backgroundColor: "#0a0a0a" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute top-8 right-8 text-neutral-600 text-xs uppercase tracking-widest">Primary</div>
          <div>
            <div className="text-white text-4xl font-black">Ink</div>
            <div className="text-neutral-500 text-sm mt-1 font-mono">#0A0A0A</div>
          </div>
        </motion.div>

        {/* Accent grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {PALETTE.slice(2, 6).map((color, i) => (
            <motion.div
              key={color.hex}
              className="rounded-2xl flex flex-col justify-between p-6 cursor-pointer group"
              style={{ height: 180, backgroundColor: color.hex }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03 }}
            >
              <span className="text-xs uppercase tracking-widest text-white/50">{color.role}</span>
              <div>
                <div className="text-white font-bold text-lg">{color.name}</div>
                <div className="text-white/50 text-xs font-mono mt-0.5">{color.hex}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Neutrals row */}
        <div className="grid grid-cols-3 gap-4">
          {PALETTE.slice(1, 2).concat(PALETTE.slice(6)).map((color, i) => (
            <motion.div
              key={color.hex}
              className="rounded-2xl flex flex-col justify-between p-6"
              style={{ height: 120, backgroundColor: color.hex, border: color.light ? "1px solid #e0ddd6" : "none" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.06 }}
            >
              <span className="text-xs uppercase tracking-widest" style={{ color: color.light ? "#9ca3af" : "rgba(255,255,255,0.4)" }}>{color.role}</span>
              <div>
                <div className="font-semibold" style={{ color: color.light ? "#0a0a0a" : "white" }}>{color.name}</div>
                <div className="text-xs font-mono" style={{ color: color.light ? "#9ca3af" : "rgba(255,255,255,0.4)" }}>{color.hex}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
