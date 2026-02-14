import { queryOptions } from '@tanstack/react-query';
import {
  ApiError,
  getAnmartsAuctions,
  getDbCheck,
  getDigestStatus,
  getDigestWeeklyPreview,
  getField,
  getGrainPrices,
  getHealth,
  getPrices,
  getSheep,
  getSheepPrices,
  getSheepRecord,
  getWeather,
  getWithdrawalStatus,
  listFields,
  listLocations,
  listSheep,
  listSheepEvents,
  listVetMedicines,
  listVetStockLots,
  listVetTreatments,
} from './client';

export type HealthResponse = Awaited<ReturnType<typeof getHealth>>;
export type DbCheckResponse = Awaited<ReturnType<typeof getDbCheck>>;
export type SheepResponse = Awaited<ReturnType<typeof listSheep>>;
export type SheepDetailResponse = Awaited<ReturnType<typeof getSheep>>;
export type SheepEventsResponse = Awaited<ReturnType<typeof listSheepEvents>>;
export type SheepRecordResponse = Awaited<ReturnType<typeof getSheepRecord>>;
export type VetMedicinesResponse = Awaited<ReturnType<typeof listVetMedicines>>;
export type VetStockLotsResponse = Awaited<ReturnType<typeof listVetStockLots>>;
export type VetTreatmentsResponse = Awaited<ReturnType<typeof listVetTreatments>>;
export type WithdrawalStatusResponse = Awaited<
  ReturnType<typeof getWithdrawalStatus>
>;
export type LocationsResponse = Awaited<ReturnType<typeof listLocations>>;
export type FieldsResponse = Awaited<ReturnType<typeof listFields>>;
export type FieldDetailResponse = Awaited<ReturnType<typeof getField>>;
export type WeatherResponse = Awaited<ReturnType<typeof getWeather>>;
export type AnmartsAuctionsResponse = Awaited<
  ReturnType<typeof getAnmartsAuctions>
>;
export type PricesResponse = Awaited<ReturnType<typeof getPrices>>;
export type GrainPricesResponse = Awaited<ReturnType<typeof getGrainPrices>>;
export type SheepPricesResponse = Awaited<ReturnType<typeof getSheepPrices>>;
export type DigestStatusResponse = Awaited<ReturnType<typeof getDigestStatus>>;
export type DigestWeeklyPreviewResponse = Awaited<
  ReturnType<typeof getDigestWeeklyPreview>
>;

export const healthQuery = queryOptions<HealthResponse, ApiError>({
  queryKey: ['health'],
  queryFn: getHealth,
  staleTime: 30_000,
  retry: 1,
});

export const dbCheckQuery = queryOptions<DbCheckResponse, ApiError>({
  queryKey: ['db-check'],
  queryFn: getDbCheck,
  staleTime: 30_000,
  retry: 1,
});

export const sheepQuery = queryOptions<SheepResponse, ApiError>({
  queryKey: ['sheep'],
  queryFn: listSheep,
  staleTime: 30_000,
  retry: 1,
});

export const sheepDetailQuery = (guid: string) =>
  queryOptions<SheepDetailResponse, ApiError>({
    queryKey: ['sheep', guid],
    queryFn: () => getSheep(guid),
    staleTime: 30_000,
    retry: 1,
  });

export const sheepEventsQuery = (
  guid: string,
  query?: { event_type?: string | null; limit?: number }
) =>
  queryOptions<SheepEventsResponse, ApiError>({
    queryKey: ['sheep', guid, 'events', query ?? {}],
    queryFn: () => listSheepEvents(guid, query),
    staleTime: 30_000,
    retry: 1,
  });

export const sheepRecordQuery = (
  guid: string,
  query?: { scope?: string; limit_events?: number; limit_treatments?: number }
) =>
  queryOptions<SheepRecordResponse, ApiError>({
    queryKey: ['sheep', guid, 'record', query ?? {}],
    queryFn: () => getSheepRecord(guid, query),
    staleTime: 30_000,
    retry: 1,
  });

export const vetMedicinesQuery = queryOptions<VetMedicinesResponse, ApiError>({
  queryKey: ['vet', 'medicines'],
  queryFn: listVetMedicines,
  staleTime: 30_000,
  retry: 1,
});

export const vetStockLotsQuery = (query?: { medicine_id?: string | null }) =>
  queryOptions<VetStockLotsResponse, ApiError>({
    queryKey: ['vet', 'stock', 'lots', query ?? {}],
    queryFn: () => listVetStockLots(query),
    staleTime: 30_000,
    retry: 1,
  });

export const vetTreatmentsQuery = (query?: {
  sheep_guid?: string | null;
  limit?: number;
}) =>
  queryOptions<VetTreatmentsResponse, ApiError>({
    queryKey: ['vet', 'treatments', query ?? {}],
    queryFn: () => listVetTreatments(query),
    staleTime: 30_000,
    retry: 1,
  });

export const withdrawalStatusQuery = (query?: {
  sheep_guid?: string | null;
  sheep_tagnr?: string | null;
}) =>
  queryOptions<WithdrawalStatusResponse, ApiError>({
    queryKey: ['vet', 'withdrawal-status', query ?? {}],
    queryFn: () => getWithdrawalStatus(query),
    staleTime: 30_000,
    retry: 1,
  });

export const locationsQuery = queryOptions<LocationsResponse, ApiError>({
  queryKey: ['locations'],
  queryFn: listLocations,
  staleTime: 30_000,
  retry: 1,
});

export const fieldsQuery = queryOptions<FieldsResponse, ApiError>({
  queryKey: ['fields'],
  queryFn: listFields,
  staleTime: 30_000,
  retry: 1,
});

export const fieldDetailQuery = (fieldId: string) =>
  queryOptions<FieldDetailResponse, ApiError>({
    queryKey: ['fields', fieldId],
    queryFn: () => getField(fieldId),
    staleTime: 30_000,
    retry: 1,
  });

export const weatherQuery = (query?: {
  lat?: number;
  lon?: number;
  days?: number;
}) =>
  queryOptions<WeatherResponse, ApiError>({
    queryKey: ['weather', query ?? {}],
    queryFn: () => getWeather(query),
    staleTime: 30_000,
    retry: 1,
  });

export const anmartsAuctionsQuery = (query?: {
  raw?: number;
  status?: string;
  sale_type?: string;
  page?: number;
}) =>
  queryOptions<AnmartsAuctionsResponse, ApiError>({
    queryKey: ['anmarts', 'auctions', query ?? {}],
    queryFn: () => getAnmartsAuctions(query),
    staleTime: 30_000,
    retry: 1,
  });

export const pricesQuery = (query?: {
  category?: string[] | null;
  type?: string[] | null;
  commodity?: string[] | null;
  source?: string[] | null;
  refresh?: number;
}) =>
  queryOptions<PricesResponse, ApiError>({
    queryKey: ['prices', query ?? {}],
    queryFn: () => getPrices(query),
    staleTime: 30_000,
    retry: 1,
  });

export const grainPricesQuery = (query?: { refresh?: number }) =>
  queryOptions<GrainPricesResponse, ApiError>({
    queryKey: ['grain-prices', query ?? {}],
    queryFn: () => getGrainPrices(query),
    staleTime: 30_000,
    retry: 1,
  });

export const sheepPricesQuery = (query?: {
  type?: string | null;
  refresh?: number;
}) =>
  queryOptions<SheepPricesResponse, ApiError>({
    queryKey: ['sheep-prices', query ?? {}],
    queryFn: () => getSheepPrices(query),
    staleTime: 30_000,
    retry: 1,
  });

export const digestStatusQuery = queryOptions<DigestStatusResponse, ApiError>({
  queryKey: ['digest', 'status'],
  queryFn: getDigestStatus,
  staleTime: 30_000,
  retry: 1,
});

export const digestWeeklyPreviewQuery = (query?: {
  days?: number;
  refresh_prices?: number;
}) =>
  queryOptions<DigestWeeklyPreviewResponse, ApiError>({
    queryKey: ['digest', 'weekly', 'preview', query ?? {}],
    queryFn: () => getDigestWeeklyPreview(query),
    staleTime: 30_000,
    retry: 1,
  });
