const FATHOM_API = 'https://api.usefathom.com/v1';

const toFathomDate = (d: Date): string => d.toISOString()
  .slice(0, 19)
  .replace('T', ' ');

const fathomHeaders = (apiKey: string): HeadersInit => ({
  Accept: 'application/json',
  Authorization: `Bearer ${apiKey}`,
});

/** Total pageviews in range; sums rows when API groups. */
export const getFathomPageviewTotal = async ({
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

  const res = await fetch(`${FATHOM_API}/aggregations?${params}`, {
    headers: fathomHeaders(apiKey),
    method: 'GET',
  });

  if (!res.ok) {
    const errBody = await res.text();

    throw new Error(`Fathom aggregations failed: ${res.status} ${errBody}`);
  }

  const data = await res.json() as { pageviews?: string }[];

  if (!Array.isArray(data)) {
    return 0;
  }

  return data.reduce((sum, row) => {
    const raw = row.pageviews;

    if (raw === undefined) {
      return sum;
    }

    return sum + (Number.parseInt(raw, 10) || 0);
  }, 0);
};
