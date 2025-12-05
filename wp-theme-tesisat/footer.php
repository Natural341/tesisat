<footer class="bg-blue-950 text-white pt-20 pb-10 border-t border-blue-900">
    <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <!-- Brand Info -->
            <div class="space-y-6">
                <h3 class="text-2xl font-bold text-yellow-400 uppercase tracking-wider">
                    <?php bloginfo('name'); ?> <br/> <span class="text-white"><?php bloginfo('description'); ?></span>
                </h3>
                <p class="text-blue-200 leading-relaxed">
                    <?php echo get_theme_mod('footer_text', 'Modern ekipmanlar ve uzman kadromuzla Eskişehir\'in her noktasına hızlı ve güvenilir tesisat çözümleri sunuyoruz.'); ?>
                </p>
                <div class="flex gap-4">
                    <a href="#" class="bg-blue-900 p-2 rounded-lg hover:bg-yellow-400 hover:text-blue-950 transition-colors">
                        <i class="fab fa-facebook text-lg"></i>
                    </a>
                    <a href="#" class="bg-blue-900 p-2 rounded-lg hover:bg-yellow-400 hover:text-blue-950 transition-colors">
                        <i class="fab fa-instagram text-lg"></i>
                    </a>
                    <a href="#" class="bg-blue-900 p-2 rounded-lg hover:bg-yellow-400 hover:text-blue-950 transition-colors">
                        <i class="fab fa-twitter text-lg"></i>
                    </a>
                </div>
            </div>

                        <!-- Hizmet Bölgeleri -->

                        <div>

                            <h4 class="text-xl font-bold mb-6 border-b-2 border-yellow-400 inline-block pb-2">Hizmet Bölgelerimiz</h4>

                            <ul class="space-y-3 text-blue-200">

                                <?php 

                                $loc_query = new WP_Query(array(

                                    'post_type' => 'location',

                                    'posts_per_page' => 6 // En son eklenen 6 bölgeyi göster

                                ));

                                

                                if ($loc_query->have_posts()) :

                                    while ($loc_query->have_posts()) : $loc_query->the_post(); ?>

                                    <li>

                                        <a href="<?php the_permalink(); ?>" class="hover:text-yellow-400 transition-colors flex items-center gap-2 text-sm">

                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>

                                            <?php the_title(); ?>

                                        </a>

                                    </li>

                                    <?php endwhile;

                                    wp_reset_postdata();

                                else: ?>

                                    <li class="text-sm opacity-50">Henüz bölge eklenmedi.</li>

                                <?php endif; ?>

                            </ul>

                        </div>

            <!-- Services (WP Query) -->
            <div>
                <h4 class="text-xl font-bold mb-6 border-b-2 border-yellow-400 inline-block pb-2">Hizmetlerimiz</h4>
                <ul class="space-y-3 text-blue-200">
                    <?php
                    $services_query = new WP_Query(array(
                        'post_type' => 'service',
                        'posts_per_page' => 5
                    ));
                    if ($services_query->have_posts()) :
                        while ($services_query->have_posts()) : $services_query->the_post(); ?>
                        <li>
                            <a href="<?php the_permalink(); ?>" class="hover:text-yellow-400 cursor-pointer flex items-center gap-2 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                <?php the_title(); ?>
                            </a>
                        </li>
                        <?php endwhile;
                        wp_reset_postdata();
                    else : ?>
                        <li><span class="text-sm">Henüz hizmet eklenmedi.</span></li>
                    <?php endif; ?>
                </ul>
            </div>

            <!-- Contact -->
            <div>
                <h4 class="text-xl font-bold mb-6 border-b-2 border-yellow-400 inline-block pb-2">İletişim</h4>
                <ul class="space-y-6">
                    <li class="flex items-start gap-4">
                        <div class="bg-yellow-400 p-2 rounded-full text-blue-950 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        </div>
                        <span class="text-blue-200"><?php echo get_theme_mod('footer_address', 'İstiklal Mah. Şair Fuzuli Cad. No:123 Odunpazarı / Eskişehir'); ?></span>
                    </li>
                    <li class="flex items-center gap-4">
                        <div class="bg-yellow-400 p-2 rounded-full text-blue-950 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        </div>
                        <span class="text-blue-200 text-lg font-bold"><?php echo get_theme_mod('footer_phone', '+90 555 123 45 67'); ?></span>
                    </li>
                    <li class="flex items-center gap-4">
                        <div class="bg-yellow-400 p-2 rounded-full text-blue-950 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <span class="text-blue-200"><?php echo get_theme_mod('footer_email', 'iletisim@tikaniklikacma.com'); ?></span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-blue-900 pt-8 text-center text-blue-400 text-sm">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. Tüm hakları saklıdır.</p>
        </div>
    </div>
</footer>

<!-- Floating Button (Hemen Ara) -->
<a href="tel:<?php echo str_replace(' ', '', get_theme_mod('header_phone', '+905551234567')); ?>" class="fixed right-4 bottom-8 z-[9999] flex flex-col items-center gap-2 group">
    <div class="relative">
        <!-- Pulse Effect -->
        <div class="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
        <!-- Button -->
        <div class="relative bg-blue-900 text-white p-4 rounded-full shadow-2xl border-2 border-yellow-400 hover:bg-yellow-400 hover:text-blue-900 transition-all cursor-pointer transform group-hover:scale-110">
            <i class="fas fa-phone-alt text-xl"></i>
        </div>
    </div>
    <!-- Tooltip -->
    <div class="bg-white text-blue-900 text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap">
        Hemen Ara
    </div>
</a>

<!-- Mobile Menu & Interactions Script -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Mobil Menü Mantığı
    const mobileMenuBtn = document.querySelector('button.md\\:hidden'); // Header'daki hamburger butonu
    const navMenu = document.querySelector('nav.hidden.md\\:flex'); // Desktop menüsü (Mobilde gizli)

    // Mobil menü için container oluştur (Header.php'de statik yoksa dinamik ekliyoruz)
    let mobileNavContainer = document.getElementById('mobile-nav-overlay');
    if (!mobileNavContainer) {
        mobileNavContainer = document.createElement('div');
        mobileNavContainer.id = 'mobile-nav-overlay';
        mobileNavContainer.className = 'fixed inset-0 bg-blue-950/95 z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 opacity-0 invisible translate-y-4';
        
        // Mevcut menüyü kopyala
        if(navMenu) {
            const cloneMenu = navMenu.cloneNode(true);
            cloneMenu.className = 'flex flex-col items-center gap-6 text-xl font-bold text-white';
            mobileNavContainer.appendChild(cloneMenu);
            
            // Kapatma butonu ekle
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '<i class="fas fa-times text-3xl text-yellow-400"></i>';
            closeBtn.className = 'absolute top-6 right-6';
            closeBtn.onclick = () => toggleMobileMenu();
            mobileNavContainer.appendChild(closeBtn);
            
            document.body.appendChild(mobileNavContainer);
        }
    }

    function toggleMobileMenu() {
        const isOpen = mobileNavContainer.classList.contains('opacity-100');
        if (isOpen) {
            mobileNavContainer.classList.remove('opacity-100', 'visible', 'translate-y-0');
            mobileNavContainer.classList.add('opacity-0', 'invisible', 'translate-y-4');
            document.body.style.overflow = '';
        } else {
            mobileNavContainer.classList.remove('opacity-0', 'invisible', 'translate-y-4');
            mobileNavContainer.classList.add('opacity-100', 'visible', 'translate-y-0');
            document.body.style.overflow = 'hidden';
        }
    }

    if(mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Alt Menü (Dropdown) Mantığı - Desktop
    const menuItems = document.querySelectorAll('.menu-item-has-children');
    menuItems.forEach(item => {
        item.classList.add('relative', 'group');
        const subMenu = item.querySelector('.sub-menu');
        if(subMenu) {
            subMenu.className = 'sub-menu absolute top-full left-0 w-56 bg-white text-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform translate-y-2 group-hover:translate-y-0 border-t-4 border-yellow-400 z-50';
            
            const links = subMenu.querySelectorAll('a');
            links.forEach(link => {
                link.className = 'block px-4 py-3 hover:bg-blue-50 hover:text-blue-900 border-b border-slate-100 transition-colors last:border-0';
            });
        }
    });
});
</script>

<?php wp_footer(); ?>
</body>
</html>
