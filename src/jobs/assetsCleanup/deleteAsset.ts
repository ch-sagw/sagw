import type { Payload } from 'payload';
import {
  BlobNotFoundError, head,
} from '@vercel/blob';
import type {
  InterfaceAssetCandidate, InterfaceDeletionResult,
} from '@/jobs/assetsCleanup/types';
import { isRecord } from '@/jobs/assetsCleanup/collectGeneric';
import type { InterfaceAssetsCleanupConfig } from '@/jobs/assetsCleanup/config';

// ########################################################################
// Deletion of a single candidate
//
// 1. re-read the asset. if it is gone or was changed since the scan, skip.
// 2. final gate: delete mode must be confirmed (redundant on purpose)
// 3. payload.delete: runs all hooks (cache invalidation, gumlet, storage
//    plugin which removes the blob)
// 4. verify that the blob is gone (only possible with a blob token). a
//    leftover blob is reported as warning.
// ########################################################################

const errorMessage = (error: unknown): string => (error instanceof Error
  ? error.message
  : String(error));

const readCurrentUpdatedAt = async (payload: Payload, candidate: InterfaceAssetCandidate): Promise<string | null> => {
  const model = payload.db.collections[candidate.collection];
  const raw = await model
    .findById(candidate.id)
    .lean();

  if (!raw) {
    return null;
  }

  const doc: unknown = JSON.parse(JSON.stringify(raw));

  if (!isRecord(doc) || typeof doc.updatedAt !== 'string') {
    return '';
  }

  return doc.updatedAt;
};

const verifyBlobDeleted = async ({
  blobToken,
  filename,
}: {
  blobToken: string | undefined;
  filename: string;
}): Promise<{
  message: string;
  state: 'blobNotVerified' | 'blobStillPresent' | 'deleted';
}> => {
  if (!blobToken) {
    return {
      message: 'No blob token configured, blob removal not verified.',
      state: 'blobNotVerified',
    };
  }

  try {
    await head(filename, {
      token: blobToken,
    });

    return {
      message: 'Document deleted, but the blob still exists in the storage.',
      state: 'blobStillPresent',
    };
  } catch (error) {
    if (error instanceof BlobNotFoundError) {
      return {
        message: 'Document and blob deleted.',
        state: 'deleted',
      };
    }

    return {
      message: `Document deleted, blob removal could not be verified: ${errorMessage(error)}`,
      state: 'blobNotVerified',
    };
  }
};

// Final gate, evaluated immediately before payload.delete. This is
// intentionally redundant to the global fuses in runAssetsCleanup: the
// resolved mode must be 'delete' AND on deployed environments the env
// variable must (still) say so.
export const isDeleteModeConfirmed = (config: InterfaceAssetsCleanupConfig): boolean => {
  if (config.mode !== 'delete') {
    return false;
  }

  // an environment we cannot identify never deletes (mirrors resolveMode)
  if (config.env === 'unknown') {
    return false;
  }

  const isDeployedEnv = config.env === 'prod' || config.env === 'test';

  if (isDeployedEnv && process.env.ASSETS_CLEANUP_MODE !== 'delete') {
    return false;
  }

  return true;
};

export const deleteCandidate = async ({
  candidate,
  config,
  payload,
}: {
  candidate: InterfaceAssetCandidate;
  config: InterfaceAssetsCleanupConfig;
  payload: Payload;
}): Promise<InterfaceDeletionResult> => {
  try {
    const currentUpdatedAt = await readCurrentUpdatedAt(payload, candidate);

    if (currentUpdatedAt === null) {
      return {
        candidate,
        message: 'Asset no longer exists.',
        state: 'skipped',
      };
    }

    if (currentUpdatedAt !== candidate.updatedAt) {
      return {
        candidate,
        message: 'Asset was modified since the scan.',
        state: 'skipped',
      };
    }

    // last security gate: never delete unless delete mode is confirmed
    if (!isDeleteModeConfirmed(config)) {
      return {
        candidate,
        message: 'Final check failed: delete mode is not active. Nothing was deleted.',
        state: 'skipped',
      };
    }

    await payload.delete({
      collection: candidate.collection,
      context: {
        assetsCleanup: true,
      },
      depth: 0,
      id: candidate.id,
    });
  } catch (error) {
    return {
      candidate,
      message: `Deletion failed: ${errorMessage(error)}`,
      state: 'failed',
    };
  }

  const verification = await verifyBlobDeleted({
    blobToken: config.blobToken,
    filename: candidate.filename,
  });

  return {
    candidate,
    message: verification.message,
    state: verification.state,
  };
};
