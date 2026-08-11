import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/sidebar';
import { api, type IncidentOut, type AlertOut } from '../../services/api';

export const IncidentPage: React.FC = () => {
  const [incidents, setIncidents] = useState<IncidentOut[]>([]);
  const [alerts, setAlerts] = useState<AlertOut[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [incRes, alertRes] = await Promise.all([
        api.incidents.list(),
        api.alerts.list()
      ]);
      setIncidents(incRes);
      setAlerts(alertRes);
    } catch (err) {
      console.error('Failed to load security incident data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleIncidentStatusChange = async (incidentId: number, status: string) => {
    try {
      await api.incidents.updateStatus(incidentId, status);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update incident status');
    }
  };

  const openIncidentsCount = incidents.filter(i => ['NEW', 'INVESTIGATING'].includes(i.status.toUpperCase())).length;
  const criticalThreatsCount = incidents.filter(i => ['CRITICAL', 'HIGH'].includes(i.severity.toUpperCase())).length;

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
            <div className="relative hidden sm:block w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input 
                className="w-full bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-9 pr-4 font-body-md text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
                placeholder="Search incidents, IPs, assets..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-2 border-l border-outline-variant pl-stack-md">
              <button aria-label="Notifications" className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error"></span>
              </button>
              <button aria-label="History" className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">history</span>
              </button>
              <button aria-label="Account" className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors ml-unit">
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-margin-page max-w-[1600px] w-full mx-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-stack-sm mb-stack-lg">
            <div>
              <div className="flex items-center gap-stack-sm mb-unit">
                <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
                <span className="font-code-sm text-xs text-error uppercase tracking-wider font-bold">
                  Live Status: DEFCON 3
                </span>
              </div>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-2xl font-bold text-on-surface">
                Incident Response Center
              </h2>
            </div>
            <div className="flex items-center gap-stack-sm w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-unit px-stack-md py-1.5 border border-outline-variant rounded bg-surface hover:bg-neutral-900 text-on-surface font-body-md text-sm transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                Export Report
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-unit px-stack-md py-1.5 bg-error text-on-error rounded hover:bg-red-700 font-body-md text-sm font-medium transition-colors">
                <span className="material-symbols-outlined text-[18px]">campaign</span>
                Declare P1
              </button>
            </div>
          </div>

          {/* Dashboard Grid (Bento style) */}
          <div className="grid grid-cols-12 gap-stack-md mb-stack-lg">
            
            {/* Stat Card: Open Incidents */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-surface border border-outline-variant rounded-lg p-stack-md relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
              <div className="flex justify-between items-start mb-stack-sm relative z-10">
                <span className="font-code-sm text-xs text-on-surface-variant uppercase">Open Incidents</span>
                <span className="material-symbols-outlined text-primary text-[20px]">warning</span>
              </div>
              <div className="flex items-baseline gap-stack-sm relative z-10">
                <span className="font-headline-lg text-2xl font-bold text-on-surface">
                  {loading ? '...' : openIncidentsCount}
                </span>
                <span className="font-body-md text-sm text-error flex items-center">
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span> active
                </span>
              </div>
            </div>

            {/* Stat Card: Critical Threats */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-surface border border-outline-variant rounded-lg p-stack-md relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
              <div className="flex justify-between items-start mb-stack-sm relative z-10">
                <span className="font-code-sm text-xs text-error uppercase">Critical Threats</span>
                <span className="material-symbols-outlined text-error text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
              </div>
              <div className="flex items-baseline gap-stack-sm relative z-10">
                <span className="font-headline-lg text-2xl font-bold text-error">
                  {loading ? '...' : criticalThreatsCount}
                </span>
                <span className="font-body-md text-xs text-on-surface-variant ml-2">requires immediate action</span>
              </div>
            </div>

            {/* Stat Card: MTTR */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-surface border border-outline-variant rounded-lg p-stack-md relative overflow-hidden group">
              <div className="flex justify-between items-start mb-stack-sm relative z-10">
                <span className="font-code-sm text-xs text-on-surface-variant uppercase">MTTR (7 days)</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">timer</span>
              </div>
              <div className="flex items-baseline gap-stack-sm relative z-10">
                <span className="font-headline-lg text-2xl font-bold text-on-surface">4h 12m</span>
                <span className="font-body-md text-sm text-[#22c55e] flex items-center ml-2">
                  <span className="material-symbols-outlined text-[16px]">arrow_downward</span> 45m
                </span>
              </div>
            </div>

            {/* Stat Card: Affected Regions */}
            <div className="col-span-12 sm:col-span-6 lg:col-span-3 bg-surface border border-outline-variant rounded-lg p-stack-sm relative overflow-hidden flex flex-col min-h-[90px]">
              <span className="font-code-sm text-xs text-on-surface-variant uppercase px-unit pt-unit mb-unit">Active Regions</span>
              <div className="flex-1 rounded bg-neutral-900 border border-outline-variant/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background opacity-50"></div>
                <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-error shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(173,198,255,0.8)]"></div>
              </div>
            </div>

          </div>

          {/* Main Data Section: Filters & Table */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-stack-md">
            
            {/* Filters / Left Column */}
            <div className="xl:col-span-1 flex flex-col gap-stack-md">
              <div className="bg-surface border border-outline-variant rounded-lg p-stack-md">
                <h3 className="font-body-lg text-base text-on-surface mb-stack-sm border-b border-[#38342c] pb-unit">Refine View</h3>
                <div className="flex flex-col gap-stack-sm mt-stack-sm space-y-2">
                  <div>
                    <label className="font-code-sm text-xs text-on-surface-variant uppercase block mb-1">Severity</label>
                    <div className="flex flex-wrap gap-1">
                      <button className="px-2 py-0.5 rounded border border-error/50 bg-error/10 text-error font-code-sm text-xs hover:bg-error/20 transition-colors">Critical (3)</button>
                      <button className="px-2 py-0.5 rounded border border-[#f59e0b]/50 bg-[#f59e0b]/10 text-[#f59e0b] font-code-sm text-xs hover:bg-[#f59e0b]/20 transition-colors">High (12)</button>
                      <button className="px-2 py-0.5 rounded border border-neutral-600 bg-neutral-800 text-neutral-400 font-code-sm text-xs opacity-50">Medium</button>
                    </div>
                  </div>
                  <div className="mt-unit">
                    <label className="font-code-sm text-xs text-on-surface-variant uppercase block mb-1">Status</label>
                    <select className="w-full bg-neutral-900 border border-outline-variant rounded py-1.5 px-3 font-body-md text-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary appearance-none">
                      <option>All Open</option>
                      <option>Investigating</option>
                      <option>Pending Review</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick Alerts Feed */}
              <div className="bg-surface border border-outline-variant rounded-lg flex flex-col flex-1 min-h-[300px]">
                <div className="p-stack-md border-b border-outline-variant flex justify-between items-center bg-[#0c0c0c] rounded-t-lg">
                  <h3 className="font-body-lg text-sm text-on-surface flex items-center gap-unit">
                    <span className="material-symbols-outlined text-[18px] text-primary">radar</span> Intel Feed
                  </h3>
                  <button className="text-primary font-code-sm text-xs hover:underline">View All</button>
                </div>
                <div className="p-stack-sm flex flex-col gap-2 overflow-y-auto flex-1 p-2 max-h-[400px]">
                  {loading ? (
                    <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono">Loading alerts...</div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono opacity-50">No alerts</div>
                  ) : (
                    alerts.map((alert) => {
                      const colorClass = alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? 'bg-error' : 'bg-orange-500';
                      return (
                        <div key={alert.id} className="p-stack-sm rounded bg-neutral-900/40 border border-outline-variant hover:border-outline transition-colors group cursor-pointer relative overflow-hidden p-2 pl-4">
                          <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorClass}`}></div>
                          <p className="font-body-md text-sm text-on-surface font-medium group-hover:text-primary transition-colors">
                            {alert.title}
                          </p>
                          <div className="flex justify-between items-center mt-1 text-xs text-on-surface-variant">
                            <span>Code: {alert.alert_code || alert.alert_type}</span>
                            <span>{new Date(alert.created_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Data Table / Right Column */}
            <div className="xl:col-span-3 bg-surface border border-outline-variant rounded-lg flex flex-col overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="py-2.5 px-stack-md font-code-sm text-xs text-on-surface-variant uppercase w-24">Severity</th>
                      <th className="py-2.5 px-stack-md font-code-sm text-xs text-on-surface-variant uppercase w-32">Timestamp</th>
                      <th className="py-2.5 px-stack-md font-code-sm text-xs text-on-surface-variant uppercase">Incident Type</th>
                      <th className="py-2.5 px-stack-md font-code-sm text-xs text-on-surface-variant uppercase">Affected Asset</th>
                      <th className="py-2.5 px-stack-md font-code-sm text-xs text-on-surface-variant uppercase w-40">Status</th>
                      <th className="py-2.5 px-stack-md font-code-sm text-xs text-on-surface-variant uppercase w-16 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#38342c]/50 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-on-surface-variant font-label-mono text-xs">
                          Loading incidents...
                        </td>
                      </tr>
                    ) : incidents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-on-surface-variant font-label-mono text-xs">
                          No security incidents open.
                        </td>
                      </tr>
                    ) : (
                      incidents.map((inc) => {
                        const isCritical = inc.severity === 'CRITICAL';
                        const colorClass = isCritical ? 'text-error border-error bg-error/10' : 'text-orange-400 border-orange-500 bg-orange-500/10';
                        return (
                          <tr key={inc.id} className={`hover:bg-neutral-900/50 transition-colors group ${isCritical ? 'bg-error/5' : ''}`}>
                            <td className="py-3 px-stack-md">
                              <div className={`inline-flex items-center justify-center px-2 py-0.5 rounded border font-code-sm text-[10px] uppercase font-bold w-full ${colorClass}`}>
                                {inc.severity}
                              </div>
                            </td>
                            <td className="py-3 px-stack-md font-code-sm text-xs text-on-surface-variant">
                              {new Date(inc.created_at).toLocaleTimeString()} UTC
                            </td>
                            <td className="py-3 px-stack-md">
                              <p className="font-body-md text-on-surface font-medium">{inc.title}</p>
                              <p className="font-code-sm text-[11px] text-on-surface-variant mt-0.5">Code: {inc.incident_code}</p>
                            </td>
                            <td className="py-3 px-stack-md">
                              <p className="font-body-md text-on-surface">Asset ID: {inc.alert_id || 'Global'}</p>
                            </td>
                            <td className="py-3 px-stack-md">
                              <div className="relative">
                                <select 
                                  value={inc.status} 
                                  onChange={(e) => handleIncidentStatusChange(inc.id, e.target.value)}
                                  className="w-full bg-neutral-900 border border-outline-variant rounded py-1 px-2 font-code-sm text-xs text-on-surface-variant focus:border-primary outline-none cursor-pointer"
                                >
                                  <option value="NEW">NEW</option>
                                  <option value="INVESTIGATING">INVESTIGATING</option>
                                  <option value="RESOLVED">RESOLVED</option>
                                  <option value="CLOSED">CLOSED</option>
                                </select>
                              </div>
                            </td>
                            <td className="py-3 px-stack-md text-center">
                              <button className="w-8 h-8 rounded hover:bg-neutral-800 text-on-surface-variant hover:text-primary transition-colors inline-flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
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
              <div className="border-t border-outline-variant bg-[#0c0c0c] p-2 flex justify-between items-center">
                <span className="font-code-sm text-xs text-on-surface-variant px-unit">Showing {incidents.length} of {incidents.length} incidents</span>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded border border-outline-variant bg-neutral-900 text-on-surface-variant hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="w-8 h-8 rounded border border-outline-variant bg-neutral-900 text-on-surface hover:bg-neutral-800 transition-colors flex items-center justify-center disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentPage;
