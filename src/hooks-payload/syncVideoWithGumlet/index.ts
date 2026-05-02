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
      fileTitle: doc.title,
      url: doc.url,
    });

    // Update the document after the upload

    // PASS REQ OBJECT:
    // Payload's afterChange hook can still run within the same database
    // transaction as the original create operation. When we call findByID
    // without passing req, it runs outside that transaction — so it
    // queries the database directly and the freshly created document isn't
    // visible yet because the transaction hasn't committed. Note: not
    // relevant locally since we don't have replica-set and therefore no
    // transactions

    // PASS skipCloudStorage:
    // When we added req to the update call, the same req
    // object — including its req.file from the original create request —
    // was shared into the nested update. The cloud storage plugin's
    // afterChange hook runs for every update on videos, and it has logic
    // that says: "if there's a file in the request and this is an update
    // operation with a previousDoc that has a filename → delete the old
    // blob file." Since our nested update matched all those conditions, it
    // deleted the freshly-uploaded blob file. Then nothing was re-uploaded
    // (client upload files are filtered from server-side re-upload),
    // leaving a broken URL in the DB.

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
