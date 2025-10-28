/**
 * Event Handler
 * 
 * Manages event handling for carousel interactions
 */

import { SELECTORS, CSS_CLASSES } from './constants.js';

/**
 * Setup event handlers for carousel
 * @param {Object} embla - Embla carousel instance
 * @param {HTMLElement} element - The carousel element
 */
export function setupEventHandlers(embla, element) {
    /* Setup navigation buttons */
    setupNavigationButtons(embla, element);
    
    /* Setup arrow controls */
    setupArrowControls(embla, element);
    
    /* Setup keyboard navigation */
    setupKeyboardNavigation(embla, element);
    
    /* Setup accessibility attributes */
    setupAccessibility(embla, element);
}

/**
 * Setup navigation buttons (data attributes)
 * @param {Object} embla - Embla carousel instance
 * @param {HTMLElement} element - The carousel element
 */
function setupNavigationButtons(embla, element) {
    const prevButton = element.querySelector(SELECTORS.DATA_PREV);
    const nextButton = element.querySelector(SELECTORS.DATA_NEXT);

    if (prevButton) {
        prevButton.addEventListener('click', () => embla.scrollPrev());
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => embla.scrollNext());
    }
}

/**
 * Setup arrow controls (.has-arrows class)
 * @param {Object} embla - Embla carousel instance
 * @param {HTMLElement} element - The carousel element
 */
function setupArrowControls(embla, element) {
    const arrowPrevButton = element.querySelector(SELECTORS.ARROW_PREV);
    const arrowNextButton = element.querySelector(SELECTORS.ARROW_NEXT);

    if (arrowPrevButton) {
        arrowPrevButton.addEventListener('click', () => embla.scrollPrev());
    }

    if (arrowNextButton) {
        arrowNextButton.addEventListener('click', () => embla.scrollNext());
    }

    /* Update arrow button states */
    if (arrowPrevButton || arrowNextButton) {
        const updateArrowStates = () => {
            if (arrowPrevButton) {
                arrowPrevButton.disabled = !embla.canScrollPrev();
            }
            if (arrowNextButton) {
                arrowNextButton.disabled = !embla.canScrollNext();
            }
        };

        embla.on('select', updateArrowStates);
        embla.on('init', updateArrowStates);
        embla.on('reInit', updateArrowStates);
    }
}

/**
 * Setup keyboard navigation
 * @param {Object} embla - Embla carousel instance
 * @param {HTMLElement} element - The carousel element
 */
function setupKeyboardNavigation(embla, element) {
    element.addEventListener('keydown', (e) => {
        if (e.target.closest(`.${CSS_CLASSES.EMBLA_SLIDE}`)) {
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
}

/**
 * Setup accessibility attributes
 * @param {Object} embla - Embla carousel instance
 * @param {HTMLElement} element - The carousel element
 */
function setupAccessibility(embla, element) {
    embla.on('select', () => {
        const slides = element.querySelectorAll(`.${CSS_CLASSES.EMBLA_SLIDE}`);
        slides.forEach((slide, index) => {
            const isSelected = index === embla.selectedScrollSnap();
            slide.setAttribute('aria-hidden', !isSelected);
            slide.setAttribute('tabindex', isSelected ? '0' : '-1');
        });
    });
}
