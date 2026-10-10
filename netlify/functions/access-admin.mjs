// Coach-Dashboard: Zugänge verwalten  →  POST /api/access-admin
// Passwort = Umgebungsvariable MTC_ADMIN_PASSWORD (in Netlify unter „Environment variables“ anlegen)
import { getStore } from "@netlify/blobs";
import { adminAccess, json } from "../lib/access.mjs";
export default async (req) => {
  if (req.method !== "POST") return json({ ok: false, reason: "method" }, 405);
  let body = {}; try { body = await req.json(); } catch (e) { return json({ ok: false, reason: "bad-request" }, 400); }
  const pw = (globalThis.Netlify && Netlify.env.get("MTC_ADMIN_PASSWORD")) || process.env.MTC_ADMIN_PASSWORD || "";
  return adminAccess(getStore({ name: "mtc-access", consistency: "strong" }), body, pw, req.headers.get("x-admin-key") || "");
};
export const config = { path: "/api/access-admin" };
