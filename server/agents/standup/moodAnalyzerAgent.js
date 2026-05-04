import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a team sentiment analyst. Read these standup updates and detect emotional signals — stress, frustration, disengagement, enthusiasm. Return ONLY valid JSON in this exact structure: { "overallMood": "positive|neutral|concerning", "individuals": [ { "name": "name", "moodSignal": "brief description" } ], "flag": true|false, "flagReason": "reason if flag is true or null" }.`;

export const runMoodAnalyzer = async (updatesString) => {
  return await callAgent('moodAnalyzerAgent', SYSTEM_PROMPT, updatesString, true);
};
