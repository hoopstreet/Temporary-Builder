const fs = require("fs");
const { search } = require("./vector-memory");

function detectDuplicates(files = []) {
  const map = {};
  const duplicates = [];

  for (const f of files) {
    const key = f.content?.slice(0, 200);

    if (map[key]) {
      duplicates.push({
        original: map[key],
        duplicate: f.path
      });
    } else {
      map[key] = f.path;
    }
  }

  return duplicates;
}

function suggestRefactors(files = []) {
  const suggestions = [];

  for (const f of files) {
    const related = search(f.path + " " + (f.content || "").slice(0, 100));

    if (related.length > 0 && related[0].score > 0.8) {
      suggestions.push({
        file: f.path,
        suggestion: "Possible overlap with: " + related[0].file
      });
    }
  }

  return suggestions;
}

function autoRefactor(files = []) {
  const duplicates = detectDuplicates(files);
  const suggestions = suggestRefactors(files);

  return {
    duplicates,
    suggestions,
    cleanedFiles: files.filter((f, i) => {
      return !duplicates.find(d => d.duplicate === f.path);
    })
  };
}

module.exports = { autoRefactor };
