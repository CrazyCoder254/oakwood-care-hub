const insurers = [
  { name: "SHA", domain: "sha.go.ke" },
  { name: "NHIF", domain: "nhif.or.ke" },
  { name: "Linda Mama", domain: "nhif.or.ke" },
  { name: "Britam", domain: "britam.com" },
  { name: "Jubilee", domain: "jubileeinsurance.com" },
  { name: "AAR", domain: "aar-insurance.com" },
  { name: "MUA", domain: "mua.co.ke" },
  { name: "Liaison", domain: "liaisongroup.net" },
  { name: "M-TIBA", domain: "mtiba.com" },
  { name: "Madison", domain: "madison.co.ke" },
  { name: "CIC", domain: "cic.co.ke" },
  { name: "Old Mutual", domain: "oldmutual.co.ke" },
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {insurers.map(({ name, domain }) => (
            <div
              key={name}
              className="group flex flex-col items-center justify-center gap-2 px-4 py-5 rounded-xl bg-card border border-border shadow-soft hover:shadow-gold transition-all"
              title={name}
            >
              <img
                src={`https://logo.clearbit.com/${domain}`}
                alt={`${name} logo`}
                loading="lazy"
                width={96}
                height={48}
                className="h-10 w-auto max-w-[120px] object-contain grayscale group-hover:grayscale-0 transition"
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = "none";
                  img.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <span className="hidden text-sm font-medium text-primary">{name}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
