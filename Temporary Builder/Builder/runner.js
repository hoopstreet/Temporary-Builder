const fs = require("fs");
const path = require("path");
const { runSwarm } = require("./swarm");

function writeFileSafe(filePath, content) {
  const full = path.resolve(filePath);
  const dir = path.dirname(full);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, content || "");
  console.log("✔ FILE:", filePath);
}

(async () => {
  console.log("🚀 V5 SWARM START");

  let result;

  try {
    result = await runSwarm();
  } catch (e) {
    console.log("❌ FALLBACK MODE");
    result = {
      files: [
        {
          path: "docs/fallback.md",
          content: "# SAFE MODE ACTIVE"
        }
      ]
    };
  }

  for (const file of result.files || []) {
    writeFileSafe(file.path, file.content);
  }

  console.log("✅ DONE");
})();
