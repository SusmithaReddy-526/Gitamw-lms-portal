import React from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  FileType, 
  UserCheck
} from 'lucide-react';

export function UnitPage({ subject, unit, onBack }) {
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
          Faculty Reference Materials & Downloadable PDF Documents for {displayUnitName}.
        </p>
      </div>

      {/* FACULTY UPLOADED PDF & REFERENCE FILES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-500" />
            Faculty Uploaded PDF Documents & Reference Files ({uploadedFiles.length})
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

                  {/* PROMINENT DOWNLOAD PDF BUTTON */}
                  <a
                    href={file.fileData}
                    download={file.fileName}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4 animate-bounce" />
                    Download PDF File ({file.fileName})
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-3xl glass-card text-center space-y-3 border border-slate-200 dark:border-slate-800">
            <FileType className="w-12 h-12 text-brand-500/40 mx-auto" />
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">No Faculty PDFs Uploaded Yet for {displayUnitName}</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Faculty will upload syllabus reference notes and PDFs for this unit directly from the Faculty Portal.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
