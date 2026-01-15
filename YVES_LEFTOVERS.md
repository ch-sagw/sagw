################ GENERAL ################
- make sure, all content is fetched in current locale (in layout, page level and blocks where applicaple)
- implement redirects
- add global array of tenant names. these names are forbidden to use as slugs. implement this in the validation for slug
- optional link on form error/success notification is not rendered
- make preview-link in admin-ui work
- test link-prefetching on prod


############### LINKING ################
- everywhere where rte3ToHtml is called: this should be rendered "as" p instead of div, right?
- ERROR on server: GET /de 500 in 11239ms
- in render blocks, we still pass tenant down sometimes, does that make sense?
- renderHero is a complete client component. probably makes sense to split into server/client
- make sure that payload.find for page queries only queries published pages (e.g. newsteasers, eventsteasers, overviews etc.)



############## REFACTOR ##############
- with npm run build:local and npm run start -> this error comes up in the frontend
Error: Internal: NoFallbackError
    at o (.next/server/app/(frontend)/[locale]/[...slug]/page.js:3:1061)
    at responseGenerator (.next/server/app/(frontend)/[locale]/[...slug]/page.js:3:1917)

- in overview-links tests -> institute is missing
- test static generation with localized tenant slugs
- pages created in playwright need revalidatePath before opening them in browser. check if this is needed as well if we manually create pages in payload
- thin out tenantDataPlaywright and adapt tests !!!
- in playwright seed, add 1000s of pages, then compare test times before and after
- invalidate pages along the breadcrumb-update-cascade -> test it!)


############## invalidate cache ##############
- if network categories, projects, people, teams, publication topics, publication types, event categories or forms change, we need to find referencing pages and invalidating their cache
- cache invalidation cascade: if Globals or Consent is revaliated, we need to revalidate all pages! same for header links and footer stuff!
- there are certain parent page props (parentPageProps): there we need to invalidate cache of the parent page as well
- what other functionalities / tests? (e.g. header, consent)
- event detail page has links block link to detail page. if only content blocks of detail page changes, then event detail page should not be invalidated, but it currently is.
- if block content of detail page changes, page is not invalidated!
- invalidations on page deletions. e.g., delete event detail page -> event teasers / overviews should be invalidated
- create event detail page (an overview page with events-overview exists) -> cache invalidation shows de/overview-page (ok), but it also invalidates /it, /fr/, /en
- detail page with rte -> then remove rte -> page is not invalidated. it only happens if page is freshly loaded before rte is removed
- invalidate on meta change!
- test -> link -> consent (and other globals): should not only invlidate home, but all pages

############## prod issues ##############
- internal link chooser from rte -> error
- home, data-privacy and impressum -> trouble accessing the messages files
