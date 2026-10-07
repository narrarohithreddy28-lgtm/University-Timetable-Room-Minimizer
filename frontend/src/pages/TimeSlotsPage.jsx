import React, { useState } from 'react';
import { Clock, Plus, Edit2, Trash2, X, Coffee, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function TimeSlotsPage({ timeSlots = [], onRefresh }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({
    slotNumber: 1,
    startTime: '09:00',
    endTime: '10:00',
    label: '09:00 - 10:00',
    isBreak: false,
    isAvailable: true
  });
  const [error, setError] = useState(null);

  const sortedSlots = [...timeSlots].sort((a, b) => a.slotNumber - b.slotNumber);

  const handleOpenAdd = () => {
    setEditingSlot(null);
    setFormData({
      slotNumber: (timeSlots.length || 0) + 1,
      startTime: '17:00',
      endTime: '18:00',
      label: '05:00 - 06:00',
      isBreak: false,
      isAvailable: true
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      slotNumber: slot.slotNumber,
      startTime: slot.startTime,
      endTime: slot.endTime,
      label: slot.label || `${slot.startTime} - ${slot.endTime}`,
      isBreak: !!slot.isBreak,
      isAvailable: slot.isAvailable !== false
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingSlot) {
        await api.updateTimeSlot(editingSlot.id, formData);
      } else {
        await api.createTimeSlot(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this time slot?")) {
      await api.deleteTimeSlot(id);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Clock className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              University Working Hours & Time Slots
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure standard lecture periods, lunch intervals, and unavailable periods (Monday–Saturday).
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Time Slot</span>
        </button>
      </div>

      {/* Slots List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sortedSlots.map(slot => (
          <div
            key={slot.id || slot.slotNumber}
            className={`rounded-2xl border p-5 backdrop-blur-md transition-all space-y-3 ${
              slot.isBreak
                ? 'border-amber-800/40 bg-amber-950/20'
                : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  slot.isBreak
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}>
                  {slot.isBreak ? 'Recess / Lunch' : `Slot ${slot.slotNumber}`}
                </span>
                <h3 className="text-base font-extrabold text-white mt-2 font-['Outfit']">
                  {slot.startTime} – {slot.endTime}
                </h3>
                <p className="text-xs text-slate-400">{slot.label}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(slot)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(slot.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-[11px] flex items-center justify-between text-slate-400">
              <span>Status:</span>
              <span className={`font-semibold ${slot.isAvailable ? 'text-emerald-400' : 'text-slate-500'}`}>
                {slot.isAvailable ? 'Available for Classes' : 'Excluded from Timetable'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingSlot ? "Edit Time Slot" : "Add New Time Slot"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <p className="mt-3 text-rose-400">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Slot #</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.slotNumber}
                    onChange={(e) => setFormData({ ...formData, slotNumber: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Display Label</label>
                <input
                  type="text"
                  placeholder="e.g. 09:00 - 10:00 or Lunch Break"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isBreak}
                    onChange={(e) => setFormData({ ...formData, isBreak: e.target.checked })}
                    className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>Lunch / Recess Break</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="rounded border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span>Active for Scheduling</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
                >
                  {editingSlot ? "Save Slot" : "Create Slot"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
