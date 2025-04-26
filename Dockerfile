# ————————————————————————————————
# Stage 1: Build frontend (Node)
# ————————————————————————————————
FROM node:18-alpine AS node_builder

WORKDIR /app

# Copy hanya file yang dibutuhkan untuk install dependencies
COPY package.json package-lock.json ./

# Install dependencies dan build asset Vite
RUN npm ci --legacy-peer-deps
COPY vite.config.js resources resources/css resources/js ./
RUN npm run build

# ————————————————————————————————
# Stage 2: Setup aplikasi Laravel (PHP)
# ————————————————————————————————
FROM php:8.1-fpm

# Install ekstensi PHP yang dibutuhkan Laravel
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    zip \
    unzip \
  && docker-php-ext-configure gd --with-jpeg --with-freetype \
  && docker-php-ext-install pdo_mysql zip gd mbstring \
  && rm -rf /var/lib/apt/lists/*

# Copy Composer dari image resmi
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install dependencies PHP
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Copy seluruh source Laravel
COPY . .

# Copy hasil build Vite dari stage 1
COPY --from=node_builder /app/public/build public/build

# Set permission storage & cache
RUN chown -R www-data:www-data storage bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

EXPOSE 9000

# Jalankan PHP-FPM
CMD ["php-fpm"]
