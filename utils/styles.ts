import type { PlaceholderLayout } from './parser';

interface PlaceholderColors {
  backgroundColor: string;
  foregroundColor: string;
}

interface PlaceholderStyle extends PlaceholderColors {
  backgroundImage?: string;
}

const defaultColors: PlaceholderColors = {
  backgroundColor: '#EEE',
  foregroundColor: '#31343C',
};

const layoutColors: Record<PlaceholderLayout, PlaceholderColors> = {
  hero: { backgroundColor: '#111827', foregroundColor: '#FFFFFF' },
  badge: { backgroundColor: '#F8FAFC', foregroundColor: '#111827' },
  split: { backgroundColor: '#E5E7EB', foregroundColor: '#31343C' },
  poster: { backgroundColor: '#F3F4F6', foregroundColor: '#111827' },
};

const palettes = new Map<string, PlaceholderColors>([
  ['slate', { backgroundColor: '#111827', foregroundColor: '#F8FAFC' }],
  ['indigo', { backgroundColor: '#4338CA', foregroundColor: '#EEF2FF' }],
  ['sunset', { backgroundColor: '#FDBA74', foregroundColor: '#7C2D12' }],
]);

const themes = new Map<string, PlaceholderStyle>([
  ['light', { backgroundColor: '#F8FAFC', foregroundColor: '#111827' }],
  ['dark', { backgroundColor: '#111827', foregroundColor: '#FFFFFF' }],
  ['mono', { backgroundColor: '#FFFFFF', foregroundColor: '#000000' }],
  [
    'gradient',
    {
      backgroundColor: '#4338CA',
      foregroundColor: '#FFFFFF',
      backgroundImage: 'linear-gradient(135deg, #4338CA, #BE185D)',
    },
  ],
]);

function parseColor(value: string | null): string | undefined {
  if (!value || !/^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value))
    return undefined;
  return `#${value.replace(/^#/, '')}`;
}

export function getPlaceholderStyle(
  params: URLSearchParams,
  layout?: PlaceholderLayout,
): PlaceholderStyle {
  const theme: PlaceholderStyle =
    themes.get(params.get('theme') ?? '') ??
    (layout ? layoutColors[layout] : defaultColors);
  const palette = palettes.get(params.get('palette') ?? '');
  const backgroundColor = parseColor(params.get('bg'));
  return {
    backgroundColor:
      backgroundColor ?? palette?.backgroundColor ?? theme.backgroundColor,
    foregroundColor:
      parseColor(params.get('fg')) ??
      palette?.foregroundColor ??
      theme.foregroundColor,
    backgroundImage:
      backgroundColor || palette ? undefined : theme.backgroundImage,
  };
}
