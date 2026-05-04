import { runBlockerDetector } from '../agents/standup/blockerDetectorAgent.js';
import { runProgressAnalyzer } from '../agents/standup/progressAnalyzerAgent.js';
import { runMoodAnalyzer } from '../agents/standup/moodAnalyzerAgent.js';
import { runBriefingWriter } from '../agents/standup/briefingWriterAgent.js';

export const orchestrateStandup = async (updates) => {
  // Format updates into readable string
  const formattedUpdates = updates.map(u => 
    `[${u.name}] Yesterday: ${u.yesterday} | Today: ${u.today} | Blockers: ${u.blockers || 'None'}`
  ).join('\n\n');

  const agentLog = [];

  // Run three analysis agents in parallel
  const [blockerRes, progressRes, moodRes] = await Promise.all([
    runBlockerDetector(formattedUpdates),
    runProgressAnalyzer(formattedUpdates),
    runMoodAnalyzer(formattedUpdates)
  ]);

  agentLog.push({ agent: 'blockerDetectorAgent', ...blockerRes });
  agentLog.push({ agent: 'progressAnalyzerAgent', ...progressRes });
  agentLog.push({ agent: 'moodAnalyzerAgent', ...moodRes });

  // Pass analysis results to compiling agent
  const combinedData = {
    blockers: blockerRes.result,
    progress: progressRes.result,
    mood: moodRes.result
  };

  const briefingRes = await runBriefingWriter(combinedData);
  agentLog.push({ agent: 'briefingWriterAgent', ...briefingRes });

  return {
    briefing: briefingRes.result,
    blockers: blockerRes.result.blockers,
    progress: progressRes.result,
    mood: moodRes.result,
    agentLog: agentLog.map(l => ({ name: l.agent, durationMs: l.durationMs, tokensUsed: l.tokensUsed }))
  };
};
