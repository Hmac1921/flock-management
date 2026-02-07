import { fn } from '@storybook/test';
import GTDataTable from './gt-data-table-search';

export default {
  component: GTDataTable,
  title: 'Molecules/GTDataTable',
  tags: ['autodocs'],
};

const Template = (args) => <GTDataTable {...args} />;

export const GTDataTableDefault = Template.bind({});
GTDataTableDefault.args = {
  version: 'primary',
  label: 'GTDataTable Main',
  id: 'template-component',
  onClick: fn(),
};
