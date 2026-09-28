import TaijiHome from "@/components/TaijiHome";
import Landing from "@/components/Landing";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <TaijiHome>
      <main id="main" className="relative">
        <Landing />
        <TimelineSection />
      </main>
      <Footer />
    </TaijiHome>
  );
}
