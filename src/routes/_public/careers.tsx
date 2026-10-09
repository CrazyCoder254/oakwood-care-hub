import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionHeader } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { JobApplicationForm } from "@/components/site/JobApplicationForm";
import { Mail, Phone, CalendarDays, MapPin, Briefcase, Users, TrendingUp, HeartHandshake, Activity, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_public/careers")({
  component: CareersPage,
  head: () => ({
    meta: [
      { title: "Careers at Oakwood Hospital | We Are Hiring" },
      { name: "description", content: "Join Oakwood Hospital in Nairobi. Open roles: Community Oral Health Officer, Nurses, Pharmtechnologist and Cashier. Apply by 6th September 2026." },
      { property: "og:title", content: "Careers at Oakwood Hospital | We Are Hiring" },
      { property: "og:description", content: "Open positions at Oakwood Hospital — apply by 6th September 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const positions = [
  {
    n: 1,
    title: "Community Oral Health Officer (COHO)",
    experience: "1 – 2 years experience (An added advantage)",
    qualifications: [
      "Diploma in Community Oral Health",
      "Registered with the relevant professional body",
    ],
    requirements: [
      "Good knowledge of oral health promotion and prevention",
      "Strong communication and interpersonal skills",
      "Ability to work with communities and conduct oral health outreach",
      "Commitment to quality care and safety",
    ],
  },
  {
    n: 2,
    title: "Nurses",
    experience: "2 – 3 years experience",
    qualifications: [
      "Diploma or Degree in Nursing",
      "Registered and licensed by the Nursing Council",
      "BLS/CPR certification",
    ],
    requirements: [
      "Good clinical knowledge and skills",
      "Compassionate and patient-centered care",
      "Excellent communication and teamwork",
      "Ability to work under pressure and in shifts",
      "Commitment to quality care and safety",
    ],
  },
  {
    n: 3,
    title: "Pharmtechnologist",
    experience: "1 – 2 years experience in a busy inpatient environment",
    qualifications: [
      "Diploma in Pharmaceutical Technology",
      "Registered with the Pharmacy and Poisons Board",
      "Computer Applications is an added advantage",
    ],
    requirements: [
      "Good knowledge of drugs, dosage and dispensary procedures",
      "Attention to detail and accuracy",
      "Ability to work in a fast-paced inpatient environment",
      "Commitment to quality care and safety",
    ],
  },
  {
    n: 4,
    title: "Cashier for Hospital Cafeteria",
    experience: "Experience is an added advantage",
    qualifications: [
      "Certificate/Diploma in Business, Accounting or related field",
      "Good knowledge of basic computer applications",
    ],
    requirements: [
      "Good numerical and cash handling skills",
      "Honesty, integrity and attention to detail",
      "Good communication and customer service skills",
      "Ability to work in a busy environment",
      "Team player and reliable",
    ],
  },
];

const whyJoin = [
  { icon: HeartHandshake, label: "Make a Difference" },
  { icon: TrendingUp, label: "Grow Your Career" },
  { icon: Users, label: "Supportive Team" },
  { icon: Activity, label: "Impact Lives" },
];

function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="We are hiring"
        title="Join Our Team"
        subtitle="Be part of a dedicated team delivering Trusted Care, closer to you."
      >
        <Button asChild size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
          <a href="#apply"><Mail className="h-4 w-4 mr-2" /> Apply Today</a>
        </Button>
      </PageHero>

      <section className="py-20 container mx-auto px-4">
        <SectionHeader eyebrow="Open positions" title="Current Vacancies" subtitle="Application deadline: 6th September 2026." />
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {positions.map(p => (
            <article key={p.n} className="bg-card border border-border rounded-xl shadow-soft overflow-hidden flex flex-col">
              <div className="gradient-purple p-5 text-primary-foreground">
                <Briefcase className="h-6 w-6 mb-3 opacity-80" />
                <h3 className="font-display text-lg leading-snug">{p.n}. {p.title}</h3>
              </div>
              <div className="p-5 flex flex-col gap-4 text-sm">
                <p className="text-xs font-medium text-primary bg-secondary rounded-md px-3 py-2">{p.experience}</p>
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-primary/70 font-semibold mb-2">Qualifications</h4>
                  <ul className="space-y-1.5">
                    {p.qualifications.map(q => (
                      <li key={q} className="flex gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{q}</span></li>
                    ))}
                  </ul>
                </div>
                <div className="gold-divider" />
                <div>
                  <h4 className="text-xs uppercase tracking-[0.18em] text-primary/70 font-semibold mb-2">Key Requirements</h4>
                  <ul className="space-y-1.5">
                    {p.requirements.map(r => (
                      <li key={r} className="flex gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{r}</span></li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          <h2 className="font-display text-2xl text-primary-foreground">Why Join Us?</h2>
          {whyJoin.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm font-medium">
              <Icon className="h-5 w-5 text-primary-foreground/80" /> {label}
            </div>
          ))}
        </div>
      </section>

      <section id="apply" className="py-20 container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-8 md:p-12 shadow-soft mb-12">
          <div className="text-center mb-8">
            <span className="text-xs tracking-[0.25em] uppercase text-primary/70">Apply online</span>
            <h2 className="font-display text-3xl md:text-4xl text-primary mt-2">Job Application Form</h2>
          </div>
          <JobApplicationForm positions={positions.map(p => p.title)} />
        </div>
        <div className="max-w-3xl mx-auto bg-cream border border-border rounded-2xl p-8 md:p-12 shadow-soft text-center">
          <span className="text-xs tracking-[0.25em] uppercase text-primary/70">Interested?</span>
          <h2 className="font-display text-3xl md:text-4xl text-primary mt-2">Apply Today</h2>
          <p className="mt-4 text-muted-foreground">
            Send your CV and cover letter to <a href="mailto:oakwoodhospital@outlook.com" className="text-primary font-medium underline underline-offset-4">oakwoodhospital@outlook.com</a> or call 0720126297 for more information.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild><a href="mailto:oakwoodhospital@outlook.com?subject=Job%20Application"><Mail className="h-4 w-4 mr-2" /> Email your CV</a></Button>
            <Button asChild variant="outline"><a href="tel:+254720126297"><Phone className="h-4 w-4 mr-2" /> 0720 126 297</a></Button>
          </div>
          <div className="gold-divider w-24 mx-auto my-8" />
          <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground text-left">
            <p className="flex gap-2"><CalendarDays className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Application deadline: <strong className="text-foreground">6th September 2026</strong></p>
            <p className="flex gap-2"><MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" /> Oakwood Hospital Ltd, Dagoretti Road off Southern Bypass, P.O. Box 101-00230, Nairobi, Kenya</p>
          </div>
        </div>
      </section>
    </>
  );
}
