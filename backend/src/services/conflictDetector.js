/**
 * Conflict Detector for University Timetable
 * Validates all 10 hard and soft constraints on a schedule.
 */

export function detectConflicts(entries, { facultyList = [], roomList = [], sectionList = [], subjectList = [] } = {}) {
  const conflicts = [];
  const facultyMap = new Map(facultyList.map(f => [f.id, f]));
  const roomMap = new Map(roomList.map(r => [r.id, r]));
  const sectionMap = new Map(sectionList.map(s => [s.id, s]));
  const subjectMap = new Map(subjectList.map(sub => [sub.id, sub]));

  // Index entries by day and slot for rapid pairwise clash checking
  const slotGroups = new Map();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const key = `${entry.day}_${entry.slotNumber}`;
    if (!slotGroups.has(key)) {
      slotGroups.set(key, []);
    }
    slotGroups.get(key).push({ entry, index: i });

    // Single-entry constraint checks:
    const room = roomMap.get(entry.roomId);
    const section = sectionMap.get(entry.sectionId);
    const subject = subjectMap.get(entry.subjectId);
    const faculty = facultyMap.get(entry.facultyId);

    // 4. Room capacity check
    if (room && section && room.capacity < section.studentCount) {
      conflicts.push({
        id: `conf_cap_${entry.id || i}`,
        type: "Room capacity insufficient",
        severity: "Hard",
        description: `Room ${room.roomNumber} capacity (${room.capacity}) is lower than ${section.name} student count (${section.studentCount})`,
        day: entry.day,
        slotNumber: entry.slotNumber,
        startTime: entry.startTime,
        endTime: entry.endTime,
        classes: [entry],
        details: {
          roomNumber: room.roomNumber,
          roomCapacity: room.capacity,
          sectionName: section.name,
          studentCount: section.studentCount
        }
      });
    }

    // 5. Laboratory required check
    if (subject && room) {
      if (subject.type === "Laboratory" && room.roomType !== "Laboratory") {
        conflicts.push({
          id: `conf_lab_${entry.id || i}`,
          type: "Laboratory required",
          severity: "Hard",
          description: `Laboratory subject "${subject.name}" (${subject.code}) is assigned to ${room.roomType} "${room.roomNumber}" instead of a Laboratory`,
          day: entry.day,
          slotNumber: entry.slotNumber,
          startTime: entry.startTime,
          endTime: entry.endTime,
          classes: [entry],
          details: {
            subjectName: subject.name,
            subjectType: subject.type,
            roomNumber: room.roomNumber,
            roomType: room.roomType
          }
        });
      }
    }

    // 6. Faculty availability check
    if (faculty) {
      const isDayAvailable = !faculty.availableDays || faculty.availableDays.includes(entry.day);
      const isSlotAvailable = !faculty.availableSlots || faculty.availableSlots.includes(Number(entry.slotNumber));
      if (!isDayAvailable || !isSlotAvailable) {
        conflicts.push({
          id: `conf_fac_avail_${entry.id || i}`,
          type: "Faculty unavailable",
          severity: "Hard",
          description: `Faculty "${faculty.name}" is marked unavailable on ${entry.day} at slot ${entry.slotNumber} (${entry.startTime} - ${entry.endTime})`,
          day: entry.day,
          slotNumber: entry.slotNumber,
          startTime: entry.startTime,
          endTime: entry.endTime,
          classes: [entry],
          details: {
            facultyName: faculty.name,
            day: entry.day,
            slotNumber: entry.slotNumber
          }
        });
      }
    }

    // 7. Room availability check
    if (room && room.isAvailable === false) {
      conflicts.push({
        id: `conf_rm_avail_${entry.id || i}`,
        type: "Room unavailable",
        severity: "Hard",
        description: `Room "${room.roomNumber}" is currently marked unavailable for scheduling`,
        day: entry.day,
        slotNumber: entry.slotNumber,
        startTime: entry.startTime,
        endTime: entry.endTime,
        classes: [entry],
        details: {
          roomNumber: room.roomNumber
        }
      });
    }
  }

  // Pairwise clash checks for same day and slot
  for (const [key, group] of slotGroups.entries()) {
    for (let a = 0; a < group.length; a++) {
      for (let b = a + 1; b < group.length; b++) {
        const itemA = group[a].entry;
        const itemB = group[b].entry;

        // 1. Faculty conflict
        if (itemA.facultyId && itemB.facultyId && itemA.facultyId === itemB.facultyId) {
          conflicts.push({
            id: `conf_fac_clash_${itemA.id}_${itemB.id}`,
            type: "Faculty conflict",
            severity: "Hard",
            description: `Faculty "${itemA.facultyName || 'Faculty'}" is assigned to two simultaneous classes: ${itemA.sectionName} (${itemA.subjectName}) and ${itemB.sectionName} (${itemB.subjectName})`,
            day: itemA.day,
            slotNumber: itemA.slotNumber,
            startTime: itemA.startTime,
            endTime: itemA.endTime,
            classes: [itemA, itemB],
            details: {
              facultyId: itemA.facultyId,
              facultyName: itemA.facultyName,
              sectionA: itemA.sectionName,
              subjectA: itemA.subjectName,
              sectionB: itemB.sectionName,
              subjectB: itemB.subjectName
            }
          });
        }

        // 2. Section conflict
        if (itemA.sectionId && itemB.sectionId && itemA.sectionId === itemB.sectionId) {
          conflicts.push({
            id: `conf_sec_clash_${itemA.id}_${itemB.id}`,
            type: "Section conflict",
            severity: "Hard",
            description: `Section "${itemA.sectionName}" is scheduled for two subjects simultaneously: "${itemA.subjectName}" and "${itemB.subjectName}"`,
            day: itemA.day,
            slotNumber: itemA.slotNumber,
            startTime: itemA.startTime,
            endTime: itemA.endTime,
            classes: [itemA, itemB],
            details: {
              sectionId: itemA.sectionId,
              sectionName: itemA.sectionName,
              subjectA: itemA.subjectName,
              subjectB: itemB.subjectName
            }
          });
        }

        // 3. Room conflict
        if (itemA.roomId && itemB.roomId && itemA.roomId === itemB.roomId) {
          conflicts.push({
            id: `conf_rm_clash_${itemA.id}_${itemB.id}`,
            type: "Room conflict",
            severity: "Hard",
            description: `Room "${itemA.roomNumber}" is double-booked by ${itemA.sectionName} (${itemA.subjectName}) and ${itemB.sectionName} (${itemB.subjectName})`,
            day: itemA.day,
            slotNumber: itemA.slotNumber,
            startTime: itemA.startTime,
            endTime: itemA.endTime,
            classes: [itemA, itemB],
            details: {
              roomId: itemA.roomId,
              roomNumber: itemA.roomNumber,
              sectionA: itemA.sectionName,
              subjectA: itemA.subjectName,
              sectionB: itemB.sectionName,
              subjectB: itemB.subjectName
            }
          });
        }
      }
    }
  }

  return conflicts;
}
