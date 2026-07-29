import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import StoryHook from "@/components/StoryHook";
import SessionPhotos from "@/components/SessionPhotos";
import Catalog from "@/components/Catalog";
import StoryFull from "@/components/StoryFull";
import SessionVideos from "@/components/SessionVideos";
import FitFabric from "@/components/FitFabric";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import NoteBreak from "@/components/NoteBreak";
import CartDrawer from "@/components/CartDrawer";
import ShopNow from "@/components/ShopNow";
import FlyToCart from "@/components/FlyToCart";
import CartAnnouncer from "@/components/CartAnnouncer";

export default function Home() {
  return (
    <>
      <Nav />
      {/* Horizontal-scroll clip lives here (not on body) so the sticky nav,
          which is a sibling of <main>, keeps a clean stacking context. */}
      <main className="overflow-x-clip">
        <Hero />
        {/* Sits just after the hero (and its pin spacer). The nav watches the
            hero itself to flip from transparent to cream once it clears. */}
        <div id="hero-sentinel" aria-hidden className="h-px w-full" />
        <Marquee />

        <StoryHook />
        <NoteBreak index={0} side="right" onMobile /> {/* be your own obsession */}

        <SessionPhotos />
        <NoteBreak index={1} side="left" /> {/* life looks better in a bikini */}

        <Catalog />
        <NoteBreak index={2} side="right" onMobile /> {/* the beach is my runway */}

        <StoryFull />
        <NoteBreak index={4} side="left" /> {/* Confidence is the outfit */}

        <SessionVideos />

        <FitFabric />
        <FAQ />
        <NoteBreak index={5} side="right" onMobile /> {/* swimwear and self love */}
      </main>
      <Footer />

      {/* Global overlays */}
      <CartDrawer />
      <ShopNow />
      <FlyToCart />
      <CartAnnouncer />
    </>
  );
}
