import type { NextRequest } from 'next/server';
import dbBackup from '@/backup-restore/cron-jobs/db-backup';
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
    await dbBackup();

    return Response.json({
      message: 'DB backup done.',
      success: true,
    });
  } catch (err) {
    const errorMessage = `DB backup error: ${getErrorMessage(err)}`;

    return new Response(errorMessage, {
      status: 501,
    });
  }
};
