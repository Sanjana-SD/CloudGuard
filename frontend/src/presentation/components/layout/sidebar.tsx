import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  icon: string;
  path: string;
}

const mainNavItems: NavItem[] = [
  { label: 'Overview', icon: 'dashboard', path: '/dashboard' },
  { label: 'Inventory', icon: 'inventory_2', path: '/inventory' },
  { label: 'Migration', icon: 'account_tree', path: '/migration' },
  { label: 'Security', icon: 'security', path: '/security' },
  { label: 'AI Assistant', icon: 'psychology', path: '/assistant' },
];

const footerNavItems: NavItem[] = [
  { label: 'Settings', icon: 'settings', path: '#' },
  { label: 'Support', icon: 'help_outline', path: '#' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-surface-container-low font-body-md text-body-md fixed left-0 top-0 h-screen w-64 border-r border-outline-variant flex flex-col py-stack-lg z-50">
      {/* Brand / Header */}
      <div className="px-stack-lg mb-stack-lg flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-lg">
          <span 
            className="material-symbols-outlined" 
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            security
          </span>
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary tracking-tight">
            CloudGuard
          </h1>
          <p className="font-label-mono text-label-mono text-on-surface-variant uppercase opacity-80">
            Enterprise SecOps
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="px-stack-lg mb-stack-lg">
        <button className="w-full bg-primary hover:opacity-90 text-on-primary font-body-md font-semibold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Simulation
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 px-stack-md flex flex-col gap-1">
        {mainNavItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary font-bold border-r-2 border-primary bg-surface-container-high scale-[0.98]'
                  : 'text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span 
                className="material-symbols-outlined text-[20px]"
                style={isActive ? { fontVariationSettings: '"FILL" 1' } : undefined}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="px-stack-md mt-auto flex flex-col gap-1 pt-stack-md border-t border-outline-variant">
        {footerNavItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant font-medium hover:bg-surface-container-high hover:text-on-surface transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Sidebar;
