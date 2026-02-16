import { Card, EmptyState } from "../components/design-system";
import { useQuery } from "@tanstack/react-query";
import { sheepQuery, type SheepResponse } from "../api/queries.ts";
import { ApiError } from "../api/client.ts";
import type { ColumnProps } from "../components/gt-data-table (1)/gt-data-table/gt-data-table-types.ts";
import type { components } from "../api/schema";
import useCreateTableDef from "../components/gt-data-table (1)/gt-data-table/table-hooks/use-create-table-def.ts";
import { useStockStore } from "../store.ts";
import { SheepTableSection } from "../components/sections/sheep-table-section.tsx";

export const FlockPage = () => {
  const sheep = useQuery<SheepResponse, ApiError>(sheepQuery);

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
      field: "gender",
      header: "Gender",
    }),
    useCreateTableDef<components["schemas"]["SheepOut"]>({
      field: "age",
      header: "Age",
    }),
  ];

  const { lastActivity } = useStockStore();
  const sheepRecords = sheep.data ?? [];

  return (
    <Card eyebrow="Flock" title="Sheep Records">
      {sheepRecords.length < 1 && (
        <EmptyState
          title="No flock records yet"
          description="Add sheep records to start tracking tags, ages, and health history."
          actionLabel="Add sheep"
        />
      )}
      {sheepRecords.length > 0 && (
        <SheepTableSection
          columns={columns}
          data={sheepRecords}
          lastActivity={lastActivity}
        />
      )}
    </Card>
  );
};
