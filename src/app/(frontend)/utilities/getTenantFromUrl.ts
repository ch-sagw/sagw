import 'server-only';
import { TypedLocale } from 'payload';
import { getPayloadCached } from '@/utilities/getPayloadCached';

interface InterfaceGetTenantFromUrlResult {
  tenantId: string;
  isSagw: boolean;
  tenantSlug: string | null;
}

// extracts tenant information from URL segment.
// falls back to sagw tenant of no tenant is found.
export const getTenantFromUrl = async (
  tenantSlugSegment: string | undefined,
  locale: TypedLocale,
): Promise<InterfaceGetTenantFromUrlResult> => {
  const payload = await getPayloadCached();

  // if no tenant segment provided, treat as SAGW
  if (!tenantSlugSegment) {
    const sagwTenant = await payload.find({
      collection: 'tenants',
      depth: 1,
      limit: 1,
      where: {
        name: {
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
    return {
      isSagw: true,
      tenantId: '',
      tenantSlug: null,
    };
  }

  // query tenants collection by slug for the given locale
  const tenants = await payload.find({
    collection: 'tenants',
    depth: 1,
    limit: 1,
    locale,
    where: {
      slug: {
        equals: tenantSlugSegment,
      },
    },
  });

  // if tenant found and it's not SAGW, return that tenant
  if (tenants.docs && tenants.docs.length > 0) {
    const [tenant] = tenants.docs;

    if (tenant.name !== 'sagw') {
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
      name: {
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

