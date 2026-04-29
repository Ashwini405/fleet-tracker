import { AlertTriangle, Clock, Calendar, Users, CheckCircle2, ChevronRight, Activity, Pencil } from 'lucide-react';

export default function ModuleCard({ module, onEdit }) {
  const isBlocked = !!module.blocker;

  // Decide badge and bar colors based on status and block state
  let statusBadgeColor = 'bg-gray-100 text-gray-700 border-gray-200';
  let progressBarColor = 'bg-gray-300';

  if (isBlocked) {
    statusBadgeColor = 'bg-red-100 text-red-700 border-red-200 font-bold';
    progressBarColor = 'bg-red-500';
  } else if (module.status === 'Completed') {
    statusBadgeColor = 'bg-green-100 text-green-700 border-green-200';
    progressBarColor = 'bg-green-500';
  } else if (module.status === 'In Progress') {
    statusBadgeColor = 'bg-blue-100 text-blue-700 border-blue-200';
    progressBarColor = 'bg-blue-500';
  }

  // Display status override if blocked
  const displayStatus = isBlocked ? 'Blocked' : module.status;

  return (
    <div className={`flex flex-col bg-white rounded-2xl shadow-sm border ${isBlocked ? 'border-red-200' : 'border-gray-200'} overflow-hidden`}>

      {/* HEADER SECTION */}
      <div className={`p-5 border-b relative group ${isBlocked ? 'bg-red-50/50 border-red-100' : 'bg-gray-50/50 border-gray-100'}`}>

        <button
          onClick={() => onEdit(module)}
          className="absolute top-4 right-4 p-2 bg-white border border-gray-200 text-gray-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 focus:opacity-100 z-10"
          title="Edit Module"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <div className="flex justify-between items-start mb-3 pr-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{module.name}</h2>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{module.description}</p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs border ${statusBadgeColor}`}>
            {displayStatus}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Progress</span>
            <span className="text-xs font-bold text-gray-900">{module.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${progressBarColor} transition-all duration-500`}
              style={{ width: `${module.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* BODY SECTION */}
      <div className="p-5 flex-grow flex flex-col gap-6">

        {/* Blocker Alert */}
        {isBlocked && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Critical Blocker</h4>
              <p className="text-sm text-red-600 mt-0.5">{module.blocker}</p>
            </div>
          </div>
        )}

        {/* Work Categories */}
        <div className="space-y-4 flex-grow">

          {/* Current Work */}
          {module.currentWork.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" /> {module.customLabels?.current || "Current Work"}
              </h4>
              <ul className="space-y-1.5">
                {module.currentWork.map((work, idx) => (
                  <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                    <span>{work}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Today's Work */}
          {module.todaysWork.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {module.customLabels?.today || "Today's Work"}
              </h4>
              <ul className="space-y-1.5">
                {module.todaysWork.map((work, idx) => (
                  <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                    <span className="text-gray-700 font-medium">{work}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Work */}
          {module.nextWork.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-purple-500" /> {module.customLabels?.next || "Next Work"}
              </h4>
              <ul className="space-y-1.5">
                {module.nextWork.map((work, idx) => (
                  <li key={idx} className="text-sm text-gray-800 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                    <span className="text-gray-600">{work}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {module.currentWork.length === 0 && module.todaysWork.length === 0 && module.nextWork.length === 0 && (
            <div className="text-sm text-gray-400 italic py-2">No work structured yet.</div>
          )}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <div className="bg-gray-50/50 border-t border-gray-100 p-4 grid grid-cols-2 gap-4 mt-auto">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
          <div className="truncate">
            <span className="block text-[10px] font-bold text-gray-500 uppercase">Deadline</span>
            <span className="text-sm font-medium text-gray-800 truncate">{module.deadline}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400 shrink-0" />
          <div className="truncate">
            <span className="block text-[10px] font-bold text-gray-500 uppercase">Assigned</span>
            <span className="text-xs font-medium text-gray-700 truncate block">
              FE: {module.assigned.frontend}
            </span>
            <span className="text-xs font-medium text-gray-700 truncate block">
              BE: {module.assigned.backend}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
