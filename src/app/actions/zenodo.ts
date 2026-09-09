'use server';

export interface InterfaceZenodoFile {
  format: string;
  link: string;
  size: number | null;
}

export interface InterfaceZenodoData {
  id: string;
  title: string | null;
  files: InterfaceZenodoFile[];
  date: string | null;
}

export interface InterfaceZenodoResponse {
  ok: boolean;
  data?: InterfaceZenodoData;
  error?: string;
}

interface InterfaceZenodoFileRaw {
  key: string;
  links: {
    self?: string;
    download?: string;
  };
  size?: number;
}

interface InterfaceZenodoApiRawResponse {
  metadata?: {

    /* eslint-disable @typescript-eslint/naming-convention */
    publication_date: string;
    /* eslint-enable @typescript-eslint/naming-convention */

    title?: string;
  };
  files?: InterfaceZenodoFileRaw[];
}

const ZENODO_API_BASE = 'https://zenodo.org/api/records';

/*
 * Zenodo's edge protection blocks requests whose User-Agent is the bare
 * default sent by Node's built-in fetch ("node") with a 403 "unusual traffic"
 * HTML page. Always send a descriptive UA.
 */
const ZENODO_USER_AGENT = 'sagw-website/1.0 (Payload CMS; +https://sagw.ch)';

const LOG_PREFIX = '[verifyZenodo]';

/* Turn an (HTML) error body into a short, single-line, loggable snippet. */
const summarizeBody = (body: string, maxLength = 300): string => body
  .replace(/<[^>]*>/gu, ' ')
  .replace(/\s+/gu, ' ')
  .trim()
  .slice(0, maxLength);

/*
 * Derive a short, human-readable reason for the admin UI: Zenodo's JSON
 * errors carry a `message`, its bot protection returns HTML (use snippet).
 */
const extractErrorReason = (rawBody: string, contentType: string, fallback: string): string => {
  if (!contentType.includes('application/json')) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawBody) as { message?: unknown };

    return typeof parsed.message === 'string'
      ? parsed.message
      : fallback;
  } catch {
    return fallback;
  }
};

export const verifyZenodo = async (id: string): Promise<InterfaceZenodoResponse> => {
  if (!id) {
    return {
      error: 'Missing Zenodo ID',
      ok: false,
    };
  }

  const token = process.env.ZENODO_TOKEN;

  if (!token) {
    return {
      error: 'ZENODO_TOKEN not set',
      ok: false,
    };
  }

  try {
    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new Error('Invalid Zenodo record ID');
    }

    const url = `${ZENODO_API_BASE}/${parsedId}`;

    console.info(`${LOG_PREFIX} requesting record`, {
      id: parsedId,
      tokenLength: token.length,
      url,
      userAgent: ZENODO_USER_AGENT,
    });

    const startedAt = Date.now();

    let response: Response;

    try {
      response = await fetch(url, {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          // Send the token as a header instead of a query param so it never
          // ends up in URLs, logs or proxies.
          'Authorization': `Bearer ${token}`,
          'User-Agent': ZENODO_USER_AGENT,
        },
      });
    } catch (fetchError) {
      console.error(`${LOG_PREFIX} network error while calling Zenodo`, {
        cause: fetchError instanceof Error
          ? (fetchError as Error & { cause?: unknown }).cause
          : undefined,
        id: parsedId,
        message: fetchError instanceof Error
          ? fetchError.message
          : String(fetchError),
        url,
      });

      throw fetchError;
    }

    const durationMs = Date.now() - startedAt;
    const contentType = response.headers.get('content-type') ?? '';

    if (!response.ok) {
      const rawBody = await response.text()
        .catch(() => '');
      const bodySnippet = summarizeBody(rawBody);

      console.error(`${LOG_PREFIX} Zenodo API returned a non-OK status`, {
        bodySnippet,
        contentType,
        durationMs,
        headers: {
          'retry-after': response.headers.get('retry-after'),
          'server': response.headers.get('server'),
          'www-authenticate': response.headers.get('www-authenticate'),
          'x-ratelimit-limit': response.headers.get('x-ratelimit-limit'),
          'x-ratelimit-remaining': response.headers.get('x-ratelimit-remaining'),
        },
        id: parsedId,
        status: response.status,
        statusText: response.statusText,
        url,
      });

      const reason = extractErrorReason(rawBody, contentType, bodySnippet);

      const hint = reason
        ? ` - ${reason.slice(0, 160)}`
        : '';

      return {
        error: `Zenodo API returned ${response.status}${response.statusText
          ? ` ${response.statusText}`
          : ''}${hint}`,
        ok: false,
      };
    }

    let data: InterfaceZenodoApiRawResponse;

    try {
      data = await response.json() as InterfaceZenodoApiRawResponse;
    } catch (parseError) {
      console.error(`${LOG_PREFIX} could not parse Zenodo response as JSON`, {
        contentType,
        durationMs,
        id: parsedId,
        message: parseError instanceof Error
          ? parseError.message
          : String(parseError),
        status: response.status,
        url,
      });

      throw new Error(`Zenodo API returned a non-JSON response (${contentType || 'unknown content-type'})`);
    }

    console.info(`${LOG_PREFIX} record fetched`, {
      durationMs,
      fileCount: data.files?.length ?? 0,
      id: parsedId,
      status: response.status,
      title: data.metadata?.title ?? null,
    });

    if (!data.files || data.files.length === 0) {
      console.warn(`${LOG_PREFIX} record has no files`, {
        id: parsedId,
      });

      return {
        error: 'Record has no files',
        ok: false,
      };
    }

    const files: InterfaceZenodoFile[] = data.files.map((file) => ({
      format: file.key?.split('.')
        .pop()
        ?.toLowerCase() ?? 'unknown',
      link: file.links?.self ?? file.links?.download ?? '',
      size: file.size
        ? Number((file.size / (1024 * 1024)).toFixed(2))
        : null,
    }));

    return {
      data: {
        date: data.metadata?.publication_date ?? null,
        files,
        id,
        title: data.metadata?.title ?? null,
      },
      ok: true,
    };
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : 'Unknown error';

    console.error(`${LOG_PREFIX} failed`, {
      id,
      message,
    });

    return {
      error: message,
      ok: false,
    };
  }
};
