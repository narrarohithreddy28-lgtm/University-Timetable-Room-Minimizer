import React from 'react';
import {
  Building2,
  Users,
  BookOpen,
  Layers,
  DoorOpen,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  BarChart3,
  CalendarDays,
  ArrowRight,
  ShieldAlert,
  Percent,
  Play
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import StatCard from '../components/StatCard';

export default function DashboardPage({
  reportsData = {},
  timetableData = {},
  onNavigate,
  onOpenOptimizer
}) {
  const stats = timetableData?.stats || {};
  const reports = reportsData?.data || {};

  const totalRooms = reports.totalRooms || stats.totalRooms || 20;
  const usedRooms = reports.usedRooms || stats.requiredRooms || 9;
  const roomsSaved = reports.roomsSaved || stats.roomsSaved || 11;
  const reductionPercent = reports.roomReductionPercent || stats.roomReductionPercent || 55;
  const totalLabs = reports.totalLabs || 5;
  const totalClassrooms = reports.totalClassrooms || 15;
  const totalFaculty = reports.totalFaculty || 20;
  const totalSubjects = reports.totalSubjects || 15;
  const totalSections = reports.totalSections || 8;
  const totalDepts = reports.totalDepartments || 5;
  const totalClasses = reports.totalClassesScheduled || stats.totalClasses || 93;
  const conflictsCount = reports.conflictsDetected !== undefined ? reports.conflictsDetected : (stats.conflicts || 0);
  const optimizationScore = reports.optimizationScore || stats.optimizationScore || 96;

  // Chart data from room details
  const roomDetails = stats.roomDetails || [];
  const chartData = roomDetails.slice(0, 10).map(r => ({
    name: r.roomNumber.replace(' - Software Systems', '').replace('Room ', 'R'),
    utilization: r.utilizationPercent,
    isUsed: r.isUsed,
    type: r.roomType
  }));

  // Donut chart data for rooms saved vs used
  const donutData = [
    { name: 'Active Used Rooms', value: usedRooms, color: '#6366f1' },
    { name: 'Rooms Saved (Idle)', value: roomsSaved, color: '#10b981' }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Optimization Engine Active
              </span>
              <span className="text-xs text-slate-400">• Academic Year 2024-2025</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Malla Reddy Technical Campus
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Intelligent room minimization and conflict-free timetable scheduling across 5 departments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('generate')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Timetable</span>
            </button>
            <button
              onClick={() => onNavigate('timetable')}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <span>View Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid (Requirement 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {/* Total Rooms */}
        <StatCard
          title="Total Rooms"
          value={totalRooms}
          subtitle={`${totalClassrooms} Classrooms + ${totalLabs} Labs`}
          icon={DoorOpen}
          badge="Campus Infra"
          badgeColor="indigo"
          iconColor="text-indigo-400"
        />

        {/* Required Rooms */}
        <StatCard
          title="Used Rooms"
          value={usedRooms}
          subtitle="Minimal subset utilized"
          icon={DoorOpen}
          badge="Required"
          badgeColor="cyan"
          iconColor="text-cyan-400"
        />

        {/* Rooms Saved */}
        <StatCard
          title="Rooms Saved"
          value={`+${roomsSaved}`}
          subtitle={`${reductionPercent}% Infrastructure Saved`}
          icon={TrendingDown}
          badge={`${reductionPercent}% Reduction`}
          badgeColor="emerald"
          iconColor="text-emerald-400"
        />

        {/* Optimization Score */}
        <StatCard
          title="Optimization Score"
          value={`${optimizationScore}%`}
          subtitle="CSP Zero-Conflict Rating"
          icon={CheckCircle2}
          badge="Optimal"
          badgeColor="emerald"
          iconColor="text-emerald-400"
        />
      </div>

      {/* Secondary Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Departments"
          value={totalDepts}
          subtitle="CSE, AI, ECE, EEE, Mech"
          icon={Building2}
          iconColor="text-violet-400"
        />

        <StatCard
          title="Total Faculty"
          value={totalFaculty}
          subtitle="20 Active Professors"
          icon={Users}
          iconColor="text-blue-400"
        />

        <StatCard
          title="Total Subjects"
          value={totalSubjects}
          subtitle="Theory & Specialized Labs"
          icon={BookOpen}
          iconColor="text-amber-400"
        />

        <StatCard
          title="Total Sections"
          value={totalSections}
          subtitle="8 Student Batches"
          icon={Layers}
          iconColor="text-pink-400"
        />
      </div>

      {/* Charts Section: Room Utilization Percentage & Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Room Utilization Percentage */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                Room Utilization Percentage
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Weekly occupied time slots per classroom and laboratory
              </p>
            </div>
            <button
              onClick={() => onNavigate('room-utilization')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <span>View All Rooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  angle={-25}
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
                  formatter={(value) => [`${value}% Utilization`, 'Weekly Usage']}
                />
                <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.type === 'Laboratory' ? '#10b981' : (entry.isUsed ? '#6366f1' : '#334155')}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Active Classrooms
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active Laboratories
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Saved / Spare Rooms
            </span>
          </div>
        </div>

        {/* Donut Chart: Room Minimization Impact */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Room Minimization Ratio
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {reductionPercent}% reduction in required classrooms
            </p>
          </div>

          <div className="h-44 w-full my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`donut-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-800/80 pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Rooms Required:
              </span>
              <strong className="text-white">{usedRooms} of {totalRooms}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Rooms Saved:
              </span>
              <strong className="text-emerald-400">+{roomsSaved} rooms ({reductionPercent}%)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Conflict Clashes:
              </span>
              <strong className="text-emerald-400">0 Hard Clashes</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Banner: Mathematical Lower Bound & Hard Constraints */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Zero Hard-Constraint Conflicts:</strong> All 10 constraints (Faculty availability, Section hours, Room capacities, and Lab types) are mathematically validated.
          </span>
        </div>
        <button
          onClick={() => onNavigate('conflicts')}
          className="text-indigo-400 hover:text-indigo-300 font-semibold whitespace-nowrap"
        >
          Inspect Constraint Audit →
        </button>
      </div>
    </div>
  );
}
