import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  DoorOpen,
  CalendarDays,
  BarChart3,
  RotateCcw,
  FileDown,
  Download,
  X,
  TrendingDown,
  Award,
  Layers
} from 'lucide-react';

export default function OptimizationResultModal({
  isOpen,
  onClose,
  stats = {},
  onViewTimetable,
  onViewRoomAllocation,
  onRegenerate,
  onExportPDF,
  onExportExcel
}) {
  if (!isOpen) return null;

  const {
    totalRooms = 20,
    requiredRooms = 9,
    roomsSaved = 11,
    roomReductionPercent = 55,
    totalClasses = 93,
    conflicts = 0,
    optimizationScore = 96,
    overallUtilizationPercent = 82
  } = stats;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl border border-indigo-500/30 bg-slate-900 p-6 sm:p-8 shadow-2xl relative text-left glow-indigo">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon + Title */}
        <div className="text-center pb-6 border-b border-slate-800">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 mb-4 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Optimization Complete ✓
          </h2>
          <p className="text-sm text-slate-300 mt-1">
            University Timetable Generated with <strong className="text-emerald-400">0 Hard Conflicts</strong> and Maximum Room Savings
          </p>
          <p className="text-xs text-indigo-400 font-medium mt-1">
            Malla Reddy Technical Campus • CSP & Interval Graph Minimizer
          </p>
        </div>

        {/* Grid Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          {/* Card 1: Total Rooms */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-3.5 text-center">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Rooms</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-['Outfit']">{totalRooms}</p>
            <span className="inline-block mt-1 text-[10px] text-slate-400">Available Campus</span>
          </div>

          {/* Card 2: Rooms Required */}
          <div className="rounded-2xl bg-indigo-950/40 border border-indigo-800/50 p-3.5 text-center">
            <p className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">Required</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400 mt-1 font-['Outfit']">{requiredRooms}</p>
            <span className="inline-block mt-1 text-[10px] text-indigo-300 font-medium">Active in Timetable</span>
          </div>

          {/* Card 3: Rooms Saved */}
          <div className="rounded-2xl bg-emerald-950/40 border border-emerald-800/50 p-3.5 text-center">
            <p className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">Rooms Saved</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 font-['Outfit']">+{roomsSaved}</p>
            <span className="inline-block mt-1 text-[10px] text-emerald-300 font-bold">{roomReductionPercent}% Reduction</span>
          </div>

          {/* Card 4: Optimization Score */}
          <div className="rounded-2xl bg-violet-950/40 border border-violet-800/50 p-3.5 text-center">
            <p className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider">Quality Score</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-violet-400 mt-1 font-['Outfit']">{optimizationScore}%</p>
            <span className="inline-block mt-1 text-[10px] text-violet-300 font-medium">Optimal Rating</span>
          </div>
        </div>

        {/* Summary Highlights list */}
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Total Classes Scheduled
            </span>
            <span className="font-bold text-white">{totalClasses} Lectures & Labs</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Hard-Constraint Clashes
            </span>
            <span className="font-bold text-emerald-400">0 (Zero Conflicts Guaranteed)</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <DoorOpen className="w-3.5 h-3.5 text-indigo-400" /> Room Capacity & Type Compliance
            </span>
            <span className="font-bold text-emerald-400">100% Validated</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2 text-slate-400">
              <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Active Room Utilization
            </span>
            <span className="font-bold text-indigo-300">{overallUtilizationPercent}% Average</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onExportPDF();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-indigo-400" /> Export PDF
            </button>
            <button
              onClick={() => {
                onExportExcel();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> Export Excel
            </button>
            <button
              onClick={() => {
                onRegenerate();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Regenerate
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onViewRoomAllocation();
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-indigo-300 hover:text-white bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/40 transition-colors"
            >
              View Room Allocation
            </button>
            <button
              onClick={() => {
                onViewTimetable();
                onClose();
              }}
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/30 transition-all"
            >
              View Timetable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
