import { site } from "@/content/site";

/**
 * SiteCopyright — the closing line of the whole page, rendered in the
 * root layout below every route rather than inside the footer card.
 *
 * It inverts itself against whatever sits behind it (see `.site-copyright`
 * in globals.css), so it stays legible on the dark pages and on both
 * halves of the home taiji split.
 */
export default function SiteCopyright() {
  return (
    <div className="site-copyright" data-no-flip>
      © {new Date().getFullYear()} · {site.name} · Hedgehog and Fox
    </div>
  );
}
