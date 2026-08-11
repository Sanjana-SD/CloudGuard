import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/layout/sidebar';
import { api, type ProjectOut, type TaskOut } from '../../services/api';

export const TrackerPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectOut[]>([]);
  const [selectedProjId, setSelectedProjId] = useState<number | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectOut | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    try {
      const projs = await api.migrations.list();
      setProjects(projs);
      if (projs.length > 0 && selectedProjId === null) {
        setSelectedProjId(projs[0].id);
      }
    } catch (err) {
      console.error('Failed to load migration projects', err);
    }
  };

  const loadActiveProject = async (id: number) => {
    setLoading(true);
    try {
      const proj = await api.migrations.getProject(id);
      setActiveProject(proj);
    } catch (err) {
      console.error('Failed to load active migration project details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjId !== null) {
      loadActiveProject(selectedProjId);
    }
  }, [selectedProjId]);

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    try {
      await api.migrations.updateTaskStatus(taskId, newStatus);
      if (selectedProjId !== null) {
        loadActiveProject(selectedProjId);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update task status');
    }
  };

  const renderTaskCard = (task: TaskOut) => {
    return (
      <div 
        key={task.id} 
        className="bg-surface border border-outline-variant rounded p-3 hover:border-outline hover:shadow-[0_0_15px_rgba(64,138,113,0.15)] transition-all cursor-grab group flex flex-col gap-2"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="font-label-mono text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant">TASK-{task.id}</span>
          <select 
            value={task.status} 
            onChange={(e) => handleStatusChange(task.id, e.target.value)}
            className="bg-neutral-900 border border-outline-variant rounded py-0.5 px-1 font-mono text-[10px] text-on-surface-variant focus:border-primary outline-none cursor-pointer"
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">MIGRATED</option>
            <option value="VERIFIED">VERIFIED</option>
          </select>
        </div>
        <h4 className="font-body-md text-on-surface font-medium text-sm mb-1">{task.title}</h4>
        {task.description && (
          <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">{task.description}</p>
        )}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-outline-variant/30">
          <div className="w-5 h-5 rounded bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold">CG</div>
          <span className="font-label-mono text-[10px] text-on-surface-variant font-mono">Assigned to SecOps</span>
        </div>
      </div>
    );
  };

  const tasks = activeProject?.tasks || [];
  const pendingTasks = tasks.filter(t => t.status === 'PENDING');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'MIGRATED');
  const verifiedTasks = tasks.filter(t => t.status === 'VERIFIED');

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

        {/* Tracker Canvas */}
        <div className="p-margin-page flex-1 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {/* Wave Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-lg mb-stack-lg">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary/10 border border-primary text-primary font-label-mono text-[10px] uppercase px-2 py-0.5 rounded">
                  Active Project
                </span>
                <span className="text-on-surface-variant font-label-mono text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  On Track
                </span>
              </div>
              <h2 className="font-headline-lg text-2xl font-bold text-on-surface">
                {loading ? 'Loading project...' : activeProject?.name}
              </h2>
              <p className="text-on-surface-variant mt-1 text-sm max-w-2xl">
                Migrate infrastructure assets, validate databases, and coordinate cutover.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="appearance-none bg-surface border border-outline-variant text-on-surface font-body-md rounded py-2 pl-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-sm"
                  value={selectedProjId ?? ''}
                  onChange={(e) => setSelectedProjId(Number(e.target.value))}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">
                  expand_more
                </span>
              </div>
              <button className="bg-surface border border-outline-variant hover:border-outline text-on-surface font-body-md rounded py-2 px-4 transition-colors flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Filter
              </button>
            </div>
          </div>

          {/* Global Progress */}
          <div className="bg-surface-container-low border border-outline-variant rounded-lg p-stack-lg mb-stack-lg flex flex-col md:flex-row gap-stack-lg items-center relative overflow-hidden group">
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            <div className="w-full md:w-1/3 shrink-0">
              <div className="flex justify-between items-end mb-2">
                <span className="font-body-md text-on-surface-variant text-sm">Overall Progress</span>
                <span className="font-headline-md text-xl font-bold text-primary">
                  {loading ? '...' : `${activeProject?.progress_percentage ?? 0}%`}
                </span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full relative" 
                  style={{ width: `${activeProject?.progress_percentage ?? 0}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2 font-label-mono text-label-mono text-on-surface-variant uppercase text-[10px]">
                <span>Target: Q3 2026</span>
                <span>Active project scope</span>
              </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-outline-variant shrink-0"></div>
            <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="font-label-mono text-xs text-on-surface-variant uppercase block mb-1">Total Tasks</span>
                <span className="font-headline-sm text-lg font-bold text-on-surface">
                  {loading ? '...' : tasks.length}
                </span>
              </div>
              <div>
                <span className="font-label-mono text-xs text-on-surface-variant uppercase block mb-1">Migrated</span>
                <span className="font-headline-sm text-lg font-bold text-on-surface">
                  {loading ? '...' : (completedTasks.length + verifiedTasks.length)}
                </span>
              </div>
              <div>
                <span className="font-label-mono text-xs text-error uppercase block mb-1">Blockers</span>
                <span className="font-headline-sm text-lg font-bold text-error">
                  {loading ? '...' : tasks.filter(t => t.status === 'FAILED').length}
                </span>
              </div>
              <div>
                <span className="font-label-mono text-xs text-on-surface-variant uppercase block mb-1">Est. Cost Saving</span>
                <span className="font-headline-sm text-lg font-bold text-emerald-400">~$12k/mo</span>
              </div>
            </div>
          </div>

          {/* Kanban Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter h-[calc(100vh-320px)] min-h-[500px]">
            
            {/* Assessment Column */}
            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex-1">
              <div className="p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neutral-500"></div>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">Assessment</h3>
                </div>
                <span className="bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded font-label-mono text-xs">
                  {pendingTasks.length}
                </span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-surface/50">
                {loading ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono">Loading...</div>
                ) : pendingTasks.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono opacity-50">Empty</div>
                ) : (
                  pendingTasks.map(renderTaskCard)
                )}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex-1">
              <div className="p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0 border-t-2 border-t-tertiary-container">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></div>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">In Progress</h3>
                </div>
                <span className="bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded font-label-mono text-xs">
                  {inProgressTasks.length}
                </span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-surface/50">
                {loading ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono">Loading...</div>
                ) : inProgressTasks.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono opacity-50">Empty</div>
                ) : (
                  inProgressTasks.map(renderTaskCard)
                )}
              </div>
            </div>

            {/* Migrated Column */}
            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex-1 opacity-75 hover:opacity-100 transition-opacity">
              <div className="p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0 border-t-2 border-t-primary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">Migrated</h3>
                </div>
                <span className="bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded font-label-mono text-xs">
                  {completedTasks.length}
                </span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-surface/50">
                {loading ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono">Loading...</div>
                ) : completedTasks.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono opacity-50">Empty</div>
                ) : (
                  completedTasks.map(renderTaskCard)
                )}
              </div>
            </div>

            {/* Verified Column */}
            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex-1 opacity-80">
              <div className="p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0 border-t-2 border-t-emerald-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">Verified</h3>
                </div>
                <span className="bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded font-label-mono text-xs">
                  {verifiedTasks.length}
                </span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-surface/50">
                {loading ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono">Loading...</div>
                ) : verifiedTasks.length === 0 ? (
                  <div className="text-center py-8 text-on-surface-variant text-xs font-label-mono opacity-50">Empty</div>
                ) : (
                  verifiedTasks.map(renderTaskCard)
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackerPage;
