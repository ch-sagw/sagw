import { Expect } from 'playwright/test';

export const extendExpect = (expect: Expect): void => {
  expect.extend({
    async notRejects(fn) {
      try {
        await fn();

        return {
          message: (): string => '',
          pass: true,
        };
      } catch (err) {
        return {
          message: (): string => `Expected not to reject but got ${err}`,
          pass: false,
        };
      }
    },
  });
};
