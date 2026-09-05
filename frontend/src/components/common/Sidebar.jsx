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
    { to: '/specialist/dashboard', label: t('consultationQueue'), icon: Stethoscope },
    { to: '/farms-and-crops', label: t('farmerCropInspect'), icon: Tractor },
    { to: '/disease-scanner', label: t('diseaseDiagnostics'), icon: ScanEye },
    { to: '/historical-intelligence', label: t('agronomicHistory'), icon: History },
  ];

  const adminNav = [
    { to: '/admin', label: t('adminCommandCenter'), icon: BarChart3 },
    { to: '/admin/users', label: t('userSpecialistOps'), icon: Users },
    { to: '/admin/blockchain', label: t('blockchainAudit'), icon: ShieldCheck },
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
  ];

  const links = isAdmin ? adminNav : isSpecialist ? specialistNav : farmerNav;

  return (
    <aside className="w-full md:w-64 bg-white border-r border-[#e2ece5] shrink-0 p-4 shadow-[2px_0_10px_rgba(11,70,53,0.02)]">
      <div className="mb-4 px-2">
        <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
          {isAdmin ? t('adminWorkspace') : isSpecialist ? t('specialistWorkspace') : t('farmerWorkspace')}
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
                    ? 'bg-sage-100 text-forest-900 font-bold border-l-4 border-forest-800 shadow-sm'
                    : 'text-slate-600 hover:bg-sage-50 hover:text-forest-900'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-forest-800 shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sage-200/80 text-forest-800 border border-sage-300">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
