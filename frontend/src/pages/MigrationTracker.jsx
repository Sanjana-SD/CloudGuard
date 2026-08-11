import React, { useState, useEffect } from 'react';
import { Activity, CheckCircle2, Clock, PlayCircle, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';

const MigrationTracker = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/migrations');
      setProjects(res.data);
    } catch (err) {
      console.error("Error loading migration projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleTaskStatusToggle = async (taskId, currentStatus) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    try {
      await api.put(`/migrations/tasks/${taskId}?status_str=${nextStatus}`);
      loadProjects();
    } catch (err) {
      alert("Failed to update task status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <span>Enterprise Cloud Migration Pipeline</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Track phase progress, task checklists, and target cutover milestones.</p>
        </div>
      </div>

      {/* Projects List */}
      {projects.map((proj) => (
        <div key={proj.id} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Active Migration Initiative</span>
              <h2 className="text-lg font-bold text-white mt-0.5">{proj.name}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-emerald-400">{proj.progress_percentage}%</p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Progress</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${proj.progress_percentage}%` }}
            ></div>
          </div>

          {/* Tasks checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Migration Pipeline Tasks Checklist</h3>
            <div className="space-y-2">
              {proj.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskStatusToggle(task.id, task.status)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    task.status === 'COMPLETED'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${task.status === 'COMPLETED' ? 'text-emerald-400 fill-emerald-400/20' : 'text-slate-600'}`} />
                    <div>
                      <p className={`text-xs font-bold ${task.status === 'COMPLETED' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </p>
                      {task.completed_at && (
                        <p className="text-[10px] text-emerald-400/80">Completed on {new Date(task.completed_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-md ${
                    task.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MigrationTracker;
