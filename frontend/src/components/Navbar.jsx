import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  User,
  GraduationCap,
  Building,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Menu
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onToggleSidebar, conflictCount = 0, onResetDemo, onNavigate }) {
  const { user, quickSwitchRole } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile hamburger + University & App Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden"
            title="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white font-['Outfit']">
                  Timetable<span className="text-indigo-400">Minimizer</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 mr-1" /> CSP Optimized
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Malla Reddy Technical Campus</p>
            </div>
          </div>
        </div>

        {/* Center / Right: Quick Role Switcher + Conflict Indicator + User Badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Quick Role Switcher */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <span className="text-slate-500 px-2 font-medium">View As:</span>
            <button
              onClick={() => quickSwitchRole('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                user?.role === 'admin'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
            <button
              onClick={() => quickSwitchRole('faculty')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                user?.role === 'faculty'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Faculty
            </button>
            <button
              onClick={() => quickSwitchRole('student')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
                user?.role === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Student
            </button>
          </div>

          {/* Conflict Indicator */}
          <button
            onClick={() => onNavigate('conflicts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              conflictCount === 0
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900/40'
                : 'bg-rose-950/50 text-rose-400 border-rose-800/60 animate-pulse hover:bg-rose-900/50'
            }`}
            title="Inspect Conflicts"
          >
            {conflictCount === 0 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>0 Conflicts</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>{conflictCount} Conflicts</span>
              </>
            )}
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetDemo}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            title="Reset MRTC Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Demo</span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-slate-800 to-indigo-900/60 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-indigo-400 font-medium capitalize">{user?.role || 'Guest'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
