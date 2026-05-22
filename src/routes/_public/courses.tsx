import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Check, Clock, GraduationCap } from "lucide-react";
import training from "@/assets/training.jpg";

export const Route = createFileRoute("/_public/courses")({
  head: () => ({ meta: [{ title: "Training Institute — Oakwood Hospital" }, { name: "description", content: "Certificate in Health Care Assistant and other healthcare training at Oakwood Training Institute." }] }),
  component: CoursesPage,
});

function CoursesPage() {
  const { data: courses } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => (await supabase.from("courses").select("*").eq("is_active", true)).data ?? [],
  });
  return (
    <>
      <PageHero eyebrow="Oakwood Training Institute" title="Learn. Heal. Lead." subtitle="Practical, work-ready healthcare training delivered by working clinicians." />
      <section className="container mx-auto px-4 py-20">
        {courses?.map(c => (
          <div key={c.id} className="grid md:grid-cols-2 gap-10 bg-card rounded-3xl overflow-hidden border border-border shadow-soft">
            <div className="aspect-video md:aspect-auto"><img src={training} alt={c.title} loading="lazy" className="w-full h-full object-cover" /></div>
            <div className="p-8 md:p-12">
              <span className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-gold"><GraduationCap className="h-3 w-3" /> Certificate</span>
              <h2 className="font-display text-3xl text-primary mt-3">{c.title}</h2>
              <p className="text-muted-foreground mt-3">{c.description}</p>
              <p className="mt-4 text-sm flex items-center gap-2 text-primary"><Clock className="h-4 w-4 text-gold" /> {c.duration}</p>
              <h3 className="font-display text-lg text-primary mt-6">Course content</h3>
              <ul className="mt-3 grid sm:grid-cols-2 gap-2">
                {(c.modules ?? []).map((m: string) => (
                  <li key={m} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" /> {m}</li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground mt-4">{c.price_text}</p>
              <Button asChild className="mt-6"><Link to="/auth">Enrol now</Link></Button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
