import 'server-only';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export const getThemeName = async ({
  id,
}: {
  id: string;
}): Promise<any> => {
  const payload = await getPayloadCached();

  const themeName = await payload.find({
    collection: 'theme',
    depth: 1,
    limit: 1,
    select: {
      themeSelector: true,
    },
    where: {
      tenant: {
        equals: id,
      },
    },
  });

  return themeName;
};
