import { $, $$, uid, now, esc, fill, downloadJson, readFileAsText, compressPic } from "./util.js";
import {
  loadData, saveData, loadNotes, saveNotes, load369, save369,
  fotoPut, fotoGet, fotoDel, packBackup, applyBackup,
} from "./storage.js";
import { RITUALS, CAT_ORDER, ritualById } from "./data/rituals.js";
import { moonInfo, sunInfo } from "./data/fest.js";
import { cardHtml, drawDayCard, drawDrei, redrawDayCard } from "./cards.js";
import { goSigil, restoreSigil, sigilDataUrl } from "./sigil.js";

let cat = "Alle";
let mem = {};
let fromPlan = null;
let gabePic = "";
let BOOKTEXT = "";
let festOpen = false;
let showRouter = null;

export function setShow(fn) {
  showRouter = fn;
}

function show(id) {
  if (showRouter) showRouter(id);
}

/* —— Header moon / sun —— */
export function paintHead() {
  const m = moonInfo();
  const s = sunInfo();
  const el = $("#moonSym");
  const tx = $("#moonTxt");
  if (el) el.textContent = m.sym;
  if (tx) {
    tx.textContent = "";
    tx.append(document.createTextNode(m.name));
    tx.append(document.createElement("br"));
    tx.append(document.createTextNode(m.tage === 0 ? "Vollmond" : "Vollmond " + m.wait));
  }
  const wrap = $("#moonWrap");
  if (wrap) wrap.title = m.name + " · " + m.satz;
  const se = $("#sunSym");
  const st = $("#sunTxt");
  if (se) se.textContent = s.sym;
  if (st) {
    st.textContent = "";
    st.append(document.createTextNode(s.dat));
    st.append(document.createElement("br"));
    st.append(document.createTextNode(s.fest + " " + (s.tage === 0 ? "heute" : s.wait)));
  }
  window._fest = s;
  paintFestHint();
}

function paintFestHint() {
  const el = $("#festHint");
  if (!el) return;
  if (!festOpen) {
    el.classList.remove("on");
    el.innerHTML = "";
    return;
  }
  const s = window._fest || sunInfo();
  el.className = "on";
  el.innerHTML =
    "<b>" + esc(s.fest) + "</b><small>" +
    esc(s.tage === 0 ? "heute" : s.wait) +
    "</small><p>" + esc(s.text) + "</p>";
}

export function toggleFest() {
  festOpen = !festOpen;
  paintFestHint();
}

/* —— 369 —— */
export function paint369(into) {
  const el = into || $("#z369");
  if (!el) return;
  const z = load369();
  el.innerHTML =
    '<button type="button" data-z="n3" aria-label="Zähler 3">3 <span>' + z.n3 + "/3</span></button>" +
    '<button type="button" data-z="n6" aria-label="Zähler 6">6 <span>' + z.n6 + "/6</span></button>" +
    '<button type="button" data-z="n9" aria-label="Zähler 9">9 <span>' + z.n9 + "/9</span></button>";
}

export function tap369(key) {
  const max = { n3: 3, n6: 6, n9: 9 };
  const z = load369();
  z[key]++;
  if (z[key] >= max[key]) z[key] = 0;
  save369(z);
  paint369($("#z369"));
  const rz = $("#run #z369run");
  if (rz) paint369(rz);
}

/* —— Home —— */
export function paintHome() {
  paintHead();
  const out = $("#kOut");
  if (out) out.innerHTML = cardHtml(drawDayCard(), "Heute");
  paint369($("#z369"));
  restoreSigil();
  renderList();
}

export function renderList() {
  const order = CAT_ORDER;
  const cats = $("#cats");
  if (cats) {
    cats.innerHTML = ["Alle", ...order]
      .map(
        (x) =>
          '<button type="button" class="chip' +
          (x === cat ? " on" : "") +
          '" data-cat="' +
          esc(x) +
          '">' +
          esc(x) +
          "</button>"
      )
      .join("");
    $$("#cats [data-cat]").forEach((b) => {
      b.onclick = () => {
        cat = b.dataset.cat;
        renderList();
      };
    });
  }
  const items = RITUALS.filter((r) => cat === "Alle" || r.tag === cat);
  const g = {};
  items.forEach((r) => {
    (g[r.tag] = g[r.tag] || []).push(r);
  });
  const list = $("#list");
  if (!list) return;
  if (!items.length) {
    list.innerHTML = "<p class='empty'>Keine Rituale in dieser Kategorie.</p>";
    return;
  }
  list.innerHTML = Object.keys(g)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b))
    .map(
      (k) =>
        '<p class="group">' +
        esc(k) +
        "</p>" +
        g[k]
          .map(
            (r) =>
              '<button type="button" class="card" data-id="' +
              esc(r.id) +
              '"><b>' +
              esc(r.t) +
              "</b><small>" +
              esc(r.s) +
              "</small></button>"
          )
          .join("")
    )
    .join("");
  $$("#list .card").forEach((b) => {
    b.onclick = () => {
      fromPlan = null;
      openRitual(b.dataset.id);
    };
  });
}

/* —— Ritual run —— */
function stepsFor(r, mit) {
  const b = r.steps.map((s) => s.slice());
  if (mit) {
    const i = b.findIndex((s) => /Rückkehr|Abschluss|Ende|Schluss/.test(s[0]));
    const w = [
      ["Wesenheit", "Nur stimmig öffnen. Wer bereit ist, darf sich zeigen."],
      ["Entlassen", "Danke. Du gehst. Alle Verbindungen lösen sich."],
    ];
    if (i >= 0) b.splice(i, 0, ...w);
    else b.push(...w);
  }
  return b;
}

export function openRitual(id, wer) {
  const r = ritualById(id);
  if (!r) return;
  let i = 0;
  let mit = null;
  let steps = [];
  mem = {};
  if (wer) {
    mem.Name = wer;
    const p = wer.split(/\s*·\s*/);
    mem.A = p[0] || wer;
    mem.B = p[1] || "";
  }

  const gate = () => {
    $("#run").innerHTML =
      '<div class="hero"><p class="sub">' +
      esc(r.t) +
      '</p><h2>Wesenheit?</h2><p class="sub">Optional — nur wenn nötig.</p></div>' +
      '<div class="row"><button type="button" class="btn ghost" id="wOhne">Ohne</button>' +
      '<button type="button" class="btn primary" id="wMit">Mit</button></div>' +
      '<div class="row"><button type="button" class="btn ghost" id="wBack">Liste</button></div>';
    $("#wOhne").onclick = () => {
      mit = false;
      steps = stepsFor(r, false);
      i = 0;
      draw();
    };
    $("#wMit").onclick = () => {
      mit = true;
      steps = stepsFor(r, true);
      i = 0;
      draw();
    };
    $("#wBack").onclick = () => show("home");
  };

  const draw = () => {
    const [titel, text] = steps[i];
    const last = i === steps.length - 1;
    const needs = i === 0 ? r.need || [] : [];
    const names = needs
      .map(
        (n) =>
          '<label class="lbl" for="need_' +
          esc(n) +
          '">' +
          esc(n) +
          '</label><input id="need_' +
          esc(n) +
          '" data-k="' +
          esc(n) +
          '" placeholder="' +
          esc(n) +
          '" value="' +
          esc(mem[n] || "") +
          '" autocomplete="off">'
      )
      .join("");
    const is369 = titel === "369";
    $("#run").innerHTML =
      '<div class="hero"><p class="sub">' +
      esc(r.t) +
      " · " +
      (i + 1) +
      "/" +
      steps.length +
      "</p><h2>" +
      esc(titel) +
      "</h2></div>" +
      names +
      '<p class="words">' +
      fill(text, mem) +
      "</p>" +
      (is369 ? '<div id="z369run" class="z369"></div>' : "") +
      (last
        ? '<label class="check"><input type="checkbox" id="back"><span>Ich kehre zurück.</span></label>'
        : "") +
      '<div class="row"><button type="button" class="btn ghost" id="prev">' +
      (i ? "Zurück" : "Wahl") +
      '</button><button type="button" class="btn primary" id="next">' +
      (last ? "So sei es" : "Weiter") +
      "</button></div>" +
      '<p class="msg" id="msg" role="status"></p>';
    if (is369) paint369($("#z369run"));
    $$("#run [data-k]").forEach((inp) => {
      inp.oninput = () => {
        mem[inp.dataset.k] = inp.value.trim();
        const words = $("#run .words");
        if (words) words.innerHTML = fill(text, mem);
      };
    });
    $("#prev").onclick = () => {
      if (!i) {
        gate();
        return;
      }
      i--;
      draw();
    };
    $("#next").onclick = () => {
      if (i < steps.length - 1) {
        i++;
        draw();
        return;
      }
      if (!$("#back") || !$("#back").checked) {
        $("#msg").textContent = "Erst zurückkehren.";
        return;
      }
      const d = loadData();
      d.log.unshift({
        id: uid(),
        t: now(),
        titel: r.t,
        wer: [mem.Name, mem.A, mem.B].filter(Boolean).join(" · "),
        wesen: !!mit,
        kind: "ritual",
      });
      if (fromPlan) {
        d.planned = d.planned.filter((p) => p.pid !== fromPlan);
        fromPlan = null;
      }
      saveData(d);
      show("after");
    };
  };

  show("run");
  gate();
}

/* —— Geplant —— */
export function paintPlan() {
  const d = loadData();
  const sel = $("#plR");
  if (sel) {
    const cur = sel.value;
    sel.innerHTML = "";
    RITUALS.forEach((r) => {
      const o = document.createElement("option");
      o.value = r.id;
      o.textContent = r.t;
      sel.appendChild(o);
    });
    if (cur) sel.value = cur;
  }
  const box = $("#plList");
  if (!box) return;
  if (!d.planned.length) {
    box.innerHTML = "<p class='empty'>Nichts geplant. Ritual wählen und vormerken.</p>";
    return;
  }
  box.innerHTML = d.planned
    .map(
      (x) =>
        '<div class="entry"><b>' +
        esc(x.titel) +
        '</b><div class="meta">' +
        esc(x.wer || "ohne Namen") +
        " · " +
        esc(x.t || "") +
        '</div><div class="row">' +
        '<button type="button" class="btn primary" data-go="' +
        esc(x.pid) +
        '">Starten</button>' +
        '<button type="button" class="btn ghost" data-del="' +
        esc(x.pid) +
        '">Löschen</button></div></div>'
    )
    .join("");
  $$("#plList [data-go]").forEach((b) => {
    b.onclick = () => {
      const x = loadData().planned.find((p) => p.pid === b.dataset.go);
      if (x) {
        fromPlan = x.pid;
        openRitual(x.id, x.wer);
      }
    };
  });
  $$("#plList [data-del]").forEach((b) => {
    b.onclick = () => {
      const d2 = loadData();
      d2.planned = d2.planned.filter((p) => p.pid !== b.dataset.del);
      saveData(d2);
      paintPlan();
    };
  });
}

export function addPlan() {
  const r = ritualById($("#plR").value);
  if (!r) return;
  const d = loadData();
  d.planned.unshift({
    pid: uid(),
    id: r.id,
    titel: r.t,
    wer: ($("#plW").value || "").trim(),
    t: now(),
  });
  saveData(d);
  $("#plW").value = "";
  paintPlan();
}

/* —— Notizen —— */
export function paintNotes() {
  const notes = loadNotes();
  const box = $("#notesOnly");
  if (!box) return;
  if (!notes.length) {
    box.innerHTML = "<p class='empty'>Keine Notiz. Schreibe etwas und speichere.</p>";
    return;
  }
  box.innerHTML = notes
    .map(
      (n) =>
        '<button type="button" class="card" data-nid="' +
        esc(n.id) +
        '"><small>' +
        esc(n.t) +
        "</small><b>" +
        esc((n.note || "").slice(0, 90)) +
        ((n.note || "").length > 90 ? "…" : "") +
        "</b></button>"
    )
    .join("");
  $$("#notesOnly [data-nid]").forEach((b) => {
    b.onclick = () => openNote(b.dataset.nid);
  });
}

function openNote(id) {
  const n = loadNotes().find((x) => x.id === id);
  if (!n) {
    paintNotes();
    return;
  }
  $("#notesOnly").innerHTML =
    '<div class="card"><p class="sub">' +
    esc(n.t) +
    '</p><label class="lbl" for="noteEdit">Notiz</label>' +
    '<textarea id="noteEdit">' +
    esc(n.note || "") +
    '</textarea><div class="row">' +
    '<button type="button" class="btn ghost" id="nBack">Liste</button>' +
    '<button type="button" class="btn primary" id="nSave">Speichern</button></div>' +
    '<div class="row"><button type="button" class="btn ghost" id="nDel">Löschen</button></div></div>';
  $("#nBack").onclick = paintNotes;
  $("#nSave").onclick = () => {
    const tx = ($("#noteEdit").value || "").trim();
    saveNotes(loadNotes().map((x) => (x.id === id ? Object.assign({}, x, { note: tx }) : x)));
    paintNotes();
  };
  $("#nDel").onclick = () => {
    if (confirm("Diese Notiz löschen?")) {
      saveNotes(loadNotes().filter((x) => x.id !== id));
      paintNotes();
    }
  };
}

export function addNote() {
  const tx = ($("#noteT").value || "").trim();
  if (!tx) return;
  const n = loadNotes();
  n.unshift({ id: uid(), t: now(), note: tx });
  saveNotes(n);
  $("#noteT").value = "";
  paintNotes();
}

/* —— Chronik —— */
function wesenTxt(e) {
  return e && e.wesen ? "Mit Wesenheit" : "Ohne Wesenheit";
}

export async function paintLog() {
  const rows = loadData().log || [];
  const box = $("#entries");
  if (!box) return;
  if (!rows.length) {
    box.innerHTML = "<p class='empty'>Noch leer. Abgeschlossene Rituale und Gaben erscheinen hier.</p>";
    return;
  }
  const parts = await Promise.all(
    rows.map(async (e) => {
      let pics = "";
      if (e.pics || e.kind === "gabe" || e.titel === "Gabe" || e.titel === "Sigille") {
        try {
          const imgs = await fotoGet(e.id);
          if (imgs && imgs.length) {
            pics =
              '<div class="shots">' +
              imgs
                .map((src) => '<img alt="Anhang" src="' + esc(src) + '">')
                .join("") +
              "</div>";
          }
        } catch {}
      }
      return (
        '<div class="entry" data-eid="' +
        esc(e.id) +
        '"><b>' +
        esc(e.titel) +
        '</b><div class="meta">' +
        esc(e.t) +
        '</div><div class="meta">' +
        esc(e.wer || "ohne Namen") +
        (e.kind === "ritual" || e.wesen != null ? " · " + wesenTxt(e) : "") +
        "</div>" +
        (e.note ? '<p class="note-line">' + esc(e.note) + "</p>" : "") +
        pics +
        '<div class="row" style="margin-top:.45rem">' +
        '<button type="button" class="btn primary" data-open="' +
        esc(e.id) +
        '">Bearbeiten</button>' +
        '<button type="button" class="btn ghost" data-del="' +
        esc(e.id) +
        '">Löschen</button></div></div>'
      );
    })
  );
  box.innerHTML = parts.join("");
  box.querySelectorAll("[data-open]").forEach((b) => {
    b.onclick = (ev) => {
      ev.preventDefault();
      openLog(b.getAttribute("data-open"));
    };
  });
  box.querySelectorAll("[data-del]").forEach((b) => {
    b.onclick = async (ev) => {
      ev.preventDefault();
      if (!confirm("Diesen Eintrag löschen?")) return;
      await delLog(b.getAttribute("data-del"));
      paintLog();
    };
  });
}

async function delLog(id) {
  const d = loadData();
  d.log = (d.log || []).filter((x) => x.id !== id);
  saveData(d);
  try {
    await fotoDel(id);
  } catch {}
}

function openLog(id) {
  const e = (loadData().log || []).find((x) => x.id === id);
  if (!e) {
    paintLog();
    return;
  }
  const box = $("#entries");
  box.innerHTML =
    '<div class="card"><p class="sub">' +
    esc(e.t) +
    '</p><h2 class="serif">' +
    esc(e.titel) +
    '</h2><p class="sub">' +
    esc(wesenTxt(e)) +
    '</p><label class="lbl" for="logWer">Für wen</label>' +
    '<input id="logWer" placeholder="Name / Person" value="' +
    esc(e.wer || "") +
    '" autocomplete="off">' +
    '<label class="lbl" for="logNote">Kommentar</label>' +
    '<textarea id="logNote" placeholder="Kommentar">' +
    esc(e.note || "") +
    '</textarea><div class="row">' +
    '<button type="button" class="btn ghost" id="logBack">Liste</button>' +
    '<button type="button" class="btn primary" id="logSave">Speichern</button></div>' +
    '<div class="row"><button type="button" class="btn ghost" id="logDel">Löschen</button></div></div>';
  const store = () => {
    const d = loadData();
    const row = (d.log || []).find((x) => x.id === id);
    if (row) {
      row.wer = ($("#logWer").value || "").trim();
      row.note = String($("#logNote").value || "").slice(0, 800);
      saveData(d);
    }
  };
  $("#logBack").onclick = () => {
    store();
    paintLog();
  };
  $("#logSave").onclick = () => {
    store();
    paintLog();
  };
  $("#logDel").onclick = async () => {
    if (confirm("Diesen Eintrag löschen?")) {
      await delLog(id);
      paintLog();
    }
  };
}

export function exportBackup() {
  const p = packBackup();
  downloadJson("universum-neu-backup.json", p);
}

export async function importBackup(file) {
  try {
    const raw = await readFileAsText(file);
    const p = JSON.parse(raw);
    if (!applyBackup(p)) throw new Error("leer");
    alert("Sicherung übernommen.");
    paintLog();
    paintNotes();
    paintPlan();
    paintHome();
  } catch {
    alert("Datei nicht lesbar. Ganze JSON-Sicherung wählen.");
  }
}

/* —— Gabe —— */
export function paintGabe() {
  const prev = $("#opferPrev");
  if (prev) {
    prev.innerHTML = gabePic ? '<img alt="Vorschau Gabe" src="' + esc(gabePic) + '">' : "";
  }
  const msg = $("#opferMsg");
  if (msg) msg.textContent = "";
}

export function pickGabeFoto() {
  const inp = document.createElement("input");
  inp.type = "file";
  inp.accept = "image/*";
  inp.capture = "environment";
  inp.onchange = async (ev) => {
    const f = ev.target.files && ev.target.files[0];
    if (!f) return;
    gabePic = (await compressPic(f)) || "";
    paintGabe();
  };
  inp.click();
}

export async function saveGabe() {
  const t = (($("#opferT") || {}).value || "").trim();
  const msg = $("#opferMsg");
  if (!t && !gabePic) {
    if (msg) msg.textContent = "Wort oder Foto nötig.";
    return;
  }
  const d = loadData();
  const id = uid();
  const e = {
    id,
    t: now(),
    titel: "Gabe",
    wer: "",
    note: t,
    kind: "gabe",
    pics: gabePic ? 1 : 0,
  };
  d.log.unshift(e);
  try {
    saveData(d);
  } catch {
    if (msg) msg.textContent = "Speicher voll.";
    return;
  }
  if (gabePic) {
    try {
      await fotoPut(id, [gabePic]);
    } catch {}
  }
  gabePic = "";
  if ($("#opferT")) $("#opferT").value = "";
  paintGabe();
  if (msg) msg.textContent = "In der Chronik abgelegt.";
  setTimeout(() => show("log"), 280);
}

/* —— Sigil ablegen —— */
export async function saveSigilLog() {
  const t = (($("#sigilT") || {}).value || "").trim();
  const img = sigilDataUrl();
  if (!img || img.length < 80) return;
  const id = uid();
  const d = loadData();
  d.log.unshift({
    id,
    t: now(),
    titel: "Sigille",
    wer: t,
    kind: "sigil",
    pics: 1,
  });
  saveData(d);
  try {
    await fotoPut(id, [img]);
  } catch {}
  const b = $("#sigilSave");
  if (b) {
    b.textContent = "Abgelegt";
    setTimeout(() => {
      b.textContent = "Ablegen";
    }, 1400);
  }
}

/* —— Drei / Karte —— */
export function showDrei() {
  const [a, b, c] = drawDrei();
  const box = $("#dreiList");
  if (box) box.innerHTML = cardHtml(a, "Lage") + cardHtml(b, "Block") + cardHtml(c, "Weg");
  show("drei");
}

export function refreshTageskarte() {
  const out = $("#kOut");
  if (out) out.innerHTML = cardHtml(redrawDayCard(), "Heute");
}

/* —— Buch —— */
export async function paintBuch() {
  const page = $("#page");
  if (!page) return;
  page.innerHTML = "<p class='sub'>Buch lädt …</p>";
  if (!BOOKTEXT) {
    try {
      const parts = await Promise.all(
        [0, 1, 2, 3, 4].map((n) =>
          fetch("content/pdfpart" + n + ".txt", { cache: "force-cache" }).then((r) => {
            if (!r.ok) throw new Error(String(n));
            return r.text();
          })
        )
      );
      BOOKTEXT = parts.join("\n\n");
    } catch {
      page.innerHTML = "<p class='empty'>Buchdateien fehlen. Seite neu laden.</p>";
      return;
    }
  }
  page.innerHTML = "";
  const pre = document.createElement("div");
  pre.className = "booktext";
  pre.textContent = BOOKTEXT;
  page.appendChild(pre);
}

export { goSigil };
