# Universum Neu

Statische Ritual-PWA (Deutsch, mobile-first). Eigenständige App — **rr25** und die bestehende **universum-app** bleiben unberührt.

Kurzname: **Universum** · Vollname: **Universum Neu**

## Lokal starten

```bash
cd /workspace/universum-neu
python3 -m http.server 8080
```

Dann im Browser: `http://localhost:8080/`

Module und Service Worker brauchen HTTP (nicht `file://`).

## Aufbau

```
universum-neu/
  index.html
  css/app.css
  js/app.js          # Boot + Navigation
  js/screens.js      # Alle Screens
  js/util.js         # esc, fill, uid, …
  js/storage.js      # localStorage (universum_v1_*) + IndexedDB Fotos
  js/cards.js
  js/sigil.js
  js/data/rituals.js
  js/data/fest.js
  sw.js
  manifest.webmanifest
  assets/
  content/pdfpart0–4.txt
```

## Daten

- Präfix `universum_v1_` in `localStorage` (kein Konflikt mit rr25).
- Fotos (Gabe, Sigille) in IndexedDB `universum_v1_photos`.
- Backup: Chronik → «Sichern (JSON)» / «Einfügen».

## Funktionen

Home (Mond/Fest, Tageskarte, Drei-Karten, 369, Sigille, Ritualliste Alle), Ritual-Lauf mit optionaler Wesenheit, Geplant, Notiz, Chronik + Backup, Gabe, Buch, PWA-Cache nach `VERSION`.

## GitHub / Pages

Repo vorgesehen: `https://github.com/fxrebermanagement-star/universum-neu`  
Deploy später z. B. GitHub Pages aus diesem Ordner. Hier lokal fertigstellen — Push nicht automatisch.

## Hinweise

- rr25 und universum-app werden von diesem Projekt **nicht** geändert.
- Cache wird nur bei Versionswechsel aktualisiert, nicht bei jedem Laden gelöscht.
