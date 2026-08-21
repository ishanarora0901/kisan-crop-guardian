import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Sprout,
  ShieldCheck,
  Bell,
  Languages,
  Crown,
  LogOut,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, togglePremium, isAdmin, isSpecialist } = useAuth();
  const { lang, switchLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">AI Crop Guardian</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/80 font-medium hidden sm:block">
                DETECT · PREDICT · PREVENT · OPTIMIZE
              </p>
            </div>
          </Link>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher Toggle */}
            <button
              onClick={() => switchLanguage(lang === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-colors"
              title="Switch Language (English / Hindi)"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'en' ? 'हिंदी (HI)' : 'English (EN)'}</span>
            </button>

            {user ? (
              <>
                {/* Premium Pro Tier Switch */}
                <button
                  onClick={togglePremium}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    user.isPremium
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                  }`}
                  title="Toggle Pro / Free Tier Features"
                >
                  <Crown className={`w-3.5 h-3.5 ${user.isPremium ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{user.isPremium ? 'PRO MEMBER' : 'FREE TIER'}</span>
                </button>

                {/* Role Badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs font-medium text-slate-300">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-400'
                        : user.role === 'specialist'
                        ? 'bg-cyan-400'
                        : 'bg-emerald-400'
                    }`}
                  ></span>
                  <span className="capitalize">{user.role}</span>
                </div>

                {/* User Menu / Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-semibold text-slate-200">{user.name}</p>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
