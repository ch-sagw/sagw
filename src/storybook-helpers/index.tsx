import { PartialStoryFn } from '@storybook/types';
import { ReactElement } from 'react';
import { componentsConfig } from '@/components/config';

export const defaultDecorator = (Story: PartialStoryFn): ReactElement => (
  <div
    style={{
      display: 'block',
      padding: '3rem',
    }}
    data-testid={componentsConfig.testid}
  >
    <Story />
  </div>
);
