import React from 'react';
import { WritingStyle, IntensityLevel } from '../types';
import { STYLES_LIST } from '../data/presets';
import { Sparkles, Briefcase, MessageSquare, GraduationCap, Heart, ChevronDown } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: WritingStyle;
  onSelectStyle: (style: WritingStyle) => void;
  intensity: IntensityLevel;
  onSelectIntensity: (intensity: IntensityLevel) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  intensity,
  onSelectIntensity,
}) => {
  const getIcon = (name: string, className: string = 'w-4 h-4') => {
    switch (name) {
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Heart':
        return <Heart className={className} />;
      case 'Sparkles':
      default:
        return <Sparkles className={className} />;
    }
  };

  const activeStyleMeta = STYLES_LIST.find((s) => s.id === selectedStyle) || STYLES_LIST[0];

  return (
    <div className="space-y-4">
      {/* Top bar with Dropdown requirement and active description */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label htmlFor="style-dropdown" className="block text-sm font-semibold text-gray-200">
            Style d’écriture souhaité
          </label>
          <span className="text-xs text-gray-400">
            Choisissez la tonalité pour adapter la cadence et le vocabulaire
          </span>
        </div>

        {/* Dropdown element as specified */}
        <div className="relative w-full sm:w-64">
          <select
            id="style-dropdown"
            value={selectedStyle}
            onChange={(e) => onSelectStyle(e.target.value as WritingStyle)}
            className="w-full appearance-none px-4 py-2.5 rounded-xl bg-[#141628] border border-purple-500/30 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-10 cursor-pointer shadow-sm shadow-purple-900/10"
          >
            <option value="Naturel">Naturel (Recommandé)</option>
            <option value="Professionnel">Professionnel</option>
            <option value="Conversationnel">Conversationnel</option>
            <option value="Académique">Académique</option>
            <option value="Chaleureux">Chaleureux</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-purple-400">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Quick Visual Style Cards for fast selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {STYLES_LIST.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`p-3 rounded-xl text-left transition-all duration-200 border cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-purple-950/40 border-purple-500/80 shadow-md shadow-purple-900/30 ring-1 ring-purple-500/50'
                  : 'bg-[#121422]/60 border-gray-800 hover:border-purple-500/40 hover:bg-[#181a2e]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`p-1.5 rounded-lg ${
                    isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800/80 text-gray-400'
                  }`}
                >
                  {getIcon(style.iconName, 'w-4 h-4')}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
                )}
              </div>
              <div>
                <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                  {style.label}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{style.tagline}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-bar: Active style description & Intensity level */}
      <div className="p-3 rounded-xl bg-[#101220]/70 border border-gray-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
          <span className="font-medium text-purple-300">{activeStyleMeta.label} :</span>
          <span className="text-gray-400">{activeStyleMeta.description}</span>
        </div>

        {/* Intensity pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-gray-400 font-medium mr-1 text-[11px]">Intensité :</span>
          {(
            [
              { id: 'light', label: 'Légère' },
              { id: 'balanced', label: 'Équilibrée' },
              { id: 'deep', label: 'Approfondie' },
            ] as const
          ).map((lvl) => (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onSelectIntensity(lvl.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                intensity === lvl.id
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/40'
                  : 'bg-gray-800/70 text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
