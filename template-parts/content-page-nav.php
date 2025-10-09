<div class="page-left fixed left-0 top-[var(--header-height)] h-full bg-primary-50 flex items-center flex flex-col z-50 gap-16">
    <ul class="page-nav"></ul>
    <span class="title flex text-primary-400 text-lg font-semibold bg-primary-50 justify-center items-center rounded-full border border-primary-600 px-4 py-1 tracking-wider">
        <?php if(is_singular()){
            the_title();
        } ?>
    </span>
    <button class="scroll-down text-center bg-primary-50 relative z-10">
        <img class="w-10 h-10 block mx-auto" src="<?php echo IMG ?>/scroll-down.svg" alt="Scroll down">
        <span class="block text-justify text-primary-400 w-3/4 mx-auto leading-[1.2]"><?php _e("Cuộn xuống", "mytheme") ?></span>
    </button>
</div>