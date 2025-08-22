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
    const response = await fetch(
      `https://zenodo.org/api/records/${id}?access_token=${token}`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return {
        error: `Zenodo API returned ${response.status}`,
        ok: false,
      };
    }

    const data: InterfaceZenodoApiRawResponse = await response.json();

    if (!data.files || data.files.length === 0) {
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

    return {
      error: message,
      ok: false,
    };
  }
};
