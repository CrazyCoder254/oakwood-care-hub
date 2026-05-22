import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero, SectionHeader } from "@/components/site/Section";
import { HeartPulse } from "lucide-react";

export const Route = createFileRoute("/_public/services")({
  head: () => ({ meta: [{ title: "Services — Oakwood Hospital" }, { name: "description", content: "Outpatient, inpatient, maternity, ICU/HDU, surgery, lab, radiology, dental, physio, palliative, nutrition and specialist clinics." }] }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useQuery({
    queryKey: ["services", "all"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      return data ?? [];
    },
  });

  const general = services?.filter(s => s.category !== "specialist") ?? [];
  const specialist = services?.filter(s => s.category === "specialist") ?? [];

  return (
    <>
      <PageHero eyebrow="What we offer" title="Services" subtitle="A full spectrum of compassionate, expert care — available 24/7." />
      <section className="container mx-auto px-4 py-20">
        <SectionHeader eyebrow="Hospital services" title="Services Offered" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {general.map(s => (
            <div key={s.id} className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-gold transition-all">
              <div className="w-10 h-10 rounded-lg gradient-purple grid place-items-center text-gold mb-3"><HeartPulse className="h-4 w-4" /></div>
              <h3 className="font-display text-lg text-primary">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs tracking-[0.25em] uppercase text-gold">Weekly schedule</span>
            <h2 className="font-display text-3xl md:text-4xl text-gold mt-2">Specialist Clinics</h2>
            <div className="gold-divider w-24 mx-auto mt-4" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specialist.map(s => (
              <div key={s.id} className="bg-primary-foreground/5 border border-gold/20 rounded-xl p-5">
                <h3 className="font-display text-lg text-gold">{s.title}</h3>
                <p className="text-xs uppercase tracking-wider text-primary-foreground/70 mt-1">{(s.available_days ?? []).join(" · ")}</p>
                <p className="text-sm text-primary-foreground/85 mt-2">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
