import { useQuery } from '@tanstack/react-query';

import { ApiError } from '../api/client';
import { dbCheckQuery, healthQuery  } from '../api/queries';
import type {
  DbCheckResponse,
  HealthResponse,

} from '../api/queries';

import {

  Badge,
  Button,
  Card,



} from '../components/design-system';
import { useStockStore } from '../store';

import  dayjs from "dayjs";


export const DashboardPage = () => {
  const health = useQuery<HealthResponse, ApiError>(healthQuery);
  const dbCheck = useQuery<DbCheckResponse, ApiError>(dbCheckQuery);

  const dbCheckData = dbCheck.data as
    | { db: string; select_1: number }
    | undefined;




  const { recordDelivery, scheduleAudit, resolveAudit, addLocation } =
    useStockStore();





  return (
    <>
      <div className="flex flex-wrap items-center gap-3">



      </div>

      <section className="mt-6 grid gap-6 md:grid-cols-2">


        <Card
          eyebrow={dayjs().format("DD/MM/YYYY")}
          title="Weather"

          footer={
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => recordDelivery(75)}>Record delivery</Button>
              <Button variant="secondary" onClick={() => scheduleAudit()}>
                Schedule audit
              </Button>
              <Button variant="secondary" onClick={() => resolveAudit()}>
                Close audit
              </Button>
              <Button variant="secondary" onClick={() => addLocation()}>
                Add warehouse
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-sm text-[--ink-muted]">
         Weather
          </div>
        </Card>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Card eyebrow="API Health" title="Service Status">
          <div className="rounded-[--radius-md] border border-[--border] bg-[--surface-muted] p-4">
            {health.isPending && (
              <p className="text-sm text-[--ink-muted]">Checking health...</p>
            )}
            {health.isError && (
              <div className="space-y-1">
                <Badge variant="warning">Health check failed</Badge>
                <p className="text-sm text-[--ink-muted]">
                  {(health.error as Error).message}
                </p>
              </div>
            )}
            {health.isSuccess && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="success">OK</Badge>
                </div>
                <span className="text-xs font-medium text-[--ink-muted]">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </Card>

        <Card
          eyebrow="Database Check"
          title="Connection Status"
          action={
            <Button size="sm" variant="secondary" onClick={() => dbCheck.refetch()}>
              Re-run check
            </Button>
          }
        >
          <div className="rounded-[--radius-md] border border-[--border] bg-[--surface-muted] p-4">
            {dbCheck.isPending && (
              <p className="text-sm text-[--ink-muted]">Running DB check...</p>
            )}
            {dbCheck.isError && (
              <div className="space-y-1">
                <Badge variant="warning">DB check failed</Badge>
                <p className="text-sm text-[--ink-muted]">
                  {(dbCheck.error as Error).message}
                </p>
              </div>
            )}
            {dbCheckData && (
              <div className="space-y-2 text-sm text-[--ink]">
                <div className="flex items-center justify-between">
                  <span className="text-[--ink-muted]">Status</span>
                  <Badge variant="success">{dbCheckData.db}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[--ink-muted]">select 1</span>
                  <span className="font-semibold text-[--ink]">{dbCheckData.select_1}</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>


    </>
  );
};
