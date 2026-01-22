################ GENERAL ################
- make sure, all content is fetched in current locale (in layout, page level and blocks where applicaple)
- implement redirects
- add global array of tenant names. these names are forbidden to use as slugs. implement this in the validation for slug
- optional link on form error/success notification is not rendered
- make preview-link in admin-ui work
- test link-prefetching on prod


############### LINKING ################
- everywhere where rte3ToHtml is called: this should be rendered "as" p instead of div, right?
- in render blocks, we still pass tenant down sometimes, does that make sense?
- renderHero is a complete client component. probably makes sense to split into server/client
- make sure that payload.find for page queries only queries published pages (e.g. newsteasers, eventsteasers, overviews etc.)



############## REFACTOR ##############
- it should only invalidate if page is published. if i change the slug in payload, autosave saves the document and invalidation happens immediately.
- with npm run build:local and npm run start -> this error comes up in the frontend
Error: Internal: NoFallbackError
    at o (.next/server/app/(frontend)/[locale]/[...slug]/page.js:3:1061)
    at responseGenerator (.next/server/app/(frontend)/[locale]/[...slug]/page.js:3:1917)

- in overview-links tests -> institute is missing
- invalidate cache also on regular content changes
- when updating page with italian, the whole /it path is invalidated 
- test static generation with localized tenant slugs
- pages created in playwright need revalidatePath before opening them in browser. check if this is needed as well if we manually create pages in payload
- thin out tenantDataPlaywright and adapt tests !!!
- in playwright seed, add 1000s of pages, then compare test times before and after
- invalidate pages along the breadcrumb-update-cascade -> test it!)


############## invalidate cache ##############
- if network categories, projects, people, teams, publication topics, publication types, event categories or forms change, we need to find referencing pages and invalidating their cache
- cache invalidation cascade: if Globals or Consent is revaliated, we need to revalidate all pages! same for header links and footer stuff!
- on all content changes, except breadcrumb (slug, navigation title, parent page), since this is already handled
- there are certain parent page props (parentPageProps): there we need to invalidate cache of the parent page as well
- what other functionalities / tests? (e.g. header, consent)
- revalidatePath() is commented out, since playwright fails!! check on prod if it's working!!
- implement revalidatePath in invalidateCacheOnPageChange
- -> or better: invalidateCacheOnPageChange has a cache log, but it does not call the revalidate path. in this case, we might call the method in invalidateCache
- invalidating /de only invalidates the home page. but: if we change consent/header/footer, we need to invalidate the cache of all pages