import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a project risk analyst. Read this meeting transcript and identify risks, concerns, unresolved conflicts, vague commitments, and anything that could cause problems. Return ONLY valid JSON in this exact structure: { "risks": [ { "description": "risk description", "type": "timeline|resource|technical|communication|dependency", "severity": "high|medium|low", "recommendation": "what to do about it" } ], "overallRiskLevel": "low|medium|high" }.`;

export const runRiskDetector = async (transcript) => {
  return await callAgent('riskDetectorAgent', SYSTEM_PROMPT, transcript, true);
};
