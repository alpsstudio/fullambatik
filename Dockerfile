# --- Stage 1: Build assets with Node.js ---
FROM node:18-alpine AS node_builder
WORKDIR /app

# Copy and install only JS dependencies
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy Vite config + source for build
COPY vite.config.js resources/css resources/js ./

# Build frontend assets
RUN npm run build

# --- Stage 2: Prepare PHP application ---
FROM php:8.1-fpm

# Install PHP extensions & tools
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libzip-dev \
    libonig-dev \
    zip \
    unzip \
 && docker-php-ext-configure gd --with-jpeg --with-freetype \
 && docker-php-ext-install pdo_mysql zip gd mbstring \
 && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install PHP dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Copy application code
COPY . .

# Bring in built assets
COPY --from=node_builder /app/public/build public/build

# Set correct permissions
RUN chown -R www-data:www-data storage bootstrap/cache \
 && chmod -R 775 storage bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
