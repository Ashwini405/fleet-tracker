import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

export default function ModuleEditModal({ isOpen, onClose, onSave, module }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (module) {
      // Deep clone the module so we don't accidentally mutate state before saving
      const clonedModule = JSON.parse(JSON.stringify(module));
      setFormData({
        ...clonedModule,
        customLabels: clonedModule.customLabels || {}
      });
    }
  }, [module]);

  if (!isOpen || !formData) return null;

  // Generic handler for flat fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for nested assignees
  const handleAssigneeChange = (role, value) => {
    setFormData(prev => ({
      ...prev,
      assigned: { ...prev.assigned, [role]: value }
    }));
  };

  const handleLabelChange = (labelKey, value) => {
    setFormData(prev => ({
      ...prev,
      customLabels: {
        ...(prev.customLabels || {}),
        [labelKey]: value
      }
    }));
  };

  // List Handlers (for Current, Today's, Next work)
  const handleArrayChange = (arrayName, index, value) => {
    const newArray = [...formData[arrayName]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const addArrayItem = (arrayName) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], ""] }));
  };

  const removeArrayItem = (arrayName, index) => {
    const newArray = [...formData[arrayName]];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [arrayName]: newArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty bullet points right before saving to keep state clean
    const cleanedData = {
      ...formData,
      currentWork: formData.currentWork.filter(t => t.trim() !== ''),
      todaysWork: formData.todaysWork.filter(t => t.trim() !== ''),
      nextWork: formData.nextWork.filter(t => t.trim() !== '')
    };
    onSave(cleanedData);
    onClose();
  };

  const renderListEditor = (titleKey, defaultTitle, arrayName, placeholder, badgeColor) => {
    const listTitle = formData.customLabels?.[titleKey] ?? defaultTitle;
    
    return (
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-grow max-w-[50%]">
            <span className={`w-2 h-2 rounded-full ${badgeColor} shrink-0`}></span>
            <input 
              type="text" 
              value={listTitle} 
              onChange={(e) => handleLabelChange(titleKey, e.target.value)}
              className="bg-transparent border-b border-dashed border-gray-300 text-sm font-bold text-gray-700 focus:border-blue-500 outline-none w-full pb-0.5"
              title="Edit heading name"
            />
          </div>
          <button 
            type="button" 
            onClick={() => addArrayItem(arrayName)}
            className="text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium px-2 py-1 rounded shadow-sm flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Add item
          </button>
        </div>
      
      {formData[arrayName].length === 0 ? (
        <div className="text-sm text-gray-400 italic">No items yet. Click add item.</div>
      ) : (
        <div className="space-y-2">
          {formData[arrayName].map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(arrayName, idx, e.target.value)}
                placeholder={placeholder}
                className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none transition-all shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeArrayItem(arrayName, idx)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#f8fafc]">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Module: <span className="text-blue-600">{formData.name}</span></h2>
            <p className="text-xs text-gray-500 mt-0.5">Update progress, set blockers, and manage daily bullet points.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY - SCROLLABLE */}
        <form id="module-form" onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto flex-grow bg-white">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Module Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none shadow-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subtext / Description</label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Overall Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none shadow-sm cursor-pointer">
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Progress */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Progress (%)</label>
              <input
                type="number"
                name="progress"
                min="0"
                max="100"
                value={formData.progress}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none shadow-sm"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline Label</label>
              <input
                type="text"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                placeholder="e.g. 3 days, or Oct 31"
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none shadow-sm"
              />
            </div>

          </div>

          {/* BLOCKER SECTION */}
          <div className="mt-6 bg-red-50/50 border border-red-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-red-700 mb-1">Critical Blocker (Leave empty if none)</label>
            <input
              type="text"
              name="blocker"
              value={formData.blocker}
              onChange={handleChange}
              placeholder="e.g. Waiting on API deployment..."
              className="w-full bg-white border border-red-300 text-red-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 outline-none placeholder-red-300 shadow-sm"
            />
          </div>

          {/* DYNAMIC LISTS */}
          <div className="mt-6">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-200 pb-2">Daily Management</h3>
            
            {renderListEditor("current", "Current Work", "currentWork", "What is actively being worked on?", "bg-blue-500")}
            {renderListEditor("today", "Today's Work", "todaysWork", "What got finished today?", "bg-green-500")}
            {renderListEditor("next", "Next Work", "nextWork", "What is up next?", "bg-purple-500")}
            
          </div>

          {/* ASSIGNEES */}
          <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Frontend Lead</label>
                <input
                  type="text"
                  value={formData.assigned.frontend}
                  onChange={(e) => handleAssigneeChange('frontend', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none shadow-sm"
                />
             </div>
             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Backend Lead</label>
                <input
                  type="text"
                  value={formData.assigned.backend}
                  onChange={(e) => handleAssigneeChange('backend', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 outline-none shadow-sm"
                />
             </div>
          </div>

        </form>

        {/* FOOTER */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors focus:ring-4 focus:ring-gray-200 shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="module-form"
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:ring-4 focus:outline-none focus:ring-blue-300 shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Module
            </button>
        </div>

      </div>
    </div>
  );
}
