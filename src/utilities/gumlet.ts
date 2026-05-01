/* eslint-disable @typescript-eslint/naming-convention */
import 'server-only';

export interface InterfaceGumletAsset {
  id: string;
}

export const uploadToGumletFromUrl = async ({
  url,
  fileTitle,
}: {
  url: string;
  fileTitle: string;
}): Promise<InterfaceGumletAsset> => {
  const collectionId = process.env.GUMLET_COLLECTION_ID;

  console.log('[DEBUG] uploadToGumletFromUrl, url', url);
  console.log('[DEBUG] uploadToGumletFromUrl, fileTitle', fileTitle);

  const payload = {
    collection_id: collectionId,
    format: 'ABR',
    input: url,
    title: fileTitle,
  };

  try {
    const res = await fetch('https://api.gumlet.com/v1/video/assets', {
      body: JSON.stringify(payload),
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.GUMLET_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    console.log('[DEBUG] uploadToGumletFromUrl, fetch result', res);

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
