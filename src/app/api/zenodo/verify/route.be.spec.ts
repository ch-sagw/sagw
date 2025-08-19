import {
  expect,
  test,
} from '@playwright/test';
import os from 'os';

test('zenodo api responds', async ({
  request,
}) => {
  const id = '15126918';
  const newIssue = await request.get(`http://127.0.0.1:3000/api/zenodo/verify?id=${id}`);

  console.log(newIssue);

  console.log('Hostname:', os.hostname());

  await expect(newIssue)
    .toBeTruthy();

});

