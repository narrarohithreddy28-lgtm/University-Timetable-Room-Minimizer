import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Search, X, FlaskConical, Layers, Clock, Award } from 'lucide-react';
import { api } from '../services/api';

export default function SubjectsPage({ subjects = [], departments = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'CSE',
    semester: 4,
    credits: 3,
    type: 'Theory',
    weeklyHours: 3,
    requiredRoomType: 'Classroom'
  });
  const [error, setError] = useState(null);

  const filtered = subjects.filter(s => {
    if (selectedDept !== 'All' && s.department !== selectedDept) return false;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q);
  });

  const handleOpenAdd = () => {
    setEditingSubject(null);
    setFormData({
      name: '',
      code: '',
      department: departments[0]?.code || 'CSE',
      semester: 4,
      credits: 3,
      type: 'Theory',
      weeklyHours: 3,
      requiredRoomType: 'Classroom'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setEditingSubject(sub);
    setFormData({
      name: sub.name,
      code: sub.code,
      department: sub.department || 'CSE',
      semester: sub.semester || 4,
      credits: sub.credits || 3,
      type: sub.type || 'Theory',
      weeklyHours: sub.weeklyHours || 3,
      requiredRoomType: sub.requiredRoomType || (sub.type === 'Laboratory' ? 'Laboratory' : 'Classroom')
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingSubject) {
        await api.updateSubject(editingSubject.id, formData);
      } else {
        await api.createSubject(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      await api.deleteSubject(id);
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
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Subject Curriculum
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure theory courses, laboratory blocks, weekly lecture hours, and room type specifications.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects by name or code..."
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
          {filtered.length} Subjects Configured
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(sub => {
          const isLab = sub.type === 'Laboratory';
          return (
            <div
              key={sub.id}
              className={`rounded-2xl border p-5 backdrop-blur-md transition-all space-y-3 ${
                isLab
                  ? 'border-emerald-800/50 bg-emerald-950/20 hover:border-emerald-500/70'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-extrabold text-white">{sub.code}</span>
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isLab
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {sub.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{sub.name}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(sub.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Department:</span>
                  <strong className="text-white">{sub.department}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Weekly Hours:</span>
                  <strong className="text-indigo-400">{sub.weeklyHours} hrs/week</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Required Room:</span>
                  <span className={`font-semibold ${isLab ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {sub.requiredRoomType}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingSubject ? "Edit Subject" : "Add New Subject"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <p className="mt-3 text-rose-400">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Subject Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS203"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.code}>{d.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const t = e.target.value;
                      setFormData({
                        ...formData,
                        type: t,
                        requiredRoomType: t === 'Laboratory' ? 'Laboratory' : 'Classroom'
                      });
                    }}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Theory">Theory</option>
                    <option value="Laboratory">Laboratory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Weekly Hours</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Required Room Type</label>
                <select
                  value={formData.requiredRoomType}
                  onChange={(e) => setFormData({ ...formData, requiredRoomType: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Classroom">Classroom</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Seminar Hall">Seminar Hall</option>
                </select>
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
                  {editingSubject ? "Save Subject" : "Create Subject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
