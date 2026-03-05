import {
  expect,
  test,
} from '@playwright/test';
import { formatTime } from './date';

test.describe('formatTime', () => {
  test('properly renders in english', async () => {
    const time1 = formatTime({
      dateString: '2030-01-01T07:00:00.000Z',
      locale: 'en',
    });

    const time2 = formatTime({
      dateString: '2030-01-01T07:15:00.000Z',
      locale: 'en',
    });

    const time3 = formatTime({
      dateString: '2030-01-01T16:15:00.000Z',
      locale: 'en',
    });

    await expect(time1)
      .toEqual('8.00 AM');
    await expect(time2)
      .toEqual('8.15 AM');
    await expect(time3)
      .toEqual('5.15 PM');

  });

  test('properly renders in french', async () => {
    const time1 = formatTime({
      dateString: '2030-01-01T07:00:00.000Z',
      locale: 'fr',
    });

    const time2 = formatTime({
      dateString: '2030-01-01T07:15:00.000Z',
      locale: 'fr',
    });

    await expect(time1)
      .toEqual('8 h');
    await expect(time2)
      .toEqual('8 h 15');
  });

  test('properly renders in german', async () => {
    const time1 = formatTime({
      dateString: '2030-01-01T07:00:00.000Z',
      locale: 'de',
    });

    const time2 = formatTime({
      dateString: '2030-01-01T07:15:00.000Z',
      locale: 'de',
    });

    await expect(time1)
      .toEqual('8.00');
    await expect(time2)
      .toEqual('8.15');
  });
});
