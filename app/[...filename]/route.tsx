import { getPlaceholdOptions } from '@/utils/parser';
import { renderPlaceholder } from '@/utils/render';
import { getFontWeight, type PlaceholderFontWeight } from '@/utils/styles';
import { ImageResponse } from 'next/og';

type Params = Promise<{
  filename: string[];
}>;

export const runtime = 'edge';

// Cache the font data to avoid repeated fetches
const fontCache = new Map<PlaceholderFontWeight, ArrayBuffer>();
const fontUrls = {
  400: new URL('../../fonts/geist/Geist-Regular.otf', import.meta.url),
  500: new URL('../../fonts/geist/Geist-Medium.ttf', import.meta.url),
  600: new URL('../../fonts/geist/Geist-SemiBold.ttf', import.meta.url),
  700: new URL('../../fonts/geist/Geist-Bold.ttf', import.meta.url),
};

async function getFontData(
  weight: PlaceholderFontWeight,
): Promise<ArrayBuffer> {
  const cached = fontCache.get(weight);
  if (cached) return cached;
  const data = await fetch(fontUrls[weight]).then((res) => res.arrayBuffer());
  fontCache.set(weight, data);
  return data;
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
  const fontWeight = getFontWeight(query);
  const fontData = await getFontData(fontWeight);

  return new ImageResponse(renderPlaceholder(options, query), {
    width: options.width,
    height: options.height,
    fonts: [
      {
        name: 'Geist',
        data: fontData,
        style: 'normal',
        weight: fontWeight,
      },
    ],
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'CDN-Cache-Control': 'public, max-age=31536000',
    },
  });
}
