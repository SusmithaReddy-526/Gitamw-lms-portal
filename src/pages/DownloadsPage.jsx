import React, { useState } from 'react';
import { dbService } from '../services/dbService';
import { Download, BookOpen, FileText, ArrowRight, Bookmark, Trash2, Eye, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function DownloadsPage({ user }) {
  const userId = user?.id || 'guest';
  const [downloadsList, setDownloadsList] = useState(() => dbService.getUserDownloads(userId));
  const [activePdfModal, setActivePdfModal] = useState(null);

  const handleDeleteDownload = (fileId) => {
    dbService.deleteUserDownload(userId, fileId);
    setDownloadsList(dbService.getUserDownloads(userId));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center">
              <Download className="w-5 h-5" />
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
              My Downloads & Offline Notes
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access, view, and read all your downloaded PDF lecture notes offline anytime — even without internet.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          100% Offline Ready
        </div>
      </div>

      {downloadsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {downloadsList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              whileHover={{ y: -4 }}
              className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-brand-500 shadow-xl space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase bg-brand-500/10 text-brand-500 border border-brand-500/20">
                    {item.subjectCode || item.subjectName} • {item.unitName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
                    🟢 Saved Offline
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                  {item.title || item.fileName}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  File: {item.fileName} ({item.fileSize || 'PDF'})
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActivePdfModal(item)}
                    className="py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Read Offline
                  </button>

                  <a
                    href={item.fileData}
                    download={item.fileName}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>

                <button
                  onClick={() => handleDeleteDownload(item.id)}
                  className="w-full py-2 text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove from Downloads
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl glass-card text-slate-500 space-y-4 border border-slate-200 dark:border-slate-800">
          <Download className="w-14 h-14 text-brand-500/40 mx-auto" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">No Downloaded Files in Your Dashboard</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When you click "Download PDF File" on any Unit page, it will automatically save into this In-App Downloads Dashboard for 100% offline reading anytime.
          </p>
        </div>
      )}

      {/* IN-APP OFFLINE PDF VIEWER MODAL */}
      <AnimatePresence>
        {activePdfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-5 bg-slate-100 dark:bg-slate-800 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                <div className="space-y-0.5">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base font-outfit">
                    {activePdfModal.title || activePdfModal.fileName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activePdfModal.subjectName} • {activePdfModal.unitName} • 🟢 Reading Offline
                  </p>
                </div>
                <button
                  onClick={() => setActivePdfModal(null)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PDF Viewer Frame */}
              <div className="flex-1 bg-slate-900 flex items-center justify-center">
                {activePdfModal.fileData ? (
                  <iframe
                    src={activePdfModal.fileData}
                    className="w-full h-full border-none"
                    title={activePdfModal.fileName}
                  />
                ) : (
                  <p className="text-slate-400 text-xs font-bold">PDF Preview unavailable offline.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
