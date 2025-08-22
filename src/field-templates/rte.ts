/* eslint-disable new-cap */
import {
  FixedToolbarFeature,
  lexicalEditor, SubscriptFeature, SuperscriptFeature,
} from '@payloadcms/richtext-lexical';
import { SoftHyphenFeature } from '@/components/admin/rte/features/SoftHyphen/SoftHyphen.server';

export const rte1 = lexicalEditor({
  features: [
    FixedToolbarFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    SoftHyphenFeature(),
  ],
});

export const rte2 = lexicalEditor({
  features: ({
    defaultFeatures,
  }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
  ],
});

/* eslint-enable new-cap */
