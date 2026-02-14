import type { ReactNode } from 'react';

import type { components } from '../../api/schema';
import type { ColumnProps } from '../gt-data-table (1)/gt-data-table/gt-data-table-types';
import {

  GTDataTable,
  GTFilterClear,
  GTFilterDate,
  GTFilterRadioGroup,
  GTFilterSelect,
  GTFilterText,

} from '../design-system';

type Sheep = components['schemas']['SheepOut'];

type SheepTableSectionProps = {
  columns: ColumnProps<Sheep>[];
  data: Sheep[];
  lastActivity: ReactNode;
};

export const SheepTableSection = ({
  columns,
  data,

}: SheepTableSectionProps) => {
  const ageOptions = Array.from(new Set(data.map((item) => item.age)))
    .filter((age) => Number.isFinite(age))
    .sort((a, b) => a - b)
    .map((age) => ({ label: `${age}`, value: age }));

  const ageGroupOptions = [
    { label: 'Lamb (0-1)', value: 'lamb' },
    { label: 'Yearling (2)', value: 'yearling' },
    { label: 'Adult (3+)', value: 'adult' },
  ];

  const parseDateInput = (value: string | undefined) => {
    if (!value) {
      return null;
    }

    const date = new Date(`${value}T00:00:00`);
    return isNaN(date.getTime()) ? null : date;
  };

  const filterPredicate = (
    row: Sheep,
    filters: Partial<Record<keyof Sheep | 'q' | 'ageGroup' | 'bornAfter', unknown>>
  ) => {
    const search = filters.q;
    if (typeof search === 'string' && search.trim() !== '') {
      const query = search.toLowerCase();
      const matches =
        row.tagnr.toLowerCase().includes(query) ||
        row.name.toLowerCase().includes(query);
      if (!matches) {
        return false;
      }
    }

    const ageFilter = filters.age;
    if (typeof ageFilter === 'number' && row.age !== ageFilter) {
      return false;
    }

    const ageGroup = filters.ageGroup;
    if (typeof ageGroup === 'string' && ageGroup !== '') {
      const isLamb = row.age <= 1;
      const isYearling = row.age === 2;
      const isAdult = row.age >= 3;
      if (
        (ageGroup === 'lamb' && !isLamb) ||
        (ageGroup === 'yearling' && !isYearling) ||
        (ageGroup === 'adult' && !isAdult)
      ) {
        return false;
      }
    }

    const bornAfter = filters.bornAfter;
    if (typeof bornAfter === 'string' && bornAfter !== '') {
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

  return (


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
          data={data}
          filterPredicate={filterPredicate}
        />
      </div>


  );
};
