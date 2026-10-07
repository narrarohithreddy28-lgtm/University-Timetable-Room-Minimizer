import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  DoorOpen,
  CheckCircle2,
  BarChart3,
  CalendarDays,
  FileDown,
  ArrowRight,
  TrendingDown,
  Award,
  Users,
  Building,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onGetStarted }) {
  const { quickSwitchRole } = useAuth();

  const handleRoleStart = (role) => {
    quickSwitchRole(role);
    onGetStarted('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-white font-['Outfit']">
                Timetable<span className="text-indigo-400">Minimizer</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-medium">
                Malla Reddy Technical Campus
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleRoleStart('admin')}
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Constraint Satisfaction & Graph Coloring Engine</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-['Outfit'] leading-tight">
              University Timetable <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400 bg-clip-text text-transparent">
                Room Minimizer
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
              “Generate conflict-free timetables while minimizing classroom and laboratory usage.”
            </p>

            {/* Room Minimization Highlight Box */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-md flex items-center justify-around text-center my-6">
              <div>
                <p className="text-xs text-slate-400 font-medium">Total Campus Rooms</p>
                <p className="text-2xl font-black text-white font-['Outfit']">20</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-xs text-indigo-300 font-medium">Required Rooms</p>
                <p className="text-2xl font-black text-indigo-400 font-['Outfit']">9</p>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div>
                <p className="text-xs text-emerald-300 font-medium">Rooms Saved</p>
                <p className="text-2xl font-black text-emerald-400 font-['Outfit']">11 (55%)</p>
              </div>
            </div>

            {/* Quick Demo Role Launch Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => handleRoleStart('admin')}
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 group"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Launch as Administrator</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => handleRoleStart('faculty')}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Faculty View</span>
              </button>

              <button
                onClick={() => handleRoleStart('student')}
                className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Student View</span>
              </button>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
              Engineered for Modern Universities
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Hard constraint validation with mathematically proven room minimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Sparkles,
                color: 'text-indigo-400',
                title: 'Automated Timetable Generation',
                desc: 'Generates conflict-free schedules in seconds using CSP and heuristic search across all sections, subjects, and faculties.'
              },
              {
                icon: DoorOpen,
                color: 'text-emerald-400',
                title: 'Minimum Room Allocation',
                desc: 'Intelligently packs simultaneous classes into the smallest set of rooms, saving up to 55% of campus infrastructure.'
              },
              {
                icon: ShieldCheck,
                color: 'text-amber-400',
                title: 'Instant Conflict Detection',
                desc: 'Continuous auditing for faculty clashes, room overlaps, section conflicts, room capacity limits, and lab requirements.'
              },
              {
                icon: Users,
                color: 'text-violet-400',
                title: 'Faculty Scheduling & Availability',
                desc: 'Respects individual faculty availability windows, work shifts, and prevents faculty overload across the week.'
              },
              {
                icon: BarChart3,
                color: 'text-cyan-400',
                title: 'Room Utilization Analytics',
                desc: 'Interactive visual charts displaying slot occupancy, idle room hours, and capacity utilization for every room.'
              },
              {
                icon: FileDown,
                color: 'text-rose-400',
                title: 'PDF, Excel & CSV Export',
                desc: 'Export official university timetables ready for printing with signatures, or multi-sheet Excel files for administration.'
              }
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md hover:border-slate-700 transition-all hover:translate-y-[-2px]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <h3 className="font-bold text-sm text-white">{f.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>Malla Reddy Technical Campus • University Timetable Room Minimizer © 2024</p>
      </footer>
    </div>
  );
}
