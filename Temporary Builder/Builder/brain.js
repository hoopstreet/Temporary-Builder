const fs = require("fs");

function read(path) {
  return fs.existsSync(path)
    ? fs.readFileSync(path, "utf-8")
    : "";
}

async function runBrain() {
  const entry = read("Temporary Builder/memory/convo.md");
  const final = read("Temporary Builder/memory/convo2.md");

  return {
    files: [
      {
        path: "README.md",
        content: `# 🚀 PROJECT OUTPUT\n\n## ENTRY\n${entry}`
      },
      {
        path: "docs/project.md",
        content: `# FINAL SPEC\n\n${final}`
      },
      {
        path: "docs/system-status.md",
        content: `# SYSTEM STATUS\n\n✔ Stable Build Engine Active`
      }
    ]
  };
}

module.exports = { runBrain };
