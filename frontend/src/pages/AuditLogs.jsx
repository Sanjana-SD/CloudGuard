import React, { useState, useEffect } from 'react';
import { FileCheck2, User, Clock, ShieldCheck, Download, Search } from 'lucide-react';
import api from '../services/api';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const loadAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error("Error loading audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.resource_target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = "ID,User Email,Action,Resource Target,Timestamp,IP Address\n";
    const rows = logs.map(l => `"${l.id}","${l.user_email}","${l.action}","${l.resource_target}","${l.timestamp}","${l.ip_address}"`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudguard_audit_logs_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="h-5 w-5 text-cyan-400" />
            <span>Immutable System Audit Trail</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Audit log tracking administrative actions, security scans, rule updates, and incident modifications.</p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter audit logs by user email, action name, or resource target..."
          className="w-full bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-4">Timestamp</th>
              <th className="p-4">User</th>
              <th className="p-4">Action</th>
              <th className="p-4">Resource Target</th>
              <th className="p-4 text-right">Source IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 font-sans italic">
                  No audit trail records found.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-slate-400">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-bold text-cyan-400 font-sans">
                    {log.user_email}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-sans">
                    {log.resource_target}
                  </td>
                  <td className="p-4 text-right text-slate-500">
                    {log.ip_address}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
