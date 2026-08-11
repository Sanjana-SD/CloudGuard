import React from 'react';
import Sidebar from '../../components/layout/sidebar';

export const InventoryPage: React.FC = () => {
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
              <button className="bg-primary text-on-primary font-body-md font-medium py-2 px-4 rounded hover:bg-primary-hover transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-sm">add</span>
                Add Application
              </button>
            </div>
          </div>

          {/* Stats Overview Bento */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-stack-lg">
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between hover:border-outline transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs mb-2">Total Apps</span>
              <div className="font-headline-lg text-2xl font-bold text-on-surface">1,248</div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between border-l-4 border-l-primary hover:border-outline transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs mb-2">Migrated</span>
              <div className="font-headline-lg text-2xl font-bold text-on-surface">892</div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between border-l-4 border-l-tertiary-container hover:border-outline transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs mb-2">Migrating</span>
              <div className="font-headline-lg text-2xl font-bold text-on-surface">156</div>
            </div>
            <div className="bg-surface-container-low border border-outline-variant rounded-lg p-4 flex flex-col justify-between border-l-4 border-l-error hover:border-outline transition-colors">
              <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs mb-2">High Risk</span>
              <div className="font-headline-lg text-2xl font-bold text-error">42</div>
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
                  
                  {/* Row 1 */}
                  <tr className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="py-3 px-4 font-medium text-on-surface flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      Payment API v2
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Microservice</td>
                    <td className="py-3 px-4 text-on-surface-variant">Core Banking Team</td>
                    <td className="py-3 px-4">
                      <span className="bg-surface-container-highest px-2 py-0.5 rounded text-[11px] font-label-mono border border-outline-variant/30 text-on-surface">Prod</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Migrated
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-on-surface w-6 text-right">12</span>
                        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[12%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Internal</td>
                    <td className="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="py-3 px-4 font-medium text-on-surface flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-error"></div>
                      Legacy HR Portal
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Monolith</td>
                    <td className="py-3 px-4 text-on-surface-variant">Internal Ops</td>
                    <td className="py-3 px-4">
                      <span className="bg-surface-container-highest px-2 py-0.5 rounded text-[11px] font-label-mono border border-outline-variant/30 text-on-surface">Prod</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-semibold bg-surface-container-highest text-on-surface-variant border border-outline-variant/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-500"></span>
                        On-Prem
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-error font-medium w-6 text-right">87</span>
                        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-error w-[87%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Public Web</td>
                    <td className="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="py-3 px-4 font-medium text-on-surface flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-tertiary-container"></div>
                      Customer Auth Service
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Microservice</td>
                    <td className="py-3 px-4 text-on-surface-variant">Identity Team</td>
                    <td className="py-3 px-4">
                      <span className="bg-surface-container-highest px-2 py-0.5 rounded text-[11px] font-label-mono border border-outline-variant/30 text-on-surface-variant">Staging</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-semibold bg-tertiary-container/10 text-tertiary border border-tertiary-container/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container"></span>
                        Migrating
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-tertiary font-medium w-6 text-right">45</span>
                        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-tertiary-container w-[45%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Internal API</td>
                    <td className="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="py-3 px-4 font-medium text-on-surface flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      Fraud Detection Engine
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Data Pipeline</td>
                    <td className="py-3 px-4 text-on-surface-variant">Data Science</td>
                    <td className="py-3 px-4">
                      <span className="bg-surface-container-highest px-2 py-0.5 rounded text-[11px] font-label-mono border border-outline-variant/30 text-on-surface">Prod</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                        Migrated
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="text-on-surface w-6 text-right">08</span>
                        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[8%]"></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">Backend</td>
                    <td className="py-3 px-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-on-surface-variant hover:text-primary">
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-outline-variant flex justify-between items-center text-sm text-on-surface-variant bg-[#0c0c0c]">
              <span>Showing 1 to 4 of 1,248 entries</span>
              <div className="flex gap-2">
                <button className="px-2 py-1 rounded border border-outline-variant hover:bg-neutral-800 transition-colors disabled:opacity-50" disabled>
                  Prev
                </button>
                <button className="px-2 py-1 rounded border border-outline-variant hover:bg-neutral-800 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryPage;
