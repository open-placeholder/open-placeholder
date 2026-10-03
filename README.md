<p align="center">
  <a href="https://openplaceholder.com">
    <img src="https://openplaceholder.com/800x400/Open%20Placeholder" alt="Open Placeholder">
  </a>
  <h1 align="center">Open Placeholder</h1>
</p>

<p align="center">
  <strong>A fast, simple, and customizable placeholder image service</strong>
</p>

<p align="center">
  <a href="https://openplaceholder.com">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#usage">Usage</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#deployment">Deployment</a>
</p>

---

Open Placeholder is a high-performance placeholder image generator built with Next.js and Edge Runtime. It provides dynamic image generation with custom dimensions and text, perfect for mockups, prototypes, and development.

## ✨ Features

- 🚀 **Edge Runtime** - Lightning-fast image generation at the edge
- 📐 **Flexible Sizing** - Support for any dimensions up to 4000x4000 pixels
- 📝 **Custom Text** - Display custom text instead of dimensions
- 💾 **Smart Caching** - Optimized with CDN cache headers for performance
- 🎨 **Clean Design** - Minimalist aesthetic with Geist font
- 🔧 **Zero Configuration** - Works out of the box with sensible defaults
- 🌍 **Self-Hostable** - Deploy your own instance in seconds

## 🚀 Quick Start

### Basic Usage

Generate a 600x400 placeholder image:
```
https://openplaceholder.com/600x400
```

### Square Images

Create a 256x256 square image with a single dimension:
```
https://openplaceholder.com/256
```

### Custom Text

Display custom text instead of dimensions:
```
https://openplaceholder.com/600x300/Hello%20World
```

### Shortcut Sizes

Use common aspect-ratio shortcuts without typing dimensions:
```
https://openplaceholder.com/og/Product%20Launch
https://openplaceholder.com/banner/Hero%20Banner
https://openplaceholder.com/wide/Video%20Thumbnail
```

| Shortcut | Dimensions | Common use |
|----------|------------|------------|
| `og` | 1200x630 | Open Graph/social preview images |
| `banner` | 1200x400 | Hero and page banners |
| `wide` | 1600x900 | 16:9 thumbnails and previews |

## 📖 API Reference

### Pattern backgrounds

Use `?pattern=grid|dots|stripes|none` for a tiled background. Patterns use the foreground color at low opacity and work with themes, palettes, and layouts without replacing theme gradients. `none` is the default; unknown values also preserve the original background.

```
https://openplaceholder.com/og/Product%20Launch?theme=gradient&pattern=dots&layout=hero
```

### Layouts and text controls

Use `?size=72&weight=700` for typography controls. Weights `400`, `500`, `600`, and `700` use bundled Geist font files. Size is clamped between 1 and 512 pixels, then capped at one third of the shorter image dimension for safe rendering; layout title scales still apply. Omitted or invalid values keep automatic sizing and regular weight.

Use `?align=left|center|right` and `?valign=top|center|bottom` to align text. Plain placeholders default to center/center. Layouts retain their preset positioning unless a valid alignment override is supplied; subtitles follow the title's alignment.

Use `?subtitle=Shipping%20soon` for secondary text below the title in any layout. Subtitles are limited to 200 characters and wrap within a two-line area. Empty or omitted subtitles preserve single-text images.

Use `?padding=80` to control the outer safe area in pixels across layouts. Padding is clamped between zero and one quarter of the shorter image dimension so text still has room on tiny images. Omitted or invalid padding keeps the current spacing.

Use `?layout=hero|badge|split|poster` for banner compositions. Layouts work with dimensions and shortcuts, such as `https://openplaceholder.com/og/Product%20Launch?layout=hero&theme=gradient`. Themes, palettes, and explicit colors override layout colors. Unknown layouts retain the centered default.

### Themes, colors and palettes

Use `?theme=light|dark|mono|gradient` for a theme preset. For example, `https://openplaceholder.com/og/Product%20Launch?theme=gradient` creates a gradient social preview. With no theme, the existing output stays unchanged. Explicit colors override palettes, which override themes. A valid `bg` or palette replaces a theme's gradient with a solid background.

Use `?bg=111827&fg=ffffff` for background and text colors, or `?palette=slate|indigo|sunset` for a named palette. Colors accept three or six hex digits. Explicit `bg` and `fg` values override the palette; invalid values fall back to the palette or the existing default colors.

```
https://openplaceholder.com/600x400/Hello%20World?palette=indigo
https://openplaceholder.com/600x400/Hello%20World?bg=111827&fg=ffffff
```

### URL Format

```
https://openplaceholder.com/[width]x[height]/[text]
https://openplaceholder.com/[shortcut]/[text]
```

### Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `width` | number | Image width in pixels (1-4000) | `600` |
| `height` | number | Image height in pixels (1-4000) | `400` |
| `shortcut` | string | Optional preset size (`og`, `banner`, `wide`) | `og` |
| `text` | string | Optional custom text (URL encoded) | `Hello%20World` |
| `theme` | query string | Theme preset: `light`, `dark`, `mono`, or `gradient` | `?theme=dark` |
| `palette` | query string | Named colors: `slate`, `indigo`, or `sunset` | `?palette=indigo` |
| `bg`, `fg` | query string | Background and text colors, as three or six hex digits | `?bg=111827&fg=ffffff` |
| `layout` | query string | Banner composition: `hero`, `badge`, `split`, or `poster` | `?layout=hero` |
| `padding` | query string | Outer safe area in pixels, clamped to the image size | `?padding=80` |
| `subtitle` | query string | Secondary text, URL encoded | `?subtitle=Shipping%20soon` |
| `align`, `valign` | query string | Horizontal and vertical text alignment | `?align=left&valign=top` |
| `size`, `weight` | query string | Text size and font weight | `?size=72&weight=700` |
| `pattern` | query string | Background pattern: `grid`, `dots`, `stripes`, or `none` | `?pattern=dots` |

### Examples

#### Rectangle (600x400)
```html
<img src="https://openplaceholder.com/600x400" alt="Placeholder">
```

#### Square (512x512)
```html
<img src="https://openplaceholder.com/512" alt="Square placeholder">
```

#### Custom Text
```html
<img src="https://openplaceholder.com/800x200/Coming%20Soon" alt="Coming Soon">
```

#### Banner with Text
```html
<img src="https://openplaceholder.com/1200x400/Hero%20Banner" alt="Hero Banner">
```

#### Shortcut Size
```html
<img src="https://openplaceholder.com/og/Product%20Launch" alt="Product Launch">
```


## 🤖 Agent Skill

Use Open Placeholder automatically in generated frontend code with the companion agent skill:

```bash
npx skills add open-placeholder/skills
```

Claude Code plugin:

```txt
/plugin marketplace add open-placeholder/skills
/plugin install open-placeholder@open-placeholder
```

Codex plugin:

```bash
codex plugin marketplace add open-placeholder/skills
```

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - UI library
- **[@vercel/og](https://vercel.com/docs/functions/og-image-generation)** - Image generation
- **[Tailwind CSS](https://tailwindcss.com)** - Styling
- **[TypeScript](https://www.typescriptlang.org)** - Type safety
- **[Zod](https://zod.dev)** - Runtime validation

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fopen-placeholder%2Fopen-placeholder)

### Deploy to Diploi 

Launch Open Placeholder on Diploi in one click and get a live instance running in seconds.

[![launch with diploi button](https://diploi.com/launch-big.svg)](https://diploi.com/launch/open-placeholder/open-placeholder)

Learn more on [Diploi](https://diploi.com/).

### Self-Hosting

1. Clone the repository:
```bash
git clone https://github.com/open-placeholder/open-placeholder.git
cd open-placeholder
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

4. Build for production:
```bash
npm run build
npm run start
```

### 🐳 Docker

Pull and run the pre-built image from GitHub Container Registry:

```bash
docker run --rm -p 3000:3000 ghcr.io/open-placeholder/open-placeholder:latest
```

Or build the image yourself:

```bash
git clone https://github.com/open-placeholder/open-placeholder.git
cd open-placeholder
docker build -t open-placeholder .
docker run --rm -p 3000:3000 open-placeholder
```

The app will be available at `http://localhost:3000`.

### Environment Variables

No environment variables are required for basic functionality. The app works out of the box!

## 🏗️ Development

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Local Development

```bash
# Clone the repo
git clone https://github.com/open-placeholder/open-placeholder.git
cd open-placeholder

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Build and test image endpoints
pnpm test

# Run linter
pnpm lint
```

### Project Structure

```
open-placeholder/
├── app/
│   ├── [...filename]/     # Catch-all route for image generation
│   │   └── route.tsx      # Image generation endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── utils/
│   ├── parser.ts          # URL parameter parsing
│   └── data.ts            # GitHub data fetching
├── fonts/
│   └── geist/             # Local font files for image generation
└── public/                # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by [placehold.co](https://placehold.co/)
- Built with [Vercel's Edge Runtime](https://vercel.com/docs/functions/edge-functions)
- Typography by [Geist Font](https://vercel.com/font)

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/open-placeholder/open-placeholder?style=social)
![GitHub forks](https://img.shields.io/github/forks/open-placeholder/open-placeholder?style=social)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/akshitkrnagpal">Akshit Kr Nagpal</a>
</p>
