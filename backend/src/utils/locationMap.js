const LOCATIONS = [
  {
    region: 'Global',
    lat: 20,
    lng: 0,
    zoom: 2,
    keywords: ['global', 'world', 'markets', 'trade', 'supply chain', 'shipping', 'commodities']
  },
  {
    region: 'India',
    lat: 20.5937,
    lng: 78.9629,
    zoom: 4,
    keywords: ['india', 'indian', 'rbi', 'rupee', 'delhi', 'mumbai', 'nifty', 'sensex', 'modi', 'parliament', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'chennai']
  },
  {
    region: 'US',
    lat: 39.8283,
    lng: -98.5795,
    zoom: 4,
    keywords: ['us ', 'u.s.', 'united states', 'america', 'fed', 'federal reserve', 'wall street', 'washington', 'dollar']
  },
  {
    region: 'China',
    lat: 35.8617,
    lng: 104.1954,
    zoom: 4,
    keywords: ['china', 'chinese', 'beijing', 'yuan', 'shanghai', 'taiwan']
  },
  {
    region: 'Europe',
    lat: 54.526,
    lng: 15.2551,
    zoom: 4,
    keywords: ['europe', 'eurozone', 'eu ', 'ecb', 'european', 'brussels', 'euro']
  },
  {
    region: 'Middle East',
    lat: 29.2985,
    lng: 42.551,
    zoom: 4,
    keywords: ['middle east', 'israel', 'iran', 'iraq', 'saudi', 'gulf', 'red sea', 'suez', 'opec', 'houthis']
  },
  {
    region: 'Russia / Ukraine',
    lat: 49,
    lng: 32,
    zoom: 4,
    keywords: ['russia', 'russian', 'ukraine', 'ukrainian', 'moscow', 'kyiv', 'black sea']
  },
  {
    region: 'Japan',
    lat: 36.2048,
    lng: 138.2529,
    zoom: 5,
    keywords: ['japan', 'boj', 'tokyo', 'yen', 'japanese']
  },
  {
    region: 'United Kingdom',
    lat: 55.3781,
    lng: -3.436,
    zoom: 5,
    keywords: ['united kingdom', 'uk ', 'britain', 'boe', 'london', 'pound']
  }
];

function normalize(value) {
  return ` ${String(value || '').toLowerCase()} `;
}

export function detectLocation(article = {}) {
  const text = normalize(`${article.title || ''} ${article.description || ''} ${article.content || ''} ${article.region || ''}`);
  const match = LOCATIONS.find((location) => (
    location.region !== 'Global'
    && location.keywords.some((keyword) => text.includes(keyword.toLowerCase()))
  ));

  return match || LOCATIONS[0];
}

export function getLocationByRegion(region = 'Global') {
  const normalizedRegion = String(region || '').toLowerCase();
  return LOCATIONS.find((location) => location.region.toLowerCase() === normalizedRegion) || LOCATIONS[0];
}

export function listLocations() {
  return LOCATIONS.map(({ region, lat, lng, zoom }) => ({
    name: region,
    region,
    lat,
    lng,
    zoom
  }));
}
