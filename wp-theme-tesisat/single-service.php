<?php get_header(); ?>

<main class="min-h-screen bg-slate-50 py-12">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        <!-- Sidebar (Hizmet Listesi & İletişim) -->
        <aside class="space-y-8">
            <div class="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <h3 class="text-xl font-bold text-blue-900 mb-4 pb-4 border-b border-slate-100">Hizmetlerimiz</h3>
                <ul class="space-y-2">
                    <?php
                    $services = new WP_Query(array('post_type' => 'service', 'posts_per_page' => -1));
                    while($services->have_posts()): $services->the_post();
                        $isActive = get_the_ID() === get_queried_object_id();
                    ?>
                    <li>
                        <a href="<?php the_permalink(); ?>" class="block p-3 rounded-lg transition-colors flex justify-between items-center <?php echo $isActive ? 'bg-blue-900 text-white' : 'hover:bg-blue-50 text-slate-700'; ?>">
                            <?php the_title(); ?>
                            <?php if($isActive): ?>
                                <i class="fas fa-chevron-right text-yellow-400"></i>
                            <?php endif; ?>
                        </a>
                    </li>
                    <?php endwhile; wp_reset_postdata(); ?>
                </ul>
            </div>

            <div class="bg-blue-900 text-white p-8 rounded-2xl shadow-lg text-center relative overflow-hidden">
                <div class="relative z-10">
                    <div class="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-900">
                        <i class="fas fa-phone-alt text-2xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">Acil Destek Hattı</h3>
                    <p class="text-blue-200 mb-6">7/24 Tesisat sorunlarınız için bizi arayabilirsiniz.</p>
                    <a href="tel:<?php echo get_theme_mod('header_phone', '+905551234567'); ?>" class="inline-block bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-400 transition-colors">
                        Hemen Ara
                    </a>
                </div>
                <!-- Decorative Circle -->
                <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="lg:col-span-2">
            <?php while (have_posts()) : the_post(); ?>
                <article class="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
                    
                    <div class="flex items-center gap-4 mb-6">
                        <div class="bg-blue-100 p-3 rounded-xl text-blue-900">
                             <!-- Icon (Dynamic if available, else static) -->
                             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
                        </div>
                        <span class="text-yellow-500 font-bold uppercase tracking-wider text-sm">Profesyonel Hizmet</span>
                    </div>

                    <h1 class="text-4xl md:text-5xl font-bold text-blue-900 mb-8"><?php the_title(); ?></h1>

                    <?php if (has_post_thumbnail()) : ?>
                        <div class="mb-10 rounded-2xl overflow-hidden shadow-md">
                            <?php the_post_thumbnail('large', array('class' => 'w-full h-auto')); ?>
                        </div>
                    <?php endif; ?>

                    <div class="prose prose-lg prose-blue max-w-none text-slate-600 leading-relaxed">
                        <?php the_content(); ?>
                    </div>

                    <!-- Call to Action Block -->
                    <div class="mt-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                        <h4 class="font-bold text-xl text-blue-900 mb-2">Bu hizmet için teklif almak ister misiniz?</h4>
                        <p class="text-slate-700 mb-4">Uzman ekibimiz sorununuzu en kısa sürede çözmek için hazır.</p>
                        <a href="#contact" class="font-bold text-blue-900 underline hover:text-yellow-600">İletişime Geçin &rarr;</a>
                    </div>

                </article>
            <?php endwhile; ?>
        </div>

    </div>
</main>

<?php get_footer(); ?>
