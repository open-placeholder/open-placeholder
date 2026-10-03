import { getPlaceholdOptions } from '@/utils/parser';
import { getPlaceholderColors } from '@/utils/styles';
import { ImageResponse } from 'next/og';

type Params = Promise<{
  filename: string[];
}>;

export const runtime = 'edge';

// Cache the font data to avoid repeated fetches
let fontCache: ArrayBuffer | null = null;

async function getFontData(): Promise<ArrayBuffer> {
  if (!fontCache) {
    fontCache = await fetch(
      new URL('../../fonts/geist/Geist-Regular.otf', import.meta.url)
    ).then((res) => res.arrayBuffer());
  }
  return fontCache as ArrayBuffer;
}

export async function GET(_request: Request, { params }: { params: Params }) {
  const { filename } = await params;
  // Join the array segments back into a single string
  const fullPath = filename.join('/');
  const options = getPlaceholdOptions(fullPath);
  
  // Return 404 if the URL is invalid
  if (!options) {
    return new Response('Not Found', { status: 404 });
  }
  
  // Calculate font size based on text length and image dimensions
  const displayText = options.text || `${options.width} x ${options.height}`;
  const baseFontSize = Math.min(options.width, options.height) / 5;
  
  // Adjust font size for longer text
  const textLength = displayText.length;
  const fontSizeMultiplier = textLength > 20 ? 0.6 : textLength > 10 ? 0.8 : 1;
  const fontSize = baseFontSize * fontSizeMultiplier;
  // Keep room for text even when the image is smaller than the usual padding.
  // Satori's word wrapping can loop if a single glyph exceeds the content width.
  const padding = Math.min(20, Math.min(options.width, options.height) / 4);
  const { backgroundColor, foregroundColor } = getPlaceholderColors(
    new URL(_request.url).searchParams
  );
  
  // Use cached font data
  const fontData = await getFontData();
  
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor,
          color: foregroundColor,
          padding,
        }}
      >
        <h1 
          style={{ 
            fontSize, 
            fontFamily: 'Geist',
            textAlign: 'center',
            wordBreak: 'break-word',
            margin: 0,
          }}
        >
          {displayText}
        </h1>
      </div>
    ),
    {
      width: options.width,
      height: options.height,
      fonts: [
        {
          name: 'Geist',
          data: fontData,
          style: 'normal',
          weight: 400,
        },
      ],
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
        'CDN-Cache-Control': 'public, max-age=31536000',
      },
    }
  );
}
