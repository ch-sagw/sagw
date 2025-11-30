import { del } from '@vercel/blob';

export const deleteBlob = async (url: string): Promise<void> => {
  try {
    await del(url);
  } catch {
    console.log('Was not able to delete vercel blob.');
  }
};

