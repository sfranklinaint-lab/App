import React, { useState } from 'react';
import { Columns2, GitCompare, Layers, Sparkles, Check, ArrowRight } from 'lucide-react';
import { computeWordDiff, countWords, countChars, estimateReadingTime } from '../utils/textUtils';
import { WritingStyle } from '../types';

interface BeforeAfterCompareProps {
  originalText: string;
  rewrittenText: string;
  style: WritingStyle;
}

export const BeforeAfterCompare: React.FC<BeforeAfterCompareProps> = ({
  originalText,
  rewrittenText,
  style,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'diff' | 'tabs'>('split');
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  const origWords = countWords(originalText);
  const newWords = countWords(rewrittenText);
  const origChars = countChars(originalText);
  const newChars = countChars(rewrittenText);

  const { beforeDiff, afterDiff } = computeWordDiff(originalText, rewrittenText);

  if (!originalText || !rewrittenText) return null;

  return (
    <section id="comparison-section" className="mt-12 pt-8 border-t border-purple-900/30">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Comparaison Avant / Après
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Visualisez immédiatement la transformation stylistique et les allègements apportés
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#141628] border border-gray-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Côte à côte</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('diff')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'diff'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/40'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Différentiel surligné</span>
          </button>
        </div>
      </div>

      {/* Metrics Comparison Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-[#131526] border border-gray-800">
          <p className="text-[11px] text-gray-400">Longueur en mots</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm line-through text-gray-500">{origWords}</span>
            <ArrowRight className="w-3 h-3 text-purple-400" />
            <span className="text-base font-bold text-white">{newWords}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#131526] border border-gray-800">
          <p className="text-[11px] text-gray-400">Nombre de caractères</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm line-through text-gray-500">{origChars}</span>
            <ArrowRight className="w-3 h-3 text-purple-400" />
            <span className="text-base font-bold text-white">{newChars}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#131526] border border-gray-800">
          <p className="text-[11px] text-gray-400">Temps de lecture</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm line-through text-gray-500">{estimateReadingTime(origWords)}</span>
            <ArrowRight className="w-3 h-3 text-purple-400" />
            <span className="text-base font-bold text-white">{estimateReadingTime(newWords)}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#131526] border border-gray-800">
          <p className="text-[11px] text-gray-400">Style appliqué</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-base font-bold text-purple-300">{style}</span>
          </div>
        </div>
      </div>

      {/* Mode 1: Split Side-by-Side */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before Column */}
          <div className="rounded-2xl bg-[#0f111f] border border-gray-800 p-4 sm:p-5 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800/80 mb-3">
              <span className="text-xs font-bold text-rose-400/90 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Avant (Texte d’origine)
              </span>
              <span className="text-xs text-gray-500">{origWords} mots</span>
            </div>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {originalText}
            </div>
          </div>

          {/* After Column */}
          <div className="rounded-2xl bg-[#131529] border border-purple-500/40 p-4 sm:p-5 flex flex-col shadow-lg shadow-purple-950/20 ring-1 ring-purple-500/20">
            <div className="flex items-center justify-between pb-3 border-b border-purple-900/40 mb-3">
              <span className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                Après (Humanisé)
              </span>
              <span className="text-xs text-purple-300">{newWords} mots</span>
            </div>
            <div className="text-gray-100 text-sm leading-relaxed whitespace-pre-wrap font-normal">
              {rewrittenText}
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Diff Highlight */}
      {viewMode === 'diff' && (
        <div className="rounded-2xl bg-[#0f1120] border border-gray-800 p-4 sm:p-6 space-y-6">
          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="text-gray-400 font-medium">Légende :</span>
            <span className="flex items-center gap-1.5 text-rose-300 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Tournures allégées / retirées
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Formulations naturelles ajoutées
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Diff Before */}
            <div className="p-4 rounded-xl bg-[#0d0e1a] border border-gray-800/90">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Texte d’origine (avec surlignage des éléments modifiés)
              </p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {beforeDiff.map((part, index) => (
                  <span
                    key={index}
                    className={
                      part.type === 'removed'
                        ? 'bg-rose-950/60 text-rose-300 line-through px-1 rounded-sm'
                        : 'text-gray-400'
                    }
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            </div>

            {/* Diff After */}
            <div className="p-4 rounded-xl bg-[#121426] border border-purple-500/30">
              <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                Texte reformulé (avec nouvelles formulations mises en valeur)
              </p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {afterDiff.map((part, index) => (
                  <span
                    key={index}
                    className={
                      part.type === 'added'
                        ? 'bg-purple-900/50 text-purple-200 font-medium px-1 rounded-sm border-b border-purple-400/50'
                        : 'text-gray-100'
                    }
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
