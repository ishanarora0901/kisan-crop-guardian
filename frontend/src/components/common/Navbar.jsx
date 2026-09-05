import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage, AVAILABLE_LANGUAGES } from '../../contexts/LanguageContext';
import {
  Sprout,
  ShieldCheck,
  Bell,
  Languages,
  Crown,
  LogOut,
  User as UserIcon,
  Sparkles,
  ChevronDown,
  Check,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout, togglePremium, isAdmin, isSpecialist } = useAuth();
  const { lang, switchLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentLang = AVAILABLE_LANGUAGES.find((l) => l.code === lang) || AVAILABLE_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e2ece5] shadow-[0_2px_12px_rgba(11,70,53,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center shadow-md shadow-forest-800/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-forest-950 tracking-tight">
                  {t('appTitle')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-sage-100 text-forest-800 border border-sage-200">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-forest-700 font-medium hidden sm:block">
                {t('predict')} · {t('detect')} · {t('act')} · {t('protect')}
              </p>
            </div>
          </Link>

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selector Dropdown (English / Hindi / Punjabi) */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-sage-50 text-slate-700 text-xs font-semibold border border-sage-200 transition-all shadow-sm"
                title={`${t('selectLanguage')} (English / Hindi / ਪੰਜਾਬੀ)`}
              >
                <Languages className="w-3.5 h-3.5 text-forest-800" />
                <span className="flex items-center gap-1">
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.native}</span>
                  <span className="text-[10px] text-slate-400 hidden sm:inline">({currentLang.code.toUpperCase()})</span>
                </span>
                <ChevronDown
                  className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
                    langMenuOpen ? 'rotate-180 text-forest-800' : ''
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-sage-200 shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-sage-100 mb-1">
                    {t('selectLanguage')}
                  </div>
                  {AVAILABLE_LANGUAGES.map((item) => {
                    const isSelected = item.code === lang;
                    return (
                      <button
                        key={item.code}
                        onClick={() => {
                          switchLanguage(item.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                          isSelected
                            ? 'bg-sage-100 text-forest-900 font-bold border-l-2 border-forest-800'
                            : 'text-slate-700 hover:bg-sage-50 hover:text-forest-900 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.flag}</span>
                          <div>
                            <p className="leading-tight">{item.native}</p>
                            <p className="text-[10px] text-slate-400">{item.label}</p>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-forest-800" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {user ? (
              <>
                {/* Premium Pro Tier Switch */}
                <button
                  onClick={togglePremium}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    user.isPremium
                      ? 'bg-amber-50 text-amber-800 border border-amber-300 shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                  title="Toggle Pro / Free Tier Features"
                >
                  <Crown
                    className={`w-3.5 h-3.5 ${
                      user.isPremium ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
                    }`}
                  />
                  <span className="hidden md:inline">
                    {user.isPremium ? t('proMember') : t('freeTier')}
                  </span>
                </button>

                {/* Role Badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sage-100 border border-sage-200 text-xs font-bold text-forest-800">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      user.role === 'admin'
                        ? 'bg-purple-600'
                        : user.role === 'specialist'
                        ? 'bg-cyan-600'
                        : 'bg-forest-800'
                    }`}
                  ></span>
                  <span className="capitalize">
                    {user.role === 'admin'
                      ? t('adminRole')
                      : user.role === 'specialist'
                      ? t('specialistRole')
                      : t('farmerRole')}
                  </span>
                </div>

                {/* User Menu / Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-sage-200">
                  <div className="text-right hidden md:block">
                    <p className="text-xs font-semibold text-slate-800">{user.name}</p>
                    <p className="text-[10px] text-slate-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg bg-sage-50 hover:bg-red-50 hover:text-red-600 text-slate-500 transition-colors border border-sage-200/60"
                    title={t('logout')}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-sage-50 text-forest-800 text-xs font-bold border border-forest-800/30 transition-colors shadow-sm"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold transition-all shadow-md shadow-forest-800/20"
                >
                  {t('getStarted')}
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
