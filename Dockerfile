# 1. Base image: PHP 8.1 FPM + Node.js
FROM ghcr.io/shivammathur/php:8.1-fpm-node

# 2. Set working directory
WORKDIR /app

# 3. Copy dan install Composer dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# 4. Copy dan install NPM dependencies
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

# 5. Build assets Vite
RUN npm run build

# 6. Copy semua source code
COPY . .

# 7. (Optional) Run database migrations
# RUN php artisan migrate --force

# 8. Expose port dan jalankan built‐in server
EXPOSE 8080
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8080"]
