import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import QuickLoginBanner from '../components/common/QuickLoginBanner';
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Brain,
  ScanEye,
  Stethoscope,
  Activity,
  History,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Headphones,
  Users,
  Shield,
  Heart,
  Calendar,
  Layers,
  Leaf,
  Check,
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ fullName: '', phoneNumber: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  const services = [
    {
      title: t('srvAdvisoryTitle'),
      desc: t('srvAdvisoryDesc'),
      icon: Sprout,
      link: '/farms-and-crops',
    },
    {
      title: t('srvPathologyTitle'),
      desc: t('srvPathologyDesc'),
      icon: ScanEye,
      link: '/disease-scanner',
    },
    {
      title: t('srvTelemetryTitle'),
      desc: t('srvTelemetryDesc'),
      icon: Activity,
      link: '/dashboard',
    },
    {
      title: t('srvNutritionTitle'),
      desc: t('srvNutritionDesc'),
      icon: Leaf,
      link: '/what-if-simulator',
    },
    {
      title: t('srvRiskTitle'),
      desc: t('srvRiskDesc'),
      icon: Brain,
      link: '/dashboard',
    },
    {
      title: t('srvPassportTitle'),
      desc: t('srvPassportDesc'),
      icon: ShieldCheck,
      link: '/crop-passport',
    },
  ];

  return (
    <div className="min-h-screen bg-sage-50 text-slate-800 selection:bg-forest-800 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT / HIGHLIGHTS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className="bg-forest-800 text-white rounded-2xl py-3 px-4 sm:px-8 shadow-forest flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-[200px] flex-1">
            <div className="w-9 h-9 rounded-full bg-forest-700/80 border border-forest-600/60 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{t('icarPlantDoctors')}</p>
              <p className="text-[11px] text-forest-200">{t('certifiedScientists')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 min-w-[200px] flex-1">
            <div className="w-9 h-9 rounded-full bg-forest-700/80 border border-forest-600/60 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{t('aiEarlyRiskPrediction')}</p>
              <p className="text-[11px] text-forest-200">{t('proactivePathogenAlerts')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 min-w-[200px] flex-1">
            <div className="w-9 h-9 rounded-full bg-forest-700/80 border border-forest-600/60 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{t('quickConsultations')}</p>
              <p className="text-[11px] text-forest-200">{t('instantDigitalAdvisory')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 min-w-[200px] flex-1">
            <div className="w-9 h-9 rounded-full bg-forest-700/80 border border-forest-600/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">{t('verifiedCropPassport')}</p>
              <p className="text-[11px] text-forest-200">{t('sha256FieldCert')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Centered Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sage-100 border border-sage-200 text-forest-800 text-xs font-extrabold mb-6 shadow-sm">
          <Sprout className="w-3.5 h-3.5 text-forest-800" />
          <span>{t('proactiveIntelPlatform')}</span>
        </div>

        {/* Hero Headline with Forest Green Accent */}
        <h1 className="text-4xl sm:text-6xl font-black text-forest-950 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          {t('heroHeadlineLine1')} <br className="hidden sm:block" />
          <span className="text-forest-800">
            {t('heroHeadlineLine2')}
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {t('heroDesc')}
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/login'}
            className="px-7 py-3.5 rounded-full bg-forest-800 hover:bg-forest-700 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-forest-800/25 transition-all hover:scale-105"
          >
            <span>{user ? t('enterFarmerCommandCenter') : t('launchLiveDemo')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-sage-100 text-forest-900 font-bold text-sm sm:text-base border border-sage-300 transition-all shadow-sm"
          >
            {t('accessPortals')}
          </Link>
        </div>

        {/* 1-Click Persona Login Banner */}
        <div className="mt-10 max-w-4xl mx-auto text-left">
          <QuickLoginBanner />
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sage-100 border border-sage-200 text-forest-800 text-xs font-bold mb-3">
            <Leaf className="w-3.5 h-3.5 text-forest-800" />
            <span>{t('ourServices')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
            {t('servicesHeading')} <span className="font-serif italic font-normal text-forest-800">{t('servicesSubheading')}</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto mt-2.5">
            {t('servicesDescription')}
          </p>
        </div>

        {/* Service Cards Grid (1 Featured Dark Card + 6 Clean White Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Featured Deep Forest Green Card */}
          <div className="bg-forest-800 text-white rounded-3xl p-7 flex flex-col justify-between shadow-forest relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="w-12 h-12 rounded-full bg-forest-700/90 border border-forest-600 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-emerald-300 fill-emerald-300/30" />
              </div>
              <h3 className="text-2xl font-bold leading-snug mb-3">
                {t('featureCardTitle')}
              </h3>
              <p className="text-xs text-forest-200/90 leading-relaxed mb-6">
                {t('featureCardDesc')}
              </p>
            </div>
            <Link
              to={user ? '/dashboard' : '/login'}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-forest-800 text-xs font-extrabold hover:bg-sage-100 transition-all shadow-md w-fit"
            >
              <span>{t('viewAllServices')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 6 Clean White Service Cards with Round Sage Icon Badges */}
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-[#e2ece5] shadow-organic hover:shadow-organic-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 mb-5 group-hover:bg-forest-800 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-forest-950 mb-2 group-hover:text-forest-800 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
                  <Link
                    to={user ? srv.link : '/login'}
                    className="w-8 h-8 rounded-full bg-sage-100 text-forest-800 flex items-center justify-center group-hover:bg-forest-800 group-hover:text-white transition-all shadow-sm"
                    title={srv.title}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CONTACT US SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sage-100 border border-sage-200 text-forest-800 text-xs font-bold mb-3">
            <Phone className="w-3.5 h-3.5 text-forest-800" />
            <span>{t('getInTouch')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
            {t('contactUs')}
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto mt-2.5">
            {t('contactSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: Direct Contact Channels */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-7 border border-[#e2ece5] shadow-organic flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-forest-950 mb-1">{t('getInTouch')}</h3>
              <p className="text-xs text-slate-400 mb-6">{t('chooseWay')}</p>

              <div className="space-y-5 text-xs">
                {/* Call Us */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-950">{t('callUs')}</p>
                    <p className="text-slate-600 font-semibold mt-0.5">{t('tollFreeNumber')}</p>
                    <p className="text-[11px] text-slate-400">{t('callHours')}</p>
                  </div>
                </div>

                {/* Email Us */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-950">{t('emailUs')}</p>
                    <p className="text-slate-600 font-semibold mt-0.5">{t('emailAddress')}</p>
                    <p className="text-[11px] text-slate-400">{t('emailReplyTime')}</p>
                  </div>
                </div>

                {/* Visit Us */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-950">{t('visitUs')}</p>
                    <p className="text-slate-600 font-semibold mt-0.5 leading-snug">
                      {t('visitAddress')}
                    </p>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-forest-950">{t('workingHours')}</p>
                    <p className="text-slate-600 font-medium mt-0.5">{t('callHours')}</p>
                    <p className="text-[11px] text-slate-400">{t('sunHours')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Send Us a Message Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#e2ece5] shadow-organic">
            <h3 className="font-extrabold text-lg text-forest-950 mb-1">{t('sendMessageForm')}</h3>
            <p className="text-xs text-slate-400 mb-6">{t('fillFormDesc')}</p>

            {formSubmitted ? (
              <div className="p-6 rounded-2xl bg-sage-100 border border-sage-200 text-center animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-forest-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-forest-950 text-sm">{t('msgSentSuccess')}</h4>
                <p className="text-xs text-slate-600 mt-1">
                  {t('msgSentDesc')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('fullNameLabel')}</label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      placeholder={t('fullNamePlaceholder')}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-800 placeholder-slate-400 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('phoneLabel')}</label>
                    <input
                      type="tel"
                      required
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleFormChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-800 placeholder-slate-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('emailLabel')}</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="farmer@example.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-800 placeholder-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('subjectLabel')}</label>
                  <input
                    type="text"
                    required
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    placeholder={t('subjectPlaceholder')}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-800 placeholder-slate-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('messageLabel')}</label>
                  <textarea
                    rows={3}
                    required
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder={t('messagePlaceholder')}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-forest-800 focus:ring-1 focus:ring-forest-800 focus:outline-none text-xs text-slate-800 placeholder-slate-400 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-forest-800/20 transition-all hover:scale-105"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t('sendMessageBtn')}</span>
                  </button>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <Lock className="w-3 h-3 text-forest-800" />
                    <span>{t('dataSafe')}</span>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Card 3: Visit Our Agricultural Center / Innovation Hub */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-[#e2ece5] shadow-organic flex flex-col justify-between">
            <div>
              {/* Photo of modern agricultural research center */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 shadow-sm group">
                <img
                  src="/assets/agri_center.jpg"
                  alt="Kisan Crop Guardian Telemetry Clinic and Research Center"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-forest-800/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                  <Sprout className="w-3 h-3 text-emerald-300" />
                  <span>{t('stateOfArtLab')}</span>
                </div>
              </div>

              <h3 className="font-extrabold text-base text-forest-950 mb-1">{t('visitClinicTitle')}</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                {t('visitClinicDesc')}
              </p>
            </div>

            <div>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-full bg-sage-100 hover:bg-forest-800 text-forest-800 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-sage-200 transition-all shadow-sm group"
              >
                <MapPin className="w-3.5 h-3.5 text-forest-800 group-hover:text-white transition-colors" />
                <span>{t('getDirections')}</span>
              </a>

              {/* Location Badge */}
              <div className="mt-3 p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span>{t('walkInDaily')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TRUST & QUALITY HIGHLIGHTS STRIP */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e2ece5] shadow-organic grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-950">{t('support247')}</p>
              <p className="text-[11px] text-slate-400">{t('anytimeHelp')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-950">{t('certifiedAgronomists')}</p>
              <p className="text-[11px] text-slate-400">{t('icarTeam')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-950">{t('dataProtection')}</p>
              <p className="text-[11px] text-slate-400">{t('cryptoSecurity')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-100 border border-sage-200 flex items-center justify-center text-forest-800 shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-forest-950">{t('compassionateCare')}</p>
              <p className="text-[11px] text-slate-400">{t('farmersFirst')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="bg-gradient-to-r from-sage-100/80 via-white to-sage-50 border border-sage-200 rounded-3xl p-6 sm:p-10 shadow-organic-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy & Actions */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-sage-200 text-forest-800 text-xs font-bold mb-4 shadow-sm">
                <Sprout className="w-3.5 h-3.5 text-forest-800" />
                <span>{t('cropOurPriority')}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight leading-tight">
                {t('ctaHeadline1')} <br className="hidden sm:block" />
                <span className="text-forest-800">{t('ctaHeadline2')}</span>
              </h2>

              <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                {t('ctaDesc')}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to={user ? '/consultations' : '/login'}
                  className="px-6 py-3 rounded-full bg-forest-800 hover:bg-forest-700 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-md shadow-forest-800/20 transition-all hover:scale-105"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{t('bookConsultation')}</span>
                </Link>

                <a
                  href="tel:18004192767"
                  className="px-5 py-3 rounded-full bg-white hover:bg-sage-100 text-forest-900 text-xs sm:text-sm font-bold border border-sage-300 flex items-center gap-2 shadow-sm transition-all"
                >
                  <Phone className="w-4 h-4 text-forest-800" />
                  <span>{t('callNowBtn')}</span>
                </a>
              </div>
            </div>

            {/* Right Photo with Floating Badge */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-organic-lg aspect-[16/10] relative group">
                <img
                  src="/assets/agronomist_consult.jpg"
                  alt="Agronomist specialist consulting smiling farmer with tablet"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>

                {/* Floating Happy Farmers badge */}
                <div className="absolute bottom-3.5 right-3.5 bg-forest-800/95 backdrop-blur-sm text-white px-3.5 py-2 rounded-2xl shadow-forest flex items-center gap-2.5 border border-forest-700/60">
                  <div className="w-7 h-7 rounded-full bg-forest-700 flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-tight leading-none">15,000+</p>
                    <p className="text-[10px] text-forest-200 leading-tight">{t('happyFarmers')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-forest-800 text-white pt-14 pb-8 border-t border-forest-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-forest-700/60">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-forest-700 border border-forest-600 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-white" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">{t('appTitle')}</span>
              </div>
              <p className="text-xs text-forest-200/90 max-w-sm leading-relaxed mb-4">
                {t('footerDesc')}
              </p>
              <div className="flex items-center gap-2 text-xs text-forest-300">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                <span>{t('footerNode')}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm text-white mb-4">{t('quickLinks')}</h4>
              <ul className="space-y-2.5 text-xs text-forest-200">
                <li><Link to="/" className="hover:text-white transition-colors">{t('home')}</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">{t('farmerCommandCenter')}</Link></li>
                <li><Link to="/disease-scanner" className="hover:text-white transition-colors">{t('aiLeafVisionScan')}</Link></li>
                <li><Link to="/crop-passport" className="hover:text-white transition-colors">{t('sha256CropPassport')}</Link></li>
                <li><Link to="/admin" className="hover:text-white transition-colors">{t('adminPortal')}</Link></li>
              </ul>
            </div>

            {/* Our Services */}
            <div>
              <h4 className="font-bold text-sm text-white mb-4">{t('ourServices')}</h4>
              <ul className="space-y-2.5 text-xs text-forest-200">
                <li><Link to="/disease-scanner" className="hover:text-white transition-colors">{t('computerVisionDiagnosis')}</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">{t('predictivePathogenRadar')}</Link></li>
                <li><Link to="/what-if-simulator" className="hover:text-white transition-colors">{t('profitCostSimulation')}</Link></li>
                <li><Link to="/consultations" className="hover:text-white transition-colors">{t('specialistTeleAdvisory')}</Link></li>
                <li><Link to="/farms-and-crops" className="hover:text-white transition-colors">{t('fieldHealthMapping')}</Link></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-bold text-sm text-white mb-4">{t('contactUs')}</h4>
              <ul className="space-y-2.5 text-xs text-forest-200">
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>{t('tollFreeNumber')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  <span>{t('emailAddress')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
                  <span>{t('visitAddress')}</span>
                </li>
                <li className="flex items-center gap-2 text-emerald-300 font-semibold pt-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>{t('openMonSat')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-forest-300">
            <p>{t('copyright')}</p>
            <div className="flex items-center gap-4">
              <span className="hover:text-white cursor-pointer transition-colors">{t('privacyPolicy')}</span>
              <span className="hover:text-white cursor-pointer transition-colors">{t('termsOfService')}</span>
              <span className="hover:text-white cursor-pointer transition-colors">{t('icarGuidelines')}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
