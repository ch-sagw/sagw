import { Page } from '@playwright/test';
import { IndexEntry } from 'storybook/internal/types';
import { vrtConfig } from '@/visual-regression-testing/config';

export const getStoryUrl = (id: string): string => {
  const params = new URLSearchParams({
    id,
    nav: '0',
    viewMode: 'story',
  });

  return `${vrtConfig.baseUrl}/iframe.html?${params.toString()}`;
};

export const filterStories = (stories: IndexEntry[]): IndexEntry[] => stories.filter((story) => {
  const hasVisualCheck = story?.tags?.includes('visual:check');
  const isDocs = story.type === 'docs';

  return hasVisualCheck && !isDocs;
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
