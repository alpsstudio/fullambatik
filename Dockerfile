# ————————————— Stage 1: Build Frontend —————————————
FROM node:18-alpine AS node_builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy hanya file yang dibutuhkan untuk build
COPY vite.config.js resources/css resources/js ./
RUN npm run build

# ————————————— Stage 2: Build PHP App —————————————
FROM php:8.1-fpm-alpine

# Install build tools & ekstensi PHP via apk (lebih ringan)
RUN apk add --no-cache \
    libpng libpng-dev \
    freetype freetype-dev \
    libjpeg-turbo libjpeg-turbo-dev \
    oniguruma oniguruma-dev \
    libzip libzip-dev \
    zip unzip \
  && docker-php-ext-configure gd \
       --with-freetype=/usr/include/ \
       --with-jpeg=/usr/include/ \
  && docker-php-ext-install pdo_mysql zip gd mbstring \
  && rm -rf /var/cache/apk/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Copy app source
COPY . .

# Copy hasil build Vite
COPY --from=node_builder /app/public/build public/build

# Atur permission
RUN chown -R www-data:www-data storage bootstrap/cache \
  && chmod -R 775 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
