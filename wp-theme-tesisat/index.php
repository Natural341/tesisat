<?php get_header(); ?>

<main class="container mx-auto px-6 py-12">
    <h1 class="text-4xl font-bold text-blue-900 mb-8">Blog Yazıları</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <?php
        if (have_posts()) :
            while (have_posts()) : the_post();
                // Sadece "post" türündeki yazıları listeler (sayfaları veya hizmetleri değil)
                if (get_post_type() == 'post') :
        ?>
                <article class="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                    <?php if (has_post_thumbnail()) : ?>
                        <div class="mb-4">
                            <?php the_post_thumbnail('medium', array('class' => 'w-full h-48 object-cover rounded-md')); ?>
                        </div>
                    <?php endif; ?>
                    <h2 class="text-2xl font-bold text-blue-800 mb-2">
                        <a href="<?php the_permalink(); ?>" class="hover:text-yellow-500"><?php the_title(); ?></a>
                    </h2>
                    <div class="text-gray-600 text-sm mb-4">
                        Yazar: <?php the_author(); ?> | Tarih: <?php echo get_the_date(); ?>
                    </div>
                    <div class="text-gray-700 leading-relaxed">
                        <?php the_excerpt(); ?>
                    </div>
                    <a href="<?php the_permalink(); ?>" class="mt-4 inline-block text-blue-600 hover:text-yellow-500 font-semibold">Devamını Oku &rarr;</a>
                </article>
        <?php
                endif;
            endwhile;
            the_posts_pagination(array(
                'prev_text' => __('&laquo; Önceki', 'tesisat-pro'),
                'next_text' => __('Sonraki &raquo;', 'tesisat-pro'),
            ));
        else :
            echo '<p class="col-span-full text-center text-gray-700">Henüz blog yazısı bulunmamaktadır.</p>';
        endif;
        ?>
    </div>
</main>

<?php get_footer(); ?>
