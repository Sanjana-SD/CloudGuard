import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="bg-background text-on-surface h-screen w-full overflow-hidden flex font-body-md mesh-gradient">
      {/* Left Side: Graphic / Branding */}
      <div className="hidden lg:flex lg:w-1/2 h-full flex-col justify-between p-margin-page relative overflow-hidden">
        {/* Background Image for Graphic Side */}
        <div className="absolute inset-0 z-0">
          <div 
            className="bg-cover bg-center w-full h-full opacity-30 mix-blend-screen grayscale-[50%]" 
            style={{ 
              backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCv4rgn7YiBZOgHl8ZRnv21dBKVAFnAWKFaxnTAIku6Vr1JlS_gPOg6RDRdI8_vGbkAAHOQqQiH2ZsUjtfDhl9EgPvthmg4yjsc2P9k_1J1yuLyIZTtFgwFH26ihXa5fzrznffEVO5XOXGDkFkGLZSGvpMpf57aeR_V3sGqmDTKnvc9fNc10V7-IKoDZpoVVZ1it8WLxHX5-EQKd9NjnjsuVR3mZONmMAT4SHv-eGRjemlmSikucXQmww')" 
            }}
          ></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background z-10 pointer-events-none"></div>
        {/* Branding Header */}
        <div className="z-20">
          <div className="flex items-center gap-stack-sm">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">CloudGuard</h1>
          </div>
          <p className="mt-stack-sm font-label-mono text-label-mono text-on-surface-variant uppercase tracking-widest">
            Enterprise SecOps Platform
          </p>
        </div>

        {/* Callout/Testimonial */}
        <div className="z-20 max-w-md">
          <div className="glass-panel p-stack-lg rounded-xl shadow-lg border-l-4 border-l-primary">
            <p className="font-headline-sm text-headline-sm text-on-surface mb-stack-md">
              "Total environmental control during complex cloud migrations. Precision engineering at its core."
            </p>
            <div className="flex items-center gap-stack-sm">
              <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_circle
                </span>
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">System Initialization</p>
                <p className="font-label-mono text-label-mono text-primary">v2.4.1_secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-stack-lg relative z-20">
        <div className="w-full max-w-[440px] glass-panel rounded-xl p-[40px] shadow-2xl relative">
          {/* Mobile Logo (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center justify-center gap-stack-sm mb-stack-lg">
            <span className="material-symbols-outlined text-primary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              security
            </span>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">CloudGuard</h1>
          </div>
          
          {/* Header */}
          <div className="mb-stack-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-unit">Sign In</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Authenticate to access the control center.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-stack-md">
            <div>
              <label className="block font-label-mono text-label-mono text-on-surface-variant mb-unit uppercase" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-stack-sm flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant text-[18px]">mail</span>
                </div>
                <input 
                  className="block w-full pl-[36px] pr-stack-sm py-[10px] bg-surface-container-lowest border border-outline-variant rounded focus:ring-1 focus:ring-primary focus:border-primary text-on-surface font-body-md text-body-md placeholder-outline-variant transition-colors" 
                  id="email" 
                  name="email" 
                  placeholder="admin@enterprise.com" 
                  required 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-unit">
                <label className="block font-label-mono text-label-mono text-on-surface-variant uppercase" htmlFor="password">
                  Password
                </label>
                <a className="font-label-mono text-label-mono text-primary hover:text-primary-fixed-dim transition-colors" href="#">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-stack-sm flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant text-[18px]">lock</span>
                </div>
                <input 
                  className="block w-full pl-[36px] pr-[36px] py-[10px] bg-surface-container-lowest border border-outline-variant rounded focus:ring-1 focus:ring-primary focus:border-primary text-on-surface font-body-md text-body-md placeholder-outline-variant transition-colors" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  required 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button className="absolute inset-y-0 right-0 pr-stack-sm flex items-center text-outline-variant hover:text-on-surface-variant transition-colors" type="button">
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                </button>
              </div>
            </div>

            <div className="flex items-center pt-unit">
              <input className="h-4 w-4 rounded border-outline-variant bg-surface-container-lowest text-primary focus:ring-primary focus:ring-offset-surface" id="remember-me" name="remember-me" type="checkbox"/>
              <label className="ml-2 block font-body-md text-body-md text-on-surface-variant" htmlFor="remember-me">
                Remember terminal session
              </label>
            </div>

            <div className="pt-stack-sm">
              <button className="w-full flex justify-center py-[10px] px-4 border border-transparent rounded bg-primary text-on-primary font-body-lg text-body-lg font-medium hover:bg-primary-fixed transition-colors shadow-[0_0_15px_rgba(77,142,255,0.15)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background" type="submit">
                Sign In
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-stack-lg pt-stack-md border-t border-outline-variant text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Require access?{' '}
              <Link className="font-medium text-primary hover:text-primary-fixed-dim transition-colors" to="/register">
                Request provisioning
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
