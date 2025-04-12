/**
 * Requires the follwoing env-variables:
 * - BLOB_READ_WRITE_TOKEN
 */

import {
  del,
  list,
  type ListBlobResult,
  type ListBlobResultBlob,
  put,
} from '@vercel/blob';

export const addBlob = async (file: string, content: Buffer<ArrayBuffer> | ReadableStream<Uint8Array<ArrayBufferLike>>): Promise<void> => {
  await put(
    file,
    content,
    {
      access: 'public',
      addRandomSuffix: false,
    },
  );
};

export const deleteAllBlobs = async (): Promise<void> => {
  let cursor;

  /* eslint-disable no-await-in-loop */
  do {
    const listResult: ListBlobResult = await list({
      cursor,
      limit: 1000,
    });

    if (listResult.blobs.length > 0) {
      await del(listResult.blobs.map((blob) => blob.url));
    }

    /* eslint-disable prefer-destructuring */
    cursor = listResult.cursor;
    /* eslint-enable prefer-destructuring */
  } while (cursor);
  /* eslint-enable no-await-in-loop */

};

export const getAllBlobs = async (): Promise<[(ListBlobResultBlob | undefined)?]> => {
  let cursor;
  const results: [ListBlobResultBlob?] = [];

  /* eslint-disable no-await-in-loop */
  do {
    const listResult: ListBlobResult = await list({
      cursor,
      limit: 250,
    });

    if (listResult.blobs.length > 0) {
      results.push(...listResult.blobs);
    }

    /* eslint-disable prefer-destructuring */
    cursor = listResult.cursor;
    /* eslint-enable prefer-destructuring */
  } while (cursor);
  /* eslint-enable no-await-in-loop */

  return results;
};
