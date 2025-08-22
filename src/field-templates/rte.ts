/* eslint-disable new-cap */
import {
  FixedToolbarFeature,
  lexicalEditor, SubscriptFeature, SuperscriptFeature,
} from '@payloadcms/richtext-lexical';
import { EmDashFeature } from '@/components/admin/rte/features/emDash/emDash.server';

export const rte1 = lexicalEditor({
  features: [
    FixedToolbarFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    EmDashFeature(),
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
