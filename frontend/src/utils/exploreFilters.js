import { translateLabel } from './translations.js';

const regionChipTranslations = {
  hi: {
    Global: '\u0917\u094d\u0932\u094b\u092c\u0932',
    India: '\u092d\u093e\u0930\u0924',
    China: '\u091a\u0940\u0928',
    Europe: '\u092f\u0942\u0930\u094b\u092a',
    Japan: '\u091c\u093e\u092a\u093e\u0928',
    Brazil: '\u092c\u094d\u0930\u093e\u095b\u0940\u0932',
    'United States': '\u0938\u0902\u092f\u0941\u0915\u094d\u0924 \u0930\u093e\u091c\u094d\u092f \u0905\u092e\u0947\u0930\u093f\u0915\u093e',
    'United Kingdom': '\u092f\u0942\u0928\u093e\u0907\u091f\u0947\u0921 \u0915\u093f\u0902\u0917\u0921\u092e',
    'Middle East': '\u092e\u0927\u094d\u092f \u092a\u0942\u0930\u094d\u0935',
    'Russia / Ukraine': '\u0930\u0942\u0938 / \u092f\u0942\u0915\u094d\u0930\u0947\u0928',
    'Southeast Asia': '\u0926\u0915\u094d\u0937\u093f\u0923-\u092a\u0942\u0930\u094d\u0935 \u090f\u0936\u093f\u092f\u093e',
    'Startup Global': '\u0938\u094d\u091f\u093e\u0930\u094d\u091f\u0905\u092a \u0917\u094d\u0932\u094b\u092c\u0932',
    'Startup India': '\u0938\u094d\u091f\u093e\u0930\u094d\u091f\u0905\u092a \u0907\u0902\u0921\u093f\u092f\u093e'
  }
};

export function buildExploreFilters(config) {
  const marketFilters = (config?.regions || []).map((region) => ({
    id: `market-${region.name}`,
    label: region.name,
    type: 'market',
    region: region.name
  }));

  return [
    ...marketFilters,
    { id: 'startup-global', label: 'Startup Global', type: 'startup', region: 'Global' },
    { id: 'startup-india', label: 'Startup India', type: 'startup', region: 'India' }
  ];
}

export function translateExploreLabel(language, label) {
  if (!label || language === 'en') return label;
  return regionChipTranslations[language]?.[label] || translateLabel(language, label);
}
