import React, { useRef } from 'react';
import {
  Wand2,
  Trash2,
  ClipboardPaste,
  FileText,
  AlertCircle,
  Loader2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { countWords, countChars, estimateReadingTime } from '../utils/textUtils';
import { PRESET_SAMPLES } from '../data/presets';
import { WritingStyle } from '../types';

interface TextEditorProps {
  text: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  onSubmit: (allowDemo?: boolean) => void;
  isLoading: boolean;
  loadingStep: string;
  error: string | null;
  canUseDemo?: boolean;
  onSelectSample: (sampleText: string, style: WritingStyle) => void;
  onShowApiInfo: () => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  text,
  onChangeText,
  onClear,
  onSubmit,
  isLoading,
  loadingStep,
  error,
  canUseDemo,
  onSelectSample,
  onShowApiInfo,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const words = countWords(text);
  const chars = countChars(text);
  const charsNoSpaces = countChars(text, true);
  const readingTime = estimateReadingTime(words);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const clipText = await navigator.clipboard.readText();
        if (clipText) {
          onChangeText(clipText);
          textareaRef.current?.focus();
        }
      }
    } catch {
      // In case clipboard permission is denied, focus textarea
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl + Enter or Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && text.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="rounded-2xl bg-[#121422]/90 border border-purple-900/30 shadow-xl shadow-purple-950/20 backdrop-blur-sm overflow-hidden flex flex-col transition-all">
      {/* Top Header of Editor */}
      <div className="px-4 py-3 bg-[#151728]/80 border-b border-gray-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-300 font-medium">
          <FileText className="w-4 h-4 text-purple-400" />
          <span>Texte d’origine</span>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          {/* Sample loader dropdown */}
          <div className="relative group">
            <button
              type="button"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-gray-300 bg-gray-800/60 hover:bg-purple-900/40 hover:text-purple-200 border border-gray-700/60 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Insérer un exemple</span>
            </button>
            <div className="hidden group-hover:block absolute right-0 top-full pt-1.5 z-20 w-64">
              <div className="p-2 rounded-xl bg-[#181a2e] border border-gray-700 shadow-xl space-y-1">
                <p className="px-2 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Exemples à humaniser :
                </p>
                {PRESET_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => onSelectSample(sample.text, sample.style)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-purple-600/30 transition-colors cursor-pointer"
                  >
                    <p className="font-medium truncate">{sample.title}</p>
                    <p className="text-[10px] text-purple-400">{sample.style}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Paste button */}
          <button
            type="button"
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-gray-300 bg-gray-800/60 hover:bg-gray-800 hover:text-white border border-gray-700/60 transition-colors cursor-pointer"
            title="Coller le texte du presse-papiers"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Coller</span>
          </button>

          {/* Clear button */}
          {text.length > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-300 bg-rose-950/30 hover:bg-rose-900/50 border border-rose-800/40 transition-colors cursor-pointer"
              title="Effacer le texte"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Effacer</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Text Area */}
      <div className="relative flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Colle ton texte ici…"
          rows={9}
          className="w-full h-full min-h-[220px] sm:min-h-[260px] bg-transparent text-gray-100 placeholder:text-gray-500 text-sm sm:text-base leading-relaxed resize-y focus:outline-none focus:ring-0 border-0"
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-[#0d0e1c]/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-10 animate-fade-in">
            <div className="relative flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
              <Loader2 className="w-7 h-7 text-purple-400 absolute animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-white tracking-wide mb-1">
              Humanisation en cours...
            </p>
            <p className="text-xs text-purple-300 animate-pulse text-center max-w-xs">
              {loadingStep || 'Harmonisation du rythme et du vocabulaire...'}
            </p>
          </div>
        )}
      </div>

      {/* Error Message Box */}
      {error && (
        <div className="mx-4 mb-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-600/40 flex items-start gap-3 text-xs text-rose-200">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-300">Information sur le service de reformulation</p>
            <p className="mt-0.5 text-rose-200/90 leading-relaxed">{error}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-3">
              {canUseDemo && (
                <button
                  type="button"
                  onClick={() => onSubmit(true)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-purple-600/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tester en mode démonstration</span>
                </button>
              )}
              <button
                type="button"
                onClick={onShowApiInfo}
                className="text-xs font-semibold text-purple-300 hover:text-purple-200 underline cursor-pointer"
              >
                Configuration de la clé API serveur &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Bar with Word/Char counters & Submit button */}
      <div className="px-4 py-3 bg-[#0e101c] border-t border-gray-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Counters */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-200">{words}</span>
            <span>mots</span>
          </div>
          <span className="text-gray-700">•</span>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-200">{chars}</span>
            <span>caractères</span>
            <span className="text-[10px] text-gray-500 hidden md:inline">({charsNoSpaces} ss espaces)</span>
          </div>
          <span className="text-gray-700 hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1 text-gray-400">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Lecture {readingTime}</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSubmit()}
            disabled={isLoading || !text.trim()}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              isLoading || !text.trim()
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50'
                : 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 hover:shadow-purple-600/50 active:scale-98 ring-1 ring-white/10'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Reformulation en cours...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-purple-200" />
                <span>Reformuler mon texte</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
