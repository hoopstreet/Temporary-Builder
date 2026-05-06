function shouldRollback(result) {
  if (!result || !result.files) return true;

  const risky = result.files.some(f =>
    !f.path || !f.content || f.content.length < 3
  );

  return risky;
}

module.exports = { shouldRollback };
