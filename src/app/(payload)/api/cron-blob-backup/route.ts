import type { NextRequest } from 'next/server';
import blobBackup from '@/backup-restore/cron-jobs/blob-backup';

// export const GET = async (request: NextRequest): Promise<Response> => {
/* eslint-disable */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  await blobBackup();

  return new Response('Blob backup done.');
};
