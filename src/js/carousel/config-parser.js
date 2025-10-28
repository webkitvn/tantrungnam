/**
 * Configuration Parser
 * 
 * Handles parsing of carousel configuration from CSS classes and data attributes
 */

import Autoplay from 'embla-carousel-autoplay';
import ClassNames from 'embla-carousel-class-names';

import { 
    DEFAULT_OPTIONS, 
    BASE_PLUGINS, 
    DESKTOP_ITEM_CLASSES, 
    MOBILE_ITEM_CLASSES,
    DEFAULTS,
    CSS_CLASSES,
    DATA_ATTRIBUTES
} from './constants.js';

import { 
    hasMultipleItemClasses, 
    removeConflictingClasses, 
    findHighestPriorityClass 
} from './utils.js';

/**
 * Parse items per slide configuration from CSS classes
 * @param {HTMLElement} element - The carousel element
 * @returns {Object} Items per slide configuration
 */
export function parseItemsPerSlide(element) {
    const itemsPerSlide = {
        desktop: DEFAULTS.ITEMS_PER_SLIDE,
        mobile: DEFAULTS.ITEMS_PER_SLIDE
    };

    /* Parse desktop classes with priority */
    const desktopClass = findHighestPriorityClass(element, DESKTOP_ITEM_CLASSES);
    if (desktopClass) {
        itemsPerSlide.desktop = desktopClass.value;
        removeConflictingClasses(element, DESKTOP_ITEM_CLASSES, desktopClass.className);
    }

    /* Parse mobile classes with priority */
    const mobileClass = findHighestPriorityClass(element, MOBILE_ITEM_CLASSES);
    if (mobileClass) {
        itemsPerSlide.mobile = mobileClass.value;
        removeConflictingClasses(element, MOBILE_ITEM_CLASSES, mobileClass.className);
    }

    /* Log warning if multiple classes were found */
    if (hasMultipleItemClasses(element)) {
        console.warn(
            `Carousel: Multiple items-per-slide classes detected. Using priority: ${itemsPerSlide.desktop} items (desktop), ${itemsPerSlide.mobile} items (mobile).`,
            element
        );
    }

    return itemsPerSlide;
}

/**
 * Parse custom options from data attributes and CSS classes
 * @param {HTMLElement} element - The carousel element
 * @returns {Object} Parsed options
 */
export function parseCustomOptions(element) {
    const options = {};
    const dataset = element.dataset;

    /* Check for CSS classes first (higher priority) */
    if (element.classList.contains(CSS_CLASSES.LOOP)) {
        options.loop = true;
    } else if (element.classList.contains(CSS_CLASSES.NO_LOOP)) {
        options.loop = false;
    }

    /* Parse data attributes (lower priority, can override classes) */
    if (dataset.carouselLoop !== undefined) {
        options.loop = dataset.carouselLoop === 'true';
    }

    if (dataset.carouselDraggable !== undefined) {
        options.draggable = dataset.carouselDraggable === 'true';
    }

    if (dataset.carouselAlign) {
        options.align = dataset.carouselAlign;
    }

    return options;
}

/**
 * Create plugins array for specific carousel
 * @param {HTMLElement} element - The carousel element
 * @returns {Array} Array of Embla plugins
 */
export function createPluginsForCarousel(element) {
    const plugins = [
        ClassNames(BASE_PLUGINS[0].config)
    ];
    
    const dataset = element.dataset;
    
    /* Check for autoplay activation */
    let autoplayDelay = DEFAULTS.AUTOPLAY_DELAY;
    let enableAutoplay = false;
    
    /* Check CSS class first */
    if (element.classList.contains(CSS_CLASSES.AUTO_PLAY)) {
        enableAutoplay = true;
    }
    
    /* Check data attribute (can override class) */
    if (dataset.carouselAutoplay) {
        const delay = parseInt(dataset.carouselAutoplay, 10);
        if (!isNaN(delay) && delay > 0) {
            enableAutoplay = true;
            autoplayDelay = delay;
        }
    }
    
    /* Add autoplay plugin if enabled */
    if (enableAutoplay) {
        plugins.push(Autoplay({ 
            delay: autoplayDelay, 
            stopOnInteraction: false 
        }));
    }
    
    return plugins;
}

/**
 * Merge default options with custom options
 * @param {HTMLElement} element - The carousel element
 * @returns {Object} Merged options
 */
export function getCarouselOptions(element) {
    const customOptions = parseCustomOptions(element);
    return { ...DEFAULT_OPTIONS, ...customOptions };
}
