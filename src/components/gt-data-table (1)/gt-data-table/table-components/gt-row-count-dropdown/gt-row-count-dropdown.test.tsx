import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import GTRowCountDropdown from './gt-row-count-dropdown';

describe('GTRowCountDropdown', () => {
  it('Renders GTRowCountDropdown without throwing an error', () => {
    expect(() => render(<GTRowCountDropdown pageCount={15} onChange={() => {}} />)).not.toThrow();
  });
});
