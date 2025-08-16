'use server';

import { JSX } from 'react';
import ZenodoDocumentChooserClient from './ZenodoDocumentChooserClient';

interface InterfaceZenodoResponse {
  data?: {
    size: string;
    title: string;
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

    return {
      data: {
        size: data.files?.[0]?.size,
        title: data.metadata?.title,
      },
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
