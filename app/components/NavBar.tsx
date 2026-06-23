"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { SectionId } from "../page";

const SECTION_LABELS: Record<SectionId, string> = {
  colors: "Concept",
  typography: "Logo",
  logo: "Typography",
  components: "Color",
  motion: "Graphic Elements",
  photo: "Applications",
};

export default function NavBar({ open, onClose }: { open: SectionId | null; onClose: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      {/* Logo — always visible, links back to stack when open */}
      <button
        onClick={open ? onClose : undefined}
        className={open ? "cursor-pointer opacity-80 hover:opacity-100 transition-opacity" : "cursor-default"}
        style={{ background: "none", border: "none", padding: 0 }}
        aria-label="xCoAx 2027"
      >
        <Image
          src="/LOGOBRANCO.png"
          alt="xCoAx 2027"
          width={60}
          height={78}
          className="object-contain"
          style={{ mixBlendMode: "multiply" }}
          priority
        />
      </button>

      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="open-label"
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-sm text-neutral-400 uppercase tracking-widest">
              {SECTION_LABELS[open]}
            </span>
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm font-medium text-black border border-black/15 rounded-full px-4 py-1.5 hover:bg-black hover:text-white transition-colors"
            >
              <span className="text-base leading-none">←</span> Back
            </button>
          </motion.div>
        ) : (
          <motion.span
            key="closed-label"
            className="text-xs uppercase tracking-widest text-neutral-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            xCoAx 2027 · Brand Book
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
