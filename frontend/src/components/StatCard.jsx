import React from 'react';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = 'emerald',
  gradient = 'from-indigo-500/20 to-violet-500/10',
  iconColor = 'text-indigo-400'
}) {
  const badgeClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  }[badgeColor] || 'bg-slate-500/10 text-slate-300 border-slate-500/20';

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-950/30 group">
      {/* Ambient gradient */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} blur-2xl group-hover:scale-125 transition-transform`} />

      <div className="relative flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-['Outfit']">
              {value}
            </span>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 font-medium pt-1">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          {Icon && (
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/60 ${iconColor} shadow-inner`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          {badge && (
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded-full border ${badgeClasses}`}>
              {badge}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
