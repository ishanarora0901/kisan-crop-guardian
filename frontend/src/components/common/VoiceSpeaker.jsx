import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const VoiceSpeaker = ({ text, label = 'Listen in Audio' }) => {
  const { speakText } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!text) return;
    setIsPlaying(true);
    speakText(text);
    setTimeout(() => setIsPlaying(false), 4000);
  };

  return (
    <button
      onClick={handlePlay}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors shadow-sm"
      title="Listen to advisory audio"
    >
      {isPlaying ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </button>
  );
};

export default VoiceSpeaker;
