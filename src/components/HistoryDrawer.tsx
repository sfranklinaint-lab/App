import React from 'react';
import { X, Trash2, ArrowRight, Copy, Check, Clock, RotateCcw } from 'lucide-react';
import { RewriteHistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: RewriteHistoryItem[];
  onRestore: (item: RewriteHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteItem: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onRestore,
  onClearHistory,
  onDeleteItem,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const formatDate = (timestamp: number) => {
    const d = new Date(timestamp);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) +
      ' le ' +
      d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-[#0e101c] border-l border-purple-900/40 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 bg-[#141628] border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-white text-base">Historique des reformulations</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Vider l'historique"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Clock className="w-10 h-10 mx-auto text-gray-600 mb-3" />
              <p className="text-sm font-medium text-gray-400">Aucune reformulation récente</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Vos textes reformulés apparaîtront ici automatiquement afin que vous puissiez les restaurer à tout moment.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#131525] border border-gray-800 hover:border-purple-500/40 transition-all flex flex-col gap-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30">
                      {item.style}
                    </span>
                    <span className="text-gray-500">{formatDate(item.timestamp)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="text-gray-500 hover:text-rose-400 p-1 cursor-pointer"
                    title="Supprimer cet élément"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Rewritten preview */}
                <p className="text-xs text-gray-200 line-clamp-3 leading-relaxed font-normal bg-[#0b0c16] p-2.5 rounded-lg border border-gray-800/60">
                  {item.rewrittenText}
                </p>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-gray-500">
                    {item.wordCountOriginal} → {item.wordCountRewritten} mots
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(item.id, item.rewrittenText)}
                      className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onRestore(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restaurer</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
