import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/Section";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_public/team")({
  head: () => ({ meta: [{ title: "Our Team — Oakwood Hospital" }, { name: "description", content: "Meet the warm, qualified clinicians at Oakwood Hospital." }] }),
  component: TeamPage,
});

function TeamPage() {
  const { data: doctors } = useQuery({
    queryKey: ["doctors", "all"],
    queryFn: async () => (await supabase.from("doctors").select("*").eq("is_active", true)).data ?? [],
  });
  return (
    <>
      <PageHero eyebrow="Trusted clinicians" title="Our Team" subtitle="A team of warm, qualified clinicians dedicated to trusted care, closer to you." />
      <section className="container mx-auto px-4 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors?.map(d => (
            <div key={d.id} className="bg-card rounded-xl overflow-hidden border border-border shadow-soft">
              <div className="aspect-[4/5] bg-secondary overflow-hidden">
                {d.photo_url && <img src={d.photo_url} alt={d.name} loading="lazy" className="w-full h-full object-cover" />}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-primary">{d.name}</h3>
                <p className="text-xs text-gold uppercase tracking-wider mt-1">{d.specialty}</p>
                <p className="text-xs text-muted-foreground mt-2">{d.title}</p>
                {d.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{d.bio}</p>}
                <p className="text-xs text-muted-foreground mt-3">Available: {(d.schedule_days ?? []).join(", ")}</p>
                <Button asChild size="sm" className="mt-4 w-full"><Link to="/auth">Book Appointment</Link></Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
