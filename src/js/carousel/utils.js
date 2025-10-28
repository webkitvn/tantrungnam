/**
 * Carousel Utilities
 * 
 * Reusable utility functions for carousel functionality
 */

import { DESKTOP_ITEM_CLASSES, MOBILE_ITEM_CLASSES } from './constants.js';

/**
 * Check if element has multiple conflicting item classes
 * @param {HTMLElement} element - The carousel element
 * @returns {boolean} True if multiple classes are detected
 */
export function hasMultipleItemClasses(element) {
    const desktopCount = DESKTOP_ITEM_CLASSES
        .map(item => item.className)
        .filter(cls => element.classList.contains(cls)).length;
    
    const mobileCount = MOBILE_ITEM_CLASSES
        .map(item => item.className)
        .filter(cls => element.classList.contains(cls)).length;
    
    return desktopCount > 1 || mobileCount > 1;
}

/**
 * Remove conflicting classes (keep only the one with highest priority)
 * @param {HTMLElement} element - The carousel element
 * @param {Array} classList - Array of class configurations
 * @param {string} keepClass - Class to keep
 */
export function removeConflictingClasses(element, classList, keepClass) {
    classList.forEach(item => {
        if (item.className !== keepClass && element.classList.contains(item.className)) {
            element.classList.remove(item.className);
            console.warn(`Carousel: Removed conflicting class "${item.className}". Keeping "${keepClass}".`);
        }
    });
}

/**
 * Find highest priority class from a list
 * @param {HTMLElement} element - The carousel element
 * @param {Array} classList - Array of class configurations
 * @returns {Object|null} The highest priority class config or null
 */
export function findHighestPriorityClass(element, classList) {
    for (const item of classList) {
        if (element.classList.contains(item.className)) {
            return item;
        }
    }
    return null;
}

/**
 * Create a unique ID for carousel instances
 * @param {number} index - The carousel index
 * @returns {string} Unique carousel ID
 */
export function createCarouselId(index) {
    return `carousel-${index + 1}`;
}

/**
 * Validate carousel structure
 * @param {HTMLElement} element - The carousel element
 * @param {number} index - The carousel index
 * @returns {Object|null} Validation result with container and slides or null
 */
export function validateCarouselStructure(element, index) {
    const container = element.querySelector('.kt-row-column-wrap');
    
    if (!container) {
        console.warn(`Carousel ${index + 1}: No .kt-row-column-wrap container found`);
        return null;
    }

    const slides = container.querySelectorAll('.wp-block-kadence-column');
    
    if (slides.length === 0) {
        console.warn(`Carousel ${index + 1}: No .wp-block-kadence-column slides found`);
        return null;
    }

    return { container, slides: Array.from(slides) };
}

/**
 * Check if carousel is already initialized
 * @param {HTMLElement} element - The carousel element
 * @returns {boolean} True if already initialized
 */
export function isCarouselInitialized(element) {
    return element.hasAttribute('data-embla-initialized');
}

/**
 * Create DOM element with classes and attributes
 * @param {string} tagName - HTML tag name
 * @param {string} className - CSS class name
 * @param {Object} attributes - HTML attributes
 * @param {string} innerHTML - Inner HTML content
 * @returns {HTMLElement} Created element
 */
export function createElement(tagName, className = '', attributes = {}, innerHTML = '') {
    const element = document.createElement(tagName);
    
    if (className) {
        element.className = className;
    }
    
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
    
    if (innerHTML) {
        element.innerHTML = innerHTML;
    }
    
    return element;
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
