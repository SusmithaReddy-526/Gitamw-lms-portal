# GITAMW Autonomous - AI-Powered College Learning Management System (LMS)

A production-ready, high-performance College Learning Management System (LMS) built with React 18, Vite, Tailwind CSS, Framer Motion, and Firebase.

## Features

- 🎓 **Role-Based Portals**: Distinct dashboards for **Students**, **Faculty**, and **Admin**.
- 🆔 **Auto Username Generation**: Students register with a unique Roll Number, automatically generating an official username in `YEAR-BRANCH-ROLLNUMBER` format (e.g. `23CSE045`).
- 📚 **Academic Hierarchy**: B.Tech Dashboard $\rightarrow$ Year (1st, 2nd, 3rd, 4th) $\rightarrow$ Branch (AIML, CSE, ECE, EEE, MECH, CIVIL, IT) $\rightarrow$ Subject $\rightarrow$ Units (1-5) $\rightarrow$ Topics.
- 🧠 **AI Content Generator**: Automatically analyzes syllabus topics and synthesizes ~1500-word educational guides with easy/detailed explanations, key definitions, C++/Pseudocode examples, PYQs, viva questions, and interactive MCQ quizzes.
- 📐 **Vector SVG Diagram Engine**: Interactive technical diagrams for CPU architecture, OS memory maps, BST tree structures, process states, and logic flowcharts.
- 👨‍🏫 **Faculty Upload Portal**: Upload syllabus topics per Year $\rightarrow$ Branch $\rightarrow$ Subject $\rightarrow$ Unit to trigger automated AI study guide generation.
- 🛡️ **Admin Control Panel**: Issue faculty credentials, oversee student accounts, reset passwords, publish campus notices, and monitor system analytics.
- 📄 **One-Click PDF Export**: Download study guides offline with full PDF formatting.
- 🌓 **Dark / Light Mode**: Sleek glassmorphism theme with dark mode support.

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

```bash
# Clone or navigate to the directory
cd "clg website"

# Install dependencies
npm install

# Run dev server
npm run dev
```

### Production Build

```bash
npm run build
```

## Demo Credentials

- **Admin Login**: Username: `admin` | Password: `admin123`
- **Faculty Login**: Username: `EMP-CSE-01` | Password: `password123`
- **Demo Student**: Username: `23CSE045` | Password: `password123`
- **New Student**: Click *Student Login* $\rightarrow$ *Register New Student Profile* to auto-generate your unique username!
