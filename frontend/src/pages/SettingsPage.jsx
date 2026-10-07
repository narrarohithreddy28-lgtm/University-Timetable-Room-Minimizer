import React, { useState } from 'react';
import { Settings, RotateCcw, ShieldCheck, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function SettingsPage({ onResetDemo }) {
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleReset = async () => {
    if (window.confirm("Reset entire demo dataset to Malla Reddy Technical Campus default seed?")) {
      setResetting(true);
      setMessage(null);
      try {
        await api.resetDemo();
        setMessage("Demo dataset successfully reset and re-optimized!");
        onResetDemo();
      } catch (err) {
        setMessage("Reset failed: " + err.message);
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
        <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
          <Settings className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold text-white font-['Outfit']">System Settings & Data Management</h1>
          <p className="text-xs text-slate-400">Campus configuration, optimization thresholds, and demo environment reset.</p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-800/80 text-indigo-200 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* University Config Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" /> Institution Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Campus Name:</span>
            <p className="font-bold text-white text-sm">Malla Reddy Technical Campus</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400">Academic Year:</span>
            <p className="font-bold text-white text-sm">2024-2025 (Semester 4)</p>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="rounded-3xl border border-rose-900/40 bg-slate-900/70 p-6 backdrop-blur-md space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 text-rose-300">
          <RotateCcw className="w-4 h-4 text-rose-400" /> Factory Reset Demo State
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Restore the database back to standard sample data: 5 Departments (CSE, CSE-AI, ECE, EEE, Mechanical), 20 Faculty, 15 Subjects, 8 Sections, 20 Rooms (15 classrooms + 5 labs), and 0 hard conflicts.
        </p>

        <div className="pt-2">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-md shadow-rose-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin' : ''}`} />
            <span>{resetting ? "Resetting Database..." : "Reset All Demo Data"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
