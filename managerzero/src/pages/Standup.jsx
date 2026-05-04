import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';
import Avatar from '../components/Avatar';
import AIResponseBox from '../components/AIResponseBox';
import { Sparkles, Send } from 'lucide-react';

export default function Standup() {
  const { standupUpdates, setStandupUpdates } = useAppContext();
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  // Per-update reply text and AI loading state
  const [replies, setReplies] = useState({});
  const [aiSuggestionState, setAiSuggestionState] = useState({});

  const handleReplyChange = (index, text) => {
    setReplies(prev => ({ ...prev, [index]: text }));
  };

  const handleSendReply = (index, name) => {
    const text = (replies[index] || '').trim();
    if (!text) {
      toast.error('Please type a reply before sending.');
      return;
    }

    // Write the reply into the shared (localStorage-backed) context
    setStandupUpdates(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], managerReply: text };
      return updated;
    });

    toast.success(`Reply sent to ${name}`);
    setReplies(prev => ({ ...prev, [index]: '' }));
  };

  const handleGenerateSuggestion = (index, blockerText) => {
    setAiSuggestionState(prev => ({ ...prev, [index]: 'loading' }));

    setTimeout(() => {
      const lower = blockerText.toLowerCase();
      const isDevOps = lower.includes('aws') || lower.includes('devops') || lower.includes('cloud');
      const suggestion = isDevOps
        ? "I will escalate this to the DevOps lead right now. Move onto other tasks so you aren't stuck waiting."
        : "Let's jump on a quick 5-min huddle after standup to unblock you on this.";

      setReplies(prev => ({ ...prev, [index]: suggestion }));
      setAiSuggestionState(prev => ({ ...prev, [index]: 'idle' }));
    }, 1500);
  };

  const handleGenerateBriefing = async () => {
    if (standupUpdates.length === 0) {
      toast.error('No updates to summarize. Please submit one first.');
      return;
    }
    setIsSummarizing(true);
    setAiSummary('');
    try {
      const response = await api.summarizeStandup(standupUpdates);
      setAiSummary(response.data.summary);
    } catch (error) {
      toast.error(error.message || 'AI service unavailable. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const unresolvedCount = standupUpdates.filter(
    u => u.blockers && u.blockers.trim().length > 4 && !u.managerReply
  ).length;

  return (
    <div className="space-y-6 text-black dark:text-white">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Team Standup Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Review daily submissions, unblock engineers, and generate aggregate briefings.
          </p>
        </div>

        {!aiSummary && !isSummarizing && (
          <button
            onClick={handleGenerateBriefing}
            className="border-2 border-accent text-accent hover:bg-accent hover:text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" /> Generate AI Briefing
          </button>
        )}
      </header>

      {/* Global AI Briefing */}
      {isSummarizing && <AIResponseBox type="info" isTyping={true} />}
      {aiSummary && !isSummarizing && (
        <div className="relative animate-fade-in group">
          <AIResponseBox type="info" text={aiSummary} />
          <button
            onClick={() => setAiSummary('')}
            className="absolute top-2 right-2 text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Submissions Timeline */}
      <section className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
          Submissions Timeline
          <span className="bg-gray-100 dark:bg-white/10 text-xs px-2 py-1 rounded-full font-mono">
            {standupUpdates.length}
          </span>
        </h2>

        {unresolvedCount > 0 && (
          <div className="bg-red-50 text-red-600 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 dark:text-red-400 px-4 py-3 rounded-lg text-sm mb-6 font-bold">
            🚨 {unresolvedCount} unresolved blocker{unresolvedCount > 1 ? 's' : ''} reported today
          </div>
        )}

        <div className="space-y-6">
          {standupUpdates.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No standup updates submitted yet today.
              </p>
            </div>
          ) : (
            standupUpdates.map((update, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl p-5"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar name={update.name} size="sm" />
                  <span className="font-bold text-lg">{update.name}</span>
                </div>

                <div className="space-y-4 text-sm pl-4 ml-[18px] border-l-2 border-gray-200 dark:border-white/10">
                  <div>
                    <span className="text-brand-secondary text-xs uppercase tracking-wider font-bold block mb-1">Yesterday</span>
                    <p className="text-gray-700 dark:text-gray-300">{update.yesterday}</p>
                  </div>
                  <div>
                    <span className="text-brand-secondary text-xs uppercase tracking-wider font-bold block mb-1">Today</span>
                    <p className="text-gray-700 dark:text-gray-300">{update.today}</p>
                  </div>

                  {update.blockers && update.blockers.trim().length > 4 && (
                    <div className="bg-red-50 dark:bg-red-500/10 p-3 rounded-xl border border-red-100 dark:border-red-500/20 mt-4">
                      <span className="text-red-500 dark:text-red-400 text-xs font-bold uppercase tracking-wider block mb-2">
                        Blocker Identified
                      </span>
                      <p className="text-red-700 dark:text-red-300 font-medium">{update.blockers}</p>

                      <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-500/20">
                        {update.managerReply ? (
                          <div className="flex bg-white/60 dark:bg-black/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                            <div className="flex-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400 font-bold block mb-1">
                                Resolved Reply:
                              </span>
                              <p className="text-gray-800 dark:text-gray-200 font-medium">
                                {update.managerReply}
                              </p>
                            </div>
                            <div className="flex items-center px-3 text-green-600 dark:text-green-500 text-xs font-bold whitespace-nowrap">
                              ✓ Actioned
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              id={`reply-${i}`}
                              name={`reply-${i}`}
                              placeholder="Type a reply to unblock..."
                              value={replies[i] || ''}
                              onChange={e => handleReplyChange(i, e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') handleSendReply(i, update.name); }}
                              className="flex-1 bg-white dark:bg-black text-black dark:text-white border border-red-200 dark:border-red-500/30 rounded-lg px-4 py-2 focus:outline-none focus:border-red-400 text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleGenerateSuggestion(i, update.blockers)}
                              disabled={aiSuggestionState[i] === 'loading'}
                              className="px-3 bg-gray-100 dark:bg-white/10 text-black dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center gap-2 text-sm font-bold disabled:opacity-50"
                            >
                              {aiSuggestionState[i] === 'loading' ? (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-400 border-t-black dark:border-t-white animate-spin" />
                              ) : (
                                <Sparkles className="w-4 h-4" />
                              )}
                              AI
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendReply(i, update.name)}
                              className="px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2 font-bold text-sm"
                            >
                              <Send className="w-4 h-4" /> Send
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
