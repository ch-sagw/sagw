interface InterfacePrerenderPageLinksParams {
  pages: { id: string }[];
}

// Pre-generates URLs for all pages and returns a serializable Record
// mapping page IDs to URLs
export const prerenderPageLinksStorybook = ({
  pages,
}: InterfacePrerenderPageLinksParams): Record<string, string> => {

  const pageUrls = pages.map((page) => ({
    pageId: page.id,
    url: 'https://foo.bar',
  }));

  // Create a plain object for serialization
  const urlMap = Object.fromEntries(pageUrls.map(({
    pageId, url,
  }) => {
    const urlsObject = [
      pageId,
      url,
    ];

    return urlsObject;
  }));

  return urlMap;
};

