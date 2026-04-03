// canonical redirect path for CMS + runtime: strips leading slashes and
// trailing slashes, except the root locale path `xx/` (length 3) stays as-is.

export const normalizeRedirectPath = (value: string): string => {
  let s = value.replace(/^[/\uFF0F]+/u, '');

  while (s.length > 3 && s.endsWith('/')) {
    s = s.slice(0, -1);
  }

  return s;
};
