# 1. Gunakan base image PHP resmi
FROM php:8.1-fpm

# 2. Install utilitas dan ekstensi PHP yang diperlukan Larave l
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    && docker-php-ext-install pdo_mysql zip mbstring gd \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 3. Install Node.js (versi 18.x) dari NodeSource
RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 4. Set working directory
WORKDIR /var/www/html

# 5. Copy dan install Composer dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# 6. Copy dan install NPM dependencies lalu build asset Vite
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps \
    && npm run build

# 7. Copy seluruh source code aplikasi
COPY . .

# 8. Set permission storage & cache
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# 9. Expose port PHP-FPM
EXPOSE 9000

# 10. Jalankan PHP-FPM
CMD ["php-fpm"]
