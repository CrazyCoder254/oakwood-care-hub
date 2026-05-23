import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Plus, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/portal/admin")({
  component: AdminPortal,
});

function AdminPortal() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Tabs defaultValue="doctors" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="cms">Team / CMS</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="enrolments">Enrolments</TabsTrigger>
        </TabsList>

        <TabsContent value="doctors"><DoctorsAdmin /></TabsContent>
        <TabsContent value="services"><ServicesAdmin /></TabsContent>
        <TabsContent value="courses"><CoursesAdmin /></TabsContent>
        <TabsContent value="cms"><CmsAdmin /></TabsContent>
        <TabsContent value="roles"><RolesAdmin /></TabsContent>
        <TabsContent value="appointments"><AppointmentsAdmin /></TabsContent>
        <TabsContent value="enrolments"><EnrolmentsAdmin /></TabsContent>
      </Tabs>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
      <h2 className="font-display text-2xl text-primary mb-5">{title}</h2>
      {children}
    </div>
  );
}

/* ---------- Doctors ---------- */
function DoctorsAdmin() {
  const { data, refetch } = useQuery({ queryKey: ["admin-doctors"], queryFn: async () => (await supabase.from("doctors").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [form, setForm] = useState({ name: "", title: "", specialty: "", bio: "", photo_url: "", user_id: "" });

  const add = async () => {
    if (!form.name || !form.specialty) return toast.error("Name and specialty required");
    const { error } = await supabase.from("doctors").insert({
      name: form.name, title: form.title || null, specialty: form.specialty,
      bio: form.bio || null, photo_url: form.photo_url || null,
      user_id: form.user_id || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Doctor added"); setForm({ name: "", title: "", specialty: "", bio: "", photo_url: "", user_id: "" }); refetch();
  };
  const del = async (id: string) => {
    if (!confirm("Delete this doctor?")) return;
    const { error } = await supabase.from("doctors").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Removed"); refetch(); }
  };
  const toggle = async (id: string, is_active: boolean) => {
    await supabase.from("doctors").update({ is_active: !is_active }).eq("id", id); refetch();
  };

  return (
    <Panel title="Doctors">
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div><Label>Title (Dr., Prof.)</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Specialty</Label><Input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} /></div>
        <div><Label>Photo URL</Label><Input value={form.photo_url} onChange={e => setForm({ ...form, photo_url: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Bio</Label><Textarea rows={2} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Linked auth user_id (optional)</Label><Input value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })} placeholder="UUID from Roles tab" /></div>
        <div className="sm:col-span-2"><Button onClick={add}><Plus className="h-4 w-4 mr-2" />Add doctor</Button></div>
      </div>

      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Specialty</TableHead><TableHead>Linked</TableHead><TableHead>Active</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {data?.map(d => (
            <TableRow key={d.id}>
              <TableCell>{d.title} {d.name}</TableCell>
              <TableCell>{d.specialty}</TableCell>
              <TableCell className="text-xs">{d.user_id ? "✓" : "—"}</TableCell>
              <TableCell><Button variant="ghost" size="sm" onClick={() => toggle(d.id, d.is_active)}>{d.is_active ? "Yes" : "No"}</Button></TableCell>
              <TableCell><Button variant="ghost" size="icon" onClick={() => del(d.id)}><Trash2 className="h-4 w-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  );
}

/* ---------- Services ---------- */
function ServicesAdmin() {
  const { data, refetch } = useQuery({ queryKey: ["admin-services"], queryFn: async () => (await supabase.from("services").select("*").order("sort_order")).data ?? [] });
  const [form, setForm] = useState({ title: "", category: "general", description: "", icon: "", sort_order: 0 });
  const add = async () => {
    if (!form.title) return toast.error("Title required");
    const { error } = await supabase.from("services").insert(form);
    if (error) return toast.error(error.message);
    toast.success("Added"); setForm({ title: "", category: "general", description: "", icon: "", sort_order: 0 }); refetch();
  };
  const del = async (id: string) => {
    if (!confirm("Delete service?")) return;
    await supabase.from("services").delete().eq("id", id); refetch();
  };
  return (
    <Panel title="Services">
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Category</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <div><Label>Icon (lucide name)</Label><Input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
        <div><Label>Sort order</Label><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} /></div>
        <div className="sm:col-span-2"><Button onClick={add}><Plus className="h-4 w-4 mr-2" />Add service</Button></div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Order</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {data?.map(s => (
            <TableRow key={s.id}><TableCell>{s.title}</TableCell><TableCell>{s.category}</TableCell><TableCell>{s.sort_order}</TableCell>
              <TableCell><Button variant="ghost" size="icon" onClick={() => del(s.id)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  );
}

/* ---------- Courses ---------- */
function CoursesAdmin() {
  const { data, refetch } = useQuery({ queryKey: ["admin-courses"], queryFn: async () => (await supabase.from("courses").select("*").order("created_at", { ascending: false })).data ?? [] });
  const [form, setForm] = useState({ title: "", description: "", duration: "", price_text: "", modules: "" });
  const add = async () => {
    if (!form.title) return toast.error("Title required");
    const { error } = await supabase.from("courses").insert({
      title: form.title, description: form.description, duration: form.duration, price_text: form.price_text,
      modules: form.modules ? form.modules.split(",").map(m => m.trim()).filter(Boolean) : [],
    });
    if (error) return toast.error(error.message);
    toast.success("Added"); setForm({ title: "", description: "", duration: "", price_text: "", modules: "" }); refetch();
  };
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("courses").delete().eq("id", id); refetch(); };
  return (
    <Panel title="Courses">
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>Duration</Label><Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Description</Label><Textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <div><Label>Price text</Label><Input value={form.price_text} onChange={e => setForm({ ...form, price_text: e.target.value })} /></div>
        <div><Label>Modules (comma-separated)</Label><Input value={form.modules} onChange={e => setForm({ ...form, modules: e.target.value })} /></div>
        <div className="sm:col-span-2"><Button onClick={add}><Plus className="h-4 w-4 mr-2" />Add course</Button></div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Duration</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {data?.map(c => (<TableRow key={c.id}><TableCell>{c.title}</TableCell><TableCell>{c.duration}</TableCell>
            <TableCell><Button variant="ghost" size="icon" onClick={() => del(c.id)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>))}
        </TableBody>
      </Table>
    </Panel>
  );
}

/* ---------- CMS Sections (Team/About content) ---------- */
function CmsAdmin() {
  const { data, refetch } = useQuery({ queryKey: ["admin-cms"], queryFn: async () => (await supabase.from("cms_sections").select("*").order("key")).data ?? [] });
  const [form, setForm] = useState({ key: "", title: "", body: "" });
  const upsert = async () => {
    if (!form.key) return toast.error("Key required");
    const { error } = await supabase.from("cms_sections").upsert({ key: form.key, title: form.title, body: form.body, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) return toast.error(error.message);
    toast.success("Saved"); setForm({ key: "", title: "", body: "" }); refetch();
  };
  const edit = (s: any) => setForm({ key: s.key, title: s.title ?? "", body: s.body ?? "" });
  const del = async (id: string) => { if (!confirm("Delete?")) return; await supabase.from("cms_sections").delete().eq("id", id); refetch(); };
  return (
    <Panel title="Team & CMS sections">
      <p className="text-xs text-muted-foreground mb-3">Use keys like <code>team.intro</code>, <code>about.mission</code>, <code>about.vision</code> to update content shown on the public site.</p>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div><Label>Key</Label><Input value={form.key} onChange={e => setForm({ ...form, key: e.target.value })} placeholder="team.intro" /></div>
        <div><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
        <div className="sm:col-span-2"><Label>Body</Label><Textarea rows={4} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} /></div>
        <div className="sm:col-span-2"><Button onClick={upsert}><Save className="h-4 w-4 mr-2" />Save section</Button></div>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Key</TableHead><TableHead>Title</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {data?.map(s => (<TableRow key={s.id}><TableCell className="font-mono text-xs">{s.key}</TableCell><TableCell>{s.title}</TableCell>
            <TableCell className="flex gap-1 justify-end"><Button variant="ghost" size="sm" onClick={() => edit(s)}>Edit</Button>
              <Button variant="ghost" size="icon" onClick={() => del(s.id)}><Trash2 className="h-4 w-4" /></Button></TableCell></TableRow>))}
        </TableBody>
      </Table>
    </Panel>
  );
}

/* ---------- Roles ---------- */
function RolesAdmin() {
  const { data, refetch } = useQuery({
    queryKey: ["admin-roles"],
    queryFn: async () => {
      const [{ data: roles }, { data: profiles }] = await Promise.all([
        supabase.from("user_roles").select("*"),
        supabase.from("profiles").select("*"),
      ]);
      return { roles: roles ?? [], profiles: profiles ?? [] };
    },
  });
  const [form, setForm] = useState<{ user_id: string; role: "patient" | "doctor" | "admin" }>({ user_id: "", role: "doctor" });
  const grant = async () => {
    if (!form.user_id) return toast.error("user_id required");
    const { error } = await supabase.from("user_roles").insert({ user_id: form.user_id, role: form.role });
    if (error) return toast.error(error.message);
    toast.success("Role granted"); refetch();
  };
  const revoke = async (id: string) => { if (!confirm("Revoke role?")) return; await supabase.from("user_roles").delete().eq("id", id); refetch(); };

  return (
    <Panel title="User roles">
      <div className="grid sm:grid-cols-3 gap-3 mb-6 items-end">
        <div className="sm:col-span-2"><Label>User ID</Label><Input value={form.user_id} onChange={e => setForm({ ...form, user_id: e.target.value })} placeholder="UUID of the user (see profiles below)" /></div>
        <div><Label>Role</Label>
          <Select value={form.role} onValueChange={(v: any) => setForm({ ...form, role: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="patient">patient</SelectItem><SelectItem value="doctor">doctor</SelectItem><SelectItem value="admin">admin</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-3"><Button onClick={grant}><Plus className="h-4 w-4 mr-2" />Grant role</Button></div>
      </div>

      <h3 className="font-display text-lg text-primary mb-2">Profiles</h3>
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>User ID</TableHead><TableHead>Roles</TableHead></TableRow></TableHeader>
        <TableBody>
          {data?.profiles.map(p => {
            const userRoles = data.roles.filter(r => r.user_id === p.id);
            return (
              <TableRow key={p.id}>
                <TableCell>{p.full_name ?? "—"}</TableCell>
                <TableCell className="font-mono text-xs"><button onClick={() => { navigator.clipboard.writeText(p.id); toast.success("Copied"); }} className="hover:underline">{p.id.slice(0, 8)}…</button></TableCell>
                <TableCell className="space-x-1">
                  {userRoles.map(r => (
                    <Badge key={r.id} variant="secondary" className="cursor-pointer" onClick={() => revoke(r.id)} title="Click to revoke">{r.role} ✕</Badge>
                  ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Panel>
  );
}

/* ---------- Appointments (all) ---------- */
function AppointmentsAdmin() {
  const { data, refetch } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => (await supabase.from("appointments").select("*, doctors(name)").order("appointment_date", { ascending: false }).order("appointment_time", { ascending: false })).data ?? [],
  });
  const update = async (id: string, status: string) => { await supabase.from("appointments").update({ status }).eq("id", id); refetch(); toast.success("Updated"); };
  return (
    <Panel title="All appointments">
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Service</TableHead><TableHead>Doctor</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {data?.map((a: any) => (
            <TableRow key={a.id}>
              <TableCell className="text-xs">{a.appointment_date} {a.appointment_time?.toString().slice(0, 5)}</TableCell>
              <TableCell>{a.service}</TableCell>
              <TableCell>{a.doctors?.name ?? "—"}</TableCell>
              <TableCell>
                <Select value={a.status} onValueChange={(v) => update(a.id, v)}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{["pending", "confirmed", "completed", "cancelled"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  );
}

/* ---------- Enrolments (all) ---------- */
function EnrolmentsAdmin() {
  const { data, refetch } = useQuery({
    queryKey: ["admin-enrolments"],
    queryFn: async () => (await supabase.from("course_enrollments").select("*, courses(title)").order("created_at", { ascending: false })).data ?? [],
  });
  const update = async (id: string, status: string) => { await supabase.from("course_enrollments").update({ status }).eq("id", id); refetch(); toast.success("Updated"); };
  return (
    <Panel title="All enrolments">
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Course</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {data?.map((e: any) => (
            <TableRow key={e.id}>
              <TableCell className="text-xs">{new Date(e.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{e.courses?.title ?? "—"}</TableCell>
              <TableCell>
                <Select value={e.status} onValueChange={(v) => update(e.id, v)}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>{["pending", "approved", "rejected", "completed"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Panel>
  );
}
