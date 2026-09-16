import { VERSION } from "./version.js";
import { $, $$ } from "./util.js";
import {
  setShow, paintHome, paintPlan, paintNotes, paintLog, paintBuch, paintGabe,
  paintHead, toggleFest, tap369, addPlan, addNote, exportBackup, importBackup,
  pickGabeFoto, saveGabe, saveSigilLog, showDrei, refreshTageskarte, goSigil,
} from "./screens.js";

const RUN_SCREENS = new Set(["run", "after", "drei"]);

function show(id) {
  $$(".screen").forEach((s) => s.classList.toggle("on", s.id === id));
  $$("nav button").forEach((b) => {
    const on =
      b.dataset.v === id ||
      ((id === "run" || id === "after" || id === "drei") && b.dataset.v === "home");
    b.classList.toggle("on", on);
  });
  document.querySelector(".app")?.classList.toggle("runmode", RUN_SCREENS.has(id));
  if (id === "home") paintHome();
  if (id === "geplant") paintPlan();
  if (id === "notiz") paintNotes();
  if (id === "log") paintLog();
  if (id === "buch") paintBuch();
  if (id === "gabe") paintGabe();
  window.scrollTo(0, 0);
}

setShow(show);

function bind() {
  $$("nav button").forEach((b) => {
    b.addEventListener("click", () => show(b.dataset.v));
  });

  $("#sunWrap")?.addEventListener("click", toggleFest);
  $("#sunWrap")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleFest();
    }
  });

  document.addEventListener("click", (e) => {
    const z = e.target.closest?.("[data-z]");
    if (z && z.closest(".z369, #z369, #z369run")) {
      e.preventDefault();
      tap369(z.getAttribute("data-z"));
    }
  });

  $("#plAdd")?.addEventListener("click", addPlan);
  $("#noteAdd")?.addEventListener("click", addNote);
  $("#kTag")?.addEventListener("click", refreshTageskarte);
  $("#kDrei")?.addEventListener("click", showDrei);
  $("#dreiBack")?.addEventListener("click", () => show("home"));
  $("#sigilGo")?.addEventListener("click", () => goSigil());
  $("#sigilSave")?.addEventListener("click", () => saveSigilLog());
  $("#sigilT")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goSigil();
    }
  });

  $("#opferFoto")?.addEventListener("click", pickGabeFoto);
  $("#opferGo")?.addEventListener("click", () => saveGabe());

  $("#bakOut")?.addEventListener("click", exportBackup);
  $("#bakIn")?.addEventListener("change", (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) importBackup(f);
    e.target.value = "";
  });

  $("#afterGo")?.addEventListener("click", () => show("home"));
  $("#afterStay")?.addEventListener("click", () => show("home"));
}

function registerSW() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("./sw.js?v=" + encodeURIComponent(VERSION)).catch(() => {});
}

document.addEventListener("DOMContentLoaded", () => {
  const ver = $("#appVer");
  if (ver) ver.textContent = "v" + VERSION;
  bind();
  paintHead();
  show("home");
  registerSW();
});

export { show, VERSION };
