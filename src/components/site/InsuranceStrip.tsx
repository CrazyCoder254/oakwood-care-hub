import { ShieldCheck } from "lucide-react";

const insurers = [
  { name: "SHA", full: "Social Health Authority" },
  { name: "Linda Mama", full: "Linda Mama Programme" },
  { name: "Britam", full: "Britam Insurance" },
  { name: "Jubilee", full: "Jubilee Health Insurance" },
  { name: "AAR", full: "AAR Insurance" },
  { name: "MUA", full: "MUA Insurance" },
  { name: "Liaison", full: "Liaison Group" },
  { name: "M-TIBA", full: "M-TIBA" },
  { name: "Madison", full: "Madison Insurance" },
  { name: "CIC", full: "CIC Insurance Group" },
  { name: "Old Mutual", full: "Old Mutual" },
];

export function InsuranceStrip() {
  return (
    <section className="py-14 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs tracking-[0.25em] uppercase text-primary/70 font-medium">We Accept</span>
          <h2 className="font-display text-3xl md:text-4xl text-primary mt-2">Insurance Partners</h2>
          <div className="gold-divider w-24 mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {insurers.map(({ name, full }) => (
            <div
              key={name}
              className="group flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl bg-card border border-border shadow-soft hover:shadow-gold transition-all"
              title={full}
            >
              <span className="w-11 h-11 rounded-lg gradient-purple grid place-items-center">
                <ShieldCheck className="h-5 w-5 text-gold" />
              </span>
              <span className="text-sm font-display font-semibold text-primary text-center leading-tight">{name}</span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight line-clamp-2">{full}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
