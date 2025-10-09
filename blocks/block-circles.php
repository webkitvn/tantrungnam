<?php
/**
 * Block Name: Circles
 * Description: A block that displays a grid of circles.
 * Category: custom
 * Icon: admin-generic
 * Keywords: circles, grid
 */
?>
<div class="circles-block lg:relative min-h-[600px] flex flex-wrapmai justify-center lg:justify-between items-center lg:items-start">
    <?php if(get_field('block_1_text')): ?>
    <div class="circle circle-1 w-[350px] h-[350px] relative lg:absolute lg:top-0 lg:left-0">
        <img class="animate-[spin_10s_linear_infinite] origin-center relative z-0"
            src="<?php echo IMG ?>/circle-amber.svg" alt="circle" loading="lazy">
        <div
            class="content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center w-full h-full rounded-full p-[15%] z-50">
            <div class="inner">
                <p class="text-center text-white m-0 text-base"><?php echo esc_html(get_field('block_1_text')); ?></p>
            </div>
        </div>
        <?php endif; ?>
    </div>
    <?php if(get_field('block_2_text')): ?>
    <div class="circle circle-2 w-[350px] h-[350px] relative lg:absolute lg:top-[10%] lg:right-[100px]">
        <img class="animate-[spin_10s_linear_infinite] origin-center relative z-0"
            src="<?php echo IMG ?>/circle-amber.svg" alt="circle" loading="lazy">
        <div class="content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center w-full h-full rounded-full p-[15%] z-50">
            <div class="inner">
                <p class="text-center text-white m-0 text-base"><?php echo esc_html(get_field('block_2_text')); ?></p>
            </div>
        </div>
    </div>
    <?php endif; ?>
    <?php if(get_field('block_3_text')): ?>
    <div class="circle circle-3 w-[350px] h-[350px] relative lg:absolute lg:top-[200px] lg:left-[380px]">
        <img class="animate-[spin_10s_linear_infinite] origin-center relative z-0"
            src="<?php echo IMG ?>/circle-amber.svg" alt="circle" loading="lazy">
        <div class="content absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-center w-full h-full rounded-full p-[15%] z-50">
            <div class="inner">
                <p class="text-center text-white m-0 text-base"><?php echo esc_html(get_field('block_3_text')); ?></p>
            </div>
        </div>
    </div>
    <?php endif; ?>
</div>