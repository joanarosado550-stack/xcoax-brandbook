"use client";
import { useState } from "react";
import LandingSection from "./components/LandingSection";
import FolderStack from "./components/FolderStack";
import SectionView from "./components/SectionView";

export type SectionId =
  | "colors"
  | "typography"
  | "logo"
  | "components"
  | "motion"
  | "photo";

export default function Home() {
  const [open, setOpen] = useState<SectionId | null>(null);

  return (
    <main className="w-screen h-screen overflow-y-scroll snap-y snap-mandatory bg-white">
      {/* Section 1 — Landing */}
      <LandingSection />

      {/* Section 2 — Navigation */}
      <FolderStack open={open} onOpen={setOpen} />

      {/* Section overlay — fixed so it covers the viewport at any scroll position */}
      <SectionView open={open} onClose={() => setOpen(null)} onOpen={setOpen} />
    </main>
  );
}
