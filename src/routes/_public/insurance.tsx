import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import { insurers as branded } from "@/components/site/insurers";

const extra = ["First Assurance", "ICEA Lion", "UAP", "GA Insurance"].map((name) => ({ name, full: name, logo: undefined }));
const insurers = [...branded, ...extra];

export const Route = createFileRoute("/_public/insurance")({
  head: () => ({ meta: [{ title: "Insurance Partners — Oakwood Hospital" }] }),
  component: () => (
    <>
      <PageHero eyebrow="We Accept" title="Insurance Partners" subtitle="We work with the country's leading insurers — and we're adding more all the time." />
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {insurers.map(({ name, full, logo }) => (
            <div key={name} className="bg-card border border-border rounded-xl p-6 text-center shadow-soft hover:shadow-gold transition-all flex flex-col items-center gap-3">
              <span className="w-16 h-16 rounded-lg bg-background border border-border grid place-items-center overflow-hidden">
                {logo ? (
                  <img src={logo} alt={`${full} logo`} width={56} height={56} loading="lazy" className="w-14 h-14 object-contain" />
                ) : (
                  <ShieldCheck className="h-7 w-7 text-primary" />
                )}
              </span>
              <p className="font-display text-lg text-primary">{name}</p>
              <p className="text-xs text-primary/70 uppercase tracking-wider -mt-2">Accepted</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">Don't see your insurer? Contact us — we likely accept it.</p>
      </section>
    </>
  ),
});
