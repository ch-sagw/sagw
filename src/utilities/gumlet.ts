/* eslint-disable @typescript-eslint/naming-convention */
import 'server-only';

const gumletApiUrl = 'https://api.gumlet.com/v1/video/assets';

export const uploadToGumletFromUrl = async ({
  url,
  fileTitle,
}: {
  url: string;
  fileTitle: string;
}): Promise<string> => {
  const collectionId = process.env.GUMLET_COLLECTION_ID;

  try {
    const res = await fetch(gumletApiUrl, {
      body: JSON.stringify({
        collection_id: collectionId,
        format: 'ABR',
        input: url,
        title: fileTitle,
      }),
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

    return json.asset_id;

  } catch (error) {
    throw new Error(`Unable to upload file to Gumlet: ${error instanceof Error
      ? error.message
      : 'Unknown error'}`);
  }
};

export const deleteFromGumlet = async (assetId: string): Promise<void> => {
  try {
    const res = await fetch(`${gumletApiUrl}/${assetId}`, {
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
