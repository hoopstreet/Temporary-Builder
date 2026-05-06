const fs = require("fs");

function detectBrokenWorkflows() {
  const dir = ".github/workflows";
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir).filter(file => {
    const content = fs.readFileSync(`${dir}/${file}`, "utf-8");
    return !content.includes("runs-on") || !content.includes("steps:");
  }).map(f => ({ file: f }));
}

function autoFixWorkflow(path) {
  let content = fs.readFileSync(path, "utf-8");

  if (!content.includes("permissions:")) {
    content = "permissions:\n  contents: write\n\n" + content;
  }

  if (!content.includes("actions/checkout@v4")) {
    content = content.replace("steps:", "steps:\n      - uses: actions/checkout@v4");
  }

  fs.writeFileSync(path, content);
}

module.exports = { detectBrokenWorkflows, autoFixWorkflow };
