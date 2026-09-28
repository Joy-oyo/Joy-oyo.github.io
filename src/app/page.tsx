import TaijiHome from "@/components/TaijiHome";
import Landing from "@/components/Landing";
import TimelineSection from "@/components/TimelineSection";

export default function HomePage() {
  return (
    <TaijiHome>
      <main id="main" className="relative">
        <Landing />
        {/* Footer is rendered inside the trajectory section: on this page it
            is the right-hand card of the closing pair, beside Education. */}
        <TimelineSection />
      </main>
    </TaijiHome>
  );
}
