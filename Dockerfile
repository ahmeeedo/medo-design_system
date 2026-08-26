FROM node:20-slim AS build
WORKDIR /app

# --ignore-scripts keeps the "prepare" hook (build:lib) from running here:
# it needs sources that this layer deliberately does not copy yet.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# 127.0.0.1, not localhost: that resolves to ::1 in the container while
# nginx binds IPv4 only, which fails the check and the deploy with it.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD wget -q --spider http://127.0.0.1/ || exit 1
