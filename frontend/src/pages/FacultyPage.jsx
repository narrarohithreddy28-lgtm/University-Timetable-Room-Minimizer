import React, { useState } from 'react';
import { Users, Plus, Edit2, Trash2, Search, X, Mail, BookOpen, Clock, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function FacultyPage({ faculty = [], departments = [], subjects = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    facultyId: '',
    department: 'CSE',
    email: '',
    subjects: [],
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    availableSlots: [1, 2, 3, 4, 5, 6, 7]
  });
  const [error, setError] = useState(null);

  const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const allSlots = [1, 2, 3, 4, 5, 6, 7];

  const filtered = faculty.filter(f => {
    if (selectedDept !== 'All' && f.department !== selectedDept) return false;
    const q = search.toLowerCase();
    return f.name.toLowerCase().includes(q) || f.facultyId.toLowerCase().includes(q) || f.email.toLowerCase().includes(q);
  });

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFormData({
      name: '',
      facultyId: `FAC0${faculty.length + 1}`.slice(-6),
      department: departments[0]?.code || 'CSE',
      email: '',
      subjects: [],
      availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      availableSlots: [1, 2, 3, 4, 5, 6, 7]
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setEditingFaculty(fac);
    setFormData({
      name: fac.name,
      facultyId: fac.facultyId,
      department: fac.department,
      email: fac.email,
      subjects: fac.subjects || [],
      availableDays: fac.availableDays || allDays,
      availableSlots: fac.availableSlots || allSlots
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingFaculty) {
        await api.updateFaculty(editingFaculty.id, formData);
      } else {
        await api.createFaculty(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty member?")) {
      await api.deleteFaculty(id);
      onRefresh();
    }
  };

  const toggleDay = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? (prev.availableDays.length > 1 ? prev.availableDays.filter(d => d !== day) : prev.availableDays)
        : [...prev.availableDays, day]
    }));
  };

  const toggleSlot = (slot) => {
    setFormData(prev => ({
      ...prev,
      availableSlots: prev.availableSlots.includes(slot)
        ? (prev.availableSlots.length > 1 ? prev.availableSlots.filter(s => s !== slot) : prev.availableSlots)
        : [...prev.availableSlots, slot]
    }));
  };

  const toggleSubject = (subId) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subId)
        ? prev.subjects.filter(s => s !== subId)
        : [...prev.subjects, subId]
    }));
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Faculty Directory & Availability
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Manage professors, departmental specializations, and weekly available time constraints.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.code}>{d.code}</option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {filtered.length} Faculty Members
        </span>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(fac => (
          <div
            key={fac.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {fac.facultyId} • {fac.department}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{fac.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(fac)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(fac.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span className="truncate">{fac.email}</span>
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>Available: {fac.availableDays?.length || 6} Days/Week</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3 h-3 text-violet-400" />
                <span>Slots: {fac.availableSlots?.length || 7} Working Slots</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingFaculty ? "Edit Faculty Profile" : "Register New Faculty"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <p className="mt-3 text-rose-400">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Faculty Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Faculty ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FAC021"
                    value={formData.facultyId}
                    onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.code}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="e.g. rajesh@mrtc.edu.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Available Days */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Available Days</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {allDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`p-1.5 rounded-lg font-semibold border text-center transition-all ${
                        formData.availableDays.includes(day)
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Slots */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Available Slots</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {allSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => toggleSlot(slot)}
                      className={`p-1.5 rounded-lg font-semibold border text-center transition-all ${
                        formData.availableSlots.includes(slot)
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                          : 'bg-slate-950 text-slate-500 border-slate-800'
                      }`}
                    >
                      Slot {slot}
                    </button>
                  ))}
                </div>
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
                  {editingFaculty ? "Save Faculty" : "Create Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
