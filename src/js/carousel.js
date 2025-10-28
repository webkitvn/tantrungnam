/**
 * Embla Carousel ES Module
 * 
 * Automatically initializes Embla Carousel for elements with .block-carousel class.
 * Detects .kt-row-column-wrap containers and treats .wp-block-kadence-column children as slides.
 * 
 * Features:
 * - CSS class activation: .auto-play, .loop, .no-loop
 * - Data attribute customization: data-carousel-* attributes
 * - Automatic initialization on DOM ready
 * - Responsive and accessible
 * 
 * @author TTN Theme
 * @version 1.1.0
 */

import EmblaCarousel from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import ClassNames from 'embla-carousel-class-names';

/**
 * Carousel Manager Class
 * Handles initialization, configuration, and cleanup of Embla Carousel instances
 */
class CarouselManager {
    constructor() {
        this.instances = new Map();
        this.defaultOptions = {
            loop: true,
            draggable: true,
            align: 'start',
            skipSnaps: false,
            containScroll: 'trimSnaps',
            dragFree: false,
            slidesToScroll: 1,
            inViewThreshold: 0.7
        };
        
        /* Base plugins that are always included */
        this.basePlugins = [
            ClassNames({
                selected: 'is-selected',
                dragging: 'is-dragging'
            })
        ];
    }

    /**
     * Detection Logic
     * 
     * Searches for elements with .block-carousel class and:
     * 1. Locates descendant .kt-row-column-wrap container
     * 2. Treats each .wp-block-kadence-column child as a slide
     * 3. Creates carousel container structure if needed
     */
    detectCarousels() {
        const carouselElements = document.querySelectorAll('.block-carousel');
        const detectedCarousels = [];

        carouselElements.forEach((element, index) => {
            /* Find the container with columns */
            const container = element.querySelector('.kt-row-column-wrap');
            
            if (!container) {
                console.warn(`Carousel ${index + 1}: No .kt-row-column-wrap container found`);
                return;
            }

            /* Get all column elements that will become slides */
            const slides = container.querySelectorAll('.wp-block-kadence-column');
            
            if (slides.length === 0) {
                console.warn(`Carousel ${index + 1}: No .wp-block-kadence-column slides found`);
                return;
            }

            /* Skip if already initialized */
            if (element.hasAttribute('data-embla-initialized')) {
                return;
            }

            detectedCarousels.push({
                element,
                container,
                slides: Array.from(slides),
                id: `carousel-${index + 1}`
            });
        });

        return detectedCarousels;
    }

    /**
     * Setup Carousel Structure
     * 
     * Creates the required Embla Carousel DOM structure:
     * - .embla container
     * - .embla__viewport
     * - .embla__container
     * - Individual slide wrappers
     */
    setupCarouselStructure(carouselData) {
        const { element, container, slides } = carouselData;

        /* Create Embla structure */
        const emblaContainer = document.createElement('div');
        emblaContainer.className = 'embla';
        emblaContainer.setAttribute('data-embla-carousel', '');

        const viewport = document.createElement('div');
        viewport.className = 'embla__viewport';

        const emblaContainerInner = document.createElement('div');
        emblaContainerInner.className = 'embla__container';

        /* Wrap each slide in embla__slide */
        slides.forEach((slide) => {
            const slideWrapper = document.createElement('div');
            slideWrapper.className = 'embla__slide';
            slideWrapper.appendChild(slide.cloneNode(true));
            emblaContainerInner.appendChild(slideWrapper);
        });

        /* Hide original container and append new structure */
        container.style.display = 'none';
        viewport.appendChild(emblaContainerInner);
        emblaContainer.appendChild(viewport);
        element.appendChild(emblaContainer);

        return {
            emblaContainer,
            viewport,
            container: emblaContainerInner
        };
    }

    /**
     * Initialize Single Carousel
     * 
     * Sets up a single carousel instance with plugins and event handlers
     */
    initializeCarousel(carouselData) {
        try {
            const structure = this.setupCarouselStructure(carouselData);
            const { emblaContainer, viewport } = structure;

            /* Merge default options with any custom options from data attributes */
            const customOptions = this.parseCustomOptions(carouselData.element);
            const options = { ...this.defaultOptions, ...customOptions };

            /* Parse items per slide configuration */
            const itemsPerSlide = this.parseItemsPerSlide(carouselData.element);
            
            /* Apply responsive CSS classes based on items per slide */
            this.applyItemsPerSlideClasses(carouselData.element, itemsPerSlide);

            /* Create plugins for this specific carousel */
            const plugins = this.createPluginsForCarousel(carouselData.element);

            /* Initialize Embla Carousel */
            const embla = EmblaCarousel(viewport, options, plugins);

            /* Store instance for cleanup */
            this.instances.set(carouselData.id, {
                embla,
                element: carouselData.element,
                structure
            });

            /* Add initialization marker */
            carouselData.element.setAttribute('data-embla-initialized', 'true');

            /* Setup event handlers */
            this.setupEventHandlers(embla, carouselData.element);

            console.log(`Carousel ${carouselData.id} initialized successfully`);

            return embla;

        } catch (error) {
            console.error(`Failed to initialize carousel ${carouselData.id}:`, error);
            return null;
        }
    }

    /**
     * Create Plugins Array for Specific Carousel
     * 
     * Dynamically creates plugins based on element classes and data attributes
     */
    createPluginsForCarousel(element) {
        const plugins = [...this.basePlugins];
        const dataset = element.dataset;
        
        /* Check for autoplay activation */
        let autoplayDelay = 4000; /* Default delay */
        let enableAutoplay = false;
        
        /* Check CSS class first */
        if (element.classList.contains('auto-play')) {
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
     * Parse Items Per Slide from CSS Classes
     * 
     * Checks for classes that control how many items are displayed per slide:
     * - .carousel-2-items, .carousel-3-items, .carousel-4-items (desktop)
     * - .carousel-sm-2-items, .carousel-sm-3-items, .carousel-sm-4-items (mobile)
     * - Defaults to 1 item per slide if no classes are found
     */
    parseItemsPerSlide(element) {
        const itemsPerSlide = {
            desktop: 1,
            mobile: 1
        };

        /* Check for desktop items per slide classes */
        if (element.classList.contains('carousel-2-items')) {
            itemsPerSlide.desktop = 2;
        } else if (element.classList.contains('carousel-3-items')) {
            itemsPerSlide.desktop = 3;
        } else if (element.classList.contains('carousel-4-items')) {
            itemsPerSlide.desktop = 4;
        }

        /* Check for mobile items per slide classes */
        if (element.classList.contains('carousel-sm-2-items')) {
            itemsPerSlide.mobile = 2;
        } else if (element.classList.contains('carousel-sm-3-items')) {
            itemsPerSlide.mobile = 3;
        } else if (element.classList.contains('carousel-sm-4-items')) {
            itemsPerSlide.mobile = 4;
        }

        return itemsPerSlide;
    }

    /**
     * Apply CSS Classes for Items Per Slide Configuration
     * 
     * Adds responsive CSS classes to the carousel element and slides
     * to control how many items are displayed per slide
     */
    applyItemsPerSlideClasses(element, itemsPerSlide) {
        const { desktop, mobile } = itemsPerSlide;
        
        /* Add data attributes for CSS targeting */
        element.setAttribute('data-items-desktop', desktop);
        element.setAttribute('data-items-mobile', mobile);
        
        /* Add CSS classes for responsive behavior */
        element.classList.add(`carousel-items-${desktop}`);
        element.classList.add(`carousel-items-sm-${mobile}`);
        
        /* Apply CSS custom properties for dynamic styling */
        element.style.setProperty('--carousel-items-desktop', desktop);
        element.style.setProperty('--carousel-items-mobile', mobile);
        
        /* Add responsive classes to slides */
        const slides = element.querySelectorAll('.embla__slide');
        slides.forEach(slide => {
            slide.classList.add(`slide-items-${desktop}`);
            slide.classList.add(`slide-items-sm-${mobile}`);
        });
    }

    /**
     * Parse Custom Options from Data Attributes and CSS Classes
     * 
     * Allows customization via:
     * - Data attributes: data-carousel-loop="false", data-carousel-draggable="false", etc.
     * - CSS classes: .auto-play, .loop on .block-carousel element
     */
    parseCustomOptions(element) {
        const options = {};
        const dataset = element.dataset;

        /* Check for CSS classes first (higher priority) */
        if (element.classList.contains('loop')) {
            options.loop = true;
        } else if (element.classList.contains('no-loop')) {
            options.loop = false;
        }

        /* Parse data attributes (lower priority, can override classes) */
        if (dataset.carouselLoop !== undefined) {
            options.loop = dataset.carouselLoop === 'true';
        }

        if (dataset.carouselDraggable !== undefined) {
            options.draggable = dataset.carouselDraggable === 'true';
        }

        /* Parse string options */
        if (dataset.carouselAlign) {
            options.align = dataset.carouselAlign;
        }

        return options;
    }

    /**
     * Setup Event Handlers
     * 
     * Adds common event handlers for carousel functionality
     */
    setupEventHandlers(embla, element) {
        /* Add navigation buttons if they exist */
        const prevButton = element.querySelector('[data-carousel-prev]');
        const nextButton = element.querySelector('[data-carousel-next]');

        if (prevButton) {
            prevButton.addEventListener('click', () => embla.scrollPrev());
        }

        if (nextButton) {
            nextButton.addEventListener('click', () => embla.scrollNext());
        }

        /* Add keyboard navigation */
        element.addEventListener('keydown', (e) => {
            if (e.target.closest('.embla__slide')) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        embla.scrollPrev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        embla.scrollNext();
                        break;
                }
            }
        });

        /* Add accessibility attributes */
        embla.on('select', () => {
            const slides = element.querySelectorAll('.embla__slide');
            slides.forEach((slide, index) => {
                const isSelected = index === embla.selectedScrollSnap();
                slide.setAttribute('aria-hidden', !isSelected);
                slide.setAttribute('tabindex', isSelected ? '0' : '-1');
            });
        });
    }

    /**
     * Initialize All Carousels
     * 
     * Main initialization function that detects and sets up all carousels on the page
     */
    init() {
        console.log('Initializing Embla Carousels...');

        const carousels = this.detectCarousels();
        
        if (carousels.length === 0) {
            console.log('No carousels found on the page');
            return;
        }

        console.log(`Found ${carousels.length} carousel(s) to initialize`);

        carousels.forEach(carouselData => {
            this.initializeCarousel(carouselData);
        });

        console.log('All carousels initialized successfully');
    }

    /**
     * Destroy All Carousels
     * 
     * Cleanup method that removes all carousel instances and restores original DOM
     */
    destroy() {
        console.log('Destroying all carousel instances...');

        this.instances.forEach((instance, id) => {
            try {
                /* Destroy Embla instance */
                instance.embla.destroy();

                /* Restore original container */
                const originalContainer = instance.element.querySelector('.kt-row-column-wrap');
                if (originalContainer) {
                    originalContainer.style.display = '';
                }

                /* Remove Embla structure */
                const emblaContainer = instance.element.querySelector('.embla');
                if (emblaContainer) {
                    emblaContainer.remove();
                }

                /* Remove initialization marker */
                instance.element.removeAttribute('data-embla-initialized');

                console.log(`Carousel ${id} destroyed successfully`);

            } catch (error) {
                console.error(`Error destroying carousel ${id}:`, error);
            }
        });

        this.instances.clear();
        console.log('All carousels destroyed');
    }

    /**
     * Get Carousel Instance
     * 
     * Returns a specific carousel instance by ID
     */
    getInstance(id) {
        return this.instances.get(id);
    }

    /**
     * Get All Instances
     * 
     * Returns all carousel instances
     */
    getAllInstances() {
        return this.instances;
    }
}

/* Create global instance */
const carouselManager = new CarouselManager();

/* Auto-initialize on DOM ready */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => carouselManager.init());
} else {
    carouselManager.init();
}

/* Export for manual usage */
export const init = () => carouselManager.init();
export const destroy = () => carouselManager.destroy();
export const getInstance = (id) => carouselManager.getInstance(id);
export const getAllInstances = () => carouselManager.getAllInstances();

/* Default export */
export default carouselManager;
