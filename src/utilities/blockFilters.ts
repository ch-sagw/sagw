// List of all overview block types that should be unique
const OVERVIEW_BLOCK_TYPES = [
  'magazineOverviewBlock',
  'publicationsOverviewBlock',
  'eventsOverviewBlock',
  'peopleOverviewBlock',
  'newsOverviewBlock',
  'nationalDictionariesOverviewBlock',
  'institutesOverviewBlock',
  'projectsOverviewBlock',
] as const;

/**
 * Creates a filterOptions function that prevents multiple overview blocks
 * @param allBlockTypes - Array of all available block types
 * @returns filterOptions function for Payload blocks field
 */
export const createSingleOverviewBlockFilter = <T extends string>(
  allBlockTypes: readonly T[],
) => ({
    siblingData,
  }: any): T[] | true => {
    // Check if any overview block is already present
    const hasOverviewBlock = (siblingData as any)?.content?.some((block: any) => block &&
      typeof block === 'object' &&
      'blockType' in block &&
      OVERVIEW_BLOCK_TYPES.includes(block.blockType as any));

    // If an overview block is already present, filter out all overview blocks
    if (hasOverviewBlock) {
      return allBlockTypes.filter((blockType) => !OVERVIEW_BLOCK_TYPES.includes(blockType as any)) as T[];
    }

    // If no overview block is present, show all blocks
    return true;
  };
