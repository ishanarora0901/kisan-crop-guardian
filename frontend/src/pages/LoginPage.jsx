import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import QuickLoginBanner from '../components/common/QuickLoginBanner';

const LoginPage = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'specialist') {
        navigate('/specialist/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-lg mb-8">
        <QuickLoginBanner />
      </div>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-organic-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center mx-auto mb-3 shadow-md shadow-forest-800/20">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-forest-950">{t('signInTitle')}</h2>
          <p className="text-xs text-slate-500 mt-1">{t('signInSubtitle')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('emailLabel')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@cropguardian.ai"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 placeholder-slate-400 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('passwordLabel')}</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 placeholder-slate-400 shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-forest-800/20 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? t('authenticating') : t('signInBtn')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          {t('noAccount')}{' '}
          <Link to="/register" className="text-forest-800 font-bold hover:underline">
            {t('registerLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
