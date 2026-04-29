import { AlertTriangle, Clock, CheckCircle2, Loader, XCircle, Pencil, Calendar } from 'lucide-react';

function DeadlineBadge({ deadline, status }) {
  if (!deadline || status === 'Completed') return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);
  const diff = Math.round((due - today) / (1000 * 60 * 60 * 24));

  if (diff > 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
        <Clock className="w-3 h-3" /> {diff} day{diff !== 1 ? 's' : ''} left
      </span>
    );
  if (diff === 0)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 border border-orange-300 text-orange-700">
        <Clock className="w-3 h-3" /> Due today
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 border border-red-300 text-red-700">
      <Clock className="w-3 h-3" /> Overdue by {Math.abs(diff)} day{Math.abs(diff) !== 1 ? 's' : ''}
    </span>
  );
}

function SectionIcon({ status }) {
  if (status === 'Completed')
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (status === 'In Progress')
    return <Loader className="w-4 h-4 text-blue-500" />;
  if (status === 'Pending')
    return <Clock className="w-4 h-4 text-amber-500" />;
  return <XCircle className="w-4 h-4 text-gray-400" />;
}

export default function ModuleCard({ module, onEdit }) {
  const isBlocked = !!module.blocker;

  // Calculate progress from sections
  const totalSections = module.sections?.length || 0;
  const completedSections = module.sections?.filter(s => s.status === 'Completed').length || 0;
  const calculatedProgress = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;

  // Status badge color
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

  const displayStatus = isBlocked ? 'Blocked' : module.status;

  return (
    <div className={`flex flex-col bg-white rounded-2xl shadow-sm border ${isBlocked ? 'border-red-200' : 'border-gray-200'} overflow-hidden`}>

      {/* 1. HEADER */}
      <div className={`p-5 border-b relative group ${isBlocked ? 'bg-red-50/50 border-red-100' : 'bg-gray-50/50 border-gray-100'}`}>
        <button
          onClick={() => onEdit(module)}
          className="absolute top-4 right-4 p-2 bg-white border border-gray-200 text-gray-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 z-10"
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
            <span className="text-xs font-bold text-gray-900">{calculatedProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${progressBarColor} transition-all duration-500`}
              style={{ width: `${calculatedProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="p-5 flex-grow flex flex-col gap-5">

        {/* 7. BLOCKERS (IF ANY) */}
        {isBlocked && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-red-800">Critical Blocker</h4>
              <p className="text-sm text-red-600 mt-0.5">{module.blocker}</p>
            </div>
          </div>
        )}

        {/* 2. SECTIONS LIST */}
        {module.sections && module.sections.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Module Sections</h4>
            <div className="space-y-2">
              {module.sections.map((section, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <SectionIcon status={section.status} />
                  <span className={`${section.status === 'Completed' ? 'text-gray-500' : 'text-gray-800'}`}>
                    {section.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. CURRENT WORK */}
        {module.currentWork && module.currentWork.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">🔄 {module.workLabels?.current || 'Current Work'}</h4>
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

        {/* 4. TODAY'S PROGRESS */}
        {module.todaysWork && module.todaysWork.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">✔ {module.workLabels?.today || 'Completed Today'}</h4>
            <ul className="space-y-1.5">
              {module.todaysWork.map((work, idx) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                  <span className="font-medium">{work}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. NEXT WORK */}
        {module.nextWork && module.nextWork.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">⏭ {module.workLabels?.next || 'Next Work'}</h4>
            <ul className="space-y-1.5">
              {module.nextWork.map((work, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0"></span>
                  <span>{work}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* FOOTER - 6. DEADLINE */}
      <div className="bg-gray-50/50 border-t border-gray-100 p-4 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase">Deadline</span>
            {module.deadline && (
              <span className="text-xs text-gray-400">
                {new Date(module.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
          <DeadlineBadge deadline={module.deadline} status={module.status} />
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <span className="font-semibold">FE:</span> {module.assigned.frontend}
          <span className="mx-1">•</span>
          <span className="font-semibold">BE:</span> {module.assigned.backend}
        </div>
      </div>

    </div>
  );
}
