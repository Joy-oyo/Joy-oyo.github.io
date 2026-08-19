import ReadingCollectionEmbed from "@/components/ReadingCollectionEmbed";

export const metadata = {
  title: "Reading — Joy Chen",
  description:
    "Joy's reading collection — interactive chapter guides for the books worth keeping.",
};

/**
 * The reading page *is* the collection now: the static document takes the whole
 * viewport instead of being one card among many. The site nav auto-hides on
 * this route (see Nav) because the dark glass bar and the collection's paper
 * surface do not sit well together — it slides in on a hover at the top edge.
 */
export default function ReadingPage() {
  return <ReadingCollectionEmbed />;
}
