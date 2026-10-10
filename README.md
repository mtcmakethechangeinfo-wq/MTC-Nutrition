# MTC Makrotracker

Makro-Tracker (PWA) für Kundinnen und Kunden von **MTC Fitness Coaching** – plus Coach-Dashboard und Freischalt-Codes.

| Datei / Ordner | Zweck |
|---|---|
| `index.html` | Die App für Kunden (Heute, Verlauf, Check-in, Profil) |
| `coach.html` | Coach-Dashboard (Kunden-Auswertungen + **🔑 Zugänge**) |
| `netlify/functions/` | Server-Funktionen für die Freischalt-Codes (`/api/access`, `/api/access-admin`) |
| `package.json` | sagt Netlify, welche Bibliothek die Funktionen brauchen |
| `data/bls-v2.json` | Nährwertdatenbank BLS 4.0 (Max Rubner-Institut, CC BY 4.0) |
| `lib/`, `fonts/`, `icons/` | Barcode-Scanner, Schrift, App-Symbole |
| `sw.js`, `manifest.webmanifest` | Offline-Fähigkeit & „Zum Home-Bildschirm“ |
| `_redirects` | Weiterleitung für die Online-Suche (Open Food Facts) |

## Einmalig einrichten: Admin-Passwort
Netlify → dein Projekt → **Project configuration → Environment variables → Add a variable**
- Key: `MTC_ADMIN_PASSWORD`
- Value: ein langes, eigenes Passwort
Danach unter **Deploys → Trigger deploy → Deploy site**.

## Kunden freischalten
`…/coach.html` → **🔑 Zugänge** → mit dem Passwort anmelden → Name eingeben → **Code erstellen** → **An Kunden senden**.
- Ein Code funktioniert auf max. 2 Geräten.
- **Sperren** = Kunde kann die App nicht mehr öffnen (Einträge bleiben auf seinem Handy).
- **Geräte zurücksetzen** = z. B. bei neuem Handy.

Freischaltung abschalten: in `index.html` im Abschnitt `CONFIG` `access:true` → `access:false`.

## Häufige Anpassungen (direkt auf github.com, Stift-Symbol)
In `index.html` ganz oben im Abschnitt `CONFIG`:
- `coachName`, `whatsapp` (z. B. `4917612345678` – erscheint dann auch auf dem Freischalt-Bildschirm), `email`, `atlasUrl`

Nach Änderungen an `index.html` oder `coach.html` in `sw.js` die Zeile `VERSION` hochzählen (z. B. `mtc-makro-v9` → `mtc-makro-v10`).
