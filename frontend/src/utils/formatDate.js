const LANGUAGE_LOCALES = {
  en: 'en-US',
  hi: 'hi-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  gu: 'gu-IN'
};

const DATE_FALLBACKS = {
  en: {
    now: 'now',
    recently: 'recently',
    timeUnavailable: 'Time unavailable'
  },
  hi: {
    now: '\u0905\u092d\u0940',
    recently: '\u0939\u093e\u0932 \u0939\u0940 \u092e\u0947\u0902',
    timeUnavailable: '\u0938\u092e\u092f \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902'
  },
  bn: {
    now: '\u098f\u0996\u09a8',
    recently: '\u09b8\u09ae\u09cd\u09aa\u09cd\u09b0\u09a4\u09bf',
    timeUnavailable: '\u09b8\u09ae\u09af\u09bc \u0989\u09aa\u09b2\u09ac\u09cd\u09a7 \u09a8\u09af\u09bc'
  },
  mr: {
    now: '\u0906\u0924\u093e',
    recently: '\u0905\u0932\u0940\u0915\u0921\u0947',
    timeUnavailable: '\u0935\u0947\u0933 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u093e\u0939\u0940'
  },
  te: {
    now: '\u0c07\u0c2a\u0c4d\u0c2a\u0c41\u0c21\u0c41',
    recently: '\u0c07\u0c1f\u0c40\u0c35\u0c32',
    timeUnavailable: '\u0c38\u0c2e\u0c2f\u0c02 \u0c05\u0c02\u0c26\u0c41\u0c2c\u0c3e\u0c1f\u0c41\u0c32\u0c4b \u0c32\u0c47\u0c26\u0c41'
  },
  ta: {
    now: '\u0b87\u0baa\u0bcd\u0baa\u0bcb\u0ba4\u0bc1',
    recently: '\u0b9a\u0bae\u0bc0\u0baa\u0ba4\u0bcd\u0ba4\u0bbf\u0bb2\u0bcd',
    timeUnavailable: '\u0ba8\u0bc7\u0bb0\u0bae\u0bcd \u0b95\u0bbf\u0b9f\u0bc8\u0b95\u0bcd\u0b95\u0bb5\u0bbf\u0bb2\u0bcd\u0bb2\u0bc8'
  },
  gu: {
    now: '\u0ab9\u0aae\u0aa3\u0abe\u0a82',
    recently: '\u0aa4\u0abe\u0a9c\u0ac7\u0aa4\u0ab0\u0aae\u0abe\u0a82',
    timeUnavailable: '\u0ab8\u0aae\u0aaf \u0a89\u0aaa\u0ab2\u0aac\u0acd\u0aa7 \u0aa8\u0aa5\u0ac0'
  }
};

function getLocale(language = 'en') {
  return LANGUAGE_LOCALES[language] || LANGUAGE_LOCALES.en;
}

function getFallback(language = 'en', key = 'recently') {
  return DATE_FALLBACKS[language]?.[key] || DATE_FALLBACKS.en[key];
}

function selectRelativeUnit(diffMs) {
  const seconds = Math.round(diffMs / 1000);
  const absSeconds = Math.abs(seconds);

  if (absSeconds < 60) return { value: seconds, unit: 'second' };

  const minutes = Math.round(seconds / 60);
  const absMinutes = Math.abs(minutes);
  if (absMinutes < 60) return { value: minutes, unit: 'minute' };

  const hours = Math.round(minutes / 60);
  const absHours = Math.abs(hours);
  if (absHours < 24) return { value: hours, unit: 'hour' };

  const days = Math.round(hours / 24);
  return { value: days, unit: 'day' };
}

export function formatRelativeDate(value, language = 'en') {
  if (!value) return getFallback(language, 'now');

  try {
    const date = new Date(value);
    const { value: amount, unit } = selectRelativeUnit(date.getTime() - Date.now());
    return new Intl.RelativeTimeFormat(getLocale(language), {
      numeric: 'auto'
    }).format(amount, unit);
  } catch {
    return getFallback(language, 'recently');
  }
}

export function formatNewsTimestamp(value, language = 'en') {
  if (!value) {
    return getFallback(language, 'timeUnavailable');
  }

  try {
    return new Intl.DateTimeFormat(getLocale(language), {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return getFallback(language, 'recently');
  }
}
