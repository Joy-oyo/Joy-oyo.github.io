import {
  Briefcase,
  Camera,
  Gamepad2,
  Palette,
  Rocket,
  Image as ImageIcon,
  ArrowRight,
  Play,
  type LucideIcon,
} from "lucide-react";

export type IconKey =
  | "briefcase"
  | "camera"
  | "gamepad"
  | "palette"
  | "rocket"
  | "image"
  | "arrow-right"
  | "play";

export const Icons: Record<IconKey, LucideIcon> = {
  briefcase: Briefcase,
  camera: Camera,
  gamepad: Gamepad2,
  palette: Palette,
  rocket: Rocket,
  image: ImageIcon,
  "arrow-right": ArrowRight,
  play: Play,
};
