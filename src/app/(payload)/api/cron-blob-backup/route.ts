import blobBackup from '@/backup-restore/cron-jobs/blob-backup';
import { getErrorMessage } from '@/backup-restore/helpers/try-catch-error';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest): Promise<Response> => {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    await blobBackup();

    return Response.json({
      message: 'Blob backup done.',
      success: true,
    });
  } catch (err) {
    const errorMessage = `Blob backup error: ${getErrorMessage(err)}`;

    return new Response(errorMessage, {
      status: 501,
    });
  }

};
