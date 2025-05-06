# --------------- STAGE 1: Build Next.js App ---------------
FROM node:18-alpine AS builder
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy entire source and build the app
COPY . .
RUN echo "Building with NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"
RUN npm run build

# Remove dev dependencies to keep only production deps
RUN npm prune --production

# --------------- STAGE 2: Setup Production Image with NGINX ---------------
FROM node:18-alpine
WORKDIR /app

# Install NGINX via apk
RUN apk add --no-cache nginx

# Overwrite the primary NGINX configuration file (/etc/nginx/nginx.conf)
# Menggunakan HEREDOC agar file terformat dengan benar tanpa karakter ekstra.
RUN cat <<'EOF' > /etc/nginx/nginx.conf
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';
    access_log  /var/log/nginx/access.log  main;
    sendfile        on;
    keepalive_timeout  65;
    include /etc/nginx/conf.d/*.conf;
}
EOF

# Copy production dependencies and built assets from the builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Optionally copy next.config.js/next.config.ts if your app uses one
COPY --from=builder /app/next.config.ts ./

# Ensure the directory for additional NGINX config exists
RUN mkdir -p /etc/nginx/conf.d

# Create NGINX configuration to proxy port 80 to the Next.js server on port 3000
RUN cat <<'EOF' > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    listen [::]:80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF

# Expose port 80 (for NGINX reverse proxy)
EXPOSE 80
RUN apk add --no-cache netcat-openbsd
# Debug: Print NEXT_PUBLIC_API_URL at runtime
RUN echo "Runtime NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"
# Start the app and NGINX:
# Next.js akan berjalan pada port 3000 (dijalankan via npm run start)
# dan NGINX akan meneruskan request ke port tersebut.
CMD ["sh", "-c", "npm run start & while ! nc -z localhost 3000; do echo 'Waiting for Next.js to be ready...'; sleep 1; done; exec nginx -g 'daemon off;'"]
