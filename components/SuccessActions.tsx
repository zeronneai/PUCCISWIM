"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/cart/CartContext";

type State = "idle" | "sending" | "sent" | "error";

export default function SuccessActions({ sessionId }: { sessionId?: string }) {
  const { clear } = useCart();
  const [state, setState] = useState<State>("idle");

  // Order placed — empty the bag (state + localStorage).
  useEffect(() => {
    clear();
  }, [clear]);

  async function resend() {
    if (!sessionId || state === "sending") return;
    setState("sending");
    try {
      const res = await fetch("/api/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  }

  if (!sessionId) return null;

  const label =
    state === "sending"
      ? "Sending…"
      : state === "sent"
        ? "Confirmation resent ✓"
        : state === "error"
          ? "Couldn't resend — DM us"
          : "Resend confirmation";

  return (
    <button
      onClick={resend}
      disabled={state === "sending" || state === "sent"}
      className="text-sm font-semibold text-ink-soft underline decoration-ink/20 underline-offset-2 transition-colors hover:text-puccii-pink disabled:no-underline disabled:hover:text-ink-soft"
    >
      {label}
    </button>
  );
}
