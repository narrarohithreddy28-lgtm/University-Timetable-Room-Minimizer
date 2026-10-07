import express from 'express';
import { db } from '../services/storage.js';
import { generateOptimizedTimetable } from '../services/optimizer.js';
import { detectConflicts } from '../services/conflictDetector.js';

const router = express.Router();

// GET /api/timetable - Get latest generated timetable or auto-generate initial
router.get('/', (req, res) => {
  let timetable = db.timetables.getLatest();

  // If no timetable exists yet, automatically generate one for immediate usability!
  if (!timetable) {
    try {
      const generated = generateOptimizedTimetable({
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
      timetable = db.timetables.create(generated);
    } catch (err) {
      console.error("Auto generation error:", err);
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  // Filter options from query params: ?department=CSE&sectionId=sec_cse_a&facultyId=fac_1&roomId=rm_101
  let entries = timetable.entries || [];
  const { department, sectionId, facultyId, roomId, day } = req.query;

  if (sectionId) {
    entries = entries.filter(e => e.sectionId === sectionId);
  }
  if (facultyId) {
    entries = entries.filter(e => e.facultyId === facultyId);
  }
  if (roomId) {
    entries = entries.filter(e => e.roomId === roomId);
  }
  if (day) {
    entries = entries.filter(e => e.day.toLowerCase() === day.toLowerCase());
  }
  if (department && department !== 'All') {
    const deptSections = db.sections.find({ department });
    const secIds = new Set(deptSections.map(s => s.id));
    entries = entries.filter(e => secIds.has(e.sectionId));
  }

  // Re-detect live conflicts
  const liveConflicts = detectConflicts(timetable.entries || [], {
    facultyList: db.faculty.find(),
    roomList: db.rooms.find(),
    sectionList: db.sections.find(),
    subjectList: db.subjects.find()
  });

  res.json({
    success: true,
    data: {
      ...timetable,
      entries,
      totalFilteredEntries: entries.length,
      conflicts: liveConflicts
    }
  });
});

// POST /api/timetable/generate - Generate fresh optimized timetable
router.post('/generate', (req, res) => {
  try {
    const {
      academicYear = "2024-2025",
      semester = 4,
      department = "All",
      workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      sections: requestedSectionIds,
      rooms: requestedRoomIds
    } = req.body;

    let sections = db.sections.find();
    if (requestedSectionIds && requestedSectionIds.length > 0) {
      sections = sections.filter(s => requestedSectionIds.includes(s.id));
    }

    let rooms = db.rooms.find();
    if (requestedRoomIds && requestedRoomIds.length > 0) {
      rooms = rooms.filter(r => requestedRoomIds.includes(r.id));
    }

    const subjects = db.subjects.find();
    const faculty = db.faculty.find();
    const timeSlots = db.timeslots.find();

    const result = generateOptimizedTimetable({
      sections,
      subjects,
      faculty,
      rooms,
      timeSlots,
      workingDays,
      academicYear,
      semester,
      department
    });

    const saved = db.timetables.create(result);
    db.conflicts.setAll(result.conflicts);

    res.status(201).json({
      success: true,
      message: "Optimized timetable successfully generated with minimum room allocation!",
      data: saved
    });
  } catch (err) {
    console.error("Timetable generation failed:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST /api/timetable/optimize - Re-optimize current room usage
router.post('/optimize', (req, res) => {
  try {
    const timetable = db.timetables.getLatest();
    const result = generateOptimizedTimetable({
      sections: db.sections.find(),
      subjects: db.subjects.find(),
      faculty: db.faculty.find(),
      rooms: db.rooms.find(),
      timeSlots: db.timeslots.find(),
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      academicYear: timetable ? timetable.academicYear : "2024-2025",
      semester: timetable ? timetable.semester : 4,
      department: "All"
    });

    const saved = db.timetables.create(result);
    res.json({
      success: true,
      message: "Room optimization completed successfully!",
      data: saved
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/timetable/entry/:entryId - Manual Editing with instant conflict check
router.put('/entry/:entryId', (req, res) => {
  const { entryId } = req.params;
  const { facultyId, roomId, day, slotNumber, subjectId } = req.body;

  const timetable = db.timetables.getLatest();
  if (!timetable) {
    return res.status(404).json({ success: false, message: 'No active timetable found' });
  }

  const entries = [...timetable.entries];
  const entryIdx = entries.findIndex(e => e.id === entryId);

  if (entryIdx === -1) {
    return res.status(404).json({ success: false, message: 'Timetable entry not found' });
  }

  const targetEntry = { ...entries[entryIdx] };

  // Update fields if provided
  if (facultyId) {
    const faculty = db.faculty.findById(facultyId);
    if (faculty) {
      targetEntry.facultyId = faculty.id;
      targetEntry.facultyName = faculty.name;
    }
  }

  if (roomId) {
    const room = db.rooms.findById(roomId);
    if (room) {
      targetEntry.roomId = room.id;
      targetEntry.roomNumber = room.roomNumber;
      targetEntry.roomType = room.roomType;
      targetEntry.capacity = room.capacity;
      targetEntry.building = room.building;
      targetEntry.floor = room.floor;
    }
  }

  if (subjectId) {
    const subject = db.subjects.findById(subjectId);
    if (subject) {
      targetEntry.subjectId = subject.id;
      targetEntry.subjectName = subject.name;
      targetEntry.subjectCode = subject.code;
      targetEntry.subjectType = subject.type;
    }
  }

  if (day) {
    targetEntry.day = day;
  }

  if (slotNumber) {
    const slot = db.timeslots.findById(slotNumber);
    if (slot) {
      targetEntry.slotNumber = slot.slotNumber;
      targetEntry.startTime = slot.startTime;
      targetEntry.endTime = slot.endTime;
    }
  }

  // Update in array
  entries[entryIdx] = targetEntry;

  // Run instant conflict detection
  const allConflicts = detectConflicts(entries, {
    facultyList: db.faculty.find(),
    roomList: db.rooms.find(),
    sectionList: db.sections.find(),
    subjectList: db.subjects.find()
  });

  // Check if target entry is involved in any conflict
  const relevantConflicts = allConflicts.filter(c =>
    c.classes && c.classes.some(cl => cl.id === entryId)
  );

  // Recalculate room minimization stats
  const usedRooms = new Set(entries.map(e => e.roomId)).size;
  const totalRooms = db.rooms.find().length;
  const roomsSaved = Math.max(0, totalRooms - usedRooms);
  const reductionPercent = totalRooms > 0 ? Math.round((roomsSaved / totalRooms) * 100) : 0;

  // Persist updated timetable
  timetable.entries = entries;
  timetable.conflicts = allConflicts;
  timetable.stats = {
    ...timetable.stats,
    requiredRooms: usedRooms,
    roomsSaved,
    roomReductionPercent: reductionPercent,
    conflicts: allConflicts.length
  };

  db.timetables.update(timetable.id, timetable);

  res.json({
    success: true,
    message: relevantConflicts.length > 0
      ? `Updated with ${relevantConflicts.length} conflict(s) detected!`
      : 'Entry successfully updated with 0 conflicts!',
    hasConflict: relevantConflicts.length > 0,
    relevantConflicts,
    entry: targetEntry,
    allConflicts
  });
});

// GET /api/timetable/conflicts - Conflict inspection endpoint
router.get('/conflicts', (req, res) => {
  const timetable = db.timetables.getLatest();
  if (!timetable) {
    return res.json({ success: true, count: 0, conflicts: [] });
  }

  const conflicts = detectConflicts(timetable.entries || [], {
    facultyList: db.faculty.find(),
    roomList: db.rooms.find(),
    sectionList: db.sections.find(),
    subjectList: db.subjects.find()
  });

  res.json({
    success: true,
    count: conflicts.length,
    conflicts
  });
});

// DELETE /api/timetable - Reset / clear current timetable
router.delete('/', (req, res) => {
  db.timetables.clear();
  db.conflicts.clear();
  res.json({ success: true, message: 'Timetable cleared successfully' });
});

export default router;
