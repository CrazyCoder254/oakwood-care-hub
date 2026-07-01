import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/site/Section";
import { InsuranceStrip } from "@/components/site/InsuranceStrip";
import { ArrowRight, Calendar, GraduationCap, HeartPulse, Phone, ShieldCheck, Sparkles } from "lucide-react";
import hero from "@/assets/hero-hospital.jpg";
import maternity from "@/assets/maternity.jpg";
import training from "@/assets/training.jpg";
import emergency from "@/assets/hero-emergency.jpg";
import surgery from "@/assets/hero-surgery.jpg";

export const Route = createFileRoute("/_public/")({
  component: HomePage,
});

function HomePage() {
  const { data: services } = useQuery({
    queryKey: ["services", "preview"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).neq("category", "specialist").order("sort_order").limit(8);
      return data ?? [];
    },
  });

  const { data: doctors } = useQuery({
    queryKey: ["doctors", "preview"],
    queryFn: async () => {
      const { data } = await supabase.from("doctors").select("*").eq("is_active", true).limit(4);
      return data ?? [];
    },
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {[hero, emergency, surgery, maternity].map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="hero-slide absolute inset-0 w-full h-full object-cover"
              style={{ animationDelay: `${i * 6}s` }}
            />
          ))}
          <div className="absolute inset-0 gradient-hero opacity-85" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-center text-primary-foreground">
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-gold animate-fade-up">
            <Sparkles className="h-3 w-3" /> Trusted Care · Closer to You
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-gold mt-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Compassionate care,<br /><em className="italic font-medium">every day.</em>
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-2xl mx-auto text-primary-foreground/90 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Oakwood Hospital delivers 24/7 trusted, personalized health care for you and your family — from maternity and surgery to specialist clinics.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 font-semibold">
              <Link to="/auth" search={{ mode: "login", redirect: "/portal/patient" }}><Calendar className="h-4 w-4 mr-2" /> Book Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-gold/50 text-gold hover:bg-gold/10">
              <Link to="/services">Explore Services <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-left">
            {[
              { icon: ShieldCheck, label: "24/7 Emergency" },
              { icon: HeartPulse, label: "ICU & HDU" },
              { icon: Calendar, label: "Specialist Clinics" },
              { icon: GraduationCap, label: "Training Institute" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-primary-foreground/5 backdrop-blur border border-gold/20 rounded-lg p-3">
                <Icon className="h-5 w-5 text-gold" />
                <span className="text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-20 container mx-auto px-4">
        <SectionHeader eyebrow="What we offer" title="Services that meet you where you are" subtitle="From routine check-ups to critical care — every service delivered with compassion and clinical excellence." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services?.map(s => (
            <div key={s.id} className="group bg-card border border-border rounded-xl p-6 shadow-soft hover:shadow-gold hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-lg grid place-items-center gradient-purple text-gold mb-4">
                <HeartPulse className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg text-primary">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Button asChild variant="outline"><Link to="/services">See all services <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
        </div>
      </section>

      {/* MATERNITY FEATURE */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs tracking-[0.25em] uppercase text-gold">Maternity</span>
            <h2 className="font-display text-4xl text-gold mt-3">Welcoming new life, with safety and warmth.</h2>
            <p className="mt-4 text-primary-foreground/85 leading-relaxed">
              Normal & Caesarean delivery, antenatal & postnatal clinics, child welfare, immunization, newborn unit and obstetric ultrasound — all under one roof, 24/7.
            </p>
            <Button asChild className="mt-6 bg-gold text-gold-foreground hover:bg-gold/90"><Link to="/maternity">Maternity Services</Link></Button>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-gold ring-1 ring-gold/30">
            <img src={maternity} alt="Mother and newborn with doctor" loading="lazy" className="w-full h-full object-cover aspect-[4/3]" />
          </div>
        </div>
      </section>


      {/* TRAINING CTA */}
      <section className="container mx-auto px-4 pb-20">
        <div className="rounded-3xl overflow-hidden grid md:grid-cols-2 shadow-soft border border-border">
          <div className="bg-cream p-10 md:p-14">
            <span className="text-xs tracking-[0.25em] uppercase text-gold">Oakwood Training Institute</span>
            <h2 className="font-display text-3xl md:text-4xl text-primary mt-3">Certificate in Health Care Assistant</h2>
            <p className="mt-3 text-muted-foreground">6 months. Anatomy, patient care, infection control, first aid, palliative & home care — taught by working clinicians.</p>
            <Button asChild className="mt-6"><Link to="/courses">Explore the course <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
          </div>
          <div className="aspect-[4/3] md:aspect-auto"><img src={training} alt="Training" loading="lazy" className="w-full h-full object-cover" /></div>
        </div>
      </section>

      <InsuranceStrip />

      {/* CTA STRIP */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl text-gold">Need care now?</h3>
            <p className="text-sm text-primary-foreground/80 mt-1">Call our 24/7 line or book online.</p>
          </div>
          <div className="flex gap-3">
            <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90"><a href="tel:+254720126297"><Phone className="h-4 w-4 mr-2" /> +254 720 126 297</a></Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-gold/40 text-gold hover:bg-gold/10"><Link to="/auth" search={{ mode: "login", redirect: "/portal/patient" }}>Book Online</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
