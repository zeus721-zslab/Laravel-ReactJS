# PHP 8.4 기반 이미지 사용
FROM php:8.4-fpm

# 시스템 패키지 업데이트 및 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    && rm -rf /var/lib/apt/lists/*  # 설치 후 캐시 정리

# PHP 드라이버 설치 (pdo_mysql)
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && apt-get install -y libxml2-dev \
    && docker-php-ext-install pdo_mysql

# Install phpredis extension
RUN apt-get update && apt-get install -y libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
    && pecl install redis \
    && docker-php-ext-enable redis

# Composer 설치 (https://getcomposer.org/installer에서 설치)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Update and install nano
RUN apt-get update && apt-get install -y nano
# Update and install vim
RUN apt-get update && apt-get install -y vim

# 시스템 패키지 업데이트 및 nodejs 설치
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    && apt-get clean

#RUN pecl install redis \
#    && docker-php-ext-enable redis
#RUN docker-php-ext-enable redis \
#    && pecl install redis
RUN curl -L https://pecl.php.net/get/redis-6.1.0.tgz -o redis-6.1.0.tgz \
    && pecl install redis-6.1.0.tgz \
    && rm -rf redis-6.1.0.tgz \
    && docker-php-ext-enable redis


COPY ./php/php.ini /usr/local/etc/php/conf.d/local-php.ini

# 작업 디렉토리 설정
WORKDIR /var/www/html

# 로컬의 package.json 파일을 컨테이너로 복사
#COPY ./html/frontend/package.json /var/www/html/frontend/package.json

# npm 패키지 설치
#RUN npm install

# 사용자 추가
RUN groupadd -g 1000 zslab_duckdns && useradd -u 1000 -g zslab_duckdns -m zslab_duckdns

# 사용자로 실행
USER zslab_duckdns
