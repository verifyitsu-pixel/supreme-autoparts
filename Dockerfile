FROM wordpress:cli-php8.3 AS wpcli

FROM wordpress:php8.3-apache

RUN apt-get update \
    && apt-get install -y --no-install-recommends default-mysql-client unzip \
    && rm -rf /var/lib/apt/lists/* \
    && a2enmod rewrite headers expires

COPY --from=wpcli /usr/local/bin/wp /usr/local/bin/wp
COPY wordpress/supreme-autoparts-theme /usr/src/wordpress/wp-content/themes/supreme-autoparts-theme
COPY wordpress/supreme-commerce-controls /usr/src/wordpress/wp-content/plugins/supreme-commerce-controls
COPY index.html /usr/src/wordpress/wp-content/themes/supreme-autoparts-theme/front-page-static.html
COPY public/assets/exact /usr/src/wordpress/assets/exact
COPY wordpress-entrypoint.sh /usr/local/bin/supreme-entrypoint
COPY health.php /usr/src/wordpress/health/index.php

RUN chmod +x /usr/local/bin/supreme-entrypoint \
    && chown -R www-data:www-data /usr/src/wordpress/wp-content/themes/supreme-autoparts-theme /usr/src/wordpress/wp-content/plugins/supreme-commerce-controls /usr/src/wordpress/health

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["supreme-entrypoint"]
CMD ["apache2-foreground"]
