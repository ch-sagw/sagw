import {
  CollectionAfterLoginHook, generateCookie, getCookieExpiration, mergeHeaders,
} from 'payload';

export const setCookieBasedOnDomain: CollectionAfterLoginHook = async ({
  req, user,
}) => {
  const relatedOrg = await req.payload.find({
    collection: 'departments',
    depth: 0,
    limit: 1,
    where: {
      domain: {
        equals: req.headers.get('host'),
      },
    },
  });

  // If a matching department is found, set the 'payload-department' cookie
  if (relatedOrg && relatedOrg.docs.length > 0) {
    const departmentCookie = generateCookie({
      expires: getCookieExpiration({
        seconds: 7200,
      }),
      name: 'payload-department',
      path: '/',
      returnCookieAsObject: false,
      value: String(relatedOrg.docs[0].id),
    });

    // Merge existing responseHeaders with the new Set-Cookie header
    const newHeaders = new Headers({
      'Set-Cookie': departmentCookie as string,
    });

    // Ensure you merge existing response headers if they already exist
    req.responseHeaders = req.responseHeaders
      ? mergeHeaders(req.responseHeaders, newHeaders)
      : newHeaders;
  }

  return user;
};
