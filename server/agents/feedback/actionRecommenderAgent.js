import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a client success strategist. Based on sentiment analysis, churn predictions, and themes provided, generate specific, actionable recommendations for the manager. Be direct and specific — not generic advice. Return ONLY valid JSON in this exact structure: { "immediateActions": [ { "action": "specific action", "client": "client name or All", "urgency": "today|this week|this sprint", "expectedOutcome": "what this will achieve" } ], "strategicRecommendations": ["recommendation1", "recommendation2"] }.`;

export const runActionRecommender = async (combinedJsonData) => {
  return await callAgent('actionRecommenderAgent', SYSTEM_PROMPT, JSON.stringify(combinedJsonData, null, 2), true);
};
