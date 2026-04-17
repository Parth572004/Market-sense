export const categoryColors = {
  energy: 'text-error bg-error/10',
  geopolitics: 'text-error bg-error/10',
  inflation: 'text-primary bg-primary/10',
  indian_politics: 'text-secondary bg-secondary/10',
  global_markets: 'text-secondary bg-secondary/10'
};

export function getCategoryColor(category) {
  return categoryColors[category] || 'text-secondary bg-secondary/10';
}

export function formatCategory(category = '') {
  return category
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
