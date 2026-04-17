export function generateSuggestedAction({ category = '', region = '' }) {
  const normalized = `${category} ${region}`.toLowerCase();

  if (
    normalized.includes('monetary')
    || normalized.includes('rbi')
    || normalized.includes('central bank')
    || normalized.includes('india / economy')
  ) {
    return [
      'Review floating-rate loans and upcoming EMI changes.',
      'Avoid assuming deposit and loan rates will move immediately.'
    ];
  }

  if (normalized.includes('oil') || normalized.includes('energy')) {
    return [
      'Track fuel and transport-heavy spending for the next few weeks.',
      'Businesses should revisit logistics and input-cost assumptions.'
    ];
  }

  if (normalized.includes('conflict') || normalized.includes('sanction')) {
    return [
      'Watch import-dependent expenses and travel costs before making large commitments.',
      'Keep emergency liquidity instead of reacting to short-term market noise.'
    ];
  }

  if (normalized.includes('trade') || normalized.includes('supply')) {
    return [
      'Expect possible delays or price changes in imported goods.',
      'Compare purchase timing if the item depends on global shipping.'
    ];
  }

  if (normalized.includes('inflation')) {
    return [
      'Recheck monthly budgets for food, fuel, and household essentials.',
      'Prefer decisions that preserve cash flow until inflation direction is clearer.'
    ];
  }

  return [
    'Track the next official update before making major financial decisions.',
    'Use this as context, not as a direct buy or sell signal.'
  ];
}
