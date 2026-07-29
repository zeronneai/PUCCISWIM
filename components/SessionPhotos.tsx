"use client";

import { motion } from "motion/react";
import { PHOTO_SESSION } from "@/lib/gallery";
import { cldImage } from "@/lib/cloudinary";
import SmartImage from "./SmartImage";

// "the shoot": Mya's stills. Mobile is a momentum scroll row where each frame
// sits at 78% width so the next one peeks in. Desktop is a deliberately
// uneven grid (two large frames, three smaller, staggered heights) so it reads
// like a shoot, not a catalog. Each frame fades and lifts in on scroll.
// Renders nothing until PHOTO_SESSION has entries.

// Per-frame desktop placement on a 6-column grid (rows: 4+2, 3+3, 6).
const DESKTOP = [
  "md:col-span-4 md:aspect-[4/5]",
  "md:col-span-2 md:mt-14 md:aspect-[3/4]",
  "md:col-span-3 md:aspect-[5/4]",
  "md:col-span-3 md:mt-8 md:aspect-[4/3]",
  "md:col-span-6 md:aspect-[16/9]",
];

export default function SessionPhotos() {
  if (PHOTO_SESSION.length === 0) return null;

  return (
    <section id="session-photos" className="scroll-mt-20 bg-cream py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="px-4 font-hand text-2xl text-puccii-pink sm:px-6">the shoot</p>

        <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:px-6 md:mt-8 md:grid md:grid-cols-6 md:items-start md:gap-6 md:overflow-visible md:pb-0">
          {PHOTO_SESSION.map((photo, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative aspect-[4/5] w-[78%] shrink-0 snap-start overflow-hidden rounded-[24px] bg-gradient-to-br from-puccii-blush to-paper-pink md:w-auto md:shrink ${DESKTOP[i] ?? ""}`}
            >
              <SmartImage
                src={cldImage(photo.url)}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 78vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
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
