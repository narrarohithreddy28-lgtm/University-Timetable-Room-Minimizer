import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { db } from './src/services/storage.js';
import { generateOptimizedTimetable } from './src/services/optimizer.js';

import authRoutes from './src/routes/authRoutes.js';
import deptRoutes from './src/routes/deptRoutes.js';
import facultyRoutes from './src/routes/facultyRoutes.js';
import subjectRoutes from './src/routes/subjectRoutes.js';
import sectionRoutes from './src/routes/sectionRoutes.js';
import roomRoutes from './src/routes/roomRoutes.js';
import timeslotRoutes from './src/routes/timeslotRoutes.js';
import timetableRoutes from './src/routes/timetableRoutes.js';
import reportsRoutes from './src/routes/reportsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', deptRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/timeslots', timeslotRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/reports', reportsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    university: 'Malla Reddy Technical Campus',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Initialize server
async function startServer() {
  await connectDB();

  // Ensure initial optimized timetable exists
  if (!db.timetables.getLatest()) {
    try {
      console.log('Generating initial timetable for Malla Reddy Technical Campus...');
      const initialTt = generateOptimizedTimetable({
        sections: db.sections.find(),
        subjects: db.subjects.find(),
        faculty: db.faculty.find(),
        rooms: db.rooms.find(),
        timeSlots: db.timeslots.find(),
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        academicYear: "2024-2025",
        semester: 4,
        department: "All"
      });
      db.timetables.create(initialTt);
      console.log(`Initial timetable generated successfully! Used ${initialTt.stats.requiredRooms} / ${initialTt.stats.totalRooms} rooms (Saved ${initialTt.stats.roomsSaved} rooms).`);
    } catch (err) {
      console.error('Failed to generate initial timetable:', err);
    }
  }

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` University Timetable Room Minimizer Backend Running `);
    console.log(` URL: http://localhost:${PORT}                        `);
    console.log(` Campus: Malla Reddy Technical Campus                  `);
    console.log(`=======================================================`);
  });
}

startServer();
