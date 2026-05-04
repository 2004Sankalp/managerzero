import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a sprint progress analyst. Read these standup updates and assess overall team progress. Return ONLY valid JSON in this exact structure: { "sprintHealthScore": number (1-10), "onTrackCount": number, "atRiskCount": number, "summary": "one sentence on sprint health", "concerns": ["concern1", "concern2"] }.`;

export const runProgressAnalyzer = async (updatesString) => {
  return await callAgent('progressAnalyzerAgent', SYSTEM_PROMPT, updatesString, true);
};
