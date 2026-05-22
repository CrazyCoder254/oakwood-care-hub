import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/Section";

const insurers = ["SHA","NHIF","Linda Mama","Britam","Jubilee","AAR","MUA","Liaison","M-TIBA","Madison","CIC","Old Mutual","First Assurance","ICEA Lion","UAP","GA Insurance"];

export const Route = createFileRoute("/_public/insurance")({
  head: () => ({ meta: [{ title: "Insurance Partners — Oakwood Hospital" }] }),
  component: () => (
    <>
      <PageHero eyebrow="We Accept" title="Insurance Partners" subtitle="We work with the country's leading insurers — and we're adding more all the time." />
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {insurers.map(i => (
            <div key={i} className="bg-card border border-border rounded-xl p-6 text-center shadow-soft hover:shadow-gold transition-all">
              <p className="font-display text-lg text-primary">{i}</p>
              <p className="text-xs text-gold uppercase tracking-wider mt-1">Accepted</p>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8">Don't see your insurer? Contact us — we likely accept it.</p>
      </section>
    </>
  ),
});
