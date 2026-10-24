import React from 'react';
import { Sparkles, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-purple-900/30 bg-[#080911] text-gray-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-900">
          {/* Logo & Manifesto */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">HumanTone</p>
              <p className="text-[11px] text-gray-500">
                Des textes plus naturels. Un style qui vous ressemble.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            <a href="#editor-section" className="hover:text-purple-300 transition-colors">
              Éditeur de texte
            </a>
            <a href="#styles-section" className="hover:text-purple-300 transition-colors">
              Styles d’écriture
            </a>
            <a href="#comparison-section" className="hover:text-purple-300 transition-colors">
              Comparaison Avant/Après
            </a>
            <a href="#faq-section" className="hover:text-purple-300 transition-colors">
              FAQ & Éthique
            </a>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-[11px] text-gray-500">
          <p className="flex items-center justify-center gap-1">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>HumanTone valorise l'élégance de la langue française et l'expression humaine authentique.</span>
          </p>
          <p className="flex items-center justify-center gap-1">
            <span>Conçu avec</span>
            <Heart className="w-3 h-3 text-rose-500 inline fill-rose-500" />
            <span>pour tous les rédacteurs en quête de naturel.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
