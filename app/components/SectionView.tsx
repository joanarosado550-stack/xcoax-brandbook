"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useLayoutEffect } from "react";
import type { SectionId } from "../page";
import { FOLDERS } from "./FolderStack";
import ColorsContent from "./content/ColorsContent";
import TypographyContent from "./content/TypographyContent";
import LogoContent from "./content/LogoContent";
import ComponentsContent from "./content/ComponentsContent";
import MotionContent from "./content/MotionContent";
import PhotoContent from "./content/PhotoContent";

const CONTENT_MAP: Record<SectionId, React.ReactNode> = {
  colors:     <ColorsContent />,
  typography: <TypographyContent />,
  logo:       <LogoContent />,
  components: <ComponentsContent />,
  motion:     <MotionContent />,
  photo:      <PhotoContent />,
};

export default function SectionView({
  open,
  onClose,
  onOpen,
}: {
  open: SectionId | null;
  onClose: () => void;
  onOpen: (id: SectionId) => void;
}) {
  const folder = FOLDERS.find((f) => f.id === open);

  // Measure the scroll container so sections can be exactly that height
  const scrollRef = useRef<HTMLDivElement>(null);
  const [snapH, setSnapH] = useState("");
  useLayoutEffect(() => {
    if (!scrollRef.current || !open) return;
    setSnapH(`${scrollRef.current.clientHeight}px`);
    scrollRef.current.scrollTop = 0;
  }, [open]);

  return (
    <AnimatePresence>
      {open && folder && (
        <motion.div
          key={open}
          layoutId={`card-${open}`}
          className="fixed inset-3 rounded-2xl overflow-hidden flex flex-col"
          style={{ backgroundColor: folder.bg, zIndex: 30 }}
          initial={{ borderRadius: 12 }}
          animate={{ borderRadius: 16 }}
          exit={{ borderRadius: 12, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Header ── */}
          <SectionHeader folder={folder} onClose={onClose} />

          {/* ── Content — snap scroll container ── */}
          <div
            ref={scrollRef}
            className="brand-scroll flex-1 overflow-y-scroll"
            style={{
              scrollSnapType: "y mandatory",
              ...(snapH ? ({ "--snap-h": snapH } as React.CSSProperties) : {}),
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {CONTENT_MAP[open]}
            </motion.div>
          </div>

          {/* ── Bottom tab strip — desktop only ── */}
          <div className="mobile:hidden">
            <OtherFolderTabs current={open} onOpen={onOpen} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SectionHeader({
  folder,
  onClose,
}: {
  folder: (typeof FOLDERS)[number];
  onClose: () => void;
}) {
  const textColor   = folder.textDark ? "#000000" : "#ffffff";
  const subColor    = folder.textDark ? "rgba(0,0,0,0.38)" : "rgba(255,255,255,0.38)";
  const borderColor = folder.textDark ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)";

  return (
    <div
      className="flex items-center justify-between px-7 py-4 shrink-0"
      style={{ borderBottom: `1px solid ${borderColor}` }}
    >
      {/* Left: logo + section info */}
      <div className="flex items-center gap-5">
        <Image
          src="/LOGOBRANCO.png"
          alt="xCoAx"
          width={28}
          height={36}
          className="object-contain shrink-0"
          style={{
            filter: folder.textDark ? "none" : "invert(1)",
            opacity: 0.75,
          }}
        />
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-mono tracking-widest"
            style={{ color: subColor }}
          >
            {folder.index}
          </span>
          <span
            className="text-sm font-medium tracking-widest uppercase"
            style={{ color: textColor }}
          >
            {folder.label}
          </span>
        </div>
      </div>

      {/* Right: close button */}
      <button
        onClick={onClose}
        className="text-[11px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full transition-opacity hover:opacity-60 active:opacity-60"
        style={{
          color: textColor,
          border: `1px solid ${borderColor}`,
        }}
      >
        ← Back
      </button>
    </div>
  );
}

function OtherFolderTabs({
  current,
  onOpen,
}: {
  current: SectionId;
  onOpen: (id: SectionId) => void;
}) {
  return (
    <motion.div
      className="shrink-0 flex mobile:grid mobile:grid-cols-3 gap-1.5 px-5 py-2.5 overflow-x-auto mobile:overflow-x-visible"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
    >
      {FOLDERS.map((f) => {
        const isActive = f.id === current;
        return (
          <div
            key={f.id}
            className="shrink-0 mobile:shrink rounded-lg px-3 py-1.5 select-none"
            style={{
              backgroundColor: f.bg,
              color: f.textDark ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.65)",
              border: "1px solid rgba(255,255,255,0.07)",
              minWidth: 100,
              opacity: isActive ? 1 : 0.5,
              transition: "opacity 0.2s ease",
            }}
            onClick={isActive ? undefined : () => onOpen(f.id)}
          >
            <span className="block text-[9px] tracking-[0.2em] uppercase opacity-50 mb-0.5">{f.index}</span>
            <span className="text-[11px] font-medium tracking-wide">{f.label}</span>
          </div>
        );
      })}
    </motion.div>
  );
}
