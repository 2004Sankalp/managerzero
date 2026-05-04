import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import AIResponseBox from '../components/AIResponseBox';
import { Sparkles, Send, Star, TrendingUp, AlertTriangle, CheckCircle, ChevronRight, RefreshCw } from 'lucide-react';

const SENTIMENT = {
  1: { label: 'Very Negative', color: 'text-red-500', bg: 'bg-red-500/10 border-red-500/20 dark:border-red-500/30' },
  2: { label: 'Negative',      color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/20' },
  3: { label: 'Neutral',       color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/20' },
  4: { label: 'Positive',      color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  5: { label: 'Very Positive', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
};

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} className={`w-4 h-4 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
    ))}
  </div>
);

export default function Feedback() {
  const [step, setStep] = useState('compose'); // compose | awaiting | responses | analysis
  const [form, setForm] = useState({
    clientName: '', clientEmail: '', projectName: '', sprintNumber: 'Sprint 1',
    customMessage: "Hi! We'd love your honest feedback on our recent sprint delivery. What went well, and what could we improve?"
  });
  const [isSending, setIsSending] = useState(false);
  const [surveyToken, setSurveyToken] = useState(null);
  const [surveyUrl, setSurveyUrl] = useState(null);
  const [emailDelivered, setEmailDelivered] = useState(true);
  const [responses, setResponses] = useState([]);
  const [isPolling, setIsPolling] = useState(false);
  const [lastPolled, setLastPolled] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const pollRef = useRef(null);

  // Auto-poll for responses every 15s when on awaiting/responses step
  useEffect(() => {
    if ((step === 'awaiting' || step === 'responses') && surveyToken) {
      pollResponses();
      pollRef.current = setInterval(pollResponses, 15000);
    }
    return () => clearInterval(pollRef.current);
  }, [step, surveyToken]);

  const pollResponses = async () => {
    if (!surveyToken) return;
    setIsPolling(true);
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/responses/${surveyToken}`);
      if (!res.ok) return;
      const data = await res.json();
      setResponses(data.responses || []);
      setLastPolled(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
      if (data.responses?.length > 0 && step === 'awaiting') setStep('responses');
    } catch {}
    finally { setIsPolling(false); }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.clientEmail.trim() || !form.projectName.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setIsSending(true);
    try {
      const res = await fetch('http://localhost:5000/api/feedback/send-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        const detail = data.details?.[0];
        const msg = detail ? `${detail.path}: ${detail.msg}` : (data.error || 'Email send failed');
        console.error('Send request error:', data);
        throw new Error(msg);
      }
      setSurveyToken(data.token);
      setSurveyUrl(data.feedbackUrl);
      if (data.emailWarning) {
        setEmailDelivered(false);
        toast.error(`Email not sent (Resend domain restriction). Share the link below manually.`, { duration: 6000 });
      } else {
        toast.success(`Feedback request sent to ${form.clientEmail}!`);
      }
      setStep('awaiting');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleAnalyze = async () => {
    if (responses.length === 0) { toast.error('No responses to analyze.'); return; }
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const res = await fetch('http://localhost:5000/api/feedback/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbacks: responses }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || `Server error: ${res.status}`);
      }
      const insights = typeof data.insights === 'string' ? data.insights
        : data.sentiment?.summary || data.summary || JSON.stringify(data);
      setAiAnalysis({ insights, raw: data });
      setStep('analysis');
    } catch (err) {
      toast.error(err.message || 'AI unavailable. Ensure backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const avgRating = responses.length
    ? (responses.reduce((s,r) => s + r.rating, 0) / responses.length).toFixed(1)
    : null;

  const filteredResponses = responses.filter(r => {
    if (activeTab === 'Positive') return r.rating >= 4;
    if (activeTab === 'Needs Attention') return r.rating <= 3;
    return true;
  });

  const STEPS = [
    { id: 'compose',   label: '1. Compose' },
    { id: 'awaiting',  label: '2. Awaiting' },
    { id: 'responses', label: '3. Responses' },
    { id: 'analysis',  label: '4. AI Analysis' },
  ];

  return (
    <div className="space-y-8 text-black dark:text-white min-h-screen">

      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">Client Feedback</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Send surveys, collect real responses, analyse sentiment with AI.</p>
        </div>
        {avgRating && (
          <div className="text-center bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl px-6 py-4 shadow-sm">
            <div className="text-3xl font-bold text-amber-400">{avgRating}★</div>
            <div className="text-xs text-gray-500">{responses.length} response{responses.length !== 1 ? 's' : ''}</div>
          </div>
        )}
      </header>

      {/* Step Progress */}
      <div className="flex items-center gap-1 flex-wrap">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              step === s.id ? 'bg-accent text-white shadow-sm'
              : 'text-gray-400 dark:text-gray-500'
            }`}>{s.label}</div>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />}
          </React.Fragment>
        ))}
        {(step === 'awaiting' || step === 'responses') && lastPolled && (
          <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
            {isPolling ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
            Last checked {lastPolled}
          </span>
        )}
      </div>

      {/* ── Step 1: Compose ── */}
      {step === 'compose' && (
        <section className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold mb-6">Send Feedback Request</h2>
          <form onSubmit={handleSend} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              {[
                { id: 'clientName',  label: 'Client Name *',  placeholder: 'e.g. Orion Retail', type: 'text' },
                { id: 'clientEmail', label: 'Client Email *',  placeholder: 'client@company.com', type: 'email' },
                { id: 'projectName', label: 'Project Name *',  placeholder: 'e.g. Mobile App Rebuild', type: 'text' },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">{f.label}</label>
                  <input id={f.id} name={f.id} type={f.type}
                    value={form[f.id]}
                    onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-xl p-3 text-sm text-black dark:text-white focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="sprintNumber" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Sprint</label>
                <select id="sprintNumber" name="sprintNumber"
                  value={form.sprintNumber}
                  onChange={e => setForm(p => ({ ...p, sprintNumber: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-xl p-3 text-sm text-black dark:text-white focus:outline-none focus:border-accent"
                >
                  {[...Array(12)].map((_,i) => <option key={i} value={`Sprint ${i+1}`}>Sprint {i+1}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="customMessage" className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Email Message</label>
              <textarea id="customMessage" name="customMessage"
                value={form.customMessage}
                onChange={e => setForm(p => ({ ...p, customMessage: e.target.value }))}
                className="flex-1 bg-gray-50 dark:bg-background border border-gray-200 dark:border-border rounded-xl p-4 text-sm text-black dark:text-white focus:outline-none focus:border-accent resize-none"
              />
              <button type="submit" disabled={isSending}
                className="mt-4 py-3.5 bg-accent hover:bg-emerald-400 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSending
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> Sending...</>
                  : <><Send className="w-4 h-4"/> Send Feedback Request</>}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ── Step 2: Awaiting ── */}
      {step === 'awaiting' && (
        <section className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-10 shadow-sm text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-accent/20 border-t-accent animate-spin absolute inset-0" />
            <Send className="w-8 h-8 text-accent absolute inset-0 m-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Waiting for Response</h2>

          {emailDelivered ? (
            <p className="text-gray-500 dark:text-gray-400 mb-2 max-w-md mx-auto">
              Feedback request sent to <strong className="text-black dark:text-white">{form.clientEmail}</strong>.
            </p>
          ) : (
            <div className="mb-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl p-4 max-w-lg mx-auto text-left">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-semibold mb-2">
                ⚠️ Email couldn't be delivered (Resend domain restriction).
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500 mb-3">
                Share this link with <strong>{form.clientEmail}</strong> manually:
              </p>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={surveyUrl || ''}
                  className="flex-1 bg-white dark:bg-black/30 border border-amber-200 dark:border-amber-500/30 rounded-lg px-3 py-2 text-xs text-gray-700 dark:text-gray-300 font-mono focus:outline-none"
                />
                <button
                  onClick={() => { navigator.clipboard.writeText(surveyUrl || ''); toast.success('Link copied!'); }}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Copy
                </button>
              </div>
              <p className="text-xs text-amber-500 mt-2">
                To enable real email delivery, <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="underline">verify a domain on Resend</a>.
              </p>
            </div>
          )}

          <p className="text-sm text-gray-400 mb-8">Auto-refreshes every 15 seconds once the client submits their form.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={pollResponses} disabled={isPolling}
              className="px-5 py-2.5 border border-gray-300 dark:border-border rounded-xl text-sm font-medium flex items-center gap-2 hover:text-black dark:hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isPolling ? 'animate-spin' : ''}`} /> Check Now
            </button>
            <button onClick={() => setStep('compose')}
              className="px-5 py-2.5 border border-gray-300 dark:border-border rounded-xl text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors"
            >
              Send Another Survey
            </button>
          </div>
        </section>
      )}

      {/* ── Step 3: Responses ── */}
      {step === 'responses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total',    value: responses.length, icon: TrendingUp,   color: 'text-accent' },
              { label: 'Positive', value: responses.filter(r=>r.rating>=4).length, icon: CheckCircle, color: 'text-green-500' },
              { label: 'Critical', value: responses.filter(r=>r.rating<=2).length, icon: AlertTriangle, color: 'text-red-500' },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                <div className={`w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <section className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold">Client Responses</h2>
                {isPolling && <RefreshCw className="w-4 h-4 text-accent animate-spin" />}
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 rounded-lg p-1">
                  {['All','Positive','Needs Attention'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${activeTab === tab ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-black dark:hover:text-white'}`}
                    >{tab}</button>
                  ))}
                </div>
                <button onClick={pollResponses} disabled={isPolling}
                  className="text-xs px-3 py-2 border border-gray-200 dark:border-border rounded-lg flex items-center gap-1 text-gray-500 hover:text-accent transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPolling ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredResponses.length === 0 ? (
                <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 dark:border-white/10 rounded-xl">No responses in this category.</div>
              ) : filteredResponses.map(r => {
                const s = SENTIMENT[r.rating];
                return (
                  <div key={r.id} className={`border rounded-2xl p-5 ${s.bg}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="font-bold">{r.client}</div>
                        <div className="text-xs text-gray-500">{r.project} · {r.sprint}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StarRow rating={r.rating} />
                        <span className={`text-xs font-bold ${s.color}`}>{s.label}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">"{r.text}"</p>
                    {r.receivedAt && <div className="text-xs text-gray-400 mt-2">Received at {r.receivedAt}</div>}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 dark:border-white/10 pt-6 mt-6 flex items-center gap-4 flex-wrap">
              <button onClick={handleAnalyze} disabled={isAnalyzing || responses.length === 0}
                className="px-6 py-3 bg-[#0A0A0F] dark:bg-white text-white dark:text-black font-bold rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isAnalyzing
                  ? <><div className="w-4 h-4 rounded-full border-2 border-white/20 dark:border-black/20 border-t-white dark:border-t-black animate-spin"/> Analyzing...</>
                  : <><Sparkles className="w-4 h-4"/> Run AI Analysis</>}
              </button>
              <button onClick={() => { setStep('compose'); setSurveyToken(null); setResponses([]); setAiAnalysis(null); }}
                className="text-sm text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                + Send Another Survey
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ── Step 4: AI Analysis ── */}
      {step === 'analysis' && aiAnalysis && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-400">{avgRating}★</div>
              <div className="text-xs text-gray-500 mt-1">Average Rating</div>
            </div>
            <div className="flex-1 space-y-2 w-full">
              {[5,4,3,2,1].map(star => {
                const count = responses.filter(r => r.rating === star).length;
                const pct = responses.length ? (count / responses.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs w-6 text-gray-500 text-right">{star}★</span>
                    <div className="flex-1 bg-gray-100 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                      <div className="h-2 bg-amber-400 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-4">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <section className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="text-lg font-bold">AI Sentiment Analysis & Recommended Actions</h2>
            </div>
            <AIResponseBox type="info" text={aiAnalysis.insights} />
          </section>

          {responses.filter(r => r.rating <= 2).length > 0 && (
            <section className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-lg font-bold text-red-700 dark:text-red-400">Churn Risk — Immediate Action Required</h2>
              </div>
              {responses.filter(r => r.rating <= 2).map(r => (
                <div key={r.id} className="bg-white/60 dark:bg-black/20 rounded-xl p-4 border border-red-100 dark:border-red-900/30 mb-3">
                  <div className="flex justify-between mb-1"><span className="font-bold text-sm">{r.client} · {r.project}</span><StarRow rating={r.rating} /></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">"{r.text}"</p>
                </div>
              ))}
            </section>
          )}

          {responses.filter(r => r.rating >= 4).length > 0 && (
            <section className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h2 className="text-lg font-bold text-green-700 dark:text-green-400">Positive Highlights</h2>
              </div>
              {responses.filter(r => r.rating >= 4).map(r => (
                <div key={r.id} className="bg-white/60 dark:bg-black/20 rounded-xl p-4 border border-green-100 dark:border-green-900/30 mb-3">
                  <div className="flex justify-between mb-1"><span className="font-bold text-sm">{r.client} · {r.project}</span><StarRow rating={r.rating} /></div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">"{r.text}"</p>
                </div>
              ))}
            </section>
          )}

          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setStep('responses')}
              className="px-5 py-2.5 border border-gray-300 dark:border-border rounded-xl text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              ← Back to Responses
            </button>
            <button onClick={() => { setStep('compose'); setSurveyToken(null); setResponses([]); setAiAnalysis(null); }}
              className="px-5 py-2.5 border border-gray-300 dark:border-border rounded-xl text-sm text-gray-500 hover:text-black dark:hover:text-white transition-colors">
              Start New Survey
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
