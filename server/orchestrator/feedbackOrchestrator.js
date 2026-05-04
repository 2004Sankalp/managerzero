import { callAgent } from '../services/geminiClient.js';

export const orchestrateFeedback = async (feedbacks) => {
  const formattedFeedbacks = feedbacks.map(f =>
    `[Client: ${f.client}] Rating: ${f.rating}/5 | Feedback: "${f.text}"`
  ).join('\n\n');

  const SYSTEM_PROMPT = `
You are an expert Engineering Chief of Staff. I will provide you with feedback from multiple clients regarding our sprint delivery.
Analyze this feedback collectively and write a succinct, actionable report for the engineering manager.

Format the output in clean Markdown. Include:
1. **TL;DR** (Provide exactly ONE simple, highly understandable sentence that summarizes the overall client sentiment and health of the sprint).
2. **Key Themes & Takeaways** (what went well, what went wrong)
3. **Recommended Action Plan** (brief bullet points on what the manager should address immediately)

Keep it modern, concise, and highly professional. Do not use generic pleasantries, jump straight into the analysis.
  `.trim();

  // Make a single call to Gemini asking for simple Markdown text
  const res = await callAgent('masterFeedbackAnalyzer', SYSTEM_PROMPT, formattedFeedbacks, false);

  // Return the insights text which the frontend AIResponseBox expects
  return {
    insights: res.result || "Analysis completed, but no insights were returned.",
    agentLog: [{ name: 'masterFeedbackAnalyzer', durationMs: res.durationMs, tokensUsed: res.tokensUsed }]
  };
};
