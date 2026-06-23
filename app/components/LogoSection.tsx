"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const LOGO_VARIANTS = [
  { bg: "#f5f4f0", color: "#0a0a0a", label: "On Light", border: true },
  { bg: "#0a0a0a", color: "#f5f4f0", label: "On Dark", border: false },
  { bg: "#ff6b35", color: "#ffffff", label: "On Accent", border: false },
  { bg: "#6c47ff", color: "#ffffff", label: "On Brand", border: false },
];

const DO_DONTS = [
  { text: "Maintain clear space equal to the height of the 'B' on all sides.", ok: true },
  { text: "Use only approved color combinations from the brand palette.", ok: true },
  { text: "Scale proportionally — never stretch or distort.", ok: true },
  { text: "Don't rotate the mark at unusual angles.", ok: false },
  { text: "Don't place on busy or low-contrast backgrounds.", ok: false },
  { text: "Don't modify, recreate, or add effects to the mark.", ok: false },
];

function LogoMark({ color, size = 64 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="22" height="48" rx="4" fill={color} />
      <rect x="8" y="8" width="36" height="22" rx="4" fill={color} />
      <rect x="8" y="34" width="36" height="22" rx="4" fill={color} />
      <rect x="34" y="8" width="22" height="22" rx="4" fill="none" stroke={color} strokeWidth="4" />
      <rect x="34" y="34" width="22" height="22" rx="4" fill="none" stroke={color} strokeWidth="4" />
    </svg>
  );
}

export default function LogoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="logo" className="py-32 px-8 bg-[#f5f4f0]" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400">03 — Identity</span>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tight mt-2">Logo Usage</h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-xs text-right">
            The mark is the cornerstone. Handle with care.
          </p>
        </div>

        {/* Hero logo display */}
        <motion.div
          className="rounded-3xl bg-black flex items-center justify-center mb-8 relative overflow-hidden"
          style={{ height: 360 }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px"
            }}
          />
          <div className="flex flex-col items-center gap-4">
            <LogoMark color="#f5f4f0" size={80} />
            <div className="text-white text-4xl font-black tracking-widest">BK·STUDIO</div>
            <div className="text-white/30 text-xs uppercase tracking-[0.3em]">Brand Identity System</div>
          </div>
        </motion.div>

        {/* Color variants */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {LOGO_VARIANTS.map((v, i) => (
            <motion.div
              key={v.label}
              className="rounded-2xl flex flex-col items-center justify-center gap-3 py-10"
              style={{ backgroundColor: v.bg, border: v.border ? "1px solid #e0ddd6" : "none" }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.07 }}
            >
              <LogoMark color={v.color} size={36} />
              <span className="text-xs uppercase tracking-widest" style={{ color: v.color, opacity: 0.5 }}>{v.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Do / Don't */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm uppercase tracking-widest font-semibold text-emerald-600 mb-4">✓ Do</h3>
            <div className="space-y-3">
              {DO_DONTS.filter(d => d.ok).map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-3 items-start text-sm text-neutral-600"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <span className="text-emerald-500 mt-0.5">—</span>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm uppercase tracking-widest font-semibold text-red-500 mb-4">✕ Don't</h3>
            <div className="space-y-3">
              {DO_DONTS.filter(d => !d.ok).map((item, i) => (
                <motion.div
                  key={i}
                  className="flex gap-3 items-start text-sm text-neutral-600"
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.08 }}
                >
                  <span className="text-red-400 mt-0.5">—</span>
                  {item.text}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
