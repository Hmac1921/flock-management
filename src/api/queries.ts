import { queryOptions } from '@tanstack/react-query';
import { ApiError, getDbCheck, getHealth, listSheep } from './client';

export type HealthResponse = Awaited<ReturnType<typeof getHealth>>;
export type DbCheckResponse = Awaited<ReturnType<typeof getDbCheck>>;
export type SheepResponse = Awaited<ReturnType<typeof listSheep>>;

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
