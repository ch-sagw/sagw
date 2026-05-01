import { Video } from '@/payload-types';
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload';

type SyncVideoWithGumletArgs = Parameters<CollectionAfterChangeHook<Video>>[0];

export const syncVideoWithGumlet: CollectionAfterChangeHook = async (props: SyncVideoWithGumletArgs) => {

  const {
    context,
    doc,
    previousDoc,
    req,
  } = props;

  console.log('[DEBUG]: hook start. doc.id:', doc.id);
  console.log('[DEBUG]: hook start. req:', req);
  console.log('[DEBUG]: hook start. doc:', doc);

  // If gumletAssetId was added after upload or
  // when we run Playwright tests, we immediately
  // return
  if (context?.skipGumletSync) {
    console.log('[DEBUG]: skipGumletSync -> return');

    return props;
  }

  const {
    deleteFromGumlet,
    uploadToGumletFromUrl,
  } = await import('@/utilities/gumlet');

  const hasNewFile = doc.filename && doc.filename !== previousDoc?.filename;
  const wasDeleted = !doc.filename && previousDoc?.filename;

  // Remove the video from Gumlet as well, when it
  // is deleted in Payload.
  if (
    wasDeleted &&
    previousDoc?.gumletAssetId
  ) {
    console.log('[DEBUG]: deleteFromGumlet');
    await deleteFromGumlet(previousDoc.gumletAssetId);

    return props;
  } else if (wasDeleted) {
    console.log('[DEBUG]: return');

    return props;
  }

  // Upload the video to Gumlet
  if (hasNewFile) {
    console.log('[DEBUG]: hasNewFile');

    if (previousDoc?.gumletAssetId) {
      console.log('[DEBUG]: deleteFromGumlet 2');
      await deleteFromGumlet(previousDoc.gumletAssetId);
    }

    if (!doc.url || !doc.filename) {
      throw new Error('Video URL or filename missing');
    }

    console.log('[DEBUG]: uploadToGumletFromUrl before');

    const gumletAsset = await uploadToGumletFromUrl({
      id: doc.id,
    });

    console.log('[DEBUG]: uploadToGumletFromUrl after');

    // Update the document after the upload
    await req.payload.update({
      collection: 'videos',
      context: {
        skipGumletSync: true,
      },
      data: {
        gumletAssetId: gumletAsset.id,
      },
      id: doc.id,
    });
  }

  return props;

};

export const deleteVideoFromGumlet: CollectionAfterDeleteHook = async (props) => {

  const {
    context,
    doc,
  } = props;

  if (!doc || context?.skipGumletSync) {
    return props;
  }

  const {
    deleteFromGumlet,
  } = await import('@/utilities/gumlet');

  if (doc.gumletAssetId) {
    try {
      await deleteFromGumlet(doc.gumletAssetId);

      console.log(`Gumlet asset ${doc.gumletAssetId} deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete Gumlet
      asset ${doc.gumletAssetId}:`, error);
    }
  }

  return props;
};
