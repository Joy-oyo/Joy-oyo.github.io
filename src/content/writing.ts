export type Writing = {
  slug: string;
  title: string;
  date: string; // ISO yyyy-mm-dd
  excerpt: string;
  tags?: string[];
  /** Paragraphs of the post body. Plain text per paragraph. */
  body?: string[];
};

export const writings: Writing[] = [
  {
    slug: "the-person-i-thank-most-this-year-is-myself",
    title: "The person I thank most this year is myself",
    date: "2023-01-08",
    tags: ["literary"],
    excerpt:
      "On gratitude, loneliness, and the small, unromantic labor of learning to receive love — including my own.",
    body: [
      "On the morning of January 2nd, I woke at eight, assembled myself into the shape of a person, ordered a coffee, and walked out to retrieve it.",
      "All along the way, my mind returned—without my permission, as memory often does—to the year 2022: to its incidents, its accidents of tenderness, the people who had entered and left me like weather. And then, almost without origin, gratitude rose in me. Not a bright gratitude, not one that announced itself, but a quiet one, like a lamp lit in a room no one had entered yet.",
      "A sentence came to me with the finality of something I had not invented, only discovered:",
      "This year, the person I thank most is myself.",
      "I arrived at this sentence because the past year, through its people and its small violences of beauty, had made me into someone more capable of receiving the world. More open. More loving. More willing, perhaps, to believe that love, when it arrives, has not mistaken the address.",
      "There was a time when I secretly believed that good things were not meant for me. And so, when they happened, I diminished them before they could touch me. Every kindness reached me at half its size. Every affection had to pass through the customs office of my insecurity, where it was inspected, taxed, delayed, and often turned away.",
      "Now there is, inside me, a steadier confidence. It is not loud. It does not resemble triumph. It is only the small, stubborn belief that the warmth entering my life belongs here. And because of this, the warmth I offer others has become less hollow. I no longer give merely in order to prove that I am capable of giving. I give because something in me has begun to live.",
      "Part of me wishes I had always been this open, this full of love. But when I think more honestly, I am grateful for the slower version of the story: the one in which I first noticed the absence of love inside myself, then turned toward that emptiness, not dramatically, but deliberately, as one might return each day to water a plant that has not yet decided to survive.",
      "This year, the person I thank most is myself.",
      "Not for greatness. Not for achievement. But for the small, unromantic labor of looking inward. For re-examining the ways I reach for others, the ways I retreat, the ways I confuse self-protection with wisdom. Those private acts, invisible to everyone, taught me how to love. Not abstractly. Not beautifully. But humanly. They taught me how to love the people near me.",
      "I hesitated for a long time over how to write this—the kind of sentence one places between the end of an old year and the beginning of a new one, half farewell and half departure. So let me simply thank the coffee of that morning, and the walk that carried me toward it, for giving me the sentence I could not have found while sitting still.",
      "Last New Year's Eve, I sat alone by the sea, with the noise of a crowd somewhere behind me. At the time, nothing seemed to amount to anything. There was no revelation, no cinematic sorrow, no great internal music. Only a loneliness so complete that no one could enter it—not other people, and not even myself.",
      "Still, I remain grateful for the phone call I received that night. It did not save me, because perhaps nothing saves us all at once. But it loosened, by a small and necessary measure, the high wall my loneliness had built around me. Even now, I would like someone to knock at that wall from time to time—not to destroy it, but to remind me that there is an outside. That I am not only the room I have locked myself in.",
      "This New Year's Eve, I crossed into the unknown with friends beside me, carrying with me the words I have chosen as my talismans: Positivity and Love. They sound simple, almost too bright, and yet I know how much darkness they have had to pass through in order to become sincere.",
      "Over the past year, many people have told me that I am emotionally rich. At first, I denied it. I am not, I would say. And perhaps I said this because I could feel, at the bottom of myself, a coldness I did not want anyone to name. I did not feel abundant. I felt, rather, like someone standing beside a well, unsure whether there was water inside.",
      "But slowly, by hearing it said of me, I began to move toward the possibility. I reached out more. I held on to warmth when it appeared. I tried not to let faint feelings pass me by simply because they were not dramatic enough to frighten me.",
      "I do long, in some secret chamber of myself, for strong emotions. But I want to distinguish warmth from intensity. Intensity performs itself; warmth remains. Intensity wants witnesses; warmth survives in silence.",
      "My instinct, however, is still to discipline myself. I place myself inside the rules I have written for my own conduct: how someone in my position should speak, how she should behave, how much she is allowed to want, how visibly she is permitted to feel. Sometimes I lie to myself and say that if a feeling were strong enough, it would break through every rule. But perhaps feelings do not always break through. Perhaps they are quieter than that. Perhaps they leave when they find no door open.",
      "The inertia of staying within the lines is exactly what allows feeling to disappear. Like sand in a fist: the harder one insists on possession, the faster everything escapes.",
      "If only I could give more blind confidence to the emotions between people. If only I could trust my own emotions before requiring them to prove themselves extraordinary.",
      "This year, I want to write more. I want to ask for a little more luck, too—not the vulgar luck of sudden miracles, but the gentler kind: to meet the right people, to recognize the right moments, to remain open when I would rather become elegant and cold.",
      "The throughline is still Positivity and Love.",
      "The lesson is confidence and warmth.",
      "And also this: to resist the glittering performance of intensity, the temptation to mistake display for depth.",
      "I owe myself a proper accounting. And perhaps this is the beginning of it.",
    ],
  },
  {
    slug: "on-designing-playful-tools",
    title: "On designing playful tools",
    date: "2024-11-02",
    excerpt:
      "Why the best tools feel like toys — and how that changes how we design them.",
  },
  {
    slug: "three-js-and-restraint",
    title: "Three.js and restraint",
    date: "2024-09-18",
    excerpt:
      "You don't need every particle in the world. Some notes on quieter 3D.",
  },
  {
    slug: "the-tree-series",
    title: "The tree series",
    date: "2024-07-01",
    excerpt:
      "A short note behind four photographs of the same tree across a day.",
  },
];
