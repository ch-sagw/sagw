import {
  expect,
  test,
} from '@playwright/test';
import { extendExpect } from '@/access/test/extendExpect';
import {
  deleteOtherCollections, deleteSetsPages,
} from '@/seed/test-data/deleteData';
import { getPayloadCached } from '@/utilities/getPayloadCached';
import {
  generateTenant, getTenant,
} from '@/test-helpers/tenant-generator';

extendExpect(expect);

test.describe('Validate Redirects graph', () => {
  test.beforeEach(async () => {
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('rejects self-loop', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/loop-self',
          tenant: tenant || '',
          to: 'de/loop-self',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('rejects direct loopback', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/loop-a',
        tenant: tenant || '',
        to: 'de/loop-b',
      },
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/loop-b',
          tenant: tenant || '',
          to: 'de/loop-a',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('rejects transient loop', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/t-a',
        tenant: tenant || '',
        to: 'de/t-b',
      },
    });

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/t-b',
        tenant: tenant || '',
        to: 'de/t-c',
      },
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/t-c',
          tenant: tenant || '',
          to: 'de/t-a',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('rejects update that closes a loop', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/u-a',
        tenant: tenant || '',
        to: 'de/u-b',
      },
    });

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/u-b',
        tenant: tenant || '',
        to: 'de/u-c',
      },
    });

    const third = await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/u-c',
        tenant: tenant || '',
        to: 'de/elsewhere',
      },
    });

    await expect(async () => {
      await payload.update({
        collection: 'redirects',
        data: {
          tenant: tenant || '',
          to: 'de/u-a',
        },
        id: third.id,
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('allows acyclic chain', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/h-a',
          tenant: tenant || '',
          to: 'de/h-b',
        },
      });

      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/h-b',
          tenant: tenant || '',
          to: 'de/h-c',
        },
      });
    })
      .notRejects();
  });

  test('rejects duplicate from for same tenant after normalization', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/dup-path',
        tenant: tenant || '',
        to: 'de/other',
      },
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/dup-path/',
          tenant: tenant || '',
          to: 'de/other2',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('allows same paths for different tenants', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await getTenant();
    const t1 = await generateTenant({
      slug: `rt-graph-t1-${Date.now()}`,
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/shared-path',
          tenant: tenant || '',
          to: 'de/a',
        },
      });

      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/shared-path',
          tenant: t1.id,
          to: 'de/b',
        },
      });
    })
      .notRejects();
  });
});

test.describe('Validate Redirects graph (non-sagw)', () => {
  test.beforeEach(async () => {
    await deleteSetsPages();
    await deleteOtherCollections();
  });

  test('rejects self-loop', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await generateTenant({
      slug: `rt-self-${Date.now()}`,
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/loop-self',
          tenant: tenant.id,
          to: 'de/loop-self',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('rejects direct loopback', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await generateTenant({
      slug: `rt-dir-${Date.now()}`,
    });

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/loop-a',
        tenant: tenant.id,
        to: 'de/loop-b',
      },
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/loop-b',
          tenant: tenant.id,
          to: 'de/loop-a',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('rejects transient loop', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await generateTenant({
      slug: `rt-trans-${Date.now()}`,
    });

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/t-a',
        tenant: tenant.id,
        to: 'de/t-b',
      },
    });

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/t-b',
        tenant: tenant.id,
        to: 'de/t-c',
      },
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/t-c',
          tenant: tenant.id,
          to: 'de/t-a',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('rejects update that closes a loop', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await generateTenant({
      slug: `rt-upd-${Date.now()}`,
    });

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/u-a',
        tenant: tenant.id,
        to: 'de/u-b',
      },
    });

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/u-b',
        tenant: tenant.id,
        to: 'de/u-c',
      },
    });

    const third = await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/u-c',
        tenant: tenant.id,
        to: 'de/elsewhere',
      },
    });

    await expect(async () => {
      await payload.update({
        collection: 'redirects',
        data: {
          tenant: tenant.id,
          to: 'de/u-a',
        },
        id: third.id,
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('allows acyclic chain', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await generateTenant({
      slug: `rt-chain-${Date.now()}`,
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/h-a',
          tenant: tenant.id,
          to: 'de/h-b',
        },
      });

      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/h-b',
          tenant: tenant.id,
          to: 'de/h-c',
        },
      });
    })
      .notRejects();
  });

  test('rejects duplicate from for same tenant after normalization', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const tenant = await generateTenant({
      slug: `rt-dup-${Date.now()}`,
    });

    await payload.create({
      collection: 'redirects',
      data: {
        from: 'de/dup-path',
        tenant: tenant.id,
        to: 'de/other',
      },
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/dup-path/',
          tenant: tenant.id,
          to: 'de/other2',
        },
      });
    }).rejects.toMatchObject({
      status: 400,
    });
  });

  test('allows same paths for different tenants', {
    tag: '@redirects',
  }, async () => {
    const payload = await getPayloadCached();
    const t1 = await generateTenant({
      slug: `rt-graph-t1-${Date.now()}`,
    });
    const t2 = await generateTenant({
      slug: `rt-graph-t2-${Date.now()}`,
    });

    await expect(async () => {
      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/shared-path',
          tenant: t1.id,
          to: 'de/a',
        },
      });

      await payload.create({
        collection: 'redirects',
        data: {
          from: 'de/shared-path',
          tenant: t2.id,
          to: 'de/b',
        },
      });
    })
      .notRejects();
  });
});
