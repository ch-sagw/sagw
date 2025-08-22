import { createServerFeature } from '@payloadcms/richtext-lexical';

export const SoftHyphenFeature = createServerFeature({
  feature: {
    ClientFeature: '@/components/admin/rte/features/SoftHyphen/SoftHyphen.client',
  },
  key: 'softHyphen',
});
