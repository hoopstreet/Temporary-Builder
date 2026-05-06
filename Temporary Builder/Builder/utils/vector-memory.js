const fs = require("fs");

const FILE = "Temporary Builder/memory/vector-db.json";

function load() {
  if (!fs.existsSync(FILE)) {
    return { vectors: {} };
  }
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function save(db) {
  fs.writeFileSync(FILE, JSON.stringify(db, null, 2));
}

// simple text → vector (lightweight hashing embedding)
function embed(text) {
  const words = (text || "").toLowerCase().split(/\W+/);
  const vec = {};

  for (const w of words) {
    if (!w) continue;
    vec[w] = (vec[w] || 0) + 1;
  }

  return vec;
}

// cosine similarity
function similarity(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, magA = 0, magB = 0;

  for (const k of keys) {
    const x = a[k] || 0;
    const y = b[k] || 0;
    dot += x * y;
    magA += x * x;
    magB += y * y;
  }

  return dot / (Math.sqrt(magA) * Math.sqrt(magB) || 1);
}

function store(filePath, content) {
  const db = load();

  db.vectors[filePath] = embed(content);

  save(db);
}

function search(query) {
  const db = load();
  const qVec = embed(query);

  const results = [];

  for (const [file, vec] of Object.entries(db.vectors)) {
    results.push({
      file,
      score: similarity(qVec, vec)
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

module.exports = { store, search };
