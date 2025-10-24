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
    case 'hero':
      srcSet = `
        ${src}?${params}&w=2500&h=1406&q=60 2500w,
        ${src}?${params}&w=1000&h=562&dpr=2&q=30 2000w,
        ${src}?${params}&w=1600&h=900&q=60 1600w,
        ${src}?${params}&w=600&h=337&dpr=2&q=30 1200w,
        ${src}?${params}&w=1000&h=562&q=60 1000w,
        ${src}?${params}&w=350&h=197&dpr=2&q=30 700w,
        ${src}?${params}&w=600&h=337&q=60 600w,
        ${src}?${params}&w=350&h=197&q=60 350w,
      `;
      break;

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

  return srcSet.trim();

};

export const getSizes = (variant: string): string => {
  let sizes = '';

  switch (variant) {
    case 'hero':
      sizes = `
        (min-width: 100rem) 2500px,
        (min-width: 80rem) 1600px,
        (min-width: 40rem) 1000px,
        (min-width: 22.5rem) 600px,
        350px
      `;
      break;

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

  return sizes.trim();
};
