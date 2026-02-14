import type { ReactNode } from 'react';

import { Badge, Card } from '../design-system';

type WeatherData = {
  timezone?: string;
  current_weather_units?: {
    temperature?: string;
    windspeed?: string;
  };
  current_weather?: {
    time?: string;
    temperature?: number;
    windspeed?: number;
    winddirection?: number;
    weathercode?: number;
    is_day?: number;
  };
  daily_units?: {
    temperature_2m_max?: string;
    temperature_2m_min?: string;
    precipitation_sum?: string;
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
  };
};

type WeatherCardProps = {
  data?: WeatherData;
  isPending: boolean;
  isError: boolean;
  error?: Error;
  footer?: ReactNode;
};

const formatTime = (value?: string) => {
  if (!value) return 'Unknown time';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value.replace('T', ' ')
    : date.toLocaleString();
};

const formatTemp = (value?: number, unit?: string) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '--';
  }
  return `${value.toFixed(1)}${unit ?? ''}`;
};

const formatValue = (value?: number, unit?: string) => {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return '--';
  }
  return `${value}${unit ?? ''}`;
};

export const WeatherCard = ({
  data,
  isPending,
  isError,
  error,
  footer,
}: WeatherCardProps) => {
  const tempUnit = data?.current_weather_units?.temperature ?? '°C';
  const windUnit = data?.current_weather_units?.windspeed ?? 'm/s';
  const rainUnit = data?.daily_units?.precipitation_sum ?? 'mm';

  const todayIndex = 0;
  const dailyTime = data?.daily?.time ?? [];
  const maxTemps = data?.daily?.temperature_2m_max ?? [];
  const minTemps = data?.daily?.temperature_2m_min ?? [];
  const precip = data?.daily?.precipitation_sum ?? [];

  const upcoming = dailyTime
    .map((time, index) => ({
      time,
      max: maxTemps[index],
      min: minTemps[index],
      rain: precip[index],
    }))
    .slice(0, 3);

  return (
    <Card
      eyebrow={new Date().toLocaleDateString()}
      title="Weather"
      footer={footer}
    >
      <div className="space-y-4 text-sm text-[--ink-muted]">
        {isPending && <p>Loading weather...</p>}
        {isError && (
          <div className="space-y-1">
            <Badge variant="warning">Weather unavailable</Badge>
            <p>{error?.message ?? 'Failed to load weather data.'}</p>
          </div>
        )}
        {!isPending && !isError && data && (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[--radius-md] border border-[--border] bg-[--surface-muted] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
                  Current
                </div>
                <div className="mt-2 text-2xl font-semibold text-[--ink]">
                  {formatTemp(data.current_weather?.temperature, tempUnit)}
                </div>
                <div className="mt-2 space-y-1 text-xs">
                  <div>Wind: {formatValue(data.current_weather?.windspeed, windUnit)}</div>
                  <div>
                    Direction:{' '}
                    {formatValue(data.current_weather?.winddirection, '°')}
                  </div>
                  <div>As of {formatTime(data.current_weather?.time)}</div>
                </div>
              </div>
              <div className="rounded-[--radius-md] border border-[--border] bg-[--surface-muted] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
                  Today
                </div>
                <div className="mt-2 flex items-center gap-3 text-sm text-[--ink]">
                  <span className="font-semibold">
                    Max {formatTemp(maxTemps[todayIndex], tempUnit)}
                  </span>
                  <span className="text-[--ink-muted]">
                    Min {formatTemp(minTemps[todayIndex], tempUnit)}
                  </span>
                </div>
                <div className="mt-2 text-xs text-[--ink-muted]">
                  Precipitation: {formatValue(precip[todayIndex], rainUnit)}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted]">
                Next Days
              </div>
              <div className="grid gap-2">
                {upcoming.map((day) => (
                  <div
                    key={day.time}
                    className="flex items-center justify-between rounded-[--radius-md] border border-[--border] bg-[--surface-muted] px-3 py-2"
                  >
                    <span className="text-xs text-[--ink-muted]">
                      {day.time}
                    </span>
                    <span className="text-xs text-[--ink]">
                      {formatTemp(day.max, tempUnit)} / {formatTemp(day.min, tempUnit)}
                    </span>
                    <span className="text-xs text-[--ink-muted]">
                      {formatValue(day.rain, rainUnit)} rain
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {!isPending && !isError && !data && (
          <p>No weather data available.</p>
        )}
      </div>
    </Card>
  );
};
