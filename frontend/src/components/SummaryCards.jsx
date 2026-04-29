import { LayoutGrid, PlayCircle, CheckCircle2, AlertOctagon } from 'lucide-react';

export default function SummaryCards({ modules }) {
  const stats = {
    total: modules.length,
    inProgress: modules.filter(m => m.status === 'In Progress').length,
    completed: modules.filter(m => m.status === 'Completed').length,
    blocked: modules.filter(m => !!m.blocker).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Modules */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl shadow-slate-900/20 p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-slate-900/30 group border border-slate-700">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="relative z-10">
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Modules</p>
          <p className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left">{stats.total}</p>
        </div>
        <div className="p-3.5 bg-white/10 rounded-xl relative z-10 backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
          <LayoutGrid className="w-8 h-8 text-white drop-shadow-md" />
        </div>
      </div>

      {/* In Progress */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/20 p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/40 group border border-blue-400/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <p className="text-sm font-black text-blue-100 uppercase tracking-[0.2em] mb-1">In Progress</p>
          <p className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left">{stats.inProgress}</p>
        </div>
        <div className="p-3.5 bg-white/20 rounded-xl relative z-10 backdrop-blur-sm border border-white/20 group-hover:bg-white/30 transition-colors shadow-inner">
          <PlayCircle className="w-8 h-8 text-white drop-shadow-md" />
        </div>
      </div>

      {/* Completed */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-xl shadow-emerald-500/20 p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/40 group border border-emerald-300/30">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="relative z-10">
          <p className="text-sm font-black text-emerald-50 uppercase tracking-[0.2em] mb-1">Completed</p>
          <p className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left">{stats.completed}</p>
        </div>
        <div className="p-3.5 bg-white/20 rounded-xl relative z-10 backdrop-blur-sm border border-white/20 group-hover:bg-white/30 transition-colors shadow-inner">
          <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
        </div>
      </div>

      {/* Blocked */}
      <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-500/20 group border border-gray-100">
        {stats.blocked > 0 && (
          <div className="absolute inset-0 border-2 border-red-500/50 rounded-2xl animate-pulse"></div>
        )}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl -mr-10 -mt-10 group-hover:bg-red-500/10 transition-colors duration-700"></div>
        <div className="relative z-10">
          <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Blocked</p>
          <p className="text-4xl font-black text-slate-800 group-hover:scale-105 transition-transform origin-left">{stats.blocked}</p>
        </div>
        <div className="p-3.5 bg-red-50 rounded-xl relative z-10 border border-red-100 group-hover:bg-red-100 transition-colors">
          <AlertOctagon className="w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
}
