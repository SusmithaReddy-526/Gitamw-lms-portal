import React, { useState } from 'react';
import { dbService } from '../../services/dbService';
import { MessageSquarePlus, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function SuggestionModal({ isOpen, onClose, user }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic & Curriculum');
  const [message, setMessage] = useState('');
  const [contactInfo, setContactInfo] = useState(user?.email || user?.mobile || '');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !message.trim()) {
      setError('Please fill in both Title and Suggestion/Complaint message.');
      return;
    }

    try {
      dbService.saveSuggestion({
        title: title.trim(),
        category,
        message: message.trim(),
        contactInfo: contactInfo.trim(),
        authorName: user?.fullName || user?.username || 'Anonymous User',
        authorRole: user?.role || 'student',
        authorId: user?.rollNumber || user?.employeeId || user?.username || 'GUEST',
        authorEmail: user?.email || contactInfo.trim()
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setTitle('');
        setMessage('');
        onClose();
      }, 1800);
    } catch (e) {
      setError(e.message || 'Failed to send suggestion.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-outfit">
                Suggestions &amp; Complaints Box
              </h3>
              <p className="text-xs text-slate-500">
                Direct feedback to College Administration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white font-outfit">
              Thank You! Suggestion Submitted
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your feedback has been sent directly to the Admin Portal dashboard for review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Academic & Curriculum">Academic &amp; Curriculum</option>
                <option value="Faculty & Teaching">Faculty &amp; Teaching</option>
                <option value="LMS Portal & Website Feature">LMS Portal &amp; Website Feature</option>
                <option value="Campus Facilities & Infrastructure">Campus Facilities &amp; Infrastructure</option>
                <option value="General Complaint / Inquiry">General Complaint / Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Request for additional Lab study materials..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Message / Complaint *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe your suggestion or complaint in detail..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Email / Phone (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave your email or mobile for direct reply"
                value={contactInfo}
                onChange={e => setContactInfo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20"
              >
                <Send className="w-4 h-4" />
                Submit Suggestion
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
