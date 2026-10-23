const FATHOM_API = 'https://api.usefathom.com/v1';

const toFathomDate = (d: Date): string => d.toISOString()
  .slice(0, 19)
  .replace('T', ' ');

const fathomHeaders = (apiKey: string): HeadersInit => ({
  Accept: 'application/json',
  Authorization: `Bearer ${apiKey}`,
});

/** Sums one aggregate column over all returned rows. */
const sumAggregate = async ({
  aggregate,
  apiKey,
  params,
}: {
  aggregate: string;
  apiKey: string;
  params: URLSearchParams;
}): Promise<number> => {
  const res = await fetch(`${FATHOM_API}/aggregations?${params}`, {
    headers: fathomHeaders(apiKey),
    method: 'GET',
  });

  if (!res.ok) {
    const errBody = await res.text();

    throw new Error(`Fathom aggregations failed: ${res.status} ${errBody}`);
  }

  const data = await res.json() as Record<string, string | undefined>[];

  if (!Array.isArray(data)) {
    return 0;
  }

  return data.reduce((sum, row) => {
    const raw = row[aggregate];

    if (raw === undefined) {
      return sum;
    }

    return sum + (Number.parseInt(raw, 10) || 0);
  }, 0);
};

/** Total pageviews in range; sums rows when API groups. */
export const getFathomPageviewTotal = ({
  apiKey,
  dateFrom,
  siteId,
}: {
  apiKey: string;
  dateFrom: Date;
  siteId: string;
}): Promise<number> => {
  /* eslint-disable @typescript-eslint/naming-convention -- Fathom API */
  const params = new URLSearchParams({
    aggregates: 'pageviews',
    date_from: toFathomDate(dateFrom),
    entity: 'pageview',
    entity_id: siteId,
  });
  /* eslint-enable @typescript-eslint/naming-convention */

  return sumAggregate({
    aggregate: 'pageviews',
    apiKey,
    params,
  });
};

/**
 * Total completions ("conversions") of one event in range. Events are
 * addressed by `site_id` + `entity_name` (goal codes are gone, see
 * https://usefathom.com/api/v1/reports#aggregation).
 */
export const getFathomEventTotal = ({
  apiKey,
  dateFrom,
  eventName,
  siteId,
}: {
  apiKey: string;
  dateFrom: Date;
  eventName: string;
  siteId: string;
}): Promise<number> => {
  /* eslint-disable @typescript-eslint/naming-convention -- Fathom API */
  const params = new URLSearchParams({
    aggregates: 'conversions',
    date_from: toFathomDate(dateFrom),
    entity: 'event',
    entity_name: eventName,
    site_id: siteId,
  });
  /* eslint-enable @typescript-eslint/naming-convention */

  return sumAggregate({
    aggregate: 'conversions',
    apiKey,
    params,
  });
};
