import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Tractor, Stethoscope, ShieldAlert, Sparkles } from 'lucide-react';

const QuickLoginBanner = () => {
  const { quickLoginAs } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loggingInRole, setLoggingInRole] = React.useState(null);

  const handleQuickLogin = async (role) => {
    try {
      setLoggingInRole(role);
      const user = await quickLoginAs(role);
      if (user) {
        if (user.role === 'specialist') {
          navigate('/specialist/dashboard');
        } else if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Quick login error:', err);
    } finally {
      setLoggingInRole(null);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-sage-200 shadow-organic mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-forest-950">{t('quickPersonaTitle')}</h4>
          </div>
          <p className="text-xs text-slate-500">
            {t('quickPersonaSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {/* Farmer Button */}
          <button
            onClick={() => handleQuickLogin('farmer')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sage-100 hover:bg-sage-200/70 text-forest-800 text-xs font-bold border border-sage-300/60 transition-all hover:scale-105 shadow-sm"
          >
            <Tractor className="w-4 h-4 text-forest-800" />
            <span>{t('personaFarmer')}</span>
          </button>

          {/* Specialist Button */}
          <button
            onClick={() => handleQuickLogin('specialist')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100/70 text-teal-800 text-xs font-bold border border-teal-200 transition-all hover:scale-105 shadow-sm"
          >
            <Stethoscope className="w-4 h-4 text-teal-700" />
            <span>{t('personaSpecialist')}</span>
          </button>

          {/* Admin Button */}
          <button
            onClick={() => handleQuickLogin('admin')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-all hover:scale-105 shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-slate-700" />
            <span>{t('personaAdmin')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLoginBanner;
