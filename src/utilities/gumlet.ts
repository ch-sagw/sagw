/* eslint-disable @typescript-eslint/naming-convention */
import 'server-only';
import { getPayloadCached } from './getPayloadCached';

export interface InterfaceGumletAsset {
  id: string;
}

export const uploadToGumletFromUrl = async ({
  id,
}: {
  id: string,
}): Promise<InterfaceGumletAsset> => {
  const collectionId = process.env.GUMLET_COLLECTION_ID;
  const payloadInstance = await getPayloadCached();

  const freshDoc = await payloadInstance.findByID({
    collection: 'videos',
    id,
  });

  if (!freshDoc) {
    throw new Error('Video not found.');
  }

  console.log('[debug]: fresh doc', freshDoc);

  const payload = {
    collection_id: collectionId,
    format: 'abr',
    input: freshDoc.url,
    title: freshDoc.title,
  };

  try {
    const res = await fetch(`${process.env.GUMLET_API_URL}`, {
      body: JSON.stringify(payload),
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GUMLET_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!res.ok) {
      const text = await res.text();

      throw new Error(`Gumlet upload failed: ${res.status} — ${text}`);
    }

    const json = (await res.json()) as {
      asset_id: string;
    };

    return {
      id: json.asset_id,
    };
  } catch (error) {
    throw new Error(`Unable to upload file to Gumlet: ${error instanceof Error
      ? error.message
      : 'Unknown error'}`);
  }
};

export const deleteFromGumlet = async (assetId: string): Promise<void> => {
  try {
    const res = await fetch(`${process.env.GUMLET_API_URL}/${assetId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GUMLET_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'DELETE',
    });

    if (!res.ok) {
      const err = await res.text();

      throw new Error(`Unable to delete file from Gumlet: ${err}`);
    }
  } catch (error) {
    throw new Error(`Unable to delete file from Gumlet: ${
      error instanceof Error
        ? error.message
        : 'Unknown error'
    }`);
  }
};
