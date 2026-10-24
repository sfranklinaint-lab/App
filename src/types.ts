export type WritingStyle =
  | 'Naturel'
  | 'Professionnel'
  | 'Conversationnel'
  | 'Académique'
  | 'Chaleureux';

export type IntensityLevel = 'light' | 'balanced' | 'deep';

export interface StyleOption {
  id: WritingStyle;
  label: string;
  tagline: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface RewriteResultData {
  rewrittenText: string;
  summary: string;
  keyChanges: string[];
  toneCharacteristics?: string[];
}

export interface RewriteHistoryItem {
  id: string;
  timestamp: number;
  originalText: string;
  rewrittenText: string;
  style: WritingStyle;
  intensity: IntensityLevel;
  wordCountOriginal: number;
  wordCountRewritten: number;
  summary: string;
}

export interface PresetSample {
  id: string;
  title: string;
  category: string;
  style: WritingStyle;
  text: string;
  explanation: string;
}
