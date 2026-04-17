import { detectLocation, getLocationByRegion, listLocations } from './locationMap.js';

export function detectRegion(article = {}) {
  const location = detectLocation(article);
  return { name: location.region, ...location };
}

export function getRegionByName(name = 'Global') {
  const location = getLocationByRegion(name);
  return { name: location.region, ...location };
}

export function listRegions() {
  return listLocations();
}
