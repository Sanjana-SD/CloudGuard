import React, { useState, useEffect } from 'react';
import { Server, Database, HardDrive, Cpu, Plus, Check, X, ShieldAlert, Edit2, Trash2 } from 'lucide-react';
import api from '../services/api';

const Infrastructure = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    resource_type: 'DATABASE',
    environment: 'Production',
    status: 'Running',
    is_encrypted: false,
    is_publicly_accessible: false,
    is_backup_enabled: true,
    ssh_public: false,
    permission_level: 'STANDARD',
    software_version: '1.0.0',
    min_supported_version: '2.0.0'
  });

  const loadResources = async () => {
    setLoading(true);
    try {
      const res = await api.get('/resources');
      setResources(res.data);
    } catch (err) {
      console.error("Error loading resources:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resources', formData);
      setShowModal(false);
      loadResources();
    } catch (err) {
      alert("Failed to add resource");
    }
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'DATABASE': return <Database className="h-5 w-5 text-amber-400" />;
      case 'STORAGE': return <HardDrive className="h-5 w-5 text-purple-400" />;
      case 'SERVER': return <Server className="h-5 w-5 text-blue-400" />;
      default: return <Cpu className="h-5 w-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-400" />
            <span>Simulated Infrastructure Inventory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage servers, databases, and API gateways monitored by SecOps rules.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-600/20 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Provision Resource</span>
        </button>
      </div>

      {/* Resources Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-4">Resource Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Environment</th>
              <th className="p-4 text-center">Encryption</th>
              <th className="p-4 text-center">Public Access</th>
              <th className="p-4 text-center">Backup</th>
              <th className="p-4 text-center">Public SSH</th>
              <th className="p-4">Version</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {resources.map((res) => (
              <tr key={res.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-bold text-slate-100 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                    {getResourceIcon(res.resource_type)}
                  </div>
                  <div>
                    <span className="block">{res.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: RES-{res.id}</span>
                  </div>
                </td>
                <td className="p-4 font-semibold text-cyan-400">{res.resource_type}</td>
                <td className="p-4">{res.environment}</td>
                
                {/* Encryption badge */}
                <td className="p-4 text-center">
                  {res.is_encrypted ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                      <Check className="h-3 w-3" /> Enabled
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800">
                      <X className="h-3 w-3" /> Disabled
                    </span>
                  )}
                </td>

                {/* Public Access badge */}
                <td className="p-4 text-center">
                  {res.is_publicly_accessible ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800">
                      <ShieldAlert className="h-3 w-3" /> YES (PUBLIC)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                      <Check className="h-3 w-3" /> Private
                    </span>
                  )}
                </td>

                {/* Backup badge */}
                <td className="p-4 text-center">
                  {res.is_backup_enabled ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                      <Check className="h-3 w-3" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
                      <X className="h-3 w-3" /> Missing
                    </span>
                  )}
                </td>

                {/* Public SSH */}
                <td className="p-4 text-center">
                  {res.ssh_public ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-800">
                      Exposed
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500">Secured</span>
                  )}
                </td>

                <td className="p-4 font-mono text-slate-300">
                  {res.software_version}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-700 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Provision Infrastructure Resource</h2>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Resource Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                  placeholder="e.g. analytics-db"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Type</label>
                  <select
                    value={formData.resource_type}
                    onChange={(e) => setFormData({ ...formData, resource_type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                  >
                    <option value="DATABASE">DATABASE</option>
                    <option value="SERVER">SERVER</option>
                    <option value="STORAGE">STORAGE</option>
                    <option value="API">API</option>
                    <option value="LOAD_BALANCER">LOAD_BALANCER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Environment</label>
                  <input
                    type="text"
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_encrypted}
                    onChange={(e) => setFormData({ ...formData, is_encrypted: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700"
                  />
                  <span>Enable Encryption</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_publicly_accessible}
                    onChange={(e) => setFormData({ ...formData, is_publicly_accessible: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700"
                  />
                  <span className="text-red-400">Publicly Accessible</span>
                </label>
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold"
                >
                  Save Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Infrastructure;
