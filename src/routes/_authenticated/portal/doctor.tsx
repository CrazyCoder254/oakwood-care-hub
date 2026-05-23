import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Calendar, Stethoscope } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/_authenticated/portal/doctor")({
  component: DoctorPortal,
});

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

function DoctorPortal() {
  const { user, role } = useAuth();
  const today = new Date().toISOString().slice(0, 10);
  const [filter, setFilter] = useState<"today" | "upcoming" | "all">("today");

  // Find the doctor record(s) tied to this auth user
  const { data: doctorRecord } = useQuery({
    queryKey: ["doctor-self", user?.id],
    queryFn: async () => (await supabase.from("doctors").select("*").eq("user_id", user!.id).maybeSingle()).data,
    enabled: !!user,
  });

  const { data: rows = [], refetch } = useQuery({
    queryKey: ["doc-appointments", user?.id, filter, role, doctorRecord?.id],
    queryFn: async () => {
      let q = supabase.from("appointments").select("*, doctors(name, specialty)").order("appointment_date").order("appointment_time");
      if (role === "doctor" && doctorRecord?.id) q = q.eq("doctor_id", doctorRecord.id);
      if (filter === "today") q = q.eq("appointment_date", today);
      else if (filter === "upcoming") q = q.gte("appointment_date", today);
      return (await q).data ?? [];
    },
    enabled: !!user && (role === "admin" || !!doctorRecord),
  });

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Marked ${status}`); refetch(); }
  };

  if (role === "doctor" && !doctorRecord) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Stethoscope className="h-10 w-10 text-gold mx-auto mb-3" />
        <h2 className="font-display text-3xl text-primary">Doctor profile not linked</h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">Ask an administrator to link your account to a doctor record so your appointments appear here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-primary flex items-center gap-2"><Calendar className="h-6 w-6 text-gold" /> Appointments</h2>
          {doctorRecord && <p className="text-sm text-muted-foreground mt-1">{doctorRecord.title ? `${doctorRecord.title} ` : ""}{doctorRecord.name} · {doctorRecord.specialty}</p>}
        </div>
        <div className="flex gap-2">
          {(["today", "upcoming", "all"] as const).map(f => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)}>{f}</Button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-soft overflow-hidden">
        {rows.length === 0 ? (
          <p className="p-12 text-center text-muted-foreground">No appointments for this view.</p>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((a: any) => (
              <div key={a.id} className="p-5 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[200px]">
                  <p className="font-display text-primary text-lg">{a.service}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.appointment_date} · {a.appointment_time?.toString().slice(0, 5)}
                    {a.doctors?.name && ` · ${a.doctors.name}`}
                  </p>
                  {a.notes && <p className="text-sm mt-1 italic text-muted-foreground">"{a.notes}"</p>}
                </div>
                <Select value={a.status} onValueChange={(v) => updateStatus(a.id, v)}>
                  <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
