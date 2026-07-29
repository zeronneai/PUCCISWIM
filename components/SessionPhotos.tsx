"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { PHOTO_SESSION } from "@/lib/gallery";
import { cldImage } from "@/lib/cloudinary";
import SmartImage from "./SmartImage";

// "the shoot": Mya's stills. Every photo keeps its OWN natural proportion, so
// the irregularity comes from the real aspect ratios, not from cropping.
// Mobile is a momentum scroll row: fixed height, width follows each photo's
// ratio, object-contain (never cropped). Desktop is an asymmetric grid (two
// large frames, three smaller) where heights follow the natural ratios.
// Each frame fades and lifts in on scroll. Renders nothing until PHOTO_SESSION
// has entries.

// Column spans on a 6-column desktop grid: row 1 = two large (3 + 3),
// row 2 = three small (2 + 2 + 2).
const SPAN = [
  "md:col-span-3",
  "md:col-span-3",
  "md:col-span-2",
  "md:col-span-2",
  "md:col-span-2",
];

export default function SessionPhotos() {
  const [ratios, setRatios] = useState<Record<number, number>>({});

  if (PHOTO_SESSION.length === 0) return null;

  return (
    <section id="session-photos" className="scroll-mt-20 bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="px-4 font-hand text-2xl text-puccii-pink sm:px-6">the shoot</p>

        <div className="no-scrollbar mt-4 flex items-center gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:mt-8 md:grid md:grid-cols-6 md:items-start md:gap-6 md:overflow-visible md:pb-0">
          {PHOTO_SESSION.map((photo, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ aspectRatio: ratios[i] ?? "4 / 5" }}
              className={`relative h-[46vh] max-h-[440px] w-auto shrink-0 snap-start overflow-hidden rounded-[24px] bg-cream md:h-auto md:max-h-none md:w-full ${SPAN[i] ?? "md:col-span-2"}`}
            >
              <SmartImage
                src={cldImage(photo.url)}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
                onLoad={(e) => {
                  const img = e.currentTarget as HTMLImageElement;
                  if (img.naturalWidth && img.naturalHeight) {
                    setRatios((r) => (r[i] ? r : { ...r, [i]: img.naturalWidth / img.naturalHeight }));
                  }
                }}
                className="object-contain"
                fallbackLabel="PUCCII"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
