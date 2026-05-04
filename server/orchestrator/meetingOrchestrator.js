import { runSummarizer } from '../agents/meeting/summarizerAgent.js';
import { runTaskExtractor } from '../agents/meeting/taskExtractorAgent.js';
import { runRiskDetector } from '../agents/meeting/riskDetectorAgent.js';
import { runEmailDrafter } from '../agents/meeting/emailDrafterAgent.js';

export const orchestrateMeeting = async (transcript) => {
  const agentLog = [];

  // Run 3 analysis agents in parallel
  const [summaryRes, tasksRes, risksRes] = await Promise.all([
    runSummarizer(transcript),
    runTaskExtractor(transcript),
    runRiskDetector(transcript)
  ]);

  agentLog.push({ agent: 'summarizerAgent', ...summaryRes });
  agentLog.push({ agent: 'taskExtractorAgent', ...tasksRes });
  agentLog.push({ agent: 'riskDetectorAgent', ...risksRes });

  // Pass results to email compiling agent
  const combinedData = {
    summary: summaryRes.result,
    actionItems: tasksRes.result,
    risks: risksRes.result
  };

  const emailRes = await runEmailDrafter(combinedData);
  agentLog.push({ agent: 'emailDrafterAgent', ...emailRes });

  return {
    summary: summaryRes.result,
    actionItems: tasksRes.result.actionItems,
    risks: risksRes.result.risks,
    overallRiskLevel: risksRes.result.overallRiskLevel,
    emailDraft: emailRes.result,
    agentLog: agentLog.map(l => ({ name: l.agent, durationMs: l.durationMs, tokensUsed: l.tokensUsed }))
  };
};
