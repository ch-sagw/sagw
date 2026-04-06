export const getServerSideURL = (): string => {

  // Prod and Test Env
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    return process.env.NEXT_PUBLIC_SERVER_URL;
  }

  // Preview Env
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local dev env
  return 'http://localhost:3000';
};

export const absoluteUrlFromPathname = (pathname: string): string => {
  const origin = getServerSideURL()
    .replace(/\/+$/u, '');

  return new URL(pathname, `${origin}/`).href;
};
