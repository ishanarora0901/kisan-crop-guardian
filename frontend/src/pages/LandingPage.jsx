import React from 'react';
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
  Sun,
  Flame,
} from 'lucide-react';

const LandingPage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const steps = [
    {
      step: '01',
      title: 'DETECT',
      desc: 'AI Vision Leaf Scanner analyzes plant lesions, rusts, and blights instantly from mobile photos.',
      icon: ScanEye,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    },
    {
      step: '02',
      title: 'PREDICT',
      desc: 'Proactive models calculate Disease, Pest, and Weather stress probabilities before symptoms emerge.',
      icon: Brain,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      step: '03',
      title: 'PREVENT',
      desc: 'Farmers receive actionable early-warning alerts with specific bio-protection steps and spray timeframes.',
      icon: Activity,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      step: '04',
      title: 'OPTIMIZE',
      desc: 'Historical intelligence and What-If simulation optimize input costs and maximize expected harvest profit.',
      icon: TrendingUp,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      step: '05',
      title: 'VERIFY',
      desc: 'Tamper-resistant SHA-256 Blockchain Crop Passport certifies farming practices for buyers & insurers.',
      icon: ShieldCheck,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
    {
      step: '06',
      title: 'CONSULT',
      desc: 'Connect directly with certified ICAR Agricultural Specialists for official prescriptions and advisory.',
      icon: Stethoscope,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-emerald-600/15 via-emerald-950/5 to-transparent pointer-events-none blur-3xl"></div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>PROACTIVE AGRICULTURAL DECISION SUPPORT PLATFORM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Don’t wait for crop damage. <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Predict Risks Early.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Move from reactive farming to data-driven agriculture. Combine <strong>AI Risk Prediction</strong>,{' '}
          <strong>Live Microclimate Telemetry</strong>, <strong>Computer Vision Disease Diagnostics</strong>, and{' '}
          <strong>Blockchain Passports</strong> to boost crop health and maximize net profit.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to={user ? '/dashboard' : '/login'}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <span>{user ? 'Enter Farmer Command Center' : 'Launch Live Platform Demo'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/admin"
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-sm sm:text-base border border-slate-700/80 transition-colors"
          >
            Access Admin Portal (/admin)
          </Link>
        </div>

        {/* 1-Click Persona Login Banner */}
        <div className="mt-12 max-w-4xl mx-auto text-left">
          <QuickLoginBanner />
        </div>
      </section>

      {/* 6-Pillar Philosophy Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">Core Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            The Proactive Decision-Support Loop
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto mt-2">
            Engineered to intervene before pathogens colonize and weather swings reduce farm margins.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl glass-panel hover:border-emerald-500/40 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-700/80 font-mono">{item.step}</span>
                </div>
                <h3 className="font-extrabold text-lg text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Proof Comparison Card */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="glass-panel-glow p-8 sm:p-10 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-400">
                Multi-Season Intelligence
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-4">
                Last Season vs Current Season AI Estimate
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                By comparing current microclimate moisture indexes with historical disease records, AI Crop Guardian
                identifies cost leaks and projects a potential <strong>+₹15,000 profit improvement</strong> for active
                wheat acreage.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <p className="text-xs text-slate-400 font-medium">Last Season Net Profit</p>
                  <p className="text-xl font-bold text-slate-300 mt-1">₹40,000</p>
                  <span className="text-[10px] text-rose-400 font-semibold">12% Yield Loss from Rust</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                  <p className="text-xs text-emerald-400 font-medium">AI Estimated Net Profit</p>
                  <p className="text-xl font-bold text-emerald-300 mt-1">₹55,000</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">+₹15,000 Projected</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-80 shrink-0 text-center">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl">
                <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-extrabold text-base text-white">Blockchain Crop Passport</h4>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  Every planting, soil test, AI risk alert, and specialist diagnosis is cryptographically chained with SHA-256.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors w-full justify-center"
                >
                  <span>Explore Demo Records</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 AI Crop Guardian. Built for precision agriculture, farmer prosperity, and food security.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
