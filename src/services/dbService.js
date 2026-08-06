// Database Service for GITAMW Autonomous LMS Portal
// Manages Students, Faculty, Admin, Notices, Curriculum (JNTUA Autonomous), Uploaded Files (PDF/Images), and Profiles.

const STORAGE_KEYS = {
  USERS: 'lms_v3_users_db',
  FACULTY: 'lms_v3_faculty_db',
  ADMINS: 'lms_v3_admins_db',
  NOTICES: 'lms_v3_notices_db',
  CURRICULUM: 'lms_v6_curriculum_db',
  UPLOADED_FILES: 'lms_v3_uploaded_files_db',
  DOWNLOADS: 'lms_v3_user_downloads',
  REGISTERED_ROLES: 'lms_v3_registered_roles_history'
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

// Comprehensive JNTUA Autonomous Curriculum Database (CSE, AIML, ECE, EEE across 1st-4th Years)
const INITIAL_CURRICULUM = [
  // ----------------------------------------------------
  // CSE - COMPUTER SCIENCE & ENGINEERING
  // ----------------------------------------------------
  // 1st Year CSE
  {
    yearId: '1st',
    branchId: 'CSE',
    subjectId: 'cs104',
    subjectName: 'Problem Solving & C Programming',
    subjectCode: 'CS104',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Introduction to Computers & Algorithm Fundamentals',
        description: 'Flowcharts, Pseudo-code, C Data Types, Operators and Expressions',
        topics: [
          { id: 'top-c101', name: 'Algorithm Representation & Flowcharts' },
          { id: 'top-c102', name: 'C Tokens, Data Types & Operators' },
          { id: 'top-c103', name: 'Control Structures: if-else, switch case, loops' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: Arrays, Strings & Pointers',
        description: '1D & 2D Arrays, String Handling, Pointer Arithmetic & Dynamic Memory Allocation',
        topics: [
          { id: 'top-c201', name: '1D & 2D Array Manipulation' },
          { id: 'top-c202', name: 'Pointers & Dynamic Memory Allocation (malloc, calloc)' }
        ]
      }
    ]
  },
  {
    yearId: '1st',
    branchId: 'CSE',
    subjectId: 'cs107',
    subjectName: 'Data Structures',
    subjectCode: 'CS107',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Stacks, Queues & Recursion',
        description: 'Stack ADT, Queue Implementation, Circular Queues, Tower of Hanoi',
        topics: [
          { id: 'top-ds101', name: 'Stack Operations & Infix-to-Postfix Conversion' },
          { id: 'top-ds102', name: 'Queue Implementation & Applications' }
        ]
      }
    ]
  },

  // 2nd Year CSE
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: 'cs202',
    subjectName: 'Computer Organization & Architecture',
    subjectCode: 'CS202',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Basic Structure of Computers & Register Transfer',
        description: 'Bus Architecture, Memory Locations, Addressing Modes, RISC vs CISC',
        topics: [
          { id: 'top-coa101', name: 'Register Transfer Language & Bus Architecture' },
          { id: 'top-coa102', name: 'Addressing Modes & Instruction Cycles' }
        ]
      }
    ]
  },
  {
    yearId: '2nd',
    branchId: 'CSE',
    subjectId: 'cs204',
    subjectName: 'Database Management Systems',
    subjectCode: 'CS204',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: ER Diagrams & Relational Algebra',
        description: 'DBMS Architecture, ER Model, Relational Schema & Relational Algebra Queries',
        topics: [
          { id: 'top-db101', name: 'Entity-Relationship Diagrams & Mapping Constraints' },
          { id: 'top-db102', name: 'Relational Algebra Operators & SQL Queries' }
        ]
      }
    ]
  },

  // 3rd Year CSE
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: 'cs301',
    subjectName: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Introduction to Data Structures & Recursion',
        description: 'Algorithm Complexity, Asymptotic Notations, Arrays, Stacks and Queues',
        topics: [
          { id: 'top-101', name: 'Asymptotic Analysis & Big-O Notation' },
          { id: 'top-102', name: 'Arrays & Dynamic Array Allocation' },
          { id: 'top-103', name: 'Stack ADT & Memory Operations' },
          { id: 'top-104', name: 'Queue Implementation & Circular Queues' },
          { id: 'top-105', name: 'Recursion & Dynamic Memory Stack Visualizer' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: Linked Lists & Trees',
        description: 'Singly, Doubly, Circular Linked Lists, Binary Trees, BST Operations',
        topics: [
          { id: 'top-201', name: 'Singly vs Doubly Linked List Pointer Architecture' },
          { id: 'top-202', name: 'Binary Search Tree (BST) Insertion & Deletion Algorithms' },
          { id: 'top-203', name: 'Tree Traversals: PreOrder, InOrder, PostOrder' },
          { id: 'top-204', name: 'AVL Tree Rotations & Self-Balancing Trees' }
        ]
      }
    ]
  },
  {
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: 'cs302',
    subjectName: 'Operating Systems',
    subjectCode: 'CS302',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: OS Processes & CPU Scheduling Algorithms',
        description: 'Process Control Block (PCB), FCFS, SJF, Round Robin, Priority Scheduling',
        topics: [
          { id: 'top-os101', name: 'Process Lifecycle & PCB Architecture' },
          { id: 'top-os102', name: 'CPU Scheduling: FCFS, SJF & Round Robin' },
          { id: 'top-os103', name: 'Virtual Memory & Paging Mechanics' }
        ]
      }
    ]
  },

  // 4th Year / Sem 7 CSE (Official JNTUA Subjects & Codes)
  {
    yearId: '4th',
    branchId: 'CSE',
    subjectId: '23a30602t',
    subjectName: 'Deep Learning',
    subjectCode: '23A30602T',
    sem: 'Sem 7',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Fundamentals of Deep Learning & Multi-Layer Perceptrons',
        description: 'Biological vs Artificial Neurons, Perceptron Learning Rule, Backpropagation Derivation & Loss Optimization',
        topics: [
          { id: 'top-dl101', name: 'Multi-layer Perceptron (MLP) & Backpropagation Algorithm' },
          { id: 'top-dl102', name: 'Activation Functions: Sigmoid, Tanh, ReLU & Softmax' },
          { id: 'top-dl103', name: 'Gradient Descent Optimization: SGD, Momentum, Adam' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: Convolutional Neural Networks (CNNs)',
        description: 'Convolutional Operations, Feature Maps, Max Pooling, AlexNet, VGG-16 & ResNet Architectures',
        topics: [
          { id: 'top-dl201', name: 'Convolutional Layers, Stride, Padding & Feature Extraction' },
          { id: 'top-dl202', name: 'ResNet Residual Connections & Transfer Learning' }
        ]
      },
      {
        unitId: 'unit-3',
        title: 'Unit 3: Recurrent Neural Networks (RNNs) & Sequence Modeling',
        description: 'Vanishing Gradient Problem, Long Short-Term Memory (LSTM), Gated Recurrent Units (GRU)',
        topics: [
          { id: 'top-dl301', name: 'RNN Architecture & Sequence-to-Sequence Modeling' },
          { id: 'top-dl302', name: 'LSTM Cell Gating Mechanisms & Time-Series Prediction' }
        ]
      },
      {
        unitId: 'unit-4',
        title: 'Unit 4: Autoencoders & Generative Adversarial Networks (GANs)',
        description: 'Dimensionality Reduction, Variational Autoencoders (VAE), GAN Generator & Discriminator',
        topics: [
          { id: 'top-dl401', name: 'Variational Autoencoders (VAE) & Latent Space Sampling' },
          { id: 'top-dl402', name: 'Generative Adversarial Networks (GANs) Minimax Training' }
        ]
      },
      {
        unitId: 'unit-5',
        title: 'Unit 5: Deep Learning Deployment & Model Optimization',
        description: 'Model Quantization, Pruning, ONNX Export, TensorRT Acceleration & Edge Inference',
        topics: [
          { id: 'top-dl501', name: 'Model Quantization & Pruning Strategies' },
          { id: 'top-dl502', name: 'ONNX Runtime & TensorRT Deployment Pipelines' }
        ]
      }
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
      {
        unitId: 'unit-1',
        title: 'Unit 1: Principles of Management & Organizational Structure',
        description: 'Fayol 14 Principles, Taylor Scientific Management, Line, Staff & Matrix Organizations',
        topics: [
          { id: 'top-ms101', name: 'Fayol 14 Principles of Management & Scientific Management' },
          { id: 'top-ms102', name: 'Organizational Design: Functional, Line & Matrix Structures' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: Operations Management & Project Networks (PERT/CPM)',
        description: 'Plant Location & Layout, Inventory Models (EOQ, ABC), PERT & CPM Network Analysis',
        topics: [
          { id: 'top-ms201', name: 'PERT / CPM Network Diagram & Critical Path Method' },
          { id: 'top-ms202', name: 'Economic Order Quantity (EOQ) & ABC Analysis' }
        ]
      },
      {
        unitId: 'unit-3',
        title: 'Unit 3: Strategic & Marketing Management',
        description: 'SWOT Analysis, BCG Matrix, Porter 5 Forces, 4 Ps of Marketing & Brand Strategies',
        topics: [
          { id: 'top-ms301', name: 'SWOT Analysis & Porter 5 Forces Framework' },
          { id: 'top-ms302', name: 'Marketing Mix (4 Ps) & Market Segmentation' }
        ]
      },
      {
        unitId: 'unit-4',
        title: 'Unit 4: Human Resource Management (HRM)',
        description: 'HR Planning, Job Analysis, Recruitment, Selection, Performance Appraisal & Training',
        topics: [
          { id: 'top-ms401', name: 'Job Description, Specification & Recruitment Lifecycle' },
          { id: 'top-ms402', name: 'Performance Appraisal Methods & 360-Degree Feedback' }
        ]
      },
      {
        unitId: 'unit-5',
        title: 'Unit 5: Financial Management & Capital Budgeting',
        description: 'Break-Even Analysis (BEP), Net Present Value (NPV), Payback Period & Project Evaluation',
        topics: [
          { id: 'top-ms501', name: 'Break-Even Analysis (BEP) & Margin of Safety' },
          { id: 'top-ms502', name: 'Capital Budgeting: NPV, IRR & Payback Period' }
        ]
      }
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
      {
        unitId: 'unit-1',
        title: 'Unit 1: IoT Architecture & Sensing Communication Protocols',
        description: 'IoT Framework, Sensor Nodes, Actuators, MQTT, CoAP, HTTP, 6LoWPAN & Zigbee Protocols',
        topics: [
          { id: 'top-iot101', name: 'IoT Reference Architecture & Protocol Stack' },
          { id: 'top-iot102', name: 'MQTT vs CoAP Communication Protocols' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: IoT Hardware Platforms & Microcontrollers',
        description: 'Raspberry Pi, ESP32, Arduino Board Interfacing, GPIO Programming & Sensor Calibration',
        topics: [
          { id: 'top-iot201', name: 'Raspberry Pi Architecture & Python Interfacing' },
          { id: 'top-iot202', name: 'ESP32 Wi-Fi & Bluetooth Microcontroller Setup' }
        ]
      },
      {
        unitId: 'unit-3',
        title: 'Unit 3: Cloud IoT Platforms & Data Analytics',
        description: 'AWS IoT Core, Azure IoT Hub, ThingsBoard Dashboards & Real-Time Sensor Data Streaming',
        topics: [
          { id: 'top-iot301', name: 'AWS IoT Core Device Gateway & Shadow State' },
          { id: 'top-iot302', name: 'ThingsBoard Telemetry Dashboards' }
        ]
      },
      {
        unitId: 'unit-4',
        title: 'Unit 4: IoT Security, Cryptography & Edge Computing',
        description: 'Device Authentication, TLS Encryption, Firmware Over-The-Air (FOTA), Fog & Edge AI',
        topics: [
          { id: 'top-iot401', name: 'IoT Security Threats & TLS Encryption' },
          { id: 'top-iot402', name: 'Edge AI & Fog Computing Frameworks' }
        ]
      },
      {
        unitId: 'unit-5',
        title: 'Unit 5: Smart City & Industrial IoT (IIoT) Applications',
        description: 'Smart Grids, Intelligent Transportation Systems, Industry 4.0 & Predictive Maintenance',
        topics: [
          { id: 'top-iot501', name: 'Smart City Infrastructure & Automated Grids' },
          { id: 'top-iot502', name: 'Industrial IoT (IIoT 4.0) & Predictive Asset Health' }
        ]
      }
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
      {
        unitId: 'unit-1',
        title: 'Unit 1: Digital Image Fundamentals & Spatial Filtering',
        description: 'Image Processing Pipeline, Histogram Equalization, Spatial Filtering, Sobel & Canny Operators',
        topics: [
          { id: 'top-cv101', name: 'Histogram Equalization & Contrast Enhancement' },
          { id: 'top-cv102', name: 'Canny Edge Detection Algorithm' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: Feature Detection, Extraction & Matching',
        description: 'Harris Corner Detection, SIFT, SURF, ORB Keypoint Descriptors & Feature Matching',
        topics: [
          { id: 'top-cv201', name: 'Harris Corner Detector Mathematics' },
          { id: 'top-cv202', name: 'SIFT Feature Invariance & Keypoint Descriptors' }
        ]
      },
      {
        unitId: 'unit-3',
        title: 'Unit 3: Image Segmentation & Motion Estimation',
        description: 'K-Means Clustering Segmentation, Watershed Algorithm, Lucas-Kanade Optical Flow',
        topics: [
          { id: 'top-cv301', name: 'K-Means Image Color Segmentation' },
          { id: 'top-cv302', name: 'Optical Flow & Object Motion Tracking' }
        ]
      },
      {
        unitId: 'unit-4',
        title: 'Unit 4: Deep Learning for Object Detection & Segmentation',
        description: 'YOLOv8 Real-Time Detector, Faster R-CNN, Mask R-CNN & Semantic Segmentation',
        topics: [
          { id: 'top-cv401', name: 'YOLO Real-Time Bounding Box Prediction' },
          { id: 'top-cv402', name: 'U-Net Architecture for Biomedical Segmentation' }
        ]
      },
      {
        unitId: 'unit-5',
        title: 'Unit 5: 3D Vision, Camera Calibration & AR',
        description: 'Pinhole Camera Model, Stereo Disparity, Depth Reconstruction & AR Tracking',
        topics: [
          { id: 'top-cv501', name: 'Stereo Disparity Mapping & 3D Reconstruction' },
          { id: 'top-cv502', name: 'Camera Intrinsics Calibration Matrix' }
        ]
      }
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
      {
        unitId: 'unit-1',
        title: 'Unit 1: LLM Architecture & Prompt Engineering Fundamentals',
        description: 'Zero-Shot, Few-Shot, Chain-of-Thought (CoT), System Prompts & Temperature Parameters',
        topics: [
          { id: 'top-pe101', name: 'Zero-Shot, Few-Shot & Chain-of-Thought (CoT) Prompting' },
          { id: 'top-pe102', name: 'Temperature, Top-P & Frequency Penalty Parameter Tuning' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: System Prompt Architecture & Instruction Tuning',
        description: 'Role-Based Persona Design, Output Structuring (JSON/Markdown Enforcers) & Context Windows',
        topics: [
          { id: 'top-pe201', name: 'System Prompt Persona Design & Constraint Enforcement' },
          { id: 'top-pe202', name: 'Structured Data Output Extraction via Schema Prompts' }
        ]
      },
      {
        unitId: 'unit-3',
        title: 'Unit 3: Retrieval-Augmented Generation (RAG) & Vector Databases',
        description: 'Document Chunking, Vector Embeddings, ChromaDB / FAISS, LangChain Integration',
        topics: [
          { id: 'top-pe301', name: 'LangChain & LlamaIndex RAG Pipeline Architecture' },
          { id: 'top-pe302', name: 'Vector Database (ChromaDB / FAISS) Cosine Similarity Search' }
        ]
      },
      {
        unitId: 'unit-4',
        title: 'Unit 4: AI Agent Workflows & Function Calling (Tools)',
        description: 'ReAct Agent Framework, OpenAI / Anthropic Tool Use, Multi-Agent Orchestration',
        topics: [
          { id: 'top-pe401', name: 'ReAct (Reason + Act) Framework & Function Calling' },
          { id: 'top-pe402', name: 'Multi-Agent Autonomous Workflow Orchestration' }
        ]
      },
      {
        unitId: 'unit-5',
        title: 'Unit 5: Prompt Safety, Evaluation & Guardrails',
        description: 'Prompt Injection Defense, Toxicity Filtering, Output Validation & Benchmark Evaluation',
        topics: [
          { id: 'top-pe501', name: 'Prompt Injection & Jailbreak Attack Prevention' },
          { id: 'top-pe502', name: 'NeMo Guardrails & Automated LLM Benchmark Scoring' }
        ]
      }
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
      {
        unitId: 'unit-1',
        title: 'Unit 1: Social Construction of Gender & Stereotypes',
        description: 'Sex vs Gender Concepts, Gender Socialization, Family Roles & Deconstructing Stereotypes',
        topics: [
          { id: 'top-gs101', name: 'Sex vs Gender Spectrum & Biological vs Social Constructs' },
          { id: 'top-gs102', name: 'Deconstructing Media & Cultural Gender Stereotypes' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: Gender & Constitutional Rights in India',
        description: 'Fundamental Rights, Equal Pay, POSH Act (Workplace Protection), Legal Frameworks',
        topics: [
          { id: 'top-gs201', name: 'Prevention of Sexual Harassment (POSH Act 2013) Guidelines' },
          { id: 'top-gs202', name: 'Article 14 & 15 Constitutional Protections for Equality' }
        ]
      },
      {
        unitId: 'unit-3',
        title: 'Unit 3: Gender & Economic Participation',
        description: 'Labor Force Participation, Unpaid Care Work, Glass Ceiling & Women in Tech/STEM',
        topics: [
          { id: 'top-gs301', name: 'Addressing the Glass Ceiling & Gender Pay Gap in Tech' },
          { id: 'top-gs302', name: 'Women Entrepreneurship & Economic Empowerment' }
        ]
      },
      {
        unitId: 'unit-4',
        title: 'Unit 4: Domestic Violence & Legal Remedies',
        description: 'Domestic Violence Act 2005, Cyber Harassment, Safety Helplines & Institutional Support',
        topics: [
          { id: 'top-gs401', name: 'Protection of Women from Domestic Violence Act (PWDVA)' },
          { id: 'top-gs402', name: 'Cyber Crimes against Women & Digital Safety Protocols' }
        ]
      },
      {
        unitId: 'unit-5',
        title: 'Unit 5: Building an Inclusive Campus & Professional Environment',
        description: 'LGBTIQ+ Inclusion, Gender Neutrality, Empathy Building & Inclusive Workplace Policies',
        topics: [
          { id: 'top-gs501', name: 'Gender Neutral Language & Inclusive Workplace Policies' },
          { id: 'top-gs502', name: 'Campus Safety Committees & Bystander Intervention' }
        ]
      }
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
      {
        unitId: 'unit-1',
        title: 'Unit 1: Quantitative Aptitude & Numerical Ability',
        description: 'Percentages, Profit & Loss, Ratio & Proportion, Speed Time & Distance, Permutations & Combinations',
        topics: [
          { id: 'top-ems101', name: 'Speed, Time & Distance Shortcuts for Competitive Exams' },
          { id: 'top-ems102', name: 'Permutations, Combinations & Probability Problems' }
        ]
      },
      {
        unitId: 'unit-2',
        title: 'Unit 2: Logical & Analytical Reasoning',
        description: 'Syllogisms, Blood Relations, Coding-Decoding, Seating Arrangements & Data Interpretation',
        topics: [
          { id: 'top-ems201', name: 'Syllogism Euler Diagrams & Deductive Logic' },
          { id: 'top-ems202', name: 'Data Interpretation: Bar Charts, Pie Charts & Tables' }
        ]
      },
      {
        unitId: 'unit-3',
        title: 'Unit 3: Verbal Ability & Corporate Communication',
        description: 'Grammar Precision, Error Spotting, Vocabulary Enhancement, Reading Comprehension Passages',
        topics: [
          { id: 'top-ems301', name: 'Subject-Verb Agreement & Error Spotting Strategies' },
          { id: 'top-ems302', name: 'Technical Reading Comprehension Speed Techniques' }
        ]
      },
      {
        unitId: 'unit-4',
        title: 'Unit 4: ATS Resume Crafting & Professional Branding',
        description: 'ATS-Optimized Resumes, GitHub Portfolio Showcase, LinkedIn Networking & Cover Letters',
        topics: [
          { id: 'top-ems401', name: 'ATS Resume Keyword Optimization & Formatting' },
          { id: 'top-ems402', name: 'LinkedIn Professional Profile & Technical Branding' }
        ]
      },
      {
        unitId: 'unit-5',
        title: 'Unit 5: Group Discussions, Mock Interviews & Corporate Ethics',
        description: 'GD Strategies, STAR Interview Technique, Technical HR Rounds & Workplace Etiquette',
        topics: [
          { id: 'top-ems501', name: 'Group Discussion Entry/Exit Strategies & Debating' },
          { id: 'top-ems502', name: 'STAR Technique for HR & Technical Behavioral Interviews' }
        ]
      }
    ]
  },

  // ----------------------------------------------------
  // AIML - ARTIFICIAL INTELLIGENCE & MACHINE LEARNING
  // ----------------------------------------------------
  // 1st Year AIML
  {
    yearId: '1st',
    branchId: 'AIML',
    subjectId: 'ai108',
    subjectName: 'Python for Data Science',
    subjectCode: 'AI108',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Python Fundamentals, NumPy & Pandas',
        description: 'Data Structures in Python, NumPy Multi-dimensional Arrays, Pandas DataFrames',
        topics: [
          { id: 'top-pyd101', name: 'NumPy Vectorization & Matrix Operations' },
          { id: 'top-pyd102', name: 'Pandas Data Wrangling & Feature Extraction' }
        ]
      }
    ]
  },
  // 2nd Year AIML
  {
    yearId: '2nd',
    branchId: 'AIML',
    subjectId: 'ai205',
    subjectName: 'Mathematical Foundations for AI',
    subjectCode: 'AI205',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Linear Algebra, Eigenvalues & Matrix Factorization',
        description: 'Vector Spaces, Singular Value Decomposition (SVD), Principal Component Analysis (PCA)',
        topics: [
          { id: 'top-ma101', name: 'Eigenvalues, Eigenvectors & SVD Decomposition' },
          { id: 'top-ma102', name: 'Principal Component Analysis (PCA) Dimensionality Reduction' }
        ]
      }
    ]
  },
  // 3rd Year AIML
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: 'ai301',
    subjectName: 'Artificial Intelligence & Search Algorithms',
    subjectCode: 'AI301',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Intelligent Agents & State Space Search',
        description: 'BFS, DFS, A* Search, Heuristic Functions, Game Trees & Minimax Algorithm',
        topics: [
          { id: 'top-ai301', name: 'A* Search & Heuristic Evaluation Functions' },
          { id: 'top-ai302', name: 'Minimax Algorithm & Alpha-Beta Pruning' }
        ]
      }
    ]
  },
  {
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: 'ai302',
    subjectName: 'Machine Learning & Deep Learning Architectures',
    subjectCode: 'AI302',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Supervised Learning, CNNs & Backpropagation',
        description: 'Linear & Logistic Regression, Perceptrons, Convolutional Neural Networks (CNN)',
        topics: [
          { id: 'top-m101', name: 'Gradient Descent & Backpropagation Algorithm' },
          { id: 'top-m102', name: 'Convolutional Neural Networks (CNN) for Computer Vision' }
        ]
      }
    ]
  },
  // 4th Year AIML
  {
    yearId: '4th',
    branchId: 'AIML',
    subjectId: 'ai401',
    subjectName: 'Generative Models & Transformer Architectures',
    subjectCode: 'AI401',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Self-Attention Mechanisms & Large Language Models',
        description: 'Transformer Encoders-Decoders, GANs, Diffusion Models, Fine-Tuning LLMs',
        topics: [
          { id: 'top-gen101', name: 'Self-Attention Mechanism & Transformer Encoder' },
          { id: 'top-gen102', name: 'Generative Adversarial Networks (GANs) Architecture' }
        ]
      }
    ]
  },

  // ----------------------------------------------------
  // ECE - ELECTRONICS & COMMUNICATION ENGINEERING
  // ----------------------------------------------------
  // 1st Year ECE
  {
    yearId: '1st',
    branchId: 'ECE',
    subjectId: 'ec107',
    subjectName: 'Electronic Devices & Circuits',
    subjectCode: 'EC107',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: PN Junction Diodes & Transistor Characteristics',
        description: 'Diode Equivalent Circuits, Zener Diodes, BJT Biasing, MOSFET Characteristics',
        topics: [
          { id: 'top-ec101', name: 'PN Junction Diode V-I Characteristics & Rectifiers' },
          { id: 'top-ec102', name: 'BJT Common Emitter (CE) Configuration & Biasing' }
        ]
      }
    ]
  },
  // 2nd Year ECE
  {
    yearId: '2nd',
    branchId: 'ECE',
    subjectId: 'ec203',
    subjectName: 'Digital Logic Design',
    subjectCode: 'EC203',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Boolean Algebra, K-Maps & Combinational Circuits',
        description: 'Karnaugh Maps, Multiplexers, Decoders, Adders & Subtractors',
        topics: [
          { id: 'top-dld101', name: '4-Variable K-Map Minimization' },
          { id: 'top-dld102', name: 'Multiplexer & Demultiplexer Logic Design' }
        ]
      }
    ]
  },
  // 3rd Year ECE
  {
    yearId: '3rd',
    branchId: 'ECE',
    subjectId: 'ec303',
    subjectName: 'VLSI Design & Microcontrollers',
    subjectCode: 'EC303',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: CMOS Fabrication & 8051 Architecture',
        description: 'CMOS Inverter VTC, Stick Diagrams, Layout Rules, 8051 Microcontroller Pins',
        topics: [
          { id: 'top-vl101', name: 'CMOS Inverter Transfer Characteristics & Layout' },
          { id: 'top-vl102', name: '8051 Microcontroller Architecture & Timers' }
        ]
      }
    ]
  },
  // 4th Year ECE
  {
    yearId: '4th',
    branchId: 'ECE',
    subjectId: 'ec401',
    subjectName: 'Embedded Systems & Wireless Communications',
    subjectCode: 'EC401',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: ARM Cortex Architecture & 5G Cellular Networks',
        description: 'RTOS Task Scheduling, ARM Instruction Set, OFDM, 5G NR Beamforming',
        topics: [
          { id: 'top-emb101', name: 'ARM Cortex Processor Architecture & Interfacing' },
          { id: 'top-emb102', name: '5G Wireless Communication & MIMO Systems' }
        ]
      }
    ]
  },

  // ----------------------------------------------------
  // EEE - ELECTRICAL & ELECTRONICS ENGINEERING
  // ----------------------------------------------------
  // 1st Year EEE
  {
    yearId: '1st',
    branchId: 'EEE',
    subjectId: 'ee107',
    subjectName: 'Electrical Circuit Analysis',
    subjectCode: 'EE107',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Network Theorems & Mesh Analysis',
        description: 'Thevenin Theorem, Norton Theorem, Superposition Theorem, Maximum Power Transfer',
        topics: [
          { id: 'top-ee101', name: 'Thevenin & Norton Network Equivalents' },
          { id: 'top-ee102', name: 'AC Circuit Resonance & Phasor Diagrams' }
        ]
      }
    ]
  },
  // 2nd Year EEE
  {
    yearId: '2nd',
    branchId: 'EEE',
    subjectId: 'ee201',
    subjectName: 'Electrical Machines-I',
    subjectCode: 'EE201',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: DC Generators & Single-Phase Transformers',
        description: 'Armature Reaction, EMF Equation, Equivalent Circuit of Transformer, Efficiency',
        topics: [
          { id: 'top-em101', name: 'DC Generator EMF Derivation & Characteristics' },
          { id: 'top-em102', name: 'Single-Phase Transformer Open Circuit & Short Circuit Tests' }
        ]
      }
    ]
  },
  // 3rd Year EEE
  {
    yearId: '3rd',
    branchId: 'EEE',
    subjectId: 'ee301',
    subjectName: 'Power Electronics & Drives',
    subjectCode: 'EE301',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: Thyristors, Inverters & Choppers',
        description: 'SCR Firing Circuits, Buck-Boost Converter, 3-Phase Inverters, PWM Techniques',
        topics: [
          { id: 'top-pe101', name: 'Silicon Controlled Rectifier (SCR) Turn-ON & Turn-OFF' },
          { id: 'top-pe102', name: 'Pulse Width Modulation (PWM) Inverter Control' }
        ]
      }
    ]
  },
  // 4th Year EEE
  {
    yearId: '4th',
    branchId: 'EEE',
    subjectId: 'ee401',
    subjectName: 'Electric & Hybrid Vehicles',
    subjectCode: 'EE401',
    units: [
      {
        unitId: 'unit-1',
        title: 'Unit 1: EV Motor Drives & Battery Management Systems',
        description: 'BLDC Motors, PMSM Drives, Lithium-ion Battery State of Charge (SoC), Regenerative Braking',
        topics: [
          { id: 'top-ev101', name: 'Brushless DC (BLDC) Motor Drive for Electric Vehicles' },
          { id: 'top-ev102', name: 'Battery Management System (BMS) & SoC Estimation' }
        ]
      }
    ]
  }
];

// Pre-seeded Faculty Uploaded Files (PDF & Images)
const INITIAL_UPLOADED_FILES = [
  {
    id: 'file-101',
    yearId: '3rd',
    branchId: 'CSE',
    subjectId: 'cs301',
    subjectCode: 'CS301',
    unitId: 'unit-1',
    title: 'Data Structures Unit-1 Official Lecture Notes & Diagrams',
    description: 'Complete faculty PDF notes covering Big-O analysis, Stack ADT, Circular Queues, and Recursion derivations.',
    fileName: 'Unit1_DataStructures_LectureNotes.pdf',
    fileType: 'application/pdf',
    fileSize: '2.4 MB',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nE3NQREAMAgDMEv8a1qA4WfDsgb7FwIBBEEQQRAEERBBEEQQBBEMQRAEMQRAEEQQBEERBA==\nendstream\nendobj\n',
    uploadedBy: 'Dr. Vikram Sharma (EMP-CSE-01)',
    uploadedAt: '2026-08-02'
  },
  {
    id: 'file-102',
    yearId: '3rd',
    branchId: 'AIML',
    subjectId: 'ai302',
    subjectCode: 'AI302',
    unitId: 'unit-1',
    title: 'Backpropagation Derivation & CNN Architectures Hand-written PDF',
    description: 'Handwritten reference notes for Gradient Descent and CNN layers.',
    fileName: 'Backpropagation_CNN_Handwritten_Notes.pdf',
    fileType: 'application/pdf',
    fileSize: '1.9 MB',
    fileData: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nE3NQREAMAgDMEv8a1qA4WfDsgb7FwIBBEEQQRAEERBBEEQQBBEMQRAEMQRAEEQQBEERBA==\nendstream\nendobj\n',
    uploadedBy: 'Prof. Ananya Roy (EMP-AIML-02)',
    uploadedAt: '2026-08-04'
  }
];

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

    const cleanRoll = studentData.rollNumber.toString().padStart(3, '0');
    const username = `${studentData.branch}${cleanRoll}`.toUpperCase(); // Short Username: e.g. CSE045

    const usernameExists = users.find(u => u.username === username);
    if (usernameExists) {
      throw new Error(`Username ${username} is already registered. Please proceed to Login.`);
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

    const username = facultyData.username?.trim() || cleanEmpId;

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

    const newAdmin = {
      id: `admin-${Date.now()}`,
      fullName: adminData.fullName,
      username: adminData.username.trim(),
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
    const cleanUnitId = (unitId || '').toLowerCase().trim();
    const cleanUnitTitle = (unitTitle || '').toLowerCase().trim();

    return files.filter(f => {
      // Subject Match (by subjectId or subjectCode)
      const subMatch = 
        (!cleanSubId && !cleanSubCode) ? true :
        (f.subjectId && f.subjectId.toLowerCase().trim() === cleanSubId) ||
        (f.subjectCode && f.subjectCode.toLowerCase().trim() === cleanSubCode) ||
        (f.subjectCode && cleanSubId && f.subjectCode.toLowerCase().trim() === cleanSubId) ||
        (f.subjectId && cleanSubCode && f.subjectId.toLowerCase().trim() === cleanSubCode);

      // Unit Match (by unitId or unit title)
      const unitMatch = 
        (!cleanUnitId && !cleanUnitTitle) ? true :
        (f.unitId && f.unitId.toLowerCase().trim() === cleanUnitId) ||
        (f.unitTitle && cleanUnitTitle && f.unitTitle.toLowerCase().trim() === cleanUnitTitle) ||
        (f.title && cleanUnitTitle && f.title.toLowerCase().includes(cleanUnitTitle));

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
    const downloads = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADS) || '{}');
    return downloads[userId] || [];
  },

  saveUserDownload: (userId, itemRecord) => {
    const downloads = JSON.parse(localStorage.getItem(STORAGE_KEYS.DOWNLOADS) || '{}');
    if (!downloads[userId]) downloads[userId] = [];
    
    if (!downloads[userId].some(item => item.id === itemRecord.id || item.fileName === itemRecord.fileName)) {
      downloads[userId].unshift({
        ...itemRecord,
        savedAt: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.DOWNLOADS, JSON.stringify(downloads));
    }
  }
};
