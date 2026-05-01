/* eslint-disable @typescript-eslint/naming-convention */
import 'server-only';

export interface InterfaceGumletAsset {
  id: string;
}

export const uploadToGumletFromUrl = async ({
  url,
  title,
}: {
  url: string;
  title: string;
}): Promise<InterfaceGumletAsset | void> => {
  try {
    const collectionId = process.env.GUMLET_COLLECTION_ID;

    console.log('[DEBUG]: collectionId', collectionId);
    console.log('[DEBUG]: url', url);
    console.log('[DEBUG]: title', title);

    const payload = {
      collection_id: collectionId,
      format: 'abr',
      input: url,
      title,
    };

    console.log('[DEBUG]: before fetch with body', payload);

    const res = await fetch('https://api.gumlet.com/v1/video/assets', {
      body: JSON.stringify(payload),
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GUMLET_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    console.log('[DEBUG]: after fetch', res);

    // if (!res.ok) {
    //   const text = await res.text();

    //   // throw new Error(`Gumlet upload failed: ${res.status} — ${text}`);
    //   console.log();
    // }

    const json = (await res.json()) as {
      asset_id: string;
    };

    return {
      id: json.asset_id,
    };
  } catch (error) {
    console.log('Unable to upload file to Gumlet', error);

    // throw new Error(`Unable to upload file to Gumlet: ${error instanceof
    // Error
    //   ? error.message
    //   : 'Unknown error'}`);
  }

  return undefined;
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
