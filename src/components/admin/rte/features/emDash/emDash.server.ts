import { createServerFeature } from '@payloadcms/richtext-lexical';

export const EmDashFeature = createServerFeature({
  feature: {
    ClientFeature: '@/components/admin/rte/features/emDash/emDash.client',
  },
  key: 'emDash',
});
