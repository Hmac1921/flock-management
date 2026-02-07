import { Dispatch } from 'react';

import { ListResponse } from './gt-data-table-types';
import { ACTION_TYPES, TableAction } from './gt-data-table.reducer';

const load = (
  endpoint: (obj: Record<string, unknown>) => Promise<ListResponse>,
  tablePayload: {
    page: number;
    pageCount: number;
    sortOrder: string;
    sortColumn: string;
  },
  filterPayload: Record<string, unknown>,
  dispatch: Dispatch<TableAction>,
) => {
  endpoint(tablePayload)
    .then((res: ListResponse) => {
      dispatch({ type: ACTION_TYPES.INIT, data: res.data, tablePayload: tablePayload, filterPayload: filterPayload });
    })
    .catch((error) => {
      console.error(error);
      dispatch({ type: ACTION_TYPES.ERROR });
    });
};

const loadFiltered = (
  endpoint: (obj: Record<string, unknown>) => Promise<ListResponse>,
  tablePayload: {
    page: number;
    pageCount: number;
    sortOrder: string;
    sortColumn: string;
  },
  filterPayload: Record<string, unknown>,
  dispatch: Dispatch<TableAction>,
) => {
  endpoint({ ...tablePayload, ...filterPayload, page: 0 })
    .then((res) =>
      dispatch({
        type: ACTION_TYPES.FILTER_LIST,
        data: res.data,
        tablePayload: { ...tablePayload, page: 0 },
        filterPayload: filterPayload,
      }),
    )
    .catch((error) => {
      console.error(error);
      dispatch({ type: ACTION_TYPES.ERROR });
    });
};

const changePage = (
  endpoint: (obj: Record<string, unknown>) => Promise<ListResponse>,
  tablePayload: {
    page: number;
    pageCount: number;
    sortOrder: string;
    sortColumn: string;
  },
  filterPayload: Record<string, unknown>,
  dispatch: Dispatch<TableAction>,
) => {
  let obj = {};

  for (const key in filterPayload) {
    if (filterPayload[key]) {
      obj = { ...obj, [key]: filterPayload[key] };
    }
  }

  endpoint({ ...tablePayload, ...obj })
    .then((res) =>
      dispatch({
        type: ACTION_TYPES.FILTER_LIST,
        data: res.data,
        tablePayload: tablePayload,
        filterPayload: obj,
      }),
    )
    .catch((error) => {
      console.error(error);
      dispatch({ type: ACTION_TYPES.ERROR });
    });
};

export { load, loadFiltered, changePage };
