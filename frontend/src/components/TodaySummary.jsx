import { Calendar, CheckCircle2, Activity, AlertTriangle } from 'lucide-react';

export default function TodaySummary({ dailyLogs }) {
  const today = new Date().toISOString().split('T')[0];
  const todayLog = dailyLogs.find(log => log.date === today);

  if (!todayLog) return null;

  // Aggregate all done items from all team members
  const completed = todayLog.updates.flatMap(u => u.doneToday).filter(Boolean);
  
  // Aggregate all plan items from all team members
  const inProgress = todayLog.updates.flatMap(u => u.planTomorrow).filter(Boolean);
  
  // Get blockers
  const blockers = todayLog.sharedBlockers || [];

  // If nothing logged today, don't show
  if (completed.length === 0 && inProgress.length === 0 && blockers.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8 shadow-sm">
      
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
        <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl">
          <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900 leading-tight">Today's Progress</h2>
          <p className="text-xs text-slate-400 mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Completed */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Completed
          </h3>
          {completed.length > 0 ? (
            <ul className="space-y-2">
              {completed.map((item, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2 bg-green-50 border border-green-100 rounded-lg p-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">Nothing completed yet.</p>
          )}
        </div>

        {/* In Progress */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-500" /> In Progress
          </h3>
          {inProgress.length > 0 ? (
            <ul className="space-y-2">
              {inProgress.map((item, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-lg p-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">Nothing in progress.</p>
          )}
        </div>

        {/* Blocked */}
        <div>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" /> Blocked
          </h3>
          {blockers.length > 0 ? (
            <ul className="space-y-2">
              {blockers.map((blocker, i) => (
                <li key={i} className="bg-red-50 border border-red-100 rounded-lg p-2.5">
                  <p className="text-sm font-bold text-red-800 mb-0.5">{blocker.title}</p>
                  <p className="text-xs text-red-600">{blocker.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">No blockers.</p>
          )}
        </div>

      </div>
    </div>
  );
}
