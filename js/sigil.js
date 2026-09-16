import { loadSigilState, saveSigilState } from "./storage.js";

const L = {
  B: [[0.3, 0.15], [0.3, 0.85], [0.3, 0.15], [0.7, 0.28], [0.3, 0.5], [0.7, 0.72], [0.3, 0.85]],
  C: [[0.72, 0.22], [0.3, 0.2], [0.28, 0.8], [0.72, 0.78]],
  D: [[0.3, 0.15], [0.3, 0.85], [0.3, 0.15], [0.72, 0.5], [0.3, 0.85]],
  F: [[0.3, 0.85], [0.3, 0.15], [0.72, 0.15], [0.3, 0.15], [0.3, 0.5], [0.62, 0.5]],
  G: [[0.7, 0.22], [0.3, 0.22], [0.28, 0.78], [0.7, 0.78], [0.7, 0.52], [0.5, 0.52]],
  H: [[0.28, 0.15], [0.28, 0.85], [0.28, 0.5], [0.72, 0.5], [0.72, 0.15], [0.72, 0.85]],
  J: [[0.68, 0.15], [0.68, 0.7], [0.5, 0.85], [0.32, 0.7]],
  K: [[0.3, 0.15], [0.3, 0.85], [0.3, 0.5], [0.72, 0.15], [0.3, 0.5], [0.72, 0.85]],
  L: [[0.32, 0.15], [0.32, 0.85], [0.7, 0.85]],
  M: [[0.22, 0.85], [0.22, 0.15], [0.5, 0.55], [0.78, 0.15], [0.78, 0.85]],
  N: [[0.28, 0.85], [0.28, 0.15], [0.72, 0.85], [0.72, 0.15]],
  P: [[0.3, 0.85], [0.3, 0.15], [0.68, 0.15], [0.7, 0.38], [0.3, 0.48]],
  Q: [[0.5, 0.2], [0.28, 0.38], [0.28, 0.7], [0.5, 0.85], [0.72, 0.7], [0.72, 0.38], [0.5, 0.2]],
  R: [[0.3, 0.85], [0.3, 0.15], [0.68, 0.15], [0.7, 0.38], [0.3, 0.48], [0.7, 0.85]],
  S: [[0.7, 0.22], [0.32, 0.2], [0.3, 0.48], [0.7, 0.52], [0.7, 0.8], [0.3, 0.82]],
  T: [[0.22, 0.18], [0.78, 0.18], [0.5, 0.18], [0.5, 0.85]],
  V: [[0.22, 0.15], [0.5, 0.85], [0.78, 0.15]],
  W: [[0.18, 0.15], [0.32, 0.85], [0.5, 0.4], [0.68, 0.85], [0.82, 0.15]],
  X: [[0.25, 0.18], [0.75, 0.82], [0.75, 0.18], [0.25, 0.82]],
  Y: [[0.22, 0.15], [0.5, 0.5], [0.78, 0.15], [0.5, 0.5], [0.5, 0.85]],
  Z: [[0.25, 0.18], [0.75, 0.18], [0.25, 0.82], [0.75, 0.82]],
};

export function reduceAbsicht(s) {
  s = String(s || "")
    .toUpperCase()
    .replace(/[ÄÖÜAEIOU\s0-9.,;:!?'"\-]/g, "");
  let o = "";
  const seen = {};
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (!seen[c]) {
      seen[c] = 1;
      o += c;
    }
  }
  return o;
}

function canvasEl() {
  const c = document.getElementById("sigilC");
  if (!c) return null;
  const r = c.getBoundingClientRect();
  const w = Math.max(320, Math.round(r.width * 2) || 320);
  const h = Math.max(320, Math.round(r.height * 2) || 320);
  if (c.width !== w || c.height !== h) {
    c.width = w;
    c.height = h;
  }
  return c;
}

export function drawSigil(letters) {
  const c = canvasEl();
  if (!c) return;
  const ctx = c.getContext("2d");
  const w = c.width;
  const h = c.height;
  const m = Math.min(w, h);
  ctx.fillStyle = "#08040e";
  ctx.fillRect(0, 0, w, h);
  const n = (letters || "").length;
  if (!n) return;
  ctx.save();
  ctx.translate(w / 2, h / 2);
  const lw = Math.max(7, m / 28);
  for (let i = 0; i < n; i++) {
    const pts = L[letters[i]] || L.X;
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / n);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowColor = "#ff7ad9";
    ctx.shadowBlur = m / 10;
    ctx.strokeStyle = "#ff9ad8";
    ctx.lineWidth = lw;
    ctx.beginPath();
    pts.forEach((p, k) => {
      const x = (p[0] - 0.5) * m * 0.92;
      const y = (p[1] - 0.5) * m * 0.92;
      if (k) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "#fff4fb";
    ctx.lineWidth = lw * 0.32;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export function goSigil() {
  const el = document.getElementById("sigilT");
  const t = el ? el.value : "";
  const letters = reduceAbsicht(t);
  if (el) el.value = String(t).toUpperCase();
  drawSigil(letters);
  saveSigilState({ t, l: letters });
  return letters;
}

export function restoreSigil() {
  const d = loadSigilState();
  const el = document.getElementById("sigilT");
  if (el && d.t) el.value = String(d.t).toUpperCase();
  drawSigil(d.l || "");
}

export function sigilDataUrl() {
  const c = document.getElementById("sigilC");
  if (!c) return "";
  try {
    return c.toDataURL("image/jpeg", 0.72);
  } catch {
    return "";
  }
}
