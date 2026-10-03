import { z } from 'zod';

const layoutSchema = z.enum(['hero', 'badge', 'split', 'poster']);
export type PlaceholderLayout = z.infer<typeof layoutSchema>;

const optionsSchema = z.object({
  width: z.coerce.number().positive().min(1).max(4000),
  height: z.coerce.number().positive().min(1).max(4000),
});

export interface PlaceholderOptions {
  width: number;
  height: number;
  text?: string;
  layout?: PlaceholderLayout;
}

const shortcuts: Record<
  string,
  Pick<PlaceholderOptions, 'width' | 'height'>
> = {
  og: { width: 1200, height: 630 },
  banner: { width: 1200, height: 400 },
  wide: { width: 1600, height: 900 },
};

export const getPlaceholdOptions = (
  filename: string,
  query?: URLSearchParams,
): PlaceholderOptions | null => {
  try {
    // Check if there's custom text after a slash
    const parts = filename.split('/');
    const dimensions = parts[0];
    const parsedLayout = layoutSchema.safeParse(query?.get('layout'));
    const layout = parsedLayout.success ? parsedLayout.data : undefined;
    let customText: string | undefined;

    if (parts.length > 1) {
      // Decode the custom text from URL encoding
      customText = decodeURIComponent(parts.slice(1).join('/'));
    }

    // Parse shortcuts or dimensions (support both 600x400 and 600 formats)
    const shortcut = shortcuts[dimensions];

    if (shortcut) {
      return {
        ...shortcut,
        text: customText,
        layout,
      };
    }

    const [width, height] = dimensions.split('x');

    // Return null if width is not a valid number
    if (!width || isNaN(Number(width))) {
      return null;
    }

    const parsedOptions = optionsSchema.parse({
      width,
      height: height ?? width,
    });

    return {
      ...parsedOptions,
      text: customText,
      layout,
    };
  } catch (error) {
    // Return null for any parsing errors
    return null;
  }
};
