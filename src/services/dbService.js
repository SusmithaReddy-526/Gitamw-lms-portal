// Database Service for GITAMW Autonomous LMS Portal
// Manages Students, Faculty, Admin, Notices, Curriculum (JNTUA Autonomous), Uploaded Files (PDF/Images), and Profiles.

const STORAGE_KEYS = {
  USERS: 'gitamw_lms_fresh_users_db',
  FACULTY: 'gitamw_lms_fresh_faculty_db',
  ADMINS: 'gitamw_lms_fresh_admins_db',
  NOTICES: 'gitamw_lms_perm_notices_db',
  CURRICULUM: 'gitamw_lms_perm_curriculum_db',
  UPLOADED_FILES: 'gitamw_lms_perm_uploaded_files_db',
  DOWNLOADS: 'gitamw_lms_perm_user_downloads',
  ATTENDANCE: 'gitamw_lms_perm_attendance_db',
  REGISTERED_ROLES: 'gitamw_lms_fresh_registered_roles_history'
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

// Pre-seeded Faculty Accounts (Empty by default - Users register via Registration page)
const INITIAL_FACULTY = [];

// Pre-seeded Student Accounts (Empty by default - Users register via Registration page)
const INITIAL_STUDENTS = [];

// Pre-seeded Attendance Records (Empty by default - Faculty post attendance)
const INITIAL_ATTENDANCE = [];

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

// Official Curriculum Database - Strictly 3rd Year CSE Sem 5 & 4th Year CSE Sem 7 subjects
const INITIAL_CURRICULUM = [
  // --- 3RD YEAR CSE (SEM 5) STRICT USER SUBJECTS ---
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05501t',
    subjectName: 'Computer Networks & Internet Protocols',
    subjectCode: '23A05501T',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05504a',
    subjectName: 'Object Oriented Analysis & Design',
    subjectCode: '23A05504a',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05502',
    subjectName: 'Automata Theory & Compiler Design',
    subjectCode: '23A05502',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a52502a',
    subjectName: 'English For Competitive Examinations',
    subjectCode: '23A52502a',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05503',
    subjectName: 'Introduction To Quantum Technologies & Applications',
    subjectCode: '23A05503',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05506',
    subjectName: 'Full Stack Development II',
    subjectCode: '23A05506',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a31301t',
    subjectName: 'Artificial Intelligence',
    subjectCode: '23A31301T',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: [
      { unitId: 'unit-1', title: 'Unit-1' },
      { unitId: 'unit-2', title: 'Unit-2' },
      { unitId: 'unit-3', title: 'Unit-3' },
      { unitId: 'unit-4', title: 'Unit-4' },
      { unitId: 'unit-5', title: 'Unit-5' }
    ]
  },

  // --- 4TH YEAR CSE (SEM 7) SUBJECTS ---
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a30602t',
    subjectName: 'Deep Learning',
    subjectCode: '23A30602T',
    sem: 'Sem 7',
    semester: 'Sem 7',
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
    semester: 'Sem 7',
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
    semester: 'Sem 7',
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
    semester: 'Sem 7',
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
    semester: 'Sem 7',
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
    semester: 'Sem 7',
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
    semester: 'Sem 7',
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

// Helper to initialize local storage and migrate legacy registered accounts
function initStorage() {
  // Clear legacy and previous credentials database keys completely
  const oldKeys = [
    'gitamw_lms_perm_users_db', 
    'gitamw_lms_perm_faculty_db', 
    'gitamw_lms_perm_admins_db', 
    'gitamw_lms_perm_registered_roles_history',
    'lms_v35_users', 
    'lms_v30_users', 
    'lms_users_db'
  ];
  oldKeys.forEach(k => localStorage.removeItem(k));

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
  
  // Curriculum Sync: Force INITIAL_CURRICULUM into localStorage so 3rd Year CSE & 4th Year CSE subjects are 100% guaranteed
  let curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
  INITIAL_CURRICULUM.forEach(item => {
    const existingIdx = curriculum.findIndex(c => c.subjectCode.toUpperCase() === item.subjectCode.toUpperCase() && c.yearId === item.yearId && c.branchId === item.branchId);
    if (existingIdx !== -1) {
      curriculum[existingIdx] = { ...item, ...curriculum[existingIdx] };
    } else {
      curriculum.push(item);
    }
  });
  // Ensure 3rd Year CSE has all 7 subjects
  INITIAL_CURRICULUM.filter(i => i.yearId === '3rd' && i.branchId === 'CSE').forEach(sub => {
    if (!curriculum.some(c => c.subjectCode.toUpperCase() === sub.subjectCode.toUpperCase() && c.yearId === '3rd' && c.branchId === 'CSE')) {
      curriculum.push(sub);
    }
  });
  localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));

  // Attendance Sync (Filter out sample pre-seeded records)
  let attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  attendance = attendance.filter(a => !['238U1A0561', '238U1A0562', '238U1A0563', '238U1A0564', '238U1A0565'].includes(a.rollNumber));
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));

  if (!localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES)) {
    localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(INITIAL_UPLOADED_FILES));
  }

  // ACCOUNT MIGRATION: Ensure no previously registered user account is ever lost
  try {
    const legacyUserKeys = ['lms_v35_users_db', 'lms_v30_users_db', 'lms_v25_users_db', 'lms_v10_users_db', 'lms_users_db'];
    const legacyFacultyKeys = ['lms_v35_faculty_db', 'lms_v30_faculty_db', 'lms_v25_faculty_db', 'lms_v10_faculty_db', 'lms_faculty_db'];
    const legacyAdminKeys = ['lms_v35_admins_db', 'lms_v30_admins_db', 'lms_v25_admins_db', 'lms_v10_admins_db', 'lms_admins_db'];

    let permUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    legacyUserKeys.forEach(k => {
      try {
        const arr = JSON.parse(localStorage.getItem(k) || '[]');
        arr.forEach(u => {
          if (u.username && !permUsers.some(p => p.username.toLowerCase() === u.username.toLowerCase() || p.email.toLowerCase() === u.email.toLowerCase())) {
            permUsers.push(u);
          }
        });
      } catch {}
    });
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(permUsers));

    let permFaculty = JSON.parse(localStorage.getItem(STORAGE_KEYS.FACULTY) || '[]');
    legacyFacultyKeys.forEach(k => {
      try {
        const arr = JSON.parse(localStorage.getItem(k) || '[]');
        arr.forEach(f => {
          if (f.username && !permFaculty.some(p => p.username.toLowerCase() === f.username.toLowerCase() || p.email.toLowerCase() === f.email.toLowerCase())) {
            permFaculty.push(f);
          }
        });
      } catch {}
    });
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(permFaculty));

    let permAdmins = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADMINS) || '[]');
    legacyAdminKeys.forEach(k => {
      try {
        const arr = JSON.parse(localStorage.getItem(k) || '[]');
        arr.forEach(a => {
          if (a.username && !permAdmins.some(p => p.username.toLowerCase() === a.username.toLowerCase() || p.email.toLowerCase() === a.email.toLowerCase())) {
            permAdmins.push(a);
          }
        });
      } catch {}
    });
    localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(permAdmins));
  } catch (err) {
    console.error('Migration error:', err);
  }
}

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
    let curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    
    // Flexible year normalizer (e.g., '3rd', '3rd Year', '3' -> '3rd')
    const normYear = (y) => {
      if (!y) return '';
      const str = y.toString().toLowerCase();
      if (str.includes('1')) return '1st';
      if (str.includes('2')) return '2nd';
      if (str.includes('3') || str.includes('5') || str.includes('6')) return '3rd';
      if (str.includes('4') || str.includes('7') || str.includes('8')) return '4th';
      return str;
    };

    const targetYr = normYear(yearId || '3rd');
    const targetBr = (branchId || 'CSE').toString().trim().toUpperCase();

    let results = curriculum.filter(item => {
      const matchYr = !targetYr || normYear(item.yearId) === targetYr;
      const matchBr = !targetBr || (item.branchId || '').toString().trim().toUpperCase() === targetBr;
      return matchYr && matchBr;
    });

    // AUTO-RECOVERY FALLBACK: If results are 0, populate from INITIAL_CURRICULUM immediately
    if (results.length === 0) {
      const initialMatches = INITIAL_CURRICULUM.filter(item => {
        const matchYr = !targetYr || normYear(item.yearId) === targetYr;
        const matchBr = !targetBr || (item.branchId || '').toString().trim().toUpperCase() === targetBr;
        return matchYr && matchBr;
      });

      if (initialMatches.length > 0) {
        initialMatches.forEach(sub => {
          if (!curriculum.some(c => c.subjectCode.toUpperCase() === sub.subjectCode.toUpperCase() && c.yearId === sub.yearId && c.branchId === sub.branchId)) {
            curriculum.push(sub);
          }
        });
        localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
        return initialMatches;
      }
    }

    return results;
  },

  resetCurriculumToDefault: () => {
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(INITIAL_CURRICULUM));
    return INITIAL_CURRICULUM.filter(i => i.yearId === '3rd' && i.branchId === 'CSE');
  },

  addSubjectToCurriculum: (subjectData) => {
    const curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    const cleanCode = (subjectData.subjectCode || '').trim().toUpperCase();
    
    if (!cleanCode) throw new Error('Subject Code is required.');
    if (!subjectData.subjectName) throw new Error('Subject Name is required.');
    if (!subjectData.yearId || !subjectData.branchId) throw new Error('Please select Academic Year and Branch.');

    const existing = curriculum.find(s => s.subjectCode.toUpperCase() === cleanCode);
    if (existing) {
      throw new Error(`Subject with code "${cleanCode}" already exists in curriculum.`);
    }

    const newSubObj = {
      subjectId: cleanCode.toLowerCase().replace(/[^a-z0-9]/g, ''),
      subjectName: subjectData.subjectName.trim(),
      subjectCode: cleanCode,
      yearId: subjectData.yearId,
      branchId: subjectData.branchId,
      semester: subjectData.semester || (subjectData.yearId === '4th' ? 'Sem 7' : subjectData.yearId === '3rd' ? 'Sem 5' : subjectData.yearId === '2nd' ? 'Sem 3' : 'Sem 1'),
      credits: subjectData.credits || 3,
      syllabusPdfUrl: subjectData.syllabusPdfUrl || null,
      syllabusFileName: subjectData.syllabusFileName || null,
      units: [
        { unitId: 'unit-1', title: 'Unit-1' },
        { unitId: 'unit-2', title: 'Unit-2' },
        { unitId: 'unit-3', title: 'Unit-3' },
        { unitId: 'unit-4', title: 'Unit-4' },
        { unitId: 'unit-5', title: 'Unit-5' }
      ],
      addedBy: subjectData.addedBy || 'Faculty',
      createdAt: new Date().toISOString()
    };

    curriculum.push(newSubObj);
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
    return newSubObj;
  },

  deleteSubjectFromCurriculum: (subjectCode) => {
    let curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    const cleanCode = (subjectCode || '').trim().toUpperCase();
    curriculum = curriculum.filter(s => s.subjectCode.toUpperCase() !== cleanCode);
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
    return curriculum;
  },

  updateSubjectSyllabus: (subjectCode, syllabusPdfUrl, syllabusFileName) => {
    const curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    const cleanCode = (subjectCode || '').trim().toUpperCase();
    const idx = curriculum.findIndex(s => s.subjectCode.toUpperCase() === cleanCode);
    
    if (idx !== -1) {
      curriculum[idx].syllabusPdfUrl = syllabusPdfUrl;
      curriculum[idx].syllabusFileName = syllabusFileName;
      localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(curriculum));
      return curriculum[idx];
    }
    throw new Error('Subject record not found.');
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
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
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
    if (!rollNumber) return records;
    const cleanRoll = rollNumber.toString().toUpperCase().trim();
    return records.filter(r => r.rollNumber.toUpperCase() === cleanRoll || cleanRoll.includes(r.rollNumber.toUpperCase()));
  }
};
