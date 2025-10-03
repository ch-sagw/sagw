import { createServerFeature } from '@payloadcms/richtext-lexical';

export const NonBreakingSpaceFeature = createServerFeature({
  feature: {
    ClientFeature: '@/components/admin/rte/features/NonBreakingSpace/NonBreakingSpace.client',
  },
  key: 'nonBreakingSpace',
});
