import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload';
import {
  deleteFromGumlet,
  uploadToGumletFromUrl,
} from '@/utilities/gumlet';

export const syncVideoWithGumlet: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const hasNewFile = doc.filename && doc.filename !== previousDoc?.filename;
  const wasDeleted = !doc.filename && previousDoc?.filename;

  // Remove the video from Gumlet as well, when it
  // is deleted in Payload.
  if (wasDeleted && previousDoc?.gumletAssetId) {
    await deleteFromGumlet(previousDoc.gumletAssetId);
    await req.payload.update({
      collection: 'videos',
      data: {
        gumletAssetId: null,
      },
      id: doc.id,
    });

    return;
  }

  // Upload the video to Gumlet
  if (hasNewFile) {

    if (previousDoc?.gumletAssetId) {
      await deleteFromGumlet(previousDoc.gumletAssetId);
    }

    if (!doc.url || !doc.filename) {
      throw new Error('Video URL or filename missing');
    }

    const gumletAsset = await uploadToGumletFromUrl({
      fileName: doc.filename,
      fileTitle: doc.title,
      fileUrl: doc.url,
    });

    // Get duration from Gumlet
    // const duration = await getGumletAssetDuration(gumletAsset.id);
    // TODO processing takes quite some time. We could create a Webhook
    // setup to await the "Video Asset Processed" event from Gumlet.
    // Unsure whether it is worth... Seems a bit overengineered since
    // we do not expect many videos. Better to add the video duration
    // manually...

    // Update the document after the upload
    await req.payload.update({
      collection: 'videos',
      data: {
        gumletAssetId: gumletAsset.id,
      },
      id: doc.id,
    });

    console.log('Video was successfully uploaded to Gumlet');
  }
};

export const deleteVideoFromGumlet: CollectionAfterDeleteHook = async ({
  doc,
}) => {
  if (!doc) {
    return;
  }

  if (doc.gumletAssetId) {
    try {
      await deleteFromGumlet(doc.gumletAssetId);

      console.log(`Gumlet asset ${doc.gumletAssetId} deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete Gumlet asset ${doc.gumletAssetId}:`, error);
    }
  }
};
