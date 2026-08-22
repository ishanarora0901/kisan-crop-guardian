import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tractor, Stethoscope, ShieldAlert, Sparkles } from 'lucide-react';

const QuickLoginBanner = () => {
  const { quickLoginAs } = useAuth();
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
    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 shadow-xl mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-slate-100">1-Click Hackathon Demo Access</h4>
          </div>
          <p className="text-xs text-slate-400">
            Switch between pre-configured agricultural personas instantly:
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {/* Farmer Button */}
          <button
            onClick={() => handleQuickLogin('farmer')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all hover:scale-105"
          >
            <Tractor className="w-4 h-4 text-emerald-400" />
            <span>Harpreet Singh (Farmer)</span>
          </button>

          {/* Specialist Button */}
          <button
            onClick={() => handleQuickLogin('specialist')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 transition-all hover:scale-105"
          >
            <Stethoscope className="w-4 h-4 text-cyan-400" />
            <span>Dr. Sharma (Specialist)</span>
          </button>

          {/* Admin Button */}
          <button
            onClick={() => handleQuickLogin('admin')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-bold border border-purple-500/30 transition-all hover:scale-105"
          >
            <ShieldAlert className="w-4 h-4 text-purple-400" />
            <span>Chief Agri Admin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickLoginBanner;
