<?php
if (!defined('ABSPATH')) exit;

function supreme_autoparts_setup() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('woocommerce');
  add_theme_support('wc-product-gallery-zoom');
  add_theme_support('wc-product-gallery-lightbox');
  add_theme_support('wc-product-gallery-slider');
  register_nav_menus(['primary' => __('Primary navigation', 'supreme-autoparts')]);
}
add_action('after_setup_theme', 'supreme_autoparts_setup');

function supreme_autoparts_assets() {
  wp_enqueue_style('supreme-autoparts', get_stylesheet_uri(), [], wp_get_theme()->get('Version'));
}
add_action('wp_enqueue_scripts', 'supreme_autoparts_assets');

function supreme_autoparts_woocommerce_wrappers() {
  remove_action('woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10);
  remove_action('woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10);
  add_action('woocommerce_before_main_content', function () { echo '<main class="supreme-commerce"><div class="supreme-breadcrumbs">'; woocommerce_breadcrumb(); echo '</div>'; }, 10);
  add_action('woocommerce_after_main_content', function () { echo '</main>'; }, 10);
}
add_action('after_setup_theme', 'supreme_autoparts_woocommerce_wrappers');

add_filter('woocommerce_enqueue_styles', '__return_empty_array');
