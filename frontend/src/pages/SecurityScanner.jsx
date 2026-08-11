import React, { useState, useEffect } from 'react';
import { ShieldCheck, Play, AlertTriangle, ShieldAlert, CheckCircle, Bot, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';

const SecurityScanner = () => {
  const [findings, setFindings] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [aiExplanation, setAiExplanation] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const loadData = async () => {
    try {
      const [fRes, sRes] = await Promise.all([
        api.get('/security/findings'),
        api.get('/security/score')
      ]);
      setFindings(fRes.data);
      setScoreData(sRes.data);
    } catch (err) {
      console.error("Error loading security data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunScan = async () => {
    setScanning(true);
    try {
      await api.post('/security/scan');
      await loadData();
    } catch (err) {
      alert("Security scan failed");
    } finally {
      setScanning(false);
    }
  };

  const handleStatusChange = async (findingId, newStatus) => {
    try {
      await api.put(`/security/findings/${findingId}?status_str=${newStatus}`);
      loadData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleAskAI = async (finding) => {
    setAiLoading(true);
    setAiExplanation(null);
    try {
      const res = await api.post('/ai/explain-finding', {
        finding_id: finding.id,
        finding_title: finding.title,
        resource_name: finding.resource_name,
        severity: finding.severity
      });
      setAiExplanation(res.data);
    } catch (err) {
      alert("AI explanation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const filteredFindings = filterSeverity === 'ALL'
    ? findings
    : findings.filter(f => f.severity === filterSeverity);

  return (
    <div className="space-y-6">
      {/* Header & Security Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-amber-400" />
                <span>Rule-Based Security Scanner</span>
              </h1>
              <button
                onClick={handleRunScan}
                disabled={scanning}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-xs rounded-lg shadow-lg shadow-amber-500/20 transition-all"
              >
                <Play className={`h-3.5 w-3.5 ${scanning ? 'animate-spin' : ''}`} />
                <span>{scanning ? 'Scanning Infrastructure...' : 'Run Security Scan'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-400">Automated static check evaluating public exposures, unencrypted DBs, excessive IAM privileges, missing backups, and outdated versions.</p>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 mt-4 border-t border-slate-800 text-center text-xs">
            <div>
              <span className="block text-lg font-extrabold text-red-500">{scoreData?.critical_count || 0}</span>
              <span className="text-slate-400 text-[10px]">CRITICAL</span>
            </div>
            <div>
              <span className="block text-lg font-extrabold text-orange-400">{scoreData?.high_count || 0}</span>
              <span className="text-slate-400 text-[10px]">HIGH</span>
            </div>
            <div>
              <span className="block text-lg font-extrabold text-amber-400">{scoreData?.medium_count || 0}</span>
              <span className="text-slate-400 text-[10px]">MEDIUM</span>
            </div>
            <div>
              <span className="block text-lg font-extrabold text-blue-400">{scoreData?.low_count || 0}</span>
              <span className="text-slate-400 text-[10px]">LOW</span>
            </div>
          </div>
        </div>

        {/* Security Score Widget */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <span className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">Organization Security Score</span>
          <div className="h-24 w-24 rounded-full border-4 border-amber-500/30 flex items-center justify-center bg-amber-950/20 my-2">
            <span className="text-3xl font-extrabold text-amber-400">{scoreData?.security_score ?? 72}</span>
          </div>
          <span className="text-[11px] text-amber-300 font-semibold">Post-Assessment Evaluation</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300">Filter Severity:</span>
        </div>
        <div className="flex gap-2">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                filterSeverity === sev
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map((f) => (
          <div key={f.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                  f.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  f.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {f.severity}
                </span>
                <span className="text-xs font-mono text-cyan-400">{f.finding_code || `SEC-${f.id}`}</span>
                <h3 className="text-sm font-bold text-slate-100">{f.title}</h3>
              </div>
              <p className="text-xs text-slate-400">{f.description}</p>
              <p className="text-[11px] text-slate-500">Resource: <span className="text-slate-300 font-semibold">{f.resource_name || 'Infrastructure Resource'}</span></p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleAskAI(f)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 border border-purple-700/50 text-xs font-semibold rounded-lg transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                <span>Explain with AI</span>
              </button>

              <select
                value={f.status}
                onChange={(e) => handleStatusChange(f.id, e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="OPEN">OPEN</option>
                <option value="INVESTIGATING">INVESTIGATING</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* AI Explanation Modal */}
      {(aiExplanation || aiLoading) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-2xl border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Bot className="h-5 w-5" />
                <span>CloudGuard AI Security Analyst</span>
              </div>
              <button
                onClick={() => setAiExplanation(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>

            {aiLoading ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                <Sparkles className="h-6 w-6 text-purple-400 animate-spin" />
                <p>Synthesizing threat analysis & remediation guidance...</p>
              </div>
            ) : (
              <div className="prose prose-invert max-w-none text-xs text-slate-300 space-y-3 whitespace-pre-wrap font-sans">
                {aiExplanation.explanation}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityScanner;
