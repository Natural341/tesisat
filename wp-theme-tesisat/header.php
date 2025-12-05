<!DOCTYPE html>
<html <?php language_attributes(); ?> class="scroll-smooth">
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>

<body <?php body_class('bg-slate-50'); ?>>

<header class="bg-blue-900 text-white sticky top-0 z-50 shadow-xl border-b border-blue-800">
    <!-- Top Bar (Contact Info) - Hidden on Mobile -->
    <div class="bg-blue-950 py-4 px-6 border-b border-blue-900 text-xs hidden md:block">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div class="flex gap-6">
                <!-- Adres -->
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span><?php echo get_theme_mod('header_address', 'İstiklal Mah. Şair Fuzuli Cad. No:123 Odunpazarı / Eskişehir'); ?></span>
                </div>
                <!-- Email -->
                <a href="mailto:<?php echo get_theme_mod('header_email', 'iletisim@tikaniklikacma.com'); ?>" class="flex items-center gap-2 hover:text-yellow-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <?php echo get_theme_mod('header_email', 'iletisim@tikaniklikacma.com'); ?>
                </a>
            </div>
            <!-- Sosyal Medya -->
            <div class="flex gap-3">
                <a href="#" target="_blank" rel="noopener noreferrer"><i class="fab fa-facebook text-white hover:text-yellow-400 text-xs"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram text-white hover:text-yellow-400 text-xs"></i></a>
                <a href="#" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter text-white hover:text-yellow-400 text-xs"></i></a>
            </div>
        </div>
    </div>

    <!-- Main Nav -->
    <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
            
            <!-- Logo -->
            <a href="<?php echo home_url(); ?>" class="flex items-center gap-2 cursor-pointer group">
                <div class="bg-yellow-400 p-2 rounded-lg group-hover:scale-105 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e3a8a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div class="flex flex-col leading-none">
                    <span class="text-lg font-bold tracking-tight uppercase"><?php bloginfo('name'); ?></span>
                    <span class="text-sm text-yellow-400 font-bold tracking-widest"><?php bloginfo('description'); ?></span>
                </div>
            </a>

            <!-- Navigation Links - Desktop -->
            <nav class="hidden md:flex items-center gap-8 font-medium text-sm uppercase tracking-wide">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'flex items-center gap-8',
                    'fallback_cb'    => false,
                    'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
                    'walker'         => new Walker_Nav_Menu(), // Basit stil için varsayılan walker yeterli olabilir ama stil gerekirse özel walker yazarız.
                ));
                ?>
                <!-- Geçici Statik Menü (Eğer WP menüsü boşsa görünsün diye) -->
                <?php if (!has_nav_menu('primary')): ?>
                <a href="#home" class="hover:text-yellow-400 transition-colors relative group">
                    Anasayfa
                    <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                </a>
                <a href="#services" class="hover:text-yellow-400 transition-colors relative group">
                    Hizmetler
                    <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                </a>
                <a href="#blog" class="hover:text-yellow-400 transition-colors relative group">
                    Blog
                    <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                </a>
                <a href="#contact" class="hover:text-yellow-400 transition-colors relative group">
                    İletişim
                    <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all group-hover:w-full"></span>
                </a>
                <?php endif; ?>
            </nav>

            <!-- Right Side Button & Mobile Menu -->
            <div class="flex items-center gap-4">
                <a href="tel:<?php echo get_theme_mod('header_phone', '+905551234567'); ?>" class="bg-yellow-400 text-blue-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-white hover:scale-105 transition-all shadow-lg hidden md:block">
                    Teklif Al
                </a>
                <button class="md:hidden text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                </button>
            </div>
        </div>
    </div>
</header>
