import { callAgent } from '../../services/geminiClient.js';

const SYSTEM_PROMPT = `You are a meeting summarization expert. Read this meeting transcript and write a clear 3-sentence summary covering: what was discussed, what was decided, and the overall outcome. Return plain text only.`;

export const runSummarizer = async (transcript) => {
  return await callAgent('summarizerAgent', SYSTEM_PROMPT, transcript, false);
};
