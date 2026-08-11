import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

export const RegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await api.auth.register(email, password, `${firstName} ${lastName}`, 'SECURITY_ANALYST');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen w-full overflow-y-auto flex font-body-md mesh-gradient p-stack-lg">
      <div className="w-full max-w-[560px] glass-panel rounded-xl p-[32px] md:p-[40px] shadow-2xl relative mx-auto my-auto">
        {/* Logo Banner */}
        <div className="mb-stack-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: '"FILL" 1' }}>
              security
            </span>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface tracking-tight">CloudGuard</span>
          </div>
        </div>

        {/* Header */}
        <div className="mb-margin-page">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-stack-sm">
            Create Account
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Enter your details to configure your workspace.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-stack-md">
          {error && (
            <div className="bg-error/10 border border-error/25 text-error p-stack-sm rounded text-sm font-medium mb-stack-sm">
              {error}
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-stack-md">
            <div className="w-full">
              <label className="block font-label-mono text-label-mono text-on-surface-variant mb-unit" htmlFor="firstName">
                FIRST NAME
              </label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface rounded-md px-4 py-3 text-on-surface font-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-outline-variant" 
                id="firstName" 
                placeholder="Jane" 
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="w-full">
              <label className="block font-label-mono text-label-mono text-on-surface-variant mb-unit" htmlFor="lastName">
                LAST NAME
              </label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface rounded-md px-4 py-3 text-on-surface font-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-outline-variant" 
                id="lastName" 
                placeholder="Doe" 
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-unit" htmlFor="workEmail">
              WORK EMAIL
            </label>
            <input 
              className="w-full bg-surface-container-lowest border border-surface rounded-md px-4 py-3 text-on-surface font-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors placeholder:text-outline-variant" 
              id="workEmail" 
              placeholder="jane.doe@company.com" 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-unit" htmlFor="password">
              PASSWORD
            </label>
            <div className="relative">
              <input 
                className="w-full bg-surface-container-lowest border border-surface rounded-md px-4 py-3 text-on-surface font-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors pr-10" 
                id="password" 
                placeholder="••••••••" 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline-variant hover:text-primary transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </button>
            </div>
            {/* Password Strength Indicator */}
            <div className="mt-stack-sm flex gap-1 h-1 w-full">
              <div className="h-full flex-1 bg-error rounded-full opacity-50"></div>
              <div className="h-full flex-1 bg-primary-container rounded-full opacity-20"></div>
              <div className="h-full flex-1 bg-surface-variant rounded-full opacity-20"></div>
              <div className="h-full flex-1 bg-surface-variant rounded-full opacity-20"></div>
            </div>
          </div>

          <div>
            <label className="block font-label-mono text-label-mono text-on-surface-variant mb-unit" htmlFor="confirmPassword">
              CONFIRM PASSWORD
            </label>
            <input 
              className="w-full bg-surface-container-lowest border border-surface rounded-md px-4 py-3 text-on-surface font-body-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-colors" 
              id="confirmPassword" 
              placeholder="••••••••" 
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="pt-stack-sm">
            <button disabled={loading} className="w-full bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-label-mono text-label-mono py-3 px-4 rounded-md transition-all duration-200 flex justify-center items-center gap-2 btn-primary uppercase tracking-wider font-semibold border border-transparent disabled:opacity-50" type="submit">
              <span>{loading ? 'Initializing...' : 'Initialize Environment'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </form>

        <div className="mt-stack-lg text-center">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Already have access?{' '}
            <Link className="text-primary hover:text-primary-fixed transition-colors font-medium underline underline-offset-4 decoration-surface-variant hover:decoration-primary" to="/login">
              Authenticate here
            </Link>
          </p>
        </div>

        <div className="mt-margin-page pt-stack-lg border-t border-surface text-center">
          <p className="font-label-mono text-[11px] text-outline-variant">
            By initializing, you agree to the <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a> &amp; <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
