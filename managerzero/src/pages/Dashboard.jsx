import React, { useState } from 'react';
import MetricCard from '../components/MetricCard';
import Avatar from '../components/Avatar';
import AIResponseBox from '../components/AIResponseBox';
import ActionItem from '../components/ActionItem';
import FeedbackCard from '../components/FeedbackCard';
import { Sparkles, BrainCircuit } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [allocationAIState, setAllocationAIState] = useState('idle'); // idle | loading | simulated
  
  // Bring in the live contextual Mock DB
  const { standupUpdates, tasks, teamMembers } = useAppContext();

  const metricCards = [
    { title: "Team Updates", value: `${standupUpdates.length}/${teamMembers.length}`, subtitle: "Received today" },
    { title: "Open Actions", value: tasks.filter(t => t.status !== 'done').length, subtitle: "Sprint pipeline" },
    { title: "Avg Feedback", value: "4.2★", subtitle: "3 responses" },
    { title: "Blockers", value: standupUpdates.filter(u => u.blockers && u.blockers.trim().length > 4).length, subtitle: "Needs attention", valueColor: "text-red-500" },
  ];

  const feedbacks = [
    { client: "TechNova", project: "Dashboard V2", sprint: "Sprint 4", rating: 5, text: "Excellent delivery, loving the new features.", date: "Today" },
    { client: "Redwood", project: "E-Commerce", sprint: "Sprint 4", rating: 4, text: "Good progress, minor bugs found during QA.", date: "Yesterday" },
    { client: "Orion Retail", project: "Mobile App", sprint: "Sprint 4", rating: 3, text: "Disappointed with the pace. Many broken promises.", date: "Mon, Oct 12" },
  ];

  const runResourceAI = (selectedName) => {
    setAllocationAIState('loading');
    setTimeout(() => {
      setAllocationAIState(`simulated:${selectedName}`);
    }, 2000);
  };

  return (
    <div className="space-y-8 text-black dark:text-white">
      <header className="mb-8">
        <h1 className="text-3xl font-display font-bold">Engineering Manager Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Live synchronization with employee workloads and AI telemetry.</p>
      </header>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((mc, i) => (
          <MetricCard key={i} title={mc.title} value={mc.value} subtitle={mc.subtitle} valueColor={mc.valueColor} />
        ))}
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left: Meeting Action Items (Live DB Sync) */}
        <section className="xl:col-span-1 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Sprint Task Pipeline</h2>
            <div className="flex bg-gray-100 dark:bg-white/5 rounded-md p-1">
              <button className="text-xs px-3 py-1.5 rounded transition-colors bg-white dark:bg-white/10 text-black dark:text-white shadow-sm">
                All Active
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-2">
            {tasks.map(task => (
              <div key={task.id} className="p-3 border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-black/20 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-bold text-sm">{task.title}</span>
                  <span className="text-xs text-brand-secondary">{task.progress}%</span>
                </div>
                <div className="text-xs mt-1 text-gray-500">Assignee: {task.assignee}</div>
                
                {/* Employee Comments surfacing to the Manager */}
                {task.comment && (
                  <div className="mt-2 text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 p-2 rounded border border-amber-100 dark:border-amber-900/40 font-medium">
                    💬 Note: {task.comment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Center: Live Team Standups */}
        <section className="xl:col-span-1 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-6 flex flex-col shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Live Standup Telemetry</h2>
            <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded font-medium flex items-center">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span> Streaming
            </span>
          </div>

          <div className="space-y-4 mb-6 flex-1 overflow-y-auto max-h-[400px]">
            {standupUpdates.map((update, i) => (
              <div key={i} className="flex gap-4 p-4 border border-gray-100 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-black/10">
                <Avatar name={update.name} />
                <div className="flex-1">
                  <span className="font-bold text-sm block mb-2">{update.name}</span>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><span className="font-medium text-black dark:text-white">Yesterday:</span> {update.yesterday}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300"><span className="font-medium text-black dark:text-white">Today:</span> {update.today}</p>
                  
                  {update.blockers && update.blockers.toLowerCase() !== "none" && update.blockers.trim() !== "" && (
                    <div className="mt-3 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-400/10 px-2 py-2 rounded-lg border border-red-100 dark:border-red-900/30">
                      <strong className="block mb-1">🚨 Blocker Flaged:</strong> {update.blockers}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: AI Resource & Leave Allocation Engine */}
        <section className="xl:col-span-1 bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-6 flex flex-col shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-5 dark:opacity-10 pointer-events-none">
            <BrainCircuit className="w-48 h-48" />
          </div>
          
          <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
             Workload Balancer
          </h2>
          <p className="text-xs text-gray-500 mb-6">AI models dynamically assessing sprint capacity.</p>

          <div className="space-y-2 mb-6">
            {teamMembers.map(member => (
              <div key={member.name} className="flex items-center justify-between p-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">{member.name}</span>
                  <span className="text-xs text-brand-secondary">{member.role}</span>
                </div>
                <div className="text-xs font-mono bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">
                  {member.ticketCount} Active Tickets
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/10">
            {allocationAIState === 'idle' && (
              <div className="text-center">
                 <p className="text-sm text-gray-500 mb-4">Simulate developer leave to recalculate sprint distributions via AI.</p>
                 <div className="flex gap-2">
                   <select 
                     id="leaveSelect"
                     className="bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-black dark:text-white focus:outline-none focus:border-accent"
                   >
                     {teamMembers.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                   </select>
                   <button 
                    onClick={() => {
                      const sel = document.getElementById('leaveSelect').value;
                      runResourceAI(sel);
                    }}
                    className="flex-1 py-2 bg-[#0A0A0F] dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 flex items-center justify-center gap-2"
                   >
                     <BrainCircuit className="w-4 h-4" /> Simulate
                   </button>
                 </div>
              </div>
            )}

            {allocationAIState === 'loading' && (
              <div className="flex flex-col items-center justify-center py-6">
                <div className="w-8 h-8 border-4 border-gray-200 dark:border-white/10 border-t-accent rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-gray-500 animate-pulse">Gemini 2.5 Flash computing capacity matrices...</p>
              </div>
            )}

            {allocationAIState.startsWith('simulated:') && (
              <div className="bg-brand-primary/5 dark:bg-white/5 border border-brand-primary/20 dark:border-white/10 rounded-xl p-4 animate-slide-up">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold mb-1">AI Re-Allocation Complete</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                      {allocationAIState.split(':')[1]} has been modeled on leave. Based on historical velocity, optimal re-distribution is:
                    </p>
                    <ul className="text-xs space-y-1.5 font-medium text-black dark:text-white">
                      {teamMembers.filter(m => m.name !== allocationAIState.split(':')[1]).map(m => (
                        <li key={m.name} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-accent rounded-full"></span> 
                          {m.name} +1 ticket <span className="opacity-50 font-normal">({m.role} overlap)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <button onClick={() => setAllocationAIState('idle')} className="mt-4 w-full text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors">Reset Simulation</button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Bottom Section */}
      <section className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold mb-6">Client Feedback · Sprint 4</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {feedbacks.map((fb, i) => (
            <FeedbackCard key={i} {...fb} />
          ))}
        </div>

        <AIResponseBox 
          type="alert"
          text="Orion Retail showing churn signals — 3★ rating + mentioned broken promises. Recommend immediate PM outreach today."
        />
      </section>

    </div>
  );
}
