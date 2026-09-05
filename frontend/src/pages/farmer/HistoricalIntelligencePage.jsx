import React, { useState, useEffect } from 'react';
import { getHistoricalSeasonsApi, getAlertsApi } from '../../services/api';
import VoiceSpeaker from '../../components/common/VoiceSpeaker';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  History,
  AlertTriangle,
  Calendar,
  Layers,
  TrendingUp,
  ShieldAlert,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const HistoricalIntelligencePage = () => {
  const { lang, t } = useLanguage();
  const [seasons, setSeasons] = useState([]);
  const [historicalAlerts, setHistoricalAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [seasonsRes, alertsRes] = await Promise.all([
          getHistoricalSeasonsApi(),
          getAlertsApi(),
        ]);

        setSeasons(seasonsRes.data.records || []);
        const histOnly = (alertsRes.data.alerts || []).filter(
          (a) => a.alertType === 'HISTORICAL_RISK_ALERT'
        );
        setHistoricalAlerts(histOnly);
      } catch (err) {
        console.error('Error loading historical intelligence:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-black text-amber-900 tracking-wider">
            Multi-Season Farm Memory
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold">
            Agronomic Pattern Matcher
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">Historical Crop Intelligence</h1>
        <p className="text-xs text-slate-600 mt-1 max-w-2xl font-medium">
          The AI engine cross-references real-time field microclimate metrics against multi-season logs to detect
          disease recurrence patterns before outbreaks become uncontrollable.
        </p>
      </div>

      {/* ACTIVE HISTORICAL PATTERN ALERT */}
      {historicalAlerts.length > 0 ? (
        <div className="p-6 rounded-3xl bg-amber-50/90 border-2 border-amber-300 shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-200/60 text-amber-900">
                <AlertTriangle className="w-6 h-6 text-amber-800" />
              </div>
              <div>
                <h3 className="font-black text-base text-amber-950">
                  {historicalAlerts[0]?.title || (
                    lang === 'pa'
                      ? '⚠️ ਇਤਿਹਾਸਕ ਖ਼ਤਰਾ ਚਿਤਾਵਨੀ: ਪਿਛਲੇ ਸੀਜ਼ਨ ਦਾ ਦੁਹਰਾਅ'
                      : lang === 'hi'
                      ? '⚠️ ऐतिहासिक जोखिम चेतावनी: पिछले सीजन की पुनरावृत्ति'
                      : '⚠️ HISTORICAL RISK ALERT: Recurrent Pattern Detected'
                  )}
                </h3>
                <p className="text-xs text-amber-900 font-bold">
                  {historicalAlerts[0]?.estimatedRiskPercentage
                    ? `${lang === 'pa' ? 'ਅਨੁਮਾਨਿਤ ਖ਼ਤਰਾ' : lang === 'hi' ? 'अनुमानित जोखिम' : 'Estimated Recurrence Risk'}: ${historicalAlerts[0].estimatedRiskPercentage}%`
                    : (lang === 'pa' ? 'ਇਤਿਹਾਸਕ ਮੇਲ ਮਿਲਿਆ' : lang === 'hi' ? 'ऐतिहासिक मिलान पाया गया' : 'Historical Agronomic Match Detected')}
                </p>
              </div>
            </div>
            {historicalAlerts[0]?.message && (
              <VoiceSpeaker
                text={historicalAlerts[0].message}
                label={t('voiceListen')}
              />
            )}
          </div>

          <p className="text-xs sm:text-sm text-amber-950 font-semibold leading-relaxed mb-4">
            "{historicalAlerts[0]?.message}"
          </p>

          {(historicalAlerts[0]?.contributingFactors?.length > 0 || historicalAlerts[0]?.recommendedPrecaution) && (
            <div className="p-4 rounded-2xl bg-white border border-amber-200 text-xs text-slate-800 space-y-1.5 shadow-sm">
              <span className="font-black text-amber-900 uppercase tracking-wider block mb-1">
                {lang === 'pa' ? 'ਇਤਿਹਾਸਕ ਤੱਥ ਤੇ ਕਾਰਨ:' : lang === 'hi' ? 'ऐतिहासिक तथ्य व कारण:' : 'Historical Corroboration Details:'}
              </span>
              {historicalAlerts[0]?.contributingFactors?.map((factor, fIdx) => (
                <p key={fIdx} className="font-medium">• {factor}</p>
              ))}
              {historicalAlerts[0]?.recommendedPrecaution && (
                <p className="font-bold text-forest-900 pt-1">
                  • {lang === 'pa' ? 'ਸਿਫਾਰਸ਼ ਕੀਤੀ ਕਾਰਵਾਈ: ' : lang === 'hi' ? 'अनुशंसित कदम: ' : 'Recommended Action: '}
                  {historicalAlerts[0].recommendedPrecaution}
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
            <Sparkles className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-black text-sm text-emerald-950">
              {lang === 'pa'
                ? 'ਕੋਈ ਸਰਗਰਮ ਇਤਿਹਾਸਕ ਬਿਮਾਰੀ ਖ਼ਤਰਾ ਨਹੀਂ'
                : lang === 'hi'
                ? 'कोई सक्रिय ऐतिहासिक बीमारी जोखिम नहीं'
                : 'No Active Historical Disease Recurrence Detected'}
            </h3>
            <p className="text-xs text-emerald-800 font-medium mt-0.5">
              {lang === 'pa'
                ? 'ਜਦੋਂ ਤੁਸੀਂ ਫ਼ਸਲ ਰਜਿਸਟਰ ਕਰਦੇ ਸਮੇਂ ਪਿਛਲੇ ਸੀਜ਼ਨ ਦੇ ਰਿਕਾਰਡ ਦਰਜ ਕਰਦੇ ਹੋ, ਤਾਂ ਸਿਸਟਮ ਮੌਸਮ ਨਾਲ ਮਿਲਾ ਕੇ ਚਿਤਾਵਨੀ ਦਿੰਦਾ ਹੈ।'
                : lang === 'hi'
                ? 'जब आप फसल दर्ज करते समय पिछले सीजन के रिकॉर्ड भरते हैं, तो सिस्टम मौसम के अनुसार मिलान करके चेतावनी देता है।'
                : 'Proactive warnings activate when real-time microclimate metrics match past disease outbreaks recorded during crop cycle registration.'}
            </p>
          </div>
        </div>
      )}

      {/* MULTI-SEASON TIMELINE */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-forest-800" />
          <h2 className="font-black text-lg text-forest-950">
            {lang === 'pa' ? 'ਇਤਿਹਾਸਕ ਸੀਜ਼ਨ ਰਿਕਾਰਡ' : lang === 'hi' ? 'ऐतिहासिक सीजन रिकॉर्ड' : 'Historical Season Records'} ({seasons.length})
          </h2>
        </div>

        {seasons.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="font-black text-slate-800 text-sm">
              {lang === 'pa'
                ? 'ਕੋਈ ਪਿਛਲਾ ਸੀਜ਼ਨ ਰਿਕਾਰਡ ਦਰਜ ਨਹੀਂ ਹੈ'
                : lang === 'hi'
                ? 'कोई पिछला सीजन रिकॉर्ड दर्ज नहीं है'
                : 'No Past Season Records Logged Yet'}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 font-medium">
              {lang === 'pa'
                ? 'ਖੇਤ ਡੈਸ਼ਬੋਰਡ ਵਿੱਚ ਨਵਾਂ ਚੱਕਰ ਦਰਜ ਕਰੋ ਅਤੇ ਪਿਛਲੇ ਸੀਜ਼ਨ ਦੀ ਪੈਦਾਵਾਰ, ਮੁਨਾਫ਼ਾ ਅਤੇ ਬਿਮਾਰੀਆਂ ਖ਼ੁਦ ਟਾਈਪ ਕਰੋ।'
                : lang === 'hi'
                ? 'खेत डैशबोर्ड में नया चक्र पंजीकृत करें और पिछले सीजन की उपज, लाभ व रोग स्वयं टाइप करें।'
                : 'Register a new crop cycle in Farms & Crops and type your past season yield, profit, and diseases to log genuine historical baseline data.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {seasons.map((season, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl relative border border-sage-200 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-sage-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Season Record</span>
                    <h3 className="font-black text-base text-forest-950">{season.seasonName}</h3>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      season.isCurrentEstimate
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}
                  >
                    {season.isCurrentEstimate ? 'AI Projection' : 'Farmer Recorded Actual'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
                  <div className="p-2.5 rounded-xl bg-sage-50 border border-sage-200">
                    <span className="text-slate-600 font-bold block text-[11px]">Harvest Yield</span>
                    <span className="font-black text-forest-950 text-sm">{season.totalYieldQuintals} Quintals</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sage-50 border border-sage-200">
                    <span className="text-slate-600 font-bold block text-[11px]">Total Revenue</span>
                    <span className="font-black text-forest-950 text-sm">₹{season.totalRevenue?.toLocaleString()}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sage-50 border border-sage-200">
                    <span className="text-slate-600 font-bold block text-[11px]">Net Profit</span>
                    <span className="font-black text-emerald-900 text-sm">₹{season.netProfit?.toLocaleString()}</span>
                  </div>
                </div>

                {season.primaryDiseaseOrIssue && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-slate-800">
                    <span className="text-slate-600 font-bold">Pathological History: </span>
                    <strong className="text-rose-800 font-black">{season.primaryDiseaseOrIssue}</strong>
                    {season.yieldLossPercentage > 0 && (
                      <span className="text-slate-600 font-semibold"> (Yield loss: {season.yieldLossPercentage}%)</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoricalIntelligencePage;
