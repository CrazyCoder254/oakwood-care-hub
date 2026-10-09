import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { startMpesaPayment, checkMpesaPayment } from "@/lib/mpesa.functions";

export const Route = createFileRoute("/_public/pay")({
  head: () => ({
    meta: [
      { title: "Pay for Services with M-Pesa | Oakwood Hospital" },
      { name: "description", content: "Pay Oakwood Hospital bills instantly with M-Pesa. Enter your number and amount, then confirm on your phone." },
      { property: "og:title", content: "Pay with M-Pesa | Oakwood Hospital" },
      { property: "og:description", content: "Fast, secure M-Pesa payments for Oakwood Hospital services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PayPage,
});

type Stage = "form" | "waiting" | "paid";

function PayPage() {
  const start = useServerFn(startMpesaPayment);
  const check = useServerFn(checkMpesaPayment);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState<Stage>("form");
  const [busy, setBusy] = useState(false);

  const poll = async (id: string) => {
    for (let i = 0; i < 12; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      const r = await check({ data: { checkoutRequestId: id } });
      if (r.status === "paid") { setStage("paid"); return; }
      if (r.status === "failed") { toast.error(r.message); setStage("form"); return; }
    }
    toast.message("We couldn't confirm yet. Check your M-Pesa messages.");
    setStage("form");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Math.round(Number(amount));
    if (!amt || amt < 1) { toast.error("Enter an amount"); return; }
    setBusy(true);
    const r = await start({ data: { phone, amount: amt } });
    setBusy(false);
    if (!r.ok) { toast.error(r.error); return; }
    setStage("waiting");
    toast.success("Check your phone and enter your M-Pesa PIN");
    poll(r.checkoutRequestId);
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl">
      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.25em] uppercase text-primary/70">Payments</p>
        <h1 className="font-display text-4xl text-primary mt-2">Pay with M-Pesa</h1>
        <p className="text-muted-foreground mt-3">Enter your phone number and amount. You'll get a prompt on your phone to confirm.</p>
      </div>
      <div className="bg-card rounded-2xl p-8 border border-border shadow-soft">
        {stage === "paid" ? (
          <div className="text-center py-6">
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
            <h2 className="font-display text-2xl text-primary mt-4">Payment received</h2>
            <p className="text-muted-foreground mt-2">Thank you. You'll receive an M-Pesa confirmation SMS.</p>
            <Button className="mt-6" onClick={() => { setStage("form"); setAmount(""); }}>Make another payment</Button>
          </div>
        ) : stage === "waiting" ? (
          <div className="text-center py-6">
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <h2 className="font-display text-xl text-primary mt-4">Waiting for confirmation…</h2>
            <p className="text-muted-foreground mt-2">Enter your M-Pesa PIN on your phone to complete payment.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label htmlFor="phone">M-Pesa phone number</Label>
              <Input id="phone" inputMode="tel" placeholder="0712 345 678" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={15} />
            </div>
            <div>
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input id="amount" type="number" min={1} step={1} placeholder="e.g. 1500" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Smartphone className="h-4 w-4 mr-2" />} Pay now
            </Button>
            <p className="text-xs text-center text-muted-foreground">Paybill 852648 · Account 118952</p>
          </form>
        )}
      </div>
    </div>
  );
}
