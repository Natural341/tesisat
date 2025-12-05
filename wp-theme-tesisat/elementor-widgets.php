<?php
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Elementor Widget Sınıflarını Yükle
add_action( 'elementor/widgets/register', function( $widgets_manager ) {
	require_once( __DIR__ . '/elementor-widgets.php' );
    
    // Widgetları Kaydet
	$widgets_manager->register( new \Tesisat_Hero_Widget() );
	$widgets_manager->register( new \Tesisat_About_Widget() );
	$widgets_manager->register( new \Tesisat_Services_Widget() );
} );

/**
 * 1. HERO WIDGET
 */
class Tesisat_Hero_Widget extends \Elementor\Widget_Base {

	public function get_name() { return 'tesisat_hero'; }
	public function get_title() { return 'Tesisat Hero (Ana Manşet)'; }
	public function get_icon() { return 'eicon-banner'; }
	public function get_categories() { return [ 'general' ]; }

	protected function register_controls() {
		$this->start_controls_section('content_section', ['label' => 'İçerik', 'tab' => \Elementor\Controls_Manager::TAB_CONTENT]);

		$this->add_control('title', [
			'label' => 'Başlık', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'MODERN YAPI & TESİSAT',
		]);
        $this->add_control('subtitle', [
			'label' => 'Üst Başlık', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'Profesyonel Tesisat Çözümleri',
		]);
		$this->add_control('description', [
			'label' => 'Açıklama', 'type' => \Elementor\Controls_Manager::TEXTAREA, 'default' => 'Eskişehir\'ın en güvenilir altyapı ve tesisat hizmetleri.',
		]);
        $this->add_control('bg_image', [
			'label' => 'Arkaplan Resmi', 'type' => \Elementor\Controls_Manager::MEDIA, 'default' => ['url' => 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2000'],
		]);
        $this->add_control('btn1_text', ['label' => 'Buton 1 Metni', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'Hizmetleri Keşfet']);
        $this->add_control('btn1_link', ['label' => 'Buton 1 Linki', 'type' => \Elementor\Controls_Manager::URL, 'default' => ['url' => '#services']]);
        
        $this->add_control('btn2_text', ['label' => 'Buton 2 Metni', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'Bize Ulaşın']);
        $this->add_control('btn2_link', ['label' => 'Buton 2 Linki', 'type' => \Elementor\Controls_Manager::URL, 'default' => ['url' => '#contact']]);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings_for_display();
		?>
        <section class="relative w-full min-h-[800px] flex items-center overflow-hidden">
            <!-- BG -->
            <div class="absolute inset-0 w-full h-full z-0">
                <img src="<?php echo esc_url($settings['bg_image']['url']); ?>" alt="Bg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-blue-950/80"></div>
            </div>
            <!-- Content -->
            <div class="relative z-20 container mx-auto px-6 md:px-12 flex items-center h-full">
                <div class="bg-white/10 backdrop-blur-md border border-white/20 p-10 md:p-14 rounded-3xl max-w-2xl shadow-2xl mt-32 md:mt-0">
                    <div class="inline-block bg-yellow-400 text-blue-900 px-4 py-1 rounded mb-4 font-bold text-xs tracking-widest uppercase">
                        <?php echo $settings['subtitle']; ?>
                    </div>
                    <h1 class="text-5xl md:text-7xl font-black text-white leading-none mb-6 drop-shadow-lg">
                        <?php echo $settings['title']; ?>
                    </h1>
                    <p class="text-lg text-gray-200 mb-8 leading-relaxed font-light">
                        <?php echo $settings['description']; ?>
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <?php if($settings['btn1_text']): ?>
                        <a href="<?php echo esc_url($settings['btn1_link']['url']); ?>" class="bg-yellow-400 text-blue-900 px-8 py-3.5 rounded-lg font-bold hover:bg-white transition-all shadow-lg flex items-center gap-2">
                            <?php echo $settings['btn1_text']; ?>
                        </a>
                        <?php endif; ?>
                        <?php if($settings['btn2_text']): ?>
                        <a href="<?php echo esc_url($settings['btn2_link']['url']); ?>" class="border-2 border-white text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white hover:text-blue-900 transition-all">
                             <?php echo $settings['btn2_text']; ?>
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </section>
		<?php
	}
}

/**
 * 2. ABOUT WIDGET
 */
class Tesisat_About_Widget extends \Elementor\Widget_Base {

	public function get_name() { return 'tesisat_about'; }
	public function get_title() { return 'Tesisat Hakkımızda'; }
	public function get_icon() { return 'eicon-info-box'; }
	public function get_categories() { return [ 'general' ]; }

	protected function register_controls() {
		$this->start_controls_section('content_section', ['label' => 'İçerik', 'tab' => \Elementor\Controls_Manager::TAB_CONTENT]);

		$this->add_control('title', ['label' => 'Başlık', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'Güvenilir Ellerde Modern Çözümler']);
		$this->add_control('content', ['label' => 'İçerik', 'type' => \Elementor\Controls_Manager::WYSIWYG, 'default' => '<p>20 yılı aşkın tecrübemizle...</p>']);
        $this->add_control('image', ['label' => 'Görsel', 'type' => \Elementor\Controls_Manager::MEDIA, 'default' => ['url' => 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000']]);
        
        $repeater = new \Elementor\Repeater();
		$repeater->add_control('list_item', ['label' => 'Madde', 'type' => \Elementor\Controls_Manager::TEXT, 'default' => 'Garantili İşçilik']);
		$this->add_control('features', [
			'label' => 'Özellikler Listesi',
			'type' => \Elementor\Controls_Manager::REPEATER,
			'fields' => $repeater->get_controls(),
			'default' => [['list_item' => 'Garantili İşçilik'], ['list_item' => '7/24 Acil Destek']]
		]);

		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings_for_display();
		?>
        <section class="py-20 bg-white">
            <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div class="relative h-[500px] bg-slate-200 rounded-3xl overflow-hidden group shadow-2xl">
                 <img src="<?php echo esc_url($settings['image']['url']); ?>" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="About" />
                 <div class="absolute inset-0 bg-blue-900/40 group-hover:bg-blue-900/20 transition-colors"></div>
              </div>
              <div class="space-y-6">
                 <span class="text-yellow-500 font-bold tracking-wider uppercase">Hakkımızda</span>
                 <h2 class="text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
                   <?php echo $settings['title']; ?>
                 </h2>
                 <div class="text-slate-600 text-lg leading-relaxed space-y-4">
                    <?php echo $settings['content']; ?>
                 </div>
                 <ul class="space-y-4 pt-4">
                     <?php foreach ( $settings['features'] as $item ) : ?>
                     <li class="flex items-center gap-3">
                       <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-900">
                          <i class="fas fa-check"></i>
                       </div>
                       <span class="text-slate-900 font-bold"><?php echo $item['list_item']; ?></span>
                     </li>
                     <?php endforeach; ?>
                 </ul>
              </div>
            </div>
        </section>
		<?php
	}
}

/**
 * 3. SERVICES WIDGET
 */
class Tesisat_Services_Widget extends \Elementor\Widget_Base {

	public function get_name() { return 'tesisat_services'; }
	public function get_title() { return 'Tesisat Hizmetler Grid'; }
	public function get_icon() { return 'eicon-gallery-grid'; }
	public function get_categories() { return [ 'general' ]; }

	protected function register_controls() {
		$this->start_controls_section('content_section', ['label' => 'Ayarlar', 'tab' => \Elementor\Controls_Manager::TAB_CONTENT]);
		$this->add_control('count', ['label' => 'Gösterilecek Sayı', 'type' => \Elementor\Controls_Manager::NUMBER, 'default' => 6]);
		$this->end_controls_section();
	}

	protected function render() {
		$settings = $this->get_settings_for_display();
		?>
        <section class="py-24 bg-slate-50 relative">
            <div class="absolute inset-0 opacity-5 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)]" style="background-size: 16px 16px;"></div>
            <div class="max-w-7xl mx-auto px-6 relative z-10">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <?php
                    $services_query = new \WP_Query(array(
                        'post_type' => 'service',
                        'posts_per_page' => $settings['count']
                    ));
                    if ($services_query->have_posts()) : 
                        while ($services_query->have_posts()) : $services_query->the_post(); 
                            $short_desc = get_the_excerpt();
                    ?>
                        <div class="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 hover:border-yellow-400 transition-all group hover:-translate-y-2 hover:shadow-2xl flex flex-col">
                            <div class="bg-blue-50 p-4 rounded-2xl inline-block w-fit mb-6 group-hover:bg-blue-900 transition-colors duration-300">
                                 <i class="fas fa-wrench text-2xl text-blue-900 group-hover:text-yellow-400 transition-colors"></i>
                            </div>
                            <h3 class="text-2xl font-bold text-blue-900 mb-3 group-hover:text-blue-700"><?php the_title(); ?></h3>
                            <p class="text-slate-600 leading-relaxed mb-6 flex-grow">
                                <?php echo $short_desc ? $short_desc : wp_trim_words(get_the_content(), 15);
                            ?></p>
                            <a href="<?php the_permalink(); ?>" class="flex items-center gap-2 text-blue-900 font-bold hover:text-yellow-500 transition-colors mt-auto">
                                Detaylı İncele <i class="fas fa-arrow-right"></i>
                            </a>
                        </div>
                    <?php endwhile; wp_reset_postdata();
                    else : ?>
                        <div>Henüz hizmet eklenmedi.</div>
                    <?php endif; ?>
                </div>
            </div>
        </section>
		<?php
	}
}