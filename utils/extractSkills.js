import { SKILLS } from "./skills.js";
import { normalizeText } from "./normalizeText.js";

export const extractSkills = (text) => {
  const normalized = normalizeText(text);
  const foundSkills = new Set();

  for (const skill of SKILLS) {
    const pattern = new RegExp(`\\b${skill}\\b`, "i");
    if (pattern.test(normalized)) {
      foundSkills.add(skill);
    }
  }

  return Array.from(foundSkills);
};
