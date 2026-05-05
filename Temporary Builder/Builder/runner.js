const { runAI } = require("./brain");
const { writeFiles } = require("./utils/writer");
const { execSync } = require("child_process");
const fs = require("fs");

(async () => {
  console.log("🚀 Running Temporary Builder...");

  const result = await runAI();

  if (!result) {
    console.log("❌ AI failed");
    return;
  }

  // INSTALL
  if (result.install?.length) {
    execSync("npm install " + result.install.join(" "), { stdio: "inherit" });
  }

  // WRITE FILES TO ROOT
  writeFiles(result.files);

  // GENERATE RESULTS.md
  const summary = `
# AI BUILD RESULTS

## Files Generated:
${result.files.map(f => "- " + f.path).join("\n")}

## Dependencies:
${(result.install || []).join(", ")}
`;

  fs.writeFileSync("Temporary Builder/docs/results.md", summary);

  // GIT SAFE COMMIT
  execSync("git config user.name 'AI-BOT'");
  execSync("git config user.email 'ai@bot.local'");

  execSync("git add .");

  const changed = execSync("git status --porcelain").toString();
  if (!changed) {
    console.log("No changes.");
    return;
  }

  execSync("git commit -m '🤖 AI Build Update' || true");
  execSync("git pull --rebase origin main || true");
  execSync("git push origin main || true");

  console.log("✅ Build complete");
})();
