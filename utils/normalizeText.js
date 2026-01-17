export const normalizeText = (text = "") => {
  return text
    .toLowerCase()

    // normalize common tech terms
    .replace(/node\.js/g, "nodejs")
    .replace(/git\/github/g, "git")
    .replace(/react\.js/g, "react")
    .replace(/postgresql/g, "postgres")
    .replace(/mongo(db)?/g, "mongodb")
    .replace(/\bjs\b/g, "javascript")

    // remove punctuation
    .replace(/[^a-z0-9\s]/g, " ")

    // normalize spaces
    .replace(/\s+/g, " ")
    .trim();
};
