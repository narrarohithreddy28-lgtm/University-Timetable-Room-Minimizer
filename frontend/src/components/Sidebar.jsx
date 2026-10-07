import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  BookOpen,
  Layers,
  DoorOpen,
  Clock,
  Sparkles,
  BarChart3,
  CalendarDays,
  AlertOctagon,
  FileSpreadsheet,
  Settings,
  Shield,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const { user } = useAuth();
  const role = user?.role || 'admin';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'faculty', 'student'] },
    { id: 'timetable', label: 'Timetable Matrix', icon: CalendarDays, roles: ['admin', 'faculty', 'student'], badge: 'Grid' },
    { id: 'room-utilization', label: 'Room Optimization', icon: BarChart3, roles: ['admin', 'faculty', 'student'], badge: 'Minimizer' },
    { id: 'generate', label: 'Generate Timetable', icon: Sparkles, roles: ['admin'], highlight: true },
    { divider: true, label: 'Management' },
    { id: 'departments', label: 'Departments', icon: Building2, roles: ['admin'] },
    { id: 'faculty', label: 'Faculty', icon: Users, roles: ['admin'] },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, roles: ['admin'] },
    { id: 'sections', label: 'Sections', icon: Layers, roles: ['admin'] },
    { id: 'rooms', label: 'Rooms & Labs', icon: DoorOpen, roles: ['admin'] },
    { id: 'timeslots', label: 'Time Slots', icon: Clock, roles: ['admin'] },
    { divider: true, label: 'Analytics & Audit' },
    { id: 'conflicts', label: 'Conflict Center', icon: AlertOctagon, roles: ['admin'] },
    { id: 'reports', label: 'Reports & Export', icon: FileSpreadsheet, roles: ['admin', 'faculty', 'student'] },
    { id: 'settings', label: 'System Settings', icon: Settings, roles: ['admin'] },
  ];

  const filteredItems = navItems.filter(item => item.divider || item.roles.includes(role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-slate-800 bg-slate-950/95 backdrop-blur-md transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto px-3 py-4">
          <nav className="space-y-1">
            {filteredItems.map((item, idx) => {
              if (item.divider) {
                return (
                  <div key={idx} className="pt-4 pb-1.5 px-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.label}
                    </p>
                  </div>
                );
              }

              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onClose) onClose();
                  }}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700 text-white shadow-md shadow-indigo-600/20'
                      : item.highlight
                      ? 'bg-indigo-950/40 text-indigo-300 border border-indigo-800/40 hover:bg-indigo-900/50 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'
                    }`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Card: Optimization Status */}
          <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/50 via-slate-900/40 to-slate-950 p-3.5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white">Minimizer Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
              Room Minimization algorithm running with 0 hard conflicts.
            </p>
            <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-300 pt-2 border-t border-slate-800/80">
              <span>Goal: Min Rooms</span>
              <span className="text-emerald-400">Optimal ✓</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
