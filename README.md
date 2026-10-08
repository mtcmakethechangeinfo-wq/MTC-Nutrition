# MTC Makrotracker

Makro-Tracker (PWA) für Kundinnen und Kunden von **MTC Fitness Coaching** – plus Coach-Dashboard.

| Datei | Zweck |
|---|---|
| `index.html` | Die App für Kunden (Heute, Verlauf, Check-in, Profil) |
| `coach.html` | Coach-Dashboard – öffnet sich über den Link, den Kunden im Check-in senden |
| `data/bls-v2.json` | Nährwertdatenbank BLS 4.0 (Max Rubner-Institut, CC BY 4.0) |
| `lib/` | Barcode-Scanner für Geräte ohne eingebauten Scanner |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline-Fähigkeit & „Zum Home-Bildschirm“ |
| `_redirects` | Weiterleitung für die Online-Suche (Open Food Facts) – funktioniert nur auf Netlify |

## Veröffentlichen
Das Repository ist mit Netlify verbunden: **Jede Änderung auf `main` wird automatisch live geschaltet** (ca. 30 Sekunden).

## Häufige Anpassungen (direkt auf github.com)
In `index.html` ganz oben im Abschnitt `CONFIG`:
- `coachName` – Name, der in der App erscheint
- `atlasUrl` – Link zum MTC Muskelatlas (erscheint dann im Profil)
- `whatsapp` – Nummer ohne + und Leerzeichen, z. B. `4917612345678`
- `email` – Adresse für Check-ins per Mail

Nach einer Änderung in `index.html` oder `coach.html` zusätzlich in `sw.js` die Zeile `VERSION` hochzählen (z. B. `mtc-makro-v8` → `mtc-makro-v9`), damit Handys die neue Version sicher laden.
