/**
 * Mock API Service
 * Simulates backend responses with an artificial delay.
 */

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  /**
   * Summarizes standup updates.
   * @param {Array} updates - list of standup submissions
   * @returns {Promise<Object>} Mock summary
   */
  summarizeStandup: async (updates) => {
    await delay(1500);
    // Simulate failing if no updates
    if (!updates || updates.length === 0) {
      throw new Error("No updates to summarize. Please try again.");
    }
    const blockerCount = updates.filter(u => u.blockers).length;
    return {
      data: {
        summary: `${blockerCount} blockers flagged today. AI recommends following up on blockers soon to keep the sprint on track. All other team members are proceeding as planned.`,
      }
    };
  },

  /**
   * Analyzes meeting transcript using the real Gemini-powered backend.
   * @param {string} transcript - Meeting text
   * @returns {Promise<Object>} Extracted metadata from AI
   */
  analyzeMeeting: async (transcript) => {
    const response = await fetch('http://localhost:5000/api/meeting/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `Server error: ${response.status}`);
    }

    const data = await response.json();

    // Normalize backend shape → frontend shape expected by Meetings.jsx
    return {
      data: {
        actionItems: (data.actionItems || []).map((item, idx) => ({
          id: item.id ?? idx + 1,
          task: item.task || item.description || '',
          assignee: item.owner || item.assignee || 'Unassigned',
          due: item.due || item.deadline || 'TBD',
          completed: item.completed ?? false,
          overdue: item.overdue ?? false,
        })),
        // Backend returns `risks` array — display as "decisions/risks" column
        decisions: (data.risks || []).map(r =>
          typeof r === 'string' ? r : r.description || r.risk || JSON.stringify(r)
        ),
        riskLevel: data.overallRiskLevel || null,
        emailDraft: data.emailDraft || null,
        summary: typeof data.summary === 'string'
          ? data.summary
          : data.summary?.summary || data.summary?.text || JSON.stringify(data.summary),
      }
    };
  },

  /**
   * Analyzes feedback payload for insights.
   * @param {Array} feedbacks - List of feedback items
   * @returns {Promise<Object>} AI insights
   */
  analyzeFeedback: async (feedbacks) => {
    await delay(1800);
    if (!feedbacks || feedbacks.length === 0) {
      throw new Error("No feedback data available for analysis.");
    }
    return {
      data: {
        insights: "Overall sentiment is positive, but there are multiple mentions of delayed deliverable timelines. 2 clients require immediate follow-up to address their concerns regarding sprint planning."
      }
    };
  }
};
