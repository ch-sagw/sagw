'use server';

import { JSX } from 'react';
import ZenodoDocumentChooserClient from './ZenodoDocumentChooserClient';

interface InterfaceZenodoResponse {
  data?: {
    id: string;
    title: string;
    files: {
      format: string;
      link: string;
      size: number | null;
    }
  }
  error?: any
  ok: boolean
}

export const verifyZenodoId = async (id: string): Promise<InterfaceZenodoResponse> => {
  try {
    const res = await fetch(
      `https://zenodo.org/api/records/${id}?access_token=${process.env.ZENODO_TOKEN}`,
      {
        cache: 'no-store',
      },
    );

    if (!res.ok) {
      throw new Error(`Zenodo API returned ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data.files) || data.files.length === 0) {
      return {
        error: 'Record has no files',
        ok: false,
      };
    }

    const files = Array.isArray(data.files) && data.files.length > 0
      ? data.files.map((file: any) => {

        const format = file.key?.split('.')
          .pop()
          ?.toLowerCase() ?? 'unknown';

        // Convert size to MB, rounded to 2 decimals
        const size = file.size
          ? Number((file.size / (1024 * 1024)).toFixed(2))
          : null;

        return {
          format,
          link: file?.links?.self ?? file?.links?.download,
          size,
        };
      })
      : [];

    const returnData = {
      files,
      id,
      title: data.metadata?.title ?? null,
    };

    console.log(returnData);

    return {
      data: returnData,
      ok: true,
    };
  } catch (err: any) {
    return {
      error: err.message,
      ok: false,
    };
  }
};

const ZenodoDocumentChooser = (): JSX.Element => (
  <div>
    <ZenodoDocumentChooserClient verifyAction={verifyZenodoId} />
  </div>
);

export default ZenodoDocumentChooser;
