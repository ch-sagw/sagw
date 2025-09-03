import {
  CollectionAfterMeHook, generateCookie, getCookieExpiration, mergeHeaders,
} from 'payload';

export const setTenantAfterLogin: CollectionAfterMeHook = ({
  req,
}) => {

  if (req.user?.departments && req.user?.departments.length > 0) {
    const [department] = req.user?.departments;

    const departmentCookie = generateCookie({
      expires: getCookieExpiration({
        seconds: 7200,
      }),
      name: 'payload-tenant',
      path: '/',
      returnCookieAsObject: false,
      value: String(department.id),
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

};
