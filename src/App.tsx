import { useQuery } from "@tanstack/react-query";
import { ApiError } from "./api/client";
import type {
  DbCheckResponse,
  HealthResponse,
  SheepResponse,
} from "./api/queries";
import { dbCheckQuery, healthQuery, sheepQuery } from "./api/queries";
import { useStockStore } from "./store";

const App = () => {
  const health = useQuery<HealthResponse, ApiError>(healthQuery);
  const dbCheck = useQuery<DbCheckResponse, ApiError>(dbCheckQuery);
  const sheep = useQuery<SheepResponse, ApiError>(sheepQuery);

  const {
    totalItems,
    pendingAudits,
    locations,
    lastActivity,
    recordDelivery,
    scheduleAudit,
    resolveAudit,
    addLocation,
  } = useStockStore();

  return (
    <div className="min-h-screen bg-[--surface] text-[--ink] transition-colors">
      <header className="border-b border-[--border] bg-[--surface]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
              Flock Management
            </p>
            <h1 className="text-xl font-semibold text-[--ink]">
              Stock Records
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[--border] bg-[--surface-muted] px-4 py-2 text-sm font-medium text-[--ink] shadow-sm">
            <span
              className="h-2.5 w-2.5 rounded-full bg-emerald-500"
              aria-hidden
            />
            Realtime sync ready
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted]">
              Overview
            </p>
            <div className="mt-4 space-y-3">
              {sheep.data &&
                sheep.data.map((x, i) => (
                  <div key={i} className="flex justify-evenly">
                    {x.tagnr}
                    {x.name}
                    {x.age}
                  </div>
                ))}
            </div>
            <p className="mt-3 text-xs font-medium text-[--ink-muted]">
              Last activity: {lastActivity}
            </p>
          </div>

          <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted]">
              Getting Started
            </p>
            <div className="mt-4 space-y-3 text-sm text-[--ink-muted]">
              <p>
                Add your first warehouse and items to start tracking stock
                levels. These stats are powered by a local Zustand store so you
                can try quick interactions without wiring an API yet.
              </p>
              <p>
                Use TanStack Query for data fetching and caching; devtools are
                pre-wired.
              </p>
              <p>
                Connect your API and replace the placeholder stats above with
                live data.
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => recordDelivery(75)}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-px hover:bg-slate-800 active:translate-y-0 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                Record delivery
              </button>
              <button
                onClick={() => scheduleAudit()}
                className="rounded-xl border border-[--border] bg-[--surface] px-4 py-2 text-sm font-semibold text-[--ink] transition hover:-translate-y-px hover:bg-[--surface-muted] active:translate-y-0"
              >
                Schedule audit
              </button>
              <button
                onClick={() => resolveAudit()}
                className="rounded-xl border border-[--border] bg-[--surface] px-4 py-2 text-sm font-semibold text-[--ink] transition hover:-translate-y-px hover:bg-[--surface-muted] active:translate-y-0"
              >
                Close audit
              </button>
              <button
                onClick={() => addLocation()}
                className="rounded-xl border border-[--border] bg-[--surface] px-4 py-2 text-sm font-semibold text-[--ink] transition hover:-translate-y-px hover:bg-[--surface-muted] active:translate-y-0"
              >
                Add warehouse
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted]">
              API Health
            </p>
            <div className="mt-4 rounded-xl border border-[--border] bg-[--surface-muted] p-4">
              {health.isPending && (
                <p className="text-sm text-[--ink-muted]">Checking health...</p>
              )}
              {health.isError && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-amber-500">
                    Health check failed
                  </p>
                  <p className="text-sm text-[--ink-muted]">
                    {(health.error as Error).message}
                  </p>
                </div>
              )}
              {health.data && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-emerald-500"
                      aria-hidden
                    />
                    <p className="text-sm text-[--ink]">OK</p>
                  </div>
                  <span className="text-xs font-medium text-[--ink-muted]">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[--border] bg-[--surface] p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[--ink-muted]">
              Database Check
            </p>
            <div className="mt-4 rounded-xl border border-[--border] bg-[--surface-muted] p-4">
              {dbCheck.isPending && (
                <p className="text-sm text-[--ink-muted]">
                  Running DB check...
                </p>
              )}
              {dbCheck.isError && (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-amber-500">
                    DB check failed
                  </p>
                  <p className="text-sm text-[--ink-muted]">
                    {(dbCheck.error as Error).message}
                  </p>
                </div>
              )}
              {dbCheck.data && (
                <div className="space-y-2 text-sm text-[--ink]">
                  <div className="flex items-center justify-between">
                    <span className="text-[--ink-muted]">Status</span>
                    <span className="font-semibold text-emerald-500">
                      {dbCheck.data.db}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[--ink-muted]">select 1</span>
                    <span className="font-semibold text-[--ink]">
                      {dbCheck.data.select_1}
                    </span>
                  </div>
                  <button
                    onClick={() => dbCheck.refetch()}
                    className="mt-2 rounded-lg border border-[--border] bg-[--surface] px-3 py-1.5 text-xs font-semibold text-[--ink] transition hover:-translate-y-px hover:bg-[--surface-muted] active:translate-y-0"
                  >
                    Re-run check
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
