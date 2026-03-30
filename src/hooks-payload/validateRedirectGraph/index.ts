import {
  CollectionBeforeValidateHook,
  ValidationError,
} from 'payload';
import { extractID } from '@/utilities/extractId';
import { normalizeRedirectPath } from '@/utilities/normalizeRedirectPath';

const maxRedirectChaiunSteps = 500;

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

  const from = normalizeRedirectPath(fromRaw);
  const to = normalizeRedirectPath(toRaw);

  if (from === to) {
    throw new ValidationError({
      errors: [
        {
          message:
            '"From" must differ from "to".',
          path: 'to',
        },
      ],
    });
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

  const currentId = originalDoc?.id;

  for (const doc of docs) {
    if (doc.id !== currentId && normalizeRedirectPath(doc.from) === from) {
      throw new ValidationError({
        errors: [
          {
            message:
              'Another redirect already uses this "From" path. Each "From" path must be unique.',
            path: 'from',
          },
        ],
      });
    }
  }

  const map = new Map<string, string>();

  // create a map to keep track of "where does each path will send us next?"
  for (const doc of docs) {
    if (operation !== 'update' || doc.id !== currentId) {
      const f = normalizeRedirectPath(doc.from);
      const t = normalizeRedirectPath(doc.to);

      map.set(f, t);
    }
  }

  let x = to;
  const visited = new Set<string>();

  for (let step = 0; step < maxRedirectChaiunSteps; step += 1) {
    if (x === from) {
      throw new ValidationError({
        errors: [
          {
            message:
              'This redirect would join or extend a chain that loops back to its starting path. Remove or change one of the redirects in the cycle.',
            path: 'to',
          },
        ],
      });
    }

    if (visited.has(x)) {
      return data;
    }

    visited.add(x);

    const next = map.get(x);

    if (next === undefined) {
      return data;
    }

    x = next;
  }

  throw new ValidationError({
    errors: [
      {
        message:
          'This redirect chain is too long to validate reliably. Shorten the chain or remove intermediate redirects.',
        path: 'to',
      },
    ],
  });
};
