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
  FileType,
  ImageIcon,
  Download,
  FileUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Code,
  Cpu,
  Radio,
  Zap,
  FolderPlus
} from 'lucide-react';

const BRANCH_ICONS = {
  CSE: Code,
  AIML: Cpu,
  ECE: Radio,
  EEE: Zap
};

export function FacultyDashboard({ user }) {
  const [activeTabMode, setActiveTabMode] = useState('upload-material'); // 'upload-material' | 'add-subject' | 'manage-syllabus'

  // Common selection state
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');

  // --- 1. UNIT MATERIAL UPLOAD STATE ---
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [unitTitle, setUnitTitle] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDesc, setMaterialDesc] = useState('');
  const [fileObject, setFileObject] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // --- 2. ADD NEW SUBJECT STATE ---
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubYear, setNewSubYear] = useState('');
  const [newSubBranch, setNewSubBranch] = useState('');
  const [newSubCredits, setNewSubCredits] = useState('3');
  const [syllabusFileObject, setSyllabusFileObject] = useState(null);
  const [subSuccessMsg, setSubSuccessMsg] = useState('');
  const [subErrorMsg, setSubErrorMsg] = useState('');

  // --- 3. MANAGE SYLLABUS DRILLDOWN STATE (YEAR CARDS -> BRANCH CARDS -> SUBJECTS LIST) ---
  const [sylSelectedYear, setSylSelectedYear] = useState(null); // '1st', '2nd', '3rd', '4th'
  const [sylSelectedBranch, setSylSelectedBranch] = useState(null); // 'CSE', 'AIML', 'ECE', 'EEE'
  const [syllabusUploadSubjectCode, setSyllabusUploadSubjectCode] = useState(null);
  const [singleSyllabusFile, setSingleSyllabusFile] = useState(null);

  // Uploaded Files & Curriculum list
  const [uploadedFilesList, setUploadedFilesList] = useState(() => dbService.getUploadedFiles());
  const [curriculumList, setCurriculumList] = useState(() => dbService.getCurriculum());

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError('File size must be under 15MB.');
        setFileObject(null);
        return;
      }
      setFileObject(file);
      setError('');
    }
  };

  const handleSyllabusFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setSubErrorMsg('Syllabus PDF file size must be under 15MB.');
        setSyllabusFileObject(null);
        return;
      }
      setSyllabusFileObject(file);
      setSubErrorMsg('');
    }
  };

  const handleDirectFileUpload = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!selectedYear || !selectedBranch) {
      setError('Please select Academic Year and Engineering Branch.');
      return;
    }

    if (!subjectName.trim() || !subjectCode.trim() || !unitTitle || !materialTitle.trim() || !fileObject) {
      setError('Please fill out Subject Name, Subject Code, Target Unit, Title, and select a file.');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const fileBase64 = reader.result;

        const newFileRecord = {
          title: materialTitle.trim(),
          description: materialDesc.trim(),
          yearId: selectedYear,
          branchId: selectedBranch,
          subjectName: subjectName.trim(),
          subjectCode: subjectCode.trim().toUpperCase(),
          unitTitle: unitTitle,
          unitId: unitTitle.toLowerCase().replace(/[^a-z0-9]/g, ''),
          fileName: fileObject.name,
          fileType: fileObject.type,
          fileSize: (fileObject.size / 1024 / 1024).toFixed(2) + ' MB',
          fileData: fileBase64,
          uploadedBy: user?.fullName ? `${user.fullName} (${user.employeeId || 'Faculty'})` : 'Faculty'
        };

        dbService.saveFacultyUploadedFile(newFileRecord);
        setUploadedFilesList(dbService.getUploadedFiles());

        setMessage(`Successfully uploaded "${materialTitle}" for ${unitTitle}!`);
        setMaterialTitle('');
        setMaterialDesc('');
        setFileObject(null);
      } catch (err) {
        console.error(err);
        setError('Error reading file. Please try again.');
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file.');
      setUploading(false);
    };

    reader.readAsDataURL(fileObject);
  };

  // --- HANDLE ADDING NEW COURSE SUBJECT ---
  const handleAddNewSubjectSubmit = (e) => {
    e.preventDefault();
    setSubSuccessMsg('');
    setSubErrorMsg('');

    if (!newSubYear || !newSubBranch || !newSubName.trim() || !newSubCode.trim()) {
      setSubErrorMsg('Please fill in Academic Year, Branch, Subject Name, and Subject Code.');
      return;
    }

    const saveSubject = (syllabusDataUrl = null, syllabusName = null) => {
      try {
        const addedSub = dbService.addSubjectToCurriculum({
          subjectName: newSubName.trim(),
          subjectCode: newSubCode.trim().toUpperCase(),
          yearId: newSubYear,
          branchId: newSubBranch,
          credits: parseInt(newSubCredits, 10) || 3,
          syllabusPdfUrl: syllabusDataUrl,
          syllabusFileName: syllabusName,
          addedBy: user?.fullName ? `${user.fullName} (${user.employeeId || 'Faculty'})` : 'Faculty'
        });

        setCurriculumList(dbService.getCurriculum());
        setSubSuccessMsg(`Successfully added "${addedSub.subjectName} (${addedSub.subjectCode})" to ${addedSub.yearId} Year ${addedSub.branchId} Curriculum!`);
        
        // Reset form
        setNewSubName('');
        setNewSubCode('');
        setSyllabusFileObject(null);
      } catch (err) {
        setSubErrorMsg(err.message || 'Failed to add new subject.');
      }
    };

    if (syllabusFileObject) {
      const reader = new FileReader();
      reader.onload = () => {
        saveSubject(reader.result, syllabusFileObject.name);
      };
      reader.readAsDataURL(syllabusFileObject);
    } else {
      saveSubject();
    }
  };

  const handleDeleteFile = (id) => {
    if (window.confirm('Are you sure you want to delete this uploaded file?')) {
      dbService.deleteFacultyUploadedFile(id);
      setUploadedFilesList(dbService.getUploadedFiles());
    }
  };

  const handleDeleteSubject = (subjectCode, subjectName) => {
    if (window.confirm(`Are you sure you want to delete "${subjectName} (${subjectCode})" from department curriculum?`)) {
      dbService.deleteSubjectFromCurriculum(subjectCode);
      setCurriculumList(dbService.getCurriculum());
    }
  };

  // Upload/replace syllabus PDF for existing subject
  const handleUploadSyllabusPDF = (subjectCode, file) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('Syllabus PDF file size must be under 15MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      dbService.updateSubjectSyllabus(subjectCode, reader.result, file.name);
      setCurriculumList(dbService.getCurriculum());
      setSyllabusUploadSubjectCode(null);
      setSingleSyllabusFile(null);
      alert(`Syllabus PDF updated successfully for ${subjectCode}!`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Aurora Banner Header */}
      <div className="p-8 rounded-3xl aurora-glass-panel text-white shadow-2xl relative overflow-hidden border border-fuchsia-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200 text-xs font-black uppercase tracking-wider border border-fuchsia-400/40 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="w-4 h-4 text-fuchsia-300" />
            GITAMW Autonomous Faculty Portal
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-outfit tracking-tight">
            Faculty Curriculum & <span className="aurora-text">Material Control</span>
          </h1>
          <p className="text-sm text-slate-200">
            Welcome, <span className="font-bold text-cyan-300">{user?.fullName || 'Faculty Member'}</span>! Full access to manage 4 years curriculum cards, upload syllabus PDFs, attach unit notes, and delete subjects.
          </p>
        </div>
      </div>

      {/* Standalone High-Visibility Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTabMode('upload-material')}
          className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
            activeTabMode === 'upload-material'
              ? 'bg-brand-600 text-white border-brand-500 shadow-xl ring-2 ring-brand-400 scale-[1.02]'
              : 'glass-card border-slate-200 dark:border-slate-800 hover:border-brand-500/50 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${activeTabMode === 'upload-material' ? 'bg-white/20 text-white' : 'bg-brand-500/10 text-brand-500'}`}>
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Upload Study Material</h4>
            <p className={`text-[11px] ${activeTabMode === 'upload-material' ? 'text-brand-100' : 'text-slate-500'}`}>Attach PDF notes for Unit 1-5</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTabMode('add-subject')}
          className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
            activeTabMode === 'add-subject'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-xl ring-2 ring-emerald-400 scale-[1.02]'
              : 'glass-card border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${activeTabMode === 'add-subject' ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm flex items-center gap-1">
              ➕ Add New Course Subject
            </h4>
            <p className={`text-[11px] ${activeTabMode === 'add-subject' ? 'text-emerald-100' : 'text-slate-500'}`}>Create new subject in curriculum</p>
          </div>
        </button>

        <button
          onClick={() => {
            setActiveTabMode('manage-syllabus');
            setSylSelectedYear(null);
            setSylSelectedBranch(null);
          }}
          className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
            activeTabMode === 'manage-syllabus'
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-xl ring-2 ring-indigo-400 scale-[1.02]'
              : 'glass-card border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${activeTabMode === 'manage-syllabus' ? 'bg-white/20 text-white' : 'bg-indigo-500/10 text-indigo-500'}`}>
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Manage Department Syllabus</h4>
            <p className={`text-[11px] ${activeTabMode === 'manage-syllabus' ? 'text-indigo-100' : 'text-slate-500'}`}>4 Years Cards &amp; Branch Hierarchy</p>
          </div>
        </button>
      </div>

      {/* --- MODE 1: UPLOAD UNIT STUDY MATERIAL --- */}
      {activeTabMode === 'upload-material' && (
        <div className="space-y-8">
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-500 font-bold flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                  Upload PDF / Material for Specific Unit
                </h3>
                <p className="text-xs text-slate-500">Files uploaded here appear strictly inside the student's selected Unit page.</p>
              </div>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{message}</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleDirectFileUpload} className="space-y-6">
              {/* Year, Semester & Branch */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={selectedYear}
                    onChange={e => {
                      setSelectedYear(e.target.value);
                      setSubjectName('');
                      setSubjectCode('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="">-- Select Academic Year --</option>
                    {YEARS.map(y => (
                      <option key={y.id} value={y.id}>{y.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Engineering Branch *
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={e => {
                      setSelectedBranch(e.target.value);
                      setSubjectName('');
                      setSubjectCode('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="">-- Select Engineering Branch --</option>
                    {BRANCHES.map(b => (
                      <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Subject *
                  </label>
                  <select
                    value={subjectCode}
                    onChange={e => {
                      const code = e.target.value;
                      setSubjectCode(code);
                      const found = dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch).find(s => s.subjectCode === code);
                      if (found) setSubjectName(found.subjectName);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-500/40 bg-brand-50/20 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="">-- Select Course Subject --</option>
                    {selectedYear && selectedBranch && dbService.getSubjectsForBranchAndYear(selectedYear, selectedBranch).map(s => (
                      <option key={s.subjectCode} value={s.subjectCode}>
                        {s.subjectName} ({s.subjectCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Unit & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Syllabus Unit *
                  </label>
                  <select
                    value={unitTitle}
                    onChange={e => setUnitTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-brand-600 focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="">-- Select Target Unit --</option>
                    <option value="Unit-1">Unit-1</option>
                    <option value="Unit-2">Unit-2</option>
                    <option value="Unit-3">Unit-3</option>
                    <option value="Unit-4">Unit-4</option>
                    <option value="Unit-5">Unit-5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Material / Document Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Unit-1 Detailed Lecture Notes PDF"
                    value={materialTitle}
                    onChange={e => setMaterialTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select Document File (PDF / Images, Max 15MB) *
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-500 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading ? 'Uploading Document...' : 'Upload & Attach Document to Selected Unit'}
              </button>
            </form>
          </div>

          {/* Uploaded Files Management List */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
              Your Uploaded Files ({uploadedFilesList.length})
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
                          {file.yearId} Year • {file.branchId} • {file.subjectCode} • {file.unitTitle}
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
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- MODE 2: ADD NEW COURSE SUBJECT --- */}
      {activeTabMode === 'add-subject' && (
        <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 font-bold flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                Add New Course Subject to Curriculum
              </h3>
              <p className="text-xs text-slate-500">Add a new official subject with course code, credits, and syllabus document.</p>
            </div>
          </div>

          {subSuccessMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{subSuccessMsg}</span>
            </motion.div>
          )}

          {subErrorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{subErrorMsg}</span>
            </motion.div>
          )}

          <form onSubmit={handleAddNewSubjectSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Year *
                </label>
                <select
                  value={newSubYear}
                  onChange={e => setNewSubYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">-- Select Academic Year --</option>
                  {YEARS.map(y => (
                    <option key={y.id} value={y.id}>{y.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Engineering Branch *
                </label>
                <select
                  value={newSubBranch}
                  onChange={e => setNewSubBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option value="">-- Select Engineering Branch --</option>
                  {BRANCHES.map(b => (
                    <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Generative AI & Large Language Models"
                  value={newSubName}
                  onChange={e => setNewSubName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 23A30605T"
                  value={newSubCode}
                  onChange={e => setNewSubCode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold font-mono uppercase focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Syllabus PDF Attachment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Syllabus Document PDF (Optional)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleSyllabusFileChange}
                className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Subject to Department Curriculum
            </button>
          </form>
        </div>
      )}

      {/* --- MODE 3: MANAGE DEPARTMENT SYLLABUS (DRILLDOWN: 4 YEAR CARDS -> BRANCH CARDS -> SUBJECTS) --- */}
      {activeTabMode === 'manage-syllabus' && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-500" />
                Department Syllabus & Curriculum Manager
              </h3>
              <p className="text-xs text-slate-500">
                {!sylSelectedYear 
                  ? 'Select an Academic Year card below to manage department subjects.' 
                  : !sylSelectedBranch 
                  ? `Selected: ${sylSelectedYear} Year • Now select an Engineering Branch card below.`
                  : `Selected: ${sylSelectedYear} Year ${sylSelectedBranch} • Manage subjects, upload syllabus PDFs, or delete subjects.`
                }
              </p>
            </div>

            <div className="flex items-center gap-2">
              {sylSelectedBranch && (
                <button
                  onClick={() => setSylSelectedBranch(null)}
                  className="px-3.5 py-2 rounded-xl glass-card text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Branches
                </button>
              )}

              {sylSelectedYear && (
                <button
                  onClick={() => {
                    setSylSelectedYear(null);
                    setSylSelectedBranch(null);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to 4 Years Cards
                </button>
              )}
            </div>
          </div>

          {/* STEP 1: 4 ACADEMIC YEAR CARDS (1st, 2nd, 3rd, 4th Year) */}
          {!sylSelectedYear && (
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
                Select Academic Year (4 Years Cards)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {YEARS.map(yItem => (
                  <motion.div
                    key={yItem.id}
                    whileHover={{ y: -6, scale: 1.02 }}
                    onClick={() => setSylSelectedYear(yItem.id)}
                    className="p-7 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 font-extrabold flex items-center justify-center text-xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <GraduationCap className="w-7 h-7" />
                      </div>
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                          {yItem.sem.join(' & ')}
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white font-outfit mt-2">
                          {yItem.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                          {yItem.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-500 group-hover:translate-x-1 transition-transform">
                      <span>Select Branch Cards</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: ENGINEERING BRANCH CARDS (CSE, AIML, ECE, EEE) FOR SELECTED YEAR */}
          {sylSelectedYear && !sylSelectedBranch && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold uppercase text-slate-400 tracking-wider">
                  Select Engineering Branch for {sylSelectedYear} Year
                </h4>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold">
                  {sylSelectedYear} Year Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {BRANCHES.map(bItem => {
                  const BIcon = BRANCH_ICONS[bItem.code] || Code;

                  return (
                    <motion.div
                      key={bItem.id}
                      whileHover={{ y: -6, scale: 1.02 }}
                      onClick={() => setSylSelectedBranch(bItem.id)}
                      className="p-7 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 hover:border-indigo-500 shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 font-extrabold flex items-center justify-center text-xl shadow-inner group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <BIcon className="w-7 h-7" />
                        </div>
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300">
                            {bItem.code} Department
                          </span>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white font-outfit mt-2">
                            {bItem.name}
                          </h3>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-500 group-hover:translate-x-1 transition-transform">
                        <span>Manage {bItem.code} Subjects</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: SUBJECT CARDS LIST FOR SELECTED YEAR & BRANCH (FULL FACULTY EDIT/DELETE ACCESS) */}
          {sylSelectedYear && sylSelectedBranch && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white font-outfit">
                    {sylSelectedYear} Year {sylSelectedBranch} Course Subjects
                  </h4>
                  <p className="text-xs text-slate-500">
                    Faculty access: Upload Syllabus PDF, attach unit materials, or delete subjects from curriculum.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActiveTabMode('add-subject');
                    setNewSubYear(sylSelectedYear);
                    setNewSubBranch(sylSelectedBranch);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Subject to {sylSelectedYear} Year {sylSelectedBranch}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {curriculumList
                  .filter(sub => sub.yearId === sylSelectedYear && sub.branchId === sylSelectedBranch)
                  .map((sub, idx) => (
                    <div key={idx} className="p-6 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 space-y-5 shadow-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-extrabold uppercase bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-indigo-200">
                              {sub.subjectCode}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {sub.semester || 'Sem 7'} • Credits: {sub.credits || 3}
                            </span>
                          </div>

                          <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                            {sub.subjectName}
                          </h4>
                        </div>

                        {/* Faculty Delete Subject Button */}
                        <button
                          onClick={() => handleDeleteSubject(sub.subjectCode, sub.subjectName)}
                          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete Subject from Curriculum"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Syllabus PDF & Unit Material Action Bar */}
                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 text-slate-500 font-semibold">
                            <FileText className="w-4 h-4 text-indigo-500" />
                            <span>Syllabus PDF: <strong>{sub.syllabusFileName || 'Not Uploaded'}</strong></span>
                          </div>

                          {sub.syllabusPdfUrl && (
                            <a
                              href={sub.syllabusPdfUrl}
                              download={sub.syllabusFileName || `${sub.subjectCode}_Syllabus.pdf`}
                              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 font-bold border border-indigo-200 flex items-center gap-1.5 hover:bg-indigo-100"
                            >
                              <Download className="w-3.5 h-3.5" />
                              View Syllabus PDF
                            </a>
                          )}
                        </div>

                        {/* Upload / Replace Syllabus PDF */}
                        {syllabusUploadSubjectCode === sub.subjectCode ? (
                          <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 space-y-2">
                            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">
                              Select New Syllabus Document PDF (Max 15MB):
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={e => setSingleSyllabusFile(e.target.files[0])}
                              className="w-full text-xs text-slate-500 cursor-pointer"
                            />
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => handleUploadSyllabusPDF(sub.subjectCode, singleSyllabusFile)}
                                disabled={!singleSyllabusFile}
                                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 disabled:opacity-50 cursor-pointer"
                              >
                                Save &amp; Upload PDF
                              </button>
                              <button
                                onClick={() => setSyllabusUploadSubjectCode(null)}
                                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSyllabusUploadSubjectCode(sub.subjectCode)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                            >
                              <Upload className="w-3.5 h-3.5 text-indigo-500" />
                              {sub.syllabusPdfUrl ? 'Replace Syllabus PDF' : 'Upload Syllabus PDF'}
                            </button>

                            <button
                              onClick={() => {
                                setActiveTabMode('upload-material');
                                setSelectedYear(sub.yearId);
                                setSelectedBranch(sub.branchId);
                                setSubjectCode(sub.subjectCode);
                                setSubjectName(sub.subjectName);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-brand-200"
                            >
                              <FolderPlus className="w-3.5 h-3.5" />
                              Upload Unit Notes
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                {curriculumList.filter(sub => sub.yearId === sylSelectedYear && sub.branchId === sylSelectedBranch).length === 0 && (
                  <div className="p-12 text-center rounded-3xl glass-card text-slate-500 col-span-2 space-y-3">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                      No Subjects Registered for {sylSelectedYear} Year {sylSelectedBranch}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Click the green "Add New Subject" button above to add subjects for this department.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
