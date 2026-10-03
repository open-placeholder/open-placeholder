import type { CSSProperties, ReactNode } from 'react';
import type { PlaceholderOptions } from './parser';
import { getFontWeight, getPlaceholderStyle } from './styles';
import { getPattern, renderPattern } from './patterns';

const horizontalAlignment = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
} as const;
const verticalAlignment = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
} as const;

export function renderPlaceholder(
  options: PlaceholderOptions,
  query: URLSearchParams,
) {
  const { width, height, layout } = options;
  const pattern = getPattern(query);
  const align = (['left', 'center', 'right'] as const).find(
    (value) => value === query.get('align'),
  );
  const valign = (['top', 'center', 'bottom'] as const).find(
    (value) => value === query.get('valign'),
  );
  const dimensionsText = `${width} x ${height}`;
  const displayText = options.text || dimensionsText;
  const scale = Math.min(width, height);
  const defaultFontSize =
    (scale / 5) *
    (displayText.length > 20 ? 0.6 : displayText.length > 10 ? 0.8 : 1);
  const sizeParam = query.get('size');
  const requestedSize = sizeParam?.trim() ? Number(sizeParam) : NaN;
  const fontSize =
    Number.isFinite(requestedSize) && requestedSize > 0
      ? Math.min(512, scale / 3, Math.max(1, requestedSize))
      : defaultFontSize;
  const fontWeight = getFontWeight(query);
  const { backgroundColor, foregroundColor, backgroundImage } =
    getPlaceholderStyle(query, layout);
  const spacing = { hero: 56, badge: 32, split: 48, poster: 44 };
  const paddingParam = query.get('padding');
  const requestedPadding = paddingParam?.trim() ? Number(paddingParam) : NaN;
  const padding = Math.min(
    Math.max(
      0,
      Number.isFinite(requestedPadding)
        ? requestedPadding
        : layout
          ? spacing[layout]
          : 20,
    ),
    scale / 4,
  );
  const textAlign =
    align ?? (layout === 'hero' || layout === 'split' ? 'left' : 'center');
  const textStyles: CSSProperties = {
    fontSize:
      fontSize *
      (layout === 'badge'
        ? 0.74
        : layout === 'split'
          ? 0.82
          : layout === 'poster'
            ? 0.9
            : 1),
    fontFamily: 'Geist',
    fontWeight,
    textAlign,
    wordBreak: 'break-word',
    margin: 0,
    maxWidth: '100%',
  };
  const title = (
    <h1 key='title' style={textStyles}>
      {displayText}
    </h1>
  );
  const subtitle = Array.from(query.get('subtitle')?.trim() ?? '')
    .slice(0, 200)
    .join('');
  const textBlock = subtitle ? (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: Math.min(12, scale / 25),
        alignItems: horizontalAlignment[textAlign],
      }}
    >
      {title}
      <div
        style={{
          display: 'flex',
          fontFamily: 'Geist',
          fontSize: fontSize * 0.36,
          lineHeight: 1.3,
          textAlign: textStyles.textAlign,
          wordBreak: 'break-word',
          maxWidth: '100%',
          maxHeight: fontSize * 0.36 * 1.3 * 2,
          overflow: 'hidden',
        }}
      >
        {subtitle}
      </div>
    </div>
  ) : (
    title
  );
  const label = (
    <div
      key='dimensions'
      style={{
        display: 'flex',
        fontSize: fontSize * 0.22,
        opacity: 0.72,
        ...(align ? { justifyContent: horizontalAlignment[align] } : {}),
      }}
    >
      {dimensionsText}
    </div>
  );
  const rootStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor,
    color: foregroundColor,
    fontWeight,
    padding,
    ...(backgroundImage ? { backgroundImage } : {}),
    ...(layout || pattern !== 'none'
      ? { position: 'relative', overflow: 'hidden' }
      : {}),
  };
  let content: ReactNode = textBlock;

  switch (layout) {
    case 'hero':
      rootStyle.justifyContent = 'flex-start';
      content = [
        <div
          key='decoration'
          style={{
            position: 'absolute',
            right: '-12%',
            top: '-25%',
            width: '50%',
            height: '150%',
            backgroundColor: foregroundColor,
            opacity: 0.15,
            transform: 'rotate(12deg)',
          }}
        />,
        <div
          key='text'
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: Math.min(20, scale / 20),
            width: '70%',
            position: 'relative',
          }}
        >
          {label}
          {textBlock}
        </div>,
      ];
      break;
    case 'badge':
      content = (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: align ? horizontalAlignment[align] : 'center',
            gap: Math.min(18, scale / 20),
            maxWidth: '100%',
            padding: Math.min(28, scale / 16),
            border: `${Math.min(6, scale / 50)}px solid ${foregroundColor}`,
            borderRadius: '9999px',
          }}
        >
          {textBlock}
          {label}
        </div>
      );
      break;
    case 'split':
      content = [
        <div
          key='text'
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: valign ? verticalAlignment[valign] : 'center',
            ...(align ? { alignItems: horizontalAlignment[align] } : {}),
            width: '58%',
            height: '100%',
            backgroundColor: foregroundColor,
            color: backgroundColor,
          }}
        >
          {textBlock}
        </div>,
        <div
          key='dimensions'
          style={{
            display: 'flex',
            alignItems: valign ? verticalAlignment[valign] : 'center',
            justifyContent: align ? horizontalAlignment[align] : 'center',
            width: '42%',
            height: '100%',
          }}
        >
          {label}
        </div>,
      ];
      break;
    case 'poster':
      rootStyle.flexDirection = 'column';
      rootStyle.justifyContent = 'space-between';
      content = [
        <div
          key='bar'
          style={{
            display: 'flex',
            width: '100%',
            height: Math.min(12, scale / 30),
            backgroundColor: foregroundColor,
          }}
        />,
        textBlock,
        label,
      ];
      break;
  }

  if (rootStyle.flexDirection === 'column') {
    if (align) rootStyle.alignItems = horizontalAlignment[align];
    if (valign) rootStyle.justifyContent = verticalAlignment[valign];
  } else {
    if (align) rootStyle.justifyContent = horizontalAlignment[align];
    if (valign) rootStyle.alignItems = verticalAlignment[valign];
  }
  if (pattern !== 'none') {
    content = [
      renderPattern(pattern, width, height, foregroundColor),
      ...(Array.isArray(content) ? content : [content]),
    ];
  }
  return <div style={rootStyle}>{content}</div>;
}
