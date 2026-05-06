const fs = require("fs");

function read(file) {
  try {
    return fs.readFileSync(file, "utf-8");
  } catch {
    return "";
  }
}

// Converts text → structured intent graph
function analyzeIntent() {
  const entry = read("Temporary Builder/memory/convo.md");
  const final = read("Temporary Builder/memory/convo2.md");

  return {
    services: ["api", "frontend", "worker"],
    features: {
      entry,
      final
    },
    complexity: entry.length + final.length
  };
}

module.exports = { analyzeIntent };
