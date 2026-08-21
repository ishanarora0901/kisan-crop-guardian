import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  LayoutDashboard,
  Tractor,
  ScanEye,
  TrendingUp,
  Sliders,
  History,
  ShieldCheck,
  Stethoscope,
  ShieldAlert,
  Users,
  Database,
  BarChart3,
  FileCheck2,
  Settings,
} from 'lucide-react';

const Sidebar = () => {
  const { user, isFarmer, isSpecialist, isAdmin } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  const farmerNav = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/farms-and-crops', label: t('farmsAndCrops'), icon: Tractor },
    { to: '/disease-scanner', label: t('diseaseScanner'), icon: ScanEye, badge: 'AI Vision' },
    { to: '/profitability', label: t('profitability'), icon: TrendingUp },
    { to: '/what-if-simulator', label: t('whatIfSimulator'), icon: Sliders, badge: 'AI Engine' },
    { to: '/historical-intelligence', label: t('historicalIntelligence'), icon: History },
    { to: '/crop-passport', label: t('cropPassport'), icon: ShieldCheck, badge: 'Blockchain' },
    { to: '/consultations', label: t('consultations'), icon: Stethoscope },
  ];

  const specialistNav = [
    { to: '/specialist/dashboard', label: 'Consultation Queue', icon: Stethoscope },
    { to: '/farms-and-crops', label: 'Farmer Crop Inspect', icon: Tractor },
    { to: '/disease-scanner', label: 'Disease Diagnostics Tool', icon: ScanEye },
    { to: '/historical-intelligence', label: 'Agronomic History', icon: History },
  ];

  const adminNav = [
    { to: '/admin', label: 'Admin Command Center', icon: BarChart3 },
    { to: '/admin/users', label: 'User & Specialist Ops', icon: Users },
    { to: '/admin/blockchain', label: 'Blockchain Ledger Audit', icon: ShieldCheck },
    { to: '/dashboard', label: 'Farmer View Preview', icon: LayoutDashboard },
  ];

  const links = isAdmin ? adminNav : isSpecialist ? specialistNav : farmerNav;

  return (
    <aside className="w-full md:w-64 bg-slate-900/60 border-r border-slate-800 shrink-0 p-4">
      <div className="mb-4 px-2">
        <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {isAdmin ? 'Administration' : isSpecialist ? 'Specialist Workspace' : 'Farmer Workspace'}
        </p>
      </div>

      <nav className="space-y-1.5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Trust & Verification Pill */}
      <div className="mt-8 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400">
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200">ICAR & SHA-256 Verified</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Proactive AI risk model trained on meteorological & soil microclimate datasets.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
