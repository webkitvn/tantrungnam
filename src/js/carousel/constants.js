/**
 * Carousel Constants
 * 
 * Centralized configuration and constants for the carousel system
 */

/* Default carousel options */
export const DEFAULT_OPTIONS = {
    loop: false,
    draggable: true,
    align: 'start',
    duration: 10,
};

/* Base plugins configuration */
export const BASE_PLUGINS = [
    {
        name: 'ClassNames',
        config: {
            selected: 'is-selected',
            dragging: 'is-dragging'
        }
    }
];

/* Items per slide class configurations */
export const DESKTOP_ITEM_CLASSES = [
    { className: 'carousel-4-items', value: 4 },
    { className: 'carousel-3-items', value: 3 },
    { className: 'carousel-2-items', value: 2 }
];

export const MOBILE_ITEM_CLASSES = [
    { className: 'carousel-sm-4-items', value: 4 },
    { className: 'carousel-sm-3-items', value: 3 },
    { className: 'carousel-sm-2-items', value: 2 }
];

/* Selectors */
export const SELECTORS = {
    CAROUSEL: '.block-carousel',
    CONTAINER: '.kt-row-column-wrap',
    SLIDE: '.wp-block-kadence-column',
    ARROW_PREV: '.embla__button--prev',
    ARROW_NEXT: '.embla__button--next',
    DATA_PREV: '[data-carousel-prev]',
    DATA_NEXT: '[data-carousel-next]'
};

/* CSS classes */
export const CSS_CLASSES = {
    AUTO_PLAY: 'auto-play',
    LOOP: 'loop',
    NO_LOOP: 'no-loop',
    HAVE_ARROWS: 'has-arrows',
    EMBLA: 'embla',
    EMBLA_VIEWPORT: 'embla__viewport',
    EMBLA_CONTAINER: 'embla__container',
    EMBLA_SLIDE: 'embla__slide',
    EMBLA_BUTTONS: 'embla__buttons',
    EMBLA_BUTTON: 'embla__button',
    EMBLA_BUTTON_PREV: 'embla__button--prev',
    EMBLA_BUTTON_NEXT: 'embla__button--next',
    EMBLA_BUTTON_SVG: 'embla__button__svg'
};

/* Data attributes */
export const DATA_ATTRIBUTES = {
    INITIALIZED: 'data-embla-initialized',
    CAROUSEL: 'data-embla-carousel',
    ITEMS_DESKTOP: 'data-items-desktop',
    ITEMS_MOBILE: 'data-items-mobile',
    CAROUSEL_LOOP: 'data-carousel-loop',
    CAROUSEL_DRAGGABLE: 'data-carousel-draggable',
    CAROUSEL_ALIGN: 'data-carousel-align',
    CAROUSEL_AUTOPLAY: 'data-carousel-autoplay',
    GAP: 'data-gap'
};

/* Default values */
export const DEFAULTS = {
    AUTOPLAY_DELAY: 4000,
    SLIDE_SPACING: '1rem',
    SLIDE_SPACING_MOBILE: '0.5rem',
    ITEMS_PER_SLIDE: 1
};
