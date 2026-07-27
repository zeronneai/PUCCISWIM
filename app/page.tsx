import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ValueStrip from "@/components/ValueStrip";
import Catalog from "@/components/Catalog";
import Breaker from "@/components/Breaker";
import MeetMya from "@/components/MeetMya";
import FitFabric from "@/components/FitFabric";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import StickyMobileBar from "@/components/StickyMobileBar";
import FlyToCart from "@/components/FlyToCart";
import CartAnnouncer from "@/components/CartAnnouncer";

export default function Home() {
  return (
    <>
      <Marquee />
      <Nav />
      <main>
        <Hero />
        <ValueStrip />
        <Catalog />
        <Breaker />
        <MeetMya />
        <FitFabric />
        <FAQ />
      </main>
      <Footer />

      {/* Global overlays */}
      <CartDrawer />
      <StickyMobileBar />
      <FlyToCart />
      <CartAnnouncer />
    </>
  );
}
