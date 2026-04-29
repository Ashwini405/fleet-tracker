import { useState, useEffect } from 'react';
import { LayoutDashboard, DownloadCloud, MessageSquareText, Plus, Search, XCircle } from 'lucide-react';
import { preloadModules } from './data/preloadModules';

import SummaryCards from './components/SummaryCards';
import ModuleCard from './components/ModuleCard';
import DailyUpdate from './components/DailyUpdate';
import ModuleEditModal from './components/ModuleEditModal';
import DailyUpdateModal from './components/DailyUpdateModal';

const API = import.meta.env.PROD ? '' : '/api';

function App() {
  const [modules, setModules] = useState(preloadModules);
  const [dailyLogs, setDailyLogs] = useState([]);

  useEffect(() => {
    fetch(`${API}/logs`)
      .then(res => res.json())
      .then(data => setDailyLogs(Array.isArray(data) ? data : []))
      .catch(err => console.error('Failed to fetch logs:', err));
  }, []);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);

  const handleEditModule = (module) => {
    setEditingModule(module);
    setIsEditModalOpen(true);
  };

  const handleSaveModule = (updatedModule) => {
    setModules(prevModules => prevModules.map(m => m.id === updatedModule.id ? updatedModule : m));
    setEditingModule(updatedModule);
  };

  // Timeline Handlers
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false);
  const [editingDaily, setEditingDaily] = useState(null);

  const handleEditDaily = (log) => {
    setEditingDaily(log);
    setIsDailyModalOpen(true);
  };

  const handleCreateNewDay = () => {
    const newLog = {
      id: `update-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      updates: [
        { author: "Ashwini", doneToday: [], planTomorrow: [] },
        { author: "Sriman", doneToday: [], planTomorrow: [] }
      ],
      sharedBlockers: []
    };
    setEditingDaily(newLog);
    setIsDailyModalOpen(true);
  };

  const handleSaveDaily = (updatedDaily) => {
    fetch(`${API}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDaily),
    })
      .then(res => res.json())
      .then(saved => {
        setDailyLogs(prev => {
          const exists = prev.find(l => l.id === saved.id);
          return exists
            ? prev.map(l => l.id === saved.id ? saved : l)
            : [saved, ...prev];
        });
      })
      .catch(err => console.error('Failed to save log:', err));
  };

  const filteredLogs = dailyLogs.filter(log => {
    if (!filterDate) return true;
    return log.date === filterDate;
  });

  const handleExport = () => {
    let reportText = "FLEET PROJECT - TEAM DAILY UPDATES REPORT\n";
    reportText += `Generated on: ${new Date().toISOString().split('T')[0]}\n`;
    reportText += "=================================================\n\n";

    const logsToExport = [...dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

    logsToExport.forEach(log => {
      reportText += `DATE: ${log.date}\n`;
      reportText += `-------------------------------------------------\n\n`;

      if (log.sharedBlockers && log.sharedBlockers.length > 0) {
        reportText += `[CRITICAL BLOCKERS]\n`;
        log.sharedBlockers.forEach(b => {
          reportText += `! ${b.title}: ${b.description}\n`;
        });
        reportText += `\n`;
      }

      log.updates.forEach(update => {
        reportText += `> ${update.author.toUpperCase()}'S LOG:\n`;
        reportText += `  Done Today:\n`;
        if (update.doneToday.length === 0) reportText += `    (No tasks logged)\n`;
        update.doneToday.forEach(task => reportText += `    - ${task}\n`);

        reportText += `  Plan for Tomorrow:\n`;
        if (update.planTomorrow.length === 0) reportText += `    (No plans logged)\n`;
        update.planTomorrow.forEach(plan => reportText += `    - ${plan}\n`);
        reportText += `\n`;
      });

      reportText += `=================================================\n\n`;
    });

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fleet_team_logs_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white font-sans pb-24 text-slate-900 selection:bg-blue-200">
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-900/90 border-b border-indigo-900/50 supports-[backdrop-filter]:bg-slate-900/70">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 opacity-50"></div>
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/30 ring-1 ring-white/10">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight leading-none drop-shadow-sm">Fleet Management System</h1>
              <p className="text-[10px] text-blue-300/80 font-bold uppercase tracking-[0.2em] mt-1">Tracker</p>
            </div>
          </div>
          <button
            onClick={handleExport}
            className="group relative inline-flex items-center gap-2 px-5 py-2 overflow-hidden overflow-x-hidden rounded-xl bg-slate-800 border border-slate-700 font-medium text-white shadow-xl transition-all hover:bg-slate-700 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 transition-all group-hover:h-full group-hover:opacity-20 z-0"></span>
            <DownloadCloud className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-y-0.5" />
            <span className="text-sm relative z-10">Export Report</span>
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* TOP SUMMARY */}
        <SummaryCards modules={modules} />

        {/* MODULE CARDS GRID */}
        <div className="mb-6 flex items-end justify-between mt-8 border-b border-gray-200 pb-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Module Progress</h2>
            <p className="text-sm text-slate-500 mt-1">Real-time status of major fleet application sectors.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {modules.map(module => (
            <ModuleCard key={module.id} module={module} onEdit={handleEditModule} />
          ))}
        </div>

        {/* HISTORICAL TIMELINE SECTION */}
        <div className="mt-16 mb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquareText className="w-6 h-6 text-blue-600" />
              Day-to-day Historical Updates
            </h2>
            <p className="text-sm text-slate-500 mt-1">A timeline of all individual team logs starting from the most recent.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">

            {/* Filter Input */}
            <div className="relative flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
              <div className="pl-3 py-2 bg-gray-50 border-r border-gray-200 text-gray-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-3 pr-2 py-2 text-sm text-gray-700 outline-none w-36 cursor-pointer"
                title="Search by Date"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate('')}
                  className="pr-3 text-red-400 hover:text-red-600 transition-colors"
                  title="Clear Filter"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              )}
            </div>

            <button
              onClick={handleCreateNewDay}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 whitespace-nowrap rounded-xl text-sm font-semibold transition-all shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 flex items-center gap-2 border border-slate-700"
            >
              <Plus className="w-4 h-4" />
              Log New Day
            </button>
          </div>
        </div>

        <div className="space-y-6 relative border-l-2 border-gray-200 pl-6 ml-4">
          {filteredLogs.length === 0 ? (
            <p className="text-gray-500 italic py-8">
              {filterDate ? 'No updates found for this selected date.' : 'No historical logs found.'}
            </p>
          ) : (
            filteredLogs
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, showAllLogs ? filteredLogs.length : 5)
              .map((log, index) => (
                <div key={log.id} className="relative">
                  {/* Timeline connector dot */}
                  <div className="absolute w-4 h-4 bg-gray-200 rounded-full -left-[33px] top-6 border-4 border-[#f1f5f9]"></div>
                  <DailyUpdate
                    data={log}
                    onEdit={() => handleEditDaily(log)}
                    defaultExpanded={index === 0 || filterDate !== ''}
                  />
                </div>
              ))
          )}

          {!showAllLogs && filteredLogs.length > 5 && (
            <button
              onClick={() => setShowAllLogs(true)}
              className="mt-4 text-blue-600 hover:text-blue-800 font-bold text-sm bg-white border border-blue-200 rounded-lg px-4 py-2 hover:bg-blue-50 transition-colors shadow-sm"
            >
              View {filteredLogs.length - 5} older logs...
            </button>
          )}

          {showAllLogs && filteredLogs.length > 5 && (
            <button
              onClick={() => setShowAllLogs(false)}
              className="mt-4 text-gray-500 hover:text-gray-800 font-bold text-sm bg-white border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Collapse history
            </button>
          )}

        </div>

      </main>

      <ModuleEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveModule}
        module={editingModule}
      />

      <DailyUpdateModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        onSave={handleSaveDaily}
        data={editingDaily}
      />

    </div>
  );
}

export default App;
