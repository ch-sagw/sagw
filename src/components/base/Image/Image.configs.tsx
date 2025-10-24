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

  const nonRetinaQuality = 60;
  const retinaQuality = 30;

  switch (variant) {
    case 'content':
      srcSet = `
        ${src}?${params}&w=1250&h=703&dpr=2&q=${retinaQuality} 2500w,
        ${src}?${params}&w=1250&h=703&q=${nonRetinaQuality} 1250w,
        ${src}?${params}&w=1000&h=562&dpr=2&q=${retinaQuality} 2000w,
        ${src}?${params}&w=1000&h=562&q=${nonRetinaQuality} 1000w,
        ${src}?${params}&w=600&h=337&dpr=2&q=${retinaQuality} 1200w,
        ${src}?${params}&w=600&h=337&q=${nonRetinaQuality} 600w,
        ${src}?${params}&w=400&h=225&dpr=2&q=${retinaQuality} 800w,
        ${src}?${params}&w=400&h=225&q=${nonRetinaQuality} 400w,
      `;
      break;

    case 'contentWide':
      srcSet = `
        ${src}?${params}&w=1250&h=703&dpr=2&q=${retinaQuality} 2500w,
        ${src}?${params}&w=1250&h=703&q=${nonRetinaQuality} 1250w,
        ${src}?${params}&w=1000&h=562&dpr=2&q=${retinaQuality} 2000w,
        ${src}?${params}&w=1000&h=562&q=${nonRetinaQuality} 1000w,
        ${src}?${params}&w=600&h=337&dpr=2&q=${retinaQuality} 1200w,
        ${src}?${params}&w=600&h=337&q=${nonRetinaQuality} 600w,
        ${src}?${params}&w=400&h=225&dpr=2&q=${retinaQuality} 800w,
        ${src}?${params}&w=400&h=225&q=${nonRetinaQuality} 400w,
      `;
      break;

    case 'genericTeaser':
      srcSet = `
        ${src}?${params}&w=600&h=450&dpr=2&q=${retinaQuality} 1200w,
        ${src}?${params}&w=600&h=450&q=${nonRetinaQuality} 600w,
        ${src}?${params}&w=400&h=300&dpr=2&q=${retinaQuality} 800w,
        ${src}?${params}&w=400&h=300&q=${nonRetinaQuality} 400w,
      `;
      break;

    case 'hero':
      srcSet = `
        ${src}?${params}&w=2500&h=1406&q=${nonRetinaQuality} 2500w,
        ${src}?${params}&w=1600&h=900&q=${nonRetinaQuality} 1600w,
        ${src}?${params}&w=1000&h=562&dpr=2&q=${retinaQuality} 2000w,
        ${src}?${params}&w=1000&h=562&q=${nonRetinaQuality} 1000w,
        ${src}?${params}&w=600&h=337&dpr=2&q=${retinaQuality} 1200w,
        ${src}?${params}&w=600&h=337&q=${nonRetinaQuality} 600w,
        ${src}?${params}&w=400&h=225&dpr=2&q=${retinaQuality} 800w,
        ${src}?${params}&w=400&h=225&q=${nonRetinaQuality} 400w,
      `;
      break;

    case 'logoTeaser':
      srcSet = `
        ${src}?${params}&w=100&h=100&dpr=2&q=${retinaQuality} 200w,
        ${src}?${params}&w=100&h=100&q=${nonRetinaQuality} 100w,
      `;
      break;

    case 'portrait':
      srcSet = `
        ${src}?${params}&w=600&h=600&dpr=2&q=${retinaQuality} 1200w,
        ${src}?${params}&w=400&h=400&dpr=2&q=${retinaQuality} 800w,
        ${src}?${params}&w=600&h=600&q=${nonRetinaQuality} 600w,
        ${src}?${params}&w=400&h=400&q=${nonRetinaQuality} 400w
      `;
      break;

    case 'portraitCta':
      srcSet = `
        ${src}?${params}&w=200&h=200&dpr=2&q=${retinaQuality} 400w,
        ${src}?${params}&w=100&h=100&dpr=2&q=${retinaQuality} 200w,
        ${src}?${params}&w=200&h=200&q=${nonRetinaQuality} 200w,
        ${src}?${params}&w=100&h=100&q=${nonRetinaQuality} 100w
      `;
      break;

    case 'publicationTeaser':
      srcSet = `
        ${src}?${params}&w=80&h=114&dpr=2&q=${retinaQuality} 160w,
        ${src}?${params}&w=80&h=114&q=${nonRetinaQuality} 80w
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

  /*
    100rem = 1600px (ultra)
    80rem = 1280px (wide)
    64rem = 1024px (large)
    40rem = 640px (medium)
    22.5rem = 360px; (small)
  */

  switch (variant) {
    case 'content':
      sizes = `
        (min-width: 100rem) 2500px,
        (min-width: 80rem) 2000px,
        (min-width: 40rem) 1000px,
        (min-width: 22.5rem) 600px,
        400px
      `;
      break;

    case 'contentWide':
      sizes = `
        (min-width: 100rem) 2500px,
        (min-width: 80rem) 2000px,
        (min-width: 40rem) 1000px,
        (min-width: 22.5rem) 600px,
        400px
      `;
      break;

    case 'hero':
      sizes = `
        (min-width: 100rem) 2500px,
        (min-width: 80rem) 1600px,
        (min-width: 40rem) 1000px,
        (min-width: 22.5rem) 600px,
        400px
      `;
      break;

    case 'genericTeaser':
      sizes = `
        (min-width: 100rem) 600px,
        400px
      `;
      break;

    case 'logoTeaser':
      sizes = '100px';
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
