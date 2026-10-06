"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { type Writing } from "@/content/writing";
import PaperPlane from "./PaperPlane";
import styles from "./BlogFlights.module.css";

const date = (value: string) => new Date(value).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
type Departure = { post: Writing; x: number; y: number; width: number; height: number };

export default function BlogFlights({ posts }: { posts: Writing[] }) {
  const ordered = [...posts].sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug));
  const [departure, setDeparture] = useState<Departure | null>(null);
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  function launch(post: Writing, link: HTMLAnchorElement) {
    if (departure) return;
    const plane = link.querySelector("svg")?.getBoundingClientRect() ?? link.getBoundingClientRect();
    router.prefetch(`/writing/${post.slug}`);
    setDeparture({ post, x: plane.left + plane.width / 2, y: plane.top + plane.height / 2, width: window.innerWidth, height: window.innerHeight });
  }

  return (
    <div className={styles.world}>
      <header className={styles.intro}>
        <div><p className={styles.eyebrow}>The flight journal</p><h1>One thought.<br /><em>Then another.</em></h1></div>
      </header>

      <section id="flight-route" className={styles.route} aria-label="Blog posts in chronological order">
        <div className={styles.routeLegend}><span>Thoughts in flight / {String(ordered.length).padStart(2, "0")} {ordered.length === 1 ? "note" : "notes"}</span><span>Oldest → newest</span></div>
        <div className={styles.departure}><span />The first fold</div>
        <ol className={styles.stops}>
          {ordered.map((post, index) => (
            <li className={styles.stop} key={post.slug}>
              <svg viewBox="0 0 1000 280" preserveAspectRatio="none" className={styles.desktopTrail} aria-hidden="true"><path d={index % 2 === 0 ? "M500 0C500 70 300 40 300 140S500 210 500 280" : "M500 0C500 70 700 40 700 140S500 210 500 280"} /></svg>
              <svg viewBox="0 0 100 280" preserveAspectRatio="none" className={styles.mobileTrail} aria-hidden="true"><path d="M18 0C18 55 8 65 18 140S28 220 18 280" /></svg>
              <Link href={`/writing/${post.slug}`} className={styles.stopButton} onClick={(event) => {
                // Preserve normal links for new tabs and reduced-motion navigation.
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || reduceMotion) return;
                event.preventDefault();
                launch(post, event.currentTarget);
              }} aria-label={`Read ${post.title}, ${date(post.date)}`}>
                <span className={styles.plane}><span className={styles.orbit} /><PaperPlane /><span className={styles.flightNumber}>{String(index + 1).padStart(3, "0")}</span></span>
                <span className={styles.caption}>
                  <time dateTime={post.date}>{date(post.date)}</time>
                  <span className={styles.postTitle}>{post.title}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className={styles.continued}><span className={styles.endDot} /><p>The route is still being written.</p><span>Somewhere between where I’ve been and where I’m going.</span></div>
      </section>
      {departure && <FlightTransition departure={departure} onArrive={() => router.push(`/writing/${departure.post.slug}`)} />}
    </div>
  );
}

function FlightTransition({ departure, onArrive }: { departure: Departure; onArrive: () => void }) {
  const { post, x, y, width, height } = departure;
  const endX = width / 2;
  const endY = Math.min(height * .3, 230);

  return (
    <div className={styles.flightStage}>
      <p className="sr-only" role="status">Opening {post.title}</p>
      <motion.svg aria-hidden="true" className={styles.launchTrail} viewBox={`0 0 ${width} ${height}`}><motion.path d={`M${x} ${y} C${endX + 150} ${Math.max(90, y - 160)}, ${endX - 140} ${Math.max(70, endY - 100)}, ${endX} ${endY}`} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: [.1, .7, 0] }} transition={{ duration: .85 }} /></motion.svg>
      <motion.div aria-hidden="true" className={styles.launchedPlane} initial={{ x: x - 32, y: y - 32, rotate: 0, scale: 1 }} animate={{ x: [x - 32, endX + 65, endX - 110, endX - 32], y: [y - 32, Math.max(60, y - 170), Math.max(45, endY - 110), endY - 32], rotate: [0, -25, 45, 12], scale: [1, .8, 1.3, 1] }} transition={{ duration: .85, ease: "easeInOut" }} onAnimationComplete={onArrive}><PaperPlane /></motion.div>
    </div>
  );
}
