const PREFIX = "universum_v1_";
const DATA_KEY = PREFIX + "data";
const NOTES_KEY = PREFIX + "notes";
const KARTE_KEY = PREFIX + "karte";
const Z369_KEY = PREFIX + "369";
const SIGIL_KEY = PREFIX + "sigil";
const IDB_NAME = "universum_v1_photos";
const IDB_STORE = "photos";
const SOFT_QUOTA = 4_500_000;

function todayYmd(d = new Date()) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function lsGet(k, fallback) {
  try {
    const raw = localStorage.getItem(k);
    if (raw == null || raw === "") return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function lsSet(k, v) {
  const s = JSON.stringify(v);
  if (s.length > SOFT_QUOTA) {
    const err = new Error("quota");
    err.code = "QUOTA";
    throw err;
  }
  try {
    localStorage.setItem(k, s);
  } catch {
    const err = new Error("quota");
    err.code = "QUOTA";
    throw err;
  }
}

export function loadData() {
  const d = lsGet(DATA_KEY, null);
  if (d && typeof d === "object") {
    return {
      log: Array.isArray(d.log) ? d.log : [],
      planned: Array.isArray(d.planned) ? d.planned : [],
      gaben: Array.isArray(d.gaben) ? d.gaben : [],
    };
  }
  return { log: [], planned: [], gaben: [] };
}

export function saveData(d) {
  lsSet(DATA_KEY, {
    log: d.log || [],
    planned: d.planned || [],
    gaben: d.gaben || [],
  });
}

export function loadNotes() {
  const n = lsGet(NOTES_KEY, []);
  return Array.isArray(n) ? n : [];
}

export function saveNotes(a) {
  lsSet(NOTES_KEY, Array.isArray(a) ? a : []);
}

export function loadKarte() {
  return lsGet(KARTE_KEY, {});
}

export function saveKarte(d) {
  lsSet(KARTE_KEY, d || {});
}

export function load369() {
  const x = lsGet(Z369_KEY, {});
  const d = todayYmd();
  if (x.d !== d) return { d, n3: 0, n6: 0, n9: 0 };
  return { d: x.d, n3: x.n3 | 0, n6: x.n6 | 0, n9: x.n9 | 0 };
}

export function save369(z) {
  lsSet(Z369_KEY, z);
}

export function loadSigilState() {
  return lsGet(SIGIL_KEY, {});
}

export function saveSigilState(d) {
  lsSet(SIGIL_KEY, d || {});
}

function openIdb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function fotoPut(id, dataUrls) {
  const db = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(dataUrls, id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function fotoGet(id) {
  const db = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(id);
    req.onsuccess = () => {
      db.close();
      resolve(req.result || []);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function fotoDel(id) {
  const db = await openIdb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export function packBackup() {
  const pack = { v: 1, app: "universum", t: new Date().toISOString(), keys: {} };
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) {
      pack.keys[k] = localStorage.getItem(k);
    }
  }
  return pack;
}

export function applyBackup(pack) {
  if (!pack || typeof pack !== "object") return false;
  const keys = pack.keys || {};
  let n = 0;
  const src = Object.keys(keys).length ? keys : pack;
  Object.keys(src).forEach((k) => {
    if (k === "v" || k === "t" || k === "app" || k === "keys" || k === "photos") return;
    if (!String(k).startsWith(PREFIX)) return;
    const val = src[k];
    if (val == null) return;
    localStorage.setItem(k, typeof val === "string" ? val : JSON.stringify(val));
    n++;
  });
  return n > 0;
}

export { PREFIX, DATA_KEY, NOTES_KEY, KARTE_KEY, Z369_KEY, SIGIL_KEY };
