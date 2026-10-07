import React, { useState } from 'react';
import {
  AlertOctagon,
  CheckCircle2,
  AlertTriangle,
  User,
  DoorOpen,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';

export default function ConflictsPage({
  conflicts = [],
  onResolveClick,
  onRunOptimizer
}) {
  const [selectedType, setSelectedType] = useState('all');
  const [expandedConflictId, setExpandedConflictId] = useState(null);

  const filteredConflicts = conflicts.filter(c => {
    if (selectedType === 'all') return true;
    return c.type.toLowerCase().includes(selectedType.toLowerCase());
  });

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-2 rounded-xl ${
              conflicts.length === 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
            }`}>
              <AlertOctagon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Conflict Detection Center
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time constraint verification for faculty, room double-booking, section clashing, and capacity compliance.
          </p>
        </div>

        <button
          onClick={onRunOptimizer}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Re-Run Optimizer</span>
        </button>
      </div>

      {/* Main Status Banner */}
      {conflicts.length === 0 ? (
        <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-8 backdrop-blur-md text-center space-y-4 glow-emerald">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white font-['Outfit']">
              All 10 Hard Constraints Verified (0 Conflicts)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-2">
              The university timetable has zero double-booked rooms, zero faculty clashes, zero section overlaps, and all laboratories and room capacities are 100% compliant.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-4 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>No Faculty Double-Booking</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>No Room Double-Booking</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Room Capacity Compliant</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Dedicated Laboratories</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Faculty Availability Met</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Balanced Subject Hours</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>
                <strong>{conflicts.length} Hard Conflicts Detected!</strong> Review the overlapping classes below and make adjustments.
              </span>
            </div>
          </div>

          {/* List of conflicts */}
          <div className="space-y-3">
            {filteredConflicts.map((c, idx) => {
              const isExpanded = expandedConflictId === (c.id || idx);
              return (
                <div
                  key={c.id || idx}
                  className="rounded-2xl border border-rose-800/60 bg-slate-900/90 p-5 shadow-lg space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          {c.type}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">
                          {c.day} • Slot {c.slotNumber} ({c.startTime} - {c.endTime})
                        </span>
                      </div>
                      <p className="text-sm font-bold text-white pt-1">{c.description}</p>
                    </div>

                    <button
                      onClick={() => setExpandedConflictId(isExpanded ? null : (c.id || idx))}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    >
                      {isExpanded ? 'Hide Details' : 'Inspect Classes'}
                    </button>
                  </div>

                  {/* Expanded classes comparison */}
                  {isExpanded && c.classes && (
                    <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {c.classes.map((cl, cIdx) => (
                        <div key={cIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                          <p className="font-bold text-indigo-300">Class {cIdx + 1}: {cl.subjectName} ({cl.subjectCode})</p>
                          <p className="text-slate-400">Section: <strong className="text-slate-200">{cl.sectionName}</strong></p>
                          <p className="text-slate-400">Faculty: <strong className="text-slate-200">{cl.facultyName}</strong></p>
                          <p className="text-slate-400">Room: <strong className="text-slate-200">{cl.roomNumber}</strong> ({cl.roomType})</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
