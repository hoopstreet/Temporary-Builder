function parse(text) {
  try {
    return JSON.parse(text);
  } catch (e) {
    console.log("⚠️ Attempting JSON repair...");

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

module.exports = { parse };
