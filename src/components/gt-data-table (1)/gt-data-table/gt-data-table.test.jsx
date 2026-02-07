import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import GTDataTable from './gt-data-table-search';

describe('GTDataTable', () => {
  it('Renders GTDataTable without throwing an error', () => {
    expect(() => render(<GTDataTable />)).not.toThrow();
  });
});
