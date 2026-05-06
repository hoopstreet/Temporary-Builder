function clean(text) {
  return text.replace(/```/g, "").trim();
}
module.exports = { clean };
