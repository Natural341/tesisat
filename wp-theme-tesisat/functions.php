<?php

// Tesisat Pro tema kurulumu ve özellikleri
function tesisat_pro_setup() {
    // Başlık etiketi desteği
    add_theme_support('title-tag');

    // Öne çıkan görsel desteği
    add_theme_support('post-thumbnails');

    // Logo desteği
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Menü kaydı
    register_nav_menus(array(
        'primary' => __('Ana Menü', 'tesisat-pro'),
        'footer'  => __('Footer Menü', 'tesisat-pro'),
    ));

    // Elementor için tam genişlik şablonları desteği
    add_theme_support( 'elementor-template' );
}
add_action('after_setup_theme', 'tesisat_pro_setup');

// Script ve Stil Dosyaları
function tesisat_pro_scripts() {
    // Tailwind CSS (CDN)
    wp_enqueue_script('tailwindcss', 'https://cdn.tailwindcss.com', array(), '3.4.0', false);
    wp_enqueue_style('fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    wp_enqueue_style('tesisat-pro-style', get_stylesheet_uri());
    
    // Tailwind Config
    wp_add_inline_script('tailwindcss', "
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        blue: { 900: '#1e3a8a', 950: '#172554' },
                        yellow: { 400: '#facc15', 500: '#eab308' }
                    }
                }
            }
        }
    ");
}
add_action('wp_enqueue_scripts', 'tesisat_pro_scripts');

// Elementor Editöründe de Tailwind'in çalışmasını sağla
add_action( 'elementor/editor/before_enqueue_scripts', 'tesisat_pro_scripts' );

// --- ELEMENTOR WIDGETLARI ---
// Elementor widgetlarını güvenli bir şekilde kaydet
add_action( 'elementor/widgets/register', function( $widgets_manager ) {
	require_once( __DIR__ . '/elementor-widgets.php' );
    
    $widgets_manager->register( new \Tesisat_Hero_Widget() );
    $widgets_manager->register( new \Tesisat_About_Widget() );
    $widgets_manager->register( new \Tesisat_Services_Widget() );
} );

// --- KISA KODLAR (SHORTCODES) ---

// 1. Bölgeler Listesi Kısakodu (Hala gerekli olabilir)
// Kullanım: [tesisat_locations]
function tesisat_locations_shortcode() {
    ob_start(); ?>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <?php
        $loc_query = new WP_Query(array('post_type' => 'location', 'posts_per_page' => -1));
        if ($loc_query->have_posts()) :
            while ($loc_query->have_posts()) : $loc_query->the_post(); ?>
            <a href="<?php the_permalink(); ?>" class="block bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-yellow-400 hover:shadow-md transition-all group">
                <div class="flex items-center gap-3 mb-3">
                    <div class="bg-blue-50 p-2 rounded-lg text-blue-900 group-hover:bg-yellow-400 transition-colors">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h4 class="font-bold text-blue-900 text-lg"><?php the_title(); ?></h4>
                </div>
                <p class="text-sm text-slate-500 line-clamp-2"><?php echo get_the_excerpt(); ?></p>
            </a>
        <?php endwhile; wp_reset_postdata();
        else : ?>
            <div class="col-span-full text-center text-gray-500">Henüz bölge eklenmedi.</div>
        <?php endif; ?>
    </div>
    <?php return ob_get_clean();
}
add_shortcode('tesisat_locations', 'tesisat_locations_shortcode');
// Hizmetler (Custom Post Type) Oluşturma
function create_service_cpt() {
    register_post_type('service',
        array(
            'labels' => array(
                'name' => __('Hizmetler'),
                'singular_name' => __('Hizmet')
            ),
            'public' => true,
            'has_archive' => true,
            'menu_icon' => 'dashicons-hammer',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'show_in_rest' => true,
        )
    );
}
add_action('init', 'create_service_cpt');

// Hizmetler için Kategori (Taxonomy)
function create_service_taxonomy() {
    register_taxonomy(
        'service_category',
        'service',
        array(
            'label' => __('Hizmet Kategorileri'),
            'rewrite' => array('slug' => 'hizmet-kategori'),
            'hierarchical' => true,
            'show_in_rest' => true,
        )
    );
}
add_action('init', 'create_service_taxonomy');

// Bölgeler (Locations Custom Post Type) Oluşturma - YENİ
function create_location_cpt() {
    register_post_type('location',
        array(
            'labels' => array(
                'name' => __('Bölgeler'),
                'singular_name' => __('Bölge')
            ),
            'public' => true, // Sayfa olarak erişilebilir (Indexlenir)
            'has_archive' => true,
            'rewrite' => array('slug' => 'bolge'), // URL yapısı: site.com/bolge/camlica
            'menu_icon' => 'dashicons-location',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'show_in_rest' => true,
        )
    );
}
add_action('init', 'create_location_cpt');

// 4. Bölgeler Listesi Kısakodu - YENİ
// Kullanım: [tesisat_locations]
function tesisat_locations_shortcode() {
    ob_start(); ?>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <?php
        $loc_query = new WP_Query(array('post_type' => 'location', 'posts_per_page' => -1));
        if ($loc_query->have_posts()) :
            while ($loc_query->have_posts()) : $loc_query->the_post(); ?>
            <a href="<?php the_permalink(); ?>" class="block bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-yellow-400 hover:shadow-md transition-all group">
                <div class="flex items-center gap-3 mb-3">
                    <div class="bg-blue-50 p-2 rounded-lg text-blue-900 group-hover:bg-yellow-400 transition-colors">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <h4 class="font-bold text-blue-900 text-lg"><?php the_title(); ?></h4>
                </div>
                <p class="text-sm text-slate-500 line-clamp-2"><?php echo get_the_excerpt(); ?></p>
            </a>
        <?php endwhile; wp_reset_postdata();
        else : ?>
            <div class="col-span-full text-center text-gray-500">Henüz bölge eklenmedi.</div>
        <?php endif; ?>
    </div>
    <?php return ob_get_clean();
}
add_shortcode('tesisat_locations', 'tesisat_locations_shortcode');
