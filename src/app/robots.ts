import { getServerSideURL } from '@/utilities/getUrl';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const url: string = getServerSideURL();

  return {
    rules: {
      allow: '/',
      disallow: '/admin',
      userAgent: '*',
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
