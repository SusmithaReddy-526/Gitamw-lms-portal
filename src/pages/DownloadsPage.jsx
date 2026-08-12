import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Download, BookOpen, FileText, ArrowRight, Bookmark, Trash2, Eye, CheckCircle2, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to convert Base64 Data URL to Blob Object URL for 100% browser PDF rendering
export function dataURLtoBlobUrl(dataUrl) {
  if (!dataUrl) return null;
  try {
    if (dataUrl.startsWith('blob:') || dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
      return dataUrl;
    }
    if (dataUrl.startsWith('data:')) {
      const parts = dataUrl.split(',');
      const mimeMatch = parts[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      return URL.createObjectURL(blob);
    }
  } catch (err) {
    console.error('Error converting Data URL to Blob URL:', err);
  }
  return dataUrl;
}

export function DownloadsPage({ user }) {
  const userId = user?.id || 'guest';
  const [downloadsList, setDownloadsList] = useState(() => dbService.getUserDownloads(userId));
  const [activePdfModal, setActivePdfModal] = useState(null);
  const [activeBlobUrl, setActiveBlobUrl] = useState(null);

  useEffect(() => {
    setDownloadsList(dbService.getUserDownloads(userId));
  }, [user]);

  // Convert Base64 fileData to Blob URL whenever a file is selected for viewing
  useEffect(() => {
    if (activePdfModal?.fileData) {
      const url = dataURLtoBlobUrl(activePdfModal.fileData);
      setActiveBlobUrl(url);

      return () => {
        if (url && url.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(url);
          } catch {}
        }
      };
    } else {
      setActiveBlobUrl(null);
    }
  }, [activePdfModal]);

  const handleDeleteDownload = (fileId) => {
    dbService.deleteUserDownload(userId, fileId);
    setDownloadsList(dbService.getUserDownloads(userId));
  };

  const handleOpenFullscreenTab = () => {
    const targetUrl = activeBlobUrl || (activePdfModal?.fileData ? dataURLtoBlobUrl(activePdfModal.fileData) : null);
    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
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
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    Read Offline
                  </button>

                  <button
                    onClick={() => {
                      if (item.fileData) {
                        const link = document.createElement('a');
                        link.href = activeBlobUrl || dataURLtoBlobUrl(item.fileData) || item.fileData;
                        link.download = item.fileName || `${item.title || 'Downloaded_Material'}.pdf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }
                    }}
                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    Save File
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteDownload(item.id)}
                  className="w-full py-1.5 text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center justify-center gap-1"
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
            When you click "Download" on any Unit page, it will automatically save into this In-App Downloads Dashboard for 100% offline reading anytime.
          </p>
        </div>
      )}

      {/* IN-APP OFFLINE PDF VIEWER MODAL */}
      <AnimatePresence>
        {activePdfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-5xl h-[88vh] bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
                <div className="space-y-0.5 max-w-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
                    <h3 className="font-extrabold text-white text-base font-outfit truncate">
                      {activePdfModal.title || activePdfModal.fileName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {activePdfModal.subjectName} • {activePdfModal.unitName} • 🟢 Reading Offline
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenFullscreenTab}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-cyan-500/30"
                    title="Open Full Screen in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Fullscreen</span>
                  </button>

                  <button
                    onClick={() => setActivePdfModal(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document / PDF / Image Content Frame */}
              <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
                {activeBlobUrl || activePdfModal.fileData ? (
                  activePdfModal.fileType?.includes('image') ? (
                    <img 
                      src={activeBlobUrl || activePdfModal.fileData} 
                      alt={activePdfModal.title}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    />
                  ) : (
                    <object
                      data={activeBlobUrl || activePdfModal.fileData}
                      type="application/pdf"
                      className="w-full h-full rounded-xl border-none bg-slate-900"
                    >
                      <embed 
                        src={activeBlobUrl || activePdfModal.fileData} 
                        type="application/pdf" 
                        className="w-full h-full rounded-xl"
                      />
                      <iframe
                        src={activeBlobUrl || activePdfModal.fileData}
                        className="w-full h-full border-none rounded-xl bg-white"
                        title={activePdfModal.fileName}
                      />
                    </object>
                  )
                ) : (
                  <div className="text-center space-y-3 p-8">
                    <FileText className="w-14 h-14 text-slate-600 mx-auto" />
                    <h4 className="text-white font-bold text-base">PDF Preview Unavailable</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Click "Open Fullscreen" to view this PDF in a new window.
                    </p>
                    <button
                      onClick={handleOpenFullscreenTab}
                      className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs"
                    >
                      Open Fullscreen ↗️
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
