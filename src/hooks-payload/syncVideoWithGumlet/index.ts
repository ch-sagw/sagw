import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload';

export const syncVideoWithGumlet: CollectionAfterChangeHook = async ({
  context,
  doc,
  previousDoc,
  req,
}) => {

  // If gumletAssetId was added after upload or
  // when we run Playwright tests, we immediately
  // return
  if (context?.skipGumletSync) {
    return;
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

    return;
  } else if (wasDeleted) {
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

};

export const deleteVideoFromGumlet: CollectionAfterDeleteHook = async ({
  context,
  doc,
}) => {
  if (!doc || context?.skipGumletSync) {
    return;
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
};
