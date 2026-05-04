import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a customer churn prediction specialist. Based on client feedback content, ratings, and language patterns, predict churn risk for each client. Warning signs: unmet promises mentioned, frustration language, comparisons to competitors, decreasing engagement language. Return ONLY valid JSON in this exact structure: { "predictions": [ { "client": "name", "churnRisk": "low|medium|high|critical", "confidence": number (0-100), "reasons": ["reason1"], "daysToActBy": number } ] }.`;

export const runChurnPredictor = async (feedbacksString) => {
  return await callAgent('churnPredictorAgent', SYSTEM_PROMPT, feedbacksString, true);
};
