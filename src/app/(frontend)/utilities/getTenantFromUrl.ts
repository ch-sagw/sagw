import 'server-only';
import { getPayloadCached } from '@/utilities/getPayloadCached';

export interface InterfaceGetTenantFromUrlResult {
  tenantId: string;
  isSagw: boolean;
  tenantSlug: string | null;
}

// extracts tenant information from URL segment.
// falls back to sagw tenant of no tenant is found.
export const getTenantFromUrl = async (tenantSlugSegment: string | undefined): Promise<InterfaceGetTenantFromUrlResult> => {
  const payload = await getPayloadCached();

  // if no tenant segment provided, treat as SAGW
  if (!tenantSlugSegment) {
    const sagwTenant = await payload.find({
      collection: 'tenants',
      depth: 1,
      limit: 1,
      where: {
        slug: {
          equals: 'sagw',
        },
      },
    });

    if (sagwTenant.docs && sagwTenant.docs.length > 0) {
      return {
        isSagw: true,
        tenantId: sagwTenant.docs[0].id,
        tenantSlug: null,
      };
    }

    // fallback if SAGW tenant not found, should not happen!!

    console.warn('getTenantFromUrl: did not find tenant with slug', tenantSlugSegment);

    return {
      isSagw: true,
      tenantId: '',
      tenantSlug: null,
    };
  }

  // query tenants collection by slug (not localized)
  const tenants = await payload.find({
    collection: 'tenants',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: tenantSlugSegment,
      },
    },
  });

  // if tenant found and it's not SAGW, return that tenant
  if (tenants.docs && tenants.docs.length > 0) {
    const [tenant] = tenants.docs;

    if (tenant.slug !== 'sagw') {
      return {
        isSagw: false,
        tenantId: tenant.id,
        tenantSlug: tenantSlugSegment,
      };
    }
  }

  // if no match found or tenant is SAGW, treat as SAGW (fallback behavior)
  // This means the segment was actually a page slug, not a tenant slug
  const sagwTenant = await payload.find({
    collection: 'tenants',
    depth: 1,
    limit: 1,
    where: {
      slug: {
        equals: 'sagw',
      },
    },
  });

  if (sagwTenant.docs && sagwTenant.docs.length > 0) {
    return {
      isSagw: true,
      tenantId: sagwTenant.docs[0].id,
      tenantSlug: null,
    };
  }

  // final fallback
  return {
    isSagw: true,
    tenantId: '',
    tenantSlug: null,
  };
};

