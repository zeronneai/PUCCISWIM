"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

// Natural image proportions, measured at load time, so containers can use the
// real aspect ratio (object-contain, nothing cropped, no letterbox).

type LoadEvt = { currentTarget: { naturalWidth: number; naturalHeight: number } };

// --- Shared product flat-lay ratio -----------------------------------------
// Every flat-lay shares one aspect ratio (width / height). We measure it from
// the first one that loads and share it across every card, the sheet, the cart
// thumbnail and the fly-to-cart clone, so they all use the natural proportion
// and never resize when the color variant changes.
let flatRatio: number | null = null;
const flatListeners = new Set<() => void>();

export function reportFlatLayRatio(w: number, h: number): void {
  if (flatRatio || !w || !h) return;
  flatRatio = w / h;
  flatListeners.forEach((fn) => fn());
}

export function onFlatLayLoad(e: LoadEvt): void {
  reportFlatLayRatio(e.currentTarget.naturalWidth, e.currentTarget.naturalHeight);
}

export function useFlatLayRatio(): number | null {
  return useSyncExternalStore(
    (cb) => {
      flatListeners.add(cb);
      return () => flatListeners.delete(cb);
    },
    () => flatRatio,
    () => null,
  );
}

// --- Per-image ratio (each image measured on its own) ----------------------
export function useImageRatio(): [number | null, (e: LoadEvt) => void] {
  const [ratio, setRatio] = useState<number | null>(null);
  const onLoad = useCallback((e: LoadEvt) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) setRatio(naturalWidth / naturalHeight);
  }, []);
  return [ratio, onLoad];
}
