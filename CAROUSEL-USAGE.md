# Embla Carousel Integration

This document explains how to use the Embla Carousel integration in the TTN WordPress theme.

## Overview

The carousel module automatically initializes Embla Carousel for elements with the `.block-carousel` class. It detects `.kt-row-column-wrap` containers and treats each `.wp-block-kadence-column` child as an individual slide.

## HTML Structure

The carousel expects the following HTML structure:

```html
<div class="block-carousel">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">
      <!-- Slide 1 content -->
    </div>
    <div class="wp-block-kadence-column">
      <!-- Slide 2 content -->
    </div>
    <div class="wp-block-kadence-column">
      <!-- Slide 3 content -->
    </div>
  </div>
</div>
```

## Automatic Initialization

The carousel automatically initializes when the page loads. No additional JavaScript is required.

## Customization Options

You can customize carousel behavior using CSS classes and data attributes:

### CSS Classes (Recommended)

```html
<!-- Enable autoplay -->
<div class="block-carousel auto-play">
  <!-- carousel content -->
</div>

<!-- Force loop (overrides default) -->
<div class="block-carousel loop">
  <!-- carousel content -->
</div>

<!-- Disable loop -->
<div class="block-carousel no-loop">
  <!-- carousel content -->
</div>

<!-- Combine features -->
<div class="block-carousel auto-play loop">
  <!-- carousel content -->
</div>
```

### Data Attributes (Advanced)

```html
<div class="block-carousel" 
     data-carousel-loop="false"
     data-carousel-draggable="true"
     data-carousel-align="center"
     data-carousel-autoplay="5000">
  <!-- carousel content -->
</div>
```

### Available Options

**CSS Classes:**
- `.auto-play`: Enable autoplay with 4-second delay
- `.loop`: Force enable infinite loop
- `.no-loop`: Disable infinite loop
- `.have-arrows`: Display arrow navigation controls
- `.carousel-2-items`: Display 2 items per slide (desktop)
- `.carousel-3-items`: Display 3 items per slide (desktop)
- `.carousel-4-items`: Display 4 items per slide (desktop)
- `.carousel-sm-2-items`: Display 2 items per slide (mobile)
- `.carousel-sm-3-items`: Display 3 items per slide (mobile)
- `.carousel-sm-4-items`: Display 4 items per slide (mobile)

**Important:** Only use ONE items-per-slide class for desktop and ONE for mobile. If multiple classes are detected, the system uses priority: `.carousel-4-items` > `.carousel-3-items` > `.carousel-2-items` (higher number wins). Conflicting classes will be automatically removed with a console warning.

**Data Attributes:**
- `data-carousel-loop`: Enable/disable infinite loop (overrides classes)
- `data-carousel-draggable`: Enable/disable drag functionality (default: true)
- `data-carousel-align`: Slide alignment - 'start', 'center', 'end' (default: 'start')
- `data-carousel-autoplay`: Autoplay delay in milliseconds (overrides .auto-play class)
- `data-gap`: Gap spacing - 'none', 'sm', 'lg', 'xl' (default: 1rem)

## Navigation Controls

Add navigation buttons to your carousel:

```html
<div class="block-carousel">
  <button data-carousel-prev>Previous</button>
  <button data-carousel-next>Next</button>
  
  <div class="kt-row-column-wrap">
    <!-- slides -->
  </div>
</div>
```

## JavaScript API

### Manual Control

```javascript
import { init, destroy, getInstance, getAllInstances } from './assets/js/carousel.js';

// Initialize all carousels
init();

// Destroy all carousels
destroy();

// Get specific carousel instance
const carousel = getInstance('carousel-1');

// Get all carousel instances
const allCarousels = getAllInstances();
```

### Programmatic Control

```javascript
// Get carousel instance
const carousel = getInstance('carousel-1');

if (carousel) {
  const embla = carousel.embla;
  
  // Scroll to next slide
  embla.scrollNext();
  
  // Scroll to previous slide
  embla.scrollPrev();
  
  // Scroll to specific slide
  embla.scrollTo(2);
  
  // Get current slide index
  const currentIndex = embla.selectedScrollSnap();
  
  // Get total number of slides
  const totalSlides = embla.slideNodes().length;
}
```

## CSS Customization

### CSS Custom Properties

The carousel uses CSS custom properties for easy customization:

```css
.block-carousel .embla {
  --slide-size: 100%;        /* Width of each slide (default: 100%) */
  --slide-spacing: 1rem;     /* Gap between slides (default: 1rem on desktop, 0.5rem on mobile) */
}
```

### Basic Styling

You can override the default styles:

```css
/* Custom carousel container */
.block-carousel {
  margin: 2rem 0;
}

/* Custom slide width for 2.5 items visible */
.custom-carousel .embla {
  --slide-size: 40%;
}

/* Custom spacing */
.custom-carousel .embla {
  --slide-spacing: 2rem;
}

/* Custom navigation buttons */
[data-carousel-prev],
[data-carousel-next] {
  background: #your-color;
  border-color: #your-border-color;
}
```

### Responsive Design (Mobile-First)

The carousel uses a mobile-first approach with CSS custom properties:

```css
/* Mobile: 1 item per slide (default) */
.block-carousel .embla {
  --slide-size: 100%;
  --slide-spacing: 0.5rem;
}

/* Desktop: Customize via classes */
@media (min-width: 769px) {
  .block-carousel .embla {
    --slide-spacing: 1rem;
  }
  
  .carousel-3-items .embla {
    --slide-size: calc(100% / 3);
  }
}

/* Custom responsive behavior */
@media (max-width: 768px) {
  [data-carousel-prev],
  [data-carousel-next] {
    width: 32px;
    height: 32px;
  }
}
```

## Accessibility Features

The carousel includes several accessibility features:

- **Keyboard Navigation**: Arrow keys for slide navigation
- **ARIA Attributes**: Proper ARIA labels and states
- **Focus Management**: Proper focus handling
- **Screen Reader Support**: Semantic HTML structure

## Troubleshooting

### Common Issues

1. **Carousel not initializing**: Check that the HTML structure is correct and includes the required classes.

2. **Slides not displaying**: Ensure the `.kt-row-column-wrap` container exists and contains `.wp-block-kadence-column` elements.

3. **JavaScript errors**: Check the browser console for any JavaScript errors and ensure all dependencies are loaded.

4. **Multiple items-per-slide classes**: If you see a warning about multiple classes (e.g., `.carousel-2-items .carousel-3-items` on the same element), the system will:
   - Use the highest number class (priority: 4 > 3 > 2)
   - Automatically remove conflicting classes
   - Log a warning in the console
   - Example: `.carousel-2-items .carousel-3-items` → keeps `.carousel-3-items`, removes `.carousel-2-items`

### Debug Mode

Enable debug logging by opening the browser console. The carousel will log:
- Initialization status
- Multiple class conflicts and resolution
- Which class was kept vs removed
- Any errors during setup

## Browser Support

The carousel works in all modern browsers that support:
- ES6 modules
- CSS Grid/Flexbox
- Touch events (for mobile)

## Performance

The carousel is optimized for performance:
- Lazy initialization
- Efficient DOM manipulation
- Minimal CSS footprint
- Touch-optimized interactions

## Examples

### Basic Carousel

```html
<div class="block-carousel">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">
      <h3>Slide 1</h3>
      <p>Content for slide 1</p>
    </div>
    <div class="wp-block-kadence-column">
      <h3>Slide 2</h3>
      <p>Content for slide 2</p>
    </div>
  </div>
</div>
```

### Carousel with Autoplay

```html
<div class="block-carousel auto-play">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">
      <img src="image1.jpg" alt="Image 1">
    </div>
    <div class="wp-block-kadence-column">
      <img src="image2.jpg" alt="Image 2">
    </div>
  </div>
</div>
```

### Carousel with Arrow Controls

```html
<div class="block-carousel have-arrows">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">Slide 1</div>
    <div class="wp-block-kadence-column">Slide 2</div>
    <div class="wp-block-kadence-column">Slide 3</div>
  </div>
</div>
```

### Carousel with Navigation

```html
<div class="block-carousel">
  <button data-carousel-prev>← Previous</button>
  <button data-carousel-next>Next →</button>
  
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">
      <img src="image1.jpg" alt="Image 1">
    </div>
    <div class="wp-block-kadence-column">
      <img src="image2.jpg" alt="Image 2">
    </div>
  </div>
</div>
```

### Advanced Carousel with Classes

```html
<div class="block-carousel auto-play loop have-arrows">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">
      <h3>Auto-playing Slide 1</h3>
      <p>This carousel has autoplay, loop, and arrow controls enabled.</p>
    </div>
    <div class="wp-block-kadence-column">
      <h3>Auto-playing Slide 2</h3>
      <p>It will automatically advance every 4 seconds.</p>
    </div>
  </div>
</div>
```

### Carousel with Multiple Items Per Slide

```html
<!-- 3 items per slide on desktop, 2 on mobile, with arrow controls -->
<div class="block-carousel carousel-3-items carousel-sm-2-items have-arrows">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">Item 1</div>
    <div class="wp-block-kadence-column">Item 2</div>
    <div class="wp-block-kadence-column">Item 3</div>
    <div class="wp-block-kadence-column">Item 4</div>
    <div class="wp-block-kadence-column">Item 5</div>
    <div class="wp-block-kadence-column">Item 6</div>
  </div>
</div>
```

### Responsive Carousel with Different Mobile Layout

```html
<!-- 4 items on desktop, 1 item on mobile -->
<div class="block-carousel carousel-4-items carousel-sm-1-items">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">Product 1</div>
    <div class="wp-block-kadence-column">Product 2</div>
    <div class="wp-block-kadence-column">Product 3</div>
    <div class="wp-block-kadence-column">Product 4</div>
  </div>
</div>
```

### Customized Carousel with Data Attributes

```html
<div class="block-carousel" 
     data-carousel-loop="false"
     data-carousel-align="center"
     data-carousel-autoplay="3000"
     data-gap="lg">
  <div class="kt-row-column-wrap">
    <!-- slides -->
  </div>
</div>
```

### Carousel with Custom Gap Spacing

```html
<!-- No gap between items -->
<div class="block-carousel carousel-3-items" data-gap="none">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">Item 1</div>
    <div class="wp-block-kadence-column">Item 2</div>
    <div class="wp-block-kadence-column">Item 3</div>
  </div>
</div>

<!-- Large gap between items -->
<div class="block-carousel carousel-2-items" data-gap="xl">
  <div class="kt-row-column-wrap">
    <div class="wp-block-kadence-column">Item 1</div>
    <div class="wp-block-kadence-column">Item 2</div>
  </div>
</div>
```
