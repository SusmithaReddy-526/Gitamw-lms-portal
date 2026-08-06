// Database Service for GITAMW Autonomous LMS Portal
// Manages Students, Faculty, Admin, Notices, Curriculum (JNTUA Autonomous), Uploaded Files (PDF/Images), and Profiles.

const STORAGE_KEYS = {
  USERS: 'lms_v30_users_db',
  FACULTY: 'lms_v30_faculty_db',
  ADMINS: 'lms_v30_admins_db',
  NOTICES: 'lms_v30_notices_db',
  CURRICULUM: 'lms_v30_curriculum_db',
  UPLOADED_FILES: 'lms_v30_uploaded_files_db',
  DOWNLOADS: 'lms_v30_user_downloads',
  ATTENDANCE: 'lms_v30_attendance_db',
  REGISTERED_ROLES: 'lms_v30_registered_roles_history'
};

// 4 Active Branches (MECH, CIVIL, IT removed as requested)
export const BRANCHES = [
  { id: 'CSE', name: 'Computer Science & Engineering', code: 'CSE', icon: 'Code', color: 'from-blue-500 to-indigo-600' },
  { id: 'AIML', name: 'Artificial Intelligence & Machine Learning', code: 'AIML', icon: 'Cpu', color: 'from-purple-500 to-pink-600' },
  { id: 'ECE', name: 'Electronics & Communication Engineering', code: 'ECE', icon: 'Radio', color: 'from-cyan-500 to-blue-600' },
  { id: 'EEE', name: 'Electrical & Electronics Engineering', code: 'EEE', icon: 'Zap', color: 'from-amber-500 to-orange-600' }
];

export const YEARS = [
  { id: '1st', title: '1st Year', description: 'Engineering Sciences, Physics, Chemistry & C Programming', sem: ['Sem 1', 'Sem 2'] },
  { id: '2nd', title: '2nd Year', description: 'Core Engineering Foundations, Data Structures & Circuits', sem: ['Sem 3', 'Sem 4'] },
  { id: '3rd', title: '3rd Year', description: 'Advanced Specializations, AI, Networks & Systems', sem: ['Sem 5', 'Sem 6'] },
  { id: '4th', title: '4th Year', description: 'Deep Electives, IoT, Major Capstone Project & Internship', sem: ['Sem 7', 'Sem 8'] }
];

// Pre-seeded Faculty Accounts
const INITIAL_FACULTY = [
  {
    id: 'fac-101',
    fullName: 'Dr. Vikram Sharma',
    employeeId: 'EMP-CSE-01',
    department: 'CSE',
    email: 'vikram.sharma@gitamw.edu.in',
    username: 'EMP-CSE-01',
    password: 'password123',
    role: 'faculty',
    subjects: ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks']
  },
  {
    id: 'fac-102',
    fullName: 'Prof. Ananya Roy',
    employeeId: 'EMP-AIML-02',
    department: 'AIML',
    email: 'ananya.roy@gitamw.edu.in',
    username: 'EMP-AIML-02',
    password: 'password123',
    role: 'faculty',
    subjects: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning']
  },
  {
    id: 'fac-103',
    fullName: 'Dr. K. Srinivas',
    employeeId: 'EMP-ECE-03',
    department: 'ECE',
    email: 'srinivas.k@gitamw.edu.in',
    username: 'EMP-ECE-03',
    password: 'password123',
    role: 'faculty',
    subjects: ['Digital Logic Design', 'VLSI Design', 'Signals & Systems']
  },
  {
    id: 'fac-104',
    fullName: 'Prof. M. Ramesh',
    employeeId: 'EMP-EEE-04',
    department: 'EEE',
    email: 'ramesh.m@gitamw.edu.in',
    username: 'EMP-EEE-04',
    password: 'password123',
    role: 'faculty',
    subjects: ['Power Electronics', 'Control Systems', 'Electrical Machines']
  }
];

// Pre-seeded Campus Announcements
const INITIAL_NOTICES = [
  {
    id: 'not-1',
    title: 'JNTUA Autonomous Mid-Semester Examination Schedule 2026',
    date: '2026-08-01',
    category: 'Exam',
    author: 'Academic Registrar',
    content: 'The B.Tech Mid-Semester examinations for 1st, 2nd, 3rd, and 4th Year CSE, AIML, ECE, and EEE students will commence from September 10th, 2026. Hall tickets will be issued on the portal.'
  },
  {
    id: 'not-2',
    title: 'JNTUA Innovation & National Tech Symposium 2026',
    date: '2026-07-28',
    category: 'Event',
    author: 'GITAMW Academic Board',
    content: 'Registration is open for the National Technical Symposium covering Web Dev, Robotics, Circuit Design, and Machine Learning. Cash awards up to $5,000 for top projects.'
  }
];

// Official Curriculum Database - Contains strictly the user-provided 4th Year CSE Sem 7 subjects
const INITIAL_CURRICULUM = [
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a30602t',
    subjectName: 'Deep Learning',
    subjectCode: '23A30602T',
    sem: 'Sem 7',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a52701c',
    subjectName: 'Management Science',
    subjectCode: '23A52701c',
    sem: 'Sem 7',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a35501t',
    subjectName: 'Internet Of Things',
    subjectCode: '23A35501T',
    sem: 'Sem 7',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a30604a',
    subjectName: 'Computer Vision',
    subjectCode: '23A30604a',
    sem: 'Sem 7',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a05703',
    subjectName: 'Prompt Engineering',
    subjectCode: '23A05703',
    sem: 'Sem 7',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a52702',
    subjectName: 'Gender Sensitization',
    subjectCode: '23A52702',
    sem: 'Sem 7',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a52703',
    subjectName: 'Employability Skills',
    subjectCode: '23A52703',
    sem: 'Sem 7',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  }
];

const INITIAL_UPLOADED_FILES = [];

// Helper to initialize local storage with clean slate (no pre-existing user credentials)
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.FACULTY)) {
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADMINS)) {
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REGISTERED_ROLES)) {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ROLES, JSON.stringify({}));
  }
  localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
  localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(INITIAL_CURRICULUM));
  if (!localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES)) {
    localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(INITIAL_UPLOADED_FILES));
  }
}

// Purge any legacy credentials from previous sessions
try {
  localStorage.removeItem('lms_users_db');
  localStorage.removeItem('lms_faculty_db');
  localStorage.removeItem('lms_admins_db');
  localStorage.removeItem('lms_registered_roles_history');
  localStorage.removeItem('lms_user_auth_session');
} catch {}

initStorage();

export const dbService = {
  // Clear all stored accounts and reset system to 1st-time registration state
  clearAllDataAndReset: () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.FACULTY);
    localStorage.removeItem(STORAGE_KEYS.ADMINS);
    localStorage.removeItem(STORAGE_KEYS.REGISTERED_ROLES);
    localStorage.removeItem(STORAGE_KEYS.UPLOADED_FILES);
    localStorage.removeItem('lms_current_session');
    initStorage();
  },

  // Check if role has registered accounts stored
  hasRegisteredRole: (role) => {
    try {
      const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_ROLES) || '{}');
      return !!history[role];
    } catch {
      return false;
    }
  },

  markRoleRegistered: (role) => {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_ROLES) || '{}');
    history[role] = true;
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ROLES, JSON.stringify(history));
  },

  // --- STUDENT REGISTRATION ---
  registerStudent: (studentData) => {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    
    const existing = users.find(u => 
      u.rollNumber.trim().toLowerCase() === studentData.rollNumber.trim().toLowerCase() && 
      u.branch === studentData.branch
    );
    if (existing) {
      throw new Error(`Roll Number "${studentData.rollNumber}" is already registered in ${studentData.branch} branch. Please proceed to Login.`);
    }

    const bCode = studentData.branch === 'AIML' ? 'AIM' : studentData.branch.substring(0, 3).toUpperCase();
    
    // Clean roll number and extract ONLY last 3 characters to guarantee strictly 6-char username (e.g. 238U1A0561 -> CSE561)
    const rawRoll = studentData.rollNumber.toString().trim().replace(/[^a-zA-Z0-9]/g, '');
    const shortSuffix = rawRoll.length >= 3 ? rawRoll.slice(-3) : rawRoll.padStart(3, '0');
    const username = `${bCode}${shortSuffix}`.toUpperCase(); // STRICTLY 6 CHARACTERS: e.g. CSE561, AIM012

    const usernameExists = users.find(u => u.username === username);
    if (usernameExists) {
      throw new Error(`Generated Username ${username} is already registered. Please proceed to Login.`);
    }

    const newStudent = {
      id: `stud-${Date.now()}`,
      ...studentData,
      username,
      role: 'student',
      registeredAt: new Date().toISOString()
    };

    users.push(newStudent);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    dbService.markRoleRegistered('student');
    return newStudent;
  },

  // --- FACULTY REGISTRATION ---
  registerFaculty: (facultyData) => {
    const faculty = JSON.parse(localStorage.getItem(STORAGE_KEYS.FACULTY) || '[]');
    const cleanEmpId = facultyData.employeeId.trim().toUpperCase();

    const existing = faculty.find(f => 
      f.employeeId.toUpperCase() === cleanEmpId || 
      f.email.toLowerCase() === facultyData.email.trim().toLowerCase()
    );
    if (existing) {
      throw new Error(`Faculty with Employee ID ${cleanEmpId} or Email is already registered. Please log in.`);
    }

    const rawEmp = cleanEmpId.replace(/[^a-zA-Z0-9]/g, '');
    const empNum = rawEmp.length >= 3 ? rawEmp.slice(-3) : rawEmp.padStart(3, '0');
    const username = `FAC${empNum}`.toUpperCase(); // STRICTLY 6 CHARACTERS: e.g. FAC012

    const newFaculty = {
      id: `fac-${Date.now()}`,
      fullName: facultyData.fullName || facultyData.name,
      employeeId: cleanEmpId,
      department: facultyData.department,
      email: facultyData.email,
      username: username,
      password: facultyData.password,
      role: 'faculty',
      createdAt: new Date().toISOString()
    };

    faculty.push(newFaculty);
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
    dbService.markRoleRegistered('faculty');
    return newFaculty;
  },

  // --- ADMIN REGISTRATION ---
  registerAdmin: (adminData) => {
    const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    const cleanUser = adminData.username.trim().toLowerCase();

    const existing = admins.find(a => a.username.toLowerCase() === cleanUser || a.email.toLowerCase() === adminData.email.trim().toLowerCase());
    if (existing) {
      throw new Error(`Admin account "${adminData.username}" is already registered. Please log in.`);
    }

    const rawAdmin = cleanUser.replace(/[^a-zA-Z0-9]/g, '');
    const adminNum = rawAdmin.length >= 3 ? rawAdmin.slice(-3) : rawAdmin.padStart(3, '0');
    const username = `ADM${adminNum}`.toUpperCase(); // STRICTLY 6 CHARACTERS: e.g. ADM001

    const newAdmin = {
      id: `admin-${Date.now()}`,
      fullName: adminData.fullName,
      username: username,
      email: adminData.email,
      password: adminData.password,
      role: 'admin',
      department: 'Academic Administration',
      createdAt: new Date().toISOString()
    };

    admins.push(newAdmin);
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
    dbService.markRoleRegistered('admin');
    return newAdmin;
  },

  // --- LOGIN ---
  loginUser: (username, password) => {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // Check Admins
    const admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    const foundAdmin = admins.find(a => 
      (a.username.toLowerCase() === cleanUser || a.email.toLowerCase() === cleanUser) && 
      a.password === cleanPass
    );
    if (foundAdmin) return foundAdmin;

    // Hardcoded Admin Fallback
    if ((cleanUser === 'admin' || cleanUser === 'admin@gitamw.edu.in') && cleanPass === 'admin123') {
      return {
        id: 'admin-001',
        fullName: 'Dr. Sarah Jenkins',
        username: 'admin',
        role: 'admin',
        department: 'Academic Administration',
        email: 'admin@gitamw.edu.in'
      };
    }

    // Check Faculty
    const faculty = JSON.parse(localStorage.getItem(STORAGE_KEYS.FACULTY) || '[]');
    const foundFaculty = faculty.find(f => 
      (f.username.toLowerCase() === cleanUser || f.email.toLowerCase() === cleanUser || f.employeeId.toLowerCase() === cleanUser) && 
      f.password === cleanPass
    );
    if (foundFaculty) return foundFaculty;

    // Check Students
    const students = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    const foundStudent = students.find(s => 
      (
        s.username.toLowerCase() === cleanUser || 
        s.email.toLowerCase() === cleanUser ||
        s.rollNumber.toString().toLowerCase() === cleanUser ||
        s.rollNumber.toString().padStart(3, '0') === cleanUser
      ) && 
      s.password === cleanPass
    );
    if (foundStudent) return foundStudent;

    throw new Error('Invalid Username or Password. Please check your credentials or register first.');
  },

  // --- PROFILE UPDATES ---
  updateUserProfile: (userObj, updateData) => {
    if (!userObj) throw new Error('User not logged in.');

    const role = userObj.role;

    if (role === 'student') {
      let students = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const idx = students.findIndex(s => s.id === userObj.id || s.username === userObj.username);
      if (idx !== -1) {
        delete updateData.rollNumber;
        delete updateData.username;
        students[idx] = { ...students[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(students));
        return students[idx];
      }
    } else if (role === 'faculty') {
      let faculty = JSON.parse(localStorage.getItem(STORAGE_KEYS.FACULTY) || '[]');
      const idx = faculty.findIndex(f => f.id === userObj.id || f.username === userObj.username);
      if (idx !== -1) {
        delete updateData.employeeId;
        delete updateData.username;
        faculty[idx] = { ...faculty[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
        return faculty[idx];
      }
    } else if (role === 'admin') {
      let admins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
      const idx = admins.findIndex(a => a.id === userObj.id || a.username === userObj.username);
      if (idx !== -1) {
        delete updateData.username;
        admins[idx] = { ...admins[idx], ...updateData };
        localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins));
        return admins[idx];
      }
    }

    throw new Error('User profile record not found.');
  },

  // --- FACULTY FILE UPLOAD & MANAGEMENT ---
  getUploadedFiles: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES) || '[]');
  },

  getUploadedFilesForUnit: (yearId, branchId, subjectId, unitId, subjectCode, unitTitle) => {
    const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES) || '[]');
    const cleanSubId = (subjectId || '').toLowerCase().trim();
    const cleanSubCode = (subjectCode || '').toLowerCase().trim();
    
    // Helper to extract exact Unit Number (1 to 5) from unitId, unitTitle or string
    const extractUnitNum = (str) => {
      if (!str) return null;
      const match = str.toLowerCase().match(/unit\s*[-_]?\s*([1-5])/);
      return match ? match[1] : null;
    };

    const targetNum = extractUnitNum(unitId) || extractUnitNum(unitTitle);

    return files.filter(f => {
      // Subject Match (by subjectId or subjectCode)
      const subMatch = 
        (!cleanSubId && !cleanSubCode) ? true :
        (f.subjectId && f.subjectId.toLowerCase().trim() === cleanSubId) ||
        (f.subjectCode && f.subjectCode.toLowerCase().trim() === cleanSubCode) ||
        (f.subjectCode && cleanSubId && f.subjectCode.toLowerCase().trim() === cleanSubId) ||
        (f.subjectId && cleanSubCode && f.subjectId.toLowerCase().trim() === cleanSubCode);

      // Strict Unit Number Match (Unit 1 file -> Unit 1 page ONLY, Unit 2 file -> Unit 2 page ONLY)
      const fileNum = extractUnitNum(f.unitId) || extractUnitNum(f.unitTitle);

      const unitMatch = (targetNum && fileNum) 
        ? targetNum === fileNum 
        : (f.unitId && f.unitId.toLowerCase().trim() === (unitId || '').toLowerCase().trim());

      return subMatch && unitMatch;
    });
  },

  saveFacultyUploadedFile: (fileRecord) => {
    const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES) || '[]');
    const newFile = {
      id: `file-${Date.now()}`,
      ...fileRecord,
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    files.unshift(newFile);
    localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(files));
    return newFile;
  },

  deleteUploadedFile: (fileId) => {
    let files = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES) || '[]');
    files = files.filter(f => f.id !== fileId);
    localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(files));
  },

  // --- FACULTY MANAGEMENT ---
  getFacultyList: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FACULTY) || '[]');
  },

  addFaculty: (facultyData) => {
    return dbService.registerFaculty(facultyData);
  },

  deleteFaculty: (id) => {
    let faculty = JSON.parse(localStorage.getItem(STORAGE_KEYS.FACULTY) || '[]');
    faculty = faculty.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
  },

  // --- STUDENT MANAGEMENT ---
  getStudentsList: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  deleteStudent: (id) => {
    let students = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    students = students.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(students));
  },

  // --- NOTICES ---
  getNotices: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES) || '[]');
  },

  addNotice: (noticeData) => {
    const notices = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES) || '[]');
    const newNotice = {
      id: `not-${Date.now()}`,
      ...noticeData,
      date: new Date().toISOString().split('T')[0]
    };
    notices.unshift(newNotice);
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    return newNotice;
  },

  deleteNotice: (id) => {
    let notices = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES) || '[]');
    notices = notices.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
  },

  // --- CURRICULUM & SUBJECTS ---
  getCurriculum: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
  },

  getSubjectsForBranchAndYear: (yearId, branchId) => {
    const curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    return curriculum.filter(item => item.yearId === yearId && item.branchId === branchId);
  },

  saveSubjectUnits: (yearId, branchId, subjectName, subjectCode, unitsData) => {
    const curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    const subjectId = subjectCode.toLowerCase().replace(/[^a-z0-9]/g, '');

    const existingIdx = curriculum.findIndex(c => c.yearId === yearId && c.branchId === branchId && c.subjectId === subjectId);
    
    const subjectRecord = {
      yearId,
      branchId,
      subjectId,
      subjectName,
      subjectCode,
      units: unitsData,
      updatedAt: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      const existingSubject = curriculum[existingIdx];
      const mergedUnits = [...existingSubject.units];
      
      unitsData.forEach(newUnit => {
        const uIdx = mergedUnits.findIndex(u => u.unitId === newUnit.unitId || u.title === newUnit.title);
        if (uIdx !== -1) {
          mergedUnits[uIdx] = newUnit;
        } else {
          mergedUnits.push(newUnit);
        }
      });
      subjectRecord.units = mergedUnits;
      curriculum[existingIdx] = subjectRecord;
    } else {
      curriculum.push(subjectRecord);
    }

    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
    return subjectRecord;
  },

  deleteSubject: (yearId, branchId, subjectId) => {
    let curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    curriculum = curriculum.filter(c => !(c.yearId === yearId && c.branchId === branchId && c.subjectId === subjectId));
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
  },

  // --- DOWNLOADS & SAVED TOPICS ---
  getUserDownloads: (userId) => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADS) || '[]');
      if (Array.isArray(data)) return data;
      const allList = [];
      Object.values(data).forEach(arr => {
        if (Array.isArray(arr)) allList.push(...arr);
      });
      return allList;
    } catch {
      return [];
    }
  },

  saveUserDownload: (userId, itemRecord) => {
    try {
      let downloads = dbService.getUserDownloads(userId);
      const existingIdx = downloads.findIndex(item => item.id === itemRecord.id || item.fileName === itemRecord.fileName);
      const recordToSave = {
        ...itemRecord,
        userId: userId || 'guest',
        savedAt: new Date().toISOString()
      };
      if (existingIdx === -1) {
        downloads.unshift(recordToSave);
      } else {
        downloads[existingIdx] = recordToSave;
      }
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
    } catch (err) {
      console.error('saveUserDownload error:', err);
    }
  },

  deleteUserDownload: (userId, fileId) => {
    try {
      let downloads = dbService.getUserDownloads(userId);
      downloads = downloads.filter(item => item.id !== fileId);
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
    } catch (err) {
      console.error('deleteUserDownload error:', err);
    }
  },

  // --- ATTENDANCE MANAGEMENT ---
  getAttendanceRecords: () => {
    try {
      const records = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
      if (records.length > 0) return records;

      const initialList = [
        { rollNumber: '238U1A0561', studentName: 'CSE Student', yearId: '4th', branchId: 'CSE', subjectCode: '23A30602T', subjectName: 'Deep Learning', totalClasses: 45, attendedClasses: 40, percentage: 88.9 },
        { rollNumber: '238U1A0561', studentName: 'CSE Student', yearId: '4th', branchId: 'CSE', subjectCode: '23A52701c', subjectName: 'Management Science', totalClasses: 40, attendedClasses: 36, percentage: 90.0 },
        { rollNumber: '238U1A0561', studentName: 'CSE Student', yearId: '4th', branchId: 'CSE', subjectCode: '23A35501T', subjectName: 'Internet Of Things', totalClasses: 42, attendedClasses: 35, percentage: 83.3 },
        { rollNumber: '238U1A0561', studentName: 'CSE Student', yearId: '4th', branchId: 'CSE', subjectCode: '23A30604a', subjectName: 'Computer Vision', totalClasses: 38, attendedClasses: 33, percentage: 86.8 },
        { rollNumber: '238U1A0561', studentName: 'CSE Student', yearId: '4th', branchId: 'CSE', subjectCode: '23A05703', subjectName: 'Prompt Engineering', totalClasses: 35, attendedClasses: 32, percentage: 91.4 },
        { rollNumber: '238U1A0561', studentName: 'CSE Student', yearId: '4th', branchId: 'CSE', subjectCode: '23A52702', subjectName: 'Gender Sensitization', totalClasses: 30, attendedClasses: 27, percentage: 90.0 },
        { rollNumber: '238U1A0561', studentName: 'CSE Student', yearId: '4th', branchId: 'CSE', subjectCode: '23A52703', subjectName: 'Employability Skills', totalClasses: 36, attendedClasses: 31, percentage: 86.1 }
      ];

      localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(initialList));
      return initialList;
    } catch {
      return [];
    }
  },

  saveAttendanceRecord: (newRecord) => {
    let records = dbService.getAttendanceRecords();
    const existingIdx = records.findIndex(r => 
      r.rollNumber.toUpperCase() === newRecord.rollNumber.toUpperCase() && 
      r.subjectCode === newRecord.subjectCode
    );
    if (existingIdx !== -1) {
      records[existingIdx] = { ...records[existingIdx], ...newRecord };
    } else {
      records.unshift(newRecord);
    }
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
    return newRecord;
  },

  getStudentAttendance: (rollNumber) => {
    const records = dbService.getAttendanceRecords();
    const cleanRoll = (rollNumber || '238U1A0561').toString().toUpperCase().trim();
    const found = records.filter(r => r.rollNumber.toUpperCase() === cleanRoll || cleanRoll.includes(r.rollNumber.toUpperCase()));
    if (found.length > 0) return found;
    return records;
  }
};
