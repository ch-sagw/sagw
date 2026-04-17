import { CollectionConfig } from 'payload';
import { globalContentAccessNoTranslatorNoEditor } from '@/access/globalContent';
import { validateRedirectGraph } from '@/hooks-payload/validateRedirectGraph';
import { validateRedirectLocalePrefix } from '@/hooks-payload/validateRedirectLocalePrefix';
import { lockDocuments } from '@/field-templates/lockDocuments';

export const Redirects: CollectionConfig = {
  access: globalContentAccessNoTranslatorNoEditor,
  admin: {
    group: 'Global Content',
    hideAPIURL: process.env.ENV === 'prod',
    useAsTitle: 'from',
  },
  fields: [
    {
      admin: {
        description: 'example SAGW: "de/my/page". example Fachgesellschaft: "de/kürzel-der-fachgesellschaft/page"',
      },
      localized: false,
      name: 'from',
      required: true,
      type: 'text',
    },
    {
      admin: {
        description: 'example SAGW: "de/my/page". example Fachgesellschaft: "de/kürzel-der-fachgesellschaft/page"',
      },
      localized: false,
      name: 'to',
      required: true,
      type: 'text',
    },
  ],
  hooks: {
    beforeValidate: [
      validateRedirectLocalePrefix,
      validateRedirectGraph,
    ],
  },
  lockDocuments,
  slug: 'redirects',
};
