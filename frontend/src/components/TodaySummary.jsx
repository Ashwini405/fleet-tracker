import { useState } from 'react';
import { Calendar, CheckCircle2, Activity, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function TodaySummary({ dailyLogs }) {
  const [isOpen, setIsOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find(log => log.date === today);

  const completed = todayLog?.updates.flatMap(u => u.doneToday).filter(Boolean) || [];
  const inProgress = todayLog?.updates.flatMap(u => u.planTomorrow).filter(Boolean) || [];
  const blockers = todayLog?.sharedBlockers || [];
  const hasData = completed.length > 0 || inProgress.length > 0 || blockers.length > 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm mb-8 overflow-hidden">

      {/* COLLAPSED BAR — always visible */}
      <button
        onClick={() => setIsOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-sm font-bold text-slate-800">Today's Progress</span>
          <span className="text-xs text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick count pills */}
          {hasData ? (
            <>
              {completed.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> {completed.length} done
                </span>
              )}
              {inProgress.length > 0 && (
                <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                  <Activity className="w-3 h-3" /> {inProgress.length} in progress
                </span>
              )}
              {blockers.length > 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> {blockers.length} blocked
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-slate-400 italic">No log for today yet — click Log New Day</span>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* EXPANDED DETAILS */}
      {isOpen && (
        <div className="border-t border-slate-100 px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Completed
            </h3>
            {completed.length > 0
              ? <ul className="space-y-1.5">
                  {completed.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              : <p className="text-sm text-slate-400 italic">Nothing yet.</p>
            }
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-500" /> In Progress
            </h3>
            {inProgress.length > 0
              ? <ul className="space-y-1.5">
                  {inProgress.map((item, i) => (
                    <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />{item}
                    </li>
                  ))}
                </ul>
              : <p className="text-sm text-slate-400 italic">Nothing yet.</p>
            }
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Blocked
            </h3>
            {blockers.length > 0
              ? <ul className="space-y-1.5">
                  {blockers.map((b, i) => (
                    <li key={i} className="text-sm">
                      <span className="font-bold text-red-700">{b.title}</span>
                      {b.description && <p className="text-xs text-red-500 mt-0.5">{b.description}</p>}
                    </li>
                  ))}
                </ul>
              : <p className="text-sm text-slate-400 italic">No blockers.</p>
            }
          </div>

        </div>
      )}
    </div>
  );
}
