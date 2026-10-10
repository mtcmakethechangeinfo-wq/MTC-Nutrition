// Kunden-App: Status abfragen / Freischalt-Code prüfen  →  POST /api/access
import { getStore } from "@netlify/blobs";
import { clientAccess, json } from "../lib/access.mjs";
export default async (req) => {
  if (req.method !== "POST") return json({ ok: false, reason: "method" }, 405);
  let body = {}; try { body = await req.json(); } catch (e) { return json({ ok: false, reason: "bad-request" }, 400); }
  const pw = (globalThis.Netlify && Netlify.env.get("MTC_ADMIN_PASSWORD")) || process.env.MTC_ADMIN_PASSWORD || "";
  return clientAccess(getStore({ name: "mtc-access", consistency: "strong" }), body, pw);
};
export const config = { path: "/api/access" };
