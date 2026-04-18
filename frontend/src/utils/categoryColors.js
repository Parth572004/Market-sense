import { translateLabel } from './translations.js';

export const categoryColors = {
  energy: 'text-error bg-error/10',
  geopolitics: 'text-error bg-error/10',
  inflation: 'text-primary bg-primary/10',
  indian_politics: 'text-secondary bg-secondary/10',
  global_markets: 'text-secondary bg-secondary/10'
};

const categoryLabels = {
  energy: {
    en: 'Energy',
    hi: 'ऊर्जा'
  },
  geopolitics: {
    en: 'Geopolitics',
    hi: 'भूराजनीति'
  },
  inflation: {
    en: 'Inflation',
    hi: 'मुद्रास्फीति'
  },
  indian_politics: {
    en: 'Indian Politics',
    hi: 'भारतीय राजनीति'
  },
  global_markets: {
    en: 'Global Markets',
    hi: 'वैश्विक बाज़ार'
  }
};

export function getCategoryColor(category) {
  return categoryColors[category] || 'text-secondary bg-secondary/10';
}

export function formatCategory(category = '', language = 'en') {
  const translatedLabel = categoryLabels[category]?.[language];
  if (translatedLabel) return translatedLabel;

  const fallbackLabel = category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return translateLabel(language, category) || translateLabel(language, fallbackLabel) || fallbackLabel;
}
