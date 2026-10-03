import { getPlaceholdOptions } from '@/utils/parser';
import { renderPlaceholder } from '@/utils/render';
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

export async function GET(request: Request, { params }: { params: Params }) {
  const { filename } = await params;
  // Join the array segments back into a single string
  const fullPath = filename.join('/');
  const query = new URL(request.url).searchParams;
  const options = getPlaceholdOptions(fullPath, query);
  
  // Return 404 if the URL is invalid
  if (!options) {
    return new Response('Not Found', { status: 404 });
  }
  
  // Use cached font data
  const fontData = await getFontData();
  
  return new ImageResponse(
    renderPlaceholder(options, query),
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
