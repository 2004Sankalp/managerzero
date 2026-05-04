import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are an action item extraction specialist. Read this meeting transcript carefully. Extract EVERY commitment made — anything where someone says they will do something, needs to do something, or is assigned something. Return ONLY valid JSON in this structure: { "actionItems": [ { "task": "description", "owner": "person name or Unassigned", "deadline": "specific date or Soon or Not mentioned", "priority": "high|medium|low", "context": "one sentence on why this matters" } ] }.`;

export const runTaskExtractor = async (transcript) => {
  return await callAgent('taskExtractorAgent', SYSTEM_PROMPT, transcript, true);
};
