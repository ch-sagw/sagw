/* eslint-disable new-cap */
import {
  FixedToolbarFeature,
  lexicalEditor, SubscriptFeature, SuperscriptFeature,
} from '@payloadcms/richtext-lexical';

export const rte1 = lexicalEditor({
  features: () => [
    FixedToolbarFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
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
