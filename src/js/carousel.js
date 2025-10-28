/**
 * Embla Carousel ES Module
 * 
 * Automatically initializes Embla Carousel for elements with .block-carousel class.
 * Detects .kt-row-column-wrap containers and treats .wp-block-kadence-column children as slides.
 * 
 * Features:
 * - CSS class activation: .auto-play, .loop, .no-loop, .have-arrows
 * - Data attribute customization: data-carousel-* attributes
 * - Items per slide: .carousel-2-items, .carousel-3-items, .carousel-4-items
 * - Conflict resolution: Priority-based class handling
 * - Automatic initialization on DOM ready
 * - Responsive and accessible
 * 
 * @author TTN Theme
 * @version 2.0.0
 */

import { CarouselManager } from './carousel/carousel-manager.js';

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