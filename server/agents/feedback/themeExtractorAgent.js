import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a qualitative research analyst. Read all client feedback and identify common themes, recurring complaints, and patterns across clients. Return ONLY valid JSON in this exact structure: { "themes": [ { "theme": "theme name", "frequency": number, "sentiment": "positive|negative|mixed", "clients": ["client names"], "description": "brief explanation" } ], "topComplaint": "most common complaint or null", "topPraise": "most common praise or null" }.`;

export const runThemeExtractor = async (feedbacksString) => {
  return await callAgent('themeExtractorAgent', SYSTEM_PROMPT, feedbacksString, true);
};
