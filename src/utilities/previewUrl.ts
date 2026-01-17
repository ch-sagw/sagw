import type { Config } from '@/payload-types';
import { getPageUrl } from '@/utilities/getPageUrl';
import { getPayloadCached } from './getPayloadCached';

export const preview = async (
  doc: Record<string, unknown>,
  {
    locale,
  }: {
    locale: string;
  },
): Promise<string> => {
  const payload = await getPayloadCached();
  const pageUrl = await getPageUrl({
    locale: locale as Config['locale'],
    pageId: doc.id as string,
    payload,
  });

  return pageUrl;

};
