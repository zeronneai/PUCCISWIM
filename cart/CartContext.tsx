"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getStyle, getVariant, type Size } from "@/lib/products";
import { SITE, PAYMENTS_MODE, WHATSAPP_NUMBER } from "@/lib/site";

// A cart line is a style + a color + a size. The same style in two colors, or two
// sizes, is two distinct lines.
export type CartLine = { styleId: string; variantId: string; size: Size; qty: number };

type Flight = { id: number; src: string; from: DOMRect };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  // Whether a product sheet (QuickView) is open, which lets global chrome (the
  // persistent Shop Now button) get out of the way.
  sheetOpen: boolean;
  setSheetOpen: (v: boolean) => void;
  addItem: (
    styleId: string,
    variantId: string,
    size: Size,
    qty?: number,
    fromEl?: HTMLElement | null,
    src?: string,
  ) => void;
  setQty: (styleId: string, variantId: string, size: Size, qty: number) => void;
  removeItem: (styleId: string, variantId: string, size: Size) => void;
  clear: () => void;
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
  announcement: string;
  cartIconRef: React.RefObject<HTMLElement | null>;
  flights: Flight[];
  endFlight: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "puccii-cart-v2";

// Same key as a cart line, for matching.
const sameLine = (l: CartLine, styleId: string, variantId: string, size: string) =>
  l.styleId === styleId && l.variantId === variantId && l.size === size;

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop anything that no longer maps to a real style/variant/size.
    return parsed.filter((l): l is CartLine => {
      if (!l || typeof l.styleId !== "string" || typeof l.variantId !== "string") return false;
      if (typeof l.size !== "string" || typeof l.qty !== "number" || l.qty <= 0) return false;
      const style = getStyle(l.styleId);
      return (
        !!style &&
        !!getVariant(l.styleId, l.variantId) &&
        (style.sizes as string[]).includes(l.size)
      );
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [flights, setFlights] = useState<Flight[]>([]);
  const flightId = useRef(0);
  const cartIconRef = useRef<HTMLElement | null>(null);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    setLines(readStorage());
    setHydrated(true);
  }, []);

  // Persist.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore quota / private mode */
    }
  }, [lines, hydrated]);

  const clampQty = (n: number) => Math.max(1, Math.min(5, Math.round(n)));

  const addItem = useCallback<CartContextValue["addItem"]>(
    (styleId, variantId, size, qty = 1, fromEl, src) => {
      const style = getStyle(styleId);
      const variant = getVariant(styleId, variantId);
      if (!style || !variant || !(style.sizes as string[]).includes(size)) return;

      setLines((prev) => {
        const idx = prev.findIndex((l) => sameLine(l, styleId, variantId, size));
        if (idx === -1) return [...prev, { styleId, variantId, size, qty: clampQty(qty) }];
        const next = [...prev];
        next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + qty) };
        return next;
      });

      setAnnouncement(`${style.name} in ${variant.colorName}, size ${size} added to your bag.`);

      // Flying image → cart icon.
      if (fromEl && typeof window !== "undefined") {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) {
          const from = fromEl.getBoundingClientRect();
          const id = ++flightId.current;
          setFlights((f) => [...f, { id, src: src || variant.imageFlat, from }]);
        }
      }
    },
    [],
  );

  const setQty = useCallback<CartContextValue["setQty"]>((styleId, variantId, size, qty) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => !sameLine(l, styleId, variantId, size));
      return prev.map((l) =>
        sameLine(l, styleId, variantId, size) ? { ...l, qty: clampQty(qty) } : l,
      );
    });
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>((styleId, variantId, size) => {
    setLines((prev) => prev.filter((l) => !sameLine(l, styleId, variantId, size)));
    setAnnouncement("Item removed from your bag.");
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const endFlight = useCallback((id: number) => {
    setFlights((f) => f.filter((x) => x.id !== id));
  }, []);

  const count = useMemo(() => lines.reduce((n, l) => n + l.qty, 0), [lines]);
  const subtotalCents = useMemo(() => count * SITE.priceCents, [count]);

  const checkout = useCallback(async () => {
    if (lines.length === 0) return;
    setIsCheckingOut(true);
    try {
      if (PAYMENTS_MODE === "preorder_dm") {
        // Fallback path - no Stripe. Build a pre-filled DM (BRIEF §3.3).
        const summary = lines
          .map((l) => {
            const s = getStyle(l.styleId);
            const v = getVariant(l.styleId, l.variantId);
            const label = s ? `${s.name}, ${v?.colorName ?? ""}` : l.styleId;
            return `• ${label}, Size ${l.size} × ${l.qty}`;
          })
          .join("\n");
        const total = (subtotalCents / 100).toFixed(2);
        const text = `Hi PUCCII! I'd like to pre-order:\n${summary}\nTotal: $${total}`;
        const url = WHATSAPP_NUMBER
          ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
          : `${SITE.igUrl}`;
        window.location.href = url;
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({
            styleId: l.styleId,
            variantId: l.variantId,
            size: l.size,
            qty: l.qty,
          })),
        }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || `Checkout failed (${res.status})`);
      }
      const data = (await res.json()) as { url?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned.");
      }
    } catch (err) {
      console.error(err);
      setAnnouncement("Something went wrong starting checkout. Please try again.");
      setIsCheckingOut(false);
    }
  }, [lines, subtotalCents]);

  const value: CartContextValue = {
    lines,
    count,
    subtotalCents,
    isOpen,
    openCart,
    closeCart,
    sheetOpen,
    setSheetOpen,
    addItem,
    setQty,
    removeItem,
    clear,
    checkout,
    isCheckingOut,
    announcement,
    cartIconRef,
    flights,
    endFlight,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
