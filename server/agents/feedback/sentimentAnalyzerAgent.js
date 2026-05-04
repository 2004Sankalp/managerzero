import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a client sentiment analysis specialist. Analyze each piece of client feedback and score the sentiment precisely. Return ONLY valid JSON in this exact structure: { "analyses": [ { "client": "name", "sentimentScore": number (-1.0 to 1.0), "label": "very positive|positive|neutral|negative|very negative", "keyPhrases": ["phrase1", "phrase2"], "emotionalSignals": ["signal1"] } ] }.`;

export const runSentimentAnalyzer = async (feedbacksString) => {
  return await callAgent('sentimentAnalyzerAgent', SYSTEM_PROMPT, feedbacksString, true);
};
