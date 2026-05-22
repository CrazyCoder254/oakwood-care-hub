import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageHero, SectionHeader } from "@/components/site/Section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_public/contact")({
  head: () => ({ meta: [{ title: "Contact Us — Oakwood Hospital" }, { name: "description", content: "Reach Oakwood Hospital — phone, email, address, FAQs and contact form." }] }),
  component: ContactPage,
});

function ContactPage() {
  const { data: faqs } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => (await supabase.from("cms_sections").select("*").like("key", "faq_%").order("key")).data ?? [],
  });
  return (
    <>
      <PageHero eyebrow="We're here for you" title="Contact Us" subtitle="Call, email, or send us a note — we'll get back to you fast." />
      <section className="container mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-2xl text-primary">Get in touch</h2>
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-start gap-3"><span className="w-9 h-9 rounded-md gradient-purple grid place-items-center text-gold"><Phone className="h-4 w-4" /></span><div><p className="font-medium">Call us</p><p className="text-muted-foreground">+254 720 126 297 · +254 705 185 429</p></div></div>
            <div className="flex items-start gap-3"><span className="w-9 h-9 rounded-md gradient-purple grid place-items-center text-gold"><Mail className="h-4 w-4" /></span><div><p className="font-medium">Email</p><p className="text-muted-foreground">oakwoodhospital@outlook.com</p></div></div>
            <div className="flex items-start gap-3"><span className="w-9 h-9 rounded-md gradient-purple grid place-items-center text-gold"><MapPin className="h-4 w-4" /></span><div><p className="font-medium">Address</p><p className="text-muted-foreground">Oakwood Hospital · Nairobi · P.O. Box 395-10230</p></div></div>
          </div>
          <div className="mt-8 rounded-xl overflow-hidden border border-border aspect-[4/3]">
            <iframe title="Map" src="https://www.google.com/maps?q=Oakwood+Hospital&output=embed" className="w-full h-full" loading="lazy" />
          </div>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("Thanks! We'll be in touch shortly."); (e.target as HTMLFormElement).reset(); }} className="bg-card rounded-2xl p-8 border border-border shadow-soft space-y-4">
          <h2 className="font-display text-2xl text-primary">Send a message</h2>
          <div><Label>Name</Label><Input required maxLength={100} /></div>
          <div><Label>Email</Label><Input type="email" required maxLength={255} /></div>
          <div><Label>Phone</Label><Input maxLength={20} /></div>
          <div><Label>Message</Label><Textarea required rows={5} maxLength={1000} /></div>
          <Button type="submit" className="w-full">Send message</Button>
        </form>
      </section>
      <section className="bg-cream py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionHeader eyebrow="FAQs" title="Frequently Asked Questions" />
          <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border shadow-soft px-6">
            {faqs?.map(f => (
              <AccordionItem key={f.id} value={f.id}>
                <AccordionTrigger className="font-display text-primary text-left">{f.title}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.body}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
