// Hand-drawn marker doodles — same pink-stroke style as SketchUnderline/SketchHeart.
// Used in the margin of the full story. All 24x24, rounded strokes, currentColor.

type P = { className?: string };

const S = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PalmDoodle({ className = "" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21c0-5 .5-8 1.5-10" {...S} />
      <path d="M13 9c-2-2-5-2.5-8-1 2.5.2 4 1 5 2.2" {...S} />
      <path d="M13 9c1-2.6 0-5.5-2.5-7.5 1 2.4 1 4.3.6 6" {...S} />
      <path d="M13 9c2.7-1 5.6-.6 8 1.3-2.4-.5-4.2-.2-5.6.7" {...S} />
      <path d="M8 21h8" {...S} />
    </svg>
  );
}

export function CactusDoodle({ className = "" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 21V6a2 2 0 0 1 2 0v15" {...S} />
      <path d="M11 13H9a2 2 0 0 1-2-2V9" {...S} />
      <path d="M13 11h2a2 2 0 0 0 2-2V8" {...S} />
      <path d="M8 21h8" {...S} />
    </svg>
  );
}

export function WaveDoodle({ className = "" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10c3-3 6-3 9 0s6 3 9 0" {...S} />
      <path d="M3 15c3-3 6-3 9 0s6 3 9 0" {...S} />
    </svg>
  );
}

export function StarDoodle({ className = "" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l2.4 5 5.6.6-4 4 1 5.4L12 20l-5 3 1-5.4-4-4 5.6-.6L12 3Z" {...S} />
    </svg>
  );
}

export function BuildingsDoodle({ className = "" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21V9l5-3v15" {...S} />
      <path d="M9 21V11l6-4v14" {...S} />
      <path d="M15 21V10l5 3v8" {...S} />
      <path d="M3 21h18" {...S} />
      <path d="M6.5 12v0M6.5 15v0M12 12v0M12 15v0" {...S} />
    </svg>
  );
}

export function HeartDoodle({ className = "" }: P) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 20S4 15 4 9.5A3.5 3.5 0 0 1 12 7a3.5 3.5 0 0 1 8 2.5C20 15 12 20 12 20Z"
        {...S}
      />
    </svg>
  );
}
