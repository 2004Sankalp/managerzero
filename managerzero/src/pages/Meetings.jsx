import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/api';
import ActionItem from '../components/ActionItem';
import AIResponseBox from '../components/AIResponseBox';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';

/**
 * Meetings Page
 * Analyzes unstructured transcripts to extract actions/decisions
 */
const Meetings = () => {
  const { meetingResults, setMeetingResults, role, currentUser } = useAppContext();
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isEmployee = role === 'employee';

  // Toggle a task's completed state and write back to global context (syncs to Manager via localStorage)
  const handleToggleItem = (itemId) => {
    if (!isEmployee) return; // Managers cannot mark as done
    setMeetingResults(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        actionItems: prev.actionItems.map(item =>
          item.id === itemId ? { ...item, completed: !item.completed, rejectionReason: null } : item
        )
      };
    });
  };

  // Manager can undo a completed task with a reason
  const handleManagerUndo = (itemId, reason) => {
    setMeetingResults(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        actionItems: prev.actionItems.map(item =>
          item.id === itemId
            ? { ...item, completed: false, rejectionReason: reason }
            : item
        )
      };
    });
  };

  // For employees: only show action items assigned to them
  const visibleActionItems = meetingResults?.actionItems
    ? isEmployee
      ? meetingResults.actionItems.filter(
          item => item.assignee && item.assignee.toLowerCase().includes(currentUser?.toLowerCase() || '')
        )
      : meetingResults.actionItems
    : [];

  const handleTryExample = () => {
    setTranscript(`Team meeting - Sprint 5 Planning\n\nPriya: Let's quickly align on sprint 5 priorities. Arjun, where are we with the environments?\nArjun: I'll set up staging environment today as part of the primary blocker fix.\nPriya: Thanks. I will send the design specs to the team by EOD today. Kiran, how goes the migration?\nKiran: Complete DB migration was due yesterday, I'm a bit behind, tracking to finish by tomorrow.\nPriya: Understood. Sneha, please write API documentation tomorrow so we're ready.\nArjun: I also have Demo prep for client on Friday.\nPriya: And the tech stack is final right? We'll use Vite + React 18, and postponed the analytics integration to sprint 5. We also agreed on the Tailwind CSS dark theme design system.`);
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      toast.error("Please paste a transcript to analyze.");
      return;
    }
    
    setIsAnalyzing(true);
    setMeetingResults(null); 
    
    try {
      const response = await api.analyzeMeeting(transcript);
      setMeetingResults(response.data);
      toast.success("Transcript analyzed successfully.");
    } catch (error) {
      toast.error(error.message || "AI service unavailable. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold font-sans">
          {isEmployee ? 'My Meeting Actions' : 'Meetings'}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {isEmployee
            ? 'Action items from team meetings that are assigned to you.'
            : 'Paste meeting transcripts to extract actions and decisions automatically.'}
        </p>
      </header>

      {/* Transcript Input – Manager Only */}
      {!isEmployee && <section className="bg-card border border-border rounded-xl p-6">
        <label htmlFor="transcript" className="font-medium text-gray-200 mb-4 block text-lg">Paste Meeting Transcript</label>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript or notes here... ManagerZero will extract action items, decisions, and assign owners automatically."
          className="w-full min-h-[150px] bg-background border border-border rounded-lg p-4 text-sm text-gray-300 focus:outline-none focus:border-accent font-mono mb-4 resize-y leading-relaxed"
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="bg-accent hover:bg-emerald-400 text-background font-bold py-2.5 px-6 rounded-lg transition-colors flex items-center justify-center group disabled:opacity-50"
          >
            Analyze Transcript
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </button>
          
          <button 
            onClick={handleTryExample}
            disabled={isAnalyzing}
            className="border border-border hover:border-gray-400 text-gray-300 py-2.5 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            Try Example
          </button>
        </div>
      </section>}

      {/* Bottom section: Loading & Results */}
      {isAnalyzing && (
        <div className="bg-card border border-border rounded-xl p-12">
          <LoadingSpinner message="AI is analyzing your meeting..." size="lg" />
        </div>
      )}

      {/* Employee empty state when no meeting has been analyzed yet */}
      {!meetingResults && !isAnalyzing && isEmployee && (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-bold text-black dark:text-white mb-2">No Meetings Analyzed Yet</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            Your manager hasn't analyzed any meeting transcripts yet. Once they do, your assigned action items will appear here automatically.
          </p>
        </div>
      )}

      {meetingResults && !isAnalyzing && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up">
          
          {/* Actions Column */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-lg">Action Items</h3>
              <div className="flex items-center gap-2">
                {!isEmployee && (() => {
                  const total = meetingResults.actionItems.length;
                  const done = meetingResults.actionItems.filter(i => i.completed).length;
                  return (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      done === total ? 'bg-green-500/20 text-green-400' : 'bg-accent/20 text-accent'
                    }`}>
                      {done}/{total} Done
                    </span>
                  );
                })()}
                <span className="text-xs font-semibold bg-accent/20 text-accent px-2 py-1 rounded">Extracted Tasks</span>
              </div>
            </div>
            
            <div className="flex-1 space-y-1 mb-6">
              {visibleActionItems.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-6">
                  {isEmployee
                    ? `No action items assigned to ${currentUser} in this meeting.`
                    : 'No action items found.'}
                </p>
              ) : (
                visibleActionItems.map(item => (
                  <div key={item.id}>
                    <ActionItem
                      task={item.task}
                      assignee={item.assignee}
                      due={item.due}
                      isOverdue={item.overdue}
                      completed={item.completed}
                      isManager={!isEmployee}
                      onToggle={() => handleToggleItem(item.id)}
                      onManagerUndo={(reason) => handleManagerUndo(item.id, reason)}
                    />
                    {/* Show rejection reason to employee */}
                    {isEmployee && item.rejectionReason && (
                      <div className="ml-8 mt-1 mb-2 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
                        <span className="font-bold">↩ Reopened by Manager:</span> {item.rejectionReason}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <button 
              disabled
              title="Coming soon"
              className="w-full mt-auto py-2.5 rounded-lg border border-border text-gray-500 font-medium cursor-not-allowed bg-white/5 opacity-80"
            >
              Export to Notion
            </button>
          </div>

          {/* Decisions & Summary Stack */}
          <div className="space-y-6 flex flex-col">
            
            <div className="bg-card border border-border rounded-xl p-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-lg">Risks Detected</h3>
                {meetingResults.riskLevel && (
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    meetingResults.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                    meetingResults.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {meetingResults.riskLevel.toUpperCase()} RISK
                  </span>
                )}
              </div>
              <ul className="space-y-3">
                {meetingResults.decisions.map((dec, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-300">
                    <span className="text-accent mr-3 font-bold">•</span>
                    {dec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-medium text-lg mb-4">Meeting Summary</h3>
              <AIResponseBox type="info" text={meetingResults.summary} />
            </div>

            </div>  {/* end right column */}

        </section>
      )}
    </div>
  );
};

export default Meetings;
