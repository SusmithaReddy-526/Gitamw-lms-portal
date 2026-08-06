import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { dbService, BRANCHES, YEARS } from '../services/dbService';
import { 
  Upload, 
  BookOpen, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileUp,
  Image as ImageIcon,
  FileType,
  Download,
  Eye
} from 'lucide-react';

export function FacultyDashboard({ user }) {
  const [selectedYear, setSelectedYear] = useState('3rd');
  const [selectedBranch, setSelectedBranch] = useState(user?.department || 'CSE');
  const [subjectName, setSubjectName] = useState('Data Structures & Algorithms');
  const [subjectCode, setSubjectCode] = useState('CS301');
  const [unitTitle, setUnitTitle] = useState('Unit 1: Introduction to Data Structures & Recursion');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDesc, setMaterialDesc] = useState('');
  
  // File state
  const [fileObject, setFileObject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // List of uploaded files
  const [uploadedFilesList, setUploadedFilesList] = useState(dbService.getUploadedFiles());

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) { // 15MB limit check for Base64 storage
        setError('File size must be under 15MB for local storage.');
        setFileObject(null);
        return;
      }
      setFileObject(file);
      setError('');
    }
  };

  const handleDirectFileUpload = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!subjectName.trim() || !subjectCode.trim() || !materialTitle.trim() || !fileObject) {
      setError('Please provide Subject Name, Code, Material Title, and select a PDF/Image file.');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result;
      
      // Calculate file size string
      const sizeKB = Math.round(fileObject.size / 1024);
      const formattedSize = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

      // Format unit ID
      const unitId = unitTitle.toLowerCase().includes('unit 1') ? 'unit-1' 
        : unitTitle.toLowerCase().includes('unit 2') ? 'unit-2'
        : unitTitle.toLowerCase().includes('unit 3') ? 'unit-3'
        : unitTitle.toLowerCase().includes('unit 4') ? 'unit-4'
        : 'unit-5';

      const subjectId = subjectCode.toLowerCase().replace(/[^a-z0-9]/g, '');

      // First ensure subject and unit exist in curriculum structure
      dbService.saveSubjectUnits(selectedYear, selectedBranch, subjectName, subjectCode, [
        {
          unitId,
          title: unitTitle,
          description: materialDesc || `Curriculum Unit for ${subjectName}`,
          topics: [{ id: `top-${Date.now()}`, name: materialTitle }]
        }
      ]);

      // Save file record
      const fileRecord = {
        yearId: selectedYear,
        branchId: selectedBranch,
        subjectId,
        subjectName,
        subjectCode,
        unitId,
        title: materialTitle,
        description: materialDesc || 'Official faculty reference material.',
        fileName: fileObject.name,
        fileType: fileObject.type || 'application/pdf',
        fileSize: formattedSize,
        fileData: base64Data,
        uploadedBy: user?.fullName ? `${user.fullName} (${user.employeeId || 'Faculty'})` : 'Department Faculty'
      };

      dbService.saveFacultyUploadedFile(fileRecord);

      setUploading(false);
      setMessage(`Successfully uploaded "${fileObject.name}" for ${subjectName} (${unitTitle})!`);
      setFileObject(null);
      setMaterialTitle('');
      setMaterialDesc('');
      setUploadedFilesList(dbService.getUploadedFiles());
    };

    reader.onerror = () => {
      setUploading(false);
      setError('Failed to read file. Please try again.');
    };

    reader.readAsDataURL(fileObject);
  };

  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this uploaded file?')) {
      dbService.deleteUploadedFile(fileId);
      setUploadedFilesList(dbService.getUploadedFiles());
      setMessage('File removed successfully.');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Faculty Portal Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-navy-900 via-brand-900 to-indigo-950 text-white shadow-xl relative overflow-hidden border border-brand-500/20">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-semibold">
            <FileUp className="w-4 h-4 text-brand-400" />
            GITAMW Faculty Direct Material Upload Portal
          </div>
          <h1 className="text-3xl font-extrabold font-outfit">
            Upload PDF Notes, Images & Learning Files
          </h1>
          <p className="text-xs text-slate-300">
            Welcome, <span className="font-bold text-white">{user?.fullName || 'Faculty Member'}</span>! Select your class parameters and upload PDF documents or image diagrams directly. Students can view and download your uploaded files immediately.
          </p>
        </div>
      </div>

      {/* Messages */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{message}</span>
        </div>
      )}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Form */}
      <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
          <Upload className="w-5 h-5 text-brand-500" />
          Upload New PDF Document or Image File
        </h3>

        <form onSubmit={handleDirectFileUpload} className="space-y-5">
          
          {/* Target Year & Branch */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Academic Year *
              </label>
              <select
                value={selectedYear}
                onChange={e => {
                  const y = e.target.value;
                  setSelectedYear(y);
                  const subs = dbService.getSubjectsForBranchAndYear(y, selectedBranch);
                  if (subs && subs.length > 0) {
                    setSubjectName(subs[0].subjectName);
                    setSubjectCode(subs[0].subjectCode);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              >
                {YEARS.map(y => (
                  <option key={y.id} value={y.id}>{y.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Semester / Academic Term *
              </label>
              <select
                value={selectedYear === '4th' ? 'Sem 7' : selectedYear === '3rd' ? 'Sem 5' : selectedYear === '2nd' ? 'Sem 3' : 'Sem 1'}
                onChange={() => {}}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none font-bold text-brand-600 dark:text-brand-400"
              >
                {selectedYear === '4th' && <option value="Sem 7">Sem 7 (4th Year Sem 1)</option>}
                {selectedYear === '4th' && <option value="Sem 8">Sem 8 (4th Year Sem 2)</option>}
                {selectedYear === '3rd' && <option value="Sem 5">Sem 5 (3rd Year Sem 1)</option>}
                {selectedYear === '3rd' && <option value="Sem 6">Sem 6 (3rd Year Sem 2)</option>}
                {selectedYear === '2nd' && <option value="Sem 3">Sem 3 (2nd Year Sem 1)</option>}
                {selectedYear === '2nd' && <option value="Sem 4">Sem 4 (2nd Year Sem 2)</option>}
                {selectedYear === '1st' && <option value="Sem 1">Sem 1 (1st Year Sem 1)</option>}
                {selectedYear === '1st' && <option value="Sem 2">Sem 2 (1st Year Sem 2)</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Engineering Branch *
              </label>
              <select
                value={selectedBranch}
                onChange={e => {
                  const b = e.target.value;
                  setSelectedBranch(b);
                  const subs = dbService.getSubjectsForBranchAndYear(selectedYear, b);
                  if (subs && subs.length > 0) {
                    setSubjectName(subs[0].subjectName);
                    setSubjectCode(subs[0].subjectCode);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              >
                {BRANCHES.map(b => (
                  <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Select Subject from Curriculum Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Course Subject ({selectedYear} Year {selectedBranch}) *
              </label>
              <select
                value={subjectCode}
                onChange={e => {
                  const code = e.target.value;
                  setSubjectCode(code);
                  const subs = dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch);
                  const found = subs.find(s => s.subjectCode === code);
                  if (found) {
                    setSubjectName(found.subjectName);
                  }
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-500/40 bg-brand-50/20 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
              >
                {dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch).map(s => (
                  <option key={s.subjectCode} value={s.subjectCode}>
                    {s.subjectName} ({s.subjectCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Syllabus Unit *
              </label>
              <select
                value={unitTitle}
                onChange={e => setUnitTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="Unit 1: Fundamentals & Basic Architecture">Unit 1: Fundamentals & Core Concepts</option>
                <option value="Unit 2: Core Data Structures & Systems">Unit 2: Architecture & Algorithms</option>
                <option value="Unit 3: Advanced Topics & Frameworks">Unit 3: Frameworks & Analysis</option>
                <option value="Unit 4: Security, Design & Deployment">Unit 4: Design & Protocols</option>
                <option value="Unit 5: Applications & Lab Practical">Unit 5: Real-World Applications & Labs</option>
              </select>
            </div>
          </div>

          {/* Material Title & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Document / Material Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Unit-1 Hand-written Lecture Notes & Formulas"
                value={materialTitle}
                onChange={e => setMaterialTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Description
              </label>
              <input
                type="text"
                placeholder="e.g. Includes solved PYQs and architecture diagrams"
                value={materialDesc}
                onChange={e => setMaterialDesc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>
          </div>

          {/* File Input Box */}
          <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 mx-auto flex items-center justify-center">
              <FileUp className="w-6 h-6" />
            </div>
            <div>
              <label htmlFor="file-upload" className="cursor-pointer text-sm font-bold text-brand-600 dark:text-brand-400 hover:underline">
                Click to Choose File (PDF, Images, DOCX, PPT)
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.docx,.pptx"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-xs text-slate-400 mt-1">Supports PDF, PNG, JPG, DOCX up to 15MB</p>
            </div>

            {fileObject && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Selected: {fileObject.name} ({(fileObject.size / 1024).toFixed(0)} KB)</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading || !fileObject}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Upload className="w-5 h-5" />
            {uploading ? 'Uploading PDF Document...' : 'Upload File for Students'}
          </button>

        </form>
      </div>

      {/* Uploaded Files Management List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
          Your Uploaded Files & Documents ({uploadedFilesList.length})
        </h3>

        <div className="space-y-4">
          {uploadedFilesList.map((file) => (
            <div key={file.id} className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center shrink-0">
                  {file.fileType?.includes('pdf') ? <FileType className="w-6 h-6 text-red-500" /> : <ImageIcon className="w-6 h-6 text-blue-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
                      {file.yearId} Year • {file.branchId} • {file.subjectCode}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{file.fileSize}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    {file.title}
                  </h4>
                  <p className="text-xs text-slate-500">
                    File: <span className="font-mono text-slate-700 dark:text-slate-300">{file.fileName}</span> • Uploaded: {file.uploadedAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={file.fileData}
                  download={file.fileName}
                  className="px-3.5 py-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200 text-xs font-bold flex items-center gap-1.5 hover:bg-brand-100"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>

                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete File"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}

          {uploadedFilesList.length === 0 && (
            <div className="p-8 rounded-2xl glass-card text-center text-slate-500 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">No uploaded files found.</p>
              <p className="text-xs">Use the upload form above to attach PDF documents for students.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
