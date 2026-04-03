export const getServerSideURL = (): string => {
  // We set NEXT_PUBLIC_SERVER_URL explicitly on prod and test
  // environments. try to use VERCEL_PROJECT_PRODUCTION_URL for preview
  // deployments, which should be injected by vercel automatically.
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }

  return 'http://localhost:3000';
};

export const absoluteUrlFromPathname = (pathname: string): string => {
  const origin = getServerSideURL()
    .replace(/\/+$/u, '');

  return new URL(pathname, `${origin}/`).href;
};
