/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StyleSelector } from './components/StyleSelector';
import { TextEditor } from './components/TextEditor';
import { ResultSection } from './components/ResultSection';
import { BeforeAfterCompare } from './components/BeforeAfterCompare';
import { StylesGuide } from './components/StylesGuide';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { WritingStyle, IntensityLevel, RewriteResultData, RewriteHistoryItem } from './types';
import { PRESET_SAMPLES } from './data/presets';
import { countWords } from './utils/textUtils';

const STORAGE_KEY = 'humantone_history_v1';

export default function App() {
  const [text, setText] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<WritingStyle>('Naturel');
  const [intensity, setIntensity] = useState<IntensityLevel>('balanced');
  const [result, setResult] = useState<RewriteResultData | null>(null);
  const [lastSubmittedOriginal, setLastSubmittedOriginal] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [canUseDemo, setCanUseDemo] = useState<boolean>(false);

  const [serverStatus, setServerStatus] = useState<{ configured: boolean; model: string } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<RewriteHistoryItem[]>([]);

  const editorSectionRef = useRef<HTMLDivElement>(null);
  const resultSectionRef = useRef<HTMLDivElement>(null);

  // Check server status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.configured === 'boolean') {
          setServerStatus({ configured: data.configured, model: data.model || 'gemini-3.8-flash' });
        }
      })
      .catch((err) => {
        console.warn('Impossible de joindre le statut serveur:', err);
      });
  }, []);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // LocalStorage might be disabled
    }
  }, []);

  // Save history to localStorage
  const saveHistoryItem = (item: RewriteHistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((i) => i.id !== item.id)].slice(0, 30);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleScrollToEditor = () => {
    editorSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleLoadSample = (sampleText: string, sampleStyle: WritingStyle) => {
    setText(sampleText);
    setSelectedStyle(sampleStyle);
    setError(null);
    handleScrollToEditor();
  };

  const handleClear = () => {
    setText('');
    setError(null);
  };

  // Main Submit Handler
  const handleSubmitRewrite = async (allowDemo: boolean = false) => {
    if (!text.trim()) {
      setError('Veuillez d’abord saisir ou coller un texte à reformuler.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setLoadingStep("Analyse des lourdeurs syntaxiques et des tics d'IA...");

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev.includes('Analyse')) return 'Recomposition du rythme et fluidification des phrases...';
        if (prev.includes('Recomposition')) return `Harmonisation dans le style ${selectedStyle}...`;
        return 'Finalisation du rendu naturel...';
      });
    }, 1200);

    try {
      const response = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text.trim(),
          style: selectedStyle,
          intensity,
          allowDemo,
        }),
      });

      clearInterval(stepInterval);
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data?.canUseDemo) {
          setCanUseDemo(true);
        }
        throw new Error(data?.message || 'Erreur lors de la reformulation.');
      }

      const rewriteData: RewriteResultData = data.result;
      setResult(rewriteData);
      setLastSubmittedOriginal(text.trim());
      setError(null);
      setCanUseDemo(false);

      // Save to history
      const historyEntry: RewriteHistoryItem = {
        id: 'hist_' + Date.now(),
        timestamp: Date.now(),
        originalText: text.trim(),
        rewrittenText: rewriteData.rewrittenText,
        style: selectedStyle,
        intensity,
        wordCountOriginal: countWords(text.trim()),
        wordCountRewritten: countWords(rewriteData.rewrittenText),
        summary: rewriteData.summary,
      };
      saveHistoryItem(historyEntry);

      // Smooth scroll to result area on mobile/desktop
      setTimeout(() => {
        resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: any) {
      clearInterval(stepInterval);
      setError(
        err?.message ||
          "Une erreur inattendue est survenue. Veuillez vérifier votre texte et réessayer."
      );
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleRestoreFromHistory = (item: RewriteHistoryItem) => {
    setText(item.originalText);
    setSelectedStyle(item.style);
    setIntensity(item.intensity);
    setResult({
      rewrittenText: item.rewrittenText,
      summary: item.summary,
      keyChanges: ['Restauré depuis l’historique local'],
    });
    setLastSubmittedOriginal(item.originalText);
    setError(null);
    handleScrollToEditor();
  };

  return (
    <div className="min-h-screen bg-[#0b0c14] text-gray-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenApiInfo={() => setIsApiModalOpen(true)}
        historyCount={history.length}
        serverStatus={serverStatus}
        onScrollToEditor={handleScrollToEditor}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Hero Section */}
        <Hero
          onCtaClick={handleScrollToEditor}
          onExploreSamples={() => {
            const first = PRESET_SAMPLES[0];
            handleLoadSample(first.text, first.style);
          }}
        />

        {/* Workspace: The Core Editor & Rewriter */}
        <div ref={editorSectionRef} id="editor-section" className="scroll-mt-24 space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-purple-900/20">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Atelier d’Humanisation</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Temps réel
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">
                Collez votre texte brut, choisissez la tonalité cible et laissez la magie opérer.
              </p>
            </div>

            {/* Quick Presets row */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[11px] text-gray-500 font-medium shrink-0">Essais rapides :</span>
              {PRESET_SAMPLES.slice(0, 3).map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleLoadSample(sample.text, sample.style)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-[#141628] hover:bg-purple-900/40 text-gray-300 hover:text-purple-200 border border-gray-800 transition-colors shrink-0 cursor-pointer"
                >
                  {sample.category}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <StyleSelector
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            intensity={intensity}
            onSelectIntensity={setIntensity}
          />

          {/* Dual Panel: Input and Output */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Input Editor Panel */}
            <div className="flex flex-col">
              <TextEditor
                text={text}
                onChangeText={setText}
                onClear={handleClear}
                onSubmit={handleSubmitRewrite}
                isLoading={isLoading}
                loadingStep={loadingStep}
                error={error}
                canUseDemo={canUseDemo}
                onSelectSample={handleLoadSample}
                onShowApiInfo={() => setIsApiModalOpen(true)}
              />
            </div>

            {/* Result Display Panel */}
            <div ref={resultSectionRef} className="flex flex-col">
              {result ? (
                <ResultSection
                  result={result}
                  originalText={lastSubmittedOriginal || text}
                  style={selectedStyle}
                  onRetry={handleSubmitRewrite}
                  isLoading={isLoading}
                />
              ) : (
                /* Empty Placeholder State */
                <div className="h-full min-h-[380px] rounded-2xl border border-dashed border-purple-900/40 bg-[#101220]/40 p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-purple-900/20 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4 shadow-inner">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-200 mb-1">
                    Votre texte reformulé apparaîtra ici
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
                    Collez votre brouillon ou un écrit généré par IA dans le panneau de gauche, puis cliquez sur{' '}
                    <strong className="text-purple-300">« Reformuler mon texte »</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const sample = PRESET_SAMPLES[1];
                      handleLoadSample(sample.text, sample.style);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/60 border border-purple-600/30 transition-colors cursor-pointer"
                  >
                    Tester un exemple en 1 clic
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Before & After Interactive Comparison */}
          {result && (
            <BeforeAfterCompare
              originalText={lastSubmittedOriginal || text}
              rewrittenText={result.rewrittenText}
              style={selectedStyle}
            />
          )}
        </div>

        {/* Styles Deep Dive Showcase */}
        <StylesGuide
          onSelectStyleAndScroll={(style) => {
            setSelectedStyle(style);
            handleScrollToEditor();
          }}
        />

        {/* FAQ & Ethical Disclosure Section */}
        <FaqSection />
      </main>

      {/* History Slide Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onRestore={handleRestoreFromHistory}
        onClearHistory={handleClearHistory}
        onDeleteItem={handleDeleteHistoryItem}
      />

      {/* API Key & Architecture Modal */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        serverStatus={serverStatus}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
