import {
  type BrowserContextOptions,
  devices,
} from '@playwright/test';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

const stripDefaultBrowserType = <
  T extends BrowserContextOptions & {
    defaultBrowserType?: string;
  },
>(
    device: T,
  ): BrowserContextOptions => {
  const {
    /* eslint-disable @typescript-eslint/naming-convention */
    /* eslint-disable no-unused-vars */
    defaultBrowserType: _defaultBrowserType, ...contextOptions
    /* eslint-enable no-unused-vars */
    /* eslint-enable @typescript-eslint/naming-convention */
  } = device;

  return contextOptions;
};

const desktopChrome = stripDefaultBrowserType(devices['Desktop Chrome']);
const desktopChromeHiDPI = stripDefaultBrowserType(devices['Desktop Chrome HiDPI']);
const desktopFirefox = stripDefaultBrowserType(devices['Desktop Firefox']);
const desktopSafari = stripDefaultBrowserType(devices['Desktop Safari']);

export type FeVrtProject = {
  browserName: BrowserName;
  contextOptions: BrowserContextOptions;
  name: string;
};

const feVrtProjects: FeVrtProject[] = [
  {
    browserName: 'chromium',
    contextOptions: {
      ...desktopChrome,
      viewport: {
        height: 300,
        width: 400,
      },
    },
    name: 'chromium-400',
  },
  {
    browserName: 'chromium',
    contextOptions: {
      ...desktopChrome,
      viewport: {
        height: 300,
        width: 700,
      },
    },
    name: 'chromium-700',
  },
  {
    browserName: 'chromium',
    contextOptions: {
      ...desktopChrome,
      viewport: {
        height: 300,
        width: 1100,
      },
    },
    name: 'chromium-1100',
  },
  {
    browserName: 'chromium',
    contextOptions: {
      ...desktopChromeHiDPI,
      viewport: {
        height: 300,
        width: 1600,
      },
    },
    name: 'chromium-1600',
  },
  {
    browserName: 'firefox',
    contextOptions: {
      ...desktopFirefox,
      viewport: {
        height: 300,
        width: 1100,
      },
    },
    name: 'firefox',
  },
  {
    browserName: 'webkit',
    contextOptions: {
      ...desktopSafari,
      viewport: {
        height: 300,
        width: 1280,
      },
    },
    name: 'webkit',
  },
];

export const fePlaywrightProjects = feVrtProjects.map((project) => ({
  name: project.name,
  use: {
    browserName: project.browserName,
    ...project.contextOptions,
  },
}));
