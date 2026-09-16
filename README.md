# Universum Neu

Statische Ritual-PWA (Deutsch, mobile-first). Eigenständige App — **rr25** und die bestehende **universum-app** bleiben unberührt.

Kurzname: **Universum** · Vollname: **Universum Neu**

## Live

https://fxrebermanagement-star.github.io/universum-neu/

## Lokal starten

```bash
cd universum-neu
python3 -m http.server 8080
```

Dann im Browser: `http://localhost:8080/`

Module und Service Worker brauchen HTTP (nicht `file://`).

## Aufbau

```
universum-neu/
  index.html
  css/app.css
  js/…
  sw.js
  manifest.webmanifest
  assets/
  content/pdfpart0–4.txt
```

## Daten

- Präfix `universum_v1_` in `localStorage` (kein Konflikt mit rr25).
- Fotos in IndexedDB.
- Backup: Chronik → Sichern (JSON) / Einfügen.

## Hinweise

- rr25 und universum-app werden von diesem Projekt **nicht** geändert.
- Cache nur bei Versionswechsel aktualisiert.
