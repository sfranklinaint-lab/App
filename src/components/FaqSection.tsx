import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Shield, CheckCircle2 } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Comment HumanTone rend-il un texte plus « humain » ?",
    answer:
      "Les textes bruts générés par les IA ont tendance à accumuler des transitions stéréotypées (« En effet », « Dans un monde en constante évolution », « Il convient de noter »), une cadence monotone et une surenchère de termes abstraits. HumanTone élimine ces tics, varie les longueurs de phrases, remplace le jargon par des formulations directes et insuffle une véritable voix d'auteur selon le style choisi.",
  },
  {
    question: "Les faits, chiffres et détails importants sont-ils préservés ?",
    answer:
      "Absolument. HumanTone applique une consigne stricte de zéro invention : les données chiffrées, noms de personnes ou de marques, dates, arguments techniques et liens demeurent rigoureusement intacts. Seule l'enveloppe stylistique et la fluidité syntaxique sont retravaillées.",
  },
  {
    question: "Ce service garantit-il de contourner les détecteurs d'IA ?",
    answer:
      "Non, et nous tenons à être parfaitement transparents : les détecteurs d'IA reposent sur des critères probabilistes fluctuants et sont notoirement peu fiables (produisant de nombreux faux positifs même sur des textes classiques de littérature). Notre engagement n'est pas une tromperie algorithmique, mais d'offrir une écriture sincère, fluide, claire et agréable pour vos vrais lecteurs humains.",
  },
  {
    question: "L'application est-elle gratuite et sans inscription ?",
    answer:
      "Oui ! Cette première version MVP est entièrement accessible sans obligation de créer un compte, sans abonnement et sans coordonnées bancaires. Vous collez votre texte, choisissez votre style et obtenez votre version humanisée en quelques secondes.",
  },
  {
    question: "Comment mes textes sont-ils traités au niveau confidentialité ?",
    answer:
      "Vos textes sont traités exclusivement pour la reformulation demandée via notre passerelle serveur sécurisée. Aucun texte n'est revendu, stocké de manière permanente à votre insu ou exploité pour du ciblage publicitaire.",
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq-section" className="mt-16 pt-12 border-t border-purple-900/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Foire aux questions & Transparence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tout ce que vous devez savoir
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Des réponses claires et une approche éthique de l’écriture assistée par IA
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-[#121424] border border-gray-800/80 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-gray-100 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-gray-800/40 bg-[#0e101d]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
