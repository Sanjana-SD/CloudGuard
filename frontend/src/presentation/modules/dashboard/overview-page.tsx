import React from 'react';
import Sidebar from '../../components/layout/sidebar';

export const OverviewPage: React.FC = () => {
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
              ABC Financial Services
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden lg:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                search
              </span>
              <input 
                className="bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all w-64 text-on-surface placeholder:text-on-surface-variant" 
                placeholder="Search resources..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">history</span>
              </button>
              <button className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="p-margin-page flex-1 overflow-y-auto w-full max-w-[1600px] mx-auto">
          {/* Summary Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
            
            {/* Card 1 */}
            <div className="glass-panel rounded-lg p-stack-md flex flex-col justify-between border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Total Apps</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">apps</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-headline-lg text-3xl font-bold text-on-surface">42</span>
                <span className="font-body-sm text-primary flex items-center text-xs gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span> 3 new
                </span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-panel rounded-lg p-stack-md flex flex-col justify-between border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Migration Progress</span>
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">cloud_sync</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-headline-lg text-3xl font-bold text-on-surface">68%</span>
                <div className="w-16 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '68%' }}></div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-panel rounded-lg p-stack-md flex flex-col justify-between border-l-4 border-l-[#cb7b74]">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Open Incidents</span>
                <span className="material-symbols-outlined text-[#cb7b74] text-[20px]">warning</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-headline-lg text-3xl font-bold text-on-surface">4</span>
                <span className="font-body-sm text-[#cb7b74] flex items-center text-xs">Requires attention</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass-panel rounded-lg p-stack-md flex flex-col justify-between border-l-4 border-l-primary">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-mono text-label-mono text-on-surface-variant uppercase text-xs">Org Risk Score</span>
                <span className="material-symbols-outlined text-primary text-[20px]">health_and_safety</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="font-headline-lg text-3xl font-bold text-on-surface">24</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-label-mono text-[10px] uppercase border border-primary/30">
                  Low Risk
                </span>
              </div>
            </div>

          </div>

          {/* Main Content Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-stack-lg">
            
            {/* Chart Area: Risk Trend */}
            <div className="glass-panel rounded-lg p-stack-md lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-headline-sm text-lg font-semibold text-on-surface">Risk Trend Over Time</h3>
                <div className="flex gap-2">
                  <span className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-mono text-[10px] cursor-pointer hover:bg-neutral-800 border border-outline-variant">
                    7D
                  </span>
                  <span className="px-2 py-1 rounded bg-primary text-on-primary font-label-mono text-[10px] cursor-pointer border border-primary font-semibold">
                    30D
                  </span>
                  <span className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-mono text-[10px] cursor-pointer hover:bg-neutral-800 border border-outline-variant">
                    90D
                  </span>
                </div>
              </div>
              <div className="flex-1 min-h-[250px] relative w-full flex items-end">
                {/* Horizontal y-axis labels */}
                <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] text-on-surface-variant font-label-mono pb-6">
                  <span>100</span>
                  <span>75</span>
                  <span>50</span>
                  <span>25</span>
                  <span>0</span>
                </div>
                {/* Chart body */}
                <div className="ml-10 flex-1 h-full border-l border-b border-outline-variant relative flex items-end justify-between px-2 pb-[1px] gap-2">
                  {/* Horizontal grid lines */}
                  <div className="absolute w-full h-[1px] bg-[#333333]/30 bottom-1/4 left-0"></div>
                  <div className="absolute w-full h-[1px] bg-[#333333]/30 bottom-2/4 left-0"></div>
                  <div className="absolute w-full h-[1px] bg-[#333333]/30 bottom-3/4 left-0"></div>
                  <div className="absolute w-full h-[1px] bg-[#333333]/30 top-0 left-0"></div>

                  {/* Bars */}
                  <div className="chart-bar h-[60%]">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-label-mono">W1</span>
                  </div>
                  <div className="chart-bar h-[75%]">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-label-mono">W2</span>
                  </div>
                  <div className="chart-bar h-[45%]">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-label-mono">W3</span>
                  </div>
                  <div className="chart-bar h-[80%]">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-label-mono">W4</span>
                  </div>
                  <div className="chart-bar h-[55%]">
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-on-surface-variant font-label-mono">W5</span>
                  </div>
                  <div 
                    className="chart-bar h-[30%] bg-opacity-50" 
                    style={{ 
                      background: 'linear-gradient(to top, rgba(64,138,113,0.1), rgba(64,138,113,0.5))', 
                      borderColor: 'rgba(64,138,113,0.5)' 
                    }}
                  >
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-primary font-label-mono font-bold">Now</span>
                  </div>

                  {/* Overlay Line (SVG mock) */}
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <polyline fill="none" points="5,40 25,25 45,55 65,20 85,45 95,70" stroke="#cb7b74" strokeWidth="2" vectorEffect="non-scaling-stroke"></polyline>
                    <circle cx="95" cy="70" fill="#000000" r="3" stroke="#cb7b74" strokeWidth="2" vectorEffect="non-scaling-stroke"></circle>
                  </svg>
                </div>
              </div>
            </div>

            {/* Chart Area: Migration Status */}
            <div className="glass-panel rounded-lg p-stack-md flex flex-col items-center justify-center">
              <h3 className="font-headline-sm text-lg font-semibold text-on-surface w-full text-left mb-4">Migration Status</h3>
              <div className="donut-container my-4">
                <div className="donut-inner shadow-inner">
                  <span className="font-headline-lg text-3xl font-bold text-primary">68%</span>
                  <span className="font-label-mono text-label-mono text-on-surface-variant text-[10px] uppercase tracking-wider">Complete</span>
                </div>
              </div>
              <div className="w-full mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary"></div>
                    <span className="text-on-surface">Migrated</span>
                  </div>
                  <span className="font-label-mono text-on-surface-variant text-xs">28 Apps</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-neutral-800"></div>
                    <span className="text-on-surface">Pending</span>
                  </div>
                  <span className="font-label-mono text-on-surface-variant text-xs">14 Apps</span>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Section: Findings List */}
          <div className="glass-panel rounded-lg overflow-hidden">
            <div className="p-stack-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
              <h3 className="font-headline-sm text-base font-semibold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">policy</span>
                Recent High-Risk Findings
              </h3>
              <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
            
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant bg-[#0c0c0c]">
                    <th className="py-3 px-stack-md font-label-mono text-label-mono text-on-surface-variant text-xs uppercase font-normal">Resource ID</th>
                    <th className="py-3 px-stack-md font-label-mono text-label-mono text-on-surface-variant text-xs uppercase font-normal">Issue Type</th>
                    <th className="py-3 px-stack-md font-label-mono text-label-mono text-on-surface-variant text-xs uppercase font-normal">Severity</th>
                    <th className="py-3 px-stack-md font-label-mono text-label-mono text-on-surface-variant text-xs uppercase font-normal">Age</th>
                    <th className="py-3 px-stack-md font-label-mono text-label-mono text-on-surface-variant text-xs uppercase font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#38342c]/50 text-sm">
                  
                  <tr className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="py-3 px-stack-md font-label-mono text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">dns</span>
                      i-0a1b2c3d4e5f6g7h8
                    </td>
                    <td className="py-3 px-stack-md text-on-surface">Publicly accessible S3 bucket containing PII</td>
                    <td className="py-3 px-stack-md">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#cb7b74]/10 text-[#cb7b74] border border-[#cb7b74]/20 font-label-mono uppercase">
                        Critical
                      </span>
                    </td>
                    <td className="py-3 px-stack-md text-on-surface-variant">2h ago</td>
                    <td className="py-3 px-stack-md text-right">
                      <button className="text-primary hover:text-primary-fixed opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="py-3 px-stack-md font-label-mono text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">vpn_key</span>
                      key-9x8y7z6w5v
                    </td>
                    <td className="py-3 px-stack-md text-on-surface">IAM User access key inactive for &gt; 90 days</td>
                    <td className="py-3 px-stack-md">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 font-label-mono uppercase">
                        High
                      </span>
                    </td>
                    <td className="py-3 px-stack-md text-on-surface-variant">1d ago</td>
                    <td className="py-3 px-stack-md text-right">
                      <button className="text-primary hover:text-primary-fixed opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-neutral-900/50 transition-colors group">
                    <td className="py-3 px-stack-md font-label-mono text-on-surface flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">router</span>
                      sg-1234abcd5678efgh
                    </td>
                    <td className="py-3 px-stack-md text-on-surface">Security Group allows unrestricted SSH (port 22)</td>
                    <td className="py-3 px-stack-md">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 font-label-mono uppercase">
                        High
                      </span>
                    </td>
                    <td className="py-3 px-stack-md text-on-surface-variant">3d ago</td>
                    <td className="py-3 px-stack-md text-right">
                      <button className="text-primary hover:text-primary-fixed opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
