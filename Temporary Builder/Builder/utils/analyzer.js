const fs = require("fs");
const path = require("path");

function scan(dir, list = []) {
  if (!fs.existsSync(dir)) return list;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const full = path.join(dir, file);

    if (file === "node_modules" || file === ".git") continue;

    if (fs.statSync(full).isDirectory()) {
      scan(full, list);
    } else {
      list.push(full);
    }
  }

  return list;
}

module.exports = { scan };
