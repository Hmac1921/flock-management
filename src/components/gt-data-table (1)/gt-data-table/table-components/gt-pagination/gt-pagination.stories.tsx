import { fn } from '@storybook/test';
import { Meta, StoryObj } from '@storybook/react';

import GTPagination from './gt-pagination';

const meta: Meta<typeof GTPagination> = {
  component: GTPagination,
  title: 'Molecules/GTPagination',
  tags: ['autodocs'],
};

export default meta;

const Template: StoryObj<typeof GTPagination>['render'] = (args) => <GTPagination {...args} />;

export const GTPaginationStory: StoryObj<typeof GTPagination> = {
  render: Template,
  args: {
    count: 0,
    payload: {
      page: 0,
      pageCount: 15,
    },
    onChange: fn(),
  },
};
