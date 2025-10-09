<?php
/**
 * Optimize editor styles and scripts - only load in block editor
 */
function cwp_editor_block_styles()
{
    // Only load in block editor context
    if (!is_admin() || !function_exists('get_current_screen')) {
        return;
    }
    
    $screen = get_current_screen();
    if (!$screen || $screen->base !== 'post') {
        return;
    }

    wp_enqueue_style(
        'cwp-editor-block-style',
        get_stylesheet_directory_uri() . '/assets/css/main.css',
        array(),
        THEME_VERSION
    );
}
add_action('enqueue_block_editor_assets', 'cwp_editor_block_styles');

function cwp_acf_init_block_types()
{
    if (function_exists('acf_register_block_type')) {
        // Common supports array for all blocks
        $common_supports = array(
            'align' => true,
            'mode' => true,
            'jsx' => true,
            'anchor' => true,
            'spacing' => array(
                'margin' => true,
                'padding' => true,
                'blockGap' => true,
            ),
        );

    }
    $blocks = array(
        array(
            'name' => 'circles',
            'title' => 'Circles',
            'description' => 'A custom circles block.',
            'render_template' => 'blocks/block-circles.php',
            'category' => 'custom',
            'icon' => 'admin-generic',
            'keywords' => array('circles', 'grid'),
        ),
    );

    foreach ($blocks as $block) {
        acf_register_block_type(array_merge($block, array('supports' => $common_supports)));
    }
}
add_action('acf/init', 'cwp_acf_init_block_types');