<?php
/**
 * Block Name: Circles
 * Description: A block that displays a grid of circles.
 * Category: custom
 * Icon: admin-generic
 * Keywords: circles, grid
 */
?>
<div class="circles-block lg:relative flex flex-wrap justify-center items-center gap-4 lg:gap-4">
    <?php 
        $i = 1;
        while(have_rows('circles')): the_row();
    ?>
    <div class="circle circle-<?php echo $i; ?> w-full max-w-[80%] md:w-[28%] 2xl:w-[350px] 2xl:h-[350px] aspect-square relative">
        <img class="animate-[spin_10s_linear_infinite] origin-center relative z-0"
            src="<?php echo IMG ?>/circle-amber.svg" alt="circle" loading="lazy">
        <div class="content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center w-full h-full rounded-full p-[16%] z-50">
            <div class="inner">
                <?php if(get_sub_field('title')): ?>
                    <h3 class="text-center !text-white m-0 !text-xl font-semibold"><?php echo esc_html(get_sub_field('title')); ?></h3>
                <?php endif; ?>
                <?php if(get_sub_field('content')): ?>
                    <p class="text-center !text-white m-0 text-xs lg:text-base"><?php echo esc_html(get_sub_field('content')); ?></p>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php $i++; ?>
    <?php endwhile; ?>
</div>