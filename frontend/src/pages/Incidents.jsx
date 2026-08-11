import React, { useState, useEffect } from 'react';
import { ShieldAlert, User, Clock, MessageSquare, Send, CheckCircle2, Bot, Sparkles } from 'lucide-react';
import api from '../services/api';

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [selectedInc, setSelectedInc] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiRemediation, setAiRemediation] = useState(null);

  const loadIncidents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/incidents');
      setIncidents(res.data);
      if (res.data.length > 0 && !selectedInc) {
        setSelectedInc(res.data[0]);
      } else if (selectedInc) {
        const updated = res.data.find(i => i.id === selectedInc.id);
        if (updated) setSelectedInc(updated);
      }
    } catch (err) {
      console.error("Error loading incidents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleStatusChange = async (incId, newStatus) => {
    try {
      await api.put(`/incidents/${incId}?status_str=${newStatus}`);
      loadIncidents();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedInc) return;
    try {
      await api.post(`/incidents/${selectedInc.id}/notes`, { note: newNote });
      setNewNote('');
      loadIncidents();
    } catch (err) {
      alert("Failed to add note");
    }
  };

  const handleAskAIRemediation = async () => {
    if (!selectedInc) return;
    setAiRemediation("Loading AI remediation plan...");
    try {
      const res = await api.post('/ai/remediation', {
        issue_description: selectedInc.title
      });
      setAiRemediation(res.data.remediation_plan);
    } catch (err) {
      setAiRemediation("Failed to fetch AI remediation.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-purple-400" />
            <span>Incident Command & Investigation Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Investigate account compromises, assign analysts, collaborate on analyst notes, and resolve SecOps incidents.</p>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incidents Sidebar List */}
        <div className="space-y-3">
          <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Active Incidents</h2>
          {incidents.map((inc) => (
            <div
              key={inc.id}
              onClick={() => setSelectedInc(inc)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedInc?.id === inc.id
                  ? 'bg-purple-950/30 border-purple-500/50 shadow-lg shadow-purple-950/40'
                  : 'glass-card border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono font-bold text-purple-400">{inc.incident_code}</span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                  inc.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {inc.severity}
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-100 line-clamp-1">{inc.title}</h3>
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                <span>Assignee: {inc.assigned_to_name || 'Unassigned'}</span>
                <span className="uppercase font-bold text-cyan-400">{inc.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Incident Detail Panel */}
        {selectedInc ? (
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-purple-400 font-bold">{selectedInc.incident_code}</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    {selectedInc.severity}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">{selectedInc.title}</h2>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400">Lifecycle Status:</span>
                <select
                  value={selectedInc.status}
                  onChange={(e) => handleStatusChange(selectedInc.id, e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-400 rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="MITIGATED">MITIGATED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>
            </div>

            {/* AI Remediation Action */}
            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Bot className="h-4 w-4 text-purple-400" />
                  <span>AI Security Remediation Advisor</span>
                </div>
                <button
                  onClick={handleAskAIRemediation}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold rounded-md transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Generate AI Fix Steps</span>
                </button>
              </div>
              {aiRemediation && (
                <div className="text-xs text-slate-300 font-sans whitespace-pre-wrap pt-2 border-t border-purple-500/20">
                  {aiRemediation}
                </div>
              )}
            </div>

            {/* Analyst Notes */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                <span>Analyst Investigation Notes</span>
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {selectedInc.notes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">No notes added yet. Collaborate below.</p>
                ) : (
                  selectedInc.notes.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-cyan-400">{n.author_name || 'Analyst'}</span>
                        <span className="text-slate-500">{new Date(n.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200">{n.note}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add analyst note or investigation finding..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Add Note</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 glass-panel p-12 rounded-2xl border border-slate-800 text-center text-slate-500 text-xs">
            Select an incident from the left panel to inspect details.
          </div>
        )}
      </div>
    </div>
  );
};

export default Incidents;
