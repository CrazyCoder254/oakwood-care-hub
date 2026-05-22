import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar as CalIcon, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/portal/patient")({
  component: PatientPortal,
});

function PatientPortal() {
  const { user } = useAuth();
  const { data: doctors } = useQuery({ queryKey: ["doctors"], queryFn: async () => (await supabase.from("doctors").select("*").eq("is_active", true)).data ?? [] });
  const { data: services } = useQuery({ queryKey: ["services"], queryFn: async () => (await supabase.from("services").select("*").eq("is_active", true).order("sort_order")).data ?? [] });
  const { data: courses } = useQuery({ queryKey: ["courses"], queryFn: async () => (await supabase.from("courses").select("*").eq("is_active", true)).data ?? [] });
  const { data: appointments, refetch: refetchApp } = useQuery({
    queryKey: ["my-appointments", user?.id],
    queryFn: async () => (await supabase.from("appointments").select("*, doctors(name)").eq("user_id", user!.id).order("appointment_date", { ascending: false })).data ?? [],
    enabled: !!user,
  });
  const { data: enrollments, refetch: refetchEnr } = useQuery({
    queryKey: ["my-enrollments", user?.id],
    queryFn: async () => (await supabase.from("course_enrollments").select("*, courses(title)").eq("user_id", user!.id)).data ?? [],
    enabled: !!user,
  });

  const [form, setForm] = useState({ service: "", doctor_id: "", date: "", time: "", notes: "" });

  const book = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.service || !form.date || !form.time) { toast.error("Please fill required fields"); return; }
    const { error } = await supabase.from("appointments").insert({
      user_id: user!.id, service: form.service, doctor_id: form.doctor_id || null,
      appointment_date: form.date, appointment_time: form.time, notes: form.notes,
    });
    if (error) toast.error(error.message); else { toast.success("Appointment booked!"); setForm({ service: "", doctor_id: "", date: "", time: "", notes: "" }); refetchApp(); }
  };

  const enroll = async (cid: string) => {
    const { error } = await supabase.from("course_enrollments").insert({ user_id: user!.id, course_id: cid });
    if (error) toast.error(error.message); else { toast.success("Enrolment submitted!"); refetchEnr(); }
  };

  return (
    <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
          <div className="flex items-center gap-2 mb-4"><CalIcon className="h-5 w-5 text-gold" /><h2 className="font-display text-2xl text-primary">Book an appointment</h2></div>
          <form onSubmit={book} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2"><Label>Service</Label>
              <Select value={form.service} onValueChange={v => setForm({ ...form, service: v })}>
                <SelectTrigger><SelectValue placeholder="Choose a service" /></SelectTrigger>
                <SelectContent>{services?.map(s => <SelectItem key={s.id} value={s.title}>{s.title}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2"><Label>Doctor (optional)</Label>
              <Select value={form.doctor_id} onValueChange={v => setForm({ ...form, doctor_id: v })}>
                <SelectTrigger><SelectValue placeholder="Any available doctor" /></SelectTrigger>
                <SelectContent>{doctors?.map(d => <SelectItem key={d.id} value={d.id}>{d.name} — {d.specialty}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></div>
            <div><Label>Time</Label><Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required /></div>
            <div className="sm:col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} maxLength={500} /></div>
            <div className="sm:col-span-2"><Button type="submit" className="w-full">Confirm booking</Button></div>
          </form>
        </div>

        <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
          <div className="flex items-center gap-2 mb-4"><GraduationCap className="h-5 w-5 text-gold" /><h2 className="font-display text-2xl text-primary">Training courses</h2></div>
          <div className="space-y-3">
            {courses?.map(c => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-lg bg-cream border border-border">
                <div>
                  <p className="font-display text-primary">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.duration}</p>
                </div>
                <Button size="sm" onClick={() => enroll(c.id)}>Enrol</Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <h3 className="font-display text-lg text-primary mb-3">My appointments</h3>
          {appointments?.length ? appointments.map(a => (
            <div key={a.id} className="text-sm border-b border-border py-2 last:border-0">
              <p className="font-medium">{a.service}</p>
              <p className="text-xs text-muted-foreground">{a.appointment_date} · {a.appointment_time?.toString().slice(0,5)}</p>
              <p className="text-xs text-gold uppercase tracking-wider mt-1">{a.status}</p>
            </div>
          )) : <p className="text-sm text-muted-foreground">No appointments yet.</p>}
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
          <h3 className="font-display text-lg text-primary mb-3">My enrolments</h3>
          {enrollments?.length ? enrollments.map(e => (
            <div key={e.id} className="text-sm border-b border-border py-2 last:border-0">
              <p className="font-medium">{(e as any).courses?.title}</p>
              <p className="text-xs text-gold uppercase tracking-wider">{e.status}</p>
            </div>
          )) : <p className="text-sm text-muted-foreground">No enrolments yet.</p>}
        </div>
        <div className="text-center"><Link to="/" className="text-xs text-muted-foreground hover:text-primary">← Back to site</Link></div>
      </aside>
    </div>
  );
}
