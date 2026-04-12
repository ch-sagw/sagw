const ADMIN_ROUTE_PREFIX = '/admin';

export const isAdminRoute = (value?: null | string): boolean => {
  if (!value) {
    return false;
  }

  try {

    // create a dummy base url
    const {
      pathname,
    } = new URL(value, 'http://localhost');

    return pathname.startsWith(ADMIN_ROUTE_PREFIX);
  } catch {
    return value.startsWith(ADMIN_ROUTE_PREFIX);
  }
};
