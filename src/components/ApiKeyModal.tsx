import React from 'react';
import { X, ShieldCheck, Key, Server, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverStatus: { configured: boolean; model: string } | null;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  serverStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#101222] border border-purple-500/40 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 bg-[#15172b] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Architecture & Sécurité de l'IA</h3>
              <p className="text-xs text-gray-400">Protection des secrets & moteur d'humanisation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-gray-300">
          {/* Status badge */}
          <div className="p-3.5 rounded-xl bg-[#0c0d18] border border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3 h-3 rounded-full ${
                  serverStatus?.configured
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : 'bg-amber-400 animate-pulse'
                }`}
              />
              <div>
                <p className="font-semibold text-white">
                  {serverStatus?.configured ? 'Moteur IA Actif sur le serveur' : 'Clé API en attente de configuration'}
                </p>
                <p className="text-[11px] text-gray-400">Modèle configuré : {serverStatus?.model || 'gemini-3.8-flash'}</p>
              </div>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                serverStatus?.configured
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}
            >
              {serverStatus?.configured ? 'Opérationnel' : 'À configurer'}
            </span>
          </div>

          {/* Secure architecture callout */}
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-purple-200">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Zéro exposition côté navigateur (Client-side)</span>
            </div>
            <p className="text-xs text-purple-200/80 leading-relaxed">
              Pour des raisons de sécurité strictes, la clé API de modèle de langage ne circule{' '}
              <strong>jamais</strong> dans votre navigateur. Toutes les requêtes de reformulation
              sont relayées par notre serveur Express sécurisé via la variable d'environnement{' '}
              <code className="text-purple-300 bg-purple-900/60 px-1 py-0.5 rounded">GEMINI_API_KEY</code>.
            </p>
          </div>

          {/* How to configure */}
          <div className="space-y-2">
            <p className="font-semibold text-white flex items-center gap-1.5">
              <Key className="w-4 h-4 text-purple-400" />
              <span>Comment configurer la clé sur le serveur ?</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-300 pl-1">
              <li>
                Dans Google AI Studio, rendez-vous dans le panneau latéral{' '}
                <strong className="text-white">Settings &gt; Secrets</strong>.
              </li>
              <li>
                Assurez-vous que la variable <code className="text-purple-300">GEMINI_API_KEY</code> est bien renseignée avec votre clé API Gemini valide.
              </li>
              <li>
                Le serveur prend instantanément en compte la clé pour traiter les reformulations avec le modèle{' '}
                <span className="text-purple-300 font-semibold">Gemini 3.8 Flash</span>.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141628] border-t border-gray-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
