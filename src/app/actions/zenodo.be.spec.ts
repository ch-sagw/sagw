import {
  expect,
  test,
} from '@playwright/test';

import { verifyZenodo } from '@/app/actions/zenodo';

test('zenodo api responds with proper values', async () => {
  const id = '15126918';
  const zenodoResponse = await verifyZenodo(id);
  const zenodoResponseData = zenodoResponse.data;

  await expect(zenodoResponse?.ok)
    .toBe(true);

  await expect(zenodoResponseData?.date)
    .toEqual('2025-04-02');

  await expect(zenodoResponseData?.id)
    .toEqual('15126918');

  await expect(zenodoResponseData?.title)
    .toEqual('Imaging spatial transcriptomics in a transgenic mouse model of α-synucleinopathy');

  await expect(zenodoResponseData?.files.length)
    .toEqual(6);

  await expect(zenodoResponseData?.files[0].format)
    .toEqual('zip');

  await expect(zenodoResponseData?.files[0].link)
    .toEqual('https://zenodo.org/api/records/15126918/files/Images:transformation.zip/content');

  await expect(zenodoResponseData?.files[0].size)
    .toEqual(5384.09);

});

