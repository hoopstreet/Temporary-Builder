const { runAI } = require("./brain");
const { writeFiles } = require("./utils/writer");
const { autoRefactor } = require("./utils/refactor-engine");
const { store } = require("./utils/vector-memory");
const fs = require("fs");
const { execSync } = require("child_process");

(async () => {
  console.log("🚀 TEMP BUILDER v3 (REFRACTOR + VECTOR MEMORY)");

  try {
    const result = await runAI();

    if (!result) throw new Error("AI failed");

    const files = result.files || [];

    // 🧠 STORE INTO VECTOR MEMORY
    for (const f of files) {
      store(f.path, f.content);
    }

    // 🧠 AUTO REFACTOR STEP
    const refactored = autoRefactor(files);

    // WRITE CLEANED FILES ONLY
    writeFiles(refactored.cleanedFiles);

    // LOG RAW
    fs.writeFileSync(
      "Temporary Builder/docs/raw.txt",
      JSON.stringify({
        original: files.length,
        cleaned: refactored.cleanedFiles.length,
        duplicates: refactored.duplicates,
        suggestions: refactored.suggestions
      }, null, 2)
    );

    // GIT SYNC
    execSync("git config user.name 'TEMP-AI'");
    execSync("git config user.email 'ai@bot.local'");

    execSync("git add .");

    const changes = execSync("git status --porcelain").toString();
    if (!changes) return;

    execSync("git commit -m '🧠 refactor + vector memory update'");
    execSync("git pull --rebase origin main || true");
    execSync("git push origin main || true");

    console.log("✅ v3 COMPLETE");
  } catch (e) {
    console.log("❌ ERROR:", e.message);
  }
})();
