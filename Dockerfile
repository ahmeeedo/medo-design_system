# Builds the Storybook (design system documentation) and serves it with nginx.
# Deploy: Coolify → Build pack "Dockerfile", domain storybook.med-o.de, port 80.
FROM node:24-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/tokens/package.json packages/tokens/
COPY packages/ui/package.json packages/ui/
COPY apps/storybook/package.json apps/storybook/
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build-storybook

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/storybook/storybook-static /usr/share/nginx/html
EXPOSE 80

# 127.0.0.1, not localhost: localhost resolves to ::1 while nginx listens on IPv4.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
