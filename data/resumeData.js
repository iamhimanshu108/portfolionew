import { profile } from "./profileData.js";
import { experience } from "./experienceData.js";
import { skills } from "./skillsData.js";

export const resumeContent = {
  summary: profile.resumeSummary,
  resumeUrl: profile.resumeUrl,
  experience,
  technicalFocus: [...new Set(skills.flatMap((category) => category.items))],
};
