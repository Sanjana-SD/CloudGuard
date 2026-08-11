import React, { useState, useEffect } from 'react';
import {
  Layers, Server, Activity, ShieldCheck, AlertTriangle, ShieldAlert,
  TrendingUp, RefreshCw, ArrowUpRight, CheckCircle2, ChevronRight, Zap
} from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, AreaChart, Area
} from 'recharts';
import api from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [findings, setFindings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, findRes, altRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/security/findings'),
        api.get('/alerts')
      ]);
      setSummary(sumRes.data);
      setFindings(findRes.data);
      setAlerts(altRes.data);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Mocked Chart Datasets based on live security telemetry
  const findingsSeverityData = [
    { name: 'Critical', value: summary?.critical_findings || 4, color: '#ef4444' },
    { name: 'High', value: 8, color: '#f97316' },
    { name: 'Medium', value: 15, color: '#eab308' },
    { name: 'Low', value: 5, color: '#3b82f6' },
  ];

  const migrationStatusData = [
    { status: 'Migrated', count: 4, fill: '#10b981' },
    { status: 'Testing', count: 1, fill: '#06b6d4' },
    { status: 'In Progress', count: 1, fill: '#3b82f6' },
    { status: 'Planned', count: 1, fill: '#f59e0b' },
    { status: 'Not Started', count: 1, fill: '#64748b' }
  ];

  const scoreTrendData = [
    { week: 'Week 1', score: 55 },
    { week: 'Week 2', score: 62 },
    { week: 'Week 3', score: 68 },
    { week: 'Week 4', score: 72 },
  ];

  const alertTimeSeriesData = [
    { time: '08:00', alerts: 1 },
    { time: '10:00', alerts: 4 },
    { time: '12:00', alerts: 7 },
    { time: '14:00', alerts: 5 },
    { time: '16:00', alerts: 8 },
  ];

  const resourceEnvData = [
    { env: 'Production', count: 28 },
    { env: 'Staging', count: 10 },
    { env: 'Development', count: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Zap className="h-3.5 w-3.5" />
            <span>SecOps & Cloud Migration Telemetry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">ABC Financial Services Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time enterprise migration risk tracking, rule-based security scanner, and automated threat monitoring.</p>
        </div>

        <button
          onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {/* Apps */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Applications</span>
            <Layers className="h-4 w-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{summary?.total_applications || 6}</p>
          <p className="text-[10px] text-emerald-400 font-medium mt-1">6 Active Apps</p>
        </div>

        {/* Resources */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Resources</span>
            <Server className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{summary?.total_resources || 6}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Simulated Assets</p>
        </div>

        {/* Migration Progress */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Migration</span>
            <Activity className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{summary?.migration_progress || 76}%</p>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${summary?.migration_progress || 76}%` }}></div>
          </div>
        </div>

        {/* Security Score */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Security Score</span>
            <ShieldCheck className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-extrabold text-amber-400">{summary?.security_score || 72}</p>
            <span className="text-xs text-slate-500 font-bold">/100</span>
          </div>
          <p className="text-[10px] text-amber-400 font-medium mt-1">Moderate Posture</p>
        </div>

        {/* Critical Findings */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Critical Issues</span>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
          <p className="text-2xl font-extrabold text-red-500">{summary?.critical_findings || 4}</p>
          <p className="text-[10px] text-red-400 font-medium mt-1">Immediate Action</p>
        </div>

        {/* Active Alerts */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Active Alerts</span>
            <ShieldAlert className="h-4 w-4 text-orange-400" />
          </div>
          <p className="text-2xl font-extrabold text-orange-400">{summary?.active_alerts || 5}</p>
          <p className="text-[10px] text-orange-400 font-medium mt-1">Threat Detections</p>
        </div>

        {/* Open Incidents */}
        <div className="glass-card p-4 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase">Open Incidents</span>
            <ShieldAlert className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-purple-400">{summary?.open_incidents || 3}</p>
          <p className="text-[10px] text-purple-400 font-medium mt-1">Under Investigation</p>
        </div>
      </div>

      {/* Charts Grid (Section 22 Requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Chart 1: Findings by Severity */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">1. Findings by Severity</h2>
            <span className="text-[10px] text-slate-400">Rule Engine Scanner</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={findingsSeverityData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                  {findingsSeverityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] pt-2 border-t border-slate-800">
            {findingsSeverityData.map((item) => (
              <div key={item.name}>
                <span className="block font-bold" style={{ color: item.color }}>{item.value}</span>
                <span className="text-slate-400">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Migration Progress */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">2. Applications Migration Status</h2>
            <span className="text-[10px] text-emerald-400">76% Overall</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={migrationStatusData}>
                <XAxis dataKey="status" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {migrationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Security Score Trend */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">3. Security Score Trend</h2>
            <span className="text-[10px] text-amber-400 font-semibold">+17 pts this month</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrendData}>
                <XAxis dataKey="week" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Alerts Over Time */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">4. Alerts Stream Over Time</h2>
            <span className="text-[10px] text-cyan-400">Live Detector</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={alertTimeSeriesData}>
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="alerts" stroke="#06b6d4" fill="rgba(6, 182, 212, 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Resources by Environment */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between md:col-span-2 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">5. Infrastructure Resources Distribution</h2>
            <span className="text-[10px] text-slate-400">Simulated Cloud Inventory</span>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceEnvData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} />
                <YAxis dataKey="env" type="category" stroke="#64748b" fontSize={10} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Activity & Alert Streams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Threat Alerts */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-400" />
              <span>Recent Threat Alerts</span>
            </h2>
            <span className="text-[10px] bg-orange-500/10 border border-orange-500/30 text-orange-400 px-2 py-0.5 rounded-full font-bold">
              {alerts.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 3).map((alt) => (
              <div key={alt.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      alt.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {alt.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{alt.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{alt.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Security Findings */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400" />
              <span>Security Scanner Findings</span>
            </h2>
            <span className="text-[10px] bg-red-500/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded-full font-bold">
              {findings.length} Discovered
            </span>
          </div>

          <div className="space-y-3">
            {findings.slice(0, 3).map((f) => (
              <div key={f.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      f.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {f.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-200">{f.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
