import SceneBackground from "@/components/SceneBackground";
import Landing from "@/components/Landing";
import TimelineSection from "@/components/TimelineSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <SceneBackground />
      <main className="relative">
        <Landing />
        <TimelineSection />
      </main>
      <Footer />
    </>
  );
}
