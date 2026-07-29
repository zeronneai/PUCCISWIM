// Decorative handwritten sticky notes, scattered between sections. The text in
// {braces} gets a hand-drawn underline (not text-decoration). See PinnedNote.tsx.
export const NOTES = [
  { text: "be your own {obsession}", rotate: -3 },
  { text: "life looks better in a {bikini}", rotate: 2 },
  { text: "the beach is my {runway}", rotate: -2 },
  { text: "i'm not flirting, i'm just {hot} {and friendly} ♡", rotate: 3 },
  { text: "Confidence is the {outfit}.", rotate: -4 },
  { text: "swimwear and {self love}", rotate: 2 },
  { text: "beach hair, {don't care}", rotate: -2 },
];

export type Note = (typeof NOTES)[number];

// Split a note's text into plain + underlined segments.
export function noteSegments(text: string): { text: string; underline: boolean }[] {
  return text
    .split(/(\{[^}]+\})/g)
    .filter((s) => s.length > 0)
    .map((seg) =>
      seg.startsWith("{") && seg.endsWith("}")
        ? { text: seg.slice(1, -1), underline: true }
        : { text: seg, underline: false },
    );
}
