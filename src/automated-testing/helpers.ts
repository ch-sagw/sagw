import { Page } from '@playwright/test';
import { IndexEntry } from 'storybook/internal/types';
import { vrtConfig } from '@/automated-testing/config';

export const getStoryUrl = (id: string): string => {
  const params = new URLSearchParams({
    id,
    nav: '0',
    viewMode: 'story',
  });

  return `${vrtConfig.baseUrl}/iframe.html?${params.toString()}`;
};

export const filterVisualStories = (stories: IndexEntry[]): IndexEntry[] => stories.filter((story) => {
  const hasVisualCheck = story?.tags?.includes('visual:check');
  const isDocs = story.type === 'docs';

  return hasVisualCheck && !isDocs;
});

export const filterA11yStories = (stories: IndexEntry[]): IndexEntry[] => stories.filter((story) => {
  const a11yCheck = story?.tags?.includes('a11y:check');
  const isDocs = story.type === 'docs';

  return a11yCheck && !isDocs;
});

export const navigate = async (
  page: Page,
  id: string,
): Promise<void> => {
  try {
    const url = getStoryUrl(id);

    await page.goto(url);
    await page.waitForSelector(`#${vrtConfig.storybookRootDivId}`);
  } catch (error) {
    console.log('error, navigating to storybook page:');
    console.log(error);
  }
};
