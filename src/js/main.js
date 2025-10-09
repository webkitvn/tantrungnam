const headerHeight = document.querySelector('#masthead').offsetHeight;
document.querySelector('html').style.setProperty('--header-height', headerHeight + 'px');


/* ==========================================================================
   CWP Section Navigation
   Desktop-only navigation for page sections with improved error handling
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    /* Configuration */
    const cwpNavConfig = {
        mobileBreakpoint: 768,
        scrollOffset: '30%',
        navContainer: '.page-nav',
        sectionSelector: '.page-section',
        activeClass: 'active'
    };

    /* Mobile Detection - Disable navigation on mobile */
    const cwpIsMobile = () => {
        return window.innerWidth <= cwpNavConfig.mobileBreakpoint;
    };

    /* Human-readable label generation */
    const cwpGenerateLabel = (sectionID) => {
        if (!sectionID) return '';
        
        /* Convert kebab-case to readable format */
        return sectionID
            .replace(/-/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .trim();
    };

    /* Debounce function for performance */
    const cwpDebounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    /* Validate dependencies */
    const cwpValidateDependencies = () => {
        /* Check if Waypoints library is loaded */
        if (typeof window.Waypoint === 'undefined') {
            console.warn('CWP Navigation: Waypoints library not found. Navigation will not work.');
            return false;
        }
        
        /* Check if navigation container exists */
        if (!document.querySelector(cwpNavConfig.navContainer)) {
            console.warn('CWP Navigation: Navigation container not found.');
            return false;
        }
        
        /* Check if sections exist */
        if (document.querySelectorAll(cwpNavConfig.sectionSelector).length === 0) {
            console.warn('CWP Navigation: No sections found.');
            return false;
        }
        
        return true;
    };

    /* Initialize navigation */
    const cwpInitNavigation = () => {
        /* Mobile check - disable on mobile */
        if (cwpIsMobile()) {
            console.log('CWP Navigation: Disabled on mobile for UI optimization.');
            return;
        }
        
        /* Validate dependencies */
        if (!cwpValidateDependencies()) {
            return;
        }
        
        const navContainer = document.querySelector(cwpNavConfig.navContainer);
        const sections = document.querySelectorAll(cwpNavConfig.sectionSelector);
        
        /* Clear existing navigation */
        navContainer.innerHTML = '';
        
        /* Build navigation from sections */
        sections.forEach((section) => {
            const sectionID = section.getAttribute('id');
            
            /* Skip sections without ID */
            if (!sectionID) {
                console.warn('CWP Navigation: Section without ID found, skipping.');
                return;
            }
            
            /* Generate human-readable label */
            const label = cwpGenerateLabel(sectionID);
            
            /* Create navigation link with accessibility attributes */
            const navItem = document.createElement('li');
            navItem.setAttribute('data-menuanchor', sectionID);
            navItem.setAttribute('role', 'menuitem');
            
            const navLink = document.createElement('a');
            navLink.setAttribute('href', `#${sectionID}`);
            navLink.textContent = label;
            navLink.setAttribute('aria-label', `Navigate to ${label}`);
            navLink.setAttribute('role', 'button');
            
            navItem.appendChild(navLink);
            navContainer.appendChild(navItem);
        });
        
        /* Set first navigation link as active */
        const firstNavItem = navContainer.querySelector('li:first-child');
        if (firstNavItem) {
            firstNavItem.classList.add(cwpNavConfig.activeClass);
        }
        
        /* Setup waypoints with improved logic */
        sections.forEach((section) => {
            new Waypoint({
                element: section,
                handler: function(direction) {
                    const currentSection = this.element;
                    const sectionID = currentSection.getAttribute('id');
                    const navigationLink = navContainer.querySelector(`li[data-menuanchor="${sectionID}"]`);
                    
                    /* Remove active class from all navigation links */
                    navContainer.querySelectorAll('li').forEach((item) => {
                        item.classList.remove(cwpNavConfig.activeClass);
                    });
                    
                    if (direction === 'down') {
                        /* Scrolling down - activate current section */
                        if (navigationLink) {
                            navigationLink.classList.add(cwpNavConfig.activeClass);
                        }
                    } else {
                        /* Scrolling up - activate previous section */
                        const allSections = Array.from(document.querySelectorAll(cwpNavConfig.sectionSelector));
                        const currentIndex = allSections.indexOf(currentSection);
                        
                        if (currentIndex > 0) {
                            const prevSection = allSections[currentIndex - 1];
                            const prevSectionID = prevSection.getAttribute('id');
                            const prevNavigationLink = navContainer.querySelector(`li[data-menuanchor="${prevSectionID}"]`);
                            if (prevNavigationLink) {
                                prevNavigationLink.classList.add(cwpNavConfig.activeClass);
                            }
                        } else {
                            /* If no previous section, activate first one */
                            const firstItem = navContainer.querySelector('li:first-child');
                            if (firstItem) {
                                firstItem.classList.add(cwpNavConfig.activeClass);
                            }
                        }
                    }
                },
                offset: cwpNavConfig.scrollOffset
            });
        });
        
        /* Add keyboard navigation support */
        cwpAddKeyboardNavigation(navContainer);
        
        console.log('CWP Navigation: Initialized successfully.');
    };

    /* Keyboard navigation support */
    const cwpAddKeyboardNavigation = (navContainer) => {
        const navLinks = navContainer.querySelectorAll('a');
        
        navLinks.forEach((link) => {
            link.addEventListener('keydown', (e) => {
                const currentLink = e.target;
                const currentItem = currentLink.parentElement;
                const allItems = Array.from(navContainer.querySelectorAll('li'));
                const currentIndex = allItems.indexOf(currentItem);
                
                switch(e.which) {
                    case 38: /* Up arrow */
                        e.preventDefault();
                        if (currentIndex > 0) {
                            const prevLink = allItems[currentIndex - 1].querySelector('a');
                            if (prevLink) prevLink.focus();
                        }
                        break;
                    case 40: /* Down arrow */
                        e.preventDefault();
                        if (currentIndex < allItems.length - 1) {
                            const nextLink = allItems[currentIndex + 1].querySelector('a');
                            if (nextLink) nextLink.focus();
                        }
                        break;
                    case 13: /* Enter */
                    case 32: /* Space */
                        e.preventDefault();
                        currentLink.click();
                        break;
                }
            });
        });
    };

    /* Handle window resize with debounce */
    const cwpHandleResize = cwpDebounce(() => {
        const navContainer = document.querySelector(cwpNavConfig.navContainer);
        if (!navContainer) return;
        
        if (cwpIsMobile()) {
            /* Clear navigation on mobile */
            navContainer.innerHTML = '';
        } else {
            /* Reinitialize on desktop */
            cwpInitNavigation();
        }
    }, 250);

    /* Initialize on load */
    cwpInitNavigation();

    /* Handle window resize */
    window.addEventListener('resize', cwpHandleResize);
});
