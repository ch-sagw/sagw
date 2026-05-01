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

  console.log('[DEBUG]: hook start. doc:', doc);

  // If gumletAssetId was added after upload or
  // when we run Playwright tests, we immediately
  // return
  if (context?.skipGumletSync) {
    return doc;
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
    await deleteFromGumlet(previousDoc.gumletAssetId);

    return doc;
  } else if (wasDeleted) {
    return doc;
  }

  // Upload the video to Gumlet
  if (hasNewFile) {
    console.log('[DEBUG]: hasNewFile');

    if (previousDoc?.gumletAssetId) {
      await deleteFromGumlet(previousDoc.gumletAssetId);
    }

    if (!doc.url || !doc.filename) {
      throw new Error('Video URL or filename missing');
    }

    console.log('[DEBUG]: uploadToGumletFromUrl before');

    const gumletAsset = await uploadToGumletFromUrl({
      title: doc.title,
      url: doc.url,
    });

    console.log('gumletAsset', gumletAsset);

    console.log('[DEBUG]: uploadToGumletFromUrl after');

    // Update the document after the upload
    if (gumletAsset) {
      console.log('[DEBUG]: gummletAsset:', gumletAsset);

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

  }

  return doc;

};

export const deleteVideoFromGumlet: CollectionAfterDeleteHook = async (props) => {

  const {
    context,
    doc,
  } = props;

  if (!doc || context?.skipGumletSync) {
    return doc;
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

  return doc;
};
