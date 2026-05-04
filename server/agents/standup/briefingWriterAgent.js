import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are an expert management communications writer. You receive structured data from three analysis agents (blockers, progress, mood) and write a concise manager briefing. Write in direct, professional paragraph form — no bullet points. Max 5 sentences. End with one specific recommendation for what the manager should do first today. Return plain text only, no JSON.`;

export const runBriefingWriter = async (combinedJsonData) => {
  return await callAgent('briefingWriterAgent', SYSTEM_PROMPT, JSON.stringify(combinedJsonData, null, 2), false);
};
