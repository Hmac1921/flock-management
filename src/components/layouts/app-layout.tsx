import type { ReactNode } from 'react';

import { Link } from '@tanstack/react-router';

import { useEffect, useState } from 'react';
import { PageHeader, Select, Badge, Button } from '../design-system';
import {
  getSeason,
  getSeasonOverride,
  getColorModeOverride,
  setSeasonOverride,
  setColorModeOverride,
  type SeasonMode,
  type ColorMode,
} from '../../season-theme';

type AppLayoutProps = {
  children: ReactNode;
};

const navLinkClasses =
  'flex items-center gap-3 rounded-2xl border border-[--border] px-3 py-2 text-sm font-semibold transition';

export const AppLayout = ({ children }: AppLayoutProps) => (
  <AppLayoutShell>{children}</AppLayoutShell>
);

const AppLayoutShell = ({ children }: AppLayoutProps) => {
  const [seasonMode, setSeasonMode] = useState<SeasonMode>(() =>
    getSeasonOverride()
  );
  const [colorMode, setColorMode] = useState<ColorMode>(() =>
    getColorModeOverride()
  );
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const seasonLabel =
    seasonMode === 'auto'
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
        <div className="mx-auto flex w-full flex-col gap-4 px-6 py-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <PageHeader
              title="Flock Management"
              subtitle="Season-aware records, health insights, and medicine logs."
            />
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsNavCollapsed((prev) => !prev)}
              >
                {isNavCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
              </Button>
              <Badge variant="accent">{seasonLabel} Mode</Badge>
              <Badge variant="success">Sync Ready</Badge>
              <Button variant="secondary" size="sm">
                New Sheep
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className=" flex w-full  gap-6 pt-4 min-h-screen">
        <aside
          className={` flex max-h-screen flex-col gap-6  border-r border-[--border] bg-[--surface] p-4 transition-all ${
            isNavCollapsed ? 'w-16 overflow-hidden' : 'w-64'
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-semibold uppercase tracking-[0.18em] text-[--ink-muted] ${
                isNavCollapsed ? 'sr-only' : ''
              }`}
            >
              Navigation
            </span>
            <button
              className="rounded-full border border-[--border] px-2 py-1 text-xs font-semibold uppercase tracking-[0.18em] transition"
              onClick={() => setIsNavCollapsed((prev) => !prev)}
              type="button"
            >
              {isNavCollapsed ? '>' : '<'}
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              className={navLinkClasses}
              activeProps={{
                className: `${navLinkClasses} bg-[--brand] text-[--on-brand]`,
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[--border] text-xs font-bold">
                D
              </span>
              <span className={isNavCollapsed ? 'sr-only' : ''}>
                Dashboard
              </span>
            </Link>
            <Link
              to="/flock"
              className={navLinkClasses}
              activeProps={{
                className: `${navLinkClasses} bg-[--brand] text-[--on-brand]`,
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[--border] text-xs font-bold">
                F
              </span>
              <span className={isNavCollapsed ? 'sr-only' : ''}>Flock</span>
            </Link>
            <Link
              to="/medicine"
              className={navLinkClasses}
              activeProps={{
                className: `${navLinkClasses} bg-[--brand] text-[--on-brand]`,
              }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[--border] text-xs font-bold">
                M
              </span>
              <span className={isNavCollapsed ? 'sr-only' : ''}>
                Medicine
              </span>
            </Link>
          </nav>
          {!isNavCollapsed && (
            <div className="mt-auto flex flex-col gap-4">
              <div className="flex flex-col gap-2">
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
              <div className="flex flex-col gap-2">
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
            </div>
          )}
        </aside>
        <main className="min-w-0 flex-1 mr-6 mb-6">{children}</main>
      </div>
    </div>
  );
};
