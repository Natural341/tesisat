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
	if ( file_exists( __DIR__ . '/elementor-widgets.php' ) ) {
        require_once( __DIR__ . '/elementor-widgets.php' );
        $widgets_manager->register( new \Tesisat_Hero_Widget() );
        $widgets_manager->register( new \Tesisat_About_Widget() );
        $widgets_manager->register( new \Tesisat_Services_Widget() );
    }
} );

// --- HİZMETLER CPT ---
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
            'show_in_graphql' => true,
            'graphql_single_name' => 'Service',
            'graphql_plural_name' => 'Services',
        )
    );
}
add_action('init', 'create_service_cpt');

// Hizmetler Kategorisi
function create_service_taxonomy() {
    register_taxonomy(
        'service_category',
        'service',
        array(
            'label' => __('Hizmet Kategorileri'),
            'rewrite' => array('slug' => 'hizmet-kategori'),
            'hierarchical' => true,
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => 'ServiceCategory',
            'graphql_plural_name' => 'ServiceCategories',
        )
    );
}
add_action('init', 'create_service_taxonomy');

// --- BÖLGELER CPT ---
function create_location_cpt() {
    register_post_type('location',
        array(
            'labels' => array(
                'name' => __('Bölgeler'),
                'singular_name' => __('Bölge')
            ),
            'public' => true,
            'has_archive' => true,
            'rewrite' => array('slug' => 'bolge'),
            'menu_icon' => 'dashicons-location',
            'supports' => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'),
            'show_in_rest' => true,
            'show_in_graphql' => true,
            'graphql_single_name' => 'Location',
            'graphql_plural_name' => 'Locations',
        )
    );
}
add_action('init', 'create_location_cpt');

// --- İLETİŞİM AYARLARI (CUSTOMIZER & GRAPHQL) ---

// 1. Özelleştiriciye (Customizer) Ayarları Ekle
function tesisat_customize_register($wp_customize) {
    // Panel Bölümü
    $wp_customize->add_section('tesisat_contact_section', array(
        'title'    => __('İletişim Bilgileri', 'tesisat-pro'),
        'priority' => 30,
    ));

    // Ayarlar Dizisi
    $settings = array(
        'tesisat_phone' => array('label' => 'Telefon Numarası', 'default' => '+90 555 123 45 67'),
        'tesisat_email' => array('label' => 'E-posta Adresi', 'default' => 'info@tesisat.com'),
        'tesisat_address' => array('label' => 'Adres', 'default' => 'Eskişehir, Türkiye'),
        'tesisat_facebook' => array('label' => 'Facebook URL', 'default' => '#'),
        'tesisat_instagram' => array('label' => 'Instagram URL', 'default' => '#'),
        'tesisat_twitter' => array('label' => 'Twitter URL', 'default' => '#'),
    );

    foreach ($settings as $id => $data) {
        $wp_customize->add_setting($id, array(
            'default'   => $data['default'],
            'transport' => 'refresh',
        ));
        
        $wp_customize->add_control($id, array(
            'label'    => $data['label'],
            'section'  => 'tesisat_contact_section',
            'settings' => $id,
            'type'     => 'text',
        ));
    }
}
add_action('customize_register', 'tesisat_customize_register');

// 2. Bu Ayarları WPGraphQL'e Kaydet
add_action('graphql_register_types', function() {
    $fields = array(
        'tesisatPhone' => 'tesisat_phone',
        'tesisatEmail' => 'tesisat_email',
        'tesisatAddress' => 'tesisat_address',
        'tesisatFacebook' => 'tesisat_facebook',
        'tesisatInstagram' => 'tesisat_instagram',
        'tesisatTwitter' => 'tesisat_twitter'
    );

    foreach ($fields as $gql_name => $option_name) {
        register_graphql_field('GeneralSettings', $gql_name, [
            'type' => 'String',
            'description' => $option_name . ' ayarı',
            'resolve' => function() use ($option_name) {
                return get_theme_mod($option_name);
            }
        ]);
    }
});