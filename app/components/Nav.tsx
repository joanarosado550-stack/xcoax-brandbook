"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Nav() {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        borderBottom: "1px solid",
        borderColor: borderOpacity.get() > 0.1 ? "rgba(10,10,10,0.08)" : "transparent",
        backgroundColor: "rgba(245,244,240,0.92)",
        backdropFilter: "blur(12px)",
      }}
    >
      <span className="text-sm font-semibold tracking-widest uppercase">BK·Studio</span>
      <div className="flex items-center gap-8 text-sm text-neutral-500">
        <a href="#colors" className="hover:text-black transition-colors">Colors</a>
        <a href="#typography" className="hover:text-black transition-colors">Type</a>
        <a href="#logo" className="hover:text-black transition-colors">Logo</a>
        <a href="#components" className="hover:text-black transition-colors">Components</a>
        <a href="#motion" className="hover:text-black transition-colors">Motion</a>
        <button className="ml-4 px-4 py-1.5 bg-black text-white text-xs tracking-widest uppercase rounded-full hover:bg-neutral-800 transition-colors">
          Download
        </button>
      </div>
    </motion.nav>
  );
}
