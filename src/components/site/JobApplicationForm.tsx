import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Send } from "lucide-react";

const schema = z.object({
  position: z.string().min(1, "Choose a position"),
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  email: z.string().trim().email("Enter a valid email").max(255),
  phone: z.string().trim().regex(/^[+0-9 ()-]{9,20}$/, "Enter a valid phone number"),
  experience_years: z.string().trim().max(30).optional(),
  qualifications: z.string().trim().max(2000).optional(),
  cover_letter: z.string().trim().min(20, "Tell us a little about yourself (20+ characters)").max(4000),
  cv_link: z.union([z.literal(""), z.string().trim().url("Enter a valid link").max(500)]),
});

type Form = z.infer<typeof schema>;
const empty: Form = { position: "", full_name: "", email: "", phone: "", experience_years: "", qualifications: "", cover_letter: "", cv_link: "" };

export function JobApplicationForm({ positions }: { positions: string[] }) {
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof Form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    if (!r.success) {
      const errs: typeof errors = {};
      r.error.issues.forEach(i => { errs[i.path[0] as keyof Form] = i.message; });
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("job_applications").insert({ ...r.data, cv_link: r.data.cv_link || null });
    setBusy(false);
    if (error) { toast.error("Could not submit application. Please try again."); return; }
    setDone(true);
    setForm(empty);
  };

  if (done) {
    return (
      <div className="text-center py-10">
        <CheckCircle2 className="h-12 w-12 text-primary mx-auto" />
        <h3 className="font-display text-2xl text-primary mt-4">Application received</h3>
        <p className="text-muted-foreground mt-2">Thank you for applying to Oakwood Hospital. Shortlisted candidates will be contacted.</p>
        <Button variant="outline" className="mt-6" onClick={() => setDone(false)}>Submit another application</Button>
      </div>
    );
  }

  const err = (k: keyof Form) => errors[k] && <p className="text-xs text-destructive mt-1">{errors[k]}</p>;

  return (
    <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 text-left" noValidate>
      <div className="sm:col-span-2">
        <Label>Position applied for *</Label>
        <Select value={form.position} onValueChange={set("position")}>
          <SelectTrigger className="mt-1"><SelectValue placeholder="Select a position" /></SelectTrigger>
          <SelectContent>{positions.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
        </Select>
        {err("position")}
      </div>
      <div><Label htmlFor="ja-name">Full name *</Label><Input id="ja-name" className="mt-1" value={form.full_name} onChange={e => set("full_name")(e.target.value)} maxLength={120} />{err("full_name")}</div>
      <div><Label htmlFor="ja-email">Email *</Label><Input id="ja-email" type="email" className="mt-1" value={form.email} onChange={e => set("email")(e.target.value)} maxLength={255} />{err("email")}</div>
      <div><Label htmlFor="ja-phone">Phone *</Label><Input id="ja-phone" className="mt-1" placeholder="07XX XXX XXX" value={form.phone} onChange={e => set("phone")(e.target.value)} maxLength={20} />{err("phone")}</div>
      <div><Label htmlFor="ja-exp">Years of experience</Label><Input id="ja-exp" className="mt-1" value={form.experience_years} onChange={e => set("experience_years")(e.target.value)} maxLength={30} /></div>
      <div className="sm:col-span-2"><Label htmlFor="ja-qual">Qualifications & registration</Label><Textarea id="ja-qual" className="mt-1" rows={3} value={form.qualifications} onChange={e => set("qualifications")(e.target.value)} maxLength={2000} /></div>
      <div className="sm:col-span-2"><Label htmlFor="ja-cover">Cover letter *</Label><Textarea id="ja-cover" className="mt-1" rows={5} value={form.cover_letter} onChange={e => set("cover_letter")(e.target.value)} maxLength={4000} />{err("cover_letter")}</div>
      <div className="sm:col-span-2"><Label htmlFor="ja-cv">Link to your CV (Google Drive, Dropbox, etc.)</Label><Input id="ja-cv" className="mt-1" placeholder="https://" value={form.cv_link} onChange={e => set("cv_link")(e.target.value)} maxLength={500} />{err("cv_link")}</div>
      <div className="sm:col-span-2"><Button type="submit" size="lg" disabled={busy} className="w-full sm:w-auto"><Send className="h-4 w-4 mr-2" />{busy ? "Submitting…" : "Submit application"}</Button></div>
    </form>
  );
}
