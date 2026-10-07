import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, Search, X, Users, Building } from 'lucide-react';
import { api } from '../services/api';

export default function SectionsPage({ sections = [], departments = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSec, setEditingSec] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    department: 'CSE',
    semester: 4,
    studentCount: 60,
    academicYear: '2024-2025'
  });
  const [error, setError] = useState(null);

  const filtered = sections.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingSec(null);
    setFormData({
      name: '',
      department: departments[0]?.code || 'CSE',
      semester: 4,
      studentCount: 60,
      academicYear: '2024-2025'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sec) => {
    setEditingSec(sec);
    setFormData({
      name: sec.name,
      department: sec.department,
      semester: sec.semester || 4,
      studentCount: sec.studentCount || 60,
      academicYear: sec.academicYear || '2024-2025'
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (editingSec) {
        await api.updateSection(editingSec.id, formData);
      } else {
        await api.createSection(formData);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      await api.deleteSection(id);
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
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Student Sections & Batches
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure section cohorts, enrollment strength, and academic branches.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Section</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {filtered.length} Active Sections
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map(sec => (
          <div
            key={sec.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md hover:border-slate-700 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {sec.department}
                </span>
                <h3 className="text-base font-extrabold text-white mt-1.5 font-['Outfit']">{sec.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(sec)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(sec.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Semester:</span>
                <strong className="text-white">{sec.semester}th Sem</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Student Strength:</span>
                <strong className="text-emerald-400">{sec.studentCount} Students</strong>
              </div>
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
                {editingSec ? "Edit Section Details" : "Add Student Section"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <p className="mt-3 text-rose-400">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Section Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CSE-A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
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
                      <option key={d.id} value={d.code}>{d.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Student Count (Capacity required)</label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={formData.studentCount}
                  onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
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
                  {editingSec ? "Save Section" : "Create Section"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
