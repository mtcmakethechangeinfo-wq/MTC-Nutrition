/* MTC Makrotracker – Freischalt-Codes (Logik, unabhängig vom Speicher → testbar)
   Ein Code gehört zu genau einem Kunden und funktioniert auf höchstens MAX_DEVICES Geräten. */
export const MAX_DEVICES = 2;
const ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // ohne 0/O, 1/I – leichter abzutippen
export const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
export const normCode = c => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, n);
function randomPart(n) { const b = crypto.getRandomValues(new Uint8Array(n)); let r = ""; for (const x of b) r += ALPH[x % ALPH.length]; return r; }
function prefixOf(name) { const p = String(name || "").trim().split(/\s+/)[0].normalize("NFD").replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 4); return p.length >= 2 ? p : "MTC"; }
export const pretty = k => k.length > 4 ? k.replace(/^([A-Z]{2,4})([A-Z0-9]{6})$/, "$1-$2") : k;

/* Kunden-App: action "activate" (Code eingeben) oder "check" (regelmäßige Prüfung) */
export async function clientAccess(store, body) {
  const code = normCode(body.code), device = clean(body.device, 64), label = clean(body.label, 30) || "Gerät";
  if (!code || !device) return json({ ok: false, reason: "bad-request" }, 400);
  const rec = await store.get(code, { type: "json" });
  if (!rec) return json({ ok: false, reason: "unknown" }, 404);
  if (rec.blocked) return json({ ok: false, reason: "blocked" }, 403);
  rec.devices = rec.devices || [];
  const now = Date.now(), d = rec.devices.find(x => x.id === device);
  if (d) { d.last = now; d.label = label; }
  else {
    if (body.action === "check") return json({ ok: false, reason: "device-reset" }, 403);
    if (rec.devices.length >= MAX_DEVICES) return json({ ok: false, reason: "devices" }, 403);
    rec.devices.push({ id: device, label, first: now, last: now });
  }
  rec.lastSeen = now;
  await store.setJSON(code, rec);
  return json({ ok: true, name: rec.name || "", code: pretty(code) });
}

/* Coach-Dashboard (Passwort-geschützt) */
export async function adminAccess(store, body, password, given) {
  if (!password) return json({ ok: false, reason: "not-configured" }, 503);
  if (!given || given !== password) { await new Promise(r => setTimeout(r, 600)); return json({ ok: false, reason: "auth" }, 401); }
  const a = body.action, code = normCode(body.code);
  const view = r => ({ code: pretty(r.code), name: r.name, note: r.note || "", created: r.created, blocked: !!r.blocked, lastSeen: r.lastSeen || 0, devices: (r.devices || []).map(d => ({ label: d.label, first: d.first, last: d.last })) });
  if (a === "list") {
    const { blobs } = await store.list();
    const recs = (await Promise.all(blobs.map(b => store.get(b.key, { type: "json" })))).filter(Boolean);
    recs.sort((x, y) => (y.created || 0) - (x.created || 0));
    return json({ ok: true, max: MAX_DEVICES, items: recs.map(view) });
  }
  if (a === "create") {
    const name = clean(body.name, 40); if (!name) return json({ ok: false, reason: "name" }, 400);
    let k = ""; for (let i = 0; i < 8; i++) { k = prefixOf(name) + randomPart(6); if (!(await store.get(k))) break; }
    const rec = { code: k, name, note: clean(body.note, 120), created: Date.now(), blocked: false, devices: [] };
    await store.setJSON(k, rec); return json({ ok: true, item: view(rec) });
  }
  if (!code) return json({ ok: false, reason: "bad-request" }, 400);
  const rec = await store.get(code, { type: "json" });
  if (!rec) return json({ ok: false, reason: "unknown" }, 404);
  if (a === "block" || a === "unblock") rec.blocked = a === "block";
  else if (a === "reset") rec.devices = [];
  else if (a === "rename") rec.name = clean(body.name, 40) || rec.name;
  else if (a === "delete") { await store.delete(code); return json({ ok: true }); }
  else return json({ ok: false, reason: "bad-action" }, 400);
  await store.setJSON(code, rec); return json({ ok: true, item: view(rec) });
}
