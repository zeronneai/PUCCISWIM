import { NOTES } from "@/lib/notes";
import PinnedNote from "./PinnedNote";

// Positions a single sticky note between two sections. Desktop: 180px, hugging
// the left or right margin. Mobile: 150px, centered, and only for the notes
// flagged `onMobile` (so phones show just 3, never a wall of them). The negative
// nudge stays inside the container padding, so there's never horizontal scroll.
export default function NoteBreak({
  index,
  side,
  onMobile = false,
}: {
  index: number;
  side: "left" | "right";
  onMobile?: boolean;
}) {
  const note = NOTES[index];
  const align = side === "left" ? "md:justify-start" : "md:justify-end";
  const nudge = side === "left" ? "md:-ml-4 lg:-ml-8" : "md:-mr-4 lg:-mr-8";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* Desktop */}
      <div className={`hidden md:flex ${align}`}>
        <PinnedNote note={note} size={180} className={nudge} />
      </div>
      {/* Mobile: only the flagged few */}
      {onMobile && (
        <div className="flex justify-center md:hidden">
          <PinnedNote note={note} size={150} />
        </div>
      )}
    </div>
  );
}
