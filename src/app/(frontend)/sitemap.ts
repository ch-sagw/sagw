import type { MetadataRoute } from 'next';
import { generateStaticParams } from '@/app/(frontend)/utilities/generateStaticParams';

export const dynamic = 'force-dynamic';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const entries = await generateStaticParams({
    mode: 'sitemap',
  });

  return entries.map((entry) => ({
    alternates: entry.alternates,
    lastModified: entry.lastModified,
    url: entry.absoluteUrl,
  }));
};

export default sitemap;
