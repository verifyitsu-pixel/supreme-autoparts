<!doctype html><html <?php language_attributes(); ?>><head><meta charset="<?php bloginfo('charset'); ?>"><meta name="viewport" content="width=device-width,initial-scale=1"><?php wp_head(); ?></head><body <?php body_class(); ?>><?php wp_body_open(); ?>
<header class="supreme-header">
  <div class="supreme-top">
    <a class="supreme-logo" href="<?php echo esc_url(home_url('/')); ?>"><img src="<?php echo esc_url(home_url('/assets/exact/supreme-logo.svg')); ?>" alt="Supreme Autoparts"></a>
    <div class="supreme-contact"><a href="tel:+254714498451">0714 498 451</a><span>Mon–Fri: 8AM–7PM</span></div>
    <div class="supreme-actions"><a href="<?php echo esc_url(wc_get_cart_url()); ?>">Cart <span><?php echo esc_html(WC()->cart ? WC()->cart->get_cart_contents_count() : 0); ?></span></a><a href="<?php echo esc_url(wc_get_page_permalink('myaccount')); ?>">My Account</a></div>
  </div>
  <button class="supreme-menu-toggle" aria-expanded="false" aria-controls="supreme-nav">☰ Menu</button>
  <nav id="supreme-nav" class="supreme-nav" aria-label="Primary navigation">
    <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">Shop by Categories</a>
    <a href="<?php echo esc_url(home_url('/product-category/auto-parts/')); ?>">Used Auto Parts</a>
    <a href="<?php echo esc_url(home_url('/product-category/engines/')); ?>">Used Engine</a>
    <a href="<?php echo esc_url(home_url('/product-category/transmissions/')); ?>">Used Transmission</a>
    <a href="<?php echo esc_url(home_url('/contact-us/')); ?>">Contact Us</a>
    <a href="<?php echo esc_url(home_url('/about-us/')); ?>">Info</a>
  </nav>
</header>
