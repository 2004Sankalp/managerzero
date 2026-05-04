import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, CheckCircle, AlertCircle } from 'lucide-react';

const LABELS = ['', 'Very Poor', 'Below Average', 'Satisfactory', 'Good', 'Excellent'];
const COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#4ade80'];

export default function ClientFeedbackForm() {
  const { token } = useParams();
  const [meta, setMeta] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/api/feedback/form/${token}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setLoadError(data.error);
        else setMeta(data);
      })
      .catch(() => setLoadError('Could not load the feedback form. Please check your connection.'));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setErrorMsg('Please select a star rating.'); return; }
    if (text.trim().length < 5) { setErrorMsg('Please write at least a sentence of feedback.'); return; }
    setErrorMsg('');
    setStatus('submitting');
    try {
      const res = await fetch(`http://localhost:5000/api/feedback/submit/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Submission failed.');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  if (loadError) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-xl border border-red-100">
        <AlertCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Link Expired or Invalid</h2>
        <p className="text-gray-500 text-sm">{loadError}</p>
      </div>
    </div>
  );

  if (!meta) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-green-400 animate-spin" />
        <p className="text-gray-500 text-sm">Loading your feedback form...</p>
      </div>
    </div>
  );

  if (status === 'success') return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl border border-green-100">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-500">Your feedback for <strong>{meta.projectName}</strong> — {meta.sprintNumber} has been received.</p>
        <p className="text-gray-400 text-sm mt-4">Your input helps us improve every sprint. You can close this tab.</p>
        <div className="mt-8 flex gap-1 justify-center">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={`w-6 h-6 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
          ))}
        </div>
      </div>
    </div>
  );

  const activeColor = COLORS[hover || rating] || '#d1d5db';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Header card */}
        <div className="bg-gradient-to-br from-[#0A0A0F] to-[#1a1a2e] rounded-3xl p-8 mb-6 text-center shadow-2xl">
          <div className="text-green-400 text-xs font-bold tracking-widest uppercase mb-2">ManagerZero</div>
          <h1 className="text-white text-2xl font-bold">Sprint Feedback</h1>
          <p className="text-gray-400 text-sm mt-1">{meta.projectName} &middot; {meta.sprintNumber}</p>
          <p className="text-gray-500 text-xs mt-2">Your honest feedback drives improvement</p>
        </div>

        {/* Form card */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <p className="text-gray-700 font-medium mb-6 text-center">
            Hello <span className="font-bold text-black">{meta.clientName}</span>, how would you rate this sprint?
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Star Rating */}
            <div className="text-center">
              <div className="flex justify-center gap-3 mb-3">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-all hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className="w-12 h-12 transition-all"
                      style={{
                        fill: s <= (hover || rating) ? activeColor : 'transparent',
                        color: s <= (hover || rating) ? activeColor : '#d1d5db',
                        filter: s <= (hover || rating) ? `drop-shadow(0 0 6px ${activeColor}60)` : 'none',
                      }}
                    />
                  </button>
                ))}
              </div>
              {(hover || rating) > 0 && (
                <p className="text-sm font-bold transition-all" style={{ color: activeColor }}>
                  {LABELS[hover || rating]}
                </p>
              )}
            </div>

            {/* Text Feedback */}
            <div>
              <label htmlFor="feedback-text" className="block text-sm font-semibold text-gray-700 mb-2">
                Tell us more <span className="text-gray-400 font-normal">(What went well? What can we improve?)</span>
              </label>
              <textarea
                id="feedback-text"
                name="feedback-text"
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Share your honest thoughts about this sprint's delivery, communication, and quality..."
                rows={5}
                className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-gray-800 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 resize-none transition-all"
              />
              <div className="text-right text-xs text-gray-400 mt-1">{text.length}/2000</div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #22c55e, #4ade80)' }}
            >
              {status === 'submitting' ? (
                <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Submitting...</>
              ) : (
                <><Star className="w-5 h-5" /> Submit Feedback</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">Powered by ManagerZero · Your response is confidential</p>
      </div>
    </div>
  );
}
