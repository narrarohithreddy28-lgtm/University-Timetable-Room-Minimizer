<<<<<<< HEAD
# 🏛️ University Timetable Room Minimizer (DAA Hackathon)

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An intelligent, full-stack university timetable generator and classroom allocation system designed to solve the **NP-Hard University Timetabling & Room Allocation Problem**. Built for the **Design and Analysis of Algorithms (DAA) Hackathon**, this system minimizes the total number of physical classrooms and laboratories required while ensuring 0% scheduling conflicts.

Developed by **[Narra Rohith Reddy](https://github.com/narrarohithreddy28-lgtm)**.

---

## 📌 Project Overview

Traditional timetable scheduling in universities leads to underutilized lecture halls, room clashes, and scheduling inefficiencies. This project applies algorithmic techniques from **Design & Analysis of Algorithms (DAA)** to:
1. **Minimize physical rooms needed**: Packs classes tightly into the smallest subset of rooms without overlapping.
2. **Prevent hard constraints & clashes**: Eliminates simultaneous faculty booking, section double-booking, and room double-booking.
3. **Respect soft constraints**: Balances faculty workload, ensures continuous lab sessions (2–3 hours), and evenly distributes subjects across working days.
4. **Provide visual management**: Includes an interactive timetable grid, room utilization analytics, PDF/Excel export, and real-time conflict inspection.

---

## 🧠 Algorithmic Foundation (DAA Concepts)

The core optimization engine (`backend/src/services/optimizer.js`) leverages multiple algorithmic strategies:

1. **Interval Partitioning & Graph Coloring**:
   - Class sessions that occur at overlapping time intervals form an **Interval Graph**.
   - Scheduling rooms with minimal count corresponds to finding the chromatic number ($\chi(G)$) or maximal clique size (maximum number of concurrent sessions at any given slot $t$).
2. **Best-Fit Decreasing (BFD) Room Allocation**:
   - Rooms are ordered by capacity stability.
   - Largest sections with the most restrictive requirements are prioritized first.
   - An "Active Minimized Room Pool" is formed dynamically to prevent unnecessary room recruitment.
3. **Heuristic Constraint Satisfaction**:
   - Workload spread heuristic to prevent repeating theoretical subjects on the same day when alternatives exist.
   - Continuous multi-hour block reservation for laboratory experiments.
4. **Conflict Detection Engine**:
   - Comprehensive matrix validation for section, professor, room, and capacity constraints.

---

## ✨ Features

- 📅 **Dynamic Timetable Matrix**: Filter timetables by Section, Faculty, or Room with intuitive color-coded subject cards.
- 🏢 **Room Minimization & Utilization Analytics**: Interactive charts powered by Recharts showing usage percentages, peak usage hours, and idle rooms.
- ⚡ **Zero-Conflict Generator**: One-click generation with detailed optimization metrics (rooms saved, total sessions scheduled).
- ✏️ **Manual Drag / Override & Clash Detector**: Modify individual slots with instant real-time conflict notifications.
- 👥 **Department & Academic Management**: CRUD operations for Departments, Faculty, Subjects, Sections, Classrooms/Labs, and Time Slots.
- 📄 **Export & Reporting**: Direct export to formatted **PDF** (via jsPDF & AutoTable) and **Excel spreadsheets** (via SheetJS).
- 🔐 **Authentication**: User management with role-based routing (Admin, Coordinator, Faculty).

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Visualizations**: Recharts
- **Document Export**: jsPDF, jsPDF-AutoTable, SheetJS (XLSX)

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Persistence**: High-performance local JSON document database with pre-configured university seed data
- **Optimization Engine**: Custom DAA Algorithmic Optimizer

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/narrarohithreddy28-lgtm/University-Timetable-Room-Minimizer.git
cd University-Timetable-Room-Minimizer
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend server runs on `http://localhost:5000`.

### 3. Frontend Setup
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will start on `http://localhost:5173`.

---

## 📁 Project Structure

```
├── backend/
│   ├── data/                 # Seed database storage
│   ├── src/
│   │   ├── config/           # Database & initial seed configuration
│   │   ├── routes/           # Express REST API routes
│   │   └── services/         # DAA Optimization & conflict detection logic
│   ├── package.json
│   └── server.js             # Express application entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components (TimetableGrid, Modals, Navbar)
│   │   ├── context/          # React Auth context
│   │   ├── pages/            # Dashboard, Generator, Utilization, Reports, etc.
│   │   └── services/         # API client & PDF/Excel export helpers
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 👨‍💻 Author

**Narra Rohith Reddy**  
- GitHub: [@narrarohithreddy28-lgtm](https://github.com/narrarohithreddy28-lgtm)

---

## 📜 License

This project is licensed under the MIT License.
=======
# University-Timetable-Room-Minimizer
>>>>>>> 26e603b3564d72cb4cf73ea646bcfaf24d5b2cdb
