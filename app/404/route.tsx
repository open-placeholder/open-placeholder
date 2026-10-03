import { GET as handlePlaceholder } from '../[...filename]/route';

export const runtime = 'edge';

export function GET(request: Request) {
  return handlePlaceholder(request, {
    params: Promise.resolve({ filename: ['404'] }),
  });
}
