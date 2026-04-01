import { CollectionBeforeValidateHook } from 'payload';
import { extractID } from '@/utilities/extractId';
import { assertRedirectPairsValid } from '@/hooks-payload/validateRedirectGraph/shared';

export const validateRedirectGraph: CollectionBeforeValidateHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (![
    'create',
    'update',
  ].includes(operation)) {
    return data;
  }

  if (!data) {
    return data;
  }

  const fromRaw = typeof data.from === 'string'
    ? data.from
    : originalDoc?.from;
  const toRaw = typeof data.to === 'string'
    ? data.to
    : originalDoc?.to;

  if (typeof fromRaw !== 'string' || typeof toRaw !== 'string') {
    return data;
  }

  const tenantId = extractID(data?.tenant ?? originalDoc?.tenant);

  if (!tenantId) {
    return data;
  }

  const {
    docs,
  } = await req.payload.find({
    collection: 'redirects',
    depth: 0,
    limit: 0,
    pagination: false,
    select: {
      from: true,
      id: true,
      to: true,
    },
    where: {
      and: [
        {
          tenant: {
            equals: tenantId,
          },
        },
      ],
    },
  });

  assertRedirectPairsValid({
    currentId: originalDoc?.id,
    existingEntries: docs,
    pendingEntries: [
      {
        from: fromRaw,
        to: toRaw,
      },
    ],
  });

  return data;
};
