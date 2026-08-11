import React, { useState } from 'react';
import Sidebar from '../../components/layout/sidebar';

export const TrackerPage: React.FC = () => {
  const [wave, setWave] = useState('w1');

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
                  Active Wave
                </span>
                <span className="text-on-surface-variant font-label-mono text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  On Track
                </span>
              </div>
              <h2 className="font-headline-lg text-2xl font-bold text-on-surface">Wave 1 - Customer Portal</h2>
              <p className="text-on-surface-variant mt-1 text-sm max-w-2xl">
                Migrating core customer-facing applications and associated databases from legacy on-prem to AWS us-east-1.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <select 
                  className="appearance-none bg-surface border border-outline-variant text-on-surface font-body-md rounded py-2 pl-4 pr-10 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer text-sm"
                  value={wave}
                  onChange={(e) => setWave(e.target.value)}
                >
                  <option value="w1">Wave 1 - Customer Portal</option>
                  <option value="w2">Wave 2 - Legacy HR</option>
                  <option value="w3">Wave 3 - Data Warehouse</option>
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
                <span className="font-headline-md text-xl font-bold text-primary">68%</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full relative" style={{ width: '68%' }}>
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="flex justify-between mt-2 font-label-mono text-label-mono text-on-surface-variant uppercase text-[10px]">
                <span>Target: Q3 2024</span>
                <span>14 Days Remaining</span>
              </div>
            </div>
            <div className="hidden md:block w-px h-16 bg-outline-variant shrink-0"></div>
            <div className="w-full flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="font-label-mono text-xs text-on-surface-variant uppercase block mb-1">Total Assets</span>
                <span className="font-headline-sm text-lg font-bold text-on-surface">142</span>
              </div>
              <div>
                <span className="font-label-mono text-xs text-on-surface-variant uppercase block mb-1">Migrated</span>
                <span className="font-headline-sm text-lg font-bold text-on-surface">96</span>
              </div>
              <div>
                <span className="font-label-mono text-xs text-error uppercase block mb-1">Blockers</span>
                <span className="font-headline-sm text-lg font-bold text-error">3</span>
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
                <span className="bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded font-label-mono text-xs">12</span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-surface/50">
                
                {/* Card 1 */}
                <div className="bg-surface border border-outline-variant rounded p-3 hover:border-outline hover:shadow-[0_0_15px_rgba(64,138,113,0.15)] transition-all cursor-grab group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-mono text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant">APP-842</span>
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">more_horiz</span>
                  </div>
                  <h4 className="font-body-md text-on-surface font-medium text-sm mb-1">Legacy Auth Service</h4>
                  <div className="flex gap-1 mb-3 flex-wrap">
                    <span className="font-label-mono text-[10px] border border-outline-variant/50 text-on-surface-variant px-1.5 rounded">On-Prem</span>
                    <span className="font-label-mono text-[10px] border border-outline-variant/50 text-on-surface-variant px-1.5 rounded">High Risk</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-outline-variant/30">
                    <div className="w-5 h-5 rounded bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold">JD</div>
                    <span className="font-label-mono text-[10px] text-on-surface-variant">Pending Dependency Check</span>
                  </div>
                </div>

              </div>
            </div>

            {/* In Progress Column */}
            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex-1">
              <div className="p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0 border-t-2 border-t-tertiary-container">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></div>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">In Progress</h3>
                </div>
                <span className="bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded font-label-mono text-xs">5</span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-surface/50">
                
                {/* Card 2 (Blocked) */}
                <div className="bg-surface border-l-4 border-l-error border-y border-r border-y-outline-variant border-r-outline-variant rounded p-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-8 h-8 bg-error/10 flex items-start justify-end p-1 rounded-bl-lg">
                    <span className="material-symbols-outlined text-[14px] text-error">warning</span>
                  </div>
                  <div className="flex justify-between items-start mb-2 pr-6">
                    <span className="font-label-mono text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant">DB-104</span>
                  </div>
                  <h4 className="font-body-md text-on-surface font-medium text-sm mb-1">Customer Profile DB</h4>
                  <div className="flex gap-1 mb-3 flex-wrap">
                    <span className="font-label-mono text-[10px] border border-outline-variant/50 text-on-surface-variant px-1.5 rounded">MySQL</span>
                    <span className="font-label-mono text-[10px] border border-outline-variant/50 text-on-surface-variant px-1.5 rounded">AWS RDS</span>
                  </div>
                  <div className="bg-error/10 border border-error/20 p-1.5 rounded mb-2">
                    <span className="font-label-mono text-[10px] text-error block">Schema validation failed on sync</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-outline-variant/30">
                    <div className="w-full bg-surface-container-highest rounded-full h-1">
                      <div className="bg-error h-1 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-surface border-l-4 border-l-tertiary-container border-y border-r border-y-outline-variant border-r-outline-variant rounded p-3 hover:shadow-[0_0_15px_rgba(64,138,113,0.15)] transition-all cursor-grab">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-label-mono text-[10px] bg-surface-container-high px-1.5 py-0.5 rounded text-on-surface-variant">APP-201</span>
                  </div>
                  <h4 className="font-body-md text-on-surface font-medium text-sm mb-1">Payment Gateway API</h4>
                  <div className="flex gap-1 mb-3 flex-wrap">
                    <span className="font-label-mono text-[10px] border border-outline-variant/50 text-on-surface-variant px-1.5 rounded">Node.js</span>
                    <span className="font-label-mono text-[10px] border border-outline-variant/50 text-on-surface-variant px-1.5 rounded">EKS</span>
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-2 border-t border-outline-variant/30">
                    <div className="w-full bg-surface-container-highest rounded-full h-1">
                      <div className="bg-tertiary-container h-1 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Migrated Column */}
            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex-1 opacity-75 hover:opacity-100 transition-opacity">
              <div className="p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0 border-t-2 border-t-primary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">Migrated</h3>
                </div>
                <span className="bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded font-label-mono text-xs">24</span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 space-y-3 bg-surface/50">
                
                {/* Minimal Card rep */}
                <div className="bg-surface border border-outline-variant/50 rounded p-2 flex justify-between items-center group cursor-pointer hover:border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-label-mono text-[11px] text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Frontend Assets CDN
                    </span>
                  </div>
                  <span className="font-label-mono text-[9px] text-on-surface-variant opacity-50">2h ago</span>
                </div>

                <div className="bg-surface border border-outline-variant/50 rounded p-2 flex justify-between items-center group cursor-pointer hover:border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-label-mono text-[11px] text-on-surface-variant group-hover:text-on-surface transition-colors">
                      Session Cache Redis
                    </span>
                  </div>
                  <span className="font-label-mono text-[9px] text-on-surface-variant opacity-50">5h ago</span>
                </div>

              </div>
            </div>

            {/* Verified Column */}
            <div className="flex flex-col bg-surface-container border border-outline-variant rounded-lg overflow-hidden flex-1 opacity-60">
              <div className="p-4 border-b border-outline-variant bg-surface-container-high flex justify-between items-center shrink-0 border-t-2 border-t-emerald-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                  <h3 className="font-headline-sm text-sm font-semibold text-on-surface">Verified</h3>
                </div>
                <span className="bg-surface-container-lowest text-on-surface-variant px-2 py-0.5 rounded font-label-mono text-xs">72</span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 bg-surface/30 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30 mb-2 block">task_alt</span>
                  <span className="font-label-mono text-[10px] text-on-surface-variant uppercase tracking-widest">Archive view</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default TrackerPage;
