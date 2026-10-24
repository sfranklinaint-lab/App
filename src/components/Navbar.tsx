import React from 'react';
import { Sparkles, History, Server, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  onOpenApiInfo: () => void;
  historyCount: number;
  serverStatus: { configured: boolean; model: string } | null;
  onScrollToEditor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenHistory,
  onOpenApiInfo,
  historyCount,
  serverStatus,
  onScrollToEditor,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0b0c14]/85 border-b border-purple-900/30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-violet-400 shadow-lg shadow-purple-500/25 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                HumanTone
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Studio FR
              </span>
            </div>
            <p className="text-[11px] text-gray-400 hidden sm:block">L’humanisateur de texte intelligent</p>
          </div>
        </div>

        {/* Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <button
            onClick={onScrollToEditor}
            className="hover:text-purple-300 transition-colors cursor-pointer"
          >
            L’Éditeur
          </button>
          <a
            href="#styles-section"
            className="hover:text-purple-300 transition-colors"
          >
            Styles d'écriture
          </a>
          <a
            href="#comparison-section"
            className="hover:text-purple-300 transition-colors"
          >
            Comparateur
          </a>
          <a
            href="#faq-section"
            className="hover:text-purple-300 transition-colors"
          >
            FAQ & Éthique
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Server / API Status Pill */}
          <button
            onClick={onOpenApiInfo}
            title={serverStatus?.configured ? "Moteur IA actif sur le serveur (Gemini 3.8 Flash)" : "Configuration de la clé API serveur"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-gray-900/80 border border-gray-800 hover:border-purple-500/40 transition-colors cursor-pointer"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                serverStatus?.configured
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="hidden sm:inline text-gray-300">
              {serverStatus?.configured ? 'IA Prête' : 'Serveur'}
            </span>
            <Server className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* History button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-gray-200 bg-[#161828] hover:bg-[#1f2238] border border-gray-800 hover:border-purple-500/30 transition-all cursor-pointer"
            title="Historique des reformulations"
          >
            <History className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Historique</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-purple-600 text-white font-bold">
                {historyCount}
              </span>
            )}
          </button>

          {/* Prominent CTA */}
          <button
            onClick={onScrollToEditor}
            className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/25 active:scale-95 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 hidden xs:block" />
            <span>Essayer gratuitement</span>
          </button>
        </div>
      </div>
    </header>
  );
};
