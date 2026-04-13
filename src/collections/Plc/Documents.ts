import type { CollectionConfig } from 'payload';
import { rte2 } from '@/field-templates/rte';
import { assetsAccess } from '@/access/assets';
import {
  hookInvalidateTenantCache, hookInvalidateTenantCacheOnDelete,
} from '@/hooks-payload/invalidateTenantCache';

const encodeContentDispositionFilename = (filename: string): string => {
  const fallback = filename
    .replaceAll(/["\\]/gu, '')
    .replaceAll(/[^\x20-\x7E]/gu, '_');
  const encoded = encodeURIComponent(filename);

  return `attachment; filename="${fallback}"; filename*=UTF-8''${encoded}`;
};

const filenameFromContentDisposition = (contentDisposition: string): string | null => {
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''(?<filename>[^;]+)/u);

  if (utf8Match?.groups?.filename) {
    try {
      return decodeURIComponent(utf8Match.groups.filename);
    } catch {
      return utf8Match.groups.filename;
    }
  }

  const quotedMatch = contentDisposition.match(/filename="(?<filename>[^"]+)"/u);

  if (quotedMatch?.groups?.filename) {
    return quotedMatch.groups.filename;
  }

  const plainMatch = contentDisposition.match(/filename=(?<filename>[^;]+)/u);

  return plainMatch?.groups?.filename?.trim() || null;
};

export const Documents: CollectionConfig = {
  access: assetsAccess,
  admin: {
    description: 'Allowed formats: pdf',
    group: 'Assets',
    hideAPIURL: process.env.ENV === 'prod',
  },
  fields: [
    rte2({
      name: 'title',
    }),
    {
      admin: {
        width: '50%',
      },
      fields: [
        {
          admin: {
            description: 'Date of the publication of the document should be added, not the publishing date on website.',
          },
          name: 'date',
          required: false,
          type: 'date',
        },
        {
          admin: {
            description: 'If the document belongs to a project, add the project.',
          },
          name: 'project',
          relationTo: 'projects',
          required: false,
          type: 'relationship',
        },
      ],
      type: 'row',
    },
  ],
  hooks: {
    afterChange: [hookInvalidateTenantCache],
    afterDelete: [hookInvalidateTenantCacheOnDelete],
  },
  slug: 'documents',
  upload: {
    mimeTypes: ['application/pdf'],
    modifyResponseHeaders: ({
      headers,
    }) => {
      const contentDisposition = headers.get('Content-Disposition');

      if (!contentDisposition) {
        headers.set('Content-Disposition', 'attachment');

        return headers;
      }

      const filename = filenameFromContentDisposition(contentDisposition);

      if (!filename) {
        headers.set('Content-Disposition', 'attachment');

        return headers;
      }

      headers.set('Content-Disposition', encodeContentDispositionFilename(filename));

      return headers;
    },
  },
};
