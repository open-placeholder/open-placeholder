type PlaceholderPattern = 'grid' | 'dots' | 'stripes' | 'none';

export function getPattern(query: URLSearchParams): PlaceholderPattern {
  return (
    (['grid', 'dots', 'stripes'] as const).find(
      (pattern) => pattern === query.get('pattern'),
    ) ?? 'none'
  );
}

export function renderPattern(
  pattern: PlaceholderPattern,
  width: number,
  height: number,
  color: string,
) {
  if (pattern === 'none') return null;
  const tile = pattern === 'stripes' ? 32 : 40;
  return (
    <svg
      key='pattern'
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <defs>
        <pattern
          id='background-pattern'
          width={tile}
          height={tile}
          patternUnits='userSpaceOnUse'
          {...(pattern === 'stripes' ? { patternTransform: 'rotate(45)' } : {})}
        >
          <g opacity='0.12'>
            {pattern === 'grid' ? (
              <path
                d='M40 0 H0 V40'
                fill='none'
                stroke={color}
                strokeWidth='1'
              />
            ) : pattern === 'dots' ? (
              <circle cx='20' cy='20' r='1.5' fill={color} />
            ) : (
              <rect width='8' height='32' fill={color} />
            )}
          </g>
        </pattern>
      </defs>
      <rect width={width} height={height} fill='url(#background-pattern)' />
    </svg>
  );
}
