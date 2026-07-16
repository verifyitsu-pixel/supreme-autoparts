<?php
if (!defined('ABSPATH')) exit;
$template = get_template_directory() . '/front-page-static.html';
if (is_readable($template)) {
  readfile($template);
  exit;
}
get_header();
?><main class="site-main"><h1>Supreme Autoparts</h1><?php echo do_shortcode('[products limit="8" columns="4"]'); ?></main><?php get_footer(); ?>
