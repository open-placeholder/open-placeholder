FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY . .

ENV NEXT_OUTPUT_STANDALONE=true
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun --bun next build

FROM oven/bun:1-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Override the OCI labels inherited from the oven/bun base image.
# In CI, docker/metadata-action sets version, revision and created.
ARG VERSION=dev
ARG REVISION=""
ARG CREATED=""

LABEL org.opencontainers.image.title="Open Placeholder" \
      org.opencontainers.image.description="Simple, self-hostable placeholder image generator for web pages, prototypes, docs, and social previews" \
      org.opencontainers.image.url="https://openplaceholder.com" \
      org.opencontainers.image.source="https://github.com/open-placeholder/open-placeholder" \
      org.opencontainers.image.documentation="https://github.com/open-placeholder/open-placeholder#readme" \
      org.opencontainers.image.licenses="MIT" \
      org.opencontainers.image.version="${VERSION}" \
      org.opencontainers.image.revision="${REVISION}" \
      org.opencontainers.image.created="${CREATED}"

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"]
