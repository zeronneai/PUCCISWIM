"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Catalog from "@/components/Catalog";

/**
 * ISOLATION ROUTE — do not link from the site. Renders ONLY the sticky nav and
 * the catalog section. No hero, no GSAP/ScrollTrigger, no film grain, no global
 * overlays. Test on Safari iOS:
 *   /debug            -> main has overflow-x: clip (same as production)
 *   /debug?noclip     -> main overflow is visible (removes the clip)
 * If /debug reproduces the "title over the nav" bug, the cause is in the
 * nav + catalog + overflow-clip structure, NOT the hero/GSAP/grain.
 * If ?noclip fixes it, overflow:clip is the culprit.
 */
export default function DebugPage() {
  const [noclip, setNoclip] = useState<boolean | null>(null);

  useEffect(() => {
    document.body.classList.add("no-grain");
    setNoclip(new URLSearchParams(window.location.search).has("noclip"));
    return () => document.body.classList.remove("no-grain");
  }, []);

  // Avoid hydration fl: render nothing until we've read the flag.
  if (noclip === null) return null;

  return (
    <>
      <Nav />
      <main className={noclip ? "" : "overflow-x-clip"}>
        <section className="flex h-[110svh] flex-col items-center justify-center gap-2 bg-gradient-to-b from-sky/50 to-paper-pink px-6 text-center text-ink">
          <p className="font-display text-2xl font-bold">DEBUG isolation</p>
          <p className="max-w-sm text-ink-soft">
            Scroll down. The nav must stay on top of the &ldquo;Shop Endless Summer&rdquo; title.
          </p>
          <p className="rounded-full bg-cream px-4 py-1 text-sm font-semibold">
            main overflow-x: clip = <b>{noclip ? "OFF (?noclip)" : "ON"}</b>
          </p>
        </section>

        <Catalog />

        <div className="h-[100svh]" aria-hidden />
      </main>
    </>
  );
}
