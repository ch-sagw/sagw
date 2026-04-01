import { ValidationError } from 'payload';
import { Redirect } from '@/payload-types';
import { normalizeRedirectPath } from '@/utilities/normalizeRedirectPath';

type InterfaceRedirectGraphEntry =
  Pick<Redirect, 'from' | 'to'> & Partial<Pick<Redirect, 'id'>>;

const maxRedirectChainSteps = 500;

const createValidationError = (
  path: 'from' | 'to',
  message: string,
): ValidationError => new ValidationError({
  errors: [
    {
      message,
      path,
    },
  ],
});

export const assertRedirectPairsValid = ({
  currentId,
  existingEntries,
  pendingEntries,
}: {
  currentId?: string;
  existingEntries: InterfaceRedirectGraphEntry[];
  pendingEntries: InterfaceRedirectGraphEntry[];
}): void => {
  const existingFroms = new Set<string>();
  const finalMap = new Map<string, string>();

  for (const entry of existingEntries) {
    if (!currentId || entry.id !== currentId) {
      const from = normalizeRedirectPath(entry.from);
      const to = normalizeRedirectPath(entry.to);

      existingFroms.add(from);
      finalMap.set(from, to);
    }
  }

  const pendingFroms = new Set<string>();
  const normalizedPendingEntries = pendingEntries.map((entry) => ({
    from: normalizeRedirectPath(entry.from),
    to: normalizeRedirectPath(entry.to),
  }));

  for (const entry of normalizedPendingEntries) {
    if (entry.from === entry.to) {
      throw createValidationError('to', '"From" must differ from "to".');
    }

    if (existingFroms.has(entry.from) || pendingFroms.has(entry.from)) {
      throw createValidationError('from', 'Another redirect already uses this "From" path. Each "From" path must be unique.');
    }

    pendingFroms.add(entry.from);
    finalMap.set(entry.from, entry.to);
  }

  for (const entry of normalizedPendingEntries) {
    let nextPath = entry.to;
    const visited = new Set<string>();

    for (let step = 0; step < maxRedirectChainSteps; step += 1) {
      if (nextPath === entry.from) {
        throw createValidationError('to', 'This redirect would join or extend a chain that loops back to its starting path. Remove or change one of the redirects in the cycle.');
      }

      if (visited.has(nextPath)) {
        break;
      }

      visited.add(nextPath);

      const next = finalMap.get(nextPath);

      if (next === undefined) {
        break;
      }

      nextPath = next;
    }

    if (visited.size >= maxRedirectChainSteps) {
      throw createValidationError('to', 'This redirect chain is too long to validate reliably. Shorten the chain or remove intermediate redirects.');
    }
  }
};
