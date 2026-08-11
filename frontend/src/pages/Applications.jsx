import React, { useState, useEffect } from 'react';
import { Layers, Plus, Server, AlertTriangle, CheckCircle2, Search, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    department: '',
    technology_stack: '',
    current_env: 'On-Premise',
    target_env: 'Cloud',
    migration_status: 'NOT_STARTED',
    migration_risk: 'LOW'
  });

  const loadApps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/applications');
      setApps(res.data);
    } catch (err) {
      console.error("Error loading apps:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/applications', formData);
      setShowModal(false);
      setFormData({
        name: '', description: '', owner: '', department: '', technology_stack: '',
        current_env: 'On-Premise', target_env: 'Cloud', migration_status: 'NOT_STARTED', migration_risk: 'LOW'
      });
      loadApps();
    } catch (err) {
      alert("Failed to register application.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <span>Enterprise Application Portfolio</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Register, monitor, and assess migration readiness across core organizational systems.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-cyan-600/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Register Application</span>
        </button>
      </div>

      {/* Grid of Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-extrabold text-base text-slate-100">{app.name}</h3>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${
                  app.migration_risk === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                  app.migration_risk === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                  app.migration_risk === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                  'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  Risk: {app.migration_risk}
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4">{app.description}</p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500 font-medium">Technology:</span>
                  <span className="text-slate-200 font-mono">{app.technology_stack || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500 font-medium">Owner / Dept:</span>
                  <span className="text-slate-200">{app.owner} ({app.department})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500 font-medium">Environment Flow:</span>
                  <span className="text-cyan-400 font-semibold">{app.current_env} → {app.target_env}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400">Migration Status:</span>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-md border border-cyan-800/40">
                {app.migration_status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for adding app */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-700 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Register New Enterprise Application</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Application Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  placeholder="e.g. Core Risk Calculator"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100 h-20"
                  placeholder="Describe system purpose..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Owner</label>
                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                    placeholder="SecOps Team"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                    placeholder="Cybersecurity"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Technology Stack</label>
                <input
                  type="text"
                  value={formData.technology_stack}
                  onChange={(e) => setFormData({ ...formData, technology_stack: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                  placeholder="React + Node.js"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
