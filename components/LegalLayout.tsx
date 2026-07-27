import Link from "next/link";
import { SITE } from "@/lib/site";

export default function LegalLayout({
  title,
  updated = "July 2026",
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[100svh] bg-cream">
      <header className="border-b border-ink/10 bg-cream/90 px-5 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-baseline gap-1.5">
            <span className="font-display text-xl font-extrabold text-ink">PUCCII</span>
            <span className="font-hand text-xl text-puccii-pink">swim</span>
          </Link>
          <Link href="/" className="text-sm font-semibold text-ink-soft hover:text-puccii-pink">
            ← Back to shop
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-2xl px-5 py-12">
        <h1 className="font-display text-[clamp(2rem,7vw,3rem)] font-extrabold text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-soft">Last updated {updated}</p>
        <div className="prose-legal mt-8 space-y-5 text-ink-soft leading-relaxed [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_a]:font-semibold [&_a]:text-puccii-pink [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>

        <p className="mt-12 border-t border-ink/10 pt-6 text-sm text-ink-soft">
          Questions? DM{" "}
          <a href={SITE.igUrl} className="font-semibold text-puccii-pink">@{SITE.igHandle}</a> or email{" "}
          <a href={`mailto:${SITE.contactEmail}`} className="font-semibold text-puccii-pink">
            {SITE.contactEmail}
          </a>
          .
        </p>
      </article>
    </main>
  );
}
