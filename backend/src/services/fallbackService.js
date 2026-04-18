import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizeArticles } from '../utils/normalizeArticle.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fallbackPath = join(__dirname, '..', 'data', 'fallbackNews.json');
const demoPath = join(__dirname, '..', 'data', 'demoEvents.json');
const startupFallbackPath = join(__dirname, '..', 'data', 'startupFallbackNews.json');

let cachedRawArticles = null;
let cachedDemoArticles = null;
let cachedStartupArticles = null;

export async function loadFallbackArticles() {
  if (!cachedRawArticles) {
    const content = await readFile(fallbackPath, 'utf8');
    cachedRawArticles = JSON.parse(content);
  }

  return cachedRawArticles;
}

export async function loadDemoArticles() {
  if (!cachedDemoArticles) {
    const content = await readFile(demoPath, 'utf8');
    cachedDemoArticles = JSON.parse(content);
  }

  return cachedDemoArticles;
}

export async function loadStartupFallbackArticles() {
  if (!cachedStartupArticles) {
    const content = await readFile(startupFallbackPath, 'utf8');
    cachedStartupArticles = JSON.parse(content);
  }

  return cachedStartupArticles;
}

export async function loadFallbackEvents({ limit = 10, region, category } = {}) {
  const articles = await loadFallbackArticles();
  return normalizeArticles(articles, 'fallback')
    .filter((event) => event.relevant)
    .filter((event) => !region || region === 'Global' || event.region === region)
    .filter((event) => !category || category === 'all' || event.category === category)
    .slice(0, limit);
}

export async function loadDemoEvents({ limit = 10, region, category } = {}) {
  const articles = await loadDemoArticles();
  return normalizeArticles(articles, 'demo')
    .filter((event) => event.relevant)
    .filter((event) => !region || region === 'Global' || event.region === region)
    .filter((event) => !category || category === 'all' || event.category === category)
    .slice(0, limit);
}
