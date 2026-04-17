const IMPACT_RULES = {
  energy: {
    what_happened: 'Energy markets are reacting to a supply, shipping, or policy signal that can affect oil and fuel prices.',
    why_it_matters: 'Oil is a base cost for transport, delivery, aviation, manufacturing, and many imported goods.',
    market_impact: [
      'Oil-sensitive sectors may reprice fuel and freight costs.',
      'Airlines, logistics, chemicals, and import-heavy businesses can face margin pressure.',
      'Inflation expectations may rise if fuel costs stay elevated.'
    ],
    personal_finance_impact: [
      'Petrol, diesel, commute, delivery, and travel costs may become more expensive.',
      'Household budgets can feel pressure through transport and food distribution costs.'
    ],
    suggested_action: 'Track fuel-linked spending and avoid assuming transport-heavy costs will stay stable.',
    possible_outcomes: [
      'Fuel prices stay volatile until supply routes stabilize.',
      'Companies pass higher transport costs to consumers.',
      'Prices cool if supply concerns fade quickly.'
    ]
  },
  inflation: {
    what_happened: 'A price, inflation, or interest-rate signal is changing expectations for borrowing costs and everyday expenses.',
    why_it_matters: 'Inflation and rates directly influence EMIs, loan affordability, savings yields, grocery bills, and business costs.',
    market_impact: [
      'Bond yields, currencies, banks, real estate, and rate-sensitive stocks may move first.',
      'Markets may delay rate-cut expectations if inflation looks sticky.',
      'Consumer-facing sectors can weaken if households reduce discretionary spending.'
    ],
    personal_finance_impact: [
      'Loan EMIs may not fall quickly and new borrowing can remain expensive.',
      'Groceries, rent, school fees, and essential purchases can take a larger share of income.'
    ],
    suggested_action: 'Review EMIs, avoid over-borrowing, and keep extra room in the monthly essentials budget.',
    possible_outcomes: [
      'Rates stay elevated for longer.',
      'Savings yields remain attractive but loans stay costly.',
      'Inflation cools and gives central banks room to ease later.'
    ]
  },
  geopolitics: {
    what_happened: 'A geopolitical event is increasing uncertainty around trade routes, commodities, sanctions, or regional stability.',
    why_it_matters: 'War, sanctions, and diplomatic stress can disrupt supply chains and push up commodity, shipping, and insurance costs.',
    market_impact: [
      'Investors may move away from risky assets and toward safer currencies or bonds.',
      'Oil, gold, shipping, defense, and import-dependent sectors may react sharply.',
      'Supply-chain delays can feed into company costs and consumer prices.'
    ],
    personal_finance_impact: [
      'Imported goods, fuel, travel, electronics, and food prices may become less predictable.',
      'Households benefit from keeping a cash buffer during unstable periods.'
    ],
    suggested_action: 'Delay non-essential big-ticket imports if prices are jumping and keep emergency liquidity intact.',
    possible_outcomes: [
      'Markets calm if tensions de-escalate.',
      'Shipping and commodity prices rise if the conflict spreads.',
      'Governments respond with sanctions or emergency supply measures.'
    ]
  },
  indian_politics: {
    what_happened: 'An Indian policy or political development may change taxes, subsidies, government spending, or business rules.',
    why_it_matters: 'Policy decisions can directly affect household costs, business confidence, public finances, and market sentiment.',
    market_impact: [
      'Banks, infrastructure, energy, consumer, and public-sector stocks may react to policy signals.',
      'Bond markets may watch spending plans and fiscal discipline.',
      'Business confidence can improve or weaken depending on policy clarity.'
    ],
    personal_finance_impact: [
      'Taxes, subsidies, fuel prices, public services, and job sentiment can affect monthly cash flow.',
      'Policy relief can help households, but higher deficits can affect inflation or rates later.'
    ],
    suggested_action: 'Check whether the policy changes your actual taxes, fuel bill, benefits, or loan decisions before reacting.',
    possible_outcomes: [
      'Targeted relief lowers near-term household pressure.',
      'Markets wait for official details before repricing.',
      'Fiscal concerns grow if spending rises without matching revenue.'
    ]
  },
  global_markets: {
    what_happened: 'Global markets are repricing risk based on new economic, currency, trade, or earnings information.',
    why_it_matters: 'Market stress can affect portfolio values, import costs, job sentiment, business funding, and currency-linked expenses.',
    market_impact: [
      'Stocks, bonds, currencies, and commodities may move as investors reassess risk.',
      'Exporters, importers, banks, and technology firms can see second-order effects.',
      'Volatility may rise if the signal changes growth or rate expectations.'
    ],
    personal_finance_impact: [
      'Mutual funds, retirement portfolios, travel budgets, and imported purchases may be affected indirectly.',
      'Short-term volatility can make emotional financial decisions more costly.'
    ],
    suggested_action: 'Avoid reacting to one headline; review diversification and near-term cash needs before changing investments.',
    possible_outcomes: [
      'Markets stabilize after follow-up data.',
      'Volatility continues if policy or earnings signals worsen.',
      'Currency moves affect import and travel costs.'
    ]
  }
};

function ensureArray(value, fallback) {
  if (Array.isArray(value) && value.length) return value.map(String);
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return fallback;
}

function ensureString(value, fallback) {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (Array.isArray(value) && value.length) return String(value[0]);
  return fallback;
}

export function buildRuleImpact(event = {}) {
  const category = event.category || 'global_markets';
  const rule = IMPACT_RULES[category] || IMPACT_RULES.global_markets;
  const title = event.title || 'This event';
  const region = event.region || 'Global';

  return {
    what_happened: event.summary || `${title} is being tracked as a market-moving event in ${region}.`,
    why_it_matters: rule.why_it_matters,
    market_impact: rule.market_impact,
    personal_finance_impact: rule.personal_finance_impact,
    suggested_action: rule.suggested_action,
    possible_outcomes: rule.possible_outcomes
  };
}

export function normalizeImpactShape(value = {}, fallback = IMPACT_RULES.global_markets) {
  return {
    what_happened: ensureString(value.what_happened ?? value.whatHappened, fallback.what_happened),
    why_it_matters: ensureString(value.why_it_matters ?? value.whyItMatters, fallback.why_it_matters),
    market_impact: ensureArray(value.market_impact ?? value.marketImpact, fallback.market_impact),
    personal_finance_impact: ensureArray(
      value.personal_finance_impact ?? value.personalFinanceImpact,
      fallback.personal_finance_impact
    ),
    suggested_action: ensureString(value.suggested_action ?? value.suggestedAction, fallback.suggested_action),
    possible_outcomes: ensureArray(value.possible_outcomes ?? value.possibleOutcome ?? value.possibleOutcomes, fallback.possible_outcomes)
  };
}

export function buildFinancialImpact(event = {}, aiEnhancement = null) {
  const ruleImpact = buildRuleImpact(event);
  if (!aiEnhancement) return ruleImpact;

  const normalizedAi = normalizeImpactShape(aiEnhancement, ruleImpact);
  return {
    what_happened: normalizedAi.what_happened || ruleImpact.what_happened,
    why_it_matters: normalizedAi.why_it_matters || ruleImpact.why_it_matters,
    market_impact: normalizedAi.market_impact.length ? normalizedAi.market_impact : ruleImpact.market_impact,
    personal_finance_impact: normalizedAi.personal_finance_impact.length
      ? normalizedAi.personal_finance_impact
      : ruleImpact.personal_finance_impact,
    suggested_action: normalizedAi.suggested_action || ruleImpact.suggested_action,
    possible_outcomes: normalizedAi.possible_outcomes.length ? normalizedAi.possible_outcomes : ruleImpact.possible_outcomes
  };
}

export function getImpactRules() {
  return IMPACT_RULES;
}
