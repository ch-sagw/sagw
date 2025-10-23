export const getSrcSet = ({
  params,
  src,
  variant,
}: {
  params: string;
  src: string;
  variant: string;
}): string => {
  let srcSet = '';

  switch (variant) {
    case 'portrait':
      srcSet = `
        ${src}?${params}&w=600&h=600&dpr=2&q=30 1200w,
        ${src}?${params}&w=400&h=400&dpr=2&q=30 800w,
        ${src}?${params}&w=600&h=600&q=60 600w,
        ${src}?${params}&w=400&h=400&q=60 400w
      `;
      break;

    case 'portraitCta':
      srcSet = `
        ${src}?${params}&w=200&h=200&dpr=2&q=30 400w,
        ${src}?${params}&w=100&h=100&dpr=2&q=30 200w,
        ${src}?${params}&w=200&h=200&q=60 200w,
        ${src}?${params}&w=100&h=100&q=60 100w
      `;
      break;

    case 'publicationTeaser':
      srcSet = `
        ${src}?${params}&w=80&h=114&dpr=2&q=30 160w,
        ${src}?${params}&w=80&h=114&q=60 80w
      `;
      break;

    default:
      console.log('Unknown variant. Using default settings.');
    // Fallback logic for unknown variants
  }

  console.log(srcSet.trim());

  return srcSet.trim();

};

export const getSizes = (variant: string): string => {
  let sizes = '';

  switch (variant) {
    case 'portrait':
      sizes = '(min-width: 64rem) 600px, 400px';
      break;

    case 'portraitCta':
      sizes = '(min-width: 64rem) 200px, 100px';
      break;

    case 'publicationTeaser':
      sizes = '80px';
      break;

    default:
      console.log('Unknown variant. Using default settings.');
    // Fallback logic for unknown variants
  }

  return sizes;
};
