function clean(text) {
  if (!text) return "";

  text = text.replace(/```json/g, "");
  text = text.replace(/```/g, "");
  text = text.trim();

  return text;
}

module.exports = { clean };
