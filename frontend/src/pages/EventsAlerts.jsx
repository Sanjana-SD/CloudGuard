import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldAlert, Globe, Activity, Plus, ArrowRight, Zap } from 'lucide-react';
import api from '../services/api';

const EventsAlerts = () => {
  const [events, setEvents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulation state for creating events
  const [showSimModal, setShowSimModal] = useState(false);
  const [simData, setSimData] = useState({
    event_type: 'LOGIN_SUCCESS',
    user_email: 'admin@abc.com',
    location: 'Bangalore, India',
    ip_address: '106.51.24.12',
    data_size_mb: 0,
    details: 'User logged in successfully'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [eRes, aRes] = await Promise.all([
        api.get('/events'),
        api.get('/alerts')
      ]);
      setEvents(eRes.data);
      setAlerts(aRes.data);
    } catch (err) {
      console.error("Error loading events & alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', simData);
      setShowSimModal(false);
      loadData();
    } catch (err) {
      alert("Failed to simulate event");
    }
  };

  const handleCreateIncidentFromAlert = async (alertObj) => {
    try {
      await api.post('/incidents', {
        alert_id: alertObj.id,
        title: `Investigation: ${alertObj.title}`,
        severity: alertObj.severity
      });
      alert(`Incident created successfully for alert '${alertObj.title}'`);
      loadData();
    } catch (err) {
      alert("Failed to create incident");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <span>Threat Detections & Automated Alerts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Real-time detection engine monitoring Impossible Travel, Data Exfiltration, and Brute Force attempts.</p>
        </div>
        <button
          onClick={() => setShowSimModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-orange-600/20 transition-all"
        >
          <Zap className="h-4 w-4" />
          <span>Simulate Threat Event</span>
        </button>
      </div>

      {/* Grid: Active Alerts vs Security Event Telemetry Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generated Alerts */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-orange-400" />
            <span>Generated Security Alerts</span>
          </h2>

          <div className="space-y-3">
            {alerts.map((alt) => (
              <div key={alt.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                      alt.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    }`}>
                      {alt.severity}
                    </span>
                    <span className="text-xs font-mono text-cyan-400">{alt.alert_code || `ALT-${alt.id}`}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {alt.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100">{alt.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{alt.description}</p>
                </div>

                {alt.recommended_action && (
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-300">
                    <span className="font-bold">Recommended Action: </span> {alt.recommended_action}
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleCreateIncidentFromAlert(alt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    <span>Escalate to Incident</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Events Telemetry Log */}
        <div className="space-y-4">
          <h2 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Real-time Security Event Logs</span>
          </h2>

          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
            <div className="divide-y divide-slate-800/60 max-h-[600px] overflow-y-auto">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 hover:bg-slate-800/30 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-400 font-mono">{evt.event_type}</span>
                    <span className="text-[10px] text-slate-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>User: <strong className="text-slate-100">{evt.user_email || 'System'}</strong></span>
                    <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                      <Globe className="h-3 w-3 text-cyan-400" /> {evt.location || 'Unknown'} ({evt.ip_address || '127.0.0.1'})
                    </span>
                  </div>
                  {evt.data_size_mb > 0 && (
                    <p className="text-[10px] text-amber-400 font-semibold">Data Payload: {evt.data_size_mb} MB</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Threat Event Simulator Modal */}
      {showSimModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">Simulate Threat Telemetry Event</h2>
            <form onSubmit={handleSimulateEvent} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Event Type</label>
                <select
                  value={simData.event_type}
                  onChange={(e) => setSimData({ ...simData, event_type: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                >
                  <option value="LOGIN_SUCCESS">LOGIN_SUCCESS</option>
                  <option value="LOGIN_FAILURE">LOGIN_FAILURE</option>
                  <option value="NEW_LOCATION_LOGIN">NEW_LOCATION_LOGIN (Impossible Travel Trigger)</option>
                  <option value="LARGE_DATA_TRANSFER">LARGE_DATA_TRANSFER (Exfiltration Trigger)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">User Email</label>
                <input
                  type="email"
                  value={simData.user_email}
                  onChange={(e) => setSimData({ ...simData, user_email: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Location</label>
                  <input
                    type="text"
                    value={simData.location}
                    onChange={(e) => setSimData({ ...simData, location: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                    placeholder="Delhi, India"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Data Transfer (MB)</label>
                  <input
                    type="number"
                    value={simData.data_size_mb}
                    onChange={(e) => setSimData({ ...simData, data_size_mb: parseFloat(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-100"
                    placeholder="6000"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSimModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-semibold"
                >
                  Trigger Telemetry Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsAlerts;
