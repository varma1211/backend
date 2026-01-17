import { extractSkills } from "./extractSkills.js";

export const calculateATSScore = (resumeText, jdText) => {
  const jdSkills = extractSkills(jdText);
  const resumeSkills = extractSkills(resumeText);

  if (jdSkills.length === 0) {
    return {
      score: 0,
      missingSkills: [],
      suggestions: [
        "Unable to detect skills from job description"
      ]
    };
  }

  const missingSkills = jdSkills.filter(
    skill => !resumeSkills.includes(skill)
  );

  const matchedCount = jdSkills.length - missingSkills.length;

  const score = Math.round(
    (matchedCount / jdSkills.length) * 100
  );

  const suggestions = missingSkills.map(skill =>
    generateSuggestion(skill)
  );

  return {
    score,
    missingSkills,
    suggestions
  };
};

const generateSuggestion = (skill) => {
  const map = {
    nodejs: "Add backend experience using Node.js",
    mongodb: "Mention MongoDB or NoSQL database usage",
    git: "Include Git or GitHub workflow experience",
    postgres: "Add experience with PostgreSQL or relational databases",
    sql: "Mention SQL or database querying skills",
    express: "Mention REST API development using Express"
  };

  return map[skill] || `Consider adding experience with ${skill}`;
};
