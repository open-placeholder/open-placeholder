import type { CSSProperties, ReactNode } from 'react';
import type { PlaceholderOptions } from './parser';
import { getPlaceholderStyle } from './styles';

export function renderPlaceholder(
  options: PlaceholderOptions,
  query: URLSearchParams,
) {
  const { width, height, layout } = options;
  const dimensionsText = `${width} x ${height}`;
  const displayText = options.text || dimensionsText;
  const scale = Math.min(width, height);
  const fontSize =
    (scale / 5) *
    (displayText.length > 20 ? 0.6 : displayText.length > 10 ? 0.8 : 1);
  const { backgroundColor, foregroundColor, backgroundImage } =
    getPlaceholderStyle(query, layout);
  const spacing = { hero: 56, badge: 32, split: 48, poster: 44 };
  const padding = Math.min(layout ? spacing[layout] : 20, scale / 4);
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
    textAlign: layout === 'hero' || layout === 'split' ? 'left' : 'center',
    wordBreak: 'break-word',
    margin: 0,
    maxWidth: '100%',
  };
  const title = (
    <h1 key='title' style={textStyles}>
      {displayText}
    </h1>
  );
  const label = (
    <div
      key='dimensions'
      style={{ display: 'flex', fontSize: fontSize * 0.22, opacity: 0.72 }}
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
    padding,
    ...(backgroundImage ? { backgroundImage } : {}),
    ...(layout ? { position: 'relative', overflow: 'hidden' } : {}),
  };
  let content: ReactNode = title;

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
          {title}
        </div>,
      ];
      break;
    case 'badge':
      content = (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: Math.min(18, scale / 20),
            maxWidth: '100%',
            padding: Math.min(28, scale / 16),
            border: `${Math.min(6, scale / 50)}px solid ${foregroundColor}`,
            borderRadius: '9999px',
          }}
        >
          {title}
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
            justifyContent: 'center',
            width: '58%',
            height: '100%',
            backgroundColor: foregroundColor,
            color: backgroundColor,
          }}
        >
          {title}
        </div>,
        <div
          key='dimensions'
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
        title,
        label,
      ];
      break;
  }

  return <div style={rootStyle}>{content}</div>;
}
