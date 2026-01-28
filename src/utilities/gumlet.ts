/* eslint-disable @typescript-eslint/naming-convention */

export interface InterfaceGumletAsset {
  id: string;
}

export const uploadToGumletFromUrl = async ({
  fileName,
  fileTitle,
  fileUrl,
}: {
  fileName: string;
  fileTitle: string;
  fileUrl: string;
}): Promise<InterfaceGumletAsset> => {
  const collectionId = process.env.GUMLET_COLLECTION_ID;
  const host = process.env.NEXT_PUBLIC_GUMLET_URL;

  let inputUrl = `${host}/${fileUrl}`;

  if (host && host.indexOf('localhost') !== -1) {
    inputUrl = `${host}/${fileName}`;
  }

  const payload = {
    collection_id: collectionId,
    format: 'abr',
    input: inputUrl,
    title: fileTitle,
  };

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
};

export const deleteFromGumlet = async (assetId: string): Promise<void> => {
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
};

// Get asset duration from Gumlet meta asset data
export const getGumletAssetDuration = async(assetId: string): Promise<number> => {
  const res = await fetch(`${process.env.GUMLET_API_URL}/${assetId}`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${process.env.GUMLET_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(`Failed to get Gumlet asset status: ${res.status} — ${text}`);
  }

  const json = await res.json() as {
    input: {
      duration?: number
    }
  };

  if (!json.input.duration) {
    throw new Error('Duration not found in Gumlet asset status');
  }

  // duration in seconds
  return json.input.duration;
};

