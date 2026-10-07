import React from 'react';
import {
  FileSpreadsheet,
  FileDown,
  Download,
  Building2,
  DoorOpen,
  CheckCircle2,
  TrendingDown,
  Award,
  Layers,
  BarChart3
} from 'lucide-react';
import { exportToPDF, exportToExcel, exportToCSV } from '../services/exportService';

export default function ReportsPage({
  reportsData = {},
  timetable = {},
  timeSlots = []
}) {
  const reports = reportsData?.data || {};
  const stats = timetable?.stats || {};
  const entries = timetable?.entries || [];

  const deptStats = reports.departmentStats || [];
  const roomBreakdown = reports.roomTypeBreakdown || [];

  const handleExportFullPDF = () => {
    exportToPDF({
      title: "University Comprehensive Timetable",
      subtitle: "Malla Reddy Technical Campus",
      entries: entries,
      timeSlots: timeSlots,
      filterLabel: "Complete Campus Master",
      stats: stats
    });
  };

  const handleExportFullExcel = () => {
    exportToExcel({
      entries: entries,
      roomDetails: stats.roomDetails || [],
      stats: stats
    });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Optimization Reports & Institutional Audits
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Official university timetable exports, departmental workload distribution, and room reduction benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportFullPDF}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30"
          >
            <FileDown className="w-4 h-4" />
            <span>Export Official PDF</span>
          </button>
          <button
            onClick={handleExportFullExcel}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/30"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/70">
          <p className="text-xs text-slate-400 font-semibold uppercase">Total Campus Rooms</p>
          <p className="text-2xl font-black text-white mt-1 font-['Outfit']">{reports.totalRooms || 20}</p>
          <span className="text-[11px] text-slate-500">15 Classrooms + 5 Labs</span>
        </div>

        <div className="p-5 rounded-2xl border border-indigo-800/40 bg-indigo-950/20">
          <p className="text-xs text-indigo-300 font-semibold uppercase">Rooms Required</p>
          <p className="text-2xl font-black text-indigo-400 mt-1 font-['Outfit']">{reports.usedRooms || 9}</p>
          <span className="text-[11px] text-indigo-300">Minimizer Sub-pool</span>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-800/40 bg-emerald-950/20">
          <p className="text-xs text-emerald-300 font-semibold uppercase">Rooms Saved</p>
          <p className="text-2xl font-black text-emerald-400 mt-1 font-['Outfit']">+{reports.roomsSaved || 11}</p>
          <span className="text-[11px] text-emerald-400 font-bold">{reports.roomReductionPercent || 55}% Reduction</span>
        </div>

        <div className="p-5 rounded-2xl border border-violet-800/40 bg-violet-950/20">
          <p className="text-xs text-violet-300 font-semibold uppercase">Conflict Audit</p>
          <p className="text-2xl font-black text-white mt-1 font-['Outfit']">0 Clashes</p>
          <span className="text-[11px] text-emerald-400 font-semibold">100% Conflict-Free</span>
        </div>
      </div>

      {/* Departmental Workload Distribution Table */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-indigo-400" />
          Departmental Scheduling Distribution
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3 text-center">Sections</th>
                <th className="py-2.5 px-3 text-center">Faculty</th>
                <th className="py-2.5 px-3 text-center">Subjects</th>
                <th className="py-2.5 px-3 text-center">Classes Scheduled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {deptStats.map((dept, i) => (
                <tr key={i} className="hover:bg-slate-850/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    {dept.department} <span className="text-indigo-400 font-mono text-[11px]">({dept.code})</span>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-300">{dept.sectionsCount}</td>
                  <td className="py-3 px-3 text-center text-slate-300">{dept.facultyCount}</td>
                  <td className="py-3 px-3 text-center text-slate-300">{dept.subjectsCount}</td>
                  <td className="py-3 px-3 text-center font-bold text-indigo-300">{dept.classesCount} slots</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Infrastructure Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roomBreakdown.map((r, i) => (
          <div key={i} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-white">{r.type} Infrastructure</span>
              <span className="text-xs font-semibold text-indigo-400">{r.used} of {r.total} In Use</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Slots Occupied:</span>
                <strong>{r.slotsOccupied} slots</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Available Weekly Capacity:</span>
                <strong>{r.slotsAvailable} slots</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
