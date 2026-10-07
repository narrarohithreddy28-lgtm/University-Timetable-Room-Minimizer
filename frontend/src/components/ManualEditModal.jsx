import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, DoorOpen, Users, Clock, BookOpen, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function ManualEditModal({
  isOpen,
  onClose,
  entry,
  facultyList = [],
  roomList = [],
  subjectList = [],
  timeSlots = [],
  workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  onEntryUpdated
}) {
  if (!isOpen || !entry) return null;

  const [formData, setFormData] = useState({
    subjectId: entry.subjectId || '',
    facultyId: entry.facultyId || '',
    roomId: entry.roomId || '',
    day: entry.day || 'Monday',
    slotNumber: entry.slotNumber || 1
  });

  const [conflictWarning, setConflictWarning] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    setFormData({
      subjectId: entry.subjectId || '',
      facultyId: entry.facultyId || '',
      roomId: entry.roomId || '',
      day: entry.day || 'Monday',
      slotNumber: entry.slotNumber || 1
    });
    setConflictWarning(null);
    setSuccessMsg(null);
  }, [entry]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setConflictWarning(null);
    setSuccessMsg(null);

    try {
      const res = await api.updateTimetableEntry(entry.id, formData);
      if (res.hasConflict) {
        setConflictWarning(res.relevantConflicts || [{ description: 'Conflict detected with current assignment!' }]);
      } else {
        setSuccessMsg("Schedule updated with 0 conflicts!");
        setTimeout(() => {
          onEntryUpdated(res.entry);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setConflictWarning([{ description: err.message }]);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedRoom = roomList.find(r => r.id === formData.roomId);
  const selectedSubject = subjectList.find(s => s.id === formData.subjectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="text-base font-bold text-white">Manual Schedule Editor</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Section: <strong className="text-indigo-300">{entry.sectionName}</strong> ({entry.studentCount} students)
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Conflict Alert Banner */}
        {conflictWarning && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200">
            <div className="flex items-center gap-2 font-bold text-xs text-rose-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Conflict Warning Detected!</span>
            </div>
            <div className="mt-1.5 space-y-1">
              {conflictWarning.map((c, idx) => (
                <p key={idx} className="text-xs text-rose-300">
                  ⚠️ {c.description}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {/* Subject Field */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Subject
            </label>
            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {subjectList.map(s => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name} ({s.type})
                </option>
              ))}
            </select>
          </div>

          {/* Faculty Field */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Assigned Faculty
            </label>
            <select
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {facultyList.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.facultyId} - {f.department})
                </option>
              ))}
            </select>
          </div>

          {/* Room Field */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <DoorOpen className="w-3.5 h-3.5 text-indigo-400" /> Classroom / Lab
              </span>
              {selectedRoom && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  selectedRoom.capacity >= entry.studentCount
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-rose-400 bg-rose-500/10'
                }`}>
                  Cap: {selectedRoom.capacity} / Needed: {entry.studentCount}
                </span>
              )}
            </label>
            <select
              value={formData.roomId}
              onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              {roomList.map(r => (
                <option key={r.id} value={r.id}>
                  {r.roomNumber} ({r.roomType}, Cap: {r.capacity}) - {r.building}
                </option>
              ))}
            </select>
          </div>

          {/* Day & Slot in two columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                {workingDays.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Time Slot
              </label>
              <select
                value={formData.slotNumber}
                onChange={(e) => setFormData({ ...formData, slotNumber: Number(e.target.value) })}
                className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              >
                {timeSlots.filter(s => !s.isBreak).map(s => (
                  <option key={s.slotNumber} value={s.slotNumber}>
                    {s.label || `Slot ${s.slotNumber} (${s.startTime} - ${s.endTime})`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/30 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving ? "Validating & Saving..." : "Update Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
