/**
 * DOM Manager
 * 
 * Handles DOM manipulation and structure creation for carousels
 */

import { CSS_CLASSES, DATA_ATTRIBUTES } from './constants.js';
import { createElement } from './utils.js';

/**
 * Create Embla Carousel DOM structure
 * @param {Object} carouselData - Carousel data object
 * @returns {Object} Structure object with DOM elements
 */
export function createCarouselStructure(carouselData) {
    const { element, container, slides } = carouselData;

    /* Create main Embla container */
    const emblaContainer = createElement('div', CSS_CLASSES.EMBLA, {
        [DATA_ATTRIBUTES.CAROUSEL]: ''
    });

    /* Create viewport */
    const viewport = createElement('div', CSS_CLASSES.EMBLA_VIEWPORT);

    /* Create inner container */
    const emblaContainerInner = createElement('div', CSS_CLASSES.EMBLA_CONTAINER);

    /* Wrap each slide */
    slides.forEach((slide) => {
        const slideWrapper = createElement('div', CSS_CLASSES.EMBLA_SLIDE);
        slideWrapper.appendChild(slide.cloneNode(true));
        emblaContainerInner.appendChild(slideWrapper);
    });

    /* Assemble structure */
    container.style.display = 'none';
    viewport.appendChild(emblaContainerInner);
    emblaContainer.appendChild(viewport);
    
    /* Add arrow controls if needed */
    if (element.classList.contains(CSS_CLASSES.HAVE_ARROWS)) {
        const arrowControls = createArrowControls();
        emblaContainer.appendChild(arrowControls);
    }
    
    element.appendChild(emblaContainer);

    return {
        emblaContainer,
        viewport,
        container: emblaContainerInner
    };
}

/**
 * Create arrow navigation controls
 * @returns {HTMLElement} Arrow controls container
 */
export function createArrowControls() {
    const buttonsContainer = createElement('div', CSS_CLASSES.EMBLA_BUTTONS);
    
    /* Previous button */
    const prevButton = createElement('button', `${CSS_CLASSES.EMBLA_BUTTON} ${CSS_CLASSES.EMBLA_BUTTON_PREV}`, {
        type: 'button',
        'aria-label': 'Previous slide'
    }, createArrowSVG());
    
    /* Next button */
    const nextButton = createElement('button', `${CSS_CLASSES.EMBLA_BUTTON} ${CSS_CLASSES.EMBLA_BUTTON_NEXT}`, {
        type: 'button',
        'aria-label': 'Next slide'
    }, createArrowSVG(true));
    
    buttonsContainer.appendChild(prevButton);
    buttonsContainer.appendChild(nextButton);
    
    return buttonsContainer;
}

/**
 * Create arrow SVG icon
 * @param {boolean} isNext - Whether this is a next arrow
 * @returns {string} SVG HTML string
 */
function createArrowSVG(isNext = false) {
    const pathData = isNext 
        ? "M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
        : "M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z";
    
    return `<svg class="${CSS_CLASSES.EMBLA_BUTTON_SVG}" viewBox="0 0 532 532">
        <path fill="currentColor" d="${pathData}"></path>
    </svg>`;
}

/**
 * Apply CSS classes for items per slide configuration
 * @param {HTMLElement} element - The carousel element
 * @param {Object} itemsPerSlide - Items per slide configuration
 */
export function applyItemsPerSlideClasses(element, itemsPerSlide) {
    const { desktop, mobile } = itemsPerSlide;
    
    /* Add data attributes for CSS targeting */
    element.setAttribute(DATA_ATTRIBUTES.ITEMS_DESKTOP, desktop);
    element.setAttribute(DATA_ATTRIBUTES.ITEMS_MOBILE, mobile);
    
    /* Add CSS classes for responsive behavior */
    element.classList.add(`carousel-items-${desktop}`);
    element.classList.add(`carousel-items-sm-${mobile}`);
    
    /* Apply CSS custom properties for dynamic styling */
    element.style.setProperty('--carousel-items-desktop', desktop);
    element.style.setProperty('--carousel-items-mobile', mobile);
    
    /* Add responsive classes to slides */
    const slides = element.querySelectorAll(`.${CSS_CLASSES.EMBLA_SLIDE}`);
    slides.forEach(slide => {
        slide.classList.add(`slide-items-${desktop}`);
        slide.classList.add(`slide-items-sm-${mobile}`);
    });
}
