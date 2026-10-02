import Footer from "@/components/Footer";
import BlogFlights from "@/components/writing/BlogFlights";
import { publishedWritings } from "@/content/writing";

export const metadata = {
  title: "Thoughts in flight · Blog",
  description: "A little tech, a little humanities, and a lot of figuring it out. Notes from Joy Chen’s notebook.",
};

export default function WritingPage() {
  return (
    <>
      <main id="main" className="relative bg-[radial-gradient(ellipse_at_65%_0%,#1c2d45_0%,#0b1423_45%,#080c13_100%)] pb-20 pt-28 md:pt-32">
        <BlogFlights posts={publishedWritings} />
      </main>
      <Footer />
    </>
  );
}
