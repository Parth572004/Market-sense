import { formatDistanceToNowStrict } from 'date-fns';

export function formatRelativeDate(value) {
  if (!value) return 'now';

  try {
    return `${formatDistanceToNowStrict(new Date(value), { addSuffix: true })}`;
  } catch {
    return 'recently';
  }
}
