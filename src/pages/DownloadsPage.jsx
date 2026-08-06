import React from 'react';
import { dbService } from '../services/dbService';
import { Download, BookOpen, FileText, ArrowRight, Bookmark } from 'lucide-react';

export function DownloadsPage({ user, onSelectTopic }) {
  if (!user) {
    return (
      <div className="py-20 text-center space-y-2">
        <p className="text-slate-500 font-bold">Please log in to view saved study guides.</p>
      </div>
    );
  }

  const downloads = dbService.getUserDownloads(user.id);
  const curriculum = dbService.getCurriculum();

  const handleOpenSavedTopic = (savedItem) => {
    // Find matching topic in curriculum
    let foundSubject = null;
    let foundUnit = null;
    let foundTopic = null;

    curriculum.forEach(sub => {
      sub.units?.forEach(unit => {
        unit.topics?.forEach(top => {
          if (top.id === savedItem.topicId || top.name === savedItem.topicName) {
            foundSubject = sub;
            foundUnit = unit;
            foundTopic = top;
          }
        });
      });
    });

    if (foundTopic) {
      onSelectTopic(foundSubject, foundUnit, foundTopic);
    } else {
      // Fallback
      onSelectTopic(
        { subjectName: savedItem.subjectName || 'Core Engineering', yearId: '3rd', branchId: 'CSE' },
        { title: savedItem.unitName || 'Unit 1' },
        { id: savedItem.topicId, name: savedItem.topicName }
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Bookmark className="w-6 h-6 text-brand-500 fill-brand-500" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
            Saved Offline Study Notes
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bookmarked topics and offline PDF study guides for easy revision.
        </p>
      </div>

      {downloads.length > 0 ? (
        <div className="space-y-3">
          {downloads.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-400 transition-all cursor-pointer flex items-center justify-between"
              onClick={() => handleOpenSavedTopic(item)}
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                  {item.subjectName}
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white text-base">
                  {item.topicName}
                </h4>
                <p className="text-xs text-slate-400">{item.unitName} • Saved {new Date(item.savedAt).toLocaleDateString()}</p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400">
                <span>Read Guide</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl glass-card text-slate-500 space-y-3">
          <Download className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-700 dark:text-slate-300">No Saved Notes Yet</h4>
          <p className="text-xs max-w-sm mx-auto">
            Click "Save Offline" on any topic view page to bookmark notes for offline study and quick exam revision.
          </p>
        </div>
      )}
    </div>
  );
}
