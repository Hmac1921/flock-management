import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import GTPagination from './gt-pagination';

type GTPaginationProps = {
  payload: {
    pageCount: number;
    page: number;
  };
  count: number;
  onChange: (payload: { pageCount: number; page: number }) => void;
};

describe('GTPagination', () => {
  it('Renders GTPagination without throwing an error', () => {
    const defaultProps: GTPaginationProps = {
      payload: {
        pageCount: 15,
        page: 0,
      },
      count: 0,
      onChange: () => {},
    };

    expect(() => render(<GTPagination {...defaultProps} />)).not.toThrow();
  });
});
