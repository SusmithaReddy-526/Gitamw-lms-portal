// Database Service for GITAMW Autonomous LMS Portal
// Manages Students, Faculty, Admin, Notices, Curriculum (JNTUA Autonomous), Uploaded Files (PDF/Images), and Profiles.

const STORAGE_KEYS = {
  USERS: 'gitamw_lms_fresh_users_db',
  FACULTY: 'gitamw_lms_fresh_faculty_db',
  ADMINS: 'gitamw_lms_fresh_admins_db',
  NOTICES: 'gitamw_lms_perm_notices_db',
  CURRICULUM: 'gitamw_lms_strict_user_curriculum_v68',
  UPLOADED_FILES: 'gitamw_lms_perm_uploaded_files_db',
  DOWNLOADS: 'gitamw_lms_perm_user_downloads',
  ATTENDANCE: 'gitamw_lms_perm_attendance_db',
  REGISTERED_ROLES: 'gitamw_lms_fresh_registered_roles_history'
};

// 4 Active Branches
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

// Standard 5 Units helper
const standardUnits = [
  { unitId: 'unit-1', title: 'Unit-1' },
  { unitId: 'unit-2', title: 'Unit-2' },
  { unitId: 'unit-3', title: 'Unit-3' },
  { unitId: 'unit-4', title: 'Unit-4' },
  { unitId: 'unit-5', title: 'Unit-5' }
];

// Pre-seeded Campus Announcements
const INITIAL_NOTICES = [
  {
    id: 'not-1',
    title: 'JNTUA Autonomous Mid-Semester Examination Schedule 2026',
    date: '2026-08-01',
    category: 'Academic',
    author: 'GITAMW Examination Cell',
    content: 'Mid-semester examinations for B.Tech 2nd, 3rd, and 4th Year will commence as per JNTUA Autonomous academic schedule. Students must bring official hall tickets.'
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

// Official Curriculum Database - STRICTLY USER-PROVIDED SUBJECTS PER YEAR & BRANCH
const INITIAL_CURRICULUM = [
  // --- 1. 2ND YEAR AIML (SEM 3) STRICT USER SUBJECTS ---
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g54301_aiml',
    subjectName: 'Discrete Mathematics & Graph Theory',
    subjectCode: '25G54301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g52301_aiml',
    subjectName: 'Universal Human Values',
    subjectCode: '25G52301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g31301t_aiml',
    subjectName: 'Artificial Intelligence',
    subjectCode: '25G31301T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g05302t_aiml',
    subjectName: 'Advanced Data Structures & Algorithm Analysis',
    subjectCode: '25G05302T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g05303t_aiml',
    subjectName: 'Object Oriented Programming Through JAVA',
    subjectCode: '25G05303T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g05304_aiml',
    subjectName: 'Python Programming',
    subjectCode: '25G05304',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g99301_aiml',
    subjectName: 'Environmental Science',
    subjectCode: '25G99301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g05302p_aiml',
    subjectName: 'Advanced Data Structures & Algorithm Analysis Lab',
    subjectCode: '25G05302P',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: '25g05303p_aiml',
    subjectName: 'Object Oriented Programming Through JAVA Lab',
    subjectCode: '25G05303P',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },

  // --- 2. 2ND YEAR CSE (SEM 3) STRICT USER SUBJECTS ---
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g54301_cse',
    subjectName: 'Discrete Mathematics & Graph Theory',
    subjectCode: '25G54301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g52301_cse',
    subjectName: 'Universal Human Values',
    subjectCode: '25G52301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g50402_cse',
    subjectName: 'Digital Logic and Computer Organization',
    subjectCode: '25G50402',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g05302t_cse',
    subjectName: 'Advanced Data Structures & Algorithm Analysis',
    subjectCode: '25G05302T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g05303t_cse',
    subjectName: 'Object Oriented Programming Through JAVA',
    subjectCode: '25G05303T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g05304_cse',
    subjectName: 'Python Programming',
    subjectCode: '25G05304',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g99301_cse',
    subjectName: 'Environmental Science',
    subjectCode: '25G99301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g05302p_cse',
    subjectName: 'Advanced Data Structures & Algorithm Analysis Lab',
    subjectCode: '25G05302P',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: '25g05303p_cse',
    subjectName: 'Object Oriented Programming Through JAVA Lab',
    subjectCode: '25G05303P',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },

  // --- 3. 3RD YEAR CSE (SEM 5) STRICT USER SUBJECTS ---
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05501t',
    subjectName: 'Computer Networks & Internet Protocols',
    subjectCode: '23A05501T',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05504a',
    subjectName: 'Object Oriented Analysis & Design',
    subjectCode: '23A05504a',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05502',
    subjectName: 'Automata Theory & Compiler Design',
    subjectCode: '23A05502',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a52502a',
    subjectName: 'English For Competitive Examinations',
    subjectCode: '23A52502a',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05503',
    subjectName: 'Introduction To Quantum Technologies & Applications',
    subjectCode: '23A05503',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a05506',
    subjectName: 'Full Stack Development II',
    subjectCode: '23A05506',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: '23a31301t',
    subjectName: 'Artificial Intelligence',
    subjectCode: '23A31301T',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },

  // --- 4. 4TH YEAR AIML (SEM 7) STRICT USER SUBJECTS ---
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: '23a30701',
    subjectName: 'Generative AI',
    subjectCode: '23A30701',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: '23a52701c_aiml',
    subjectName: 'Management Science',
    subjectCode: '23A52701c',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: '23a31702c',
    subjectName: 'AI in CyberSecurity',
    subjectCode: '23A31702c',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: '23a30703a',
    subjectName: 'Data Wrangling',
    subjectCode: '23A30703a',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: '23a52704',
    subjectName: 'Literacy Vibes',
    subjectCode: '23A52704',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: '23a52703_aiml',
    subjectName: 'Employability Skills',
    subjectCode: '23A52703',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: '25g52702_aiml',
    subjectName: 'Gender Sensitization',
    subjectCode: '25G52702',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: '23a52703_lab',
    subjectName: 'Prompt Engineering Lab',
    subjectCode: '23A52703',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },

  // --- 5. 4TH YEAR CSE (SEM 7) STRICT USER SUBJECTS ---
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a30602t_cse',
    subjectName: 'Deep Learning',
    subjectCode: '23A30602T',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a52701c_cse',
    subjectName: 'Management Science',
    subjectCode: '23A52701c',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a35501t_cse',
    subjectName: 'Internet Of Things',
    subjectCode: '23A35501T',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a30604a_cse',
    subjectName: 'Computer Vision',
    subjectCode: '23A30604a',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a05703_cse',
    subjectName: 'Prompt Engineering',
    subjectCode: '23A05703',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a52702_cse',
    subjectName: 'Gender Sensitization',
    subjectCode: '23A52702',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a52703_cse',
    subjectName: 'Employability Skills',
    subjectCode: '23A52703',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },

  // --- 6. 3RD YEAR ECE (SEM 5) STRICT USER SUBJECTS ---
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a04501t_ece',
    subjectName: 'Analog And Digital IC Applications',
    subjectCode: '23A04501T',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a04502_ece',
    subjectName: 'Antennas & Wave Propagation',
    subjectCode: '23A04502',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a04503t_ece',
    subjectName: 'Microprocessors & Microcontrollers',
    subjectCode: '23A04503T',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a05503_ece',
    subjectName: 'Introduction To Quantum Technologies And Applications',
    subjectCode: '23A05503',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a04504a_ece',
    subjectName: 'Computer Architexture & Organization',
    subjectCode: '23A04504a',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a52502a_ece',
    subjectName: 'English For Competitive Examinations',
    subjectCode: '23A52502a',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a04503p_ece',
    subjectName: 'PCB Design & Prototype Development',
    subjectCode: '23A04503P',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a04501p_ece',
    subjectName: 'Analog & Digital IC Applications Lab',
    subjectCode: '23A04501P',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a04503p_lab_ece',
    subjectName: 'Microprocessors & Microcontrollers Lab',
    subjectCode: '23A04503P',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: '23a03508_ece',
    subjectName: 'Tinkering Lab',
    subjectCode: '23A03508',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },

  // --- 7. 2ND YEAR ECE (SEM 3) STRICT USER SUBJECTS ---
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: '23a04501t_2nd_ece',
    subjectName: 'Probability and Complex Variables',
    subjectCode: '23A04501T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: '23a04502_2nd_ece',
    subjectName: 'Universal Human Values',
    subjectCode: '23A04502',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: '23a04503t_2nd_ece',
    subjectName: 'Signals, Systems and Stochastic Processes',
    subjectCode: '23A04503T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: '23a05503_2nd_ece',
    subjectName: 'Electronic Devices and Circuits',
    subjectCode: '23A05503',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: '23a04504a_2nd_ece',
    subjectName: 'Digital Circuits Design',
    subjectCode: '23A04504a',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: '23a04503p_2nd_ece',
    subjectName: 'Python Programming',
    subjectCode: '23A04503P',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: '23a52502a_2nd_ece',
    subjectName: 'Electronic Devices and Circuits Lab',
    subjectCode: '23A52502a',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: '23a04501p_2nd_ece',
    subjectName: 'Digital Circuits& Signal Simulation Lab',
    subjectCode: '23A04501P',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },

  // --- 8. 4TH YEAR ECE (SEM 7) STRICT USER SUBJECTS ---
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: '23ao4701_4th_ece',
    subjectName: 'Data Communications and Networking',
    subjectCode: '23AO4701',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: '23a045701c_4th_ece',
    subjectName: 'Management Science',
    subjectCode: '23A045701c',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: '23a04702a_4th_ece',
    subjectName: 'Radar Engineering',
    subjectCode: '23A04702a',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: '23a04703a_4th_ece',
    subjectName: 'Low Power VLSI Design',
    subjectCode: '23A04703a',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: '23a52703_4th_ece',
    subjectName: 'Employability Skills',
    subjectCode: '23A52703',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: '23a35501t_4th_ece',
    subjectName: 'Internet of Things',
    subjectCode: '23A35501T',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: '23a04705a_4th_ece',
    subjectName: 'RF System Design Tools',
    subjectCode: '23A04705a',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: '23a52702_4th_ece',
    subjectName: 'Gender Sentization',
    subjectCode: '23A52702',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },

  // --- 9. 4TH YEAR EEE (SEM 7) STRICT USER SUBJECTS ---
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: '23a02701_4th_eee',
    subjectName: 'Power System Operation and control',
    subjectCode: '23A02701',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: '23a52701c_4th_eee',
    subjectName: 'Management Science',
    subjectCode: '23A52701c',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: '23a02702c_4th_eee',
    subjectName: 'High Voltage Direct Current and Flexible AC Transmission System',
    subjectCode: '23A02702c',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: '23a02703c_4th_eee',
    subjectName: 'Electrical Distribution System',
    subjectCode: '23A02703c',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: '23a35501t_4th_eee',
    subjectName: 'Internet of Things',
    subjectCode: '23A35501T',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: '23a52703_4th_eee',
    subjectName: 'Employability Skills',
    subjectCode: '23A52703',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: '23a02706_4th_eee',
    subjectName: 'Power Systems and Simulation Lab',
    subjectCode: '23A02706',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: '23a52702_4th_eee',
    subjectName: 'Gender Sentization',
    subjectCode: '23A52702',
    sem: 'Sem 7',
    semester: 'Sem 7',
    units: standardUnits
  },

  // --- 10. 3RD YEAR EEE (SEM 5) STRICT USER SUBJECTS ---
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g02501t_3rd_eee',
    subjectName: 'Power Electronics',
    subjectCode: '25G02501T',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g02502_3rd_eee',
    subjectName: 'Digital Circuits',
    subjectCode: '25G02502',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g02503_3rd_eee',
    subjectName: 'Power Systems-II',
    subjectCode: '25G02503',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g05503_3rd_eee',
    subjectName: 'Introduction to Quantum Technologies and Applications',
    subjectCode: '25G05503',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g02504c_3rd_eee',
    subjectName: 'Utilization of Electrial Energy',
    subjectCode: '25G02504c',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g52502a_3rd_eee',
    subjectName: 'English for Competitive Examinations',
    subjectCode: '25G52502a',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g02501p_3rd_eee',
    subjectName: 'Power Electonics Lab',
    subjectCode: '25G02501P',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g02506_3rd_eee',
    subjectName: 'Analog and Digital Circuits Lab',
    subjectCode: '25G02506',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g52501_3rd_eee',
    subjectName: 'Soft Skills',
    subjectCode: '25G52501',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: '25g03508_3rd_eee',
    subjectName: 'Tinkering Lab',
    subjectCode: '25G03508',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },

  // --- 11. 2ND YEAR EEE (SEM 3) STRICT USER SUBJECTS ---
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a54304_2nd_eee',
    subjectName: 'Complex Variables & Numerical Methods',
    subjectCode: '23A54304',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a52301_2nd_eee',
    subjectName: 'Universal Human Values',
    subjectCode: '23A52301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a02301_2nd_eee',
    subjectName: 'Electromagnetiv Field Theory',
    subjectCode: '23A02301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a02302t_2nd_eee',
    subjectName: 'Electrical Cricuit Analysis-II',
    subjectCode: '23A02302T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a02303t_2nd_eee',
    subjectName: 'DC Machines & Transformers Lab',
    subjectCode: '23A02303T',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a02302p_2nd_eee',
    subjectName: 'Electrical Circuit Analysis-II and Simulation Lab',
    subjectCode: '23A02302P',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a02303p_2nd_eee',
    subjectName: 'DC Machines & Transforms Lab',
    subjectCode: '23A02303P',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a05305_2nd_eee',
    subjectName: 'Data Structures',
    subjectCode: '23A05305',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: '23a99301_2nd_eee',
    subjectName: 'Environment Science',
    subjectCode: '23A99301',
    sem: 'Sem 3',
    semester: 'Sem 3',
    units: standardUnits
  },

  // --- 12. 3RD YEAR AIML (SEM 5) STRICT USER SUBJECTS ---
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a31501_3rd_aiml',
    subjectName: 'Natural Language Processing',
    subjectCode: '23A31501',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a31502_3rd_aiml',
    subjectName: 'System Software Programming',
    subjectCode: '23A31502',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a31503_3rd_aiml',
    subjectName: 'Computer Vision & Image Processing',
    subjectCode: '23A31503',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '25a05503_3rd_aiml',
    subjectName: 'Introduction to Quantum Technologies & Applications',
    subjectCode: '25A05503',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a05504b_3rd_aiml',
    subjectName: 'Soft Computing',
    subjectCode: '23A05504b',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a52502a_3rd_aiml',
    subjectName: 'English for Competitive Examinations',
    subjectCode: '23A52502a',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a33501_3rd_aiml',
    subjectName: 'Computer Vision & Machine Learning Lab',
    subjectCode: '23A33501',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a31506_3rd_aiml',
    subjectName: 'AI & System Programming Lab',
    subjectCode: '23A31506',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a05506_3rd_aiml',
    subjectName: 'Full Stack Development -II',
    subjectCode: '23A05506',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: '23a03508_3rd_aiml',
    subjectName: 'Tinkering Lab',
    subjectCode: '23A03508',
    sem: 'Sem 5',
    semester: 'Sem 5',
    units: standardUnits
  }
];

const OFFICIAL_DEFAULT_ADMINS = [
  {
    id: 'admin-principal',
    fullName: 'Principal',
    username: 'principal_gitamw',
    email: 'principal@gitamw.ac.in',
    password: 'Principal#GITAMW',
    role: 'admin',
    department: 'Executive Administration',
    designation: 'Principal'
  },
  {
    id: 'admin-chairman',
    fullName: 'Chairman',
    username: 'chairman_gitamw',
    email: 'chairman@gitamw.ac.in',
    password: 'Chairman#GITAMW',
    role: 'admin',
    department: 'Governing Body',
    designation: 'Chairman'
  },
  {
    id: 'admin-codirector',
    fullName: 'Co Director',
    username: 'codirector_gitamw',
    email: 'codirector@gitamw.ac.in',
    password: 'CoDirector#GITAMW',
    role: 'admin',
    department: 'Directorate',
    designation: 'Co Director'
  },
  {
    id: 'admin-examcell',
    fullName: 'Examcell Controller',
    username: 'examcell_gitamw',
    email: 'examcell@gitamw.ac.in',
    password: 'ExamCell#GITAMW',
    role: 'admin',
    department: 'Examination Cell',
    designation: 'Exam Cell Controller'
  }
];

const INITIAL_UPLOADED_FILES = [];

function safeGetItem(key, fallback = null) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSetItem(key, val) {
  try {
    localStorage.setItem(key, val);
  } catch (e) {}
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {}
}

function safeParse(key, fallback = []) {
  try {
    const raw = safeGetItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// Helper to initialize local storage safely
function initStorage() {
  const oldKeys = [
    'gitamw_lms_perm_users_db', 
    'gitamw_lms_perm_faculty_db', 
    'gitamw_lms_perm_admins_db', 
    'gitamw_lms_perm_curriculum_db',
    'gitamw_lms_perm_registered_roles_history',
    'lms_v35_users', 
    'lms_v30_users', 
    'lms_users_db'
  ];
  oldKeys.forEach(k => safeRemoveItem(k));

  if (!safeGetItem(STORAGE_KEYS.FACULTY)) {
    safeSetItem(STORAGE_KEYS.FACULTY, JSON.stringify([]));
  }
  if (!safeGetItem(STORAGE_KEYS.USERS)) {
    safeSetItem(STORAGE_KEYS.USERS, JSON.stringify([]));
  }
  
  // Pre-seed official 4 Admin accounts strictly
  safeSetItem(STORAGE_KEYS.ADMINS, JSON.stringify(OFFICIAL_DEFAULT_ADMINS));
  
  const registeredRoles = safeParse(STORAGE_KEYS.REGISTERED_ROLES, {});
  registeredRoles['admin'] = true;
  safeSetItem(STORAGE_KEYS.REGISTERED_ROLES, JSON.stringify(registeredRoles));

  safeSetItem(STORAGE_KEYS.NOTICES, JSON.stringify(INITIAL_NOTICES));
  
  // Curriculum initialization strictly with INITIAL_CURRICULUM
  safeSetItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(INITIAL_CURRICULUM));

  // Attendance Sync
  let attendance = safeParse(STORAGE_KEYS.ATTENDANCE, []);
  safeSetItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));

  if (!safeGetItem(STORAGE_KEYS.UPLOADED_FILES)) {
    safeSetItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(INITIAL_UPLOADED_FILES));
  }
}

try {
  initStorage();
} catch (e) {
  console.warn("Storage init warning:", e);
}

export const dbService = {
  clearAllDataAndReset: () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.FACULTY);
    localStorage.removeItem(STORAGE_KEYS.ADMINS);
    localStorage.removeItem(STORAGE_KEYS.REGISTERED_ROLES);
    localStorage.removeItem(STORAGE_KEYS.UPLOADED_FILES);
    localStorage.removeItem('lms_current_session');
    initStorage();
  },

  markRoleRegistered: (role) => {
    const roles = JSON.parse(localStorage.getItem(STORAGE_KEYS.REGISTERED_ROLES) || '{}');
    roles[role] = true;
    localStorage.setItem(STORAGE_KEYS.REGISTERED_ROLES, JSON.stringify(roles));
  },

  hasRoleRegistered: (role) => {
    const roles = safeParse(STORAGE_KEYS.REGISTERED_ROLES, {});
    return !!roles[role];
  },

  hasRegisteredRole: (role) => {
    const roles = safeParse(STORAGE_KEYS.REGISTERED_ROLES, {});
    return !!roles[role];
  },

  getStudentsList: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  getFacultyList: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.FACULTY) || '[]');
  },

  getOfficialAdmins: () => OFFICIAL_DEFAULT_ADMINS,

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
    const rawRoll = studentData.rollNumber.toString().trim().replace(/[^a-zA-Z0-9]/g, '');
    const shortSuffix = rawRoll.length >= 3 ? rawRoll.slice(-3) : rawRoll.padStart(3, '0');
    const username = `${bCode}${shortSuffix}`.toUpperCase();

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

    const existing = faculty.find(f => f.employeeId.toUpperCase() === cleanEmpId);
    if (existing) {
      throw new Error(`Faculty Employee ID "${cleanEmpId}" is already registered. Please proceed to Login.`);
    }

    const newFaculty = {
      id: `fac-${Date.now()}`,
      ...facultyData,
      employeeId: cleanEmpId,
      username: cleanEmpId,
      role: 'faculty',
      registeredAt: new Date().toISOString()
    };

    faculty.push(newFaculty);
    localStorage.setItem(STORAGE_KEYS.FACULTY, JSON.stringify(faculty));
    dbService.markRoleRegistered('faculty');
    return newFaculty;
  },

  // --- ADMIN REGISTRATION RESTRICTED ---
  registerAdmin: () => {
    throw new Error('Wrong Credentials / Registration Restricted: Admin access is exclusively reserved for Principal, Chairman, Co Director, and Examcell.');
  },

  // --- USER LOGIN ---
  loginUser: (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Check Official 4 Admins strictly (Principal, Chairman, Co Director, Examcell)
    const officialAdmins = OFFICIAL_DEFAULT_ADMINS;
    const foundAdmin = officialAdmins.find(a => {
      const shortCode = a.designation.toLowerCase().replace(/[^a-z0-9]/g, '');
      const uMatch = (
        a.username.toLowerCase() === cleanUser || 
        a.email.toLowerCase() === cleanUser ||
        shortCode === cleanUser.replace(/[^a-z0-9]/g, '') ||
        cleanUser === `${shortCode}_gitamw` ||
        cleanUser === a.fullName.toLowerCase().replace(/[^a-z0-9]/g, '')
      );
      const pMatch = (
        a.password === password || 
        cleanPass === a.password.toLowerCase() ||
        cleanPass === `${shortCode}@gitamw`
      );
      return uMatch && pMatch;
    });

    if (foundAdmin) return foundAdmin;

    // Check if input is attempting Admin login with wrong credentials
    const isAdminAttempt = officialAdmins.some(a => {
      const shortCode = a.designation.toLowerCase().replace(/[^a-z0-9]/g, '');
      return (
        a.username.toLowerCase() === cleanUser || 
        a.email.toLowerCase() === cleanUser || 
        cleanUser.includes('admin') || 
        cleanUser.includes('principal') || 
        cleanUser.includes('chairman') || 
        cleanUser.includes('director') || 
        cleanUser.includes('exam') ||
        shortCode === cleanUser.replace(/[^a-z0-9]/g, '')
      );
    });

    if (isAdminAttempt) {
      throw new Error('Wrong Credentials! Incorrect password entered.');
    }

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
    const cleanUnitId = (unitId || '').toLowerCase().trim();
    const cleanUnitTitle = (unitTitle || '').toLowerCase().trim();

    const normYr = (y) => {
      if (!y) return '';
      const str = y.toString().toLowerCase();
      if (str.includes('1')) return '1st';
      if (str.includes('2')) return '2nd';
      if (str.includes('3') || str.includes('5') || str.includes('6')) return '3rd';
      if (str.includes('4') || str.includes('7') || str.includes('8')) return '4th';
      return str;
    };

    const targetYr = normYr(yearId);
    const targetBr = (branchId || '').toString().trim().toUpperCase();

    return files.filter(file => {
      const matchYr = !targetYr || normYr(file.yearId) === targetYr;
      const matchBr = !targetBr || (file.branchId || '').toString().trim().toUpperCase() === targetBr;
      
      const matchSub = (
        (file.subjectId && file.subjectId.toLowerCase() === cleanSubId) ||
        (file.subjectCode && file.subjectCode.toLowerCase() === cleanSubCode)
      );

      const matchUnit = (
        (file.unitId && file.unitId.toLowerCase() === cleanUnitId) ||
        (file.unitTitle && file.unitTitle.toLowerCase().includes(cleanUnitTitle)) ||
        (cleanUnitTitle && file.unitTitle && file.unitTitle.toLowerCase().includes(cleanUnitTitle))
      );

      return matchYr && matchBr && matchSub && matchUnit;
    });
  },

  saveFacultyUploadedFile: (fileRecord) => {
    const files = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES) || '[]');
    const newRecord = {
      id: `file-${Date.now()}`,
      uploadedAt: new Date().toISOString().split('T')[0],
      ...fileRecord
    };
    files.push(newRecord);
    localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(files));
    return newRecord;
  },

  deleteFacultyUploadedFile: (fileId) => {
    let files = JSON.parse(localStorage.getItem(STORAGE_KEYS.UPLOADED_FILES) || '[]');
    files = files.filter(f => f.id !== fileId);
    localStorage.setItem(STORAGE_KEYS.UPLOADED_FILES, JSON.stringify(files));
    return files;
  },

  // --- ATTENDANCE MANAGEMENT ---
  getAttendanceRecords: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
  },

  saveAttendanceRecord: (record) => {
    let attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
    
    // Check if record exists for this student roll number, subject and year
    const idx = attendance.findIndex(a => 
      a.rollNumber.toUpperCase() === record.rollNumber.toUpperCase() && 
      a.subjectCode.toUpperCase() === record.subjectCode.toUpperCase()
    );

    if (idx !== -1) {
      attendance[idx] = { ...attendance[idx], ...record };
    } else {
      attendance.push({ id: `att-${Date.now()}`, ...record });
    }

    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
    return attendance;
  },

  getStudentAttendance: (rollNo) => {
    if (!rollNo) return [];
    const attendance = JSON.parse(localStorage.getItem(STORAGE_KEYS.ATTENDANCE) || '[]');
    const cleanRoll = rollNo.toString().trim().toUpperCase();
    return attendance.filter(a => a.rollNumber.toUpperCase() === cleanRoll);
  },

  // --- CURRICULUM & SUBJECTS ---
  getCurriculum: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
  },

  // STRICT SUBJECT RETRIEVAL WITHOUT UNINTENDED MIXING OR AUTO-DEFAULTS
  getSubjectsForBranchAndYear: (yearId, branchId) => {
    let curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    
    const normYear = (y) => {
      if (!y) return '';
      const str = y.toString().toLowerCase();
      if (str.includes('1')) return '1st';
      if (str.includes('2')) return '2nd';
      if (str.includes('3') || str.includes('5') || str.includes('6')) return '3rd';
      if (str.includes('4') || str.includes('7') || str.includes('8')) return '4th';
      return str;
    };

    const targetYr = yearId ? normYear(yearId) : '';
    const targetBr = branchId ? branchId.toString().trim().toUpperCase() : '';

    if (!targetYr || !targetBr) {
      return [];
    }

    return curriculum.filter(item => {
      const itemYr = normYear(item.yearId);
      const itemBr = (item.branchId || '').toString().trim().toUpperCase();
      return itemYr === targetYr && itemBr === targetBr;
    });
  },

  addSubjectToCurriculum: (subjectData) => {
    const curriculum = JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRICULUM) || '[]');
    const cleanCode = (subjectData.subjectCode || '').trim().toUpperCase();
    
    if (!cleanCode) throw new Error('Subject Code is required.');
    if (!subjectData.subjectName) throw new Error('Subject Name is required.');
    if (!subjectData.yearId || !subjectData.branchId) throw new Error('Please select Academic Year and Branch.');

    const existing = curriculum.find(s => s.subjectCode.toUpperCase() === cleanCode && s.yearId === subjectData.yearId && s.branchId === subjectData.branchId);
    if (existing) {
      throw new Error(`Subject with code "${cleanCode}" already exists in ${subjectData.yearId} Year ${subjectData.branchId} curriculum.`);
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
      units: standardUnits,
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
    throw new Error(`Subject with code "${cleanCode}" not found.`);
  },

  // --- NOTICES MANAGEMENT ---
  getNotices: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES) || '[]');
  },

  addNotice: (noticeData) => {
    const notices = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES) || '[]');
    const newNotice = {
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...noticeData
    };
    notices.unshift(newNotice);
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    return newNotice;
  },

  deleteNotice: (noticeId) => {
    let notices = JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTICES) || '[]');
    notices = notices.filter(n => n.id !== noticeId);
    localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    return notices;
  }
};
