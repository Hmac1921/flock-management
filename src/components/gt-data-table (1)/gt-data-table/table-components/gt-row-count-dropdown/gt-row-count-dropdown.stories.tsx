import GTRowCountDropdown from './gt-row-count-dropdown';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof GTRowCountDropdown> = {
  component: GTRowCountDropdown,
  title: 'Molecules/GTRowCountDropdown',
  tags: ['autodocs'],
};

export default meta;

const Template: StoryObj<typeof GTRowCountDropdown>['render'] = (args) => <GTRowCountDropdown {...args} />;

export const GTRowCountDropdownStory: StoryObj<typeof GTRowCountDropdown> = {
  render: Template,
  args: {
    pageCount: 5,
  },
};
