<?php
    

    define('IMG', get_stylesheet_directory_uri() . '/assets/images');
    define( 'THEME_VERSION', wp_get_theme()->get( 'Version' ) );


    require_once get_stylesheet_directory() . '/inc/blocks.php';
    
    add_filter('upload_mimes', 'cwp_allow_svg_types');
    function cwp_allow_svg_types($mimes) {
        $mimes['svg'] = 'image/svg+xml';
        return $mimes;
    }

    function cwp_enqueue_scripts() {
        
        /* Enqueue Google Font - Be Vietnam Pro */
        wp_enqueue_style(
            'google-fonts-be-vietnam-pro',
            'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
            array(),
            null
        );
        
        wp_enqueue_style('main', get_stylesheet_directory_uri() . '/assets/css/main.css');
        /* Waypoints requires jQuery, so jQuery is loaded as dependency */
        wp_enqueue_script( 'waypoint', 'https://cdnjs.cloudflare.com/ajax/libs/waypoints/4.0.1/jquery.waypoints.min.js', array('jquery'), '4.0.1', true );
        /* Main script now uses vanilla JS but depends on Waypoints */
        wp_enqueue_script('main', get_stylesheet_directory_uri() . '/assets/js/main.js', array('waypoint'), THEME_VERSION, true);
        /* Embla Carousel - ES module for carousel functionality */
        wp_enqueue_script('carousel', get_stylesheet_directory_uri() . '/assets/js/carousel.js', array(), THEME_VERSION, true);
        /* Add type="module" attribute to carousel script */
        add_filter('script_loader_tag', 'cwp_add_module_type_to_carousel', 10, 3);
    }
    add_action('wp_enqueue_scripts', 'cwp_enqueue_scripts', 9999);

    /* Add preconnect for Google Fonts */
    function cwp_add_google_fonts_preconnect( $urls, $relation_type ) {
        if ( 'preconnect' === $relation_type ) {
            $urls[] = array(
                'href' => 'https://fonts.googleapis.com',
                'crossorigin' => false,
            );
            $urls[] = array(
                'href' => 'https://fonts.gstatic.com',
                'crossorigin' => true,
            );
        }
        return $urls;
    }
    add_filter( 'wp_resource_hints', 'cwp_add_google_fonts_preconnect', 10, 2 );


    function cwp_load_page_nav() {
        get_template_part('template-parts/content-page-nav');
    }
    add_action('kadence_before_content', 'cwp_load_page_nav', 10);


    function cwp_download_btn_shortcode($atts) {
        /* Extract shortcode attributes with defaults */
        $atts = shortcode_atts(
            array(
                'url' => '',
                'text' => 'Tải profile',
            ),
            $atts,
            'download_btn'
        );

        /* Validate URL parameter */
        if (empty($atts['url'])) {
            return '';
        }

        /* Sanitize URL and text */
        $url = esc_url($atts['url']);
        $text = esc_html($atts['text']);

        /* Return empty if URL is invalid */
        if (empty($url)) {
            return '';
        }

        /* Build HTML output */
        $output = sprintf(
            '<a class="download-btn w-fit flex wp-block-kadence-singlebtn" href="%s" target="_blank" rel="noreferrer noopener">
                <span class="kt-btn-inner-text">%s</span>
                <span class="">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <polyline points="8 17 12 21 16 17"></polyline>
                        <line x1="12" y1="12" x2="12" y2="21"></line>
                        <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path>
                    </svg>
                </span>
            </a>',
            $url,
            $text
        );

        return $output;
    }
    add_shortcode('download_btn', 'cwp_download_btn_shortcode');

    /* Add type="module" attribute to carousel script for ES module support */
    function cwp_add_module_type_to_carousel($tag, $handle, $src) {
        if ('carousel' === $handle) {
            $tag = '<script type="module" src="' . esc_url($src) . '" id="' . $handle . '-js"></script>';
        }
        return $tag;
    }
