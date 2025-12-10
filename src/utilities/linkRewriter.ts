import 'server-only';
import {
  getPayload, TypedLocale,
} from 'payload';
import configPromise from '@/payload.config';
import { SerializedLinkNode } from '@payloadcms/richtext-lexical';
import {
  InterfaceBreadcrumb, InterfaceInternalLinkValue,
} from '@/payload-types';
import { routing } from '@/i18n/routing';

type Locale = TypedLocale;

interface InterfacePageDocument {
  id: string;
  slug: string | { [key in Locale]?: string } | undefined;
  breadcrumb?: InterfaceBreadcrumb[] | null;
}

interface InterfaceTenantDocument {
  id: string;
  slug: string | { [key in Locale]?: string } | undefined;
}

/**
 * Builds the URL path for a page based on breadcrumb and slug
 */
const buildPagePath = (
  breadcrumb: InterfaceBreadcrumb[] | null | undefined,
  pageSlug: string | { [key in Locale]?: string } | undefined,
  locale: Locale,
): string => {
  const localeToSlugField: Record<Locale, 'slugde' | 'slugfr' | 'slugit' | 'slugen'> = {
    de: 'slugde',
    en: 'slugen',
    fr: 'slugfr',
    it: 'slugit',
  };

  const slugField = localeToSlugField[locale];

  // Build breadcrumb path
  const breadcrumbPath: string[] = [];

  if (breadcrumb && Array.isArray(breadcrumb) && breadcrumb.length > 0) {
    const validCrumbs = breadcrumb.filter((crumb) => crumb && typeof crumb === 'object');

    for (let i = 0; i < validCrumbs.length; i++) {
      const crumb = validCrumbs[i];
      // Use bracket notation to access slug fields safely
      const crumbRecord = crumb as unknown as Record<string, string | null | undefined>;
      const crumbSlug = crumbRecord[slugField];

      if (crumbSlug && typeof crumbSlug === 'string' && crumbSlug.trim() !== '') {
        const trimmedSlug = crumbSlug.trim();

        // Skip the first breadcrumb if it's "home", otherwise add it
        // to the path
        if (!(i === 0 && trimmedSlug === 'home')) {
          breadcrumbPath.push(trimmedSlug);
        }
      }
    }
  }

  // Get page slug
  let pageSlugValue: string | undefined;

  if (typeof pageSlug === 'string') {
    pageSlugValue = pageSlug;
  } else if (pageSlug && typeof pageSlug === 'object' && locale in pageSlug) {
    pageSlugValue = pageSlug[locale];
  }

  if (!pageSlugValue || pageSlugValue.trim() === '') {
    return '';
  }

  // Combine breadcrumb path with page slug
  return [
    ...breadcrumbPath,
    pageSlugValue.trim(),
  ].join('/');
};

/**
 * Builds the full URL for a page in a specific locale
 */
const buildPageUrl = (
  locale: Locale,
  tenantSlug: string | undefined,
  pagePath: string,
): string => {
  const parts: string[] = [locale];

  // Add tenant slug if it's not "sagw"
  if (tenantSlug && tenantSlug !== 'sagw') {
    parts.push(tenantSlug);
  }

  // Add page path
  if (pagePath) {
    parts.push(pagePath);
  }

  return `/${parts.join('/')}`;
};

/**
 * Fetches page document and builds URLs for all locales
 */
const getPageUrls = async (
  collectionSlug: string,
  documentId: string,
  tenantId: string,
): Promise<Record<Locale, string> | null> => {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    // Fetch tenant to get slug
    const tenant = await payload.findByID({
      collection: 'tenants',
      id: tenantId,
      locale: 'all',
    }) as InterfaceTenantDocument | null;

    if (!tenant) {
      return null;
    }

    // Get tenant slug for each locale
    const tenantSlugs: Record<Locale, string | undefined> = {
      de: typeof tenant.slug === 'string'
        ? tenant.slug
        : tenant.slug?.de,
      en: typeof tenant.slug === 'string'
        ? tenant.slug
        : tenant.slug?.en,
      fr: typeof tenant.slug === 'string'
        ? tenant.slug
        : tenant.slug?.fr,
      it: typeof tenant.slug === 'string'
        ? tenant.slug
        : tenant.slug?.it,
    };

    // Fetch page document in all locales
    const pagePromises = (routing.locales as Locale[]).map(async (locale: Locale) => {
      try {
        const page = await payload.findByID({
          collection: collectionSlug as any,
          depth: 0,
          id: documentId,
          locale: locale as TypedLocale,
        }) as InterfacePageDocument | null;

        return {
          locale,
          page,
        };
      } catch {
        return {
          locale,
          page: null,
        };
      }
    });

    const pageResults = await Promise.all(pagePromises);

    // Build URLs for each locale
    const urls: Partial<Record<Locale, string>> = {};

    const validResults = pageResults.filter((result): result is { locale: Locale; page: InterfacePageDocument } => {
      const {
        page,
      } = result;

      if (!page) {
        return false;
      }

      const typedLocale = result.locale as Locale;
      const pagePath = buildPagePath(page.breadcrumb, page.slug, typedLocale);

      return Boolean(pagePath);
    });

    for (const result of validResults) {
      const {
        locale, page,
      } = result;

      const typedLocale = locale as Locale;
      const pagePath = buildPagePath(page.breadcrumb, page.slug, typedLocale);

      if (pagePath) {
        const tenantSlug = tenantSlugs[typedLocale];
        const url = buildPageUrl(typedLocale, tenantSlug, pagePath);

        urls[typedLocale] = url;
      }
    }

    // Return null if no URLs were built
    if (Object.keys(urls).length === 0) {
      return null;
    }

    return urls as Record<Locale, string>;
  } catch {
    return null;
  }
};

/**
 * Transforms RTE link node by adding path field and href
 */
const transformRteLink = async (
  linkNode: SerializedLinkNode,
  tenantId: string | { id: string },
  currentLocale?: Locale,
): Promise<SerializedLinkNode> => {
  // Check if it's an internal link
  if (
    linkNode.fields?.linkType !== 'internal' ||
    !linkNode.fields?.doc ||
    !linkNode.fields.doc.relationTo ||
    !linkNode.fields.doc.value
  ) {
    return linkNode;
  }

  const {
    relationTo, value,
  } = linkNode.fields.doc;
  const tenantIdString = typeof tenantId === 'string'
    ? tenantId
    : tenantId.id;

  // Extract document ID - value can be a string or an object with id property
  let documentId: string;

  if (typeof value === 'string') {
    documentId = value;
  } else if (value && typeof value === 'object' && 'id' in value) {
    documentId = String(value.id);
  } else {
    return linkNode;
  }

  // Get URLs for all locales - use relationTo as collection slug and fetch
  // the actual page
  const urls = await getPageUrls(relationTo, documentId, tenantIdString);

  if (!urls) {
    return linkNode;
  }

  // Get href for current locale if provided
  const href = currentLocale && urls[currentLocale]
    ? urls[currentLocale]
    : undefined;

  // Add path field and href to the link node
  return {
    ...linkNode,
    fields: {
      ...linkNode.fields,
      href,
      path: urls,
    },
  };
};

/**
 * Transforms InternalLinkChooser link by adding path field and href
 */
const transformInternalLink = async (
  link: InterfaceInternalLinkValue,
  tenantId: string | { id: string },
  currentLocale?: Locale,
): Promise<InterfaceInternalLinkValue & { path?: Record<Locale, string>; href?: string }> => {
  if (!link.slug || !link.documentId) {
    return link;
  }

  const tenantIdString = typeof tenantId === 'string'
    ? tenantId
    : tenantId.id;

  // Get URLs for all locales - link.slug is collection slug, we use it to
  // fetch the page
  const urls = await getPageUrls(link.slug, link.documentId, tenantIdString);

  if (!urls) {
    return link;
  }

  // Get href for current locale if provided
  const href = currentLocale && urls[currentLocale]
    ? urls[currentLocale]
    : undefined;

  return {
    ...link,
    href,
    path: urls,
  };
};

/**
 * Recursively traverses and transforms RTE content
 */
const transformRteContent = async (
  content: any,
  tenantId: string | { id: string },
  currentLocale?: Locale,
): Promise<any> => {
  if (!content || typeof content !== 'object') {
    return content;
  }

  // Handle Lexical RTE structure
  if (content.root && typeof content.root === 'object') {
    const transformedRoot = await transformRteContent(content.root, tenantId, currentLocale);

    return {
      ...content,
      root: transformedRoot,
    };
  }

  // Handle link nodes
  if (content.type === 'link' && content.fields) {
    return transformRteLink(content as SerializedLinkNode, tenantId, currentLocale);
  }

  // Handle arrays
  if (Array.isArray(content)) {
    return Promise.all(content.map((item) => transformRteContent(item, tenantId, currentLocale)));
  }

  // Handle objects - recursively process children
  if (content.children && Array.isArray(content.children)) {
    const transformedChildren = await Promise.all(content.children.map((child: any) => transformRteContent(child, tenantId, currentLocale)));

    return {
      ...content,
      children: transformedChildren,
    };
  }

  // Recursively process all object properties
  const transformed: any = {};

  const entries = Object.entries(content)
    .filter(([key]) => !(key === 'children' && Array.isArray(content[key])));

  const transformedEntries = await Promise.all(entries.map(async ([
    key,
    value,
  ]) => [
    key,
    await transformRteContent(value, tenantId, currentLocale),
  ]));

  for (const [
    key,
    value,
  ] of transformedEntries) {
    transformed[key] = value;
  }

  return transformed;
};

/**
 * Recursively traverses and transforms content blocks and fields
 */
export const rewriteLinks = async (
  content: any,
  tenantId: string | { id: string },
  currentLocale?: Locale,
): Promise<any> => {
  if (!content || typeof content !== 'object') {
    return content;
  }

  // Handle arrays
  if (Array.isArray(content)) {
    return Promise.all(content.map((item) => rewriteLinks(item, tenantId, currentLocale)));
  }

  const transformed: any = {};

  const entries = Object.entries(content);

  // Process entries in parallel where possible
  const processedEntries = await Promise.all(entries.map(async ([
    key,
    value,
  ]) => {
    // Skip internal fields
    if (key.startsWith('_') || key === 'id') {
      return [
        key,
        value,
      ];
    }

    // Handle RTE fields (richText fields)
    if (
      key.includes('Text') ||
      key.includes('text') ||
      key.includes('description') ||
      key.includes('Description') ||
      (value && typeof value === 'object' && 'root' in value && 'children' in (value as any).root)
    ) {
      return [
        key,
        await transformRteContent(value, tenantId, currentLocale),
      ];
    }

    // Handle InternalLinkChooser fields
    if (key === 'internalLink' && value && typeof value === 'object' && 'slug' in value && 'documentId' in value) {
      return [
        key,
        await transformInternalLink(value as InterfaceInternalLinkValue, tenantId, currentLocale),
      ];
    }

    // Handle linkInternal fields (from fieldsLinkInternalOrExternal)
    if (key === 'linkInternal' && value && typeof value === 'object') {
      if ('internalLink' in value) {
        const linkInternal = value as any;

        return [
          key,
          {
            ...linkInternal,
            internalLink: await transformInternalLink(linkInternal.internalLink, tenantId, currentLocale),
          },
        ];
      }
    }

    // Recursively process nested objects
    if (value && typeof value === 'object') {
      return [
        key,
        await rewriteLinks(value, tenantId, currentLocale),
      ];
    }

    // Keep primitive values as-is
    return [
      key,
      value,
    ];
  }));

  for (const [
    key,
    value,
  ] of processedEntries) {
    transformed[key] = value;
  }

  return transformed;
};

