/**
 * Carousel Manager
 * 
 * Main carousel management class with simplified, focused responsibilities
 */

import EmblaCarousel from 'embla-carousel';

import { SELECTORS, DATA_ATTRIBUTES } from './constants.js';
import { 
    validateCarouselStructure, 
    isCarouselInitialized, 
    createCarouselId 
} from './utils.js';
import { createCarouselStructure, applyItemsPerSlideClasses } from './dom-manager.js';
import { 
    parseItemsPerSlide, 
    getCarouselOptions, 
    createPluginsForCarousel 
} from './config-parser.js';
import { setupEventHandlers } from './event-handler.js';

/**
 * Carousel Manager Class
 * Handles initialization, configuration, and cleanup of Embla Carousel instances
 */
export class CarouselManager {
    constructor() {
        this.instances = new Map();
    }

    /**
     * Detect all carousels on the page
     * @returns {Array} Array of detected carousel data
     */
    detectCarousels() {
        const carouselElements = document.querySelectorAll(SELECTORS.CAROUSEL);
        const detectedCarousels = [];

        carouselElements.forEach((element, index) => {
            /* Skip if already initialized */
            if (isCarouselInitialized(element)) {
                return;
            }

            /* Validate structure */
            const validation = validateCarouselStructure(element, index);
            if (!validation) {
                return;
            }

            detectedCarousels.push({
                element,
                container: validation.container,
                slides: validation.slides,
                id: createCarouselId(index)
            });
        });

        return detectedCarousels;
    }

    /**
     * Initialize a single carousel
     * @param {Object} carouselData - Carousel data object
     * @returns {Object|null} Embla instance or null if failed
     */
    initializeCarousel(carouselData) {
        try {
            /* Create DOM structure */
            const structure = createCarouselStructure(carouselData);
            const { emblaContainer, viewport } = structure;

            /* Parse configuration */
            const itemsPerSlide = parseItemsPerSlide(carouselData.element);
            const options = getCarouselOptions(carouselData.element);
            const plugins = createPluginsForCarousel(carouselData.element);

            /* Apply CSS classes */
            applyItemsPerSlideClasses(carouselData.element, itemsPerSlide);

            /* Initialize Embla Carousel */
            const embla = EmblaCarousel(viewport, options, plugins);

            /* Store instance */
            this.instances.set(carouselData.id, {
                embla,
                element: carouselData.element,
                structure
            });

            /* Mark as initialized */
            carouselData.element.setAttribute(DATA_ATTRIBUTES.INITIALIZED, 'true');

            /* Setup event handlers */
            setupEventHandlers(embla, carouselData.element);

            console.log(`Carousel ${carouselData.id} initialized successfully`);
            return embla;

        } catch (error) {
            console.error(`Failed to initialize carousel ${carouselData.id}:`, error);
            return null;
        }
    }

    /**
     * Initialize all carousels on the page
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
     * Destroy all carousel instances
     */
    destroy() {
        console.log('Destroying all carousel instances...');

        this.instances.forEach((instance, id) => {
            try {
                /* Destroy Embla instance */
                instance.embla.destroy();

                /* Restore original container */
                const originalContainer = instance.element.querySelector(SELECTORS.CONTAINER);
                if (originalContainer) {
                    originalContainer.style.display = '';
                }

                /* Remove Embla structure */
                const emblaContainer = instance.element.querySelector('.embla');
                if (emblaContainer) {
                    emblaContainer.remove();
                }

                /* Remove initialization marker */
                instance.element.removeAttribute(DATA_ATTRIBUTES.INITIALIZED);

                console.log(`Carousel ${id} destroyed successfully`);

            } catch (error) {
                console.error(`Error destroying carousel ${id}:`, error);
            }
        });

        this.instances.clear();
        console.log('All carousels destroyed');
    }

    /**
     * Get specific carousel instance
     * @param {string} id - Carousel ID
     * @returns {Object|undefined} Carousel instance
     */
    getInstance(id) {
        return this.instances.get(id);
    }

    /**
     * Get all carousel instances
     * @returns {Map} All instances
     */
    getAllInstances() {
        return this.instances;
    }
}
