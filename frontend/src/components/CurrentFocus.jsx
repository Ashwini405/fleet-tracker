import { Rocket, Monitor, Server } from 'lucide-react';

export default function CurrentFocus({ modules }) {
  const focus = modules.find(m => m.status === 'In Progress' && m.currentWork.length > 0)
    ?? modules.find(m => m.status === 'In Progress');

  if (!focus) return null;

  const totalSections = focus.sections?.length || 0;
  const completedSections = focus.sections?.filter(s => s.status === 'Completed').length || 0;
  const progress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8 shadow-sm">

      <div className="flex flex-col lg:flex-row lg:items-center gap-6">

        {/* Label */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl">
            <Rocket className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Current Focus</p>
            <h2 className="text-lg font-black text-slate-900 leading-tight">{focus.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{focus.description}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-14 bg-slate-100 shrink-0" />

        {/* Frontend & Backend */}
        <div className="flex flex-col sm:flex-row gap-4 flex-grow">

          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Monitor className="w-3 h-3" /> Frontend · {focus.assigned.frontend}
            </p>
            <ul className="space-y-1">
              {focus.currentWork.length > 0
                ? focus.currentWork.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      {item}
                    </li>
                  ))
                : <li className="text-sm text-slate-400 italic">Nothing logged yet.</li>
              }
            </ul>
          </div>

          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Server className="w-3 h-3" /> Backend · {focus.assigned.backend}
            </p>
            <ul className="space-y-1">
              {focus.nextWork.length > 0
                ? focus.nextWork.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                      {item}
                    </li>
                  ))
                : <li className="text-sm text-slate-400 italic">Nothing logged yet.</li>
              }
            </ul>
          </div>
        </div>

        {/* Progress pill */}
        <div className="shrink-0 flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl px-6 py-4">
          <span className="text-3xl font-black text-slate-800">{progress}%</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Done</span>
          <div className="w-16 h-1.5 bg-slate-200 rounded-full mt-2">
            <div className="h-1.5 bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

      </div>
    </div>
  );
}
