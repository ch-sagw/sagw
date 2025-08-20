import {
  NextRequest, NextResponse,
} from 'next/server';

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
    title?: string;

    /* eslint-disable @typescript-eslint/naming-convention */
    publication_date: string;
    /* eslint-enable @typescript-eslint/naming-convention */
  };
  files?: InterfaceZenodoFileRaw[];
}

interface InterfaceZenodoFile {
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

export const GET = async (req: NextRequest): Promise<NextResponse<InterfaceZenodoResponse>> => {
  const id = req.nextUrl.searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      {
        error: 'Missing Zenodo ID',
        ok: false,
      },
      {
        status: 400,
      },
    );
  }

  const token = process.env.ZENODO_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error: 'ZENODO_TOKEN not set',
        ok: false,
      },
      {
        status: 500,
      },
    );
  }

  try {
    const response = await fetch(
      `https://zenodo.org/api/records/${id}?access_token=${token}`,
      {
        cache: 'no-store',
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Zenodo API returned ${response.status}`,
          ok: false,
        },
        {
          status: response.status,
        },
      );
    }

    const data: InterfaceZenodoApiRawResponse = await response.json();

    if (!data.files || data.files.length === 0) {
      return NextResponse.json({
        error: 'Record has no files',
        ok: false,
      });
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

    const result: InterfaceZenodoData = {
      date: data.metadata?.publication_date ?? null,
      files,
      id,
      title: data.metadata?.title ?? null,
    };

    return NextResponse.json({
      data: result,
      ok: true,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : 'Unknown error';

    return NextResponse.json({
      error: message,
      ok: false,
    });
  }
};
