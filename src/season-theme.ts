export type Season = 'winter' | 'spring' | 'summer' | 'autumn';
export type SeasonMode = Season | 'auto';
export type ColorMode = 'light' | 'dark' | 'auto';

const SEASON_KEY = 'flock-season-mode';
const COLOR_KEY = 'flock-color-mode';

export const getSeason = (date = new Date()): Season => {
  const month = date.getMonth();
  if (month === 11 || month <= 1) return 'winter';
  if (month <= 4) return 'spring';
  if (month <= 7) return 'summer';
  return 'autumn';
};

export const getSeasonOverride = (): SeasonMode => {
  const stored = localStorage.getItem(SEASON_KEY) as SeasonMode | null;
  return stored ?? 'auto';
};

export const getColorModeOverride = (): ColorMode => {
  const stored = localStorage.getItem(COLOR_KEY) as ColorMode | null;
  return stored ?? 'auto';
};

export const applyTheme = (
  seasonMode: SeasonMode = 'auto',
  colorMode: ColorMode = 'auto'
) => {
  document.documentElement.dataset.season =
    seasonMode === 'auto' ? getSeason() : seasonMode;
  document.documentElement.dataset.seasonMode = seasonMode;
  document.documentElement.dataset.colorMode = colorMode;
};

export const setSeasonOverride = (mode: SeasonMode) => {
  localStorage.setItem(SEASON_KEY, mode);
  applyTheme(mode, getColorModeOverride());
};

export const setColorModeOverride = (mode: ColorMode) => {
  localStorage.setItem(COLOR_KEY, mode);
  applyTheme(getSeasonOverride(), mode);
};

const scheduleSeasonRefresh = () => {
  const now = new Date();
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    1,
    0,
    0
  );
  const delay = nextMidnight.getTime() - now.getTime();
  window.setTimeout(() => {
    if (getSeasonOverride() === 'auto') {
      applyTheme('auto', getColorModeOverride());
    }
    scheduleSeasonRefresh();
  }, delay);
};

export const initSeasonTheme = () => {
  const seasonMode = getSeasonOverride();
  const colorMode = getColorModeOverride();
  applyTheme(seasonMode, colorMode);
  scheduleSeasonRefresh();
};
