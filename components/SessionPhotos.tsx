"use client";

import { getStyle } from "@/lib/products";
import { PHOTO_SESSION } from "@/lib/gallery";
import SmartImage from "./SmartImage";

// "the shoot": stills. Horizontal snap-scroll on mobile, asymmetric grid on
// desktop. Renders nothing until PHOTO_SESSION has entries.
export default function SessionPhotos() {
  if (PHOTO_SESSION.length === 0) return null;

  return (
    <section id="session-photos" className="scroll-mt-20 bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="px-4 font-hand text-2xl text-puccii-pink sm:px-6">the shoot</p>

        <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0">
          {PHOTO_SESSION.map((photo, i) => {
            const style = photo.styleId ? getStyle(photo.styleId) : undefined;
            return (
              <figure
                key={i}
                className={`group relative aspect-[4/5] w-[74%] shrink-0 snap-start overflow-hidden rounded-[22px] md:w-auto ${
                  i % 2 === 1 ? "md:mt-10" : ""
                }`}
              >
                <SmartImage
                  src={photo.url}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 74vw, 33vw"
                  className="object-cover"
                  fallbackLabel="PUCCII"
                />
                {style && (
                  <a
                    href="#shop"
                    className="absolute bottom-3 left-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-bold text-ink opacity-0 shadow-sm backdrop-blur transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
                  >
                    {style.name} ↗
                  </a>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
