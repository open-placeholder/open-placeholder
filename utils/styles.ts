interface PlaceholderColors {
  backgroundColor: string;
  foregroundColor: string;
}

const defaultColors: PlaceholderColors = {
  backgroundColor: '#EEE',
  foregroundColor: '#31343C',
};

const palettes = new Map<string, PlaceholderColors>([
  ['slate', { backgroundColor: '#111827', foregroundColor: '#F8FAFC' }],
  ['indigo', { backgroundColor: '#4338CA', foregroundColor: '#EEF2FF' }],
  ['sunset', { backgroundColor: '#FDBA74', foregroundColor: '#7C2D12' }],
]);

function parseColor(value: string | null): string | undefined {
  if (!value || !/^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value)) return undefined;
  return `#${value.replace(/^#/, '')}`;
}

export function getPlaceholderColors(params: URLSearchParams): PlaceholderColors {
  const palette = palettes.get(params.get('palette') ?? '') ?? defaultColors;
  return {
    backgroundColor: parseColor(params.get('bg')) ?? palette.backgroundColor,
    foregroundColor: parseColor(params.get('fg')) ?? palette.foregroundColor,
  };
}
