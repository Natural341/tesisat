<?php
/**
 * The template for displaying the front page.
 *
 * @package TesisatPro
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

get_header();

// Elementor ile düzenlenip düzenlenmediğini kontrol et
// Eğer Elementor ile düzenlenmişse, Elementor içeriğini göster
if ( class_exists( '\Elementor\Plugin' ) && \Elementor\Plugin::instance()->documents->get( get_the_ID() )->is_built_with_elementor() ) {
    the_content();
} else {
    // Elementor ile düzenlenmemişse, mevcut PHP ile yazılmış Ana Sayfa içeriğini göster
    ?>
    <main class="min-h-screen bg-slate-50 scroll-smooth">
    
        <!-- HERO SECTION -->
        <section id="home" class="relative w-full min-h-[800px] flex items-center overflow-hidden">
            <!-- Layer 0: Construction Photo Background -->
            <div class="absolute inset-0 w-full h-full z-0">
                <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000&auto=format&fit=crop" alt="Construction Site" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-blue-950/80"></div>
            </div>

            <!-- Layer 1: Overlay Graphic -->
            <div class="absolute right-0 top-0 w-full h-full z-10 pointer-events-none flex justify-end items-center opacity-40 mix-blend-soft-light">
                 <div class="relative w-[80%] h-[80%]">
                    <img src="<?php echo get_template_directory_uri(); ?>/assets/images/bg_hero.png" alt="Overlay" class="w-full h-full object-contain object-right" />
                 </div>
            </div>

            <!-- Layer 2: Content -->
            <div class="relative z-20 container mx-auto px-6 md:px-12 flex items-center h-full">
                <div class="bg-white/10 backdrop-blur-md border border-white/20 p-10 md:p-14 rounded-3xl max-w-2xl shadow-2xl mt-32 md:mt-0">
                    <div class="inline-block bg-yellow-400 text-blue-900 px-4 py-1 rounded mb-4 font-bold text-xs tracking-widest uppercase">
                      Profesyonel Tesisat Çözümleri
                    </div>

                    <h1 class="text-5xl md:text-7xl font-black text-white leading-none mb-6 drop-shadow-lg">
                      MODERN <br/>
                      <span class="text-yellow-400">YAPI</span> & <br/>
                      TESİSAT
                    </h1>
                    
                    <p class="text-lg text-gray-200 mb-8 leading-relaxed font-light">
                      <?php echo get_theme_mod('hero_description', 'Eskişehir\'in en güvenilir altyapı ve tesisat hizmetleri. Eviniz ve iş yeriniz için kalıcı, garantili ve modern çözümler üretiyoruz.'); ?>
                    </p>
                    
                    <div class="flex flex-wrap gap-4">
                      <a href="#services" class="bg-yellow-400 text-blue-900 px-8 py-3.5 rounded-lg font-bold hover:bg-white transition-all shadow-lg flex items-center gap-2">
                        Hizmetleri Keşfet
                      </a>
                      <a href="#contact" class="border-2 border-white text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white hover:text-blue-900 transition-all">
                        Bize Ulaşın
                      </a>
                    </div>
                </div>
            </div>
        </section>

        <!-- ABOUT SECTION (Static Content from Next.js) -->
        <section id="about" class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div class="relative h-[500px] bg-slate-200 rounded-3xl overflow-hidden group shadow-2xl">
                 <img 
                   src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop"
                   class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                   alt="Hakkımızda"
                 />
                 <div class="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/20 transition-colors"></div>
              </div>
              
              <div class="space-y-6">
                 <span class="text-yellow-500 font-bold tracking-wider uppercase">Hakkımızda</span>
                 <h2 class="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
                   Güvenilir Ellerde <br/> Modern Çözümler
                 </h2>
                 <div class="text-slate-600 text-lg leading-relaxed space-y-4">
                    <p>20 yılı aşkın tecrübemizle Eskişehir'de tesisat ve altyapı sektöründe lider konumdayız. Sadece tamir etmiyor, yaşam alanlarınızın konforunu artıracak modern çözümler sunuyoruz.</p>
                    <p>Evinizdeki veya iş yerinizdeki her türlü su kaçağı, tıkanıklık ve petek temizliği işlerinde son teknoloji cihazlarımızla kırmadan dökmeden hizmet veriyoruz.</p>
                 </div>
                 <ul class="space-y-4 pt-4">
                     <li class="flex items-center gap-3">
                       <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <span class="text-slate-900 font-bold">Garantili İşçilik</span>
                     </li>
                     <li class="flex items-center gap-3">
                       <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <span class="text-slate-900 font-bold">7/24 Acil Destek</span>
                     </li>
                     <li class="flex items-center gap-3">
                       <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <span class="text-slate-900 font-bold">Modern Ekipmanlar</span>
                     </li>
                 </ul>
              </div>
            </div>
        </section>

        <!-- SERVICES SECTION (Dynamic Loop) -->
        <section id="services" class="py-24 bg-slate-50 relative">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)]" style="background-size: 16px 16px;"></div>

            <div class="max-w-7xl mx-auto px-6 relative z-10">
                <div class="text-center mb-16">
                    <span class="text-yellow-500 font-bold uppercase tracking-wider text-sm">Uzman Çözümler</span>
                    <h2 class="text-5xl font-bold text-blue-900 mb-4 mt-2">Profesyonel Hizmetlerimiz</h2>
                    <div class="w-24 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full"></div>
                    <p class="mt-6 text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Eskişehir genelinde modern ekipmanlar ve uzman kadromuzla kırmadan dökmeden garantili hizmet sunuyoruz.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <?php
                    $services_query = new WP_Query(array(
                        'post_type' => 'service',
                        'posts_per_page' => -1 // Tüm hizmetleri göster
                    ));

                    if ($services_query->have_posts()) : 
                        while ($services_query->have_posts()) : $services_query->the_post(); 
                            // Custom Fields (Eklenti veya özel alan desteği gerekir, şimdilik placeholder) 
                            $icon = get_post_meta(get_the_ID(), 'service_icon', true); 
                            $short_desc = get_the_excerpt();
                    ?>
                        <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:border-yellow-400 transition-all group hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                            <div class="bg-blue-50 p-4 rounded-2xl inline-block w-fit mb-6 group-hover:bg-blue-900 transition-colors duration-300">
                                 <!-- Icon Placeholder (Wrench) -->
                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-900 group-hover:text-yellow-400 transition-colors duration-300"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                            </div>
                            
                            <h3 class="text-2xl font-bold text-blue-900 mb-3 group-hover:text-blue-700"><?php the_title(); ?></h3>
                            <p class="text-slate-600 leading-relaxed mb-6 flex-grow">
                                <?php echo $short_desc ? $short_desc : wp_trim_words(get_the_content(), 15); ?>
                            </p>
                            
                            <a href="<?php the_permalink(); ?>" class="flex items-center gap-2 text-blue-900 font-bold hover:text-yellow-500 transition-colors mt-auto">
                                Detaylı İncele 
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                            </a>
                        </div>
                    <?php 
                        endwhile;
                        wp_reset_postdata();
                    else : 
                        // Eğer hiç hizmet yoksa bir placeholder gösterelim
                    ?>
                        <div class="col-span-full text-center p-10 bg-yellow-50 rounded-xl">
                            <h3 class="text-xl font-bold text-yellow-800">Henüz Hizmet Eklenmedi</h3>
                            <p class="text-yellow-700">Lütfen WordPress panelinden "Hizmetler" bölümüne giderek yeni hizmetler ekleyin.</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </section>
        
        <!-- CONTACT SECTION (Simple anchor since it's in Footer) -->
        <div id="contact"></div>

    </main>
    <?php
}

get_footer();