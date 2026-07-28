import { ALL_SIZES } from "@/lib/products";
import Accordion, { type AccordionItem } from "./Accordion";

function SizeChart() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <caption className="sr-only">PUCCII Swim size chart, XS to L</caption>
        <thead>
          <tr className="text-ink">
            <th scope="col" className="border-b border-ink/10 py-2 pr-4 font-bold">Size</th>
            <th scope="col" className="border-b border-ink/10 py-2 pr-4 font-bold">Bust</th>
            <th scope="col" className="border-b border-ink/10 py-2 pr-4 font-bold">Waist</th>
            <th scope="col" className="border-b border-ink/10 py-2 font-bold">Hip</th>
          </tr>
        </thead>
        <tbody className="text-ink-soft">
          {ALL_SIZES.map((s) => (
            <tr key={s}>
              <th scope="row" className="border-b border-ink/8 py-2 pr-4 font-semibold text-ink">{s}</th>
              {/* TODO(owner): fill in real measurements — do not fabricate. */}
              <td className="border-b border-ink/8 py-2 pr-4">TODO</td>
              <td className="border-b border-ink/8 py-2 pr-4">TODO</td>
              <td className="border-b border-ink/8 py-2">TODO</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-xs text-ink-soft">
        Measurements coming soon — DM us your size questions and we&apos;ll help you land the perfect fit.
      </p>
    </div>
  );
}

const ITEMS: AccordionItem[] = [
  {
    q: "Size chart (XS–L)",
    a: <SizeChart />,
  },
  {
    q: "Fabric",
    a: (
      <p>
        Buttery-soft four-way stretch that moves with you and dries fast. Every set is fully lined,
        front and back — no see-through surprises.
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
        Yes — PUCCII runs true to size. If you&apos;re between sizes, size up on top for a little more
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
