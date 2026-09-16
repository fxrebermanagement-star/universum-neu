import { loadKarte, saveKarte } from "./storage.js";
import { ymd, esc } from "./util.js";

export const DECK = [
  { t: "Der Spieler", z: "☉", x: "Du bist nicht die Figur. Beobachter wach. Aus der Mitte handeln." },
  { t: "Die 9", z: "∴", x: "Nicht vermehren. Vollenden. Was gesetzt ist, darf stehen." },
  { t: "Feld zu", z: "⛨", x: "Grenze spüren. Nichts Fremdes hat Zutritt. Der Raum bleibt deiner." },
  { t: "Faden", z: "ᛅ", x: "Nur den Faden. Kein Urteil. Kein Nachsetzen." },
  { t: "Rückkehr", z: "↩", x: "Ich bin nicht der andere. Energie zurück. Wasser, Körper, Alltag." },
  { t: "Segen", z: "☥", x: "Setzen, nicht bitten. Danke. Es ist so. Abgeben." },
  { t: "Grenze", z: "⬡", x: "So weit öffnen, wie es stimmig ist. Unklares bleibt draußen." },
  { t: "369", z: "⋮", x: "Dreimal setzen. Sechsmal halten. Neunmal vollenden. Dann loslassen." },
  { t: "Halt", z: "▣", x: "Heute nicht mehr Arbeit. Was steht, steht. Nicht nachkontrollieren." },
  { t: "Erden", z: "▽", x: "Füße. Atem. Wasser. Der Auftrag endet im Körper." },
  { t: "Schutz", z: "⛤", x: "Feld geschlossen. Fremdes prallt ab oder geht in die Erde." },
  { t: "Liebe ohne Zwang", z: "❦", x: "Nähe nur wenn sie wahr ist. Jeder bleibt frei." },
  { t: "Trennung", z: "⚔", x: "Was zieht, darf gehen. Was stimmig ist, bleibt." },
  { t: "Ausgleich", z: "⚖", x: "Nicht Rache. Was genommen wurde, kehrt rein zurück." },
  { t: "Ahnen", z: "ᛟ", x: "Ehren und begrenzen. Nähe ja. Verschmelzung nein." },
  { t: "Wesenheit", z: "◈", x: "Nur wenn der Faden nicht reicht. Hartes Ende. Danach zurück." },
  { t: "Filter", z: "⬢", x: "Nur klare Präsenz. Was drängt, bleibt draußen." },
  { t: "Saat", z: "✱", x: "Ein Satz. Setzen. Nicht wässern aus Angst." },
  { t: "Loslassen", z: "☾", x: "Die Arbeit ist übergeben. So sei es." },
  { t: "Mitte", z: "⊕", x: "Nicht die Geschichte des anderen werden. Bei dir bleiben." },
  { t: "Klarheit", z: "◇", x: "Nebelig? Druck? Theater? Dann schliessen, nicht vertiefen." },
  { t: "Versorgung", z: "☼", x: "Ich bin versorgt. Es ist so. Ohne zu hetzen." },
  { t: "Gesundheit", z: "☤", x: "Der Körper erinnert sich. Arzt parallel. Kein Erzwingen." },
  { t: "Nacht", z: "☽", x: "Nichts Neues setzen. Feld halten. Schlafen lassen." },
];

function pick(used) {
  let pool = DECK.filter((c) => used.indexOf(c.t) < 0);
  if (!pool.length) pool = DECK.slice();
  return pool[Math.floor(Math.random() * pool.length)];
}

export function cardHtml(c, label) {
  return (
    '<div class="kcard" role="article">' +
    '<span class="group">' +
    esc(label) +
    "</span>" +
    '<div class="kz" aria-hidden="true">' +
    esc(c.z || "☉") +
    "</div>" +
    "<b>" +
    esc(c.t) +
    "</b>" +
    "<small>" +
    esc(c.x) +
    "</small></div>"
  );
}

export function drawDayCard() {
  const d = loadKarte();
  if (d.day !== ymd() || !d.one) {
    d.day = ymd();
    d.one = pick([]);
    saveKarte(d);
  }
  const fresh = DECK.find((c) => c.t === d.one.t);
  return fresh || d.one;
}

export function drawDrei() {
  const a = pick([]);
  const b = pick([a.t]);
  const c = pick([a.t, b.t]);
  return [a, b, c];
}

export function redrawDayCard() {
  const d = loadKarte();
  d.day = ymd();
  d.one = pick([]);
  saveKarte(d);
  return d.one;
}
