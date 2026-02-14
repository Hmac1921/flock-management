import { useQuery } from "@tanstack/react-query";
import { ApiError } from "./api/client";
import type {
  DbCheckResponse,
  HealthResponse,
  SheepResponse,
} from "./api/queries";
import { dbCheckQuery, healthQuery, sheepQuery } from "./api/queries";
import { useStockStore } from "./store";
import { useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Divider,
  EmptyState,
  Field,
  GTDataTable,
  GTFilterDate,
  GTFilterClear,
  GTFilterRadioGroup,
  GTFilterSelect,
  GTFilterText,
  Input,
  PageHeader,
  RadioGroup,
  Select,
  StatCard,
  Switch,
  Textarea,
} from "./components/design-system";
import {
  getSeason,
  getSeasonOverride,
  getColorModeOverride,
  setSeasonOverride,
  setColorModeOverride,
  type SeasonMode,
  type ColorMode,
} from "./season-theme";
import useCreateTableDef from "./components/gt-data-table (1)/gt-data-table/table-hooks/use-create-table-def.ts";
import type { components } from "./api/schema";
import type { ColumnProps } from "./components/gt-data-table (1)/gt-data-table/gt-data-table-types";

const App = () => {
  const health = useQuery<HealthResponse, ApiError>(healthQuery);
  const dbCheck = useQuery<DbCheckResponse, ApiError>(dbCheckQuery);
  const sheep = useQuery<SheepResponse, ApiError>(sheepQuery);
  const dbCheckData = dbCheck.data as { db: string; select_1: number } | undefined;
  const columns: ColumnProps<components["schemas"]["SheepOut"]>[] = [
    useCreateTableDef<components["schemas"]["SheepOut"]>({
      field: "tagnr",
      header: "Tag",
    }),
    useCreateTableDef<components["schemas"]["SheepOut"]>({
      field: "name",
      header: "Name",
    }),
    useCreateTableDef<components["schemas"]["SheepOut"]>({
      field: "age",
      header: "Age",
    }),
  ];

  const sheepData = sheep.data ?? [];
  const ageOptions = Array.from(new Set(sheepData.map((item) => item.age)))
    .filter((age) => Number.isFinite(age))
    .sort((a, b) => a - b)
    .map((age) => ({ label: `${age}`, value: age }));

  const ageGroupOptions = [
    { label: "Lamb (0-1)", value: "lamb" },
    { label: "Yearling (2)", value: "yearling" },
    { label: "Adult (3+)", value: "adult" },
  ];

  const parseDateInput = (value: string | undefined) => {
    if (!value) {
      return null;
    }

    const date = new Date(`${value}T00:00:00`);
    return isNaN(date.getTime()) ? null : date;
  };

  const filterPredicate = (
    row: components["schemas"]["SheepOut"],
    filters: Partial<Record<keyof components["schemas"]["SheepOut"] | "q" | "ageGroup" | "bornAfter", unknown>>
  ) => {
    const search = filters.q;
    if (typeof search === "string" && search.trim() !== "") {
      const query = search.toLowerCase();
      const matches =
        row.tagnr.toLowerCase().includes(query) ||
        row.name.toLowerCase().includes(query);
      if (!matches) {
        return false;
      }
    }

    const ageFilter = filters.age;
    if (typeof ageFilter === "number" && row.age !== ageFilter) {
      return false;
    }

    const ageGroup = filters.ageGroup;
    if (typeof ageGroup === "string" && ageGroup !== "") {
      const isLamb = row.age <= 1;
      const isYearling = row.age === 2;
      const isAdult = row.age >= 3;
      if (
        (ageGroup === "lamb" && !isLamb) ||
        (ageGroup === "yearling" && !isYearling) ||
        (ageGroup === "adult" && !isAdult)
      ) {
        return false;
      }
    }

    const bornAfter = filters.bornAfter;
    if (typeof bornAfter === "string" && bornAfter !== "") {
      const cutoff = parseDateInput(bornAfter);
      if (cutoff) {
        const birthYear = new Date().getFullYear() - row.age;
        const birthDate = new Date(birthYear, 0, 1);
        if (birthDate < cutoff) {
          return false;
        }
      }
    }

    return true;
  };

  const {
    lastActivity,
    recordDelivery,
    scheduleAudit,
    resolveAudit,
    addLocation,
  } = useStockStore();

  const [seasonMode, setSeasonMode] = useState<SeasonMode>(() =>
    getSeasonOverride()
  );
  const [colorMode, setColorMode] = useState<ColorMode>(() =>
    getColorModeOverride()
  );
  const seasonLabel =
    seasonMode === "auto"
      ? `${getSeason().charAt(0).toUpperCase()}${getSeason().slice(1)}`
      : `${seasonMode.charAt(0).toUpperCase()}${seasonMode.slice(1)}`;

  useEffect(() => {
    setSeasonOverride(seasonMode);
  }, [seasonMode]);

  useEffect(() => {
    setColorModeOverride(colorMode);
  }, [colorMode]);

  return (
    <div className="min-h-screen bg-[--surface] text-[--ink] transition-colors">
      <header className="border-b border-[--border] bg-[--surface]">
        <div className="mx-auto flex max-w-5xl px-6 py-6">
          <PageHeader
            title="Stock Records"
            subtitle="A clear view of sheep status, health, and logistics."
            actions={
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
                    Season
                  </span>
                  <Select
                    uiSize="sm"
                    value={seasonMode}
                    onChange={(event) =>
                      setSeasonMode(event.target.value as SeasonMode)
                    }
                  >
                    <option value="auto">Auto ({seasonLabel})</option>
                    <option value="winter">Winter</option>
                    <option value="spring">Spring</option>
                    <option value="summer">Summer</option>
                    <option value="autumn">Autumn</option>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
                    Mode
                  </span>
                  <Select
                    uiSize="sm"
                    value={colorMode}
                    onChange={(event) =>
                      setColorMode(event.target.value as ColorMode)
                    }
                  >
                    <option value="auto">Auto</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </Select>
                </div>
                <Badge variant="accent">{seasonLabel} Mode</Badge>
                <Badge variant="success">Sync Ready</Badge>
                <Button variant="secondary" size="sm">
                  New Sheep
                </Button>
              </>
            }
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="grid gap-6 md:grid-cols-2">
          <Card eyebrow="Overview" title="Current Flock Snapshot">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard label="Sheep Count" value={sheepData.length || "--"} trend="+3" />
              <StatCard label="Audits" value="2 scheduled" trend="This week" />
            </div>
            <div className="mt-4">
              <GTDataTable
                toolbar={
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className="text-sm font-medium">Sheep List</span>
                    <div className="flex flex-wrap items-end gap-3">
                      <GTFilterText field="q" label="Search" />
                      <GTFilterSelect field="age" label="Age" options={ageOptions} />
                      <GTFilterRadioGroup
                        field="ageGroup"
                        label="Age Group"
                        options={ageGroupOptions}
                      />
                      <GTFilterDate field="bornAfter" label="Born After" />
                      <GTFilterClear />
                    </div>
                  </div>
                }
                columns={columns}
                data={sheepData}
                filterPredicate={filterPredicate}
              />
            </div>
            <p className="mt-3 text-xs font-medium text-[--ink-muted]">
              Last activity: {lastActivity}
            </p>
          </Card>

          <Card
            eyebrow="Getting Started"
            title="Kickoff Tasks"
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
                    <span className="font-semibold text-[--ink]">
                      {dbCheckData.select_1}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </section>

        <section className="mt-10 grid gap-6">
          <Card eyebrow="Design System" title="Component Gallery">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar name="Mum Shepherd" />
                  <div>
                    <p className="text-sm font-semibold text-[--ink]">Mum Shepherd</p>
                    <p className="text-xs text-[--ink-muted]">Primary caretaker</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge>Draft</Badge>
                  <Badge variant="accent">Needs Review</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="danger">Alert</Badge>
                </div>
                <Divider />
                <div className="flex flex-wrap gap-2">
                  <Button>Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                </div>
              </div>
              <div className="space-y-4">
                <Field label="Tag Number" helperText="Unique ID for each sheep.">
                  {(id) => <Input id={id} placeholder="UK-4421" />}
                </Field>
                <Field label="Breed" helperText="Choose a breed for tagging.">
                  {(id) => (
                    <Select id={id} defaultValue="">
                      <option value="" disabled>
                        Select breed
                      </option>
                      <option value="suffolk">Suffolk</option>
                      <option value="texel">Texel</option>
                      <option value="blackface">Scottish Blackface</option>
                    </Select>
                  )}
                </Field>
                <Field label="Notes">
                  {(id) => <Textarea id={id} placeholder="Add notes..." />}
                </Field>
                <div className="flex flex-wrap items-center gap-4">
                  <Checkbox label="Vaccinated" />
                  <Switch checked label="Active" />
                </div>
                <RadioGroup
                  name="status"
                  label="Status"
                  value="healthy"
                  options={[
                    { label: "Healthy", value: "healthy" },
                    { label: "Watch", value: "watch" },
                    { label: "Needs Vet", value: "vet" },
                  ]}
                />
              </div>
            </div>
            <div className="mt-6">
              <EmptyState
                title="No incidents recorded"
                description="Use quick actions to log new events for the flock."
                actionLabel="Add incident"
              />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default App;

