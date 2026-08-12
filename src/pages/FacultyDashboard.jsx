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
  const [selectedDept, setSelectedDept] = useState(null); // 'CSE' | 'AIML' | 'ECE' | 'EEE'
  const [selectedFacultyMember, setSelectedFacultyMember] = useState(null);
  const [activeTabMode, setActiveTabMode] = useState('upload-material'); // 'upload-material' | 'add-subject' | 'manage-syllabus'

  // Fetch registered faculty list
  const facultyList = dbService.getFacultyList();

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

  // --- 4. PUBLISH ONLINE QUIZ STATE ---
  const [quizTitle, setQuizTitle] = useState('');
  const [quizLink, setQuizLink] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizYear, setQuizYear] = useState('');
  const [quizBranch, setQuizBranch] = useState('');
  const [quizSubjectSelect, setQuizSubjectSelect] = useState('');
  const [quizSuccessMsg, setQuizSuccessMsg] = useState('');
  const [quizErrorMsg, setQuizErrorMsg] = useState('');
  const [quizzesList, setQuizzesList] = useState(() => dbService.getQuizzes());

  // Uploaded Files & Curriculum list
  const [uploadedFilesList, setUploadedFilesList] = useState(() => dbService.getUploadedFiles());
  const [curriculumList, setCurriculumList] = useState(() => dbService.getCurriculum());

  const handlePublishQuizSubmit = (e) => {
    e.preventDefault();
    setQuizSuccessMsg('');
    setQuizErrorMsg('');

    if (!quizYear || !quizBranch || !quizSubjectSelect || !quizTitle.trim() || !quizLink.trim()) {
      setQuizErrorMsg('Please select Academic Year, Branch, Subject, and enter Quiz Title & Quiz Link.');
      return;
    }

    try {
      const parts = quizSubjectSelect.split('|');
      const subCode = parts[0] || '';
      const subName = parts[1] || '';

      const publishedQuiz = dbService.saveQuiz({
        title: quizTitle.trim(),
        quizLink: quizLink.trim(),
        subjectName: subName.trim(),
        subjectCode: subCode.trim(),
        yearId: quizYear,
        branchId: quizBranch,
        description: quizDesc.trim(),
        uploadedBy: selectedFacultyMember?.fullName ? `${selectedFacultyMember.fullName} (${selectedFacultyMember.employeeId || 'Faculty'})` : (user?.fullName || 'Faculty')
      });

      setQuizzesList(dbService.getQuizzes());
      setQuizSuccessMsg(`Successfully published "${publishedQuiz.title}" for ${publishedQuiz.subjectName} (${publishedQuiz.subjectCode})! Appears in Student Portal under QUIZ card.`);

      setQuizTitle('');
      setQuizLink('');
      setQuizDesc('');
      setQuizSubjectSelect('');
    } catch (err) {
      setQuizErrorMsg(err.message || 'Failed to publish quiz.');
    }
  };

  const handleDeleteQuiz = (quizId, qTitle) => {
    if (window.confirm(`Are you sure you want to delete quiz "${qTitle}"?`)) {
      dbService.deleteQuiz(quizId);
      setQuizzesList(dbService.getQuizzes());
    }
  };

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

  // --- LEVEL 1: 4 DEPARTMENT CARDS (CSE, AIML, ECE, EEE) ---
  if (!selectedDept) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Banner Header */}
        <div className="p-8 rounded-3xl aurora-glass-panel text-white shadow-2xl relative overflow-hidden border border-fuchsia-500/30">
          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200 text-xs font-black uppercase tracking-wider border border-fuchsia-400/40 shadow-lg shadow-fuchsia-500/20">
              <Sparkles className="w-4 h-4 text-fuchsia-300" />
              GITAMW Autonomous Faculty Portal
            </div>
            <h1 className="text-4xl sm:text-5xl font-black font-outfit tracking-tight">
              Select Engineering <span className="aurora-text">Department</span>
            </h1>
            <p className="text-sm text-slate-200">
              Click a department below to view its registered Faculty Members & Academic Workspaces.
            </p>
          </div>
        </div>

        {/* 4 DEPARTMENT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANCHES.map(b => {
            const Icon = BRANCH_ICONS[b.id] || BookOpen;
            const deptFaculty = facultyList.filter(f => (f.department || f.branch || '').toUpperCase() === b.id.toUpperCase());

            return (
              <motion.div
                key={b.id}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => setSelectedDept(b.id)}
                className="p-6 rounded-3xl aurora-card cursor-pointer flex flex-col justify-between relative overflow-hidden group shadow-xl border border-cyan-500/30"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-600 text-white flex items-center justify-center text-2xl font-black mb-4 shadow-lg border border-cyan-300/40">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <h3 className="text-2xl font-black text-white font-outfit mb-2 group-hover:text-cyan-300 transition-colors">
                    {b.code}
                  </h3>
                  <p className="text-xs text-slate-300 mb-4 font-medium leading-relaxed">
                    {b.name}
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 text-cyan-300 text-xs font-mono font-bold border border-slate-700">
                    <span>{deptFaculty.length} Registered Faculty</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-black pt-5 border-t border-slate-800 text-cyan-300 group-hover:translate-x-1 transition-transform">
                  <span>View Faculty Members</span>
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  // --- LEVEL 2: FACULTY MEMBERS LIST UNDER SELECTED DEPARTMENT ---
  if (selectedDept && !selectedFacultyMember) {
    const deptFaculty = facultyList.filter(f => (f.department || f.branch || '').toUpperCase() === selectedDept.toUpperCase());
    const deptObj = BRANCHES.find(b => b.id === selectedDept);

    return (
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedDept(null)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Departments
          </button>

          <span className="px-4 py-1.5 rounded-full bg-brand-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-400/40">
            {deptObj?.name || selectedDept} ({selectedDept})
          </span>
        </div>

        {/* Banner */}
        <div className="p-8 rounded-3xl aurora-glass-panel text-white shadow-2xl relative overflow-hidden border border-cyan-500/30">
          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl font-black font-outfit">
              {selectedDept} Department — <span className="aurora-text">Faculty Members Directory</span>
            </h2>
            <p className="text-xs text-slate-200">
              Click a faculty member below to view their profile, subjects handled, and upload unit materials.
            </p>
          </div>
        </div>

        {/* FACULTY MEMBERS LIST GRID */}
        {deptFaculty.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deptFaculty.map(fac => {
              const isCurrentUser = user && (user.employeeId === fac.employeeId || user.fullName === fac.fullName);

              return (
                <motion.div
                  key={fac.id || fac.employeeId}
                  whileHover={{ y: -4 }}
                  onClick={() => {
                    setSelectedFacultyMember(fac);
                    setSelectedBranch(selectedDept);
                  }}
                  className={`p-6 rounded-3xl aurora-card cursor-pointer border flex flex-col justify-between relative overflow-hidden transition-all shadow-xl ${
                    isCurrentUser 
                      ? 'border-fuchsia-400 ring-2 ring-fuchsia-400/50 shadow-fuchsia-500/20' 
                      : 'border-slate-800 hover:border-cyan-400'
                  }`}
                >
                  {isCurrentUser && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-fuchsia-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg border border-fuchsia-300">
                      Your Active Profile
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-black text-xl flex items-center justify-center shadow-lg border border-cyan-300/40">
                        {fac.fullName ? fac.fullName.replace('Dr. ', '').charAt(0) : 'F'}
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-white font-outfit">
                          {fac.fullName}
                        </h3>
                        <p className="text-xs text-cyan-300 font-mono font-bold">
                          Emp ID: {fac.employeeId || 'FAC-01'} • {fac.department || selectedDept} Department
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs text-slate-300 font-mono">
                      <div>📧 Email: <span className="text-white">{fac.email || 'faculty@gitamw.ac.in'}</span></div>
                      <div>📱 Mobile: <span className="text-white">{fac.mobile || 'Registered'}</span></div>
                      {fac.subjectsHandled && (
                        <div className="pt-1 border-t border-slate-800 text-[11px] font-outfit text-amber-300">
                          📚 Subjects Handled: {fac.subjectsHandled.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-black text-cyan-300">
                    <span>Manage Academic Uploads & Subjects</span>
                    <ArrowRight className="w-4 h-4 text-cyan-400" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl glass-card border border-slate-800 text-slate-400 space-y-3">
            <BookOpen className="w-12 h-12 text-cyan-500/40 mx-auto" />
            <h4 className="font-extrabold text-white text-lg">No Faculty Members Registered for {selectedDept} Yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Faculty members registered under {selectedDept} during account sign up will automatically appear here.
            </p>
          </div>
        )}
      </div>
    );
  }

  // --- LEVEL 3: SELECTED FACULTY MEMBER WORKSPACE & UPLOAD TOOLS ---
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSelectedFacultyMember(null)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {selectedDept} Faculty Directory
        </button>

        <span className="px-4 py-1.5 rounded-full bg-brand-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider border border-cyan-400/40">
          Faculty: {selectedFacultyMember.fullName} ({selectedFacultyMember.employeeId})
        </span>
      </div>

      {/* Aurora Banner Header */}
      <div className="p-8 rounded-3xl aurora-glass-panel text-white shadow-2xl relative overflow-hidden border border-fuchsia-500/30">
        <div className="absolute top-0 right-0 w-80 h-80 bg-fuchsia-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-fuchsia-500/20 text-fuchsia-200 text-xs font-black uppercase tracking-wider border border-fuchsia-400/40 shadow-lg shadow-fuchsia-500/20">
            <Sparkles className="w-4 h-4 text-fuchsia-300" />
            {selectedFacultyMember.fullName}'s Academic Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-outfit tracking-tight">
            {selectedFacultyMember.fullName} — <span className="aurora-text">{selectedDept} Academic Control</span>
          </h1>
          <p className="text-xs text-slate-200 font-mono">
            Employee ID: <span className="text-cyan-300 font-bold">{selectedFacultyMember.employeeId}</span> • Department: <span className="text-cyan-300 font-bold">{selectedDept}</span> • Email: <span className="text-cyan-300">{selectedFacultyMember.email}</span>
          </p>
        </div>
      </div>

      {/* Standalone High-Visibility Action Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              ➕ Add New Subject
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
            <h4 className="font-extrabold text-sm">Manage Syllabus</h4>
            <p className={`text-[11px] ${activeTabMode === 'manage-syllabus' ? 'text-indigo-100' : 'text-slate-500'}`}>4 Years &amp; Syllabus PDFs</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTabMode('publish-quiz')}
          className={`p-5 rounded-2xl border text-left flex items-center gap-4 transition-all cursor-pointer ${
            activeTabMode === 'publish-quiz'
              ? 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-xl ring-2 ring-fuchsia-400 scale-[1.02]'
              : 'glass-card border-slate-200 dark:border-slate-800 hover:border-fuchsia-500/50 text-slate-800 dark:text-slate-200'
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl shrink-0 ${activeTabMode === 'publish-quiz' ? 'bg-white/20 text-white' : 'bg-fuchsia-500/10 text-fuchsia-400'}`}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm flex items-center gap-1">
              📝 Publish Online Quiz
            </h4>
            <p className={`text-[11px] ${activeTabMode === 'publish-quiz' ? 'text-fuchsia-100' : 'text-slate-500'}`}>Google Form &amp; Quiz Links</p>
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

      {/* --- MODE 4: PUBLISH ONLINE QUIZ --- */}
      {activeTabMode === 'publish-quiz' && (
        <div className="space-y-8">
          <div className="p-8 rounded-3xl glass-panel border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-fuchsia-500/10 text-fuchsia-500 font-bold flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit">
                  Publish Online Quiz for Specific Subject
                </h3>
                <p className="text-xs text-slate-500">
                  Published quiz links appear strictly inside the target subject's <strong>QUIZ</strong> card in the Student Portal.
                </p>
              </div>
            </div>

            {quizSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{quizSuccessMsg}</span>
              </motion.div>
            )}

            {quizErrorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-rose-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{quizErrorMsg}</span>
              </motion.div>
            )}

            <form onSubmit={handlePublishQuizSubmit} className="space-y-6">
              {/* Year & Branch */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Year *
                  </label>
                  <select
                    value={quizYear}
                    onChange={e => {
                      setQuizYear(e.target.value);
                      setQuizSubjectSelect('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-fuchsia-500 outline-none"
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
                    value={quizBranch}
                    onChange={e => {
                      setQuizBranch(e.target.value);
                      setQuizSubjectSelect('');
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-fuchsia-500 outline-none"
                  >
                    <option value="">-- Select Engineering Branch --</option>
                    {BRANCHES.map(b => (
                      <option key={b.id} value={b.id}>{b.code} - {b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Target Subject Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Course Subject *
                </label>
                <select
                  value={quizSubjectSelect}
                  onChange={e => setQuizSubjectSelect(e.target.value)}
                  disabled={!quizYear || !quizBranch}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-fuchsia-500 outline-none disabled:opacity-50"
                >
                  <option value="">-- Select Target Subject --</option>
                  {quizYear && quizBranch && dbService.getSubjectsForBranchAndYear(quizYear, quizBranch).map(sub => (
                    <option key={sub.id || sub.subjectCode} value={`${sub.subjectCode}|${sub.subjectName}`}>
                      {sub.subjectCode} - {sub.subjectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quiz Title & Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quiz Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={quizTitle}
                    onChange={e => setQuizTitle(e.target.value)}
                    placeholder="e.g. Unit 1-3 Online Test / Mid Quiz"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-fuchsia-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Online Quiz Link / Form URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={quizLink}
                    onChange={e => setQuizLink(e.target.value)}
                    placeholder="e.g. https://forms.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-fuchsia-500 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quiz Instructions / Description (Optional)
                </label>
                <textarea
                  rows="2"
                  value={quizDesc}
                  onChange={e => setQuizDesc(e.target.value)}
                  placeholder="e.g. 20 Multiple Choice Questions. Time limit: 30 minutes."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium focus:ring-2 focus:ring-fuchsia-500 outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
              >
                <Sparkles className="w-5 h-5 text-fuchsia-200" />
                <span>Publish Online Quiz to Student Subject Card</span>
              </button>
            </form>
          </div>

          {/* Published Quizzes Log */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-fuchsia-500" />
              Published Online Quizzes Log ({quizzesList.length})
            </h3>

            {quizzesList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzesList.map(q => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-extrabold uppercase bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                          {q.subjectCode || q.subjectName}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{q.createdAt}</span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-base">
                        {q.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed truncate">
                        Link: {q.quizLink}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">By {q.uploadedBy}</span>
                      <button
                        onClick={() => handleDeleteQuiz(q.id, q.title)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl glass-card text-slate-500 border border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold">No online quizzes published yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
