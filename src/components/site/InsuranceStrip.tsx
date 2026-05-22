const insurers = [
  "SHA", "NHIF", "Linda Mama", "Britam", "Jubilee", "AAR", "MUA", "Liaison", "M-TIBA", "Madison", "CIC", "Old Mutual"
];

export function InsuranceStrip() {
  return (
    <section className="py-14 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-xs tracking-[0.25em] uppercase text-gold font-medium">We Accept</span>
          <h2 className="font-display text-3xl md:text-4xl text-primary mt-2">Insurance Partners</h2>
          <div className="gold-divider w-24 mx-auto mt-4" />
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {insurers.map(name => (
            <div key={name} className="px-5 py-3 rounded-full bg-card border border-border ring-gold/10 shadow-soft text-sm font-medium text-primary">
              {name}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-6">…and many more. Logos coming soon.</p>
      </div>
    </section>
  );
}
