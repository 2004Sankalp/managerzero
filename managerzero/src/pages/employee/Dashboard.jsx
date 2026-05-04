import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Send, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function EmployeeDashboard() {
  const { currentUser, tasks, setTasks, standupUpdates, setStandupUpdates } = useAppContext();
  const [standupForm, setStandupForm] = useState({ yesterday: '', today: '', blockers: '' });
  const [activeTaskComment, setActiveTaskComment] = useState({ id: null, text: '' });

  const myTasks = tasks.filter(t => t.assignee === currentUser);
  const myStandups = standupUpdates.filter(u => u.name === currentUser);

  const handleProgressUpdate = (id, newProgress) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        let status = 'in-progress';
        if (newProgress === 100) status = 'done';
        if (newProgress === 0) status = 'todo';
        return { ...t, progress: newProgress, status };
      }
      return t;
    }));
  };

  const handleCommentSubmit = (id) => {
    if (!activeTaskComment.text.trim()) return;
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, comment: activeTaskComment.text } : t
    ));
    setActiveTaskComment({ id: null, text: '' });
  };

  const handleStandupSubmit = (e) => {
    e.preventDefault();
    setStandupUpdates(prev => [
      ...prev.filter(u => u.name !== currentUser),
      { name: currentUser, ...standupForm }
    ]);
    toast.success('Standup submitted successfully!');
    setStandupForm({ yesterday: '', today: '', blockers: '' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in text-black dark:text-white">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Welcome back, {currentUser}</h1>
          <p className="text-gray-500 dark:text-brand-secondary mt-2">Here's your task breakdown for the current sprint.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Tasks */}
        <div className="lg:col-span-2 space-y-6">

          {/* Manager Feedback Module */}
          {myStandups.some(s => s.managerReply) && (
            <section className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-500/30 rounded-3xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2 uppercase tracking-wide">
                <MessageSquare className="w-4 h-4" /> Feedback from Manager
              </h2>
              <div className="space-y-3">
                {myStandups.filter(s => s.managerReply).map((s, idx) => (
                  <div key={idx} className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/40">
                    <p className="text-gray-800 dark:text-gray-200 font-medium whitespace-pre-wrap">{s.managerReply}</p>
                    <div className="mt-2 text-xs text-amber-600 dark:text-amber-500 font-bold opacity-70">
                      In response to your blocker: "{s.blockers}"
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle2 className="w-5 h-5"/> My Action Items</h2>

            {myTasks.length === 0 ? (
               <div className="p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed rounded-xl border-gray-300 dark:border-gray-700">
                 No tasks currently assigned to you for this sprint.
               </div>
            ) : (
              <div className="space-y-4">
                {myTasks.map(task => (
                  <div key={task.id} className="p-5 border border-gray-100 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-black/20">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{task.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-wider ${
                          task.status === 'done' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          task.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-white'
                        }`}>{task.status}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium mb-1">{task.progress}% Complete</div>
                        <input
                          type="range"
                          min="0" max="100" step="10"
                          value={task.progress}
                          onChange={(e) => handleProgressUpdate(task.id, parseInt(e.target.value))}
                          className="w-32 accent-brand-secondary"
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/5">
                      {task.comment ? (
                        <div className="flex items-start gap-2 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-900/30">
                          <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-bold block mb-1">To Manager:</span>
                            {task.comment}
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a blocker note or comment for the manager..."
                            value={activeTaskComment.id === task.id ? activeTaskComment.text : ''}
                            onChange={(e) => setActiveTaskComment({ id: task.id, text: e.target.value })}
                            className="flex-1 bg-white dark:bg-black border border-gray-300 dark:border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-secondary text-black dark:text-white"
                          />
                          <button
                            onClick={() => handleCommentSubmit(task.id)}
                            className="p-2 bg-[#0A0A0F] dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Standup */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-3xl p-8 shadow-sm h-full">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Clock className="w-5 h-5"/> Submit Standup</h2>
            <form onSubmit={handleStandupSubmit} className="flex flex-col gap-5 h-[calc(100%-3rem)]">

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-brand-secondary">What did you do yesterday?</label>
                <textarea
                  required
                  value={standupForm.yesterday}
                  onChange={(e) => setStandupForm({...standupForm, yesterday: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-xl p-3 min-h-[80px] text-sm focus:outline-none focus:ring-1 focus:ring-brand-secondary text-black dark:text-white resize-none"
                  placeholder="e.g. Finished the API integration for billing"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-brand-secondary">What are you working on today?</label>
                <textarea
                  required
                  value={standupForm.today}
                  onChange={(e) => setStandupForm({...standupForm, today: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-xl p-3 min-h-[80px] text-sm focus:outline-none focus:ring-1 focus:ring-brand-secondary text-black dark:text-white resize-none"
                  placeholder="e.g. Updating the React cache to fix stale state"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-brand-secondary">Do you have any blockers?</label>
                <textarea
                  value={standupForm.blockers}
                  onChange={(e) => setStandupForm({...standupForm, blockers: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-xl p-3 min-h-[80px] text-sm focus:outline-none focus:ring-1 focus:ring-brand-secondary text-black dark:text-white resize-none"
                  placeholder="e.g. Still waiting on AWS permissions from DevOps"
                />
              </div>

              <button type="submit" className="mt-auto py-3 bg-[#0A0A0F] dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
                Push Update to Manager
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
