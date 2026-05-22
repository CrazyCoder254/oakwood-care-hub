import { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={center ? "text-center max-w-2xl mx-auto mb-12" : "max-w-2xl mb-10"}>
      {eyebrow && <span className="text-xs tracking-[0.25em] uppercase text-gold font-medium">{eyebrow}</span>}
      <h2 className="font-display text-3xl md:text-4xl text-primary mt-2">{title}</h2>
      {subtitle && <p className="mt-3 text-muted-foreground leading-relaxed">{subtitle}</p>}
      {center && <div className="gold-divider w-24 mx-auto mt-5" />}
    </div>
  );
}

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-20 md:py-28 text-center">
        {eyebrow && <span className="text-xs tracking-[0.3em] uppercase text-gold">{eyebrow}</span>}
        <h1 className="font-display text-4xl md:text-6xl text-gold mt-3">{title}</h1>
        {subtitle && <p className="mt-5 text-base md:text-lg text-primary-foreground/85 max-w-2xl mx-auto">{subtitle}</p>}
        {children && <div className="mt-8 flex justify-center gap-3 flex-wrap">{children}</div>}
        <div className="gold-divider w-32 mx-auto mt-8" />
      </div>
    </section>
  );
}
