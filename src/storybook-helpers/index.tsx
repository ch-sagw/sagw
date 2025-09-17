import { PartialStoryFn } from 'storybook/internal/types';
import { ReactElement } from 'react';
import { vrtConfig } from '@/automated-testing/config';

export const defaultDecorator = (Story: PartialStoryFn): ReactElement => (
  <div
    style={{
      display: 'block',
      padding: '3rem',
    }}
    data-testid={vrtConfig.testid}
    id={vrtConfig.testid}
    className='theme-sagw'
  >
    <Story />
  </div>
);
