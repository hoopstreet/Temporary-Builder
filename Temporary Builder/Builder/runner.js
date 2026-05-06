const fs = require("fs");
const { runBrain } = require("./brain");
const { execSync } = require("child_process");

function run(cmd) {
  try {
    return execSync(cmd, { stdio: "inherit" });
  } catch (e) {
    console.log("⚠️ SKIP:", cmd);
  }
}

function write(path, content) {
  const dir = path.split("/").slice(0, -1).join("/");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path, content || "");
  console.log("✔", path);
}

(async () => {
  console.log("🚀 SAFE BRAIN START");

  let result = await runBrain();

  if (!result || !result.files) {
    console.log("❌ fallback mode");
    result = {
      files: [
        {
          path: "docs/fallback.md",
          content: "Safe fallback output"
        }
      ]
    };
  }

  for (const f of result.files) {
    write(f.path, f.content);
  }

  // credentials doc auto-create
  write(
    "docs/tools-credentials.md",
`# 🔐 CREDENTIALS GUIDE

## GitHub
- GITHUB_TOKEN (auto)

## AI
- OPENROUTER_API_KEY → GitHub Secrets

## Hosting
- NF_TOKEN (Northflank)
- RENDER_API_KEY
- RAILWAY_TOKEN

⚠️ Never hardcode secrets
`
  );

  // SAFE GIT FLOW
  run("git add .");

  const status = execSync("git status --porcelain").toString();

  if (!status) {
    console.log("✅ NO CHANGES");
    return;
  }

  run("git commit -m '🧠 SAFE AUTO BUILD'");
  run("git pull --no-rebase origin main || true");
  run("git push origin main || true");

  console.log("✅ DONE");
})();
