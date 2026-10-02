"use client";

import Link from "next/link";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { blogSections, type BlogSectionId, type Writing } from "@/content/writing";
import PaperPlane from "./PaperPlane";
import styles from "./BlogFlights.module.css";

const destinations = {
  tech: { name: "Built worlds", x: 22, y: 31 },
  humanities: { name: "The inner world", x: 76, y: 27 },
  intersection: { name: "Somewhere between", x: 52, y: 68 },
};
const date = (value: string) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function BlogFlights({ posts }: { posts: Writing[] }) {
  const [topic, setTopic] = useState<BlogSectionId | "all">("all");
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const visible = topic === "all" ? posts : posts.filter((post) => post.section === topic);
  const moving = !paused && !reduceMotion;

  return (
    <div className={styles.world}>
      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}><span /> A notebook, in motion</p>
          <h1>Thoughts<br />in <em>flight.</em><PaperPlane className={styles.titlePlane} /></h1>
        </div>
        <div className={styles.introAside}>
          <p>Some thoughts about today’s world.<br />A little tech. A little humanities.<br />A lot of figuring it out.</p>
          <a href="#flight-notes" className={styles.textLink}>Find a place to land <span aria-hidden="true">↘</span></a>
        </div>
      </header>

      <section className={styles.atlas} aria-label="Explore writing destinations">
        <div className={styles.mapHeading}><span>FIELD MAP / 001</span><span>Ideas don’t travel in straight lines.</span></div>
        <svg viewBox="0 0 1000 440" preserveAspectRatio="none" className={styles.landscape} aria-hidden="true">
          <defs>
            <pattern id="flight-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#36556b" strokeOpacity=".065" /></pattern>
            <pattern id="flight-trees" width="25" height="24" patternUnits="userSpaceOnUse"><path d="m8 18 5-11 5 11Z" fill="none" stroke="#687965" strokeOpacity=".25" /></pattern>
          </defs>
          <rect width="1000" height="440" fill="#e9eee8" />
          <path d="M0 0H460C425 53 513 85 462 126S498 190 419 231 418 288 342 310 324 385 248 440H0Z" fill="#e0e7d9" />
          <path d="M1000 0H766C797 51 705 106 768 152S704 222 772 278 723 362 811 440H1000Z" fill="#d8e4dd" />
          <path d="M444-20C414 52 507 84 455 126S489 192 410 231 405 284 333 309 319 382 237 460" fill="none" stroke="#c0d5d9" strokeWidth="34" />
          <path d="M444-20C414 52 507 84 455 126S489 192 410 231 405 284 333 309 319 382 237 460" fill="none" stroke="#eff5ef" strokeWidth="1.5" />
          <rect width="1000" height="440" fill="url(#flight-grid)" />
          <path d="M763 36c-51 19-26 54 1 81s-5 71 28 84 128 4 127-39-46-157-156-126Z" fill="url(#flight-trees)" />
          <g fill="none" stroke="#7f9488" strokeOpacity=".22">
            <path d="M690 10c-98 70 50 106-19 172s-27 113 37 120 27 66 4 91" /><path d="M713 7c-100 88 57 113-10 182s-20 91 43 104 13 73-8 119" /><path d="M738 0c-109 110 57 112-8 189s-4 80 52 94 17 93-11 140" />
          </g>
          <g fill="#c6d0c5" stroke="#a9b7aa" strokeWidth="1">
            <path d="M104 120h25v44h-25zM138 95h38v69h-38zM185 127h21v37h-21zM106 178h44v27h-44zM160 178h31v47h-31zM201 178h24v27h-24z" />
          </g>
          <g fill="none" stroke="#92a3a0" strokeWidth="1.2"><path d="m91 229 153-8M233 79l14 157M476 301l100-19M482 310l100-19" /></g>
          <path d="M228 177C255 9 697 18 770 160S573 396 478 305 618 163 476 148 269 370 168 295" fill="none" stroke="#234b7d" strokeOpacity=".45" strokeDasharray="3 7" strokeLinecap="round" strokeWidth="1.5" />
          <g transform="translate(937 343)" fill="none" stroke="#556b6c"><circle r="24" opacity=".25" /><path d="M0-32V32M-32 0H32" opacity=".25" /><path d="m0-18 4 18-4 18-4-18Z" strokeWidth=".7" /><text x="0" y="-39" textAnchor="middle" fontSize="9" fill="#556b6c" stroke="none">N</text></g>
        </svg>
        <div className={styles.flyingPlane} data-moving={moving} aria-hidden="true"><PaperPlane /></div>
        {blogSections.map((section) => {
          const destination = destinations[section.id];
          const count = posts.filter((post) => post.section === section.id).length;
          return (
            <button key={section.id} type="button" className={styles.destination} style={{ left: `${destination.x}%`, top: `${destination.y}%` }} data-selected={topic === section.id} aria-pressed={topic === section.id} onClick={() => setTopic(topic === section.id ? "all" : section.id)}>
              <span className={styles.mapPin} aria-hidden="true" />
              <span className={styles.placeName}>{destination.name}</span>
              <span className={styles.placeMeta}>{section.label} · {count} {count === 1 ? "note" : "notes"}</span>
            </button>
          );
        })}
        <div className={styles.mapFooter}><span><i /> Pick a destination. Follow a thought.</span><button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} disabled={!!reduceMotion}>{reduceMotion ? "Still skies" : paused ? "Resume flight ↗" : "Pause flight Ⅱ"}</button></div>
      </section>

      <section id="flight-notes" className={styles.notes} aria-labelledby="notes-title">
        <div className={styles.notesHeader}>
          <div><p className={styles.eyebrow}>Letters from along the way</p><h2 id="notes-title">Places my mind has been.</h2></div>
          <div className={styles.filters} role="group" aria-label="Filter posts by topic">
            {[{ id: "all" as const, label: "All flights" }, ...blogSections].map((section) => <button key={section.id} type="button" aria-pressed={topic === section.id} onClick={() => setTopic(section.id)}>{section.label}</button>)}
          </div>
        </div>
        <p className={styles.resultCount} role="status">{visible.length} {visible.length === 1 ? "note" : "notes"}{topic !== "all" ? ` in ${blogSections.find((section) => section.id === topic)?.label}` : " in flight"}</p>
        {visible.length ? <ol className={styles.postGrid}>{visible.map((post) => (
          <li key={post.slug}>
            <Link href={`/writing/${post.slug}`} className={styles.post}>
              <span className={styles.fold} aria-hidden="true" />
              <div className={styles.postMeta}><span>FLIGHT {String(posts.indexOf(post) + 1).padStart(3, "0")}</span><time dateTime={post.date}>{date(post.date)}</time></div>
              <div className={styles.postContent}><div><p className={styles.postTopic}>{blogSections.find((section) => section.id === post.section)?.label}</p><h3>{post.title}</h3><p className={styles.excerpt}>{post.excerpt}</p></div><PaperPlane className={styles.postPlane} /></div>
              <div className={styles.postBottom}><span>{post.place ?? "From my notebook"} <span aria-hidden="true">·</span> {Math.max(1, Math.round((post.body?.join(" ").split(/\s+/).length ?? 0) / 220))} min read</span><span className={styles.read}>Unfold the note <span aria-hidden="true">↗</span></span></div>
            </Link>
          </li>
        ))}</ol> : <div className={styles.empty}><PaperPlane /><h3>No landings here yet.</h3><p>A little space for the thoughts still taking shape.</p><button type="button" onClick={() => setTopic("all")}>Back to all flights ↗</button></div>}
      </section>
      <p className={styles.signoff}>Still learning. Still folding. Still sending things out into the world.</p>
    </div>
  );
}
