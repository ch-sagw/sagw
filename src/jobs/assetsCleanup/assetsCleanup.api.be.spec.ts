/* eslint-disable @typescript-eslint/naming-convention */

import {
  expect,
  test,
} from '@playwright/test';
import {
  generateDetailPage,
  generateDocument,
  generateImage,
  generateOverviewPage,
  generateVideo,
  getHomeId,
} from '@/test-helpers/collections-generator';
import {
  generateTenant,
  getTenantId,
} from '@/test-helpers/tenant-generator';
import {
  deleteOtherCollections,
  deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import { userRoles } from '@/collections/Plc/Users/roles';
import { seoData } from '@/seed/test-data/seoData';
import { simpleRteConfig } from '@/utilities/simpleRteConfig';
import { runAssetsCleanup } from '@/jobs/assetsCleanup/runAssetsCleanup';
import { queueAndRunAssetsCleanup } from '@/jobs/assetsCleanup/runJob';
import {
  collectGenericReferences,
  createReferenceIndex,
} from '@/jobs/assetsCleanup/collectGeneric';
import {
  findInvariantViolations,
  scanReferences,
} from '@/jobs/assetsCleanup/scanReferences';
import { localDevCronSecret } from '@/jobs/assetsCleanup/cronAuth';
import {
  deleteCandidate,
  isDeleteModeConfirmed,
} from '@/jobs/assetsCleanup/deleteAsset';
import {
  buildSlackFailureText,
  buildSlackText,
  buildSummaryText,
  collectReportProblems,
} from '@/jobs/assetsCleanup/report';
import {
  type AssetCollectionSlug,
  assetsCleanupDefaults,
  fuseOverrideEnvVars,
  resolveAssetsCleanupConfig,
} from '@/jobs/assetsCleanup/config';
import type { InterfaceAssetsCleanupReport } from '@/jobs/assetsCleanup/types';

// ########################################################################
// Helpers
// ########################################################################

const dayMs = 24 * 60 * 60 * 1000;

// the run is executed directly in the test process: no ENV means «local»,
// so a requested delete mode is effective and the safety window is 1 day.
const runDelete = async (options?: {
  maxDeletePercent?: number;
  tenantIds?: string[];
}): Promise<InterfaceAssetsCleanupReport> => {
  const payload = await getPayloadCached();

  return runAssetsCleanup({
    options: {
      maxDeletePercent: options?.maxDeletePercent,
      mode: 'delete',
      notify: false,
      tenantIds: options?.tenantIds,
    },
    payload,
  });
};

const backdateAsset = async (collection: AssetCollectionSlug, id: string, days: number): Promise<void> => {
  const payload = await getPayloadCached();
  const date = new Date(Date.now() - (days * dayMs));

  await payload.db.collections[collection].updateOne({
    _id: id,
  }, {
    $set: {
      createdAt: date,
      updatedAt: date,
    },
  }, {
    timestamps: false,
  });
};

const assetExists = async (collection: AssetCollectionSlug, id: string): Promise<boolean> => {
  const payload = await getPayloadCached();
  const doc = await payload.findByID({
    collection,
    depth: 0,
    disableErrors: true,
    id,
  });

  return Boolean(doc);
};

const getAssetFilename = async (collection: AssetCollectionSlug, id: string): Promise<string> => {
  const payload = await getPayloadCached();
  const doc = await payload.findByID({
    collection,
    depth: 0,
    id,
  });

  return doc.filename || '';
};

// required localized fields when a page is updated in a non-default locale
const localizedPageFields = (title: string): Record<string, unknown> => ({
  hero: {
    colorMode: 'light',
    title: simpleRteConfig(title),
  },
  navigationTitle: title,
  ...seoData,
  slug: title.replace(/\s+/gu, '-'),
});

const imageBlock = (image: string): Record<string, unknown> => ({
  blockType: 'imageBlock',
  credits: simpleRteConfig('credits'),
  image,
});

const textBlock = (text: string): Record<string, unknown> => ({
  blockType: 'textBlock',
  text: simpleRteConfig(text),
});

const linkTextBlock = (text: string, url: string): Record<string, unknown> => ({
  blockType: 'textBlock',
  text: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'see ',
              type: 'text',
              version: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text,
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              fields: {
                linkType: 'custom',
                newTab: true,
                url,
              },
              format: '',
              indent: 0,
              type: 'link',
              version: 3,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          textStyle: '',
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
});

const externalLinksBlock = (url: string): Record<string, unknown> => ({
  blockType: 'linksBlock',
  links: [
    {
      linkExternal: {
        externalLink: url,
        externalLinkText: simpleRteConfig('link'),
      },
      linkType: 'external',
    },
  ],
});

// sequential on purpose: parallel uploads of the same file race on the
// unique filename
const generateImages = async (tenant: string, amount: number): Promise<string[]> => {
  const ids: string[] = [];

  for await (const step of Array.from({
    length: amount,
  }, (_, index) => index)) {
    ids[step] = await generateImage(tenant);
  }

  return ids;
};

const findTenantReport = (report: InterfaceAssetsCleanupReport, tenantId: string): InterfaceAssetsCleanupReport['tenants'][number] => {
  const tenantReport = report.tenants.find((tenant) => tenant.tenantId === tenantId);

  if (!tenantReport) {
    throw new Error(`no report for tenant ${tenantId}`);
  }

  return tenantReport;
};

// ########################################################################
// Tests
// ########################################################################

test.describe('assets cleanup job', () => {
  test.describe.configure({
    mode: 'serial',
  });

  test('keeps referenced assets, deletes unreferenced old assets', async () => {
    test.setTimeout(240_000);

    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const time = (new Date())
      .getTime();
    const tenant = await getTenantId({
      isSagw: true,
      time,
    });
    const home = await getHomeId({
      isSagw: true,
      tenant,
    });
    const parentPage = {
      documentId: home,
      slug: 'homePage',
    };

    // ----------------------------------------------------------------
    // used: schema references
    // ----------------------------------------------------------------
    const imagePublished = await generateImage(tenant);
    const imageOldVersionOnly = await generateImage(tenant);
    const imageDraftOnly = await generateImage(tenant);
    const imageSeo = await generateImage(tenant);
    const imagePerson = await generateImage(tenant);
    const imageOverviewProps = await generateImage(tenant);
    const imageGenericTeaser = await generateImage(tenant);
    const imageNetworkTeaser = await generateImage(tenant);
    const imageVideoStill = await generateImage(tenant);
    const imageCrossTenant = await generateImage(tenant);
    const imageLocked = await generateImage(tenant);
    const videoUsed = await generateVideo(tenant);
    const documentCustomDe = await generateDocument(tenant);
    const documentCustomIt = await generateDocument(tenant);

    const projectUsed = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig(`Project used ${time}`),
        tenant,
      },
    });
    const projectUnused = await payload.create({
      collection: 'projects',
      data: {
        name: simpleRteConfig(`Project unused ${time}`),
        tenant,
      },
    });
    const documentAutoProject = await generateDocument(tenant, projectUsed.id);
    const documentUnusedProject = await generateDocument(tenant, projectUnused.id);

    // published content
    await generateDetailPage({
      content: [
        imageBlock(imagePublished),
        {
          'blockType': 'videoBlock',
          'credits': simpleRteConfig('credits'),
          'stillImage': imageVideoStill,
          'video-de': videoUsed,
        },
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: projectUsed.id,
        },
        {
          blockType: 'genericTeasersBlock',
          teasers: [
            {
              image: {
                relationTo: 'images',
                value: imageGenericTeaser,
              },
              linkExternal: {
                externalLink: 'https://www.sagw.ch',
                externalLinkText: simpleRteConfig('link'),
              },
              linkType: 'external',
              title: simpleRteConfig('teaser'),
            },
          ],
          title: simpleRteConfig('teasers'),
        },
      ],
      parentPage,
      tenant,
      title: `used published ${time}`,
    });

    // image only referenced in an old version
    const pageVersioned = await generateDetailPage({
      content: [imageBlock(imageOldVersionOnly)],
      parentPage,
      tenant,
      title: `used old version ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [textBlock('image removed')],
      },
      id: pageVersioned.id,
    });

    // image only referenced in a draft (published document stays without it)
    const pageDrafted = await generateDetailPage({
      content: [textBlock('published without image')],
      parentPage,
      tenant,
      title: `used draft ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        content: [imageBlock(imageDraftOnly)],
      },
      draft: true,
      id: pageDrafted.id,
    });

    // seo image
    const pageSeo = await generateDetailPage({
      content: [textBlock('seo')],
      parentPage,
      tenant,
      title: `used seo ${time}`,
    });

    await payload.update({
      collection: 'detailPage',
      data: {
        meta: {
          seo: {
            image: imageSeo,
          },
        },
      },
      id: pageSeo.id,
    });

    // people image
    await payload.create({
      collection: 'people',
      data: {
        firstname: simpleRteConfig('First'),
        function: simpleRteConfig('Function'),
        image: imagePerson,
        lastname: simpleRteConfig('Last'),
        mail: 'first.last@example.com',
        tenant,
      },
    });

    // overview page props image (institute detail page)
    await payload.create({
      collection: 'instituteDetailPage',
      data: {
        _status: 'published',
        hero: {
          colorMode: 'light',
          title: simpleRteConfig(`institute ${time}`),
        },
        ...seoData,
        navigationTitle: `institute ${time}`,
        overviewPageProps: {
          image: imageOverviewProps,
          teaserText: simpleRteConfig('teaser'),
        },
        parentPage,
        slug: `institute-${time}`,
        tenant,
      },
      draft: false,
    });

    // network teasers on overview page
    const networkCategory = await payload.create({
      collection: 'networkCategories',
      data: {
        name: simpleRteConfig(`category ${time}`),
        tenant,
      },
    });

    await generateOverviewPage({
      content: [
        {
          blockType: 'networkTeasersBlock',
          filter: {
            allCheckboxText: simpleRteConfig('all'),
            title: simpleRteConfig('filter'),
          },
          items: {
            items: [
              {
                category: networkCategory.id,
                externalLink: 'https://www.sagw.ch',
                image: imageNetworkTeaser,
                title: simpleRteConfig('item'),
              },
            ],
            linkText: simpleRteConfig('link'),
          },
        },
      ],
      parentPage,
      tenant,
      title: `used network ${time}`,
    });

    // custom downloads: de in default locale, it in non-default locale
    const pageDownloads = await generateDetailPage({
      content: [
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'custom',
          downloads: [
            {
              relationTo: 'documents',
              value: documentCustomDe,
            },
          ],
        },
      ],
      parentPage,
      tenant,
      title: `used downloads ${time}`,
    });

    const downloadsBlockId = (pageDownloads.content || [])[0]?.id;

    await payload.update({
      collection: 'detailPage',
      data: {
        ...localizedPageFields(`used downloads it ${time}`),
        content: [
          {
            blockType: 'downloadsBlock',
            customOrAuto: 'custom',
            downloads: [
              {
                relationTo: 'documents',
                value: documentCustomIt,
              },
            ],
            id: downloadsBlockId,
          },
        ],
      },
      id: pageDownloads.id,
      locale: 'it',
    });

    // cross tenant: a person of another tenant uses an image of this tenant
    const otherTenant = await generateTenant({
      slug: `cleanup-other-${time}`,
    });

    // (the admin ui prevents this via filterOptions, so the reference is
    // written directly to the database)
    const otherPerson = await payload.create({
      collection: 'people',
      data: {
        firstname: simpleRteConfig('Other'),
        function: simpleRteConfig('Function'),
        lastname: simpleRteConfig('Tenant'),
        mail: 'other.tenant@example.com',
        tenant: otherTenant.id,
      },
    });

    await payload.db.collections.people.updateOne({
      _id: otherPerson.id,
    }, {
      $set: {
        image: imageCrossTenant,
      },
    });

    // locked document
    const users = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 1,
    });

    await payload.create({
      collection: 'payload-locked-documents',
      data: {
        document: {
          relationTo: 'images',
          value: imageLocked,
        },
        user: {
          relationTo: 'users',
          value: users.docs[0].id,
        },
      },
    });

    // ----------------------------------------------------------------
    // used: raw urls pasted as text
    // ----------------------------------------------------------------
    const imageGumletLink = await generateImage(tenant);
    const imageBlobText = await generateImage(tenant);
    const imageBlobTextFr = await generateImage(tenant);
    const videoAdminUrl = await generateVideo(tenant);
    const documentDownloadUrl = await generateDocument(tenant);

    const gumletFilename = await getAssetFilename('images', imageGumletLink);
    const blobFilename = await getAssetFilename('images', imageBlobText);
    const blobFilenameFr = await getAssetFilename('images', imageBlobTextFr);

    const pageUrls = await generateDetailPage({
      content: [
        linkTextBlock('gumlet', `https://sagw.gumlet.io/${encodeURIComponent(gumletFilename)}?w=800&format=auto`),
        textBlock(`Look at https://abc123.public.blob.vercel-storage.com/${blobFilename} for details.`),
        externalLinksBlock(`https://www.sagw.ch/api/documents/${documentDownloadUrl}/download?locale=de`),
      ],
      parentPage,
      tenant,
      title: `used urls ${time}`,
    });

    const urlBlockIds = (pageUrls.content || []).map((block) => block.id);

    await payload.update({
      collection: 'detailPage',
      data: {
        ...localizedPageFields(`used urls fr ${time}`),
        content: [
          linkTextBlock('gumlet', `https://sagw.gumlet.io/${encodeURIComponent(gumletFilename)}?w=800&format=auto`),
          textBlock(`Voir https://abc123.public.blob.vercel-storage.com/${blobFilenameFr} pour les détails.`),
          externalLinksBlock(`https://www.sagw.ch/admin/collections/videos/${videoAdminUrl}`),
        ].map((block, index) => ({
          ...block,
          id: urlBlockIds[index],
        })),
      },
      id: pageUrls.id,
      locale: 'fr',
    });

    // ----------------------------------------------------------------
    // unused
    // ----------------------------------------------------------------
    const imageUnusedOld = await generateImage(tenant);
    const videoUnusedOld = await generateVideo(tenant);
    const documentUnusedOld = await generateDocument(tenant);
    const imageUnusedFresh = await generateImage(tenant);

    // ----------------------------------------------------------------
    // backdate everything except the fresh one
    // ----------------------------------------------------------------
    const oldImages = [
      imagePublished,
      imageOldVersionOnly,
      imageDraftOnly,
      imageSeo,
      imagePerson,
      imageOverviewProps,
      imageGenericTeaser,
      imageNetworkTeaser,
      imageVideoStill,
      imageCrossTenant,
      imageLocked,
      imageGumletLink,
      imageBlobText,
      imageBlobTextFr,
      imageUnusedOld,
    ];
    const oldVideos = [
      videoUsed,
      videoAdminUrl,
      videoUnusedOld,
    ];
    const oldDocuments = [
      documentCustomDe,
      documentCustomIt,
      documentAutoProject,
      documentUnusedProject,
      documentDownloadUrl,
      documentUnusedOld,
    ];

    for await (const id of oldImages) {
      await backdateAsset('images', id, 3);
    }

    for await (const id of oldVideos) {
      await backdateAsset('videos', id, 3);
    }

    for await (const id of oldDocuments) {
      await backdateAsset('documents', id, 3);
    }

    // ----------------------------------------------------------------
    // run
    // ----------------------------------------------------------------
    const report = await runDelete({
      maxDeletePercent: 100,
    });

    expect(report.mode)
      .toBe('delete');
    expect(report.globalFuses)
      .toEqual([]);
    expect(report.invariantViolations)
      .toEqual([]);
    expect(report.scan.versions)
      .toBeGreaterThan(0);

    const tenantReport = findTenantReport(report, tenant);

    expect(tenantReport.fuses)
      .toEqual([]);
    expect(tenantReport.deletionPerformed)
      .toBe(true);

    // deleted
    const expectedDeleted = [
      imageUnusedOld,
      videoUnusedOld,
      documentUnusedOld,
      documentUnusedProject,
    ].sort();
    const deletedIds = tenantReport.deletions
      .filter((deletion) => deletion.state === 'deleted' || deletion.state === 'blobNotVerified')
      .map((deletion) => deletion.candidate.id)
      .sort();

    expect(deletedIds)
      .toEqual(expectedDeleted);
    expect(await assetExists('images', imageUnusedOld))
      .toBe(false);
    expect(await assetExists('videos', videoUnusedOld))
      .toBe(false);
    expect(await assetExists('documents', documentUnusedOld))
      .toBe(false);
    expect(await assetExists('documents', documentUnusedProject))
      .toBe(false);

    // sizes: candidates and deleted are the same set here, all with a file size
    expect(report.totals.candidatesBytes)
      .toBeGreaterThan(0);
    expect(report.totals.deletedBytes)
      .toBe(report.totals.candidatesBytes);
    expect(buildSummaryText(report))
      .toContain(`${report.totals.deleted} deleted (`);

    // blob verification only possible with a token
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      tenantReport.deletions.forEach((deletion) => {
        expect(deletion.state)
          .toBe('deleted');
      });
    }

    // kept: fresh
    expect(tenantReport.keptFresh.map((asset) => asset.id))
      .toEqual([imageUnusedFresh]);
    expect(await assetExists('images', imageUnusedFresh))
      .toBe(true);

    // kept: referenced
    for await (const id of oldImages.filter((imageId) => imageId !== imageUnusedOld)) {
      expect(await assetExists('images', id), `image ${id} must be kept`)
        .toBe(true);
    }

    for await (const id of oldVideos.filter((videoId) => videoId !== videoUnusedOld)) {
      expect(await assetExists('videos', id), `video ${id} must be kept`)
        .toBe(true);
    }

    for await (const id of oldDocuments.filter((documentId) => documentId !== documentUnusedOld && documentId !== documentUnusedProject)) {
      expect(await assetExists('documents', id), `document ${id} must be kept`)
        .toBe(true);
    }

    // a second run finds nothing to delete
    const secondReport = await runDelete({
      maxDeletePercent: 100,
    });

    expect(findTenantReport(secondReport, tenant).candidates)
      .toEqual([]);
  });

  test('report-only mode never deletes', async () => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const tenant = await getTenantId({
      isSagw: true,
      time: (new Date())
        .getTime(),
    });
    const imageUnusedOld = await generateImage(tenant);

    await backdateAsset('images', imageUnusedOld, 3);

    const report = await runAssetsCleanup({
      options: {
        mode: 'report',
        notify: false,
      },
      payload,
    });

    expect(report.mode)
      .toBe('report');
    expect(report.deletionPerformed)
      .toBe(false);
    expect(report.globalFuses.length)
      .toBeGreaterThan(0);

    const tenantReport = findTenantReport(report, tenant);

    expect(tenantReport.candidates.map((candidate) => candidate.id))
      .toEqual([imageUnusedOld]);
    expect(tenantReport.deletions)
      .toEqual([]);
    expect(await assetExists('images', imageUnusedOld))
      .toBe(true);
  });

  test('percent fuse stops deletion, explicit limit allows it', async () => {
    test.setTimeout(120_000);

    await deleteSetsPages();
    await deleteOtherCollections();

    const time = (new Date())
      .getTime();
    const fuseTenant = await generateTenant({
      slug: `cleanup-fuse-${time}`,
    });
    const images = await generateImages(fuseTenant.id, 10);

    for await (const id of images) {
      await backdateAsset('images', id, 3);
    }

    // default: 10 of 10 assets (100%) exceed 25%
    const fusedReport = await runDelete({
      tenantIds: [fuseTenant.id],
    });
    const fusedTenant = findTenantReport(fusedReport, fuseTenant.id);

    expect(fusedTenant.candidates.length)
      .toBe(10);
    expect(fusedTenant.fuses.length)
      .toBeGreaterThan(0);
    expect(fusedTenant.deletionPerformed)
      .toBe(false);
    expect(fusedTenant.deletions)
      .toEqual([]);

    for await (const id of images) {
      expect(await assetExists('images', id))
        .toBe(true);
    }

    // other tenants are not touched when tenantIds is set
    expect(fusedReport.tenants.map((tenant) => tenant.tenantId))
      .toEqual([fuseTenant.id]);

    // explicit limit
    const report = await runDelete({
      maxDeletePercent: 100,
      tenantIds: [fuseTenant.id],
    });
    const tenantReport = findTenantReport(report, fuseTenant.id);

    expect(tenantReport.fuses)
      .toEqual([]);
    expect(tenantReport.deletionPerformed)
      .toBe(true);

    for await (const id of images) {
      expect(await assetExists('images', id))
        .toBe(false);
    }
  });

  test('final gate in deleteCandidate refuses to delete without confirmed delete mode', async () => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const tenant = await getTenantId({
      isSagw: true,
      time: (new Date())
        .getTime(),
    });
    const imageUnusedOld = await generateImage(tenant);

    await backdateAsset('images', imageUnusedOld, 3);

    // get a real candidate (report mode, nothing deleted yet)
    const report = await runAssetsCleanup({
      options: {
        mode: 'report',
        notify: false,
      },
      payload,
    });
    const [candidate] = findTenantReport(report, tenant).candidates;

    expect(candidate.id)
      .toBe(imageUnusedOld);

    // 1. report mode config: gate closed, even when called directly
    const reportConfig = resolveAssetsCleanupConfig({
      mode: 'report',
    });
    const blocked = await deleteCandidate({
      candidate,
      config: reportConfig,
      payload,
    });

    expect(blocked.state)
      .toBe('skipped');
    expect(blocked.message)
      .toContain('Final check failed');
    expect(await assetExists('images', imageUnusedOld))
      .toBe(true);

    // 2. a tampered config (mode 'delete' on a deployed env without the
    // env variable): gate closed as well
    const originalMode = process.env.ASSETS_CLEANUP_MODE;

    delete process.env.ASSETS_CLEANUP_MODE;

    const tamperedConfirmed = isDeleteModeConfirmed({
      ...reportConfig,
      env: 'prod',
      mode: 'delete',
    });

    process.env.ASSETS_CLEANUP_MODE = 'delete';

    const prodConfirmed = isDeleteModeConfirmed({
      ...reportConfig,
      env: 'prod',
      mode: 'delete',
    });

    if (originalMode === undefined) {
      delete process.env.ASSETS_CLEANUP_MODE;
    } else {
      process.env.ASSETS_CLEANUP_MODE = originalMode;
    }

    expect(tamperedConfirmed)
      .toBe(false);
    expect(prodConfirmed)
      .toBe(true);
    expect(isDeleteModeConfirmed({
      ...reportConfig,
      mode: 'delete',
    }))
      .toBe(true);

    // 3. confirmed delete mode on this (non-deployed) env: deletes
    const deleted = await deleteCandidate({
      candidate,
      config: {
        ...reportConfig,
        mode: 'delete',
      },
      payload,
    });

    expect([
      'deleted',
      'blobNotVerified',
    ])
      .toContain(deleted.state);
    expect(await assetExists('images', imageUnusedOld))
      .toBe(false);
  });

  test('scan invariant: schema ids must be known to the generic collector', async () => {
    const payload = await getPayloadCached();
    const scan = await scanReferences({
      payload,
    });

    expect(scan.errors)
      .toEqual([]);
    expect(findInvariantViolations(scan))
      .toEqual([]);

    // simulate a disagreement
    scan.schemaIds.add('aaaaaaaaaaaaaaaaaaaaaaaa');

    expect(findInvariantViolations(scan))
      .toEqual(['aaaaaaaaaaaaaaaaaaaaaaaa']);
  });

  test('generic collector finds ids, filenames and urls in arbitrary text', () => {
    const index = createReferenceIndex();

    collectGenericReferences({
      nested: [
        {
          text: 'see https://sagw.gumlet.io/my%20file%20(1).jpg?w=800 and https://x.public.blob.vercel-storage.com/report-final.pdf',
        },
        {
          value: {
            relationTo: 'images',
            value: '66F1A2B3C4D5E6F708192A3B',
          },
        },
        {
          blockType: 'downloadsBlock',
          customOrAuto: 'auto',
          project: '66f1a2b3c4d5e6f708192a3c',
        },
      ],
    }, index);

    expect(index.ids.has('66f1a2b3c4d5e6f708192a3b'))
      .toBe(true);
    expect(index.autoProjects.has('66f1a2b3c4d5e6f708192a3c'))
      .toBe(true);
    expect(index.filenames.has('report-final.pdf'))
      .toBe(true);

    // filenames with brackets or spaces survive in the corpus (raw + decoded)
    const corpus = [...index.urlCorpus].join('\n');

    expect(corpus.includes('my file (1).jpg'))
      .toBe(true);
    expect(corpus.includes('my%20file%20(1).jpg'))
      .toBe(true);
  });

  test('config: deployed environments stay in report mode without ASSETS_CLEANUP_MODE', () => {
    const originalEnv = process.env.ENV;
    const originalMode = process.env.ASSETS_CLEANUP_MODE;

    process.env.ENV = 'prod';
    delete process.env.ASSETS_CLEANUP_MODE;

    const prodConfig = resolveAssetsCleanupConfig({
      maxDeletePercent: 100,
      minAgeDays: 1,
      mode: 'delete',
    });

    expect(prodConfig.mode)
      .toBe('report');
    expect(prodConfig.minAgeDays)
      .toBe(assetsCleanupDefaults.minAgeDaysProd);
    expect(prodConfig.maxDeletePercent)
      .toBe(assetsCleanupDefaults.maxDeletePercent);
    expect(prodConfig.fuseOverrides)
      .toEqual([]);

    // fuse limits can be loosened on prod via env variables only. task
    // input can still only tighten them. invalid values are ignored.
    process.env[fuseOverrideEnvVars.maxDeletePercent] = '100';
    process.env[fuseOverrideEnvVars.maxDeleteAbsolute] = 'not-a-number';

    const overriddenConfig = resolveAssetsCleanupConfig({
      maxDeleteAbsolute: 5000,
      maxDeletePercent: 80,
    });

    delete process.env[fuseOverrideEnvVars.maxDeletePercent];
    delete process.env[fuseOverrideEnvVars.maxDeleteAbsolute];

    expect(overriddenConfig.maxDeletePercent)
      .toBe(80);
    expect(overriddenConfig.maxDeleteAbsolute)
      .toBe(assetsCleanupDefaults.maxDeleteAbsolute);
    expect(overriddenConfig.fuseOverrides)
      .toHaveLength(1);
    expect(overriddenConfig.fuseOverrides[0])
      .toContain(fuseOverrideEnvVars.maxDeletePercent);
    expect(resolveAssetsCleanupConfig(null).fuseOverrides)
      .toEqual([]);

    process.env.ASSETS_CLEANUP_MODE = 'delete';

    expect(resolveAssetsCleanupConfig({
      mode: 'delete',
    }).mode)
      .toBe('delete');
    expect(resolveAssetsCleanupConfig({
      mode: 'report',
    }).mode)
      .toBe('report');

    process.env.ENV = 'test';

    expect(resolveAssetsCleanupConfig(null).minAgeDays)
      .toBe(1);

    // slack: every env except playwright, only with a webhook,
    // never with notify=false
    const originalWebhook = process.env.SLACK_WEBHOOK_URL_ASSETS_DELETE;

    process.env.SLACK_WEBHOOK_URL_ASSETS_DELETE = 'https://hooks.slack.com/services/test';
    process.env.ENV = 'local';

    const localSlack = resolveAssetsCleanupConfig(null).notifySlack;
    const localSlackMuted = resolveAssetsCleanupConfig({
      notify: false,
    }).notifySlack;

    process.env.ENV = 'playwright';

    const playwrightSlack = resolveAssetsCleanupConfig(null).notifySlack;

    delete process.env.SLACK_WEBHOOK_URL_ASSETS_DELETE;
    process.env.ENV = 'local';

    const localSlackWithoutWebhook = resolveAssetsCleanupConfig(null).notifySlack;

    if (originalWebhook === undefined) {
      delete process.env.SLACK_WEBHOOK_URL_ASSETS_DELETE;
    } else {
      process.env.SLACK_WEBHOOK_URL_ASSETS_DELETE = originalWebhook;
    }

    expect(localSlack)
      .toBe(true);
    expect(localSlackMuted)
      .toBe(false);
    expect(playwrightSlack)
      .toBe(false);
    expect(localSlackWithoutWebhook)
      .toBe(false);

    // unknown environment (production build without ENV): never deletes,
    // even with ASSETS_CLEANUP_MODE=delete and a requested delete mode
    // (NODE_ENV is typed read-only by next, hence the cast)
    const mutableEnv = process.env as Record<string, string | undefined>;
    const originalNodeEnv = mutableEnv.NODE_ENV;

    delete process.env.ENV;
    mutableEnv.NODE_ENV = 'production';

    const unknownConfig = resolveAssetsCleanupConfig({
      mode: 'delete',
    });

    mutableEnv.NODE_ENV = originalNodeEnv;

    expect(unknownConfig.env)
      .toBe('unknown');
    expect(unknownConfig.mode)
      .toBe('report');
    expect(unknownConfig.modeReason)
      .toContain('Environment could not be determined');
    expect(isDeleteModeConfirmed({
      ...unknownConfig,
      mode: 'delete',
    }))
      .toBe(false);

    if (originalEnv === undefined) {
      delete process.env.ENV;
    } else {
      process.env.ENV = originalEnv;
    }

    if (originalMode === undefined) {
      delete process.env.ASSETS_CLEANUP_MODE;
    } else {
      process.env.ASSETS_CLEANUP_MODE = originalMode;
    }
  });

  test('slack text marks problems and failures clearly', async () => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const report = await runAssetsCleanup({
      options: {
        mode: 'report',
        notify: false,
      },
      payload,
    });

    // clean run: plain summary
    expect(collectReportProblems(report))
      .toEqual([]);
    expect(buildSlackText(report, 'https://example.com/job/1'))
      .not.toContain('PROBLEMS');
    expect(buildSlackText(report, 'https://example.com/job/1'))
      .toContain('Job: https://example.com/job/1');

    // run with problems: header, reason and details
    const withProblems: InterfaceAssetsCleanupReport = {
      ...report,
      invariantViolations: ['aaaaaaaaaaaaaaaaaaaaaaaa'],
      notifications: [
        {
          channel: 'mail',
          message: 'Mail to admin@example.com failed: smtp down',
          ok: false,
          target: 'admin@example.com',
        },
      ],
      scan: {
        ...report.scan,
        errors: ['pages: cursor timed out'],
      },
    };
    const problemText = buildSlackText(withProblems);

    expect(problemText)
      .toContain('Assets cleanup finished WITH PROBLEMS');
    expect(problemText)
      .toContain('Scan error: pages: cursor timed out');
    expect(problemText)
      .toContain('aaaaaaaaaaaaaaaaaaaaaaaa');
    expect(problemText)
      .toContain('smtp down');

    // crashed run: reason and stack
    const failureText = buildSlackFailureText({
      env: 'test',
      error: new Error('mongo connection lost'),
      jobUrl: 'https://example.com/job/2',
    });

    expect(failureText)
      .toContain('[TEST] Assets cleanup FAILED');
    expect(failureText)
      .toContain('Reason: mongo connection lost');
    expect(failureText)
      .toContain('Details:');
    expect(failureText)
      .toContain('Job: https://example.com/job/2');
  });

  test('job is persisted with report output', async () => {
    await deleteSetsPages();
    await deleteOtherCollections();

    const payload = await getPayloadCached();
    const result = await queueAndRunAssetsCleanup({
      input: {
        mode: 'report',
        notify: false,
      },
      payload,
    });

    expect(result.status)
      .toBe('success');
    expect(result.summary)
      .toContain('REPORT ONLY');
    expect(result.report?.mode)
      .toBe('report');

    const job = await payload.findByID({
      collection: 'payload-jobs',
      depth: 0,
      id: result.jobId,
    });

    expect(job.completedAt)
      .toBeTruthy();
    expect(job.hasError)
      .toBeFalsy();
  });

  test('jobs collection is read-only in the admin (super admins may read and delete)', async () => {
    const payload = await getPayloadCached();
    const result = await queueAndRunAssetsCleanup({
      input: {
        mode: 'report',
        notify: false,
      },
      payload,
    });

    expect(result.status)
      .toBe('success');

    const superAdmins = await payload.find({
      collection: 'users',
      depth: 0,
      limit: 1,
      where: {
        roles: {
          contains: userRoles.admin,
        },
      },
    });
    const [superAdmin] = superAdmins.docs;

    expect(superAdmin)
      .toBeTruthy();

    // read: allowed for super admins
    const job = await payload.findByID({
      collection: 'payload-jobs',
      depth: 0,
      id: result.jobId,
      overrideAccess: false,
      user: superAdmin,
    });

    expect(job.id)
      .toBe(result.jobId);

    // update: denied, even for super admins
    await expect(payload.update({
      collection: 'payload-jobs',
      data: {
        hasError: true,
      },
      id: result.jobId,
      overrideAccess: false,
      user: superAdmin,
    }))
      .rejects
      .toThrow();

    // create: denied, even for super admins
    await expect(payload.create({
      collection: 'payload-jobs',
      data: {
        input: {},
      },
      overrideAccess: false,
      user: superAdmin,
    }))
      .rejects
      .toThrow();

    // read: denied without user
    await expect(payload.findByID({
      collection: 'payload-jobs',
      depth: 0,
      id: result.jobId,
      overrideAccess: false,
    }))
      .rejects
      .toThrow();

    // delete: allowed for super admins
    await payload.delete({
      collection: 'payload-jobs',
      id: result.jobId,
      overrideAccess: false,
      user: superAdmin,
    });

    expect(await payload.findByID({
      collection: 'payload-jobs',
      depth: 0,
      disableErrors: true,
      id: result.jobId,
    }))
      .toBeNull();
  });

  test('cron route requires the secret', async ({
    request,
  }) => {
    test.setTimeout(120_000);

    const unauthorized = await request.get('http://localhost:3000/api/cron/assets-cleanup?notify=false');

    expect(unauthorized.status())
      .toBe(401);

    const wrongSecret = await request.get('http://localhost:3000/api/cron/assets-cleanup?notify=false', {
      headers: {
        Authorization: 'Bearer wrong',
      },
    });

    expect(wrongSecret.status())
      .toBe(401);

    const authorized = await request.get('http://localhost:3000/api/cron/assets-cleanup?notify=false', {
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET || localDevCronSecret}`,
      },
    });

    expect(authorized.status())
      .toBe(200);

    const body = await authorized.json();

    expect(body.status)
      .toBe('success');
    expect(body.jobId)
      .toBeTruthy();
    expect(typeof body.summary)
      .toBe('string');
  });
});
