/**
 * The humanities face of the secret bookshelf holds scrolls, not books:
 * each scroll is one idea, and unrolling it shows the passages kept
 * under that idea.
 *
 * Add a scroll by adding an entry below. Passages written mostly in
 * Chinese are set vertically (right to left) automatically.
 */
export type Passage = {
  /** The excerpt, quoted as written. Use "\n" for a line break. */
  text: string;
  /** Who / where it comes from, e.g. "Keats · Endymion". */
  source?: string;
  /** Optional marginal note of your own. */
  note?: string;
};

export type IdeaScroll = {
  id: string;
  /** The idea the scroll is about — shown on its title slip. */
  title: string;
  /** One character for the hanging tag and the seal, e.g. "梦". */
  glyph?: string;
  /** A short line under the title when the scroll is open. */
  line?: string;
  /** Brocade colour of the rolled scroll; a palette colour when omitted. */
  silk?: string;
  passages: Passage[];
};

export const ideaScrolls: IdeaScroll[] = [
  {
    id: "love-as-seeing",
    title: "To Keep Seeing",
    glyph: "见",
    line: "On intimacy, attention, and letting another remain other.",
    passages: [
      {
        text: "两个人共同经历的往事，\n会逐渐形成一种只有彼此才能完全理解的语言。",
        note: "Intimacy creates a private world of shared meaning.",
      },
      {
        text: "I feel rich enough never to have tried to pass off as mine the thoughts that belonged to someone else.",
        source: "André Gide",
        note: "To be changed by another person is not to possess what belongs to them.",
      },
      {
        text: "人往往只接受自己愿意接受的东西，\n而忽略那些不符合既有印象的部分。",
        note: "We often encounter our idea of a person before we encounter the person themselves.",
      },
      {
        text: "习惯使我们对原本值得注意的事物失去感觉。",
        note: "The danger of familiarity is not distance, but ceasing to see what remains beside us.",
      },
      {
        text: "知得愈多，爱得愈多；\n爱得愈多，知得愈多。",
        note: "Attention becomes understanding; understanding deepens affection; affection returns us to attention.",
      },
      {
        text: "我愿他人活在我身上，\n我愿自己活在他人身上。",
        note: "Intimacy as mutual inhabitation rather than possession.",
      },
      {
        text: "绝望之为虚妄，\n正与希望相同。",
        source: "鲁迅 · 野草 · 希望",
        note: "Hope and despair can both become projections. What remains is attention to the present.",
      },
    ],
  },
];

/** True when a passage is mostly Chinese / CJK and reads best vertically. */
export function isVerticalText(text: string) {
  const chars = text.replace(/\s/g, "");
  const cjk = chars.match(/[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/g)?.length ?? 0;
  return chars.length > 0 && cjk / chars.length > 0.5;
}
