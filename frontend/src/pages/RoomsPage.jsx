import React, { useState } from 'react';
import { DoorOpen, Plus, Edit2, Trash2, Search, X, Users, Building, ShieldCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function RoomsPage({ rooms = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [formData, setFormData] = useState({
    roomNumber: '',
    building: 'Academic Block A',
    floor: '1st Floor',
    capacity: 70,
    roomType: 'Classroom',
    equipment: 'Projector, Whiteboard',
    isAvailable: true
  });
  const [error, setError] = useState(null);

  const filtered = rooms.filter(r => {
    if (filterType !== 'All' && r.roomType !== filterType) return false;
    const q = search.toLowerCase();
    return r.roomNumber.toLowerCase().includes(q) || r.building.toLowerCase().includes(q);
  });

  const handleOpenAdd = () => {
    setEditingRoom(null);
    setFormData({
      roomNumber: '',
      building: 'Academic Block A',
      floor: '1st Floor',
      capacity: 70,
      roomType: 'Classroom',
      equipment: 'Projector, Whiteboard',
      isAvailable: true
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rm) => {
    setEditingRoom(rm);
    setFormData({
      roomNumber: rm.roomNumber,
      building: rm.building,
      floor: rm.floor,
      capacity: rm.capacity,
      roomType: rm.roomType,
      equipment: Array.isArray(rm.equipment) ? rm.equipment.join(', ') : (rm.equipment || ''),
      isAvailable: rm.isAvailable !== false
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        equipment: typeof formData.equipment === 'string'
          ? formData.equipment.split(',').map(s => s.trim()).filter(Boolean)
          : formData.equipment
      };

      if (editingRoom) {
        await api.updateRoom(editingRoom.id, payload);
      } else {
        await api.createRoom(payload);
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      await api.deleteRoom(id);
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
              <DoorOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Classrooms & Laboratories
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Campus physical rooms, specialized computer/electronics labs, seating capacity, and smart equipment.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Room/Lab</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search room number or block..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Classroom">Classrooms (15)</option>
            <option value="Laboratory">Laboratories (5)</option>
            <option value="Seminar Hall">Seminar Halls</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {filtered.length} Infrastructure Rooms
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(rm => {
          const isLab = rm.roomType === 'Laboratory';
          return (
            <div
              key={rm.id}
              className={`rounded-2xl border p-5 backdrop-blur-md transition-all space-y-3 ${
                isLab
                  ? 'border-emerald-800/50 bg-emerald-950/20 hover:border-emerald-500/70'
                  : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isLab
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  }`}>
                    {rm.roomType}
                  </span>
                  <h3 className="text-base font-extrabold text-white mt-2 font-['Outfit'] line-clamp-1">
                    {rm.roomNumber}
                  </h3>
                  <p className="text-[11px] text-slate-400">{rm.building} • {rm.floor}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(rm)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rm.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-indigo-400" /> Seating Capacity:
                  </span>
                  <strong className="text-white">{rm.capacity} Seats</strong>
                </div>

                {rm.equipment && rm.equipment.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {(Array.isArray(rm.equipment) ? rm.equipment : [rm.equipment]).map((eq, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {eq}
                      </span>
                    ))}
                  </div>
                )}
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
                {editingRoom ? "Edit Room Details" : "Add New Room / Lab"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && <p className="mt-3 text-rose-400">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Room Number / Lab Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 201 or Lab 101"
                  value={formData.roomNumber}
                  onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                  className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Building Block</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Academic Block A"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Floor</label>
                  <input
                    type="text"
                    placeholder="e.g. 2nd Floor"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Room Type</label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Laboratory">Laboratory</option>
                    <option value="Seminar Hall">Seminar Hall</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Capacity</label>
                  <input
                    type="number"
                    min="15"
                    max="250"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Equipment (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Projector, Smart Board, Sound System"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
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
                  {editingRoom ? "Save Room" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
