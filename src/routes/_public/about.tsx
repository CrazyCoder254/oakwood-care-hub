import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero, SectionHeader } from "@/components/site/Section";
import { Award, HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/_public/about")({
  head: () => ({ meta: [{ title: "About — Oakwood Hospital" }, { name: "description", content: "Our vision, mission and core values: compassion, care, respect, integrity, professionalism and trust." }] }),
  component: AboutPage,
});

const values = [
  { icon: HeartHandshake, label: "Compassion & Care" },
  { icon: Users, label: "Respect" },
  { icon: ShieldCheck, label: "Integrity" },
  { icon: Award, label: "Professionalism" },
  { icon: Sparkles, label: "Trust" },
];

function AboutPage() {
  const { data: sections } = useQuery({
    queryKey: ["cms", "about"],
    queryFn: async () => {
      const { data } = await supabase.from("cms_sections").select("*").like("key", "about_%");
      return Object.fromEntries((data ?? []).map(s => [s.key, s]));
    },
  });

  return (
    <>
      <PageHero eyebrow="Oakwood Hospital Charter" title="About Us" subtitle="We are committed to providing health care to all our patients regardless of gender, race, religion, and cultural beliefs." />
      <section className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-10">
        <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
          <span className="text-xs tracking-[0.25em] uppercase text-gold">Vision</span>
          <h2 className="font-display text-3xl text-primary mt-3">{sections?.about_vision?.title}</h2>
          <p className="mt-3 text-muted-foreground leading-relaxed">{sections?.about_vision?.body}</p>
        </div>
        <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-soft">
          <span className="text-xs tracking-[0.25em] uppercase text-gold">Mission</span>
          <h2 className="font-display text-3xl text-gold mt-3">{sections?.about_mission?.title}</h2>
          <p className="mt-3 text-primary-foreground/85 leading-relaxed">{sections?.about_mission?.body}</p>
        </div>
      </section>
      <section className="bg-cream py-20">
        <div className="container mx-auto px-4">
          <SectionHeader eyebrow="What we stand for" title="Our Core Values" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {values.map(v => (
              <div key={v.label} className="text-center bg-card border border-border rounded-xl p-6 shadow-soft">
                <div className="w-12 h-12 rounded-full gradient-purple grid place-items-center text-gold mx-auto mb-3"><v.icon className="h-5 w-5" /></div>
                <p className="font-display text-primary">{v.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
