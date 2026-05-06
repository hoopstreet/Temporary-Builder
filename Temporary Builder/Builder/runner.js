const { runAI } = require("./brain");
const { writeFiles } = require("./utils/writer");
const { logBuild } = require("./utils/logger");
const { analyzeLogs } = require("./utils/analyzer");
const { detectBrokenWorkflows, autoFixWorkflow } = require("./utils/workflow-repair");
const fs = require("fs");
const { execSync } = require("child_process");

function safeExec(cmd) {
  try {
    execSync(cmd, { stdio: "inherit" });
  } catch (e) {
    console.log("⚠️ Failed:", cmd);
  }
}

(async () => {
  console.log("🚀 TEMP BUILDER START");

  const result = await runAI();

  if (!result || !result.files) {
    console.log("❌ AI FAILED");
    process.exit(1);
  }

  // WRITE FILES TO ROOT
  writeFiles(result.files);

  // SAVE RAW OUTPUT
  fs.writeFileSync(
    "Temporary Builder/docs/raw.txt",
    JSON.stringify(result, null, 2)
  );

  // BUILD SUMMARY
  const summary = `
# 🧠 AI BUILD RESULTS

## 📦 Files Generated
${result.files.map(f => "- " + f.path).join("\n")}

## 📌 Dependencies
${(result.install || []).join(", ")}

## ⚙️ Mode
SELF-HEAL ENABLED
`;

  fs.writeFileSync("Temporary Builder/docs/results.md", summary);

  // LOG HISTORY
  logBuild(result);

  // 🧠 ANALYZE SYSTEM
  const report = analyzeLogs();
  if (report) {
    fs.writeFileSync(
      "Temporary Builder/memory/repo-index.json",
      JSON.stringify(report, null, 2)
    );
  }

  // 🛠 WORKFLOW AUTO FIX
  const broken = detectBrokenWorkflows();
  if (broken.length) {
    console.log("⚠️ Fixing workflows...");
    broken.forEach(b => {
      autoFixWorkflow(".github/workflows/" + b.file);
    });
  }

  // GIT AUTO SYNC
  safeExec("git config user.name 'AI-BOT'");
  safeExec("git config user.email 'ai@bot.local'");
  safeExec("git add .");

  const changed = execSync("git status --porcelain").toString();

  if (!changed) {
    console.log("✅ No changes");
    return;
  }

  try {
    safeExec("git commit -m '🧠 AUTO SELF-HEAL BUILD'");
    safeExec("git pull --rebase origin main || true");
    safeExec("git push origin main || true");
  } catch (e) {
    console.log("⚠️ Git failed → rollback");
    safeExec("git reset --hard HEAD~1");
  }

  console.log("✅ COMPLETE");
})();
