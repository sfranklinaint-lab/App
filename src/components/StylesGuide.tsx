import React from 'react';
import { WritingStyle } from '../types';
import { STYLES_LIST } from '../data/presets';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StylesGuideProps {
  onSelectStyleAndScroll: (style: WritingStyle) => void;
}

export const StylesGuide: React.FC<StylesGuideProps> = ({ onSelectStyleAndScroll }) => {
  const styleExamples: Record<
    WritingStyle,
    { sampleBefore: string; sampleAfter: string; bestFor: string[] }
  > = {
    Naturel: {
      sampleBefore:
        "Il convient de souligner que nous devons impérativement finaliser cette démarche.",
      sampleAfter:
        "Il est important que nous bouclions cette étape sans tarder.",
      bestFor: [
        "Articles & blogs",
        "Newsletters personnelles",
        "Écrits quotidiens sans artifice",
      ],
    },
    Professionnel: {
      sampleBefore:
        "Je t'écris pour te dire que ton document n'est pas encore prêt du tout.",
      sampleAfter:
        "Je me permets de vous informer que la révision du document requiert des ajustements complémentaires avant finalisation.",
      bestFor: [
        "Courriels d'affaires",
        "Rapports de mission",
        "Propositions commerciales",
      ],
    },
    Conversationnel: {
      sampleBefore:
        "L'utilisation de ces mécanismes algorithmiques permet d'optimiser l'efficience opérationnelle.",
      sampleAfter:
        "Concrètement, ces outils vous font gagner un temps fou chaque matin !",
      bestFor: [
        "Publications LinkedIn & réseaux sociaux",
        "Podcasts & scripts vidéo",
        "Échanges collaboratifs",
      ],
    },
    Académique: {
      sampleBefore:
        "On voit bien que les deux choses sont liées parce que les résultats montent ensemble.",
      sampleAfter:
        "La corrélation positive observée entre ces deux variables corrobore l'hypothèse d'une interdépendance structurelle.",
      bestFor: [
        "Mémoires et thèses",
        "Revues de littérature",
        "Synthèses scientifiques",
      ],
    },
    Chaleureux: {
      sampleBefore:
        "Votre demande a été enregistrée. Le délai de réponse est de 48 heures.",
      sampleAfter:
        "Bien reçu ! Nous prenons soin de votre demande et revenons vers vous avec plaisir sous 48 heures.",
      bestFor: [
        "Support & service client",
        "Messages de bienvenue",
        "Courriers de remerciement",
      ],
    },
  };

  return (
    <section id="styles-section" className="mt-16 pt-12 border-t border-purple-900/30">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personnalisation stylistique</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          5 styles taillés pour chaque situation
        </h2>
        <p className="text-sm sm:text-base text-gray-400 mt-2">
          Chaque style ajuste intelligemment le rythme des phrases, la richesse du vocabulaire et la tonalité d’adresse.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {STYLES_LIST.map((style) => {
          const detail = styleExamples[style.id];
          return (
            <div
              key={style.id}
              className="p-5 rounded-2xl bg-[#121424] border border-gray-800/80 hover:border-purple-500/40 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${style.badgeBg} ${style.badgeText} border`}>
                    {style.label}
                  </span>
                  <span className="text-xs text-gray-400">{style.tagline}</span>
                </div>

                <p className="text-xs text-gray-300 mb-4">{style.description}</p>

                {/* Micro Example */}
                <div className="p-3 rounded-xl bg-[#0c0d18] border border-gray-800/80 space-y-2 mb-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                      Avant :
                    </span>
                    <p className="text-gray-400 italic">« {detail.sampleBefore} »</p>
                  </div>
                  <div className="pt-2 border-t border-gray-800/60">
                    <span className="text-[10px] uppercase font-bold text-purple-400 block mb-0.5">
                      Après HumanTone :
                    </span>
                    <p className="text-gray-200 font-medium">« {detail.sampleAfter} »</p>
                  </div>
                </div>

                {/* Recommended for */}
                <div className="space-y-1 mb-5">
                  <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">
                    Idéal pour :
                  </span>
                  {detail.bestFor.map((useCase, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-400">
                      <CheckCircle2 className="w-3 h-3 text-purple-400 shrink-0" />
                      <span>{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => onSelectStyleAndScroll(style.id)}
                className="w-full py-2 px-3 rounded-xl bg-[#1a1c30] hover:bg-purple-600 hover:text-white text-purple-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Utiliser ce style</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
