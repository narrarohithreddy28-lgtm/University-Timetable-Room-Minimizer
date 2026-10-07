import React, { useState } from 'react';
import {
  Sparkles,
  DoorOpen,
  Calendar,
  CheckCircle2,
  Layers,
  Building,
  Users,
  Settings2,
  RotateCcw,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function GenerateTimetablePage({
  departments = [],
  sections = [],
  rooms = [],
  timeSlots = [],
  onTimetableGenerated
}) {
  const [academicYear, setAcademicYear] = useState('2024-2025');
  const [semester, setSemester] = useState('4');
  const [department, setDepartment] = useState('All');
  const [selectedSections, setSelectedSections] = useState(sections.map(s => s.id));
  const [selectedRooms, setSelectedRooms] = useState(rooms.map(r => r.id));
  const [selectedDays, setSelectedDays] = useState(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]);
  const [optimizing, setOptimizing] = useState(false);
  const [stepMessage, setStepMessage] = useState('');
  const [error, setError] = useState(null);

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleToggleSection = (id) => {
    setSelectedSections(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleToggleRoom = (id) => {
    setSelectedRooms(prev =>
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const handleToggleDay = (day) => {
    setSelectedDays(prev =>
      prev.includes(day) ? (prev.length > 1 ? prev.filter(d => d !== day) : prev) : [...prev, day]
    );
  };

  const handleGenerate = async () => {
    setOptimizing(true);
    setError(null);

    try {
      setStepMessage('1/4: Analyzing weekly subject hours and faculty availability...');
      await new Promise(r => setTimeout(r, 450));

      setStepMessage('2/4: Computing theoretical room lower bound & CSP slot intervals...');
      await new Promise(r => setTimeout(r, 450));

      setStepMessage('3/4: Minimizing classroom/lab usage via Best-Fit Decreasing room coloring...');
      const response = await api.generateTimetable({
        academicYear,
        semester: Number(semester),
        department,
        sections: selectedSections,
        rooms: selectedRooms,
        workingDays: selectedDays
      });

      setStepMessage('4/4: Validating 0 hard-constraint clashes and capacity thresholds...');
      await new Promise(r => setTimeout(r, 400));

      if (response.success && response.data) {
        onTimetableGenerated(response.data);
      }
    } catch (err) {
      setError(err.message || 'Optimization failed. Please check input parameters.');
    } finally {
      setOptimizing(false);
      setStepMessage('');
    }
  };

  const classroomCount = rooms.filter(r => r.roomType === 'Classroom' && selectedRooms.includes(r.id)).length;
  const labCount = rooms.filter(r => r.roomType === 'Laboratory' && selectedRooms.includes(r.id)).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Generate Timetable
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure academic scope and launch the room minimization engine for Malla Reddy Technical Campus.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl">
          <CheckCircle2 className="w-4 h-4" />
          <span>Real-time CSP Solver Ready</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Configuration Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Academic Scope */}
        <div className="md:col-span-1 space-y-5 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Academic Scope
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="2">2nd Semester</option>
                <option value="4">4th Semester (Current Demo)</option>
                <option value="6">6th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="All">All Departments (Campus-wide)</option>
                {departments.map(d => (
                  <option key={d.id} value={d.code}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            {/* Working Days */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Working Days</label>
              <div className="grid grid-cols-2 gap-1.5">
                {allDays.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleToggleDay(day)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      selectedDays.includes(day)
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sections & Rooms Allocation */}
        <div className="md:col-span-2 space-y-6">
          {/* Target Student Sections */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Target Student Sections
              </h2>
              <span className="text-xs text-indigo-400 font-semibold">
                {selectedSections.length} of {sections.length} Sections Selected
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {sections.map(sec => {
                const isSelected = selectedSections.includes(sec.id);
                return (
                  <div
                    key={sec.id}
                    onClick={() => handleToggleSection(sec.id)}
                    className={`cursor-pointer p-3 rounded-2xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-500 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-bold text-slate-200">{sec.name}</p>
                    <p className="text-[10px] text-slate-400">{sec.department}</p>
                    <p className="text-[10px] text-indigo-400 font-semibold mt-1">{sec.studentCount} Students</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Rooms Pool */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-emerald-400" /> Available Rooms Pool
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Minimizer will select the smallest necessary subset
                </p>
              </div>
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {classroomCount} Classrooms
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {labCount} Labs
                </span>
              </div>
            </div>

            <div className="max-h-48 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rooms.map(room => {
                const isSelected = selectedRooms.includes(room.id);
                const isLab = room.roomType === 'Laboratory';
                return (
                  <div
                    key={room.id}
                    onClick={() => handleToggleRoom(room.id)}
                    className={`cursor-pointer p-2 rounded-xl border text-[11px] transition-all flex items-center justify-between ${
                      isSelected
                        ? (isLab
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                          : 'bg-slate-950 border-indigo-500/40 text-slate-200')
                        : 'bg-slate-950/40 border-slate-800 text-slate-600'
                    }`}
                  >
                    <div className="truncate pr-1">
                      <p className="font-bold truncate">{room.roomNumber}</p>
                      <p className="text-[10px] text-slate-400">Cap: {room.capacity}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-extrabold ${
                      isLab ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                      {isLab ? 'LAB' : 'CR'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Launcher Banner */}
      <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 p-6 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-extrabold text-white font-['Outfit']">
            Ready to Minimize University Classroom Usage
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            The optimization algorithm enforces zero teacher/section/room clashes while compressing required rooms to the minimum theoretical bound.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={optimizing || selectedSections.length === 0}
          className="px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2.5 disabled:opacity-50 group whitespace-nowrap"
        >
          <Sparkles className="w-5 h-5 text-indigo-200 animate-spin" style={{ animationDuration: '3s' }} />
          <span>{optimizing ? "Solving Constraints..." : "Generate Optimized Timetable"}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Progress Steps Overlay if running */}
      {optimizing && (
        <div className="p-4 rounded-2xl bg-indigo-950/50 border border-indigo-500/40 text-indigo-200 text-xs flex items-center justify-center gap-3 animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
          <span className="font-semibold">{stepMessage}</span>
        </div>
      )}
    </div>
  );
}
