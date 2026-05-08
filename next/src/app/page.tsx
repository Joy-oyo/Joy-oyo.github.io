import SceneBackground from "@/components/SceneBackground";
import Hero from "@/components/Hero";
import AlbumStack from "@/components/AlbumStack";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <SceneBackground />
      <main className="relative">
        <Hero />
        <AlbumStack />
      </main>
      <Footer />
    </>
  );
}
