const DAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

export const FEST = [
  [2, 1, "Imbolc", "Licht zurück. Samen innen. Nicht hetzen. Still halten und wärmen."],
  [3, 20, "Ostara", "Tag und Nacht gleich. Neu setzen. Was keimt, darf wachsen."],
  [5, 1, "Beltane", "Feuer und Tür. Leben nach aussen. Grenze trotzdem halten."],
  [6, 21, "Litha", "Höhe. Kraft ist da. Nicht nachsetzen. Danken und stehen."],
  [8, 1, "Lughnasadh", "Erste Ernte. Nehmen was reif ist. Den Rest stehen lassen."],
  [9, 22, "Mabon", "Wieder Gleichstand. Abgeben. Was fällt, darf fallen."],
  [10, 31, "Samhain", "Schleier dünn. Ahnen ehren. Kontakt kurz. Dann schliessen."],
  [12, 21, "Jul", "Tiefste Nacht. Licht hüten. Innen bleiben. Neu beginnen."],
];

function day() {
  return new Date();
}

export function nextFest(n = day()) {
  const y = n.getFullYear();
  const list = [];
  for (let k = 0; k < 2; k++) {
    FEST.forEach((f) => {
      list.push({ d: new Date(y + k, f[0] - 1, f[1]), name: f[2], text: f[3] });
    });
  }
  const now = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
  for (let i = 0; i < list.length; i++) {
    const t = new Date(
      list[i].d.getFullYear(),
      list[i].d.getMonth(),
      list[i].d.getDate()
    ).getTime();
    const diff = Math.round((t - now) / 86400000);
    if (diff >= 0) return { name: list[i].name, tage: diff, text: list[i].text };
  }
  return { name: "Imbolc", tage: 0, text: FEST[0][3] };
}

export function moonInfo(n = day()) {
  const syn = 29.53058867;
  const nm = Date.UTC(2000, 0, 6, 18, 14) / 1000;
  let age = ((n.getTime() / 1000 - nm) / 86400) % syn;
  if (age < 0) age += syn;
  const p = age / syn;
  const left = p < 0.5 ? (0.5 - p) * syn : (1.5 - p) * syn;
  const tage = Math.max(0, Math.round(left));
  let name, satz, sym;
  if (p < 0.03 || p > 0.97) {
    sym = "\u25cb";
    name = "Neumond";
    satz = "Neu setzen. Still halten.";
  } else if (p < 0.22) {
    sym = "\ud83c\udf12";
    name = "Zunehmend";
    satz = "Wachsen lassen. Nicht hetzen.";
  } else if (p < 0.28) {
    sym = "\ud83c\udf13";
    name = "Viertel";
    satz = "Form geben. Grenze halten.";
  } else if (p < 0.47) {
    sym = "\ud83c\udf14";
    name = "Zunehmend";
    satz = "Kraft sammeln. Klar bleiben.";
  } else if (p < 0.53) {
    sym = "\ud83c\udf15";
    name = "Vollmond";
    satz = "Sichtbar. Nicht nachsetzen.";
  } else if (p < 0.72) {
    sym = "\ud83c\udf16";
    name = "Abnehmend";
    satz = "Abgeben. Was fällt, darf fallen.";
  } else if (p < 0.78) {
    sym = "\ud83c\udf17";
    name = "Viertel";
    satz = "Lösen. Zurück zur Mitte.";
  } else {
    sym = "\ud83c\udf18";
    name = "Abnehmend";
    satz = "Leeren. Schlafen lassen.";
  }
  const wait = tage === 0 ? "heute" : tage === 1 ? "1 Tag" : tage + " Tage";
  return { sym, name, satz, wait, tage };
}

export function sunInfo(n = day()) {
  const f = nextFest(n);
  const dat = DAYS[n.getDay()] + " " + n.getDate() + "." + (n.getMonth() + 1) + ".";
  const wait = f.tage === 0 ? "heute" : f.tage === 1 ? "1 Tag" : f.tage + " Tage";
  return { sym: "\u2600\ufe0f", dat, fest: f.name, wait, tage: f.tage, text: f.text };
}
