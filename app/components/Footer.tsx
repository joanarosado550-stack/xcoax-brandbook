"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <footer className="bg-black text-white py-24 px-8" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-[clamp(4rem,14vw,12rem)] font-black leading-none tracking-tighter mb-16 text-white/[0.06] select-none"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          BK·STUDIO
        </motion.div>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-t border-white/10 pt-12">
          <div>
            <div className="text-2xl font-black mb-2">Brand Identity System</div>
            <div className="text-white/30 text-sm">Version 2.0 · 2026 Edition</div>
          </div>
          <div className="flex gap-12 text-sm text-white/30">
            <div>
              <div className="text-white font-medium mb-3">Sections</div>
              {["Colors", "Typography", "Logo", "Components", "Motion"].map(s => (
                <a key={s} href={`#${s.toLowerCase()}`} className="block py-0.5 hover:text-white transition-colors">{s}</a>
              ))}
            </div>
            <div>
              <div className="text-white font-medium mb-3">Resources</div>
              {["Style Guide", "Figma Kit", "Assets", "Changelog"].map(s => (
                <div key={s} className="py-0.5 cursor-pointer hover:text-white transition-colors">{s}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10 text-white/20 text-xs">
          <span>© 2026 BK·Studio. All rights reserved.</span>
          <span className="uppercase tracking-widest">Brand Book</span>
        </div>
      </div>
    </footer>
  );
}
