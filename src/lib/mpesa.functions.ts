import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const SHORTCODE = "852648";
const ACCOUNT_REF = "118952";
const BASE = "https://api.safaricom.co.ke";

async function getToken() {
  const key = process.env["MPESA_CONSUMER_KEY"];
  const secret = process.env["MPESA_CONSUMER_SECRET"];
  if (!key || !secret) throw new Error("M-Pesa is not configured");
  const res = await fetch(`${BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${btoa(`${key}:${secret}`)}` },
  });
  if (!res.ok) {
    console.error("[mpesa] token error", res.status, await res.text());
    throw new Error("Could not reach M-Pesa. Please try again.");
  }
  return ((await res.json()) as { access_token: string }).access_token;
}

function timestampAndPassword() {
  const d = new Date(Date.now() + 3 * 3600 * 1000); // Nairobi time
  const p = (n: number) => String(n).padStart(2, "0");
  const ts = `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}`;
  const password = btoa(`${SHORTCODE}${process.env["MPESA_PASSKEY"] ?? ""}${ts}`);
  return { ts, password };
}

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (/^0[17]\d{8}$/.test(digits)) return "254" + digits.slice(1);
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  if (/^[17]\d{8}$/.test(digits)) return "254" + digits;
  return null;
}

export const startMpesaPayment = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ phone: z.string().min(9).max(15), amount: z.number().int().min(1).max(250000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const phone = normalizePhone(data.phone);
    if (!phone) return { ok: false as const, error: "Enter a valid Safaricom number, e.g. 0712345678" };
    try {
      const token = await getToken();
      const { ts, password } = timestampAndPassword();
      const origin = new URL(getRequest().url).origin;
      const res = await fetch(`${BASE}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          BusinessShortCode: SHORTCODE,
          Password: password,
          Timestamp: ts,
          TransactionType: "CustomerPayBillOnline",
          Amount: data.amount,
          PartyA: phone,
          PartyB: SHORTCODE,
          PhoneNumber: phone,
          CallBackURL: `${origin}/api/public/mpesa/callback`,
          AccountReference: ACCOUNT_REF,
          TransactionDesc: "Oakwood Hospital",
        }),
      });
      const json = (await res.json()) as Record<string, string>;
      if (!res.ok || json["ResponseCode"] !== "0") {
        console.error("[mpesa] stk error", json);
        return { ok: false as const, error: json["errorMessage"] || json["CustomerMessage"] || "Payment request failed" };
      }
      return { ok: true as const, checkoutRequestId: json["CheckoutRequestID"] };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Payment request failed" };
    }
  });

export const checkMpesaPayment = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ checkoutRequestId: z.string().min(5).max(100) }).parse(d))
  .handler(async ({ data }) => {
    try {
      const token = await getToken();
      const { ts, password } = timestampAndPassword();
      const res = await fetch(`${BASE}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ BusinessShortCode: SHORTCODE, Password: password, Timestamp: ts, CheckoutRequestID: data.checkoutRequestId }),
      });
      const json = (await res.json()) as Record<string, string>;
      if (json["ResultCode"] === undefined) return { status: "pending" as const };
      if (String(json["ResultCode"]) === "0") return { status: "paid" as const };
      return { status: "failed" as const, message: json["ResultDesc"] ?? "Payment not completed" };
    } catch {
      return { status: "pending" as const };
    }
  });
