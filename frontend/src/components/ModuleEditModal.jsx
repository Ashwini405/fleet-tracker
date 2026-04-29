import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';

const SECTION_STATUSES = ['Not Started', 'Pending', 'In Progress', 'Completed'];

export default function ModuleEditModal({ isOpen, onClose, onSave, module }) {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (module) {
      const cloned = JSON.parse(JSON.stringify(module));
      // Ensure workLabels exists with defaults
      if (!cloned.workLabels) {
        cloned.workLabels = { current: 'Current Work', today: 'Completed Today', next: 'Next Work' };
      }
      setFormData(cloned);
    }
  }, [module]);

  if (!isOpen || !formData) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssigneeChange = (role, value) => {
    setFormData(prev => ({ ...prev, assigned: { ...prev.assigned, [role]: value } }));
  };

  const handleLabelChange = (key, value) => {
    setFormData(prev => ({ ...prev, workLabels: { ...prev.workLabels, [key]: value } }));
  };

  // Array handlers (currentWork, todaysWork, nextWork)
  const handleArrayChange = (arrayName, index, value) => {
    const arr = [...formData[arrayName]];
    arr[index] = value;
    setFormData(prev => ({ ...prev, [arrayName]: arr }));
  };
  const addArrayItem = (arrayName) => {
    setFormData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], ''] }));
  };
  const removeArrayItem = (arrayName, index) => {
    const arr = [...formData[arrayName]];
    arr.splice(index, 1);
    setFormData(prev => ({ ...prev, [arrayName]: arr }));
  };

  // Sections handlers
  const handleSectionChange = (index, field, value) => {
    const sections = [...formData.sections];
    sections[index] = { ...sections[index], [field]: value };
    setFormData(prev => ({ ...prev, sections }));
  };
  const addSection = () => {
    setFormData(prev => ({ ...prev, sections: [...prev.sections, { name: '', status: 'Not Started' }] }));
  };
  const removeSection = (index) => {
    const sections = [...formData.sections];
    sections.splice(index, 1);
    setFormData(prev => ({ ...prev, sections }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      currentWork: formData.currentWork.filter(t => t.trim() !== ''),
      todaysWork: formData.todaysWork.filter(t => t.trim() !== ''),
      nextWork: formData.nextWork.filter(t => t.trim() !== ''),
      sections: formData.sections.filter(s => s.name.trim() !== ''),
    });
    onClose();
  };

  const renderListEditor = (labelKey, defaultLabel, arrayName, placeholder, dotColor) => (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <input
          type="text"
          value={formData.workLabels?.[labelKey] || defaultLabel}
          onChange={(e) => handleLabelChange(labelKey, e.target.value)}
          placeholder={defaultLabel}
          className={`text-xs font-bold uppercase tracking-wider bg-transparent border-b border-dashed border-gray-300 outline-none focus:border-blue-500 pb-0.5 ${dotColor}`}
          title="Click to rename heading"
        />
        <button type="button" onClick={() => addArrayItem(arrayName)}
          className="text-xs bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium px-2 py-1 rounded shadow-sm flex items-center gap-1">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>
      {formData[arrayName].length === 0
        ? <p className="text-sm text-gray-400 italic">No items yet.</p>
        : <div className="space-y-2">
            {formData[arrayName].map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <input type="text" value={item}
                  onChange={(e) => handleArrayChange(arrayName, idx, e.target.value)}
                  placeholder={placeholder}
                  className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm rounded p-2 outline-none focus:ring-1 focus:ring-blue-500 shadow-sm" />
                <button type="button" onClick={() => removeArrayItem(arrayName, idx)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
      }
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Module: <span className="text-blue-600">{formData.name}</span></h2>
            <p className="text-xs text-gray-500 mt-0.5">Update sections, work items, blockers and deadline.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <form id="module-form" onSubmit={handleSubmit} className="px-6 py-5 overflow-y-auto flex-grow space-y-6">

          {/* Name + Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Module Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none shadow-sm font-bold focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <input type="text" name="description" value={formData.description} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none shadow-sm focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>

          {/* Status + Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Overall Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none shadow-sm cursor-pointer focus:ring-1 focus:ring-blue-500">
                <option>Not Started</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 outline-none shadow-sm focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>

          {/* SECTIONS EDITOR */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900">Module Sections</h3>
              <button type="button" onClick={addSection}
                className="text-xs bg-slate-900 text-white hover:bg-slate-700 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm">
                <Plus className="w-3 h-3" /> Add Section
              </button>
            </div>
            <div className="space-y-2">
              {formData.sections.map((section, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-gray-50 border border-gray-200 rounded-lg p-2">
                  <input type="text" value={section.name}
                    onChange={(e) => handleSectionChange(idx, 'name', e.target.value)}
                    placeholder="Section name"
                    className="flex-1 bg-white border border-gray-300 text-gray-900 text-sm rounded p-2 outline-none focus:ring-1 focus:ring-blue-500" />
                  <select value={section.status}
                    onChange={(e) => handleSectionChange(idx, 'status', e.target.value)}
                    className="bg-white border border-gray-300 text-gray-800 text-xs rounded p-2 outline-none cursor-pointer focus:ring-1 focus:ring-blue-500">
                    {SECTION_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <button type="button" onClick={() => removeSection(idx)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {formData.sections.length === 0 && <p className="text-sm text-gray-400 italic">No sections yet.</p>}
            </div>
          </div>

          {/* BLOCKER */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <label className="block text-sm font-bold text-red-700 mb-1">Critical Blocker (leave empty if none)</label>
            <input type="text" name="blocker" value={formData.blocker} onChange={handleChange}
              placeholder="e.g. Waiting on API deployment..."
              className="w-full bg-white border border-red-300 text-red-900 text-sm rounded-lg p-2.5 outline-none placeholder-red-300 shadow-sm focus:ring-1 focus:ring-red-400" />
          </div>

          {/* WORK LISTS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">Work Items</h3>
            {renderListEditor('current', 'Current Work', 'currentWork', 'What is actively being worked on?', 'text-blue-600')}
            {renderListEditor('today', 'Completed Today', 'todaysWork', 'What got finished today?', 'text-green-600')}
            {renderListEditor('next', 'Next Work', 'nextWork', 'What is up next?', 'text-purple-600')}
          </div>

          {/* ASSIGNEES */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Frontend Lead</label>
              <input type="text" value={formData.assigned.frontend}
                onChange={(e) => handleAssigneeChange('frontend', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none shadow-sm focus:ring-1 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Backend Lead</label>
              <input type="text" value={formData.assigned.backend}
                onChange={(e) => handleAssigneeChange('backend', e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2 outline-none shadow-sm focus:ring-1 focus:ring-blue-500" />
            </div>
          </div>

        </form>

        {/* FOOTER */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button type="button" onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
            Cancel
          </button>
          <button type="submit" form="module-form"
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md flex items-center gap-2">
            <Save className="w-4 h-4" /> Save Module
          </button>
        </div>

      </div>
    </div>
  );
}
