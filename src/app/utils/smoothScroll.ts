/**
 * Smoothly scrolls to an element on the page
 * @param id - The ID of the element to scroll to (with or without # prefix)
 * @param offset - Optional pixel offset from the top of the element
 * @param behavior - Scroll behavior ('smooth' or 'auto')
 */
export const smoothScrollTo = (
    id: string,
    options?: {
        offset?: number;
        behavior?: ScrollBehavior;
    }
): void => {
    // Return early if running on server-side
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return;
    }

    const { offset = 0, behavior = 'smooth' } = options || {};

    try {
        // Remove # if present
        const elementId = id.startsWith('#') ? id.substring(1) : id;

        if (!elementId) {
            console.warn('No element ID provided for smooth scrolling');
            return;
        }

        const element = document.getElementById(elementId);

        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: behavior
            });
        } else {
            console.warn(`Element with ID "${elementId}" not found for smooth scrolling`);
        }
    } catch (error) {
        console.error('Error during smooth scrolling:', error);
    }
};

/**
 * Alternative implementation using scrollIntoView with polyfill options
 */
export const smoothScrollToElement = (
    element: HTMLElement,
    options?: {
        offset?: number;
        behavior?: ScrollBehavior;
        block?: ScrollLogicalPosition;
        inline?: ScrollLogicalPosition;
    }
): void => {
    if (typeof window === 'undefined' || !element) return;

    const {
        offset = 0,
        behavior = 'smooth',
        block = 'start',
        inline = 'nearest'
    } = options || {};

    try {
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        // Modern browsers support scrollBehavior in scrollTo
        if ('scrollBehavior' in document.documentElement.style) {
            window.scrollTo({
                top: offsetPosition,
                behavior
            });
        }
        // Fallback for older browsers
        else {
            element.scrollIntoView({
                block,
                inline,
                // @ts-ignore - legacy behavior option
                behavior: behavior === 'smooth' ? 'smooth' : 'auto'
            });
        }
    } catch (error) {
        console.error('Error during element scrolling:', error);
    }
};
