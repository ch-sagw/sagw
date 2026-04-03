export const getServerSideURL = (): string => {
  // We set NEXT_PUBLIC_SERVER_URL explicitly on prod and test
  // environments. try to use VERCEL_PROJECT_PRODUCTION_URL for preview
  // deployments, which should be injected by vercel automatically.
  let url = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (!url) {
    url = 'http://localhost:3000';
  }

  return url;
};

export const absoluteUrlFromPathname = (pathname: string): string => {
  const origin = getServerSideURL()
    .replace(/\/+$/u, '');

  return new URL(pathname, `${origin}/`).href;
};
