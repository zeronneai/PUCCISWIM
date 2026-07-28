import { ALL_SIZES, type Size } from "@/lib/products";
import { SITE } from "@/lib/site";
import Accordion, { type AccordionItem } from "./Accordion";

// ── Owner: fill this and the size chart renders. Leave it null and the site
// shows "runs true to size" + a contact link instead of a table of placeholders.
// Values are BODY measurements in INCHES; centimetres are derived automatically.
const SIZE_CHART: Record<Size, { bust: number; waist: number; hip: number }> | null = null;
// Example — uncomment and set the real numbers:
// const SIZE_CHART = {
//   XS: { bust: 32, waist: 24, hip: 34 },
//   S:  { bust: 34, waist: 26, hip: 36 },
//   M:  { bust: 36, waist: 28, hip: 38 },
//   L:  { bust: 38, waist: 30, hip: 40 },
// };

const toCm = (inch: number) => Math.round(inch * 2.54);

function MeasureCell({ inch, last = false }: { inch: number; last?: boolean }) {
  return (
    <td className={`border-b border-ink/8 py-2 ${last ? "" : "pr-4"}`}>
      <span className="font-semibold text-ink">{inch}&quot;</span>
      <span className="ml-1 text-xs text-ink-soft">/ {toCm(inch)} cm</span>
    </td>
  );
}

function SizeChart() {
  // No chart yet: absence over visible placeholders.
  if (!SIZE_CHART) {
    return (
      <p>
        PUCCII runs true to size. A full measurement chart is on its way — in the meantime,{" "}
        <a
          href={SITE.igUrl}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-puccii-pink underline underline-offset-2"
        >
          DM us
        </a>{" "}
        your measurements and we&apos;ll tell you your exact size.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <caption className="sr-only">PUCCII Swim size chart, XS to L, inches and centimetres</caption>
        <thead>
          <tr className="text-ink">
            <th scope="col" className="border-b border-ink/10 py-2 pr-4 font-bold">Size</th>
            <th scope="col" className="border-b border-ink/10 py-2 pr-4 font-bold">Bust</th>
            <th scope="col" className="border-b border-ink/10 py-2 pr-4 font-bold">Waist</th>
            <th scope="col" className="border-b border-ink/10 py-2 font-bold">Hip</th>
          </tr>
        </thead>
        <tbody>
          {ALL_SIZES.map((s) => {
            const row = SIZE_CHART[s];
            return (
              <tr key={s}>
                <th scope="row" className="border-b border-ink/8 py-2 pr-4 font-semibold text-ink">{s}</th>
                <MeasureCell inch={row.bust} />
                <MeasureCell inch={row.waist} />
                <MeasureCell inch={row.hip} last />
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-ink-soft">
        Body measurements. Between sizes? Size up for more coverage.
      </p>
    </div>
  );
}

const ITEMS: AccordionItem[] = [
  {
    q: "Size & fit",
    a: <SizeChart />,
  },
  {
    q: "Fabric",
    a: (
      <p>
        Buttery-soft four-way stretch that moves with you and dries fast. Every set is fully lined,
        front and back, no see-through surprises.
      </p>
    ),
  },
  {
    q: "Care",
    a: (
      <p>
        Hand wash cold and lay flat to dry. Skip the dryer, the wringing and long chlorine soaks so
        your set keeps its shape and color all summer.
      </p>
    ),
  },
  {
    q: "Does it run true to size?",
    a: (
      <p>
        Yes, PUCCII runs true to size. If you&apos;re between sizes, size up on top for a little more
        coverage. Still unsure? DM us before you order.
      </p>
    ),
  },
];

export default function FitFabric() {
  return (
    <section id="fit" className="scroll-mt-20 bg-sand/40 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="font-hand text-2xl text-puccii-pink">get the fit right</p>
        <h2 className="mb-6 text-[clamp(2rem,7vw,3.2rem)] font-extrabold text-ink">Fit &amp; Fabric</h2>
        <Accordion items={ITEMS} />
      </div>
    </section>
  );
}
