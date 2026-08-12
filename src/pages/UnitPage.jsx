import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../services/dbService';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Eye, 
  FileType, 
  UserCheck,
  CheckCircle2,
  X,
  FileText,
  ExternalLink
} from 'lucide-react';

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

export function UnitPage({ subject, unit, user, onBack }) {
  const [savedMessage, setSavedMessage] = useState('');
  const [viewingFileModal, setViewingFileModal] = useState(null);
  const [activeBlobUrl, setActiveBlobUrl] = useState(null);

  // Convert Base64 fileData to Blob URL whenever a file is selected for viewing
  useEffect(() => {
    if (viewingFileModal?.fileData) {
      const url = dataURLtoBlobUrl(viewingFileModal.fileData);
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
  }, [viewingFileModal]);

  // Fetch files uploaded by faculty for this specific subject & unit
  const uploadedFiles = dbService.getUploadedFilesForUnit(
    subject.yearId,
    subject.branchId,
    subject.subjectId,
    unit.unitId,
    subject.subjectCode,
    unit.title
  );

  const displayUnitName = unit.title?.split(':')[0] || unit.title || 'Unit';

  // File Download & Sync to Dashboard Handler
  const handleDownloadFile = (file) => {
    // 1. Record/Save file to User's Downloads Dashboard in localStorage
    dbService.saveUserDownload(user?.id || 'guest', {
      id: file.id,
      title: file.title,
      fileName: file.fileName,
      fileData: file.fileData,
      fileSize: file.fileSize,
      fileType: file.fileType,
      subjectName: subject.subjectName,
      subjectCode: subject.subjectCode,
      unitName: displayUnitName,
      uploadedBy: file.uploadedBy,
      downloadedAt: new Date().toISOString().split('T')[0]
    });

    // 2. Trigger Browser File Download
    if (file.fileData) {
      const link = document.createElement('a');
      link.href = activeBlobUrl || dataURLtoBlobUrl(file.fileData) || file.fileData;
      link.download = file.fileName || `${file.title || 'Unit_Material'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    // 3. Show Toast Notification
    setSavedMessage(`"${file.title || file.fileName}" downloaded & saved to your Downloads Dashboard!`);
    setTimeout(() => setSavedMessage(''), 5000);
  };

  const handleOpenFullscreenTab = () => {
    const targetUrl = activeBlobUrl || (viewingFileModal?.fileData ? dataURLtoBlobUrl(viewingFileModal.fileData) : null);
    if (targetUrl) {
      window.open(targetUrl, '_blank');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Units
        </button>

        <span className="px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase">
          {subject.subjectName} ({subject.subjectCode})
        </span>
      </div>

      {/* Toast Notification */}
      {savedMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{savedMessage}</span>
          </div>
          <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-full">
            Saved to Downloads
          </span>
        </motion.div>
      )}

      {/* Unit Title Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-500 text-xs font-semibold">
          <BookOpen className="w-4 h-4" />
          {subject.subjectName}
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-outfit">
          {displayUnitName}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View or Download faculty uploaded PDF reference materials directly into your personal Downloads Dashboard.
        </p>
      </div>

      {/* FACULTY UPLOADED PDF & REFERENCE FILES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-500" />
            Faculty Uploaded Study Materials ({uploadedFiles.length})
          </h3>
        </div>

        {uploadedFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {uploadedFiles.map(file => (
              <motion.div
                key={file.id}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl glass-card border border-brand-500/30 hover:border-brand-500 shadow-lg space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 flex items-center gap-1">
                      <FileType className="w-3.5 h-3.5" />
                      {file.fileType?.includes('pdf') ? 'PDF DOCUMENT' : 'FACULTY FILE'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400">{file.fileSize}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                    {file.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">
                    {file.description || 'Uploaded by course faculty.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-brand-500" />
                      {file.uploadedBy || 'Faculty'}
                    </span>
                    <span className="font-mono">{file.uploadedAt}</span>
                  </div>

                  {/* 2 ACTION BUTTONS: VIEW & DOWNLOAD */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* VIEW MATERIAL BUTTON */}
                    <button
                      onClick={() => setViewingFileModal(file)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-cyan-400" />
                      View Material
                    </button>

                    {/* DOWNLOAD FILE BUTTON */}
                    <button
                      onClick={() => handleDownloadFile(file)}
                      className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-amber-300" />
                      Download
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-3xl glass-card text-center space-y-3 border border-slate-200 dark:border-slate-800">
            <FileType className="w-12 h-12 text-brand-500/40 mx-auto" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">No Faculty Materials Uploaded Yet for {displayUnitName}</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Faculty will upload syllabus reference notes and PDFs for this unit directly from the Faculty Portal.
            </p>
          </div>
        )}
      </div>

      {/* VIEW MATERIAL MODAL WITH BLOB URL CONVERSION */}
      <AnimatePresence>
        {viewingFileModal && (
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
                      {viewingFileModal.title || viewingFileModal.fileName}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {subject.subjectName} ({subject.subjectCode}) • {displayUnitName} • By {viewingFileModal.uploadedBy || 'Faculty'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* OPEN IN NEW TAB BUTTON */}
                  <button
                    onClick={handleOpenFullscreenTab}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-cyan-500/30"
                    title="Open Full Screen in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Open Fullscreen</span>
                  </button>

                  {/* DOWNLOAD BUTTON */}
                  <button
                    onClick={() => {
                      handleDownloadFile(viewingFileModal);
                      setViewingFileModal(null);
                    }}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>

                  {/* CLOSE BUTTON */}
                  <button
                    onClick={() => setViewingFileModal(null)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document / PDF / Image Content Frame */}
              <div className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center p-2">
                {activeBlobUrl || viewingFileModal.fileData ? (
                  viewingFileModal.fileType?.includes('image') ? (
                    <img 
                      src={activeBlobUrl || viewingFileModal.fileData} 
                      alt={viewingFileModal.title}
                      className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    />
                  ) : (
                    <object
                      data={activeBlobUrl || viewingFileModal.fileData}
                      type="application/pdf"
                      className="w-full h-full rounded-xl border-none bg-slate-900"
                    >
                      <embed 
                        src={activeBlobUrl || viewingFileModal.fileData} 
                        type="application/pdf" 
                        className="w-full h-full rounded-xl"
                      />
                      <iframe
                        src={activeBlobUrl || viewingFileModal.fileData}
                        className="w-full h-full border-none rounded-xl bg-white"
                        title={viewingFileModal.fileName}
                      />
                    </object>
                  )
                ) : (
                  <div className="text-center space-y-3 p-8">
                    <FileText className="w-14 h-14 text-slate-600 mx-auto" />
                    <h4 className="text-white font-bold text-base">Unable to Render PDF Preview</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                      Click "Open Fullscreen" to view this PDF in a new browser window.
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
