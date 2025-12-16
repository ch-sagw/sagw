// System fields that should be skipped during processing
export const SYSTEM_FIELDS = [
  'id',
  '_id',
  'createdAt',
  'updatedAt',
  '_status',
] as const;

// Removes system fields from a document
export const clearSystemFields = <T extends Record<string, unknown>>(
  doc: T,
): Omit<T, 'id' | 'createdAt' | 'updatedAt' | '_status'> => {
  const filtered = Object.fromEntries(Object.entries(doc)
    .filter(([key]) => !SYSTEM_FIELDS.includes(key as typeof SYSTEM_FIELDS[number])));

  return filtered as Omit<T, 'id' | 'createdAt' | 'updatedAt' | '_status'>;
};

