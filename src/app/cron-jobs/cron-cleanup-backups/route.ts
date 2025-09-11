import type { NextRequest } from 'next/server';
import cleanupBackups from '@/backup-restore/cron-jobs/backups-cleanup';
import { getErrorMessage } from '@/backup-restore/helpers/try-catch-error';

// defaults to 300. per docs, max should be 800. but vercel
// returns an error if set to 800.
// https://vercel.com/docs/functions/limitations#max-duration
export const maxDuration = 300;

export const GET = async (request: NextRequest): Promise<Response> => {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    await cleanupBackups();

    return Response.json({
      message: 'Cleanup backups done.',
      success: true,
    });
  } catch (err) {
    const errorMessage = `Cleanup backups error: ${getErrorMessage(err)}`;

    return new Response(errorMessage, {
      status: 501,
    });
  }
};
