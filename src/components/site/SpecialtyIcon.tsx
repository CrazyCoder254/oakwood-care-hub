import {
  Activity,
  Baby,
  Bone,
  Brain,
  Ear,
  Eye,
  HeartPulse,
  Scissors,
  Smile,
  Stethoscope,
  Syringe,
  User,
  type LucideIcon,
} from "lucide-react";

const MAP: { match: string[]; icon: LucideIcon }[] = [
  { match: ["orthop", "bone", "spine", "fracture"], icon: Bone },
  { match: ["obstetric", "gyn", "maternity", "midwif", "paediatric", "pediatric", "child", "neonat"], icon: Baby },
  { match: ["cardio", "heart"], icon: HeartPulse },
  { match: ["neuro", "brain", "psych", "mental"], icon: Brain },
  { match: ["ophthal", "eye", "optom"], icon: Eye },
  { match: ["ent", "ear", "nose", "throat"], icon: Ear },
  { match: ["dent", "oral"], icon: Smile },
  { match: ["surg", "theatre"], icon: Scissors },
  { match: ["anaesth", "anesth", "vaccin", "immun"], icon: Syringe },
  { match: ["radiolog", "ultrasound", "imaging", "lab", "patholog"], icon: Activity },
  { match: ["physician", "general", "family", "medicine", "outpatient"], icon: Stethoscope },
];

export function getSpecialtyIcon(specialty?: string | null): LucideIcon {
  const s = (specialty ?? "").toLowerCase();
  return MAP.find(m => m.match.some(k => s.includes(k)))?.icon ?? User;
}

export function SpecialtyIcon({ specialty, className }: { specialty?: string | null; className?: string }) {
  const Icon = getSpecialtyIcon(specialty);
  return <Icon className={className} />;
}
