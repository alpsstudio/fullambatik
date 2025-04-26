# 1. Base image: PHP 8.1 FPM + Node.js
FROM ghcr.io/shivammathur/php:8.1-fpm-node

# 2. Set working directory
WORKDIR /app

# Copy hanya package.json + package-lock.json dulu
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production --legacy-peer-deps

# Sekarang copy seluruh kode
COPY . .

# Build assets Vite
RUN npm run build


# 7. (Optional) Run database migrations
# RUN php artisan migrate --force

# 8. Expose port dan jalankan built‐in server
EXPOSE 8080
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
