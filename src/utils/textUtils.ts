export function countWords(str: string): number {
  if (!str) return 0;
  const trimmed = str.trim();
  if (!trimmed) return 0;
  // Handle French apostrophes and multiple spaces
  const normalized = trimmed.replace(/['’]/g, ' ');
  const words = normalized.match(/\S+/g);
  return words ? words.length : 0;
}

export function countChars(str: string, withoutSpaces: boolean = false): number {
  if (!str) return 0;
  if (withoutSpaces) {
    return str.replace(/\s/g, '').length;
  }
  return str.length;
}

export function estimateReadingTime(words: number): string {
  if (words === 0) return '0 s';
  const minutes = words / 200; // Average reading speed in French
  if (minutes < 1) {
    const seconds = Math.max(5, Math.round(minutes * 60));
    return `~${seconds} sec`;
  }
  return `~${Math.round(minutes * 10) / 10} min`;
}

export interface DiffPart {
  type: 'same' | 'added' | 'removed';
  value: string;
}

/**
 * Basic word-level diff calculation for visualizing changes
 */
export function computeWordDiff(oldText: string, newText: string): { beforeDiff: DiffPart[]; afterDiff: DiffPart[] } {
  const oldWords = oldText.split(/(\s+)/);
  const newWords = newText.split(/(\s+)/);

  // Set-based lookup for rough word highlighting
  const oldSet = new Set(oldWords.map((w) => w.trim().toLowerCase()).filter(Boolean));
  const newSet = new Set(newWords.map((w) => w.trim().toLowerCase()).filter(Boolean));

  const beforeDiff: DiffPart[] = oldWords.map((word) => {
    const clean = word.trim().toLowerCase();
    if (!clean || /\s+/.test(word)) return { type: 'same', value: word };
    if (!newSet.has(clean)) {
      return { type: 'removed', value: word };
    }
    return { type: 'same', value: word };
  });

  const afterDiff: DiffPart[] = newWords.map((word) => {
    const clean = word.trim().toLowerCase();
    if (!clean || /\s+/.test(word)) return { type: 'same', value: word };
    if (!oldSet.has(clean)) {
      return { type: 'added', value: word };
    }
    return { type: 'same', value: word };
  });

  return { beforeDiff, afterDiff };
}
