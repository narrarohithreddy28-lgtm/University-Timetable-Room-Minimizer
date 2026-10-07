import React, { useState } from 'react';
import {
  DoorOpen,
  FlaskConical,
  BarChart3,
  TrendingDown,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function RoomUtilizationPage({ roomDetails = [], stats = {} }) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'used' | 'saved' | 'classroom' | 'laboratory'
  const [searchQuery, setSearchQuery] = useState('');

  const totalRooms = stats.totalRooms || roomDetails.length || 20;
  const usedRooms = stats.requiredRooms || roomDetails.filter(r => r.isUsed).length || 9;
  const roomsSaved = stats.roomsSaved || (totalRooms - usedRooms) || 11;
  const reductionPercent = stats.roomReductionPercent || Math.round((roomsSaved / totalRooms) * 100) || 55;

  const filteredRooms = roomDetails.filter(r => {
    if (filterType === 'used' && !r.isUsed) return false;
    if (filterType === 'saved' && r.isUsed) return false;
    if (filterType === 'classroom' && r.roomType !== 'Classroom') return false;
    if (filterType === 'laboratory' && r.roomType !== 'Laboratory') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.roomNumber.toLowerCase().includes(q) || r.building.toLowerCase().includes(q);
    }
    return true;
  });

  const chartData = roomDetails.map(r => ({
    name: r.roomNumber.replace(' - Software Systems', '').replace('Room ', 'R'),
    utilization: r.utilizationPercent,
    isUsed: r.isUsed,
    type: r.roomType
  }));

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-extrabold text-white font-['Outfit']">
              Room Utilization & Minimization Audit
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time infrastructure occupancy and efficiency analytics across Malla Reddy Technical Campus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>{roomsSaved} Rooms Saved ({reductionPercent}% Reduction)</span>
          </div>
        </div>
      </div>

      {/* Comparison Bar Chart */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Comparative Room Utilization
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Percentage of weekly available time slots occupied by academic classes
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Active Classrooms
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active Labs
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" /> Saved Infrastructure
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                angle={-30}
                textAnchor="end"
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(val) => `${val}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '12px'
                }}
                formatter={(val) => [`${val}% Occupancy`, 'Utilization']}
              />
              <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={entry.type === 'Laboratory' ? '#10b981' : (entry.isUsed ? '#6366f1' : '#1e293b')}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Filter:
          </span>
          {[
            { id: 'all', label: `All Rooms (${roomDetails.length})` },
            { id: 'used', label: `Active (${usedRooms})` },
            { id: 'saved', label: `Saved (${roomsSaved})` },
            { id: 'classroom', label: 'Classrooms' },
            { id: 'laboratory', label: 'Laboratories' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filterType === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search room # or building..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map(room => {
          const isLab = room.roomType === 'Laboratory';
          return (
            <div
              key={room.id}
              className={`rounded-2xl border p-4.5 backdrop-blur-md transition-all ${
                room.isUsed
                  ? (isLab
                    ? 'border-emerald-800/60 bg-emerald-950/20 shadow-md shadow-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700')
                  : 'border-slate-800/60 bg-slate-950/40 opacity-75'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{room.roomNumber}</h3>
                  <p className="text-[11px] text-slate-400">{room.building} • {room.floor}</p>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  room.isUsed
                    ? (isLab
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30')
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {room.isUsed ? 'Active' : 'Saved'}
                </span>
              </div>

              {/* Capacity and Type tags */}
              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="flex items-center gap-1 text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800">
                  <Users className="w-3 h-3 text-slate-400" />
                  <span>Cap: <strong>{room.capacity}</strong></span>
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800">
                  {room.roomType}
                </span>
              </div>

              {/* Progress Bar for Utilization */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Occupancy</span>
                  <span className={`font-bold ${
                    room.utilizationPercent > 0 ? (isLab ? 'text-emerald-400' : 'text-indigo-400') : 'text-slate-500'
                  }`}>
                    {room.utilizationPercent}%
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLab ? 'bg-emerald-500' : (room.isUsed ? 'bg-indigo-500' : 'bg-slate-700')
                    }`}
                    style={{ width: `${Math.min(100, room.utilizationPercent)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Occupied: <strong>{room.occupiedSlots}</strong> slots</span>
                  <span>Free: <strong>{room.freeSlots}</strong> slots</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
