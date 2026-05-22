import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Baby, HeartPulse, Stethoscope, Syringe } from "lucide-react";
import maternity from "@/assets/maternity.jpg";

const items = [
  "Normal delivery", "Cesarean section delivery", "Antenatal clinics", "Postnatal clinics",
  "Child welfare clinic", "Immunization / Vaccination", "New Born Unit (NBU)",
  "Obstetric ultrasound", "Family planning services",
];

export const Route = createFileRoute("/_public/maternity")({
  head: () => ({ meta: [{ title: "Maternity Services — Oakwood Hospital" }, { name: "description", content: "Safe, warm maternity care 24/7 — antenatal, delivery, postnatal, NBU and family planning." }] }),
  component: () => (
    <>
      <PageHero eyebrow="Welcoming new life" title="Maternity Services" subtitle="Personalized maternal and newborn care — 24 hours a day, 7 days a week." />
      <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow-gold ring-1 ring-gold/30">
          <img src={maternity} alt="Maternity" loading="lazy" className="w-full object-cover aspect-[4/3]" />
        </div>
        <div>
          <span className="text-xs tracking-[0.25em] uppercase text-gold">24/7 Service</span>
          <h2 className="font-display text-3xl text-primary mt-3">Care for mother & baby</h2>
          <ul className="mt-6 grid grid-cols-1 gap-2">
            {items.map(i => (
              <li key={i} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
                <span className="w-8 h-8 rounded-md gradient-purple grid place-items-center text-gold"><Baby className="h-4 w-4" /></span>
                <span className="text-sm">{i}</span>
              </li>
            ))}
          </ul>
          <Button asChild className="mt-6"><Link to="/auth">Book Maternity Appointment</Link></Button>
        </div>
      </section>
    </>
  ),
});
