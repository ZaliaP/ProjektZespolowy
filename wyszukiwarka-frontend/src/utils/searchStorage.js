const RECENT_SEARCHES_KEY = 'skyflyer_recent_searches';
const MAX_RECENT_SEARCHES = 5;

export function getRecentSearches() {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(search) {
  const recent = getRecentSearches();
  const normalized = {
    origin: search.origin,
    dest: search.dest,
    dateOut: search.dateOut,
    dateReturn: search.dateReturn || '',
    tripType: search.tripType,
    passengers: search.passengers || 1,
    cabinClass: search.cabinClass || 'economy',
  };

  const deduped = recent.filter(
    (item) =>
      !(
        item.origin === normalized.origin &&
        item.dest === normalized.dest &&
        item.dateOut === normalized.dateOut &&
        item.dateReturn === normalized.dateReturn &&
        item.tripType === normalized.tripType &&
        item.passengers === normalized.passengers &&
        item.cabinClass === normalized.cabinClass
      ),
  );

  const updated = [normalized, ...deduped].slice(0, MAX_RECENT_SEARCHES);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));

  return updated;
}

export function buildSearchQuery(search) {
  const params = new URLSearchParams();

  if (search.origin) params.append('origin', search.origin);
  if (search.dest) params.append('dest', search.dest);
  if (search.dateOut) params.append('dateOut', search.dateOut);
  if (search.dateReturn && search.tripType === 'roundTrip') {
    params.append('dateReturn', search.dateReturn);
  }

  params.append('tripType', search.tripType || 'roundTrip');
  params.append('passengers', String(search.passengers || 1));
  params.append('cabinClass', search.cabinClass || 'economy');

  return params.toString();
}
