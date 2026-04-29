import { useState } from 'react';
import { ShieldAlert, Pencil, CalendarDays, UserSquare2, ChevronDown, ChevronUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function DailyUpdate({ data, onEdit, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!data) return null;

  // Render a column for a specific team member
  const renderTeamMemberUpdate = (update) => (
    <div key={update.author} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
        <UserSquare2 className="w-5 h-5 text-blue-500" />
        {update.author}'s Log
      </h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            What was done
          </h4>
          <ul className="space-y-2">
            {update.doneToday && update.doneToday.length > 0 ? update.doneToday.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                {item}
              </li>
            )) : <li className="text-sm text-gray-400 italic">No updates logged.</li>}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Plan for next
          </h4>
          <ul className="space-y-2">
            {update.planTomorrow && update.planTomorrow.length > 0 ? update.planTomorrow.map((plan, idx) => (
              <li key={idx} className="text-sm text-gray-700 leading-relaxed flex items-start gap-2">
                <span className="mt-1 text-purple-400 font-bold">•</span>
                <span>{plan}</span>
              </li>
            )) : <li className="text-sm text-gray-400 italic">No plans logged.</li>}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f8fafc] rounded-2xl border border-gray-200 overflow-hidden shadow-sm relative">

      <div className="absolute top-0 left-0 bottom-0 w-2 bg-blue-500"></div>

      <div
        className="pl-6 pr-6 py-4 flex justify-between items-center group relative bg-white cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-blue-600 transition-colors">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            {data.date ? format(parseISO(data.date), 'EEEE, MMMM do, yyyy') : 'No Date Set'}
          </div>

          {!isExpanded && data.sharedBlockers && data.sharedBlockers.length > 0 && (
            <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded">
              <ShieldAlert className="w-3 h-3" /> Blocker Logged
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2 border border-gray-200 bg-white text-gray-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600"
          title="Edit this log"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* COLLAPSIBLE BODY */}
      {isExpanded && (
        <div className="p-6 pl-8">
          {/* TEAM MEMBER GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {data.updates && data.updates.map(renderTeamMemberUpdate)}
          </div>

          {/* ACTIVE BLOCKERS SECTION (Global) */}
          {data.sharedBlockers && data.sharedBlockers.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Project Blockers Linked
              </h3>
              <div className="space-y-3">
                {data.sharedBlockers.map((blocker, idx) => (
                  <div key={idx} className="bg-red-50/50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                    <div className="mt-0.5"><ShieldAlert className="w-4 h-4 text-red-600" /></div>
                    <div>
                      <p className="text-sm font-bold text-red-800 mb-0.5">{blocker.title}</p>
                      <p className="text-sm text-red-600 leading-relaxed">{blocker.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
