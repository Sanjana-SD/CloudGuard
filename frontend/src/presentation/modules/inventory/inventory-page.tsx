import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/sidebar';
import { api, type ApplicationOut } from '../../services/api';

export const InventoryPage: React.FC = () => {
  const [apps, setApps] = useState<ApplicationOut[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Adding Application
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appName, setAppName] = useState('');
  const [appDesc, setAppDesc] = useState('');
  const [appOwner, setAppOwner] = useState('');
  const [appDept, setAppDept] = useState('');
  const [appStack, setAppStack] = useState('');
  const [appRisk, setAppRisk] = useState('LOW');
  const [appStatus, setAppStatus] = useState('NOT_STARTED');

  const loadData = async () => {
    setLoading(true);
    try {
      const appsRes = await api.applications.list();
      setApps(appsRes);
    } catch (err) {
      console.error('Failed to load inventory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.applications.create({
        name: appName,
        description: appDesc,
        owner: appOwner,
        department: appDept,
        technology_stack: appStack,
        migration_risk: appRisk,
        migration_status: appStatus
      });
      setIsModalOpen(false);
      setAppName('');
      setAppDesc('');
      setAppOwner('');
      setAppDept('');
      setAppStack('');
      setAppRisk('LOW');
      setAppStatus('NOT_STARTED');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to add application');
    }
  };

  // Stats
  const totalApps = apps.length;
  const migratedApps = apps.filter(a => a.migration_status === 'MIGRATED').length;
  const migratingApps = apps.filter(a => ['IN_PROGRESS', 'TESTING', 'PLANNED', 'ASSESSMENT'].includes(a.migration_status || '')).length;
  const highRiskApps = apps.filter(a => ['HIGH', 'CRITICAL'].includes(a.migration_risk || '')).length;

  return (
    <div className="bg-background text-on-background min-h-screen flex antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* TopAppBar Component */}
        <header className="bg-background border-b border-outline-variant flex justify-between items-center h-16 px-margin-page sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface tracking-tight">
              CloudGuard
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
                search
              </span>
              <input 
                className="bg-surface-container-low border border-outline-variant rounded py-1.5 pl-9 pr-3 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 placeholder:text-on-surface-variant" 
                placeholder="Search resources..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Notifications" className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button aria-label="History" className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full">
                <span className="material-symbols-outlined">history</span>
              </button>
              <button aria-label="Account" className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Inventory Canvas */}
        <div className="p-margin-page flex-1 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-stack-lg gap-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-bold text-on-surface mb-1">Application Inventory</h1>
              <p className="text-on-surface-variant text-body-md font-body-md text-sm">
                Manage and monitor enterprise applications for ABC Financial Services.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="border border-outline-variant text-on-surface font-body-md font-medium py-2 px-4 rounded hover:bg-neutral-900 transition-colors flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Filter
              </button>
              <button onClick={() => setIsModalOpen(true)} className="bg-primary text-on-primary font-body-md font-medium py-2 px-4 rounded hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Application
              </button>
            </div>
          </div>

          {/* Stats Overview Bento */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-stack-lg">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between hover:border-outline transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs mb-2">Total Apps</span>
              <div className="font-headline-lg text-2xl font-bold text-on-surface">
                {loading ? '...' : totalApps}
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between border-l-4 border-l-primary hover:border-outline transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs mb-2">Migrated</span>
              <div className="font-headline-lg text-2xl font-bold text-on-surface">
                {loading ? '...' : migratedApps}
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between border-l-4 border-l-tertiary-container hover:border-outline transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs mb-2">Migrating</span>
              <div className="font-headline-lg text-2xl font-bold text-on-surface">
                {loading ? '...' : migratingApps}
              </div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between border-l-4 border-l-error hover:border-outline transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs mb-2">High Risk</span>
              <div className="font-headline-lg text-2xl font-bold text-error">
                {loading ? '...' : highRiskApps}
              </div>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-sm">
            {/* Table Actions */}
            <div className="p-4 border-b border-outline-variant flex justify-between items-center bg-[#0c0c0c]">
              <div className="flex items-center gap-2">
                <span className="font-label-mono text-label-mono text-on-surface-variant text-xs uppercase">View:</span>
                <select className="bg-surface-container-low border-none rounded text-sm py-1 px-2 text-on-surface focus:ring-1 focus:ring-primary outline-none">
                  <option>All Applications</option>
                  <option>High Risk</option>
                  <option>Migrating</option>
                </select>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <button className="p-1 hover:text-primary transition-colors rounded">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
                <button className="p-1 hover:text-primary transition-colors rounded">
                  <span className="material-symbols-outlined text-sm">more_vert</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container-low text-on-surface-variant font-label-mono text-xs uppercase tracking-wider sticky top-0">
                    <th className="py-3 px-4 font-medium">Application Name</th>
                    <th className="py-3 px-4 font-medium">Type</th>
                    <th className="py-3 px-4 font-medium">Owner</th>
                    <th className="py-3 px-4 font-medium">Environment</th>
                    <th className="py-3 px-4 font-medium">Migration State</th>
                    <th className="py-3 px-4 font-medium">Risk Score</th>
                    <th className="py-3 px-4 font-medium">Exposure</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#38342c]/50">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-on-surface-variant font-label-mono text-xs">
                        Loading applications...
                      </td>
                    </tr>
                  ) : apps.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-on-surface-variant font-label-mono text-xs">
                        No applications in inventory.
                      </td>
                    </tr>
                  ) : (
                    apps.map((app) => {
                      const riskPercent = app.migration_risk === 'CRITICAL' ? 95 : app.migration_risk === 'HIGH' ? 75 : app.migration_risk === 'MEDIUM' ? 40 : 10;
                      const riskColorClass = app.migration_risk === 'CRITICAL' || app.migration_risk === 'HIGH' ? 'text-error' : app.migration_risk === 'MEDIUM' ? 'text-tertiary-container' : 'text-primary';
                      const riskBgClass = app.migration_risk === 'CRITICAL' || app.migration_risk === 'HIGH' ? 'bg-error' : app.migration_risk === 'MEDIUM' ? 'bg-tertiary-container' : 'bg-primary';

                      return (
                        <tr key={app.id} className="hover:bg-neutral-900/50 transition-colors group">
                          <td className="py-3 px-4 font-medium text-on-surface flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${riskBgClass}`}></div>
                            {app.name}
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant">{app.technology_stack || 'N/A'}</td>
                          <td className="py-3 px-4 text-on-surface-variant">{app.owner || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <span className="bg-surface-container-highest px-2 py-0.5 rounded text-[11px] font-label-mono border border-outline-variant/30 text-on-surface">
                              {app.current_env}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-semibold ${
                              app.migration_status === 'MIGRATED' ? 'bg-primary/10 text-primary border border-primary/20' :
                              app.migration_status === 'FAILED' ? 'bg-error/10 text-error border border-error/20' :
                              'bg-tertiary-container/10 text-tertiary border border-tertiary-container/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                app.migration_status === 'MIGRATED' ? 'bg-primary' :
                                app.migration_status === 'FAILED' ? 'bg-error' : 'bg-tertiary-container'
                              }`}></span>
                              {app.migration_status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`${riskColorClass} w-6 text-right`}>{riskPercent}</span>
                              <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                                <div className={`h-full ${riskBgClass}`} style={{ width: `${riskPercent}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-on-surface-variant">{app.department || 'N/A'}</td>
                          <td className="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-on-surface-variant hover:text-primary">
                              <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-outline-variant flex justify-between items-center text-sm text-on-surface-variant bg-[#0c0c0c]">
              <span>Showing {apps.length} of {apps.length} entries</span>
              <div className="flex gap-2">
                <button className="px-2 py-1 rounded border border-outline-variant hover:bg-neutral-800 transition-colors disabled:opacity-50" disabled>
                  Prev
                </button>
                <button className="px-2 py-1 rounded border border-outline-variant hover:bg-neutral-800 transition-colors disabled:opacity-50" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg rounded-xl p-6 shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">Add New Application</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddApplication} className="space-y-4">
              <div>
                <label className="block font-label-mono text-xs text-on-surface-variant mb-1 uppercase">Name</label>
                <input 
                  required
                  type="text" 
                  value={appName} 
                  onChange={e => setAppName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-on-surface text-sm focus:outline-none focus:border-primary"
                  placeholder="Payment API"
                />
              </div>
              <div>
                <label className="block font-label-mono text-xs text-on-surface-variant mb-1 uppercase">Description</label>
                <textarea 
                  value={appDesc} 
                  onChange={e => setAppDesc(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-on-surface text-sm focus:outline-none focus:border-primary h-20 resize-none"
                  placeholder="Processes transaction requests..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-mono text-xs text-on-surface-variant mb-1 uppercase">Owner</label>
                  <input 
                    type="text" 
                    value={appOwner} 
                    onChange={e => setAppOwner(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-on-surface text-sm focus:outline-none focus:border-primary"
                    placeholder="FinTech Core"
                  />
                </div>
                <div>
                  <label className="block font-label-mono text-xs text-on-surface-variant mb-1 uppercase">Department</label>
                  <input 
                    type="text" 
                    value={appDept} 
                    onChange={e => setAppDept(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-on-surface text-sm focus:outline-none focus:border-primary"
                    placeholder="Payments"
                  />
                </div>
              </div>
              <div>
                <label className="block font-label-mono text-xs text-on-surface-variant mb-1 uppercase">Tech Stack</label>
                <input 
                  type="text" 
                  value={appStack} 
                  onChange={e => setAppStack(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-on-surface text-sm focus:outline-none focus:border-primary"
                  placeholder="Java Spring Boot"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-mono text-xs text-on-surface-variant mb-1 uppercase">Migration Risk</label>
                  <select 
                    value={appRisk} 
                    onChange={e => setAppRisk(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-on-surface text-sm focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-mono text-xs text-on-surface-variant mb-1 uppercase">Migration Status</label>
                  <select 
                    value={appStatus} 
                    onChange={e => setAppStatus(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant rounded p-2 text-on-surface text-sm focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="NOT_STARTED">NOT_STARTED</option>
                    <option value="ASSESSMENT">ASSESSMENT</option>
                    <option value="PLANNED">PLANNED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="TESTING">TESTING</option>
                    <option value="MIGRATED">MIGRATED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="border border-outline-variant text-on-surface text-sm py-2 px-4 rounded hover:bg-neutral-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-on-primary text-sm py-2 px-4 rounded hover:bg-primary-hover transition-colors font-medium"
                >
                  Create Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
