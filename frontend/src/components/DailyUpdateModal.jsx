import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, CalendarDays } from 'lucide-react';

export default function DailyUpdateModal({ isOpen, onClose, onSave, data }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (data) {
      setFormData(JSON.parse(JSON.stringify(data)));
    }
  }, [data]);

  if (!isOpen || !formData) return null;

  // Standard Field Handlers
  const handleDateChange = (e) => {
    setFormData(prev => ({ ...prev, date: e.target.value }));
  };

  // Team Updates Handlers
  const handleTeamArrayChange = (authorIndex, arrayName, itemIndex, value) => {
    const newUpdates = [...formData.updates];
    newUpdates[authorIndex][arrayName][itemIndex] = value;
    setFormData(prev => ({ ...prev, updates: newUpdates }));
  };

  const addTeamArrayItem = (authorIndex, arrayName) => {
    const newUpdates = [...formData.updates];
    newUpdates[authorIndex][arrayName].push("");
    setFormData(prev => ({ ...prev, updates: newUpdates }));
  };

  const removeTeamArrayItem = (authorIndex, arrayName, itemIndex) => {
    const newUpdates = [...formData.updates];
    newUpdates[authorIndex][arrayName].splice(itemIndex, 1);
    setFormData(prev => ({ ...prev, updates: newUpdates }));
  };

  // Blockers Handlers
  const handleBlockerChange = (index, field, value) => {
    const newBlockers = [...formData.sharedBlockers];
    newBlockers[index] = { ...newBlockers[index], [field]: value };
    setFormData(prev => ({ ...prev, sharedBlockers: newBlockers }));
  };

  const addBlocker = () => {
    setFormData(prev => ({ ...prev, sharedBlockers: [...prev.sharedBlockers, { title: "", description: "" }] }));
  };

  const removeBlocker = (index) => {
    const newBlockers = [...formData.sharedBlockers];
    newBlockers.splice(index, 1);
    setFormData(prev => ({ ...prev, sharedBlockers: newBlockers }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up empty strings before saving
    const cleanedUpdates = formData.updates.map(u => ({
      ...u,
      doneToday: u.doneToday.filter(t => t.trim() !== ''),
      planTomorrow: u.planTomorrow.filter(t => t.trim() !== '')
    }));
    
    const cleanedBlockers = formData.sharedBlockers.filter(
      b => b.title.trim() !== '' || b.description.trim() !== ''
    );

    onSave({ ...formData, updates: cleanedUpdates, sharedBlockers: cleanedBlockers });
    onClose();
  };

  const renderTeamSection = (update, authorIndex) => (
    <div key={update.author} className="bg-white border border-gray-200 shadow-sm p-5 rounded-xl">
      <h3 className="text-base font-bold text-blue-600 mb-4 border-b border-gray-100 pb-2">
        {update.author}'s Log
      </h3>
      
      {/* Done Today List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Done Today
          </label>
          <button type="button" onClick={() => addTeamArrayItem(authorIndex, 'doneToday')} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            + Add item
          </button>
        </div>
        <div className="space-y-2">
          {update.doneToday.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows="1"
                value={item}
                onChange={(e) => handleTeamArrayChange(authorIndex, 'doneToday', idx, e.target.value)}
                placeholder="What was completed?"
                className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded p-2 outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button type="button" onClick={() => removeTeamArrayItem(authorIndex, 'doneToday', idx)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {update.doneToday.length === 0 && <p className="text-xs text-gray-400 italic">No tasks. Click + Add item.</p>}
        </div>
      </div>

      {/* Plan Tomorrow */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span> Plan for Tomorrow
          </label>
          <button type="button" onClick={() => addTeamArrayItem(authorIndex, 'planTomorrow')} className="text-xs text-blue-600 hover:text-blue-800 font-medium">
            + Add plan
          </button>
        </div>
        <div className="space-y-2">
          {update.planTomorrow.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <textarea
                rows="1"
                value={item}
                onChange={(e) => handleTeamArrayChange(authorIndex, 'planTomorrow', idx, e.target.value)}
                placeholder="What is next?"
                className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded p-2 outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button type="button" onClick={() => removeTeamArrayItem(authorIndex, 'planTomorrow', idx)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {update.planTomorrow.length === 0 && <p className="text-xs text-gray-400 italic">No plans. Click + Add plan.</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-gray-50 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Day-to-Day Log</h2>
            <p className="text-xs text-gray-500 mt-0.5">Manage separated team updates and the active date.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form id="daily-team-form" onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto flex-grow space-y-6">
          
          {/* DATE SELECTOR */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
             <label className="font-bold text-gray-700 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-500" /> Date of Log
             </label>
             <input 
                type="date" 
                value={formData.date} 
                onChange={handleDateChange} 
                required
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 outline-none p-2"
             />
          </div>
          
          {/* TEAM UPDATES (Split View) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formData.updates.map((update, idx) => renderTeamSection(update, idx))}
          </div>
          
          {/* GLOBAL BLOCKERS */}
          <div className="bg-red-50 border border-red-200 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-bold text-red-800 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span> Shared Blockers
              </label>
              <button type="button" onClick={addBlocker} className="text-xs bg-white border border-red-200 text-red-700 hover:bg-red-50 font-medium px-2 py-1 rounded shadow-sm flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add blocker
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.sharedBlockers.map((blocker, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-white p-4 rounded-lg border border-red-100 shadow-sm">
                  <div className="flex-1 space-y-3">
                    <input
                      type="text"
                      value={blocker.title}
                      onChange={(e) => handleBlockerChange(idx, "title", e.target.value)}
                      placeholder="Blocker Title"
                      className="w-full bg-gray-50 border border-gray-300 text-red-900 text-sm rounded p-2.5 font-bold outline-none focus:border-red-400"
                    />
                    <textarea
                      rows="2"
                      value={blocker.description}
                      onChange={(e) => handleBlockerChange(idx, "description", e.target.value)}
                      placeholder="Why is it blocked?"
                      className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded p-2.5 outline-none focus:border-red-400"
                    />
                  </div>
                  <button type="button" onClick={() => removeBlocker(idx)} className="p-2 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors mt-1">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              {formData.sharedBlockers.length === 0 && <p className="text-sm text-red-500/80 italic">No shared blockers active.</p>}
            </div>
          </div>

        </form>

        {/* FOOTER */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
              Cancel
            </button>
            <button type="submit" form="daily-team-form" className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:ring-blue-300 shadow-md flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Team Updates
            </button>
        </div>

      </div>
    </div>
  );
}
