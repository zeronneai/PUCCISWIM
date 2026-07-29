import Link from "next/link";
import { SITE } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo
              heightClass="h-10"
              tone="light"
              fallback={
                <span className="flex items-baseline gap-1.5">
                  <span className="font-display text-3xl font-extrabold">PUCCII</span>
                  <span className="font-hand text-3xl text-puccii-pink">swim</span>
                </span>
              }
            />
            <p className="mt-2 max-w-xs text-cream/70">
              {SITE.tagline} {SITE.by}.
            </p>
            <p className="mt-1 font-hand text-2xl text-butter">be bold, be beachy, be PUCCII</p>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <a href={SITE.igUrl} target="_blank" rel="noreferrer" className="font-semibold hover:text-puccii-pink">
              Instagram · @{SITE.igHandle}
            </a>
            <a href={SITE.founderUrl} target="_blank" rel="noreferrer" className="text-cream/70 hover:text-puccii-pink">
              Founder · @{SITE.founderHandle}
            </a>
            <a href={`mailto:${SITE.contactEmail}`} className="text-cream/70 hover:text-puccii-pink">
              {SITE.contactEmail}
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-cream/15 pt-6 text-sm text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE.legalName}. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/delivery-policy" className="hover:text-cream">Delivery Policy</Link>
            <Link href="/return-policy" className="hover:text-cream">Return Policy</Link>
            <Link href="/terms" className="hover:text-cream">Terms</Link>
            <Link href="/privacy" className="hover:text-cream">Privacy</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
