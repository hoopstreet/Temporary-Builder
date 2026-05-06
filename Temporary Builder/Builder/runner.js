const DAG = require("./dag");
const { generate } = require("./llm");
const { writeFile } = require("./writer");
const fs = require("fs");

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

(async () => {
  console.log("🚀 DAG AI START");

  const convo = read("Temporary Builder/memory/convo.md");
  const convo2 = read("Temporary Builder/memory/convo2.md");

  const dag = new DAG();

  dag.add("plan", async () => {
    return await generate("PLAN PROJECT:\n" + convo);
  });

  dag.add("build", async () => {
    return await generate("BUILD SYSTEM:\n" + convo + "\n" + convo2);
  }, ["plan"]);

  dag.add("write", async () => {
    const raw = await generate("OUTPUT JSON FILES ONLY:\n" + convo);

    let files = [];

    try {
      files = JSON.parse(raw);
    } catch {
      files = [
        { path: "output/app.js", content: "console.log('AI fallback');" }
      ];
    }

    for (const f of files) {
      writeFile(f.path, f.content);
    }

    return files;
  }, ["build"]);

  await dag.run();

  console.log("✅ DAG COMPLETE");
})();
