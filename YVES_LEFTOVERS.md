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
- in playwright seed, add 1000s of pages, then compare test times before and after
- invalidate pages along the breadcrumb-update-cascade -> test it!

############## invalidate cache ##############
- if network categories, projects, people, teams, publication topics, publication types, event categories, images, videos, document or forms change, we need to find referencing pages and invalidating their cache
- cache invalidation cascade: if Globals or Consent is revaliated, we need to revalidate all pages! same for header links and footer stuff!
- there are certain parent page props (parentPageProps): there we need to invalidate cache of the parent page as well
- if i18n globals change, we need to detect what changed and invalidate referencing pages