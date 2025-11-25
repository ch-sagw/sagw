/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      notRejects(): Promise<void>;
    }
  }
}

export {};
