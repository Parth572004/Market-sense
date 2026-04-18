export const CATEGORY_RULES = [
  {
    category: 'inflation',
    label: 'Inflation & Rates',
    sub_category: 'interest_rate',
    priority: 'high',
    keywords: {
      'rbi': 5,
      'repo rate': 5,
      'reserve bank': 5,
      'federal reserve': 5,
      'fed': 4,
      'ecb': 4,
      'central bank': 4,
      'rate cut': 4,
      'rate hike': 4,
      'interest rate': 4,
      'emi': 4,
      'inflation': 4,
      'cpi': 3,
      'food prices': 3,
      'cost of living': 3,
      'wages': 2
    }
  },
  {
    category: 'energy',
    label: 'Energy',
    sub_category: 'oil_supply',
    priority: 'high',
    keywords: {
      'oil': 5,
      'crude': 5,
      'brent': 4,
      'wti': 4,
      'opec': 4,
      'fuel': 4,
      'diesel': 4,
      'gasoline': 4,
      'energy': 3,
      'refinery': 3
    }
  },
  {
    category: 'geopolitics',
    label: 'Geopolitics',
    sub_category: 'conflict_risk',
    priority: 'high',
    keywords: {
      'war': 5,
      'attack': 5,
      'missile': 5,
      'conflict': 4,
      'sanction': 4,
      'red sea': 4,
      'suez': 4,
      'ukraine': 4,
      'russia': 4,
      'israel': 4,
      'iran': 4,
      'houthi': 4,
      'border': 2
    }
  },
  {
    category: 'indian_politics',
    label: 'Indian Politics',
    sub_category: 'policy',
    priority: 'medium',
    keywords: {
      'parliament': 4,
      'government': 3,
      'election': 4,
      'budget': 4,
      'tax relief': 4,
      'subsidy': 3,
      'policy': 3,
      'modi': 3,
      'india': 1
    }
  },
  {
    category: 'global_markets',
    label: 'Global Markets',
    sub_category: 'risk_sentiment',
    priority: 'medium',
    keywords: {
      'markets': 3,
      'stocks': 3,
      'bonds': 3,
      'startup': 4,
      'funding': 4,
      'venture capital': 4,
      'vc': 3,
      'ipo': 4,
      'unicorn': 4,
      'acquisition': 4,
      'acquire': 4,
      'buyout': 3,
      'merger': 3,
      'founder': 2,
      'seed round': 3,
      'series a': 3,
      'series b': 3,
      'series c': 3,
      'yields': 4,
      'treasury yields': 4,
      'currency': 3,
      'dollar': 3,
      'yen': 3,
      'euro': 3,
      'trade': 3,
      'exports': 3,
      'imports': 3,
      'tariff': 4,
      'supply chain': 4,
      'shipping': 3,
      'freight': 3,
      'semiconductor': 3,
      'inventory': 3,
      'commodities': 3
    }
  }
];

const IRRELEVANT_KEYWORDS = [
  'celebrity',
  'sports',
  'movie',
  'fashion',
  'recipe',
  'gaming',
  'gossip'
];

function scoreKeywords(text, keywordWeights) {
  return Object.entries(keywordWeights).reduce((result, [keyword, weight]) => {
    if (text.includes(keyword.toLowerCase())) {
      result.score += weight;
      result.matchedKeywords.push(keyword);
    }
    return result;
  }, { score: 0, matchedKeywords: [] });
}

function countMatches(text, keywords) {
  return keywords.reduce((score, keyword) => text.includes(keyword.toLowerCase()) ? score + 1 : score, 0);
}

function priorityFromScore(score, basePriority) {
  if (score >= 8 || basePriority === 'high' && score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}

export function classifyArticle(article) {
  const text = `${article.title || ''} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  const irrelevantScore = countMatches(text, IRRELEVANT_KEYWORDS);

  const scored = CATEGORY_RULES
    .map((rule) => {
      const result = scoreKeywords(text, rule.keywords);
      return { ...rule, ...result };
    })
    .sort((a, b) => b.score - a.score);

  const winner = scored[0];
  const isRelevant = winner.score >= 2 && irrelevantScore === 0;

  if (!isRelevant) {
    return {
      category: 'global_markets',
      category_label: 'Global Markets',
      sub_category: 'unclassified',
      priority: 'low',
      score: 0,
      matchedKeywords: [],
      relevant: false
    };
  }

  return {
    category: winner.category,
    category_label: winner.label,
    sub_category: winner.sub_category,
    priority: priorityFromScore(winner.score, winner.priority),
    score: winner.score,
    matchedKeywords: winner.matchedKeywords,
    relevant: true
  };
}

export function buildNewsQuery({ scope = 'Global Macro', focus = '', region = '' } = {}) {
  const baseByScope = {
    'Global Macro': '(inflation OR central bank OR oil OR trade OR markets OR shipping OR conflict)',
    'US Equities': '(Federal Reserve OR earnings OR treasury yields OR Wall Street OR US stocks)',
    'Indian Markets': '(RBI OR inflation OR rupee OR Nifty OR Sensex OR India policy)',
    'Emerging Markets': '(emerging markets OR currency OR oil OR trade OR inflation)'
  };

  const base = baseByScope[scope] || baseByScope['Global Macro'];
  const focusPart = focus ? ` ${focus}` : '';
  const regionPart = region && region !== 'Global' ? ` ${region}` : '';

  return `${base}${focusPart}${regionPart}`.trim();
}

export function getCategories() {
  return CATEGORY_RULES.map((rule) => rule.category);
}

export function getCategoryOptions() {
  return CATEGORY_RULES.map((rule) => ({
    id: rule.category,
    label: rule.label
  }));
}
