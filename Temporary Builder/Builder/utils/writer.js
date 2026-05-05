const fs = require("fs");

function writeFiles(files) {
  if (!files) return;

  files.forEach(file => {
    const dir = file.path.split("/").slice(0, -1).join("/");
    if (dir) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(file.path, file.content);
    console.log("✔ Wrote:", file.path);
  });
}

module.exports = { writeFiles };
