import React from 'react';
import { AlertCircle, AlertTriangle, CloudRain, History, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import VoiceSpeaker from '../common/VoiceSpeaker';

const AlertBanner = ({ alert, onResolve }) => {
  const { t, lang } = useLanguage();

  if (!alert) return null;

  // Localize alert content based on active language (Punjabi / Hindi / English)
  const getLocalizedAlert = (alertData, currentLang) => {
    if (!alertData || currentLang === 'en') return alertData;

    const isRustAlert =
      alertData.alertType === 'HIGH_RISK_ALERT' ||
      alertData._id === 'alert_01' ||
      alertData.title?.toLowerCase().includes('rust') ||
      alertData.title?.toLowerCase().includes('fungal');

    const isHistAlert =
      alertData.alertType === 'HISTORICAL_RISK_ALERT' ||
      alertData._id === 'alert_02' ||
      alertData.title?.toLowerCase().includes('historical');

    const isWeatherAlert =
      alertData.alertType === 'WEATHER_ANOMALY_ALERT' ||
      alertData._id === 'alert_03' ||
      alertData.title?.toLowerCase().includes('rainfall') ||
      alertData.title?.toLowerCase().includes('waterlogging');

    if (isRustAlert) {
      if (currentLang === 'pa') {
        return {
          ...alertData,
          title: '🚨 ਉੱਚ ਖ਼ਤਰਾ ਚਿਤਾਵਨੀ: ਉੱਲੀ ਅਤੇ ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਖ਼ਤਰਾ',
          message:
            'ਤੁਹਾਡੀ ਕਣਕ ਦੀ ਫ਼ਸਲ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਦਿਨਾਂ ਦੌਰਾਨ ਉੱਲੀ ਰੋਗ ਦਾ ਖ਼ਤਰਾ ਵੱਧ ਸਕਦਾ ਹੈ।',
          recommendedPrecaution:
            'ਫ਼ਸਲ ਵਿੱਚ ਪੀਲੀ ਕੁੰਗੀ ਦੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਸਮੇਂ ਸਿਰ ਸਿਫ਼ਾਰਸ਼ੀ ਬਾਇਓ-ਫ਼ੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।',
          expectedTimeWindow: 'ਅਗਲੇ 48 ਤੋਂ 72 ਘੰਟੇ',
          contributingFactors: [
            'ਖੇਤ ਮੌਸਮ ਵਿੱਚ 82% ਤੋਂ ਵੱਧ ਉੱਚ ਨਮੀ ਦਰਜ ਕੀਤੀ ਗਈ',
            'ਹਾਲ ਹੀ ਵਿੱਚ ਹੋਈ ਹਲਕੀ ਬਾਰਿਸ਼ ਕਾਰਨ ਪੱਤਿਆਂ ’ਤੇ ਨਮੀ ਬਣੀ ਹੋਈ ਹੈ',
            'ਮੌਜੂਦਾ 22-27°C ਤਾਪਮਾਨ ਉੱਲੀ ਫੈਲਣ ਲਈ ਅਨੁਕੂਲ ਹੈ',
            'ਇਸ ਖੇਤ ਵਿੱਚ ਪਿਛਲੇ ਹਾੜ੍ਹੀ ਸੀਜ਼ਨ ਦੌਰਾਨ ਵੀ ਉੱਲੀ ਰੋਗ ਦਰਜ ਕੀਤਾ ਗਿਆ ਸੀ',
          ],
        };
      }
      if (currentLang === 'hi') {
        return {
          ...alertData,
          title: '🚨 उच्च जोखिम चेतावनी: फंगल रतुआ का बढ़ा हुआ खतरा',
          message:
            'आपकी गेहूं की फसल में आने वाले दिनों में फंगल रोग का खतरा बढ़ सकता है।',
          recommendedPrecaution:
            'फसल में पीले रतुए के शुरुआती लक्षणों की जांच करें और समय पर अनुशंसित बायो-फंगीसाइड का छिड़काव करें।',
          expectedTimeWindow: 'अगले 48 से 72 घंटे',
          contributingFactors: [
            'खेत के सूक्ष्म जलवायु में 82% से अधिक उच्च नमी दर्ज की गई',
            'हाल ही में हुई हल्की बारिश से पत्तियों पर नमी बनी हुई है',
            'वर्तमान 22-27°C तापमान रतुआ बीजाणुओं के लिए अनुकूल है',
            'इस खेत में पिछले रबी चक्र के दौरान भी फंगल रोग दर्ज था',
          ],
        };
      }
    }

    if (isHistAlert) {
      if (currentLang === 'pa') {
        return {
          ...alertData,
          title: '⚠️ ਇਤਿਹਾਸਕ ਖ਼ਤਰਾ ਚਿਤਾਵਨੀ: ਪਿਛਲੇ ਸੀਜ਼ਨ ਵਰਗੀ ਬਿਮਾਰੀ ਦਾ ਖ਼ਤਰਾ',
          message:
            'ਪਿਛਲੇ ਸੀਜ਼ਨ ਵਿੱਚ ਤੁਹਾਡੀ ਕਣਕ ਦੀ ਫ਼ਸਲ ਵਿੱਚ ਇਸੇ ਮੌਸਮ ਵਿੱਚ ਉੱਲੀ ਰੋਗ ਆਇਆ ਸੀ। ਮੌਜੂਦਾ ਮੌਸਮੀ ਹਾਲਾਤ ਵੀ ਉਸੇ ਤਰ੍ਹਾਂ ਦੇ ਹਨ।',
          recommendedPrecaution:
            'ਫ਼ਸਲ ਦੀ ਰੋਜ਼ਾਨਾ ਸਵੇਰੇ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਤੁਰੰਤ ਬਚਾਅ ਲਈ ਬਾਇਓ-ਫ਼ੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।',
          expectedTimeWindow: 'ਅਗਲੇ 3 ਤੋਂ 7 ਦਿਨ',
          contributingFactors: [
            'ਪਿਛਲੇ ਸੀਜ਼ਨ ਦਾ ਪ੍ਰਭਾਵ: ਉੱਲੀ ਰੋਗ ਕਾਰਨ 12% ਝਾੜ ਦਾ ਨੁਕਸਾਨ ਹੋਇਆ ਸੀ',
            'ਮੌਜੂਦਾ ਨਮੀ ਇੰਡੈਕਸ ਪਿਛਲੇ ਸੀਜ਼ਨ ਦੇ 12ਵੇਂ ਹਫ਼ਤੇ ਦੇ 92% ਸਮਾਨ ਹੈ',
          ],
        };
      }
      if (currentLang === 'hi') {
        return {
          ...alertData,
          title: '⚠️ ऐतिहासिक जोखिम चेतावनी: पिछले सीजन जैसी बीमारी की पुनरावृत्ति',
          message:
            'पिछले सीजन में आपकी गेहूं की फसल में समान मौसम में फंगल रोग देखा गया था। वर्तमान मौसमी परिस्थितियां भी उसी पैटर्न को दर्शाती हैं।',
          recommendedPrecaution:
            'फसल की प्रतिदिन सुबह निगरानी करें और सुरक्षात्मक बायो-फंगीसाइड का छिड़काव करें।',
          expectedTimeWindow: 'अगले 3 से 7 दिन',
          contributingFactors: [
            'पिछले सीजन का प्रभाव: फंगल रतुए से 12% उपज हानि और ₹40,000 का नुकसान हुआ था',
            'वर्तमान नमी सूचकांक पिछले सीजन के 12वें सप्ताह के 92% समान है',
          ],
        };
      }
    }

    if (isWeatherAlert) {
      if (currentLang === 'pa') {
        return {
          ...alertData,
          title: '🌧️ ਭਾਰੀ ਮੀਂਹ ਅਤੇ ਪਾਣੀ ਭਰਨ ਦੀ ਚੇਤਾਵਨੀ',
          message:
            'ਮੌਸਮ ਮਾਡਲ ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਪੈਣ ਦੀ 67% ਸੰਭਾਵਨਾ ਦਰਸਾਉਂਦੇ ਹਨ।',
          recommendedPrecaution:
            'ਜੜ੍ਹਾਂ ਨੂੰ ਗਲਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਖੇਤ ਦੀਆਂ ਪਾਣੀ ਨਿਕਾਸੀ ਨਾਲੀਆਂ ਨੂੰ ਤੁਰੰਤ ਸਾਫ਼ ਕਰੋ।',
          expectedTimeWindow: 'ਅਗਲੇ 48 ਘੰਟੇ',
          contributingFactors: ['ਉੱਤਰੀ ਮੈਦਾਨੀ ਇਲਾਕਿਆਂ ਵਿੱਚ ਘੱਟ ਦਬਾਅ ਵਾਲਾ ਖੇਤਰ ਬਣਿਆ ਹੋਇਆ ਹੈ'],
        };
      }
      if (currentLang === 'hi') {
        return {
          ...alertData,
          title: '🌧️ भारी वर्षा एवं जलभराव की चेतावनी',
          message:
            'मौसम मॉडल अगले 48 घंटों में भारी बारिश की 67% संभावना दर्शाते हैं।',
          recommendedPrecaution:
            'जड़ों को सड़ांध से बचाने के लिए खेत की जल निकासी नालियों को तुरंत साफ रखें।',
          expectedTimeWindow: 'अगले 48 घंटे',
          contributingFactors: ['उत्तरी मैदानी इलाकों में कम दबाव का क्षेत्र बना हुआ है'],
        };
      }
    }

    return alertData;
  };

  const currentAlert = getLocalizedAlert(alert, lang);
  const isHistorical = currentAlert.alertType === 'HISTORICAL_RISK_ALERT';
  const isHighRisk = currentAlert.severity === 'HIGH' || currentAlert.severity === 'CRITICAL';

  // Build clean localized spoken text for the audio voice reader
  const cleanTitle = currentAlert.title.replace(/[🚨⚠️🌧️]/g, '').trim();
  const speechText =
    lang === 'pa'
      ? `ਚੇਤਾਵਨੀ: ${cleanTitle}। ਸਮੱਸਿਆ: ${currentAlert.message}। ਸਿਫ਼ਾਰਸ਼ੀ ਬਚਾਅ ਉਪਾਅ: ${currentAlert.recommendedPrecaution}`
      : lang === 'hi'
      ? `चेतावनी: ${cleanTitle}। समस्या: ${currentAlert.message}। अनुशंसित सावधानी: ${currentAlert.recommendedPrecaution}`
      : `${cleanTitle}. ${currentAlert.message}. Recommended Precaution: ${currentAlert.recommendedPrecaution}`;

  return (
    <div
      className={`p-5 rounded-2xl border transition-all mb-4 ${
        isHistorical
          ? 'bg-amber-50/95 border-2 border-amber-300 text-amber-950 shadow-sm'
          : isHighRisk
          ? 'bg-rose-50/95 border-2 border-rose-300 text-rose-950 shadow-sm'
          : 'bg-blue-50/95 border-2 border-blue-300 text-blue-950 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          {isHistorical ? (
            <div className="p-2 rounded-xl bg-amber-200/80 text-amber-900">
              <History className="w-5 h-5 text-amber-800" />
            </div>
          ) : isHighRisk ? (
            <div className="p-2 rounded-xl bg-rose-200/80 text-rose-900 animate-pulse">
              <AlertCircle className="w-5 h-5 text-rose-800" />
            </div>
          ) : (
            <div className="p-2 rounded-xl bg-blue-200/80 text-blue-900">
              <CloudRain className="w-5 h-5 text-blue-800" />
            </div>
          )}

          <div>
            <h4 className="font-black text-sm sm:text-base text-slate-900">{currentAlert.title}</h4>
            <p className="text-xs text-slate-600 font-medium">
              Estimated Risk: <span className="font-black text-amber-900">{currentAlert.estimatedRiskPercentage}%</span> · Window: <span className="text-slate-800 font-bold">{currentAlert.expectedTimeWindow}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <VoiceSpeaker text={speechText} label={t('voiceListen')} />
          {onResolve && !currentAlert.isResolved && (
            <button
              onClick={() => onResolve(currentAlert._id)}
              className="px-3 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm transition-colors"
            >
              {t('acknowledge')}
            </button>
          )}
        </div>
      </div>

      <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed mb-3">{currentAlert.message}</p>

      {/* Contributing Factors Bullet List */}
      {currentAlert.contributingFactors && currentAlert.contributingFactors.length > 0 && (
        <div className="mb-3 p-3 rounded-xl bg-white/90 border border-slate-200 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-600 mb-1.5">
            {t('possibleFactors')}
          </p>
          <ul className="space-y-1">
            {currentAlert.contributingFactors.map((factor, idx) => (
              <li key={idx} className="text-xs text-slate-700 font-medium flex items-start gap-2">
                <span className="text-forest-800 font-bold">•</span>
                <span>{factor}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Precaution Banner */}
      <div className="p-3.5 rounded-xl bg-forest-900 border border-forest-800 text-white shadow-md text-xs">
        <p className="font-black text-emerald-300 mb-0.5">{t('recommendedPrecautionLabel')}</p>
        <p className="text-emerald-50 leading-relaxed font-medium">{currentAlert.recommendedPrecaution}</p>
      </div>
    </div>
  );
};

export default AlertBanner;
