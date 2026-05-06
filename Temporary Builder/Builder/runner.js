const { runAI } = require("./brain");
const { writeFiles } = require("./utils/writer");
const { execSync } = require("child_process");
const fs = require("fs");
const { logBuild } = require("./utils/logger");
const { scan } = require("./utils/analyzer");

(async () => {
  console.log("🚀 FULL TEMP BUILDER RUN");

  const result = await runAI();
  if (!result) return;

  // 🧠 FULL REPO SCAN
  const repoFiles = scan(".");

  // 💾 WRITE GENERATED FILES
  writeFiles(result.files);

  // 📦 RAW OUTPUT
  fs.writeFileSync(
    "Temporary Builder/docs/raw.txt",
    JSON.stringify(result, null, 2)
  );

  // 📊 FULL RESULTS REPORT (FIXED)
  const report = `
# 🧠 AI-REMOTE FULL SYSTEM REPORT

## 📦 GENERATED FILES (THIS RUN)
${result.files?.map(f => "- " + f.path).join("\n")}

## 📁 REPOSITORY SNAPSHOT
${repoFiles.slice(0, 200).map(f => "- " + f).join("\n")}

## ⚙️ INSTALL
${(result.install || []).join(", ")}

---

## 🔥 SYSTEM RULES
- Only Temporary Builder generates files
- convo.md = GitHub Actions logic
- convo2.md = Telegram system logic
- Output must always be production-ready code

---

## ⚠️ ISSUES DETECTED
${repoFiles.includes("src/agent/brain.js") ? "- Legacy agent still exists (REMOVE REQUIRED)" : "- Clean"}

---

## 🔑 CREDENTIAL NOTES
If credentials required:
- NEVER hardcode
- Use GitHub Actions Secrets:
  - OPENROUTER_API_KEY
  - SUPABASE_SERVICE_ROLE_KEY
  - TG_BOT_TOKEN
`;

  fs.writeFileSync("Temporary Builder/docs/results.md", report);

  logBuild(result);

  execSync("git config user.name 'AI-BOT'");
  execSync("git config user.email 'ai@bot.local'");

  execSync("git add .");

  const changed = execSync("git status --porcelain").toString();
  if (!changed) return;

  execSync("git commit -m '🧠 FULL AUTO SYSTEM BUILD + REPO ANALYSIS' || true");
  execSync("git pull --rebase origin main || true");
  execSync("git push origin main || true");

  console.log("✅ FULL SYSTEM COMPLETE");
})();
