import type {
  CollectionConfig, Field,
} from 'payload';
import { fieldAffectsData } from 'payload/shared';
import type { User } from '@/payload-types';
import { userIsSuperAdmin } from '@/collections/Plc/Users/roles';

// ########################################################################
// Admin UI shape of the payload-jobs collection
//
// Payload's default jobs collection is a technical collection which is
// normally hidden. We show it to super admins as a read-only history of
// the assets cleanup runs:
//
// - nobody can create or update jobs through the api / admin ui. the job
//   runner itself uses the local api with overrideAccess and is not
//   affected.
// - super admins may read and delete (tidy up old runs).
// - technical fields (task slug, queue, raw input / output json, ...) are
//   hidden. the report is rendered by a custom component instead.
// ########################################################################

// top level fields which carry no information for a human reader
const hiddenTopLevelFields = new Set([
  'concurrencyKey',
  'input',
  'meta',
  'processing',
  'queue',
  'taskSlug',
  'taskStatus',
  'waitUntil',
  'workflowSlug',
]);

// fields inside the "Status" tab
const hiddenStatusFields = new Set([
  'error',
  'totalTried',
]);

// fields inside each log row (the huge json lives here)
const hiddenLogFields = new Set([
  'error',
  'input',
  'output',
  'parent',
  'taskID',
]);

const withAdmin = (field: Field, admin: Record<string, unknown>): Field => ({
  ...field,
  admin: {
    ...('admin' in field
      ? field.admin
      : {}),
    ...admin,
  },
} as Field);

const hideOrReadOnly = (field: Field, hidden: Set<string>): Field => {
  if (fieldAffectsData(field) && hidden.has(field.name)) {
    return withAdmin(field, {
      hidden: true,
    });
  }

  return withAdmin(field, {
    readOnly: true,
  });
};

const mapLogFields = (fields: Field[]): Field[] => fields.map((field) => hideOrReadOnly(field, hiddenLogFields));

const mapStatusFields = (fields: Field[]): Field[] => fields.map((field) => {
  if (field.type === 'array' && field.name === 'log') {
    return withAdmin({
      ...field,
      fields: mapLogFields(field.fields),
    }, {
      description: 'Execution log of this run',
      readOnly: true,
    });
  }

  return hideOrReadOnly(field, hiddenStatusFields);
});

const mapTopLevelFields = (fields: Field[]): Field[] => fields.map((field) => {
  if (field.type === 'tabs') {
    return {
      ...field,
      tabs: field.tabs.map((tab) => ({
        ...tab,
        fields: mapStatusFields(tab.fields),
      })),
    };
  }

  return hideOrReadOnly(field, hiddenTopLevelFields);
});

const reportField: Field = {
  admin: {
    components: {
      Field: '@/components/admin/AssetsCleanupJobReport',
    },
  },
  name: 'assetsCleanupReport',
  type: 'ui',
};

const isSuperAdminRequest = ({
  req,
}: {
  req: {
    user?: unknown;
  };
}): boolean => userIsSuperAdmin(req.user as User);

export const buildJobsCollection = (defaultJobsCollection: CollectionConfig): CollectionConfig => ({
  ...defaultJobsCollection,
  access: {
    create: () => false,
    delete: isSuperAdminRequest,
    read: isSuperAdminRequest,
    update: () => false,
  },
  admin: {
    ...defaultJobsCollection.admin,
    defaultColumns: [
      'createdAt',
      'completedAt',
      'hasError',
    ],
    group: 'System',
    hidden: ({
      user,
    }): boolean => !userIsSuperAdmin(user as User),
  },
  fields: [
    reportField,
    ...mapTopLevelFields(defaultJobsCollection.fields),
  ],
  labels: {
    plural: 'Assets Cleanup Runs',
    singular: 'Assets Cleanup Run',
  },
});
