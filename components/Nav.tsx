"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useCart } from "@/cart/CartContext";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

const LINKS = [
  { href: "#shop", label: "Shop" },
  { href: "#brand", label: "The Brand" },
  { href: "#fit", label: "Fit" },
  { href: "#faq", label: "FAQ" },
];

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 8h12l-1 12H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9 9V6.5a3 3 0 0 1 6 0V9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Nav() {
  const { count, openCart, cartIconRef } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  // SAFE DEFAULT: opaque. The nav only goes transparent when we're CONFIDENT the
  // hero is behind it. If the observer never fires (or there's no hero), the nav
  // stays opaque and legible rather than see-through.
  const [overHero, setOverHero] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    // Observe the hero itself with a negative top rootMargin (~nav height): the
    // nav is transparent only while the hero still extends below the nav line,
    // and flips to opaque the moment it clears. IntersectionObserver is the most
    // reliable signal here; on any failure the safe default keeps the nav opaque.
    const hero = document.getElementById("hero");
    if (!hero) return; // no hero on this page -> stay opaque
    const io = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { rootMargin: "-96px 0px 0px 0px", threshold: 0 },
    );
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  // Bump the badge whenever the count changes.
  useEffect(() => {
    if (count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 320);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <>
      <header
        className={`nav-pt-safe sticky top-0 z-50 transition-colors duration-300 ${
          overHero
            ? "bg-transparent text-cream"
            : "border-b border-ink/10 bg-cream text-ink"
        }`}
        // Opaque state is a SOLID cream fill — no backdrop-filter, so nothing
        // can show through even if WebKit fails to composite a blur.
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Wordmark */}
          <a href="#hero" className="animate-logo-in group flex items-baseline gap-1.5" aria-label="PUCCII Swim home">
            <Logo
              heightClass="h-7"
              tone={overHero ? "light" : "natural"}
              fallback={
                <span className="flex items-baseline gap-1.5">
                  <span
                    className={`font-display text-2xl font-extrabold tracking-tight ${
                      overHero ? "text-cream" : "text-ink"
                    }`}
                  >
                    PUCCII
                  </span>
                  <span
                    className={`font-hand text-2xl transition-transform group-hover:-rotate-6 ${
                      overHero ? "text-cream" : "text-puccii-pink"
                    }`}
                  >
                    swim
                  </span>
                </span>
              }
            />
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-sm font-semibold text-current transition-colors hover:text-puccii-pink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-1">
            <button
              ref={cartIconRef as React.RefObject<HTMLButtonElement>}
              onClick={openCart}
              className={`relative grid h-12 w-12 place-items-center rounded-full text-current transition-colors ${
                overHero ? "hover:bg-cream/15" : "hover:bg-puccii-blush/60"
              }`}
              aria-label={`Open bag, ${count} item${count === 1 ? "" : "s"}`}
            >
              <BagIcon />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: bump ? 1.25 : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 18 }}
                    className="absolute right-1.5 top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-puccii-pink px-1 text-[11px] font-bold text-cream"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`grid h-12 w-12 place-items-center rounded-full text-current transition-colors md:hidden ${
                overHero ? "hover:bg-cream/15" : "hover:bg-puccii-blush/60"
              }`}
              aria-label="Open menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={LINKS} />
    </>
  );
}
