import React, { useState } from 'react';
import {
  Clock,
  DoorOpen,
  User,
  BookOpen,
  FlaskConical,
  Edit3,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export default function TimetableGrid({
  entries = [],
  timeSlots = [],
  workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  onCellClick,
  isAdmin = true,
  filterDescription = "Master Timetable"
}) {
  const [activeMobileDay, setActiveMobileDay] = useState(workingDays[0] || 'Monday');

  // Filter valid slots excluding breaks
  const validSlots = timeSlots
    .filter(s => !s.isBreak)
    .sort((a, b) => a.slotNumber - b.slotNumber);

  // Helper to find matching entries in a given (day, slotNumber)
  const getCellEntries = (day, slotNumber) => {
    return entries.filter(e => e.day === day && e.slotNumber === slotNumber);
  };

  return (
    <div className="w-full space-y-4">
      {/* Grid Legend & Header info */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-slate-200">{filterDescription}</span>
          <span className="text-xs text-slate-500">• {entries.length} scheduled sessions</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-indigo-950/90 border border-indigo-600/50 inline-block" />
            <span className="text-slate-300 font-medium">Theory Class</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-emerald-950/90 border border-emerald-500/50 inline-block" />
            <span className="text-slate-300 font-medium">Laboratory</span>
          </div>
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-1 text-slate-400">
              <Edit3 className="w-3 h-3" />
              <span>Click any session to edit</span>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DAY SELECTOR TABS (Visible only on mobile/tablet) */}
      <div className="flex lg:hidden overflow-x-auto gap-2 pb-2">
        {workingDays.map(day => (
          <button
            key={day}
            onClick={() => setActiveMobileDay(day)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
              activeMobileDay === day
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* MOBILE TIMETABLE VIEW (Card list for activeMobileDay) */}
      <div className="block lg:hidden space-y-3">
        {validSlots.map(slot => {
          const slotEntries = getCellEntries(activeMobileDay, slot.slotNumber);
          return (
            <div
              key={slot.slotNumber}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">
                    {slot.label || `Slot ${slot.slotNumber}`} ({slot.startTime} - {slot.endTime})
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{activeMobileDay}</span>
              </div>

              <div className="pt-3">
                {slotEntries.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-600 italic">
                    Free Slot (No active classes)
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {slotEntries.map(entry => (
                      <div
                        key={entry.id}
                        onClick={() => isAdmin && onCellClick && onCellClick(entry)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          entry.subjectType === 'Laboratory'
                            ? 'bg-emerald-950/40 border-emerald-800/50 hover:border-emerald-500'
                            : 'bg-slate-950/70 border-slate-800 hover:border-indigo-500'
                        } ${isAdmin ? 'cursor-pointer hover:shadow-lg' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-white">{entry.subjectName}</span>
                            <span className="ml-2 text-[10px] text-slate-400 font-mono">({entry.subjectCode})</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            entry.subjectType === 'Laboratory'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}>
                            {entry.subjectType}
                          </span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
                          <span className="flex items-center gap-1 text-slate-400">
                            <DoorOpen className="w-3 h-3 text-indigo-400" />
                            <strong className="text-white">{entry.roomNumber}</strong> ({entry.roomType})
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <User className="w-3 h-3 text-violet-400" />
                            {entry.facultyName}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                            {entry.sectionName}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP MATRIX GRID TABLE */}
      <div className="hidden lg:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80">
              <th className="sticky left-0 z-20 w-36 px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-950/95 border-r border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> Time Slot
                </div>
              </th>
              {workingDays.map(day => (
                <th
                  key={day}
                  className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-300 text-center min-w-[190px] border-r border-slate-800/80 last:border-r-0"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {validSlots.map((slot, sIdx) => (
              <tr key={slot.slotNumber} className="hover:bg-slate-900/40 transition-colors">
                {/* Time slot label header */}
                <td className="sticky left-0 z-10 px-4 py-3 text-xs bg-slate-950/95 border-r border-slate-800 font-medium">
                  <div className="text-slate-200 font-bold">{slot.startTime} - {slot.endTime}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{slot.label || `Slot ${slot.slotNumber}`}</div>
                </td>

                {/* Day columns */}
                {workingDays.map(day => {
                  const cellEntries = getCellEntries(day, slot.slotNumber);
                  return (
                    <td
                      key={`${day}_${slot.slotNumber}`}
                      className="p-2 border-r border-slate-800/60 last:border-r-0 align-top h-24"
                    >
                      {cellEntries.length === 0 ? (
                        <div className="h-full flex items-center justify-center rounded-xl border border-dashed border-slate-800/70 p-2 text-[11px] text-slate-600 hover:border-slate-700 transition-colors">
                          <span className="italic">Free</span>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {cellEntries.map(entry => {
                            const isLab = entry.subjectType === 'Laboratory';
                            return (
                              <div
                                key={entry.id}
                                onClick={() => isAdmin && onCellClick && onCellClick(entry)}
                                className={`group relative rounded-xl p-2.5 transition-all text-left ${
                                  isLab
                                    ? 'bg-emerald-950/50 border border-emerald-700/60 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/50'
                                    : 'bg-slate-950/80 border border-slate-800 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-950/50'
                                } ${isAdmin ? 'cursor-pointer' : ''}`}
                              >
                                {/* Top bar: Code & Type Pill */}
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[11px] font-bold text-white tracking-tight truncate max-w-[120px]" title={entry.subjectName}>
                                    {entry.subjectCode}
                                  </span>
                                  <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ${
                                    isLab
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                  }`}>
                                    {isLab ? 'LAB' : 'THEORY'}
                                  </span>
                                </div>

                                {/* Subject Name */}
                                <p className="text-[11px] text-slate-300 font-medium line-clamp-1 mb-1.5" title={entry.subjectName}>
                                  {entry.subjectName}
                                </p>

                                {/* Bottom tags: Room, Faculty, Section */}
                                <div className="flex flex-wrap items-center justify-between gap-1 pt-1 border-t border-slate-800/80 text-[10px]">
                                  {/* Room badge */}
                                  <span className={`flex items-center gap-1 font-semibold ${
                                    isLab ? 'text-emerald-400' : 'text-indigo-400'
                                  }`}>
                                    <DoorOpen className="w-3 h-3" />
                                    <span>{entry.roomNumber}</span>
                                  </span>

                                  {/* Section badge */}
                                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                                    {entry.sectionName}
                                  </span>
                                </div>

                                {/* Faculty row */}
                                <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400 truncate">
                                  <User className="w-2.5 h-2.5 text-slate-500 flex-shrink-0" />
                                  <span className="truncate">{entry.facultyName}</span>
                                </div>

                                {isAdmin && (
                                  <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="p-1 rounded-md bg-indigo-600 text-white shadow">
                                      <Edit3 className="w-2.5 h-2.5" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
