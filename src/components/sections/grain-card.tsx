import { useQuery } from '@tanstack/react-query';

import type { ApiError } from '../../api/client';
import { grainPricesQuery, type GrainPricesResponse } from '../../api/queries';
import { Badge, Card } from '../design-system';

type GrainListItem = {
  name?: string;
  commodity?: string;
  price?: number;
  unit?: string;
  currency?: string;
  market?: string;
  source?: string;
  date?: string;
  label?: string;
    basis?:string
    contracts?:{label:string, price:number }[]
};



function GrainCard() {
  const grain = useQuery<GrainPricesResponse, ApiError>(
    grainPricesQuery({ refresh: 1 })
  );
    console.log(grain.data)
  const list = Array.isArray((grain.data as any)?.items)
    ? ((grain.data as any).items as GrainListItem[])
    : [];

  return (
    <Card eyebrow="Grain Prices" title="Current Grain Prices">
      <div className="rounded-[--radius-md] border border-[--border] bg-[--surface-muted] p-4">
        {grain.isPending && (
          <p className="text-sm text-[--ink-muted]">Loading grain prices...</p>
        )}
        {grain.isError && (
          <div className="space-y-1">
            <Badge variant="warning">Cannot load grain prices</Badge>
            <p className="text-sm text-[--ink-muted]">
              {(grain.error as Error).message}
            </p>
          </div>
        )}
        {!grain.isPending && !grain.isError && list.length === 0 && (
          <p className="text-sm text-[--ink-muted]">No grain prices available.</p>
        )}
        {!grain.isPending && !grain.isError && list.length > 0 && (
          <div className="space-y-2 text-sm">
            {list.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-[--radius-md] border border-[--border] bg-[--surface] px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-[--ink]">
                      {item.label}
                    </p>
                      <p className="text-sm italic  text-[--ink]">
                          {item.basis}
                      </p>
                      {
                          item.contracts?.map((value, i)=> (
                              <div key={i}>
                                  <p >{value?.label} £{
                                      value?.price
                                  }</p>
                              </div>

                          ))
                      }
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
export default GrainCard;
