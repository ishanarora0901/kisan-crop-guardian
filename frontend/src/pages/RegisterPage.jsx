import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Sprout, Lock, Mail, User, Phone, MapPin, ArrowRight, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'farmer',
    state: 'Punjab',
    district: 'Ludhiana',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await register(formData);
      if (user.role === 'specialist') {
        navigate('/specialist/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex justify-center items-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl shadow-organic-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center mx-auto mb-3 shadow-md shadow-forest-800/20">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-forest-950">{t('createAccountTitle')}</h2>
          <p className="text-xs text-slate-500 mt-1">{t('createAccountSubtitle')}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('fullNameLabel')}</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Gurpreet Singh"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('roleLabel')}</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 shadow-sm"
              >
                <option value="farmer">{t('roleFarmerOption')}</option>
                <option value="specialist">{t('roleSpecialistOption')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('emailLabel')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@farm.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneLabel')}</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 00000"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('stateLabel')}</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Punjab"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('districtLabel')}</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="Ludhiana"
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 shadow-sm"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-900 shadow-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-forest-800/20 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            {loading ? t('registering') : t('registerBtn')}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          {t('alreadyAccount')}{' '}
          <Link to="/login" className="text-forest-800 font-bold hover:underline">
            {t('signInHere')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
