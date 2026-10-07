import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Filter,
  FileDown,
  Download,
  Search,
  Users,
  DoorOpen,
  Layers,
  Sparkles,
  Building2,
  RefreshCw
} from 'lucide-react';
import TimetableGrid from '../components/TimetableGrid';
import ManualEditModal from '../components/ManualEditModal';
import { exportToPDF, exportToExcel, exportToCSV } from '../services/exportService';
import { useAuth } from '../context/AuthContext';

export default function TimetablePage({
  timetable = {},
  departments = [],
  sections = [],
  facultyList = [],
  roomList = [],
  subjectList = [],
  timeSlots = [],
  onTimetableUpdated
}) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isFaculty = user?.role === 'faculty';
  const isStudent = user?.role === 'student';

  // Filter modes: 'master' | 'section' | 'faculty' | 'room' | 'department'
  const [filterMode, setFilterMode] = useState(() => {
    if (isFaculty) return 'faculty';
    if (isStudent) return 'section';
    return 'section';
  });

  const [selectedSectionId, setSelectedSectionId] = useState(() => {
    if (isStudent && user?.sectionId) return user.sectionId;
    return sections[0]?.id || '';
  });

  const [selectedFacultyId, setSelectedFacultyId] = useState(() => {
    if (isFaculty && user?.facultyId) {
      const match = facultyList.find(f => f.facultyId === user.facultyId || f.id === user.id);
      return match ? match.id : (facultyList[0]?.id || '');
    }
    return facultyList[0]?.id || '';
  });

  const [selectedRoomId, setSelectedRoomId] = useState(roomList[0]?.id || '');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('All');

  // Edit modal state
  const [editingEntry, setEditingEntry] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const rawEntries = timetable.entries || [];
  const stats = timetable.stats || {};
  const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Filter entries based on active filters
  const filteredEntries = useMemo(() => {
    let result = rawEntries;

    // Filter by mode
    if (filterMode === 'section' && selectedSectionId) {
      result = result.filter(e => e.sectionId === selectedSectionId);
    } else if (filterMode === 'faculty' && selectedFacultyId) {
      result = result.filter(e => e.facultyId === selectedFacultyId);
    } else if (filterMode === 'room' && selectedRoomId) {
      result = result.filter(e => e.roomId === selectedRoomId);
    } else if (filterMode === 'department' && selectedDept !== 'All') {
      const deptSecs = sections.filter(s => s.department === selectedDept || s.departmentId === selectedDept);
      const secIds = new Set(deptSecs.map(s => s.id));
      result = result.filter(e => secIds.has(e.sectionId));
    }

    // Filter by day
    if (selectedDay !== 'All') {
      result = result.filter(e => e.day.toLowerCase() === selectedDay.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e =>
        (e.subjectName && e.subjectName.toLowerCase().includes(q)) ||
        (e.subjectCode && e.subjectCode.toLowerCase().includes(q)) ||
        (e.facultyName && e.facultyName.toLowerCase().includes(q)) ||
        (e.roomNumber && e.roomNumber.toLowerCase().includes(q)) ||
        (e.sectionName && e.sectionName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [rawEntries, filterMode, selectedSectionId, selectedFacultyId, selectedRoomId, selectedDept, selectedDay, searchQuery, sections]);

  // Compute active filter label for export
  const getFilterLabel = () => {
    if (filterMode === 'section') {
      const sec = sections.find(s => s.id === selectedSectionId);
      return sec ? `Section ${sec.name} (${sec.department})` : "Section Timetable";
    }
    if (filterMode === 'faculty') {
      const fac = facultyList.find(f => f.id === selectedFacultyId);
      return fac ? `Faculty: ${fac.name} (${fac.facultyId})` : "Faculty Timetable";
    }
    if (filterMode === 'room') {
      const rm = roomList.find(r => r.id === selectedRoomId);
      return rm ? `Room: ${rm.roomNumber} (${rm.roomType})` : "Room Timetable";
    }
    if (filterMode === 'department') {
      return `Department: ${selectedDept}`;
    }
    return "Complete University Timetable";
  };

  const handleExportPDF = () => {
    exportToPDF({
      title: `${getFilterLabel()} Schedule`,
      subtitle: "Malla Reddy Technical Campus",
      entries: filteredEntries,
      timeSlots,
      workingDays: selectedDay === 'All' ? workingDays : [selectedDay],
      filterLabel: getFilterLabel(),
      stats
    });
  };

  const handleExportExcel = () => {
    exportToExcel({
      entries: filteredEntries,
      roomDetails: stats.roomDetails || [],
      stats
    });
  };

  const handleExportCSV = () => {
    exportToCSV(filteredEntries);
  };

  const handleCellClick = (entry) => {
    if (isAdmin) {
      setEditingEntry(entry);
      setIsEditModalOpen(true);
    }
  };

  const handleEntryUpdated = (updated) => {
    if (onTimetableUpdated) {
      onTimetableUpdated();
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header & Export Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Timetable Schedule Matrix
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Displaying optimized weekly timetable for {getFilterLabel()}
          </p>
        </div>

        {/* Export Buttons Group */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors shadow-sm"
            title="Export Timetable as Official PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors shadow-sm"
            title="Export Timetable as Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors shadow-sm"
            title="Export Timetable as CSV"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4">
        {/* Row 1: Mode Switcher Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-indigo-400" /> View Schedule By:
            </span>

            <button
              onClick={() => setFilterMode('section')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterMode === 'section'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Student Section
            </button>

            <button
              onClick={() => setFilterMode('faculty')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterMode === 'faculty'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Faculty Member
            </button>

            <button
              onClick={() => setFilterMode('room')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterMode === 'room'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Classroom / Lab
            </button>

            <button
              onClick={() => setFilterMode('department')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterMode === 'department'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Department
            </button>

            <button
              onClick={() => setFilterMode('master')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                filterMode === 'master'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              Master All
            </button>
          </div>

          {/* Quick Active Target Select */}
          <div className="flex items-center gap-2">
            {filterMode === 'section' && (
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
                ))}
              </select>
            )}

            {filterMode === 'faculty' && (
              <select
                value={selectedFacultyId}
                onChange={(e) => setSelectedFacultyId(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {facultyList.map(f => (
                  <option key={f.id} value={f.id}>{f.name} ({f.department})</option>
                ))}
              </select>
            )}

            {filterMode === 'room' && (
              <select
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                {roomList.map(r => (
                  <option key={r.id} value={r.id}>{r.roomNumber} ({r.roomType})</option>
                ))}
              </select>
            )}

            {filterMode === 'department' && (
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.code}>{d.name} ({d.code})</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Row 2: Search input + Day filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by subject, code, teacher, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Day:</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All Working Days</option>
              {workingDays.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Timetable Grid Component */}
      <TimetableGrid
        entries={filteredEntries}
        timeSlots={timeSlots}
        workingDays={selectedDay === 'All' ? workingDays : [selectedDay]}
        onCellClick={handleCellClick}
        isAdmin={isAdmin}
        filterDescription={getFilterLabel()}
      />

      {/* Manual Edit Modal */}
      {isEditModalOpen && (
        <ManualEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          entry={editingEntry}
          facultyList={facultyList}
          roomList={roomList}
          subjectList={subjectList}
          timeSlots={timeSlots}
          workingDays={workingDays}
          onEntryUpdated={handleEntryUpdated}
        />
      )}
    </div>
  );
}
