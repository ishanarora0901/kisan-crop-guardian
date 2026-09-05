import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import VoiceSpeaker from '../common/VoiceSpeaker';
import { Bug, Droplets, Flame, CloudRain, Skull, TrendingDown, AlertCircle } from 'lucide-react';

const RiskRadarCard = ({ prediction }) => {
  const { t, lang } = useLanguage();

  if (!prediction) return null;

  const riskVectors = [
    {
      label: t('diseaseRisk'),
      value: prediction.diseaseRisk || 72,
      icon: Skull,
      color: prediction.diseaseRisk > 70 ? 'bg-orange-600' : 'bg-forest-700',
      textColor: prediction.diseaseRisk > 70 ? 'text-orange-900' : 'text-forest-900',
      bgGlow: prediction.diseaseRisk > 70 ? 'bg-orange-50 border-orange-300' : 'bg-sage-50 border-sage-200',
    },
    {
      label: t('pestRisk'),
      value: prediction.pestRisk || 38,
      icon: Bug,
      color: prediction.pestRisk > 60 ? 'bg-amber-600' : 'bg-forest-700',
      textColor: prediction.pestRisk > 60 ? 'text-amber-900' : 'text-forest-900',
      bgGlow: prediction.pestRisk > 60 ? 'bg-amber-50 border-amber-300' : 'bg-sage-50 border-sage-200',
    },
    {
      label: t('waterStressRisk'),
      value: prediction.waterStressRisk || 21,
      icon: Droplets,
      color: prediction.waterStressRisk > 60 ? 'bg-amber-600' : 'bg-teal-600',
      textColor: prediction.waterStressRisk > 60 ? 'text-amber-900' : 'text-teal-900',
      bgGlow: 'bg-sage-50 border-sage-200',
    },
    {
      label: t('rainfallRisk'),
      value: prediction.heavyRainfallRisk || 67,
      icon: CloudRain,
      color: prediction.heavyRainfallRisk > 65 ? 'bg-blue-600' : 'bg-forest-700',
      textColor: 'text-blue-900',
      bgGlow: prediction.heavyRainfallRisk > 65 ? 'bg-blue-50 border-blue-300' : 'bg-sage-50 border-sage-200',
    },
    {
      label: t('heatStressRisk'),
      value: prediction.heatStressRisk || 54,
      icon: Flame,
      color: prediction.heatStressRisk > 60 ? 'bg-rose-600' : 'bg-amber-600',
      textColor: 'text-amber-900',
      bgGlow: 'bg-sage-50 border-sage-200',
    },
    {
      label: t('expectedYieldLoss'),
      value: prediction.expectedYieldLossRisk || 31,
      icon: TrendingDown,
      color: prediction.expectedYieldLossRisk > 50 ? 'bg-red-600' : 'bg-amber-600',
      textColor: 'text-rose-900',
      bgGlow: 'bg-rose-50 border-rose-200',
    },
  ];

  const localizedAction =
    lang === 'pa'
      ? 'ਕਣਕ ਦੇ ਪੱਤਿਆਂ ’ਤੇ ਪੀਲੀ ਕੁੰਗੀ ਦੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਤੁਰੰਤ ਬਾਇਓ-ਫ਼ੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।'
      : lang === 'hi'
      ? 'गेहूं की पत्तियों पर पीले रतुए के शुरुआती लक्षणों की जांच करें और समय पर बायो-फंगीसाइड का छिड़काव करें।'
      : prediction.recommendedAction ||
        'Inspect wheat foliage for early yellow rust pustules and apply prophylactic bio-fungicide.';

  const localizedTimeWindow =
    lang === 'pa'
      ? 'ਅਗਲੇ 3 ਤੋਂ 5 ਦਿਨ'
      : lang === 'hi'
      ? 'अगले 3 से 5 दिन'
      : prediction.expectedTimeWindow || 'Next 3-5 days';

  return (
    <div className="glass-panel p-6 rounded-2xl border border-sage-200 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-black text-base text-forest-950">
            {lang === 'pa'
              ? 'ਏਆਈ ਜੋਖਮ ਵੈਕਟਰ ਵਿਸ਼ਲੇਸ਼ਣ'
              : lang === 'hi'
              ? 'एआई जोखिम वेक्टर विश्लेषण'
              : 'Proactive Risk Vector Intelligence'}
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            {lang === 'pa'
              ? 'ਮਿੱਟੀ, ਨਮੀ, ਫ਼ਸਲ ਦੀ ਉਮਰ ਅਤੇ ਬੀਜਾਣੂਆਂ ਦਾ ਏਆਈ ਵਿਸ਼ਲੇਸ਼ਣ'
              : lang === 'hi'
              ? 'मिट्टी, नमी, फसल की आयु और बीजाणुओं का एआई विश्लेषण'
              : 'AI analysis of soil, humidity, crop age, and spore reservoirs'}
          </p>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-forest-900 border border-emerald-300">
          6 Vectors Analyzed
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {riskVectors.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`p-3.5 rounded-xl border transition-all ${item.bgGlow}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${item.textColor}`} />
                  <span className="text-xs font-bold text-slate-800">{item.label}</span>
                </div>
                <span className={`text-sm font-black ${item.textColor}`}>{item.value}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contributing Factors & Action Box */}
      {prediction.recommendedAction && (
        <div className="mt-5 p-4 rounded-2xl bg-forest-900 border border-forest-800 text-white shadow-md">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 text-emerald-300 font-black">
              <AlertCircle className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'pa'
                  ? 'ਏਆਈ ਸਿਫ਼ਾਰਸ਼ੀ ਬਚਾਅ ਉਪਾਅ'
                  : lang === 'hi'
                  ? 'एआई अनुशंसित सुरक्षात्मक सावधानी'
                  : 'AI Recommended Proactive Precaution'}{' '}
                ({localizedTimeWindow})
              </span>
            </div>
            <VoiceSpeaker text={localizedAction} label={t('voiceListen')} />
          </div>
          <p className="text-emerald-50 leading-relaxed font-medium text-xs mt-1">{localizedAction}</p>
        </div>
      )}
    </div>
  );
};

export default RiskRadarCard;
