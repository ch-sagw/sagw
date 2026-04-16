const encodePathSegment = (segment: string): string => {
  if (segment === '') {
    return segment;
  }

  try {
    return encodeURIComponent(decodeURIComponent(segment));
  } catch {
    return encodeURIComponent(segment);
  }
};

export const encodeURLPath = (path: string): string => path
  .split('/')
  .map(encodePathSegment)
  .join('/');
