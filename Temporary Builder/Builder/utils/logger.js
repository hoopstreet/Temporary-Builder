const fs = require("fs");

function logBuild(data) {
  const file = "Temporary Builder/logs/build-history.json";

  let history = [];

  if (fs.existsSync(file)) {
    try {
      history = JSON.parse(fs.readFileSync(file, "utf-8"));
    } catch {}
  }

  history.push({
    time: new Date().toISOString(),
    files: data.files?.map(f => f.path) || [],
    install: data.install || [],
    summary: "AUTO BUILD"
  });

  fs.writeFileSync(file, JSON.stringify(history, null, 2));
}

module.exports = { logBuild };
