import type { IdeaScroll } from "@/content/scrolls";

/** Brocade (the rolled scroll's silk cover) — indigo, crimson, celadon, plum, ochre, teal. */
const SILK = ["#2f3f5c", "#7a2e2a", "#56705d", "#5a3a4f", "#86673a", "#2d4f52"];
/** Roller knobs — ivory, jade, sandalwood, bone. */
const KNOB = ["#e6d9bd", "#9fb89a", "#8a5a38", "#d8cbb0"];
/** Resting variation on the rack, so a full rack doesn't look stamped. */
const LENGTH = [90, 84, 94, 87, 96, 85, 92];
const SHIFT = [0.35, 0.7, 0.5, 0.15, 0.6, 0.4, 0.85];
const THICK = [26, 23, 28, 25, 27, 24];

export function scrollLook(scroll: IdeaScroll, index: number) {
  const i = Math.max(0, index);
  const length = LENGTH[i % LENGTH.length];
  return {
    silk: scroll.silk ?? SILK[i % SILK.length],
    knob: KNOB[(i * 3) % KNOB.length],
    /** % of the cubby's width the rolled scroll spans. */
    length,
    /** % from the cubby's left edge. */
    left: (100 - length) * SHIFT[i % SHIFT.length],
    /** Rolled thickness in px — fuller scrolls sit a little fatter. */
    thick: THICK[i % THICK.length] + Math.min(3, Math.max(0, scroll.passages.length - 2)),
  };
}
