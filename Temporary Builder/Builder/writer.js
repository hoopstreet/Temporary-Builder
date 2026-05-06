const fs = require("fs");
const path = require("path");

function writeFile(filePath, content) {
  if (!filePath) return;
  if (filePath.includes("Temporary Builder")) return;

  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  fs.writeFileSync(filePath, content);
  console.log("✔ written:", filePath);
}

module.exports = { writeFile };
