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
import { PRODUCTS_BY_ID, type Size } from "@/lib/products";
import { SITE, PAYMENTS_MODE, WHATSAPP_NUMBER } from "@/lib/site";

export type CartLine = { productId: string; size: Size; qty: number };

type Flight = { id: number; src: string; from: DOMRect };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string, size: Size, qty?: number, fromEl?: HTMLElement | null, src?: string) => void;
  setQty: (productId: string, size: Size, qty: number) => void;
  removeItem: (productId: string, size: Size) => void;
  clear: () => void;
  checkout: () => Promise<void>;
  isCheckingOut: boolean;
  announcement: string;
  cartIconRef: React.RefObject<HTMLElement | null>;
  flights: Flight[];
  endFlight: (id: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "puccii-cart-v1";

function readStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Drop anything that no longer maps to a real product/size.
    return parsed.filter(
      (l): l is CartLine =>
        l &&
        typeof l.productId === "string" &&
        PRODUCTS_BY_ID[l.productId] &&
        typeof l.size === "string" &&
        (PRODUCTS_BY_ID[l.productId].sizes as string[]).includes(l.size) &&
        typeof l.qty === "number" &&
        l.qty > 0,
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
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
    (productId, size, qty = 1, fromEl, src) => {
      const product = PRODUCTS_BY_ID[productId];
      if (!product || !(product.sizes as string[]).includes(size)) return;

      setLines((prev) => {
        const idx = prev.findIndex((l) => l.productId === productId && l.size === size);
        if (idx === -1) return [...prev, { productId, size, qty: clampQty(qty) }];
        const next = [...prev];
        next[idx] = { ...next[idx], qty: clampQty(next[idx].qty + qty) };
        return next;
      });

      setAnnouncement(`${product.name}, size ${size} added to your bag.`);

      // Flying image → cart icon.
      if (fromEl && typeof window !== "undefined") {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduce) {
          const from = fromEl.getBoundingClientRect();
          const id = ++flightId.current;
          setFlights((f) => [...f, { id, src: src || product.imageModel, from }]);
        }
      }
    },
    [],
  );

  const setQty = useCallback<CartContextValue["setQty"]>((productId, size, qty) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => !(l.productId === productId && l.size === size));
      return prev.map((l) =>
        l.productId === productId && l.size === size ? { ...l, qty: clampQty(qty) } : l,
      );
    });
  }, []);

  const removeItem = useCallback<CartContextValue["removeItem"]>((productId, size) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)));
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
            const p = PRODUCTS_BY_ID[l.productId];
            return `• ${p?.name ?? l.productId}, Size ${l.size} × ${l.qty}`;
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
          items: lines.map((l) => ({ productId: l.productId, size: l.size, qty: l.qty })),
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
