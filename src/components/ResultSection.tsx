import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Volume2,
  VolumeX,
  Download,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import { RewriteResultData, WritingStyle } from '../types';
import { countWords, countChars, estimateReadingTime } from '../utils/textUtils';

interface ResultSectionProps {
  result: RewriteResultData;
  originalText: string;
  style: WritingStyle;
  onRetry: () => void;
  isLoading: boolean;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  originalText,
  style,
  onRetry,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const origWords = countWords(originalText);
  const newWords = countWords(result.rewrittenText);
  const newChars = countChars(result.rewrittenText);
  const newReadingTime = estimateReadingTime(newWords);

  const wordDelta = newWords - origWords;
  const wordDeltaPercent = origWords > 0 ? Math.round((wordDelta / origWords) * 100) : 0;

  // Handle Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.rewrittenText);
      setCopied(true);
      setToastMessage('Texte copié dans le presse-papiers avec succès !');
      setTimeout(() => setCopied(false), 2500);
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = result.rewrittenText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setToastMessage('Texte copié dans le presse-papiers !');
      setTimeout(() => setCopied(false), 2500);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // Handle Audio Speech Playback (French TTS)
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(result.rewrittenText);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle Download (.txt)
  const handleDownload = () => {
    const blob = new Blob([result.rewrittenText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HumanTone_${style}_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('Téléchargement du fichier texte lancé !');
    setTimeout(() => setToastMessage(null), 2500);
  };

  return (
    <div className="relative rounded-2xl bg-[#121422]/90 border border-purple-500/40 shadow-2xl shadow-purple-950/30 backdrop-blur-sm overflow-hidden flex flex-col transition-all ring-1 ring-purple-500/20">
      {/* Toast notification floating bar */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl bg-purple-600 text-white font-medium text-xs shadow-xl shadow-purple-900/50 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Result Header */}
      <div className="px-4 py-3 bg-[#151728]/90 border-b border-purple-900/40 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-purple-500/20 text-purple-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">Texte reformulé</span>
            <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Style {style}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {/* Audio read-aloud */}
          <button
            type="button"
            onClick={handleToggleSpeak}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/50'
                : 'bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700/60'
            }`}
            title={isSpeaking ? 'Arrêter la lecture' : 'Écouter le rendu audio'}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-purple-400" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Arrêter' : 'Écouter'}</span>
          </button>

          {/* Download button */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700/60 transition-colors cursor-pointer"
            title="Télécharger en fichier .txt"
          >
            <Download className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Exporter</span>
          </button>

          {/* Regenerate / Retry button */}
          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700 border border-gray-700/60 transition-colors cursor-pointer"
            title="Générer une autre variante"
          >
            <RotateCw className={`w-3.5 h-3.5 text-purple-400 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Variante</span>
          </button>

          {/* Copy Button (Required) */}
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-purple-200" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 min-h-[200px]">
        <div className="text-gray-100 text-sm sm:text-base leading-relaxed whitespace-pre-wrap selection:bg-purple-500/30">
          {result.rewrittenText}
        </div>
      </div>

      {/* Improvements Summary and Highlights */}
      {(result.summary || (result.keyChanges && result.keyChanges.length > 0)) && (
        <div className="px-4 py-3 bg-[#0d0f1c] border-t border-purple-900/30 text-xs">
          {result.summary && (
            <p className="text-gray-300 mb-2 leading-relaxed">
              <span className="font-semibold text-purple-300">Amélioration : </span>
              {result.summary}
            </p>
          )}

          {result.keyChanges && result.keyChanges.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-gray-500 font-medium mr-1">Retouches clés :</span>
              {result.keyChanges.map((change, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-purple-900/30 border border-purple-500/20 text-purple-300 text-[11px]"
                >
                  ✓ {change}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Counters & Comparison Bar */}
      <div className="px-4 py-3 bg-[#0a0c16] border-t border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white">{newWords}</span>
            <span>mots</span>
            {wordDelta !== 0 && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                  wordDelta < 0
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-purple-500/20 text-purple-300'
                }`}
              >
                {wordDelta > 0 ? `+${wordDelta}` : wordDelta} ({wordDeltaPercent > 0 ? `+${wordDeltaPercent}%` : `${wordDeltaPercent}%`})
              </span>
            )}
          </div>
          <span className="text-gray-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-white">{newChars}</span>
            <span>caractères</span>
          </div>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Lecture {newReadingTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-purple-300">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
          <span>Cadence & clarté optimisées</span>
        </div>
      </div>
    </div>
  );
};
