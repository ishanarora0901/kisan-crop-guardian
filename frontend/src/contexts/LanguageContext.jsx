import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const AVAILABLE_LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🌾' },
];

const localizeSpeechText = (text, targetLang) => {
  if (!text || targetLang === 'en') return text;

  let localized = text;

  if (targetLang === 'pa') {
    localized = localized
      .replace(/🚨|⚠️|🌧️/g, '')
      .replace(/HIGH RISK ALERT/gi, 'ਉੱਚ ਖ਼ਤਰਾ ਚਿਤਾਵਨੀ')
      .replace(/HISTORICAL RISK ALERT/gi, 'ਇਤਿਹਾਸਕ ਖ਼ਤਰਾ ਚਿਤਾਵਨੀ')
      .replace(/WEATHER ANOMALY ALERT/gi, 'ਮੌਸਮ ਚਿਤਾਵਨੀ')
      .replace(/Weather-Disease Recurrence Detected/gi, 'ਮੌਸਮ ਅਤੇ ਬਿਮਾਰੀ ਦਾ ਦੁਹਰਾਅ')
      .replace(/Increased Fungal Rust Threat/gi, 'ਉੱਲੀ ਅਤੇ ਪੀਲੀ ਕੁੰਗੀ ਦਾ ਵਧਿਆ ਹੋਇਆ ਖ਼ਤਰਾ')
      .replace(/Heavy Rainfall & Waterlogging Alert/gi, 'ਭਾਰੀ ਮੀਂਹ ਅਤੇ ਪਾਣੀ ਭਰਨ ਦੀ ਚੇਤਾਵਨੀ')
      .replace(/Your wheat crop may face an increased risk of fungal disease in the coming days\./gi, 'ਤੁਹਾਡੀ ਕਣਕ ਦੀ ਫ਼ਸਲ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਦਿਨਾਂ ਦੌਰਾਨ ਉੱਲੀ ਰੋਗ ਦਾ ਖ਼ਤਰਾ ਵੱਧ ਸਕਦਾ ਹੈ।')
      .replace(/Inspect the crop for early yellow pustule symptoms and follow locally appropriate preventive agricultural practices\./gi, 'ਫ਼ਸਲ ਵਿੱਚ ਪੀਲੀ ਕੁੰਗੀ ਦੇ ਲੱਛਣਾਂ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਸਮੇਂ ਸਿਰ ਸਿਫ਼ਾਰਸ਼ੀ ਬਾਇਓ-ਫ਼ੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।')
      .replace(/Last season, your wheat crop experienced a fungal disease under similar weather conditions\. Current environmental conditions show a similar pattern\./gi, 'ਪਿਛਲੇ ਸੀਜ਼ਨ ਵਿੱਚ ਤੁਹਾਡੀ ਕਣਕ ਦੀ ਫ਼ਸਲ ਵਿੱਚ ਇਸੇ ਮੌਸਮ ਵਿੱਚ ਉੱਲੀ ਰੋਗ ਆਇਆ ਸੀ। ਮੌਜੂਦਾ ਮੌਸਮੀ ਹਾਲਾਤ ਵੀ ਉਸੇ ਤਰ੍ਹਾਂ ਦੇ ਹਨ।')
      .replace(/Increase crop monitoring frequency to daily morning scouting and initiate preventive bio-fungicide\./gi, 'ਫ਼ਸਲ ਦੀ ਰੋਜ਼ਾਨਾ ਸਵੇਰੇ ਨਿਗਰਾਨੀ ਕਰੋ ਅਤੇ ਤੁਰੰਤ ਬਚਾਅ ਲਈ ਬਾਇਓ-ਫ਼ੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।')
      .replace(/Forecast models indicate a 67% probability of heavy precipitation within 48 hours\./gi, 'ਮੌਸਮ ਮਾਡਲ ਅਗਲੇ 48 ਘੰਟਿਆਂ ਵਿੱਚ ਭਾਰੀ ਮੀਂਹ ਪੈਣ ਦੀ 67 ਪ੍ਰਤੀਸ਼ਤ ਸੰਭਾਵਨਾ ਦਰਸਾਉਂਦੇ ਹਨ।')
      .replace(/Ensure field perimeter drainage ditches are unblocked to avoid root asphyxiation\./gi, 'ਜੜ੍ਹਾਂ ਨੂੰ ਗਲਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਖੇਤ ਦੀਆਂ ਪਾਣੀ ਨਿਕਾਸੀ ਨਾਲੀਆਂ ਨੂੰ ਤੁਰੰਤ ਸਾਫ਼ ਕਰੋ।')
      .replace(/Yellow Rust \(Puccinia striiformis\) Early Spore Germination/gi, 'ਪੀਲੀ ਕੁੰਗੀ ਦੇ ਸ਼ੁਰੂਆਤੀ ਬੀਜਾਣੂ ਪੁੰਗਰਨ ਦਾ ਖ਼ਤਰਾ')
      .replace(/Yellow Rust/gi, 'ਪੀਲੀ ਕੁੰਗੀ')
      .replace(/Heavy Rainfall & High Foliar Humidity Advisory/gi, 'ਭਾਰੀ ਮੀਂਹ ਅਤੇ ਪੱਤਿਆਂ ਵਿੱਚ ਨਮੀ ਦੀ ਚੇਤਾਵਨੀ')
      .replace(/Inspect wheat foliage for early yellow rust pustules and apply prophylactic bio-fungicide\./gi, 'ਕਣਕ ਦੇ ਪੱਤਿਆਂ ’ਤੇ ਪੀਲੀ ਕੁੰਗੀ ਦੀ ਜਾਂਚ ਕਰੋ ਅਤੇ ਤੁਰੰਤ ਬਾਇਓ-ਫ਼ੰਗੀਸਾਈਡ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।')
      .replace(/Recommended Precaution:/gi, 'ਸਿਫ਼ਾਰਸ਼ੀ ਬਚਾਅ ਉਪਾਅ: ')
      .replace(/Precaution:/gi, 'ਬਚਾਅ ਉਪਾਅ: ')
      .replace(/Possible Diagnosis:/gi, 'ਸੰਭਾਵੀ ਬਿਮਾਰੀ ਨਿਦਾਨ: ')
      .replace(/percent estimated confidence/gi, 'ਪ੍ਰਤੀਸ਼ਤ ਅਨੁਮਾਨਿਤ ਸੰਭਾਵਨਾ')
      .replace(/Preventive measures:/gi, 'ਬਚਾਅ ਦੇ ਉਪਾਅ: ')
      .replace(/Specialist Diagnosis:/gi, 'ਮਾਹਿਰ ਡਾਕਟਰੀ ਨਿਦਾਨ: ')
      .replace(/Advice:/gi, 'ਸਲਾਹ: ')
      .replace(/Wheat/gi, 'ਕਣਕ')
      .replace(/Mustard/gi, 'ਸਰ੍ਹੋਂ');
  } else if (targetLang === 'hi') {
    localized = localized
      .replace(/🚨|⚠️|🌧️/g, '')
      .replace(/HIGH RISK ALERT/gi, 'उच्च जोखिम चेतावनी')
      .replace(/HISTORICAL RISK ALERT/gi, 'ऐतिहासिक जोखिम चेतावनी')
      .replace(/WEATHER ANOMALY ALERT/gi, 'मौसम चेतावनी')
      .replace(/Weather-Disease Recurrence Detected/gi, 'मौसम और बीमारी की पुनरावृत्ति')
      .replace(/Increased Fungal Rust Threat/gi, 'फंगल रतुआ का बढ़ा हुआ खतरा')
      .replace(/Heavy Rainfall & Waterlogging Alert/gi, 'भारी बारिश एवं जलभराव की चेतावनी')
      .replace(/Your wheat crop may face an increased risk of fungal disease in the coming days\./gi, 'आपकी गेहूं की फसल में आने वाले दिनों में फंगल रोग का खतरा बढ़ सकता है।')
      .replace(/Inspect the crop for early yellow pustule symptoms and follow locally appropriate preventive agricultural practices\./gi, 'फसल में पीले रतुए के शुरुआती लक्षणों की जांच करें और समय पर अनुशंसित बायो-फंगीसाइड का छिड़काव करें।')
      .replace(/Last season, your wheat crop experienced a fungal disease under similar weather conditions\. Current environmental conditions show a similar pattern\./gi, 'पिछले सीजन में आपकी गेहूं की फसल में समान मौसम में फंगल रोग देखा गया था। वर्तमान मौसमी परिस्थितियां भी उसी पैटर्न को दर्शाती हैं।')
      .replace(/Increase crop monitoring frequency to daily morning scouting and initiate preventive bio-fungicide\./gi, 'फसल की प्रतिदिन सुबह निगरानी करें और सुरक्षात्मक बायो-फंगीसाइड का छिड़काव करें।')
      .replace(/Forecast models indicate a 67% probability of heavy precipitation within 48 hours\./gi, 'मौसम मॉडल अगले 48 घंटों में भारी बारिश की 67 प्रतिशत संभावना दर्शाते हैं।')
      .replace(/Ensure field perimeter drainage ditches are unblocked to avoid root asphyxiation\./gi, 'जड़ों को सड़ांध से बचाने के लिए खेत की जल निकासी नालियों को तुरंत साफ रखें।')
      .replace(/Yellow Rust \(Puccinia striiformis\) Early Spore Germination/gi, 'पीला रतुआ बीजाणु अंकुरण का खतरा')
      .replace(/Yellow Rust/gi, 'पीला रतुआ')
      .replace(/Heavy Rainfall & High Foliar Humidity Advisory/gi, 'भारी वर्षा एवं पत्तियों में नमी की चेतावनी')
      .replace(/Inspect wheat foliage for early yellow rust pustules and apply prophylactic bio-fungicide\./gi, 'गेहूं की पत्तियों पर पीले रतुए की जांच करें और बायो-फंगीसाइड का छिड़काव करें।')
      .replace(/Recommended Precaution:/gi, 'अनुशंसित सावधानी: ')
      .replace(/Precaution:/gi, 'सावधानी: ')
      .replace(/Possible Diagnosis:/gi, 'संभावित रोग निदान: ')
      .replace(/percent estimated confidence/gi, 'प्रतिशत अनुमानित संभावना')
      .replace(/Preventive measures:/gi, 'बचाव के उपाय: ')
      .replace(/Specialist Diagnosis:/gi, 'विशेषज्ञ निदान: ')
      .replace(/Advice:/gi, 'सलाह: ')
      .replace(/Wheat/gi, 'गेहूं')
      .replace(/Mustard/gi, 'सरसों');
  }

  return localized;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('crop_lang') || 'en');

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const switchLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('crop_lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = localizeSpeechText(text, lang);
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.90;

      const voices = window.speechSynthesis.getVoices() || [];

      if (lang === 'pa') {
        const paVoice = voices.find(
          (v) =>
            v.lang &&
            (v.lang.toLowerCase().includes('pa') ||
              v.name.toLowerCase().includes('punjabi') ||
              v.name.toLowerCase().includes('gurmukhi'))
        );
        if (paVoice) {
          utterance.voice = paVoice;
          utterance.lang = paVoice.lang;
        } else {
          // If no dedicated Punjabi voice on OS, Hindi voice articulates Indic phrasing with high clarity
          const hiVoice = voices.find(
            (v) =>
              v.lang &&
              (v.lang.toLowerCase().includes('hi') ||
                v.name.toLowerCase().includes('hindi') ||
                v.name.toLowerCase().includes('kalpana') ||
                v.name.toLowerCase().includes('hemant'))
          );
          if (hiVoice) {
            utterance.voice = hiVoice;
            utterance.lang = hiVoice.lang;
          } else {
            utterance.lang = 'pa-IN';
          }
        }
      } else if (lang === 'hi') {
        const hiVoice = voices.find(
          (v) =>
            v.lang &&
            (v.lang.toLowerCase().includes('hi') ||
              v.name.toLowerCase().includes('hindi') ||
              v.name.toLowerCase().includes('kalpana') ||
              v.name.toLowerCase().includes('hemant'))
        );
        if (hiVoice) {
          utterance.voice = hiVoice;
          utterance.lang = hiVoice.lang;
        } else {
          utterance.lang = 'hi-IN';
        }
      } else {
        utterance.lang = 'en-US';
      }

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, t, speakText, AVAILABLE_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
