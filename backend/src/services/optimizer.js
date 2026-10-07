import { v4 as uuidv4 } from 'uuid';
import { detectConflicts } from './conflictDetector.js';

/**
 * Intelligent University Timetable Optimizer & Room Minimizer
 */
export function generateOptimizedTimetable({
  sections = [],
  subjects = [],
  faculty = [],
  rooms = [],
  timeSlots = [],
  workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  academicYear = "2024-2025",
  semester = 4,
  department = "All"
}) {
  console.log(`Starting optimization: ${sections.length} sections, ${subjects.length} subjects, ${faculty.length} faculty, ${rooms.length} rooms...`);

  // 1. Filter valid slots (skip breaks like lunch)
  const availableSlots = timeSlots
    .filter(s => !s.isBreak && s.isAvailable !== false)
    .sort((a, b) => a.slotNumber - b.slotNumber);

  if (availableSlots.length === 0) {
    throw new Error("No available time slots configured for scheduling.");
  }

  // 2. Filter target sections
  let targetSections = sections;
  if (department && department !== "All") {
    targetSections = sections.filter(s => s.department === department || s.departmentId === department);
  }
  if (semester) {
    targetSections = targetSections.filter(s => Number(s.semester) === Number(semester));
  }

  if (targetSections.length === 0) {
    targetSections = sections; // fallback if filter too narrow
  }

  // Maps for quick lookup
  const facultyMap = new Map(faculty.map(f => [f.id, f]));
  const subjectMap = new Map(subjects.map(s => [s.id, s]));

  // Available classrooms and labs
  const classrooms = rooms.filter(r => r.roomType === "Classroom" && r.isAvailable !== false).sort((a, b) => a.capacity - b.capacity);
  const laboratories = rooms.filter(r => r.roomType === "Laboratory" && r.isAvailable !== false).sort((a, b) => a.capacity - b.capacity);
  const seminarHalls = rooms.filter(r => r.roomType === "Seminar Hall" && r.isAvailable !== false);

  const availableTheoryRooms = [...classrooms, ...seminarHalls];
  const availableLabRooms = [...laboratories];

  if (availableTheoryRooms.length === 0) {
    throw new Error("No classrooms available for theory subjects.");
  }
  if (availableLabRooms.length === 0 && subjects.some(s => s.type === "Laboratory")) {
    throw new Error("No laboratories available for laboratory subjects.");
  }

  // 3. Build class requirements for each section
  // Each section needs to complete weekly hours for its department subjects
  const requiredSessions = [];

  for (const section of targetSections) {
    // Find subjects for section's department
    const sectionSubjects = subjects.filter(sub => {
      const matchDept = sub.departmentId === section.departmentId || sub.department === section.department;
      const matchSem = !sub.semester || Number(sub.semester) === Number(section.semester);
      return matchDept && matchSem;
    });

    for (const subject of sectionSubjects) {
      // Find qualified faculty
      const eligibleFaculty = faculty.filter(f => {
        const matchesSubject = f.subjects && (f.subjects.includes(subject.id) || f.subjects.includes(subject.code));
        const matchesDept = f.departmentId === section.departmentId || f.department === section.department;
        return matchesSubject || matchesDept;
      });

      // Distribute faculty based on section index to avoid all sections claiming the same teacher
      let assignedFaculty = eligibleFaculty[0] || faculty[0];
      if (eligibleFaculty.length > 1) {
        const secHash = section.name.charCodeAt(section.name.length - 1) % eligibleFaculty.length;
        assignedFaculty = eligibleFaculty[secHash];
      }

      const hours = Number(subject.weeklyHours) || 3;

      if (subject.type === "Laboratory") {
        // Labs are grouped in 2-3 hour continuous blocks or split blocks
        const labBlockSize = Math.min(hours, 3);
        requiredSessions.push({
          id: `req_${section.id}_${subject.id}_lab`,
          section,
          subject,
          faculty: assignedFaculty,
          isLab: true,
          blockSize: labBlockSize,
          totalHours: hours
        });
      } else {
        // Theory classes: individual 1-hour sessions
        for (let h = 0; h < hours; h++) {
          requiredSessions.push({
            id: `req_${section.id}_${subject.id}_th_${h}`,
            section,
            subject,
            faculty: assignedFaculty,
            isLab: false,
            blockSize: 1,
            sessionIndex: h
          });
        }
      }
    }
  }

  // 4. Constraint Satisfaction & Heuristic Scheduling
  // Matrix tracking:
  // sectionBooked[sectionId][`${day}_${slot}`] = true
  // facultyBooked[facultyId][`${day}_${slot}`] = true
  // sectionSubjectCountPerDay[sectionId][`${day}_${subjectId}`] = count
  const sectionBooked = new Map();
  const facultyBooked = new Map();
  const sectionSubjectCountPerDay = new Map();

  const isFacultyFree = (facultyId, day, slotNumber) => {
    if (!facultyId) return true;
    const fac = facultyMap.get(facultyId);
    if (fac) {
      if (fac.availableDays && !fac.availableDays.includes(day)) return false;
      if (fac.availableSlots && !fac.availableSlots.includes(slotNumber)) return false;
    }
    const key = `${day}_${slotNumber}`;
    return !facultyBooked.get(`${facultyId}_${key}`);
  };

  const isSectionFree = (sectionId, day, slotNumber) => {
    const key = `${day}_${slotNumber}`;
    return !sectionBooked.get(`${sectionId}_${key}`);
  };

  const markBooked = (sectionId, facultyId, subjectId, day, slotNumber) => {
    const key = `${day}_${slotNumber}`;
    sectionBooked.set(`${sectionId}_${key}`, true);
    if (facultyId) {
      facultyBooked.set(`${facultyId}_${key}`, true);
    }
    const daySubKey = `${sectionId}_${day}_${subjectId}`;
    const cur = sectionSubjectCountPerDay.get(daySubKey) || 0;
    sectionSubjectCountPerDay.set(daySubKey, cur + 1);
  };

  // Schedule Lab sessions first (since they require contiguous slots & specialized labs)
  const rawScheduledSlots = [];
  const labSessions = requiredSessions.filter(s => s.isLab);
  const theorySessions = requiredSessions.filter(s => !s.isLab);

  // Preferred lab days per section
  const dayOrder = [...workingDays];

  for (const lab of labSessions) {
    let scheduled = false;
    // Try to find a continuous block of slots on a suitable day
    for (let dayIdx = 0; dayIdx < dayOrder.length && !scheduled; dayIdx++) {
      const day = dayOrder[(dayIdx + targetSections.indexOf(lab.section)) % dayOrder.length];

      // Prefer afternoon or morning blocks for labs
      for (let sIdx = 0; sIdx <= availableSlots.length - lab.blockSize && !scheduled; sIdx++) {
        const slotsToUse = availableSlots.slice(sIdx, sIdx + lab.blockSize);

        // Check if all consecutive slots are free for section & faculty
        const canFit = slotsToUse.every(slot =>
          isSectionFree(lab.section.id, day, slot.slotNumber) &&
          isFacultyFree(lab.faculty?.id, day, slot.slotNumber)
        );

        if (canFit) {
          for (const slot of slotsToUse) {
            markBooked(lab.section.id, lab.faculty?.id, lab.subject.id, day, slot.slotNumber);
            rawScheduledSlots.push({
              section: lab.section,
              subject: lab.subject,
              faculty: lab.faculty,
              day,
              slotNumber: slot.slotNumber,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isLab: true
            });
          }
          scheduled = true;
        }
      }
    }
  }

  // Schedule Theory sessions
  // Sort theory sessions to balance sections and subjects
  for (const session of theorySessions) {
    let scheduled = false;

    // Sort days to balance workload across week
    // Spread heuristic: pick day where this section has fewest classes and subject not yet taught
    const sortedDays = [...workingDays].sort((d1, d2) => {
      const c1 = sectionSubjectCountPerDay.get(`${session.section.id}_${d1}_${session.subject.id}`) || 0;
      const c2 = sectionSubjectCountPerDay.get(`${session.section.id}_${d2}_${session.subject.id}`) || 0;
      return c1 - c2;
    });

    for (const day of sortedDays) {
      if (scheduled) break;

      // Soft constraint: avoid having same subject twice on same day if possible
      const timesSubjectToday = sectionSubjectCountPerDay.get(`${session.section.id}_${day}_${session.subject.id}`) || 0;
      if (timesSubjectToday >= 2) continue;

      for (const slot of availableSlots) {
        if (
          isSectionFree(session.section.id, day, slot.slotNumber) &&
          isFacultyFree(session.faculty?.id, day, slot.slotNumber)
        ) {
          markBooked(session.section.id, session.faculty?.id, session.subject.id, day, slot.slotNumber);
          rawScheduledSlots.push({
            section: session.section,
            subject: session.subject,
            faculty: session.faculty,
            day,
            slotNumber: slot.slotNumber,
            startTime: slot.startTime,
            endTime: slot.endTime,
            isLab: false
          });
          scheduled = true;
          break;
        }
      }
    }

    // Fallback if tight: relax subject-per-day restriction
    if (!scheduled) {
      for (const day of workingDays) {
        if (scheduled) break;
        for (const slot of availableSlots) {
          if (
            isSectionFree(session.section.id, day, slot.slotNumber) &&
            isFacultyFree(session.faculty?.id, day, slot.slotNumber)
          ) {
            markBooked(session.section.id, session.faculty?.id, session.subject.id, day, slot.slotNumber);
            rawScheduledSlots.push({
              section: session.section,
              subject: session.subject,
              faculty: session.faculty,
              day,
              slotNumber: slot.slotNumber,
              startTime: slot.startTime,
              endTime: slot.endTime,
              isLab: false
            });
            scheduled = true;
            break;
          }
        }
      }
    }
  }

  // 5. Intelligent Room Minimization Allocation (Graph Coloring / Best-Fit Decreasing)
  // Our goal: Minimize total distinct rooms used across the entire timetable!
  //
  // Step 5a: Group scheduled slots by (day, slotNumber)
  const slotGroups = new Map();
  for (const item of rawScheduledSlots) {
    const key = `${item.day}_${item.slotNumber}`;
    if (!slotGroups.has(key)) {
      slotGroups.set(key, []);
    }
    slotGroups.get(key).push(item);
  }

  // Step 5b: Calculate maximum simultaneous theory classes and lab classes
  let maxConcurrentTheory = 0;
  let maxConcurrentLab = 0;
  for (const [, items] of slotGroups.entries()) {
    const theoryCount = items.filter(i => !i.isLab).length;
    const labCount = items.filter(i => i.isLab).length;
    if (theoryCount > maxConcurrentTheory) maxConcurrentTheory = theoryCount;
    if (labCount > maxConcurrentLab) maxConcurrentLab = labCount;
  }

  console.log(`Max concurrent classes at any slot: Theory=${maxConcurrentTheory}, Lab=${maxConcurrentLab}`);

  // Step 5c: Form the "Active Minimized Room Pool"
  // For theory: Pick the best fitting classrooms whose capacity >= maximum section size
  // Sort theory rooms by capacity and stability
  const sortedTheoryRooms = [...availableTheoryRooms].sort((a, b) => a.capacity - b.capacity);
  const sortedLabRooms = [...availableLabRooms].sort((a, b) => a.capacity - b.capacity);

  // We only recruit the minimal needed rooms into the active pool:
  // Active theory rooms = first (maxConcurrentTheory) rooms that satisfy capacities
  const activeTheoryPool = sortedTheoryRooms.slice(0, Math.max(maxConcurrentTheory, 1));
  const activeLabPool = sortedLabRooms.slice(0, Math.max(maxConcurrentLab, 1));

  // Preferred "Home Room" for each section for consistency
  const sectionHomeRooms = new Map();
  targetSections.forEach((sec, idx) => {
    // Pick from activeTheoryPool
    const compatible = activeTheoryPool.filter(r => r.capacity >= sec.studentCount);
    const assigned = compatible[idx % compatible.length] || activeTheoryPool[0];
    sectionHomeRooms.set(sec.id, assigned);
  });

  // Step 5d: Allocate rooms slot by slot using Best-Fit Greedy Coloring
  // roomOccupied[roomId][`${day}_${slot}`] = true
  const roomOccupied = new Map();
  const finalEntries = [];
  const usedRoomIds = new Set();

  for (const [key, items] of slotGroups.entries()) {
    // Sort items by section student count descending (hardest to fit first)
    items.sort((a, b) => b.section.studentCount - a.section.studentCount);

    for (const item of items) {
      let allocatedRoom = null;

      if (item.isLab) {
        // Find best-fitting available lab from activeLabPool
        for (const lab of activeLabPool) {
          if (!roomOccupied.get(`${lab.id}_${key}`) && lab.capacity >= item.section.studentCount) {
            allocatedRoom = lab;
            break;
          }
        }
        // If active pool full, minimally expand to spare labs
        if (!allocatedRoom) {
          for (const lab of availableLabRooms) {
            if (!roomOccupied.get(`${lab.id}_${key}`) && lab.capacity >= item.section.studentCount) {
              allocatedRoom = lab;
              if (!activeLabPool.includes(lab)) activeLabPool.push(lab);
              break;
            }
          }
        }
      } else {
        // Theory class:
        // Heuristic 1: Check if the section's home room is free at this slot
        const homeRoom = sectionHomeRooms.get(item.section.id);
        if (homeRoom && !roomOccupied.get(`${homeRoom.id}_${key}`) && homeRoom.capacity >= item.section.studentCount) {
          allocatedRoom = homeRoom;
        }

        // Heuristic 2: Best-Fit from activeTheoryPool
        if (!allocatedRoom) {
          for (const room of activeTheoryPool) {
            if (!roomOccupied.get(`${room.id}_${key}`) && room.capacity >= item.section.studentCount) {
              allocatedRoom = room;
              break;
            }
          }
        }

        // Heuristic 3: Minimally expand from spare classrooms only if completely saturated
        if (!allocatedRoom) {
          for (const room of availableTheoryRooms) {
            if (!roomOccupied.get(`${room.id}_${key}`) && room.capacity >= item.section.studentCount) {
              allocatedRoom = room;
              if (!activeTheoryPool.includes(room)) activeTheoryPool.push(room);
              break;
            }
          }
        }
      }

      // Safety fallback to any available room
      if (!allocatedRoom) {
        allocatedRoom = item.isLab ? availableLabRooms[0] : availableTheoryRooms[0];
      }

      // Mark room occupied for this slot
      roomOccupied.set(`${allocatedRoom.id}_${key}`, true);
      usedRoomIds.add(allocatedRoom.id);

      finalEntries.push({
        id: `entry_${uuidv4().slice(0, 8)}`,
        day: item.day,
        slotNumber: item.slotNumber,
        startTime: item.startTime,
        endTime: item.endTime,
        sectionId: item.section.id,
        sectionName: item.section.name,
        subjectId: item.subject.id,
        subjectName: item.subject.name,
        subjectCode: item.subject.code,
        subjectType: item.subject.type,
        facultyId: item.faculty ? item.faculty.id : null,
        facultyName: item.faculty ? item.faculty.name : "Unassigned",
        roomId: allocatedRoom.id,
        roomNumber: allocatedRoom.roomNumber,
        roomType: allocatedRoom.roomType,
        building: allocatedRoom.building,
        floor: allocatedRoom.floor,
        capacity: allocatedRoom.capacity,
        studentCount: item.section.studentCount
      });
    }
  }

  // 6. Rigorous Conflict Validation (Verify 0 Hard Constraints)
  const conflicts = detectConflicts(finalEntries, {
    facultyList: faculty,
    roomList: rooms,
    sectionList: sections,
    subjectList: subjects
  });

  console.log(`Validation completed: ${conflicts.length} conflicts detected.`);

  // 7. Calculate Room Minimization & Utilization Statistics
  const totalRoomsCount = rooms.length;
  const requiredRoomsCount = usedRoomIds.size;
  const roomsSavedCount = Math.max(0, totalRoomsCount - requiredRoomsCount);
  const roomReductionPercent = totalRoomsCount > 0 ? Math.round((roomsSavedCount / totalRoomsCount) * 100) : 0;

  // Total working slots across week per room = workingDays * availableSlots
  const totalSlotsPerRoom = workingDays.length * availableSlots.length;

  const roomDetails = rooms.map(room => {
    const isUsed = usedRoomIds.has(room.id);
    const occupiedSlots = finalEntries.filter(e => e.roomId === room.id).length;
    const freeSlots = Math.max(0, totalSlotsPerRoom - occupiedSlots);
    const utilizationPercent = totalSlotsPerRoom > 0 ? Math.round((occupiedSlots / totalSlotsPerRoom) * 100) : 0;

    return {
      id: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      isUsed,
      totalSlots: totalSlotsPerRoom,
      occupiedSlots,
      freeSlots,
      utilizationPercent
    };
  });

  // Calculate overall utilization of active rooms
  const activeRooms = roomDetails.filter(r => r.isUsed);
  const avgActiveUtilization = activeRooms.length > 0
    ? Math.round(activeRooms.reduce((acc, r) => acc + r.utilizationPercent, 0) / activeRooms.length)
    : 0;

  // Optimization score: 100 base minus penalty for any conflicts, plus bonus for room reduction
  const conflictPenalty = conflicts.length * 25;
  const roomSavingsFactor = (roomsSavedCount / totalRoomsCount) * 10;
  const utilizationFactor = (avgActiveUtilization / 100) * 5;
  const rawScore = 85 + roomSavingsFactor + utilizationFactor - conflictPenalty;
  const optimizationScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    academicYear,
    semester,
    department,
    generatedAt: new Date().toISOString(),
    entries: finalEntries,
    conflicts,
    stats: {
      totalRooms: totalRoomsCount,
      requiredRooms: requiredRoomsCount,
      roomsSaved: roomsSavedCount,
      roomReductionPercent,
      totalClasses: finalEntries.length,
      conflicts: conflicts.length,
      optimizationScore,
      overallUtilizationPercent: avgActiveUtilization,
      workingDaysCount: workingDays.length,
      slotsPerDay: availableSlots.length,
      totalWorkingSlots: totalSlotsPerRoom,
      roomDetails
    }
  };
}
