const ACTION_TYPES = { INIT: 'init', FILTER_LIST: 'filter-list', LOADING: 'loading', ERROR: 'error' } as const;

type SearchResponse = {
  list: Record<string, unknown>[];
  count: number;
};

type PagePayload = {
  pageCount: number;
  page: number;
  sortColumn: string;
  sortOrder: string;
};

type TableAction =
  | { type: 'init'; data: SearchResponse; tablePayload: PagePayload; filterPayload: Record<string, unknown> }
  | { type: 'filter-list'; data: SearchResponse; tablePayload: PagePayload; filterPayload: Record<string, unknown> }
  | { type: 'loading' }
  | { type: 'error' };

type TableState = {
  initialData: Record<string, unknown>[];
  count: number;
  pagePayload: PagePayload;
  filterPayload: Record<string, unknown> | null;
  loading: boolean;
  error: boolean;
};

const initialArg: TableState = {
  initialData: [],
  count: 0,
  pagePayload: { pageCount: 15, page: 1, sortColumn: 'name', sortOrder: 'desc' },
  filterPayload: null,
  loading: true,
  error: false,
};

// function ObjectPairTypes<K, V>(key: K, value: V): { key: K; value: V } {
//   return { key: key, value: value };
// }

const reducer = (state: TableState, action: TableAction) => {
  switch (action.type) {
    case ACTION_TYPES.INIT: {
      return {
        ...state,
        pagePayload: action.tablePayload,
        filterPayload: action.filterPayload,
        count: action.data.count,
        initialData: action.data.list,
        loading: false,
      };
    }

    case ACTION_TYPES.FILTER_LIST: {
      return {
        ...state,
        pagePayload: action.tablePayload,
        filterPayload: { ...state.filterPayload, ...action.filterPayload },
        count: action.data.count,
        initialData: action.data.list,
        loading: false,
      };
    }

    case ACTION_TYPES.LOADING:
      return {
        ...state,
        loading: true,
      };

    case ACTION_TYPES.ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };

    default:
      return state;
  }
};

export { reducer, initialArg, ACTION_TYPES };
export type { TableState, TableAction };
