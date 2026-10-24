import React from 'react';
import { ArrowDown, CheckCircle2, Wand2, Shield, Zap, Sparkles } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
  onExploreSamples: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick, onExploreSamples }) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background radial gradients for subtle modern purple ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs sm:text-sm font-medium mb-6 shadow-sm shadow-purple-500/10 animate-fade-in">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Reformulation IA de nouvelle génération en français</span>
        </div>

        {/* Required Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          Des textes plus naturels.{' '}
          <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-300 bg-clip-text text-transparent">
            Un style qui vous ressemble.
          </span>
        </h1>

        {/* Short explanation */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-300 mb-9 leading-relaxed font-normal">
          Dites adieu aux tournures robotiques, aux clichés d’IA et aux phrases sans âme.
          HumanTone réécrit vos textes pour leur conférer cadence, fluidité et authenticité, tout en respectant scrupuleusement vos faits et vos idées.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onCtaClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-base font-semibold text-white bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30 hover:shadow-purple-600/45 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5 cursor-pointer ring-1 ring-white/20"
          >
            <Wand2 className="w-5 h-5" />
            <span>Essayer gratuitement</span>
          </button>

          <button
            onClick={onExploreSamples}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-base font-medium text-gray-300 bg-[#161828]/90 hover:bg-[#20233b] hover:text-white border border-gray-800 hover:border-purple-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tester un exemple concret</span>
            <ArrowDown className="w-4 h-4 text-purple-400" />
          </button>
        </div>

        {/* 4 Feature highlight pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-[#121422]/70 border border-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs sm:text-sm mb-1">
              <Shield className="w-4 h-4" />
              <span>Zéro invention</span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-snug">
              Faits, chiffres et noms strictement préservés.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121422]/70 border border-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs sm:text-sm mb-1">
              <Zap className="w-4 h-4" />
              <span>Instantané & Libre</span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-snug">
              Sans création de compte ni carte bancaire.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121422]/70 border border-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs sm:text-sm mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>5 styles d’écriture</span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-snug">
              Du style naturel au style académique pointu.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121422]/70 border border-gray-800/80 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-fuchsia-400 font-semibold text-xs sm:text-sm mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Anti-robotique</span>
            </div>
            <p className="text-[11px] sm:text-xs text-gray-400 leading-snug">
              Élimine les clichés et tics de l’IA générative.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
