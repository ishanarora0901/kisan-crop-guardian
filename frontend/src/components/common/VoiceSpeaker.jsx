import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const VoiceSpeaker = ({ text, label }) => {
  const { speakText, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const displayLabel = label || t('voiceListen') || 'Listen in Audio';

  const handlePlay = () => {
    if (!text) return;
    setIsPlaying(true);
    speakText(text);
    setTimeout(() => setIsPlaying(false), 5000);
  };

  return (
    <button
      onClick={handlePlay}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors shadow-sm"
      title={t('voiceTooltip') || 'Listen to advisory audio'}
    >
      {isPlaying ? (
        <VolumeX className="w-3.5 h-3.5 animate-pulse text-amber-400" />
      ) : (
        <Volume2 className="w-3.5 h-3.5" />
      )}
      <span>{isPlaying ? (t('voicePlaying') || 'Playing...') : displayLabel}</span>
    </button>
  );
};

export default VoiceSpeaker;
