import createClient from 'openapi-fetch';
import type { components, paths } from './schema';

const baseUrl = import.meta.env.VITE_BASE_URL;

if (!baseUrl) {
  throw new Error('Missing VITE_BASE_URL. Set it in .env (e.g. "https://api.example.com").');
}

const client = createClient<paths>({ baseUrl });

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type HealthOk = paths['/health']['get']['responses'][200]['content']['application/json'];
type DbCheckOk = paths['/db-check']['get']['responses'][200]['content']['application/json'];
type Sheep = components['schemas']['SheepOut'];
type SheepEvent = components['schemas']['SheepEventOut'];
type VetMedicine = components['schemas']['VetMedicineOut'];
type VetStockLot = components['schemas']['VetStockLotOut'];
type VetTreatment = components['schemas']['VetTreatmentOut'];
type Location = paths['/locations']['get']['responses'][200]['content']['application/json'];
type Field = paths['/fields']['get']['responses'][200]['content']['application/json'];
type FieldDetail =
  paths['/fields/{field_id}']['get']['responses'][200]['content']['application/json'];
type Weather = paths['/weather']['get']['responses'][200]['content']['application/json'];
type AnmartsAuctions =
  paths['/anmarts/auctions']['get']['responses'][200]['content']['application/json'];
type Prices = paths['/prices']['get']['responses'][200]['content']['application/json'];
type GrainPrices =
  paths['/grain-prices']['get']['responses'][200]['content']['application/json'];
type SheepPrices =
  paths['/sheep-prices']['get']['responses'][200]['content']['application/json'];
type DigestStatus =
  paths['/digest/status']['get']['responses'][200]['content']['application/json'];
type DigestWeeklyPreview =
  paths['/digest/weekly/preview']['get']['responses'][200]['content']['application/json'];
type SheepRecord =
  paths['/sheep/{guid}/record']['get']['responses'][200]['content']['application/json'];
type WithdrawalStatus =
  paths['/vet/withdrawal-status']['get']['responses'][200]['content']['application/json'];

const unwrapResponse = <T>(res: any, context: string): T => {
  if (res.error) {
    const status = res.response?.status;
    const message =
      (res.error as { message?: string })?.message ??
      `Request failed with status ${status}`;
    throw new ApiError(message, status, res.error);
  }
  if (!res.data) throw new ApiError(`${context} response missing payload`);
  return res.data as T;
};

export const getHealth = async (): Promise<HealthOk> => {
  const res = (await client.GET('/health', {})) as any;
  return unwrapResponse<HealthOk>(res, 'Health');
};

export const getDbCheck = async (): Promise<DbCheckOk> => {
  const res = (await client.GET('/db-check', {})) as any;
  return unwrapResponse<DbCheckOk>(res, 'DB check');
};

export const listSheep = async (): Promise<Sheep[]> => {
  const res = (await client.GET('/sheep', {})) as any;
  return unwrapResponse<Sheep[]>(res, 'Sheep');
};

export const getSheep = async (guid: string): Promise<Sheep> => {
  const res = (await client.GET('/sheep/{guid}', {
    params: { path: { guid } },
  })) as any;
  return unwrapResponse<Sheep>(res, 'Sheep detail');
};

export const listSheepEvents = async (
  guid: string,
  query?: { event_type?: string | null; limit?: number }
): Promise<SheepEvent[]> => {
  const res = (await client.GET('/sheep/{guid}/events', {
    params: { path: { guid }, query },
  })) as any;
  return unwrapResponse<SheepEvent[]>(res, 'Sheep events');
};

export const getSheepRecord = async (
  guid: string,
  query?: { scope?: string; limit_events?: number; limit_treatments?: number }
): Promise<SheepRecord> => {
  const res = (await client.GET('/sheep/{guid}/record', {
    params: { path: { guid }, query },
  })) as any;
  return unwrapResponse<SheepRecord>(res, 'Sheep record');
};

export const listVetMedicines = async (): Promise<VetMedicine[]> => {
  const res = (await client.GET('/vet/medicines', {})) as any;
  return unwrapResponse<VetMedicine[]>(res, 'Vet medicines');
};

export const listVetStockLots = async (
  query?: { medicine_id?: string | null }
): Promise<VetStockLot[]> => {
  const res = (await client.GET('/vet/stock/lots', {
    params: { query },
  })) as any;
  return unwrapResponse<VetStockLot[]>(res, 'Vet stock lots');
};

export const listVetTreatments = async (
  query?: { sheep_guid?: string | null; limit?: number }
): Promise<VetTreatment[]> => {
  const res = (await client.GET('/vet/treatments', {
    params: { query },
  })) as any;
  return unwrapResponse<VetTreatment[]>(res, 'Vet treatments');
};

export const getWithdrawalStatus = async (query?: {
  sheep_guid?: string | null;
  sheep_tagnr?: string | null;
}): Promise<WithdrawalStatus> => {
  const res = (await client.GET('/vet/withdrawal-status', {
    params: { query },
  })) as any;
  return unwrapResponse<WithdrawalStatus>(res, 'Withdrawal status');
};

export const listLocations = async (): Promise<Location> => {
  const res = (await client.GET('/locations', {})) as any;
  return unwrapResponse<Location>(res, 'Locations');
};

export const listFields = async (): Promise<Field> => {
  const res = (await client.GET('/fields', {})) as any;
  return unwrapResponse<Field>(res, 'Fields');
};

export const getField = async (fieldId: string): Promise<FieldDetail> => {
  const res = (await client.GET('/fields/{field_id}', {
    params: { path: { field_id: fieldId } },
  })) as any;
  return unwrapResponse<FieldDetail>(res, 'Field detail');
};

export const getWeather = async (query?: {
  lat?: number;
  lon?: number;
  days?: number;
}): Promise<Weather> => {
  const res = (await client.GET('/weather', {
    params: { query },
  })) as any;
  return unwrapResponse<Weather>(res, 'Weather');
};

export const getAnmartsAuctions = async (query?: {
  raw?: number;
  status?: string;
  sale_type?: string;
  page?: number;
}): Promise<AnmartsAuctions> => {
  const res = (await client.GET('/anmarts/auctions', {
    params: { query },
  })) as any;
  return unwrapResponse<AnmartsAuctions>(res, 'Anmarts auctions');
};

export const getPrices = async (query?: {
  category?: string[] | null;
  type?: string[] | null;
  commodity?: string[] | null;
  source?: string[] | null;
  refresh?: number;
}): Promise<Prices> => {
  const res = (await client.GET('/prices', {
    params: { query },
  })) as any;
  return unwrapResponse<Prices>(res, 'Prices');
};

export const getGrainPrices = async (query?: {
  refresh?: number;
}): Promise<GrainPrices> => {
  const res = (await client.GET('/grain-prices', {
    params: { query },
  })) as any;
  return unwrapResponse<GrainPrices>(res, 'Grain prices');
};

export const getSheepPrices = async (query?: {
  type?: string | null;
  refresh?: number;
}): Promise<SheepPrices> => {
  const res = (await client.GET('/sheep-prices', {
    params: { query },
  })) as any;
  return unwrapResponse<SheepPrices>(res, 'Sheep prices');
};

export const getDigestStatus = async (): Promise<DigestStatus> => {
  const res = (await client.GET('/digest/status', {})) as any;
  return unwrapResponse<DigestStatus>(res, 'Digest status');
};

export const getDigestWeeklyPreview = async (query?: {
  days?: number;
  refresh_prices?: number;
}): Promise<DigestWeeklyPreview> => {
  const res = (await client.GET('/digest/weekly/preview', {
    params: { query },
  })) as any;
  return unwrapResponse<DigestWeeklyPreview>(res, 'Digest weekly preview');
};
