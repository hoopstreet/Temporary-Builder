const fs = require("fs");

const INDEX_PATH = "Temporary Builder/memory/repo-index.json";

function loadIndex() {
  if (!fs.existsSync(INDEX_PATH)) {
    return { files: {}, lastBuild: null, hashes: {} };
  }
  return JSON.parse(fs.readFileSync(INDEX_PATH, "utf-8"));
}

function saveIndex(index) {
  fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2));
}

function hash(content) {
  return require("crypto")
    .createHash("sha256")
    .update(content || "")
    .digest("hex");
}

function writeFiles(files) {
  if (!files) return;

  const index = loadIndex();

  files.forEach(file => {
    const newHash = hash(file.content);
    const oldHash = index.hashes[file.path];

    // 🔥 SKIP if unchanged (prevents duplicate writes)
    if (oldHash && oldHash === newHash) {
      console.log("⏭ Skipped (no change):", file.path);
      return;
    }

    const dir = file.path.split("/").slice(0, -1).join("/");
    if (dir) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(file.path, file.content);
    console.log("✔ Wrote:", file.path);

    index.hashes[file.path] = newHash;
    index.files[file.path] = {
      updated: new Date().toISOString()
    };
  });

  index.lastBuild = new Date().toISOString();
  saveIndex(index);
}

module.exports = { writeFiles };
