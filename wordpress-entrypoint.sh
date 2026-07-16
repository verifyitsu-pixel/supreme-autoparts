#!/usr/bin/env bash
set -euo pipefail

: "${WORDPRESS_DB_HOST:?WORDPRESS_DB_HOST is required}"
: "${WORDPRESS_DB_USER:?WORDPRESS_DB_USER is required}"
: "${WORDPRESS_DB_PASSWORD:?WORDPRESS_DB_PASSWORD is required}"
: "${WORDPRESS_DB_NAME:=supreme_autoparts}"
: "${WP_HOME:=https://www.supremeautoparts.co.ke}"
: "${WP_SITE_TITLE:=Supreme Autoparts}"
: "${WP_ADMIN_USER:=supreme}"
: "${WP_ADMIN_EMAIL:=admin@supremeautoparts.co.ke}"
: "${WP_ADMIN_PASSWORD:?WP_ADMIN_PASSWORD must be stored as a Railway secret}"

sed -ri "s!Listen [0-9]+!Listen ${PORT:-8080}!" /etc/apache2/ports.conf
sed -ri "s!<VirtualHost \*:[0-9]+>!<VirtualHost *:${PORT:-8080}>!" /etc/apache2/sites-available/000-default.conf
a2dismod mpm_event mpm_worker >/dev/null 2>&1 || true
a2enmod mpm_prefork >/dev/null 2>&1 || true
mkdir -p /var/www/html/wp-content/uploads/wc-logs /var/www/html/wp-content/uploads/woocommerce_uploads
chown -R www-data:www-data /var/www/html/wp-content/uploads

db_host="${WORDPRESS_DB_HOST%%:*}"
db_port="${WORDPRESS_DB_HOST##*:}"
if [[ "$db_port" == "$db_host" ]]; then db_port=3306; fi

until DB_HOST="$db_host" DB_PORT="$db_port" php -r '
  mysqli_report(MYSQLI_REPORT_OFF);
  $db = @new mysqli(getenv("DB_HOST"), getenv("WORDPRESS_DB_USER"), getenv("WORDPRESS_DB_PASSWORD"), null, (int)getenv("DB_PORT"));
  if ($db->connect_errno) { fwrite(STDERR, "MySQL not ready: " . $db->connect_error . PHP_EOL); exit(1); }
'; do
  echo "Waiting for MySQL..."
  sleep 3
done

DB_HOST="$db_host" DB_PORT="$db_port" php -r '
  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
  $db = new mysqli(getenv("DB_HOST"), getenv("WORDPRESS_DB_USER"), getenv("WORDPRESS_DB_PASSWORD"), null, (int)getenv("DB_PORT"));
  $name = str_replace("`", "``", getenv("WORDPRESS_DB_NAME"));
  $db->query("CREATE DATABASE IF NOT EXISTS `{$name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
';

docker-entrypoint.sh "$@" &
apache_pid=$!

until [[ -f /var/www/html/wp-config.php ]] && wp db query 'SELECT 1' --allow-root --path=/var/www/html >/dev/null 2>&1; do sleep 2; done

if ! wp core is-installed --allow-root --path=/var/www/html; then
  wp core install --allow-root --path=/var/www/html \
    --url="$WP_HOME" --title="$WP_SITE_TITLE" \
    --admin_user="$WP_ADMIN_USER" --admin_password="$WP_ADMIN_PASSWORD" --admin_email="$WP_ADMIN_EMAIL" \
    --skip-email
fi

wp option update home "$WP_HOME" --allow-root --path=/var/www/html
wp option update siteurl "$WP_HOME" --allow-root --path=/var/www/html
wp rewrite structure '/%postname%/' --hard --allow-root --path=/var/www/html
wp plugin install woocommerce --activate --allow-root --path=/var/www/html
wp plugin activate supreme-commerce-controls --allow-root --path=/var/www/html
wp theme activate supreme-autoparts-theme --allow-root --path=/var/www/html
wp option update woocommerce_currency USD --allow-root --path=/var/www/html
wp option update woocommerce_default_country KE --allow-root --path=/var/www/html
wp option update woocommerce_enable_guest_checkout yes --allow-root --path=/var/www/html
wp option update woocommerce_enable_checkout_login_reminder no --allow-root --path=/var/www/html
wp option update woocommerce_coming_soon no --allow-root --path=/var/www/html
wp option update woocommerce_store_pages_only no --allow-root --path=/var/www/html

wait "$apache_pid"
