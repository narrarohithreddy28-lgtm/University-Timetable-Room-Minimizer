import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

/**
 * Export Timetable to PDF
 */
export function exportToPDF({
  title = "University Timetable",
  subtitle = "Malla Reddy Technical Campus",
  entries = [],
  timeSlots = [],
  workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  filterLabel = "All Sections",
  stats = {}
}) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Header
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 297, 24, 'F');

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("MALLA REDDY TECHNICAL CAMPUS", 14, 11);

  doc.setFontSize(11);
  doc.setTextColor(199, 210, 254);
  doc.text(`${title.toUpperCase()} • ${filterLabel.toUpperCase()} • ACADEMIC YEAR 2024-2025`, 14, 18);

  // Sub-stats banner
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Rooms Required: ${stats.requiredRooms || 'N/A'} | Rooms Saved: ${stats.roomsSaved || 'N/A'} (${stats.roomReductionPercent || 0}% reduction)`, 14, 30);

  // Filter available slots
  const validSlots = timeSlots.filter(s => !s.isBreak).sort((a, b) => a.slotNumber - b.slotNumber);

  // Table columns: Day, followed by time slot labels
  const head = [["Day", ...validSlots.map(s => `${s.label || `Slot ${s.slotNumber}`}\n(${s.startTime}-${s.endTime})`)]];

  const body = workingDays.map(day => {
    const row = [day];
    validSlots.forEach(slot => {
      // Find matching entry/entries for this day and slot
      const matches = entries.filter(e => e.day === day && e.slotNumber === slot.slotNumber);
      if (matches.length > 0) {
        const cellText = matches.map(m =>
          `${m.subjectCode || m.subjectName}\n[${m.roomNumber}]\n${m.facultyName || ''}\n(${m.sectionName})`
        ).join('\n---\n');
        row.push(cellText);
      } else {
        row.push("-");
      }
    });
    return row;
  });

  doc.autoTable({
    head: head,
    body: body,
    startY: 34,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
      halign: 'center',
      valign: 'middle',
      lineColor: [203, 213, 225],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { fontStyle: 'bold', fillColor: [248, 250, 252], textColor: [15, 23, 42], width: 25 }
    },
    margin: { left: 10, right: 10 }
  });

  // Footer notes & signatures
  const finalY = doc.lastAutoTable?.finalY || 180;
  if (finalY < 185) {
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("Class In-charge", 30, finalY + 18);
    doc.text("Head of Department", 130, finalY + 18);
    doc.text("Principal / Academic Director", 225, finalY + 18);
  }

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_mrtc.pdf`);
}

/**
 * Export Timetable and Optimization stats to Excel
 */
export function exportToExcel({
  entries = [],
  roomDetails = [],
  stats = {}
}) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Master Schedule
  const scheduleData = entries.map(e => ({
    "Day": e.day,
    "Time Slot": `${e.startTime} - ${e.endTime}`,
    "Section": e.sectionName,
    "Subject Code": e.subjectCode,
    "Subject Name": e.subjectName,
    "Type": e.subjectType,
    "Faculty": e.facultyName,
    "Room Number": e.roomNumber,
    "Room Type": e.roomType,
    "Building": e.building,
    "Capacity": e.capacity,
    "Students": e.studentCount
  }));
  const ws1 = XLSX.utils.json_to_sheet(scheduleData);
  XLSX.utils.book_append_sheet(wb, ws1, "Timetable Schedule");

  // Sheet 2: Optimization & Room Savings
  const statsData = [
    { "Metric": "University Name", "Value": "Malla Reddy Technical Campus" },
    { "Metric": "Total Available Rooms", "Value": stats.totalRooms || 0 },
    { "Metric": "Rooms Required (Active)", "Value": stats.requiredRooms || 0 },
    { "Metric": "Rooms Saved", "Value": stats.roomsSaved || 0 },
    { "Metric": "Room Reduction Percentage", "Value": `${stats.roomReductionPercent || 0}%` },
    { "Metric": "Total Classes Scheduled", "Value": stats.totalClasses || 0 },
    { "Metric": "Hard Conflicts Detected", "Value": stats.conflicts || 0 },
    { "Metric": "Optimization Efficiency Score", "Value": `${stats.optimizationScore || 0}%` },
    { "Metric": "Average Active Room Utilization", "Value": `${stats.overallUtilizationPercent || 0}%` }
  ];
  const ws2 = XLSX.utils.json_to_sheet(statsData);
  XLSX.utils.book_append_sheet(wb, ws2, "Room Optimization Stats");

  // Sheet 3: Room Utilization Breakdown
  if (roomDetails && roomDetails.length > 0) {
    const roomSheetData = roomDetails.map(r => ({
      "Room Number": r.roomNumber,
      "Room Type": r.roomType,
      "Building": r.building,
      "Capacity": r.capacity,
      "Status": r.isUsed ? "Active" : "Saved / Unused",
      "Occupied Slots": r.occupiedSlots,
      "Available Slots": r.totalSlots,
      "Free Slots": r.freeSlots,
      "Utilization": `${r.utilizationPercent}%`
    }));
    const ws3 = XLSX.utils.json_to_sheet(roomSheetData);
    XLSX.utils.book_append_sheet(wb, ws3, "Room Utilization");
  }

  XLSX.writeFile(wb, "University_Timetable_Room_Minimizer_MRTC.xlsx");
}

/**
 * Export Timetable to CSV
 */
export function exportToCSV(entries = []) {
  const headers = ["Day", "Slot", "Time", "Section", "Subject Code", "Subject Name", "Type", "Faculty", "Room", "Room Type", "Building"];
  const rows = entries.map(e => [
    e.day,
    e.slotNumber,
    `"${e.startTime} - ${e.endTime}"`,
    `"${e.sectionName}"`,
    `"${e.subjectCode}"`,
    `"${e.subjectName}"`,
    e.subjectType,
    `"${e.facultyName}"`,
    `"${e.roomNumber}"`,
    `"${e.roomType}"`,
    `"${e.building}"`
  ]);

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "timetable_schedule_mrtc.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
