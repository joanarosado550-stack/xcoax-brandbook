"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

export default function ComponentsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [inputVal, setInputVal] = useState("");
  const [toggled, setToggled] = useState(false);
  const [selected, setSelected] = useState("Design");

  return (
    <section id="components" className="py-32 px-8 bg-black text-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-white/30">04 — UI Kit</span>
            <h2 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tight mt-2">Components</h2>
          </div>
          <p className="text-white/30 text-sm max-w-xs text-right">
            Reusable building blocks. Consistent. Accessible. Expressive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Buttons card */}
          <motion.div
            className="rounded-2xl p-8 bg-white/[0.04] border border-white/8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 mb-6">Buttons</div>
            <div className="space-y-3">
              <button className="w-full rounded-full py-3 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors">
                Primary Action
              </button>
              <button className="w-full rounded-full py-3 text-sm font-semibold bg-[#ff6b35] text-white hover:bg-[#e85c28] transition-colors">
                Accent Action
              </button>
              <button className="w-full rounded-full py-3 text-sm font-semibold border border-white/20 text-white hover:bg-white/5 transition-colors">
                Ghost Button
              </button>
              <button className="w-full rounded-full py-3 text-sm font-semibold text-white/40 hover:text-white/60 transition-colors">
                Text Link →
              </button>
            </div>
          </motion.div>

          {/* Inputs & toggle */}
          <motion.div
            className="rounded-2xl p-8 bg-white/[0.04] border border-white/8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 mb-6">Inputs</div>
            <div className="space-y-4">
              <input
                type="text"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Type something..."
                className="w-full rounded-xl px-4 py-3 text-sm bg-white/8 border border-white/12 text-white placeholder-white/30 focus:outline-none focus:border-[#6c47ff] transition-colors"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">Enable feature</span>
                <button
                  onClick={() => setToggled(t => !t)}
                  className="relative w-12 h-6 rounded-full transition-colors"
                  style={{ backgroundColor: toggled ? "#6c47ff" : "rgba(255,255,255,0.12)" }}
                >
                  <motion.div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white"
                    animate={{ left: toggled ? "calc(100% - 20px)" : 4 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              <div className="flex gap-2">
                {["Design", "Brand", "Motion"].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelected(tag)}
                    className="flex-1 rounded-full py-2 text-xs font-medium transition-all"
                    style={{
                      backgroundColor: selected === tag ? "white" : "rgba(255,255,255,0.06)",
                      color: selected === tag ? "black" : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Cards & badges */}
          <motion.div
            className="rounded-2xl p-8 bg-white/[0.04] border border-white/8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 mb-6">Badges & Tags</div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Live", color: "#22c55e" },
                  { label: "Beta", color: "#6c47ff" },
                  { label: "New", color: "#ff6b35" },
                  { label: "Soon", color: "#6b7280" },
                ].map(b => (
                  <span key={b.label} className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: b.color + "20", color: b.color, border: `1px solid ${b.color}30` }}>
                    {b.label}
                  </span>
                ))}
              </div>
              <div className="rounded-xl p-4 bg-white/[0.03] border border-white/8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#6c47ff]" />
                  <span className="text-sm font-medium">Card Component</span>
                </div>
                <p className="text-white/40 text-xs leading-relaxed">
                  Elevation through subtle borders, not shadows.
                </p>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#6c47ff]"
                  initial={{ width: "0%" }}
                  animate={inView ? { width: "72%" } : {}}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </motion.div>

          {/* Notification */}
          <motion.div
            className="rounded-2xl p-8 bg-white/[0.04] border border-white/8 md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 mb-6">Notifications & Alerts</div>
            <div className="space-y-3">
              {[
                { icon: "✓", label: "Changes saved successfully", color: "#22c55e" },
                { icon: "!", label: "Review brand guidelines before publishing", color: "#ff6b35" },
                { icon: "i", label: "New version 2.1 available for download", color: "#6c47ff" },
              ].map((n, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ backgroundColor: n.color + "10", border: `1px solid ${n.color}20` }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: n.color, color: "black" }}>{n.icon}</span>
                  <span className="text-sm text-white/70">{n.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Spacing */}
          <motion.div
            className="rounded-2xl p-8 bg-white/[0.04] border border-white/8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="text-xs uppercase tracking-widest text-white/30 mb-6">Spacing Scale</div>
            <div className="space-y-2">
              {[4, 8, 12, 16, 24, 32, 48].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-8 text-right text-xs font-mono text-white/30">{s}</div>
                  <div className="rounded-sm bg-[#6c47ff]/60" style={{ width: s * 2.5, height: 10 }} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
