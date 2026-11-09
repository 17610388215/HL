import {
  ArrowLeftRight,
  AudioLines,
  Calculator,
  Code2,
  Files,
  Image as ImageIcon,
  Sparkles,
  Type,
} from "lucide-react";

const icons = { Files, Image: ImageIcon, Calculator, Type, ArrowLeftRight, Code2, Sparkles, AudioLines };

export function CategoryIcon({ name, size = 22 }: { name: string; size?: number }) {
  const Icon = icons[name as keyof typeof icons] ?? Sparkles;
  return <Icon aria-hidden="true" size={size} strokeWidth={1.8} />;
}
