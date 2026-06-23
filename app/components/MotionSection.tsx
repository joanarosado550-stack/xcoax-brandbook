"use client";
import { motion, useInView, useAnimate, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const EASING_CURVES = [
  { name: "ease-out", curve: [0.16, 1, 0.3, 1], color: "#6c47ff", desc: "Primary interactions" },
  { name: "spring", curve: null, color: "#ff6b35", desc: "Playful feedback" },
  { name: "ease-in-out", curve: [0.4, 0, 0.2, 1], color: "#0d7377", desc: "State transitions" },
  { name: "linear", curve: [0, 0, 1, 1], color: "#e94560", desc: "Continuous animation" },
];

function BouncingDot({ color }: { color: string }) {
  return (
    <motion.div
      className="w-5 h-5 rounded-full flex-shrink-0"
      style={{ backgroundColor: color }}
      animate={{ y: [-12, 12, -12] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function OrbitRing() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <motion.div
        className="absolute w-32 h-32 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <motion.div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#6c47ff]" />
      </motion.div>
      <motion.div
        className="absolute w-20 h-20 rounded-full border border-white/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      >
        <motion.div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ff6b35]" />
      </motion.div>
      <div className="w-2 h-2 rounded-full bg-white" />
    </div>
  );
}

export default function MotionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [playing, setPlaying] = useState(false);

  return (
    <section id="motion" className="py-32 px-8 bg-[#f5f4f0]" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16 border-b border-black/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-neutral-400">05 — Animation</span>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tight mt-2">Motion</h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-xs text-right">
            Motion is communication. Every animation has purpose and intention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Easing demos */}
          <motion.div
            className="rounded-2xl p-8 bg-black text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 mb-6">Easing Curves</div>
            <div className="space-y-4">
              {EASING_CURVES.map((ec, i) => (
                <div key={ec.name} className="flex items-center gap-4">
                  <div className="w-20 shrink-0">
                    <div className="text-xs font-mono text-white/40">{ec.name}</div>
                    <div className="text-xs text-white/20">{ec.desc}</div>
                  </div>
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: ec.color }}
                      initial={{ width: "0%" }}
                      animate={inView ? { width: "100%" } : {}}
                      transition={{
                        duration: 1.5,
                        delay: 0.3 + i * 0.15,
                        ease: (ec.curve ?? [0.34, 1.56, 0.64, 1]) as [number, number, number, number],
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Orbit */}
          <motion.div
            className="rounded-2xl p-8 bg-black text-white flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 self-start mb-2">Continuous Motion</div>
            <OrbitRing />
            <p className="text-xs text-white/30 text-center max-w-48 mt-2">
              Ambient animation at low intensity. Never distracting.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Enter animation */}
          <motion.div
            className="rounded-2xl p-8 bg-black text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 mb-6">Enter / Exit</div>
            <div className="space-y-3">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  className="h-10 rounded-xl bg-white/8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
          </motion.div>

          {/* Scale */}
          <motion.div
            className="rounded-2xl p-8 bg-black text-white flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 self-start mb-6">Scale</div>
            <motion.div
              className="w-20 h-20 rounded-2xl bg-[#6c47ff]"
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="text-xs text-white/20 mt-4">1.0 → 1.25 → 1.0</div>
          </motion.div>

          {/* Stagger */}
          <motion.div
            className="rounded-2xl p-8 bg-black text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 mb-6">Stagger</div>
            <div className="flex gap-3 items-end h-20">
              {[0.4, 0.7, 0.55, 0.9, 0.65, 0.8].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ backgroundColor: "#ff6b35" }}
                  initial={{ scaleY: 0, originY: 1 }}
                  animate={inView ? { scaleY: h } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  // absolute height
                  custom={h}
                >
                  <div style={{ height: 80 * h }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
