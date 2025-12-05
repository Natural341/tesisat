<?php
/**
 * The template for displaying single location posts.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();

// Elementor kontrolü
if ( class_exists( '\Elementor\Plugin' ) && \Elementor\Plugin::instance()->documents->get( get_the_ID() )->is_built_with_elementor() ) {
    the_content();
} else {
    // Varsayılan PHP Şablonu
    ?>
    <main class="min-h-screen bg-slate-50 py-12">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            <!-- Sidebar (Benzer Bölgeler) -->
            <aside class="space-y-8 order-2 lg:order-1">
                <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                    <h3 class="text-xl font-bold text-blue-900 mb-4 pb-4 border-b border-slate-100">Diğer Hizmet Bölgeleri</h3>
                    <ul class="space-y-2">
                        <?php
                        $loc_sidebar = new WP_Query(array(
                            'post_type' => 'location', 
                            'posts_per_page' => 10,
                            'post__not_in' => array(get_the_ID())
                        ));
                        while($loc_sidebar->have_posts()): $loc_sidebar->the_post();
                        ?>
                        <li>
                            <a href="<?php the_permalink(); ?>" class="block p-3 rounded-lg transition-colors flex justify-between items-center hover:bg-blue-50 text-slate-700">
                                <span class="flex items-center gap-2">
                                    <i class="fas fa-map-marker-alt text-yellow-500 text-sm"></i>
                                    <?php the_title(); ?>
                                </span>
                                <i class="fas fa-chevron-right text-slate-300 text-xs"></i>
                            </a>
                        </li>
                        <?php endwhile; wp_reset_postdata(); ?>
                    </ul>
                </div>

                <!-- Hızlı İletişim -->
                <div class="bg-blue-900 text-white p-8 rounded-2xl shadow-lg text-center relative overflow-hidden">
                    <div class="relative z-10">
                        <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-900">
                            <i class="fas fa-headset text-2xl"></i>
                        </div>
                        <h3 class="text-2xl font-bold mb-2">Acil Servis</h3>
                        <p class="text-blue-200 mb-6">Bu bölgede ekiplerimiz hazır bekliyor.</p>
                        <a href="tel:<?php echo get_theme_mod('header_phone', '+905551234567'); ?>" class="inline-block bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors">
                            Hemen Ara
                        </a>
                    </div>
                </div>
            </aside>

            <!-- Ana İçerik -->
            <div class="lg:col-span-2 order-1 lg:order-2">
                <?php while (have_posts()) : the_post(); ?>
                    <article class="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                        
                        <!-- Başlık -->
                        <div class="mb-8">
                            <span class="text-yellow-500 font-bold uppercase tracking-wider text-sm mb-2 block">Hizmet Bölgesi</span>
                            <h1 class="text-4xl md:text-5xl font-bold text-blue-900"><?php the_title(); ?></h1>
                        </div>

                        <!-- Görsel -->
                        <?php if (has_post_thumbnail()) : ?>
                            <div class="mb-10 rounded-2xl overflow-hidden shadow-md h-[300px] relative">
                                <?php the_post_thumbnail('full', array('class' => 'w-full h-full object-cover')); ?>
                                <div class="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex items-end p-8">
                                    <p class="text-white font-bold text-lg flex items-center gap-2">
                                        <i class="fas fa-check-circle text-yellow-400"></i> 
                                        <?php the_title(); ?> Bölgesinde 7/24 Aktif Servis
                                    </p>
                                </div>
                            </div>
                        <?php endif; ?>

                        <!-- İçerik -->
                        <div class="prose prose-lg prose-blue max-w-none text-slate-600 leading-relaxed">
                            <?php the_content(); ?>
                        </div>

                        <!-- CTA -->
                        <div class="mt-12 p-8 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h3 class="text-2xl font-bold text-blue-900 mb-2">Sorun mu Yaşıyorsunuz?</h3>
                                <p class="text-slate-600">Ekiplerimiz <?php the_title(); ?> bölgesine ortalama 30 dakikada ulaşıyor.</p>
                            </div>
                            <a href="tel:<?php echo get_theme_mod('header_phone', '+905551234567'); ?>" class="bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors shadow-lg whitespace-nowrap">
                                <i class="fas fa-phone-alt mr-2"></i> Tesisatçı Çağır
                            </a>
                        </div>

                    </article>
                <?php endwhile; ?>
            </div>

        </div>
    </main>
    <?php
}

get_footer();
