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

  console.log('[DEBUG] --------------------------');
  console.log('----------------------------------');

  console.log('---->> [DEBUG: hook] hook');

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

  console.log('---->> [DEBUG: hook] hasNewFile', hasNewFile);

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

    console.log('---->> [DEBUG: hook] will upload to gumlet');

    const gumletAsset = await uploadToGumletFromUrl({
      fileTitle: doc.title,
      url: doc.url,
    });

    console.log('---->> [DEBUG: hook] hook did upload to gumlet');

    // Update the document after the upload

    console.log('---->> [DEBUG: hook] payload update');
    console.log('---->> [DEBUG: hook] doc', doc);
    console.log('---->> [DEBUG: hook] gumletAsset', gumletAsset);

    const checkVideoDocs = await req.payload.findByID({
      collection: 'videos',
      id: doc.id,
      req,
    });

    console.log('---->> [DEBUG: hook] checkVideoDocs', checkVideoDocs);

    await req.payload.update({
      collection: 'videos',
      context: {
        skipCloudStorage: true,
        skipGumletSync: true,
      },
      data: {
        gumletAssetId: gumletAsset,
      },
      id: doc.id,
      req,
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
