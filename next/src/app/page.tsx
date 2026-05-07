import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Marquee from "@/components/Marquee";
import Orbit from "@/components/Orbit";
import ProjectSection from "@/components/ProjectSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import { projects } from "@/content/portfolio";

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Marquee />
        <Orbit />
        <section id="work" className="scroll-mt-24">
          {projects.map((p, i) => (
            <ProjectSection key={p.id} project={p} alt={i % 2 === 1} />
          ))}
        </section>
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
