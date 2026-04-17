import { generateSuggestedAction } from './actionGenerator.js';

export function generateFallbackInsight(event) {
  const category = event.category || 'Global Markets';
  const region = event.region || 'Global';

  const categoryLower = category.toLowerCase();
  const marketImpact = [];
  const personalFinanceImpact = [];
  const possibleOutcome = [];

  if (categoryLower.includes('energy')) {
    marketImpact.push('Oil-sensitive sectors may price in higher input and transport costs.');
    marketImpact.push('Airlines, logistics, chemicals, and import-heavy firms can see margin pressure.');
    personalFinanceImpact.push('Fuel, commute, delivery, and travel costs may become less predictable.');
    personalFinanceImpact.push('Households may need extra room in monthly transport budgets.');
    possibleOutcome.push('Prices may stay volatile until supply-route risk becomes clearer.');
  } else if (categoryLower.includes('central') || categoryLower.includes('economy')) {
    marketImpact.push('Bond yields, currencies, and rate-sensitive stocks may react first.');
    marketImpact.push('Banks and real estate can move as investors reassess borrowing-cost expectations.');
    personalFinanceImpact.push('Loan EMIs and deposit rates may not ease quickly.');
    personalFinanceImpact.push('Large borrowing decisions should account for rates staying elevated.');
    possibleOutcome.push('Markets may wait for the next inflation print or policy guidance.');
  } else if (categoryLower.includes('conflict')) {
    marketImpact.push('Investors may reduce risk exposure and move toward safer assets.');
    marketImpact.push('Commodities, shipping, and defense-linked sectors may see stronger reactions.');
    personalFinanceImpact.push('Imported goods, travel, and fuel-linked expenses may face upward pressure.');
    personalFinanceImpact.push('Short-term uncertainty makes cash buffers more useful.');
    possibleOutcome.push('The next move depends on whether tensions spread or de-escalate.');
  } else if (categoryLower.includes('trade')) {
    marketImpact.push('Exporters, importers, and manufacturing supply chains may reprice delivery risk.');
    marketImpact.push('Commodity and industrial stocks may react to inventory changes.');
    personalFinanceImpact.push('Imported electronics, vehicles, and household goods may face delayed price effects.');
    personalFinanceImpact.push('Businesses may pass higher input costs to customers if delays persist.');
    possibleOutcome.push('Supply conditions may normalize if shipping and inventory data improve.');
  } else if (categoryLower.includes('inflation')) {
    marketImpact.push('Rate expectations and consumer-facing sectors may adjust to new price data.');
    marketImpact.push('Bond and currency markets may react before equity markets fully digest the news.');
    personalFinanceImpact.push('Essential expenses can take a larger share of monthly budgets.');
    personalFinanceImpact.push('Savings plans may need adjustment if recurring costs keep rising.');
    possibleOutcome.push('Policy makers may stay cautious until price pressures cool.');
  } else {
    marketImpact.push('Market reaction may depend on follow-up data and official statements.');
    marketImpact.push('Currency, bond, and sector-specific moves are possible if the event changes risk appetite.');
    personalFinanceImpact.push('The direct household impact is likely indirect but worth monitoring.');
    personalFinanceImpact.push('Avoid making large financial decisions from a single headline.');
    possibleOutcome.push('More clarity should come as additional data and statements arrive.');
  }

  return {
    whatHappened: event.summary || `${event.title} is being tracked as a market-relevant event in ${region}.`,
    whyItMatters: `This matters because ${region} developments in ${category} can affect prices, rates, supply chains, and investor confidence.`,
    marketImpact,
    personalFinanceImpact,
    suggestedAction: generateSuggestedAction(event),
    possibleOutcome
  };
}
