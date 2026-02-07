import createClient from 'openapi-fetch';
import type { paths } from './schema';

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

type HealthOk = { ok: boolean };
type DbCheckOk = { db: string; select_1: number };
type Sheep = {
  guid: string;
  tagnr: string;
  name: string;
  age: number;
};

export const getHealth = async (): Promise<HealthOk> => {
  const res = (await client.GET('/health', {})) as any;
  if (res.error) {
    const status = res.response.status;
    const message =
      (res.error as { message?: string })?.message ??
      `Request failed with status ${status}`;
    throw new ApiError(message, status, res.error);
  }
  if (!res.data) throw new ApiError('Health response missing payload');
  return res.data as HealthOk;
};

export const getDbCheck = async (): Promise<DbCheckOk> => {
  const res = (await client.GET('/db-check', {})) as any;
  if (res.error) {
    const status = res.response.status;
    const message =
      (res.error as { message?: string })?.message ??
      `Request failed with status ${status}`;
    throw new ApiError(message, status, res.error);
  }
  if (!res.data) throw new ApiError('DB check response missing payload');
  return res.data as DbCheckOk;
};

export const listSheep = async (): Promise<Sheep[]> => {
  const res = (await client.GET('/sheep', {})) as any;
  if (res.error) {
    const status = res.response.status;
    const message =
      (res.error as { message?: string })?.message ??
      `Request failed with status ${status}`;
    throw new ApiError(message, status, res.error);
  }
  if (!res.data) throw new ApiError('Sheep response missing payload');
  return res.data as Sheep[];
};
