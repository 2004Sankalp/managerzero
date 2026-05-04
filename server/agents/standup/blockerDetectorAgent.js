import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a blocker detection specialist. You read standup updates from a software team and identify ONLY the blockers. A blocker is anything that is preventing someone from making progress — waiting on someone, missing information, technical issue, dependency not ready. Return ONLY valid JSON in this exact structure: { "blockers": [ { "person": "name", "blocker": "description", "severity": "high|medium|low", "suggestedAction": "what manager should do" } ] }. If no blockers, return { "blockers": [] }.`;

export const runBlockerDetector = async (updatesString) => {
  return await callAgent('blockerDetectorAgent', SYSTEM_PROMPT, updatesString, true);
};
