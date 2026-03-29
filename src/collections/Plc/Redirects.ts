import { CollectionConfig } from 'payload';
import { globalContentAccessGeneric } from '@/access/globalContent';
import { validateRedirectLocalePrefix } from '@/hooks-payload/validateRedirectLocalePrefix';

export const Redirects: CollectionConfig = {
  access: globalContentAccessGeneric,
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
    beforeValidate: [validateRedirectLocalePrefix],
  },
  slug: 'redirects',
};
